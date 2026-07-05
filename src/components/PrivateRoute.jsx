// src/components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';

export function PrivateRoute({ children }) {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}