import { create } from 'zustand';

export interface SessionUser {
  id: string;
  nom: string;
  email: string;
  role: 'citoyen' | 'admin';
}

interface AuthState {
  user: SessionUser | null;
  accessToken: string | null;
  setSession: (user: SessionUser, accessToken: string) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  setSession: (user, accessToken) => set({ user, accessToken }),
  clearSession: () => set({ user: null, accessToken: null }),
}));