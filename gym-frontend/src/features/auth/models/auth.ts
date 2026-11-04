import type { AppRole } from '@/config/navigation';

export type BackendRole = 'ADMIN' | 'INSTRUCTOR' | 'MEMBER';

export interface AuthUser {
  id: number;
  email: string;
  role: AppRole;
  accountStatus?: 'PENDING_ACTIVATION' | 'ACTIVE' | 'SUSPENDED';
  memberId: number | null;
  instructorId: number | null;
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
    accountStatus: 'PENDING_ACTIVATION' | 'ACTIVE' | 'SUSPENDED';
    memberId: number | null;
    instructorId: number | null;
  };
}

export interface ActivateAccountInput {
  newPassword: string;
}
export interface ActivateAccountResponse {
  token: string;
  user: LoginResponse['user'];
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
      return '/administrativo/menu';
    case 'instructor':
      return '/instructor/inicio';
    case 'member':
      return '/socio/inicio';
    default:
      return '/';
  }
}
