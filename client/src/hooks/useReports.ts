import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Signalement, ReponsePaginee, Categorie, Statut } from '../types/report';

interface FiltresListe {
  categorie?: Categorie | null;
  statut?: Statut | null;
}

export function useSignalements(filtres: FiltresListe) {
  return useQuery({
    queryKey: ['signalements', filtres.categorie ?? 'tous', filtres.statut ?? 'tous'],
    queryFn: async () => {
      const params: Record<string, string> = { limit: '100' };
      if (filtres.categorie) params.categorie = filtres.categorie;
      if (filtres.statut) params.statut = filtres.statut;
      const { data } = await api.get<ReponsePaginee<Signalement>>('/reports', { params });
      return data.donnees;
    },
  });
}

export function useMesSignalements(filtres: FiltresListe = {}) {
  return useQuery({
    queryKey: ['mes-signalements', filtres.categorie ?? 'tous', filtres.statut ?? 'tous'],
    queryFn: async () => {
      const params: Record<string, string> = { limit: '50' };
      if (filtres.categorie) params.categorie = filtres.categorie;
      if (filtres.statut) params.statut = filtres.statut;
      const { data } = await api.get<ReponsePaginee<Signalement>>('/reports/mine', { params });
      return data.donnees;
    },
  });
}

interface CreerSignalementInput {
  titre: string;
  description: string;
  categorie: Categorie;
  latitude: number;
  longitude: number;
  photo: File;
}

export function useCreerSignalement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreerSignalementInput) => {
      const formData = new FormData();
      formData.append('titre', input.titre);
      formData.append('description', input.description);
      formData.append('categorie', input.categorie);
      formData.append('latitude', String(input.latitude));
      formData.append('longitude', String(input.longitude));
      formData.append('photo', input.photo);

      const { data } = await api.post<{ signalement: Signalement }>('/reports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.signalement;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['signalements'] });
      queryClient.invalidateQueries({ queryKey: ['mes-signalements'] });
    },
  });
}