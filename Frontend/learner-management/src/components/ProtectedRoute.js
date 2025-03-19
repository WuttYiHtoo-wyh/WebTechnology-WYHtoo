import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, redirectPath = '/' }) => {
  // Get the user's role from localStorage (set during login)
  const userRole = localStorage.getItem('role');

  // Check if the user is authenticated and has the required role
  const isAuthenticated = userRole !== null;
  const hasRequiredRole = allowedRoles.includes(userRole);

  // If not authenticated or lacks required role, redirect
  if (!isAuthenticated || !hasRequiredRole) {
    return <Navigate to={redirectPath} replace />;
  }

  // Render the child routes if authorized
  return <Outlet />;
};

export default ProtectedRoute;