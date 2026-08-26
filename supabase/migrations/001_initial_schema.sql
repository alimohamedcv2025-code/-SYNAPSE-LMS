-- ============================================================
-- SYNAPSE - College Learning Platform
-- Initial Schema + RLS Policies
-- Run this in Supabase SQL Editor (or via supabase db push)
-- ============================================================

-- ============ ENUM TYPES ============
create type user_role as enum ('student', 'admin', 'super_admin');
create type admin_scope as enum ('level_2', 'level_3', 'level_4', 'summer', 'case', 'all');
create type academic_level as enum ('level_2', 'level_3', 'level_4', 'summer', 'case');
create type department as enum ('AI', 'CS', 'IS');
create type material_type as enum ('video', 'pdf', 'exam', 'summary', 'book', 'other');
create type question_status as enum ('pending', 'answered', 'closed');
create type notification_type as enum ('material', 'answer', 'system', 'academic');

-- ============ PROFILES (extends auth.users) ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null default '',
  phone text,
  role user_role not null default 'student',
  admin_scope admin_scope,
  is_active boolean not null default true,
  -- Academic profile (students only)
  level academic_level,
  dept department,
  semester smallint check (semester between 1 and 2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'student'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ SUBJECTS ============
create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text not null default '',
  credits smallint not null default 3,
  icon_name text,
  primary_level academic_level not null,
  dept department,
  semester smallint check (semester between 1 and 2),
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- ============ ENROLLMENTS (student <-> subject) ============
create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, subject_id)
);

-- ============ MATERIALS ============
create table public.materials (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  type material_type not null,
  url text not null check (url ~* '^https?://'),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  target_level academic_level not null,
  dept department,
  semester smallint check (semester between 1 and 2),
  is_published boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  duration_or_pages text,
  provider text,
  view_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============ QUESTIONS ============
create table public.questions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  title text not null,
  content text not null,
  status question_status not null default 'pending',
  target_level academic_level not null,
  dept department,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-fill level/dept from the subject on insert
create or replace function public.set_question_level()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  s public.subjects;
begin
  select * into s from public.subjects where id = new.subject_id;
  new.target_level := s.primary_level;
  new.dept := s.dept;
  return new;
end;
$$;

create trigger trg_questions_set_level
  before insert on public.questions
  for each row execute function public.set_question_level();

create table public.answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  content text not null,
  created_at timestamptz not null default now()
);

-- ============ NOTIFICATIONS (per user) ============
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  type notification_type not null,
  read boolean not null default false,
  link_url text,
  created_at timestamptz not null default now()
);

create index idx_enrollments_user on public.enrollments(user_id);
create index idx_materials_subject on public.materials(subject_id);
create index idx_questions_subject on public.questions(subject_id);
create index idx_answers_question on public.answers(question_id);
create index idx_notifications_user on public.notifications(user_id);

-- ============================================================
-- PERMISSION HELPER FUNCTIONS
-- ============================================================

-- Get current user's profile row
create or replace function public.current_role()
returns user_role
language sql stable security definer set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.current_scope()
returns admin_scope
language sql stable security definer set search_path = public
as $$
  select admin_scope from public.profiles where id = auth.uid();
$$;

-- Core RBAC: can the caller administer content at a given academic level?
create or replace function public.can_administer(target_level academic_level)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.is_active
      and (
        p.role = 'super_admin'
        or (p.role = 'admin' and (p.admin_scope = 'all' or p.admin_scope::text = target_level::text))
      )
  );
$$;

-- Is caller an active staff member (admin or super_admin)?
create or replace function public.is_staff()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.is_active and p.role in ('admin', 'super_admin')
  );
$$;

-- Notify all students enrolled in a subject's level (+ optional dept)
create or replace function public.notify_subject_audience(
  p_subject_id uuid,
  p_title text,
  p_message text,
  p_type notification_type,
  p_link_url text
)
returns void
language plpgsql security definer set search_path = public
as $$
declare
  v_level academic_level;
  v_dept department;
begin
  select primary_level, dept into v_level, v_dept from public.subjects where id = p_subject_id;

  insert into public.notifications (user_id, title, message, type, link_url)
  select p.id, p_title, p_message, p_type, p_link_url
  from public.profiles p
  where p.role = 'student'
    and p.is_active
    and p.level = v_level
    and (p.level in ('summer', 'case') or p.dept is not distinct from v_dept);
end;
$$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.enrollments enable row level security;
alter table public.materials enable row level security;
alter table public.questions enable row level security;
alter table public.answers enable row level security;
alter table public.notifications enable row level security;

