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

const URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const ANON = process.env.VITE_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

const admin = createClient(URL!, SERVICE!, { auth: { autoRefreshToken: false, persistSession: false } });

// 1. Auth users status
console.log('=== AUTH USERS ===');
const { data: list } = await admin.auth.admin.listUsers({ perPage: 100 });
for (const u of list?.users || []) {
  console.log(
    u.email?.padEnd(35),
    '| confirmed:', String(!!u.email_confirmed_at).padEnd(5),
    '| banned:', !!u.banned_until && u.banned_until !== '1970-01-01T00:00:00+00:00' ? 'YES' : 'no'
  );
}

// 2. Profiles
console.log('\n=== PROFILES ===');
const { data: profiles, error: pErr } = await admin.from('profiles').select('id, email, name, role, is_active');
if (pErr) console.log('profiles error:', pErr.message);
else for (const p of profiles || []) console.log(p.email.padEnd(35), '| role:', p.role.padEnd(12), '| active:', p.is_active);

// 3. Try real login per demo account (anon client)
console.log('\n=== LOGIN TESTS (anon) ===');
const demoAccounts = [
  'ahmed.mansoor@college.edu',
  'sarah.jenkins@college.edu',
  'm.chang@college.edu',
  'marcus.vance@college.edu',
  'elena.rostova@college.edu',
  'tariq.zaid@college.edu',
  'dean.pendelton@college.edu'
];
for (const email of demoAccounts) {
  const anon = createClient(URL!, ANON!);
  const { data, error } = await anon.auth.signInWithPassword({ email, password: 'password123' });
  console.log(email.padEnd(35), error ? `FAIL: ${error.status} ${error.message}` : 'OK');
}
