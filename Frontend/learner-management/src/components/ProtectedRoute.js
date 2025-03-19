// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles, redirectPath = '/' }) => {
  const { isAuthenticated, userRole } = useAuth();

  // Check if the user is authenticated and has the required role
  const hasRequiredRole = allowedRoles.includes(userRole);

  // If not authenticated or lacks required role, redirect to login page
  if (!isAuthenticated || !hasRequiredRole) {
    return <Navigate to={redirectPath} replace />;
  }

  // Render the child routes if authorized
  return <Outlet />;
};

export default ProtectedRoute;