---------- PROFILES ----------
-- Everyone logged-in can see profiles of students/staff (needed for names in Q&A lists)
create policy "profiles_read_authenticated"
  on public.profiles for select to authenticated using (true);

-- Users update their own profile (cannot change own role/scope/is_active)
create policy "profiles_update_own_limited"
  on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and role = (select p.role from public.profiles p where p.id = auth.uid())
    and admin_scope is not distinct from (select p.admin_scope from public.profiles p where p.id = auth.uid())
    and is_active = (select p.is_active from public.profiles p where p.id = auth.uid())
  );

-- Super admin manages everything; admins can update students within scope (not roles)
create policy "profiles_admin_update"
  on public.profiles for update to authenticated
  using (public.can_administer(level))
  with check (true);

create policy "profiles_superadmin_all"
  on public.profiles for update to authenticated
  using (public.current_role() = 'super_admin')
  with check (true);

---------- SUBJECTS ----------
create policy "subjects_read_all"
  on public.subjects for select to authenticated using (true);

create policy "subjects_insert_scoped"
  on public.subjects for insert to authenticated
  with check (public.can_administer(primary_level));

create policy "subjects_update_scoped"
  on public.subjects for update to authenticated
  using (public.can_administer(primary_level))
  with check (public.can_administer(primary_level));

create policy "subjects_delete_scoped"
  on public.subjects for delete to authenticated
  using (public.can_administer(primary_level));

---------- ENROLLMENTS ----------
create policy "enrollments_read_own_or_staff"
  on public.enrollments for select to authenticated
  using (
    user_id = auth.uid()
    or public.is_staff()
    or exists (
      select 1 from public.profiles p
      where p.id = user_id and public.can_administer(p.level)
    )
  );

create policy "enrollments_write_own"
  on public.enrollments for all to authenticated
  using (user_id = auth.uid())
  with check (
    user_id = auth.uid()
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'student' and is_active)
  );

create policy "enrollments_admin_write"
  on public.enrollments for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

---------- MATERIALS ----------
-- Published materials visible to all; drafts only to scoped staff
create policy "materials_read"
  on public.materials for select to authenticated
  using (
    is_published
    or public.can_administer(target_level)
  );

create policy "materials_insert_scoped"
  on public.materials for insert to authenticated
  with check (
    created_by = auth.uid()
    and public.is_staff()
    and public.can_administer(target_level)
  );

create policy "materials_update_scoped"
  on public.materials for update to authenticated
  using (public.can_administer(target_level))
  with check (public.can_administer(target_level));

create policy "materials_delete_scoped"
  on public.materials for delete to authenticated
  using (public.can_administer(target_level));

-- Anyone (including students) can increment view count via RPC only
create or replace function public.increment_material_view(p_material_id uuid)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  update public.materials
  set view_count = view_count + 1
  where id = p_material_id;
end;
$$;

revoke execute on function public.increment_material_view(uuid) from anon;
grant execute on function public.increment_material_view(uuid) to authenticated;

---------- QUESTIONS ----------
create policy "questions_read_all"
  on public.questions for select to authenticated using (true);

create policy "questions_insert_own"
  on public.questions for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (select 1 from public.profiles where id = auth.uid() and is_active)
  );

create policy "questions_update_scoped"
  on public.questions for update to authenticated
  using (public.can_administer(target_level))
  with check (public.can_administer(target_level));

create policy "questions_delete_own_or_scoped"
  on public.questions for delete to authenticated
  using (
    user_id = auth.uid()
    or public.can_administer(target_level)
  );

---------- ANSWERS ----------
create policy "answers_read_all"
  on public.answers for select to authenticated using (true);

create policy "answers_insert_staff_scoped"
  on public.answers for insert to authenticated
  with check (
    author_id = auth.uid()
    and public.is_staff()
    and public.can_administer(
      (select q.target_level from public.questions q where q.id = question_id)
    )
  );

create policy "answers_update_author"
  on public.answers for update to authenticated
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

create policy "answers_delete_author_or_scoped"
  on public.answers for delete to authenticated
  using (
    author_id = auth.uid()
    or public.is_staff()
  );

---------- NOTIFICATIONS ----------
create policy "notifications_read_own"
  on public.notifications for select to authenticated
  using (user_id = auth.uid());

create policy "notifications_update_own"
  on public.notifications for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "notifications_delete_own"
  on public.notifications for delete to authenticated
  using (user_id = auth.uid());

-- ============================================================
-- GRANTS
-- ============================================================
grant usage on schema public to authenticated;
grant all on all tables in schema public to authenticated;
