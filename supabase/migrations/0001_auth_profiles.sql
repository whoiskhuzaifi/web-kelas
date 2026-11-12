-- =====================================================================
-- ClassPortal — Migration 0001: autentikasi & profil (kelas tunggal)
-- Jalankan di Supabase Dashboard -> SQL Editor, atau lewat `supabase db push`.
-- Aman dijalankan ulang (idempotent).
--
-- Keputusan desain:
--   * Satu kelas saja: peran disimpan di profiles.role.
--   * profiles TIDAK menyimpan email (email hanya ada di auth.users) -> tidak bocor ke anggota lain.
--   * role & is_active tidak bisa diubah dari klien; hanya lewat SQL Editor / service_role / Edge Function.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Fungsi umum: memperbarui updated_at
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- Tabel profiles (1:1 dengan auth.users)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  name       text not null check (char_length(btrim(name)) between 1 and 100),
  nim        text check (nim is null or nim ~ '^[A-Za-z0-9.-]{3,30}$'),
  role       text not null default 'mahasiswa' check (role in ('mahasiswa', 'admin')),
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Fungsi bantu otorisasi (SECURITY DEFINER agar tidak memicu rekursi RLS pada profiles)
-- ---------------------------------------------------------------------
create or replace function public.is_active_user()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and is_active
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and is_active and role = 'admin'
  );
$$;

revoke execute on function public.is_active_user() from public, anon;
revoke execute on function public.is_admin()       from public, anon;
grant  execute on function public.is_active_user() to authenticated;
grant  execute on function public.is_admin()       to authenticated;

-- ---------------------------------------------------------------------
-- Profil otomatis saat akun dibuat di Supabase Auth.
-- Role SELALU 'mahasiswa'; role tidak pernah dibaca dari metadata yang bisa dimanipulasi pengguna.
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    left(
      coalesce(
        nullif(btrim(new.raw_user_meta_data ->> 'name'), ''),
        nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
        'Pengguna'
      ),
      100
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill untuk akun yang sudah ada sebelum trigger dibuat.
insert into public.profiles (id, name)
select u.id,
       left(
         coalesce(
           nullif(btrim(u.raw_user_meta_data ->> 'name'), ''),
           nullif(split_part(coalesce(u.email, ''), '@', 1), ''),
           'Pengguna'
         ),
         100
       )
from auth.users u
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- Lapis pengaman tambahan: tolak perubahan id/role/is_active oleh pengguna biasa,
-- seandainya suatu saat ada GRANT yang terlalu longgar.
-- auth.uid() bernilai null untuk SQL Editor dan service_role, sehingga keduanya tetap boleh.
-- ---------------------------------------------------------------------
create or replace function public.guard_profile_privileged_columns()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (select auth.uid()) is not null and not public.is_admin() then
    if new.id is distinct from old.id
       or new.role is distinct from old.role
       or new.is_active is distinct from old.is_active then
      raise exception 'Perubahan id, role, atau status akun tidak diizinkan.' using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_guard_privileged on public.profiles;
create trigger profiles_guard_privileged
  before update on public.profiles
  for each row execute function public.guard_profile_privileged_columns();

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
alter table public.profiles enable row level security;

-- Hak tabel: anon tidak boleh apa pun; pengguna login hanya SELECT dan UPDATE kolom name & nim.
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (name, nim) on public.profiles to authenticated;

-- Profil sendiri selalu terbaca (agar akun nonaktif bisa terdeteksi di aplikasi);
-- profil anggota lain hanya terbaca oleh pengguna yang akunnya aktif.
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or public.is_active_user());

-- Hanya baris milik sendiri, dan hanya jika akun aktif. Kolom yang boleh diubah dibatasi oleh GRANT di atas.
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()) and public.is_active_user())
  with check (id = (select auth.uid()));

-- Tidak ada policy INSERT/DELETE: profil dibuat oleh trigger dan dihapus otomatis bersama akun (ON DELETE CASCADE).

-- =====================================================================
-- LANGKAH MANUAL SETELAH MENJALANKAN MIGRATION INI
-- =====================================================================
-- 1) Authentication -> Sign In / Providers -> Email: NONAKTIFKAN "Allow new users to sign up".
--    Akun dibuat admin lewat Authentication -> Users -> Add user (atau Invite user).
--
-- 2) Authentication -> URL Configuration: isi Site URL dan tambahkan Redirect URL
--    <alamat-aplikasi>/reset-password  (mis. http://localhost:5173/reset-password).
--
-- 3) Jadikan admin pertama (jalankan di SQL Editor sebagai pemilik proyek):
--      update public.profiles
--      set role = 'admin'
--      where id = (select id from auth.users where email = 'ketua@kampus.ac.id');
--
-- 4) Menonaktifkan akun (sampai Edge Function admin tersedia di Tahap 3):
--      update public.profiles set is_active = false
--      where id = (select id from auth.users where email = 'mahasiswa@kampus.ac.id');
--    Aplikasi akan mengeluarkan pengguna tersebut dan semua policy RLS menolak aksesnya.
