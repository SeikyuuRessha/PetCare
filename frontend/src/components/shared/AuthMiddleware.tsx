import React from 'react';
import { Navigate } from 'react-router-dom';
import { checkIsLoggedIn } from '../../utils/auth';

interface AuthMiddlewareProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'doctor' | 'admin' | 'employee';
}

export default function AuthMiddleware({ children, requiredRole = 'user' }: AuthMiddlewareProps) {
  const isLoggedIn = checkIsLoggedIn();
  const userRole = localStorage.getItem('userRole');

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
