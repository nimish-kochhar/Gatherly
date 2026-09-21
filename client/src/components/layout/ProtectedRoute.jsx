import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';

/**
 * ProtectedRoute — Wraps routes that require authentication.
 *
 * If the user is authenticated, renders the child routes via <Outlet />.
 * Otherwise, redirects to the landing/auth page.
 *
 * Note: AuthContext's loading gate ensures this component only
 * mounts after the initial session restore is complete, so
 * isAuthenticated is always a settled value here.
 */
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
