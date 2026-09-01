import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { StatistiquesGlobales } from '../types/admin';
import type { Signalement, Statut } from '../types/report';

export function useStatistiques() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data } = await api.get<StatistiquesGlobales>('/admin/stats');
      return data;
    },
  });
}

export function useChangerStatutAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, statut }: { id: string; statut: Statut }) => {
      const { data } = await api.patch<{ signalement: Signalement }>(`/reports/${id}/statut`, { statut });
      return data.signalement;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['signalements'] });
      queryClient.invalidateQueries({ queryKey: ['mes-signalements'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
}