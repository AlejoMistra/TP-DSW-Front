import axios from 'axios';
import { toast } from 'sonner';

export interface ApiErrorResponse {
  statusCode: number;
  code: string;
  message: string;
  details: Array<{ field?: string; message: string }> | null;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepta las requests y agrega el token de autenticación en el header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gym_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Intercepta las responses y normaliza errores globales con contrato unificado
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const isLoginRequest = error.config?.url?.includes('/api/auth/login');

      // 1. Manejo de sesión expirada (401)
      if (error.response?.status === 401 && !isLoginRequest) {
        localStorage.removeItem('gym_auth_token');
        localStorage.removeItem('gym_auth_user');
        toast.error(
          'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
        );
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
        return Promise.reject(error);
      }

      // 2. Normalización de error según ApiErrorResponse unificado
      const data = error.response?.data as ApiErrorResponse | undefined;

      if (data && typeof data === 'object') {
        // Si hay detalles de validación Zod, priorizamos el primer detalle para el toast
        if (
          Array.isArray(data.details) &&
          data.details.length > 0 &&
          data.details[0].message
        ) {
          error.message = data.details[0].message;
        } else if (data.message) {
          error.message = data.message;
        } else if (error.response?.status && error.response.status >= 500) {
          error.message =
            'Error interno del servidor. Por favor intenta más tarde.';
        }
      } else if (!error.response) {
        error.message =
          'No se pudo conectar con el servidor. Revisa tu conexión a internet o intenta más tarde.';
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
