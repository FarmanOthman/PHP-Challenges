import { Navigate, useLocation } from 'react-router-dom'; // Import useLocation, remove Outlet
import { useAuth } from '../../hooks/useAuth'; // Updated import path

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation(); // Now correctly imported

  // If still loading auth state, show loading indicator
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Authenticating...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render children
  return <>{children}</>;
};

export default AuthGuard;