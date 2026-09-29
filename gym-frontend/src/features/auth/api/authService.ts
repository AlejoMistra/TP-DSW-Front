import { apiClient } from '@/shared/api/apiClient';
import type {
  ActivateAccountInput,
  ActivateAccountResponse,
  LoginCredentials,
  LoginResponse,
} from '../models/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/api/auth/login', credentials);
    return response.data;
  },

  async activateAccount(data: ActivateAccountInput): Promise<ActivateAccountResponse> {
    const response = await apiClient.post<ActivateAccountResponse>('/api/auth/activate-account', data);
    return response.data;
  },
};
