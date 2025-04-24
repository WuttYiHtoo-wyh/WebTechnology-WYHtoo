import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles, redirectPath = '/' }) => {
  const { isAuthenticated, userRole } = useAuth();

  const hasRequiredRole = allowedRoles.includes(userRole);

  if (!isAuthenticated || !hasRequiredRole) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;