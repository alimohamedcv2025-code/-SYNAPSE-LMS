/**
 * Reassign materials to a keeper user, then delete leftover admins.
 * Usage: npx tsx scripts/reassign-and-delete.ts
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

const KEEP = 'ali.mohamed.cv2025@gmail.com';
const TO_DELETE = ['elena.rostova@college.edu', 'marcus.vance@college.edu'];

const db = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function main() {
  const { data: list } = await db.auth.admin.listUsers({ perPage: 500 });
  const users = (list?.users as Array<{ id: string; email?: string }> | undefined) || [];
  const keeper = users.find(u => u.email?.toLowerCase() === KEEP.toLowerCase());
  if (!keeper) throw new Error('Keeper not found');

  for (const email of TO_DELETE) {
    const u = users.find(x => x.email?.toLowerCase() === email.toLowerCase());
    if (!u) { console.log('Not found:', email); continue; }

    const { error: me } = await db.from('materials').update({ created_by: keeper.id }).eq('created_by', u.id);
    console.log(me ? `reassign FAIL: ${me.message}` : `materials reassigned (${email})`);

    const { error: pe } = await db.from('profiles').delete().eq('id', u.id);
    console.log(pe ? `profile FAIL: ${pe.message}` : `profile deleted: ${email}`);

    if (!pe) {
      const { error: ae } = await db.auth.admin.deleteUser(u.id);
      console.log(ae ? `auth FAIL ${email}: ${ae.message}` : `auth deleted: ${email}`);
    }
  }

  // Final state
  const { data: finalList } = await db.auth.admin.listUsers({ perPage: 500 });
  console.log('\n=== REMAINING ===');
  for (const u of (finalList?.users as Array<{ id: string; email?: string }> | undefined) || []) {
    console.log('-', u.email);
  }
}

main().catch(e => { console.error(e.message); process.exit(1); });
