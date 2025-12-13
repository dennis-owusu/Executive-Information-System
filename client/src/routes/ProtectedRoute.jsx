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

      // If user role is not in allowed roles, redirect to shop
      if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/shop" replace />;
      }
    } catch (e) {
      // Invalid user data, clear and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}
