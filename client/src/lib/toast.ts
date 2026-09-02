import { useToastStore } from '../store/toastStore';

export const toast = {
  succes: (message: string) => useToastStore.getState().ajouter('succes', message),
  erreur: (message: string) => useToastStore.getState().ajouter('erreur', message),
};