import { Settings } from 'lucide-react';

// Ditampilkan oleh main.jsx jika VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY belum diisi.
export default function MissingConfig() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="card max-w-lg">
        <Settings className="mb-3 h-8 w-8 text-amber-500" aria-hidden="true" />
        <h1 className="text-lg font-semibold">Konfigurasi Supabase belum diisi</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Salin <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">.env.example</code> menjadi{' '}
          <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">.env.local</code>, isi{' '}
          <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">VITE_SUPABASE_URL</code> dan{' '}
          <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">VITE_SUPABASE_ANON_KEY</code> dari Supabase
          Dashboard, lalu jalankan ulang server pengembangan.
        </p>
      </div>
    </div>
  );
}
