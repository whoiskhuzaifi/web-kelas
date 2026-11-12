import { createClient } from '@supabase/supabase-js';
import { env, isConfigured } from '../config/env';

// Jika env belum diisi, main.jsx menampilkan layar konfigurasi dan tidak memuat aplikasi,
// sehingga `supabase` bernilai null hanya pada kondisi yang tidak pernah dipakai.
export const supabase = isConfigured
  ? createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
    })
  : null;
