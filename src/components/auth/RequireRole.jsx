import { Outlet } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import EmptyState from '../common/EmptyState';

// Dipakai pada rute khusus peran, mis. <Route element={<RequireRole allow={['admin']} />}>.
// Belum dipakai di Tahap 2 karena belum ada halaman khusus admin; mulai dipakai di Tahap 4.
export default function RequireRole({ allow }) {
  const { user } = useAuth();
  if (!user || !allow.includes(user.role)) {
    return (
      <EmptyState
        icon={ShieldAlert}
        title="Akses ditolak"
        description="Halaman ini hanya dapat diakses oleh peran tertentu."
      />
    );
  }
  return <Outlet />;
}
