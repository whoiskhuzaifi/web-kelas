import {
  BookOpen,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  MessagesSquare,
  UserCheck,
  UserRound,
  Wallet,
} from 'lucide-react';

// status 'ready'  -> bisa dibuka.
// status 'soon'   -> tampil nonaktif dengan label "Segera" sampai modulnya benar-benar dibuat.
// roles           -> peran yang boleh melihat menu (otorisasi sebenarnya ada di database/RLS).
export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', path: '/', icon: LayoutDashboard, status: 'ready', roles: ['admin', 'mahasiswa'] },
  { id: 'jadwal', label: 'Jadwal', path: '/jadwal', icon: CalendarDays, status: 'soon', roles: ['admin', 'mahasiswa'] },
  { id: 'pengumuman', label: 'Pengumuman', path: '/pengumuman', icon: Megaphone, status: 'soon', roles: ['admin', 'mahasiswa'] },
  { id: 'tugas', label: 'Tugas', path: '/tugas', icon: ClipboardList, status: 'soon', roles: ['admin', 'mahasiswa'] },
  { id: 'keuangan', label: 'Keuangan', path: '/keuangan', icon: Wallet, status: 'soon', roles: ['admin', 'mahasiswa'] },
  { id: 'forum', label: 'Forum', path: '/forum', icon: MessagesSquare, status: 'soon', roles: ['admin', 'mahasiswa'] },
  { id: 'materi', label: 'Materi', path: '/materi', icon: BookOpen, status: 'soon', roles: ['admin', 'mahasiswa'] },
  { id: 'presensi', label: 'Presensi', path: '/presensi', icon: UserCheck, status: 'soon', roles: ['admin', 'mahasiswa'] },
  { id: 'alat-akademik', label: 'Alat Akademik', path: '/alat-akademik', icon: GraduationCap, status: 'soon', roles: ['admin', 'mahasiswa'] },
  { id: 'profil', label: 'Profil', path: '/profil', icon: UserRound, status: 'ready', roles: ['admin', 'mahasiswa'] },
];

export const ROLE_LABEL = { admin: 'Admin', mahasiswa: 'Mahasiswa' };
