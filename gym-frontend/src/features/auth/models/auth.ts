import type { AppRole } from '@/config/navigation';

export type BackendRole = 'ADMIN' | 'INSTRUCTOR' | 'MEMBER';

export interface AuthUser {
  id: number;
  email: string;
  role: AppRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    role: BackendRole | AppRole;
  };
}

export interface ActivateAccountInput {
  email: string;
  name: string;
  surname: string;
  docNumber: string;
  newPassword: string;
}

export interface ActivateAccountResponse {
  message: string;
}

export function mapBackendRoleToAppRole(role: string): AppRole {
  const normalized = role.toLowerCase();
  if (normalized === 'admin') return 'admin';
  if (normalized === 'instructor') return 'instructor';
  return 'member';
}

export function getDefaultPathForRole(role: AppRole): string {
  switch (role) {
    case 'admin':
      return '/administrativo/socios';
    case 'instructor':
      return '/instructor/rutinas';
    case 'member':
      return '/socio/rutinas';
    default:
      return '/';
  }
}

