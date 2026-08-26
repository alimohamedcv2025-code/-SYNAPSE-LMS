/**
 * Seed script: migrates demo data (users, subjects, materials, Q&A)
 * from src/data/mockData.ts into your Supabase project.
 *
 * Usage:
 *   1. Fill SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in .env.local
 *   2. Run: npx tsx scripts/seed.ts
 *
 * Safe to re-run: existing emails are updated instead of duplicated.
 */
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
import {
  INITIAL_USERS,
  INITIAL_SUBJECTS,
  INITIAL_MATERIALS,
  INITIAL_QUESTIONS,
  INITIAL_NOTIFICATIONS
} from '../src/data/mockData';

// ---- Load env (.env.local) ----
function loadEnv() {
  try {
    const content = readFileSync('.env.local', 'utf-8');
    for (const line of content.split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  } catch { /* no .env.local */ }
}
loadEnv();

const URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DEMO_PASSWORD = 'password123';

if (!URL || !SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const db = createClient(URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
  console.log('Seeding Supabase...\n');

  // ---------- 1. Subjects ----------
  const oldToNewSubjectId = new Map<string, string>();
  for (const s of INITIAL_SUBJECTS) {
    const row = {
      code: s.code,
      name: s.name,
      description: s.description,
      credits: s.credits,
      icon_name: s.iconName || null,
      primary_level: s.primaryLevel,
      dept: s.department || null,
      semester: s.semester || null,
      tags: s.tags
    };
    // Upsert by code
    const { data: existing } = await db.from('subjects').select('id').eq('code', s.code).maybeSingle();
    if (existing) {
      await db.from('subjects').update(row).eq('id', existing.id);
      oldToNewSubjectId.set(s.id, existing.id);
    } else {
      const { data: inserted, error } = await db.from('subjects').insert(row).select('id').single();
      if (error) throw error;
      oldToNewSubjectId.set(s.id, inserted!.id);
    }
  }
  console.log(`Subjects seeded: ${INITIAL_SUBJECTS.length}`);

  // ---------- 2. Users ----------
  const userIdByEmail = new Map<string, string>();
  for (const u of INITIAL_USERS) {
    const { data: list } = await db.auth.admin.listUsers({ perPage: 500 });
    let authId = (list?.users as Array<{ id: string; email?: string }> | undefined)
      ?.find(x => x.email?.toLowerCase() === u.email.toLowerCase())?.id;

    if (!authId) {
      const { data: created, error } = await db.auth.admin.createUser({
        email: u.email,
        password: DEMO_PASSWORD,
        email_confirm: true,
        user_metadata: { name: u.name, phone: u.phone }
      });
      if (error) throw error;
      authId = created!.user!.id;
    }

    await db.from('profiles').upsert({
      id: authId,
      email: u.email,
      name: u.name,
      phone: u.phone || null,
      role: u.role,
      admin_scope: u.adminScope || null,
      is_active: u.isActive,
      level: u.academicProfile?.level || null,
      dept: u.academicProfile?.department || null,
      semester: u.academicProfile?.semester || null
    });

    userIdByEmail.set(u.email.toLowerCase(), authId);
  }
  console.log(`Users seeded: ${INITIAL_USERS.length} (password: ${DEMO_PASSWORD})`);

  // ---------- 3. Enrollments ----------
  for (const u of INITIAL_USERS) {
    if (!u.academicProfile?.selectedSubjectIds?.length) continue;
    const uid = userIdByEmail.get(u.email.toLowerCase())!;
    await db.from('enrollments').delete().eq('user_id', uid);
    const rows = u.academicProfile.selectedSubjectIds
      .map(oldId => ({ user_id: uid, subject_id: oldToNewSubjectId.get(oldId)! }))
      .filter(r => r.subject_id);
    if (rows.length) await db.from('enrollments').insert(rows);
  }
  console.log('Enrollments seeded');

  // ---------- 4. Materials ----------
  const staff = INITIAL_USERS.filter(u => u.role !== 'student');
  const defaultAuthorId = userIdByEmail.get(staff[0].email.toLowerCase())!;
  for (const m of INITIAL_MATERIALS) {
    const authorId = userIdByEmail.get(
      INITIAL_USERS.find(x => x.id === m.createdBy.id)?.email.toLowerCase() || ''
    ) || defaultAuthorId;

    const row = {
      title: m.title,
      description: m.description,
      type: m.type,
      url: m.url,
      subject_id: oldToNewSubjectId.get(m.subjectId),
      target_level: m.targetLevel,
      dept: m.department || null,
      semester: m.semester || null,
      is_published: m.isPublished,
      created_by: authorId,
      duration_or_pages: m.durationOrPages || null,
      provider: m.provider || null,
      view_count: m.viewCount
    };
    if (!row.subject_id) continue;
    const { data: existing } = await db.from('materials').select('id').eq('title', m.title).maybeSingle();
    if (existing) {
      await db.from('materials').update(row).eq('id', existing.id);
    } else {
      const { error } = await db.from('materials').insert(row);
      if (error) throw error;
    }
  }
  console.log(`Materials seeded: ${INITIAL_MATERIALS.length}`);

  // ---------- 5. Questions & Answers ----------
  for (const q of INITIAL_QUESTIONS) {
    const askerId = userIdByEmail.get(INITIAL_USERS.find(x => x.name === q.userName)?.email.toLowerCase() || '') ||
      [...userIdByEmail.values()][0];

    const qRow = {
      user_id: askerId,
      subject_id: oldToNewSubjectId.get(q.subjectId),
      title: q.title,
      content: q.content,
      status: q.status
    };
    if (!qRow.subject_id) continue;

    const { data: existingQ } = await db.from('questions').select('id').eq('title', q.title).maybeSingle();
    let questionId: string;
    if (existingQ) {
      questionId = existingQ.id;
      await db.from('questions').update(qRow).eq('id', questionId);
      await db.from('answers').delete().eq('question_id', questionId);
    } else {
      const { data: insertedQ, error } = await db.from('questions').insert(qRow).select('id').single();
      if (error) throw error;
      questionId = insertedQ!.id;
    }

    for (const a of q.answers) {
      const authorId = userIdByEmail.get(INITIAL_USERS.find(x => x.name === a.authorName)?.email.toLowerCase() || '') || askerId;
      const { error } = await db.from('answers').insert({
        question_id: questionId,
        author_id: authorId,
        content: a.content,
        created_at: a.createdAt
      });
      if (error) throw error;
    }
  }
  console.log(`Questions seeded: ${INITIAL_QUESTIONS.length}`);

  // ---------- 6. Notifications ----------
  const studentOneId = userIdByEmail.get(INITIAL_USERS.find(u => u.role === 'student')!.email.toLowerCase())!;
  await db.from('notifications').delete().eq('user_id', studentOneId);
  for (const n of INITIAL_NOTIFICATIONS) {
    await db.from('notifications').insert({
      user_id: studentOneId,
      title: n.title,
      message: n.message,
      type: n.type,
      read: n.read,
      link_url: n.linkUrl || null,
      created_at: n.createdAt
    });
  }
  console.log('Notifications seeded');

  console.log('\nDone! Demo login password for ALL seeded accounts:', DEMO_PASSWORD);
}

main().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
