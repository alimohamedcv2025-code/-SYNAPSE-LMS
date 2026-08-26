-- ============================================================
-- Patch 002: allow account deletion without losing content
-- Run this in Supabase SQL Editor (existing databases only).
-- (Already included in 001_initial_schema.sql for fresh installs)
-- ============================================================

-- Materials survive when their creator's account is deleted
alter table public.materials alter column created_by drop not null;
alter table public.materials drop constraint materials_created_by_fkey;
alter table public.materials
  add constraint materials_created_by_fkey
  foreign key (created_by) references public.profiles(id)
  on delete set null;

-- Answers survive when their author's account is deleted
alter table public.answers alter column author_id drop not null;
alter table public.answers drop constraint answers_author_id_fkey;
alter table public.answers
  add constraint answers_author_id_fkey
  foreign key (author_id) references public.profiles(id)
  on delete set null;
