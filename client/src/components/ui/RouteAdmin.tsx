import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface Props {
  children: ReactNode;
}

export function RouteAdmin({ children }: Props) {
  const utilisateur = useAuthStore((etat) => etat.user);

  if (!utilisateur) {
    return <Navigate to="/connexion" replace />;
  }

  if (utilisateur.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}