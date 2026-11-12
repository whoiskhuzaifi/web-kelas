// Menerjemahkan error Supabase/jaringan ke pesan Bahasa Indonesia yang aman ditampilkan.
export function getErrorMessage(err, fallback = 'Terjadi kesalahan. Silakan coba lagi.') {
  const msg = String(err?.message ?? '').toLowerCase();
  if (err?.name === 'AuthRetryableFetchError' || msg.includes('failed to fetch') || msg.includes('network')) {
    return 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
  }
  if (err?.status === 429 || msg.includes('rate limit') || msg.includes('too many')) {
    return 'Terlalu banyak percobaan. Coba lagi beberapa saat lagi.';
  }
  if (err?.code === '42501' || msg.includes('row-level security')) {
    return 'Anda tidak memiliki izin untuk melakukan tindakan ini.';
  }
  return fallback;
}

export function translateAuthError(err) {
  const msg = String(err?.message ?? '').toLowerCase();
  if (msg.includes('invalid login credentials')) return 'Email atau password salah.';
  if (msg.includes('email not confirmed')) return 'Email belum diverifikasi. Cek kotak masuk Anda.';
  if (msg.includes('banned')) return 'Akun ini dinonaktifkan. Hubungi pengurus kelas.';
  if (msg.includes('same password') || msg.includes('different from the old')) {
    return 'Password baru harus berbeda dari password lama.';
  }
  if (msg.includes('weak') || msg.includes('password should')) {
    return 'Password terlalu lemah. Gunakan kombinasi huruf dan angka yang lebih panjang.';
  }
  return getErrorMessage(err, 'Permintaan gagal. Silakan coba lagi.');
}
