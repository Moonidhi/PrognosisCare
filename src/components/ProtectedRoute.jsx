import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function roleHome(role) {
  if (role === 'super-admin') return '/super-admin-dashboard';
  if (role === 'hospital-admin') return '/hospital-dashboard';
  if (role === 'doctor') return '/doctor-workspace';
  return '/dashboard';
}

function ProtectedRoute({ children, allowedRoles, redirectPath = '/auth' }) {
  const { currentUser, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="page-shell">
        <section className="card text-center text-sm text-slate-600">Checking authentication...</section>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to={redirectPath} replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to={roleHome(currentUser.role)} replace />;
  }

  return children;
}

export default ProtectedRoute;
