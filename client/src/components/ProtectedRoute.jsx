// components/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, refreshTokenIfNeeded } from '../utils/auth';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Check if user is authenticated
      if (!isAuthenticated()) {
        setIsAuth(false);
        setIsChecking(false);
        return;
      }

      // Try to refresh token if expired
      const tokenValid = await refreshTokenIfNeeded();
      setIsAuth(tokenValid);
      setIsChecking(false);
    };

    checkAuth();
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600 font-medium">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuth) {
    // Redirect to auth page, but save the attempted location
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;