import { LayoutDashboard } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';
import { ROLE_LABEL } from '../config/nav';
import { useAuth } from '../context/AuthContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function DashboardPage() {
  useDocumentTitle('Dashboard');
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Halo, {user.name}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">Anda masuk sebagai {ROLE_LABEL[user.role]}.</p>
      </div>
      <div className="card">
        <EmptyState
          icon={LayoutDashboard}
          title="Ringkasan kelas belum tersedia"
          description="Jadwal, tugas, pengumuman, dan ringkasan kas akan tampil di sini setelah modul-modulnya dibuat."
        />
      </div>
    </div>
  );
}
