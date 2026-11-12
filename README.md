# ClassPortal (rebuild) — Tahap 2: fondasi

Platform manajemen kelas digital untuk **satu kelas**. Stack: React 19 + Vite + JavaScript/JSX, Tailwind CSS v4,
React Router, TanStack Query, Zod, react-hook-form, Supabase (Auth + PostgreSQL + RLS).

## Menjalankan

1. `npm install`
2. Salin `.env.example` menjadi `.env.local`, isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`
   (Supabase Dashboard -> Project Settings -> API). Jangan pernah memakai kunci `service_role` di sini.
3. Jalankan `supabase/migrations/0001_auth_profiles.sql` di SQL Editor, lalu ikuti langkah manual di bagian bawah berkas itu
   (matikan signup publik, atur Redirect URL, jadikan admin pertama).
4. `npm run dev`, buka http://localhost:5173

## Isi Tahap 2

- Login, logout (dengan konfirmasi), lupa password, reset password, ubah password, edit profil (nama, NIM).
- Guard rute berdasarkan sesi; komponen `RequireRole` untuk rute khusus peran (dipakai mulai Tahap 4).
- Akun nonaktif otomatis dikeluarkan dan ditolak oleh RLS.
- Layout responsif (sidebar desktop, drawer mobile), mode terang/gelap/ikuti sistem, toast, dialog konfirmasi.
- Menu modul yang belum dibuat tampil nonaktif dengan label "Segera".

Belum ada (sesuai roadmap): foto profil (butuh Storage, Tahap 3), seluruh modul data kelas (Tahap 4–5).
