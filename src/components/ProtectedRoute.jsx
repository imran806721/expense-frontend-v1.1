import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-ink text-ink-muted">Loading…</div>;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}
