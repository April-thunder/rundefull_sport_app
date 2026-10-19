// src/components/PrivateRoute.tsx
import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useApp } from '../hooks/useApp';

interface PrivateRouteProps {
  children: ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}