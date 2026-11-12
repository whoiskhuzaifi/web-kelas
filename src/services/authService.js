import { supabase } from '../lib/supabaseClient';
import { translateAuthError } from '../utils/errors';

function check(error) {
  if (error) throw new Error(translateAuthError(error), { cause: error });
}

export async function signInWithPassword({ email, password }) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  check(error);
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  // Jika request gagal (mis. offline), tetap bersihkan sesi di perangkat ini.
  if (error) await supabase.auth.signOut({ scope: 'local' });
}

export async function requestPasswordReset(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  check(error);
}

export async function updatePassword(password) {
  const { error } = await supabase.auth.updateUser({ password });
  check(error);
}

// Memastikan pengguna mengetahui password saat ini sebelum menggantinya.
export async function verifyCurrentPassword(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const msg = String(error.message ?? '').toLowerCase();
    if (msg.includes('invalid login credentials')) throw new Error('Password saat ini salah.');
    check(error);
  }
}
