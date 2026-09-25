import { createContext } from 'react';
import type { AuthUser, LoginCredentials } from '../models/auth';

export const TOKEN_KEY = 'gym_auth_token';
export const USER_KEY = 'gym_auth_user';

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

