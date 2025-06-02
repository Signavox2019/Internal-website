import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const isAuthenticated = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const isLoginPage = window.location.pathname === '/login';
  const isForgotPasswordPage = window.location.pathname === '/forgot-password';
  const isPublicRoute = isLoginPage || isForgotPasswordPage;

  // If trying to access public pages while authenticated, redirect to appropriate page
  if (isAuthenticated && isPublicRoute) {
    return <Navigate to={isAdmin ? "/welcome" : "/landing"} replace />;
  }

  // If trying to access protected route while not authenticated, redirect to login
  if (!isAuthenticated && !isPublicRoute) {
    return <Navigate to="/login" replace />;
  }

  // If trying to access admin-only route while not admin, redirect to landing
  if (adminOnly && !isAdmin) {
    return <Navigate to="/landing" replace />;
  }

  return children;
};

export default ProtectedRoute;