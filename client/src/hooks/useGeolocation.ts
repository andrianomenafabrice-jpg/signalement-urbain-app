import { useCallback, useState } from 'react';

export type StatutGeolocation = 'inactif' | 'chargement' | 'succes' | 'refuse' | 'erreur';

interface EtatGeolocation {
  statut: StatutGeolocation;
  latitude: number | null;
  longitude: number | null;
}

export function useGeolocation() {
  const [etat, setEtat] = useState<EtatGeolocation>({ statut: 'inactif', latitude: null, longitude: null });

  const demanderPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setEtat({ statut: 'erreur', latitude: null, longitude: null });
      return;
    }

    setEtat((etatActuel) => ({ ...etatActuel, statut: 'chargement' }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setEtat({
          statut: 'succes',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (erreur) => {
        setEtat({
          statut: erreur.code === erreur.PERMISSION_DENIED ? 'refuse' : 'erreur',
          latitude: null,
          longitude: null,
        });
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  return { ...etat, demanderPosition };
}