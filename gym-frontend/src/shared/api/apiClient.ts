import axios from 'axios';
import { toast } from 'sonner';

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
  (error) => Promise.reject(error)
);

// Intercepta las responses y normaliza errores globales
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    
    if (axios.isAxiosError(error)) {
      const isLoginRequest = error.config?.url?.includes('/api/auth/login');

      // 1. Manejo de sesión expirada (401)
      if (error.response?.status === 401 && !isLoginRequest) {
        localStorage.removeItem('gym_auth_token');
        localStorage.removeItem('gym_auth_user');
        toast.error('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
        return Promise.reject(error);
      }

      //TODO: Actualmente la api responde con diferentes estructuras de error; ZodError, AppError con { error: "..." }, y mensajes estándar { message: "..." }. Por eso los if/if-else para normalizar el error. Revisar si vale la pena unificar la estructura de errores en el backend.
      
      // 2. Extracción y normalización del mensaje de error
      const responseData = error.response?.data;
      if (responseData && typeof responseData === 'object') {
        // Error de Validaciones Zod: details: [{ field, message }] -> se queda con el primer mensaje solamente para mantener el toast simple
        if (
          'details' in responseData &&
          Array.isArray(responseData.details) &&
          responseData.details.length > 0
        ) {
          const firstDetail = responseData.details[0];
          if (
            firstDetail &&
            typeof firstDetail === 'object' &&
            'message' in firstDetail &&
            typeof firstDetail.message === 'string'
          ) {
            error.message = firstDetail.message;
          }
        }

        // AppError del backend: { error: "..." }
        else if (
          'error' in responseData &&
          typeof responseData.error === 'string' &&
          responseData.error.trim().length > 0
        ) {
          error.message = responseData.error;
        }

        // Mensaje estándar: { message: "..." }
        else if (
          'message' in responseData &&
          typeof responseData.message === 'string' &&
          responseData.message.trim().length > 0
        ) {
          error.message = responseData.message;
        }

        // D) Error 500 del servidor sin mensaje
        else if (error.response?.status && error.response.status >= 500) {
          error.message = 'Error interno del servidor. Por favor intenta más tarde.';
        }
      } else if (!error.response) {
        // E) Error de conexión o servidor caído
        error.message =
          'No se pudo conectar con el servidor. Revisa tu conexión a internet o intenta más tarde.';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
