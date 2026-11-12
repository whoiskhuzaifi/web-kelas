// Semua konfigurasi dibaca dari environment Vite. Tidak ada nilai bawaan (fallback),
// agar aplikasi tidak pernah berjalan dengan kredensial placeholder atau kredensial yang tertanam di kode.
export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
};

export const isConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey);
