import { create } from 'zustand';

export type TypeToast = 'succes' | 'erreur';

export interface ToastItem {
  id: string;
  type: TypeToast;
  message: string;
}

interface ToastState {
  toasts: ToastItem[];
  ajouter: (type: TypeToast, message: string) => void;
  retirer: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  ajouter: (type, message) => {
    const id = crypto.randomUUID();
    set((etat) => ({ toasts: [...etat.toasts, { id, type, message }] }));
    setTimeout(() => {
      set((etat) => ({ toasts: etat.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  retirer: (id) => set((etat) => ({ toasts: etat.toasts.filter((t) => t.id !== id) })),
}));