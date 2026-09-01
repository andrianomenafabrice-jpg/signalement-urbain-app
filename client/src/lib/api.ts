import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../store/authStore';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshEnCours: Promise<string | null> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original: any = error.config;

    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;

      if (!refreshEnCours) {
        refreshEnCours = axios
          .post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {}, { withCredentials: true })
          .then((res) => {
            const { accessToken, user } = res.data;
            useAuthStore.getState().setSession(user, accessToken);
            return accessToken as string;
          })
          .catch(() => {
            useAuthStore.getState().clearSession();
            return null;
          })
          .finally(() => {
            refreshEnCours = null;
          });
      }

      const nouveauToken = await refreshEnCours;
      if (nouveauToken) {
        original.headers = { ...original.headers, Authorization: `Bearer ${nouveauToken}` };
        return api(original);
      }
    }

    return Promise.reject(error);
  }
);