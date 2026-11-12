import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import FullScreenLoader from '../common/FullScreenLoader';

export default function GuestRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullScreenLoader />;
  if (user) return <Navigate to={location.state?.from?.pathname ?? '/'} replace />;
  return <Outlet />;
}
