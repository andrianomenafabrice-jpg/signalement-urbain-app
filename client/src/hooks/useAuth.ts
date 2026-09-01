import { useAuthStore } from '../store/authStore';
import { api } from '../lib/api';

export function useDeconnexion() {
  const clearSession = useAuthStore((etat) => etat.clearSession);

  return async function deconnecter(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch {
      // Le cookie expire de toute facon ou est deja invalide ;
      // on nettoie la session cote client dans tous les cas.
    } finally {
      clearSession();
    }
  };
}