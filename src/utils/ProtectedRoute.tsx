import React from 'react';
import { Navigate } from 'react-router-dom';
import { hasToken } from './auth';

type Props = {
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const isAuthenticated = hasToken(); 

  if (!isAuthenticated) {
    
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;