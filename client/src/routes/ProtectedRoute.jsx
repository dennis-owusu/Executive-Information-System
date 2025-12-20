import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles = ['admin', 'executive'] }) {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const location = useLocation();

  // Simple check: if no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Check user role
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      
      // Get the correct role field (usersRole or role)
      const userRole = user.usersRole || user.role;
      console.log('[PROTECTED_ROUTE][DEBUG]', 'User role:', userRole, 'Allowed roles:', allowedRoles);

      // If user role is not in allowed roles, redirect to shop
      if (!allowedRoles.includes(userRole)) {
        console.log('[PROTECTED_ROUTE][DEBUG]', 'Role not allowed, redirecting to /shop');
        return <Navigate to="/shop" replace />;
      }
    } catch (e) {
      // Invalid user data, clear and redirect to login
      console.error('[PROTECTED_ROUTE][ERROR]', 'Error parsing user data:', e);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}
