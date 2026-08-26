/**
 * One-off utility: confirm a user's email via service role.
 * Usage: npx tsx scripts/confirm-user.ts <email>
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

const email = process.argv[2];
if (!email) {
  console.error('Usage: npx tsx scripts/confirm-user.ts <email>');
  process.exit(1);
}

const admin = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const { data: list, error } = await admin.auth.admin.listUsers({ perPage: 500 });
if (error) throw error;
const user = (list?.users as Array<{ id: string; email?: string }> | undefined)
  ?.find(u => u.email?.toLowerCase() === email.toLowerCase());

if (!user) {
  console.error('User not found:', email);
  process.exit(1);
}

const { error: updErr } = await admin.auth.admin.updateUserById(user.id, {
  email_confirm: true
});
if (updErr) throw updErr;
console.log('Confirmed:', email);
