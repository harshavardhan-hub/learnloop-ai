import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../common/Loader';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />;
  }

  return children;
};

export default ProtectedRoute;
