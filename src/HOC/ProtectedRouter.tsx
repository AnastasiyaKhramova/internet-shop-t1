import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { loading, isAuthenticated } = useAuth(); 

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default ProtectedRoute;

