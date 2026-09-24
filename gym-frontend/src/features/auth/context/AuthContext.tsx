import {
  useCallback,
  useState,
  type ReactNode,
} from 'react';
import type {
  AuthUser,
  LoginCredentials,
} from '../models/auth';
import { mapBackendRoleToAppRole } from '../models/auth';
import { authService } from '../api/authService';
import {
  AuthContext,
  TOKEN_KEY,
  USER_KEY,
  type AuthContextType,
} from './authContextDefinition';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const storedUser = localStorage.getItem(USER_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthUser> => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);

      const authUser: AuthUser = {
        id: response.user.id,
        email: response.user.email,
        role: mapBackendRoleToAppRole(response.user.role),
      };

      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(authUser));

      setToken(response.token);
      setUser(authUser);

      return authUser;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

