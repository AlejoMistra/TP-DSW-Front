import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import RoleLayout from '@/layouts/RoleLayout';
import ProtectedRoute from '../ProtectedRoute';
import MemberRoutinesPage from '@/pages/member/MemberRoutinesPage';
import MemberClassesPage from '@/pages/member/ClassesPage';

export const memberRoutes: RouteObject = {
  path: '/socio',
  element: (
    <ProtectedRoute allowedRoles={['member']}>
      <RoleLayout role="member" />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <Navigate to="/socio/rutinas" replace /> },
    { path: 'rutinas', element: <MemberRoutinesPage /> },
    { path: 'clases', element: <MemberClassesPage /> },
  ],
};

