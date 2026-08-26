/**
 * Cleanup demo accounts + promote a user to super_admin with a new strong password.
 * Usage: npx tsx scripts/cleanup-demo.ts <email> <newPassword>
 */
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

function loadEnv() {
  try {
    const content = readFileSync('.env.local', 'utf-8');
    for (const line of content.split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  } catch { /* noop */ }
}
loadEnv();

const KEEP_EMAIL = process.argv[2];
const NEW_PASSWORD = process.argv[3];

if (!KEEP_EMAIL || !NEW_PASSWORD) {
  console.error('Usage: npx tsx scripts/cleanup-demo.ts <keep-email> <new-password>');
  process.exit(1);
}

const DEMO_EMAILS = [
  'ahmed.mansoor@college.edu',
  'sarah.jenkins@college.edu',
  'm.chang@college.edu',
  'marcus.vance@college.edu',
  'elena.rostova@college.edu',
  'tariq.zaid@college.edu',
  'dean.pendelton@college.edu'
];

const admin = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function main() {
  const { data: list, error } = await admin.auth.admin.listUsers({ perPage: 500 });
  if (error) throw error;
  const users = (list?.users as Array<{ id: string; email?: string }> | undefined) || [];

  // ---------- 1. Delete demo accounts ----------
  for (const u of users) {
    if (!u.email) continue;
    if (!DEMO_EMAILS.includes(u.email.toLowerCase())) continue;

    await admin.from('enrollments').delete().eq('user_id', u.id);
    await admin.from('notifications').delete().eq('user_id', u.id);
    // Questions/answers by demo users: keep but they'll show "Unknown" author...
    // Better: delete them since they are demo content too
    await admin.from('answers').delete().eq('author_id', u.id);
    await admin.from('questions').delete().eq('user_id', u.id);

    const { error: profErr } = await admin.from('profiles').delete().eq('id', u.id);
    if (profErr && profErr.code !== 'PGRST116') console.log(`profile del warn: ${profErr.message}`);

    const { error: authErr } = await admin.auth.admin.deleteUser(u.id);
    console.log(authErr ? `FAIL ${u.email}: ${authErr.message}` : `Deleted: ${u.email}`);
  }

  // ---------- 2. Promote keeper ----------
  const keeper = users.find(u => u.email?.toLowerCase() === KEEP_EMAIL.toLowerCase());
  if (!keeper) {
    console.error('\nKeeper account not found:', KEEP_EMAIL);
    process.exit(1);
  }

  const { error: pwdErr } = await admin.auth.admin.updateUserById(keeper.id, {
    password: NEW_PASSWORD,
    email_confirm: true
  });
  if (pwdErr) throw pwdErr;

  const { error: profErr } = await admin.from('profiles')
    .update({ role: 'super_admin', admin_scope: 'all', is_active: true })
    .eq('id', keeper.id);
  if (profErr) throw profErr;

  console.log(`\nPromoted ${KEEP_EMAIL} -> super_admin (password updated)`);

  // ---------- 3. Final state ----------
  const { data: finalList } = await admin.auth.admin.listUsers({ perPage: 500 });
  console.log('\n=== REMAINING ACCOUNTS ===');
  for (const u of (finalList?.users as Array<{ id: string; email?: string }> | undefined) || []) {
    console.log('-', u.email);
  }
}

main().catch(e => { console.error(e.message); process.exit(1); });
