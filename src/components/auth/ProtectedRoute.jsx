import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import FullScreenLoader from '../common/FullScreenLoader';

// Guard UX: hanya mengarahkan pengguna. Keamanan data tetap ditegakkan oleh RLS di database.
export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullScreenLoader />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}
