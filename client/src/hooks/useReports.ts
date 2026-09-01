import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Signalement, ReponsePaginee, Categorie } from '../types/report';

interface FiltresListe {
  categorie?: Categorie | null;
}

export function useSignalements(filtres: FiltresListe) {
  return useQuery({
    queryKey: ['signalements', filtres.categorie ?? 'tous'],
    queryFn: async () => {
      const params: Record<string, string> = { limit: '100' };
      if (filtres.categorie) params.categorie = filtres.categorie;
      const { data } = await api.get<ReponsePaginee<Signalement>>('/reports', { params });
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
    },
  });
}