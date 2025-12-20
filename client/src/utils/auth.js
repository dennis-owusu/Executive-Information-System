// Utility functions for authentication and role management

export const getUserRole = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    const user = JSON.parse(userStr);
    return user.usersRole || user.role || null;
  } catch {
    return null;
  }
};

export const getUserData = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const hasRole = (roles) => {
  const userRole = getUserRole();
  if (!userRole) return false;
  
  if (Array.isArray(roles)) {
    return roles.includes(userRole);
  }
  
  return userRole === roles;
};

export const getDashboardRoute = () => {
  const userRole = getUserRole();
  
  switch (userRole) {
    case 'admin':
    case 'executive':
    case 'outlet':
      return '/';
    case 'user':
    default:
      return '/shop';
  }
};