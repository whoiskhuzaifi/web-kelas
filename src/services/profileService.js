import { supabase } from '../lib/supabaseClient';
import { getErrorMessage } from '../utils/errors';

const COLUMNS = 'id, name, nim, role, is_active';

export async function getMyProfile(userId) {
  const { data, error } = await supabase.from('profiles').select(COLUMNS).eq('id', userId).single();
  if (error || !data) throw new Error(getErrorMessage(error, 'Profil tidak ditemukan.'), { cause: error });
  return data;
}

// Hanya `name` dan `nim` yang boleh diubah dari klien (dibatasi juga oleh GRANT kolom di database).
export async function updateMyProfile(userId, { name, nim }) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ name, nim: nim === '' ? null : nim })
    .eq('id', userId)
    .select(COLUMNS)
    .single();
  if (error || !data) throw new Error(getErrorMessage(error, 'Gagal menyimpan profil.'), { cause: error });
  return data;
}
