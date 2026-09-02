import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';

export function useInitAuth(): boolean {
  const [pret, setPret] = useState(false);
  const setSession = useAuthStore((etat) => etat.setSession);

  useEffect(() => {
    let annule = false;

    api
      .post('/auth/refresh')
      .then(({ data }) => {
        if (!annule) setSession(data.user, data.accessToken);
      })
      .catch(() => {
        // Pas de session valide (jamais connecte, ou cookie expire) : reste invite, c'est attendu.
      })
      .finally(() => {
        if (!annule) setPret(true);
      });

    return () => {
      annule = true;
    };
  }, [setSession]);

  return pret;
}