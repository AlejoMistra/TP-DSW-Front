/* eslint-disable react-refresh/only-export-components */

import type { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import RoleLayout from '@/layouts/RoleLayout';
import ProtectedRoute from '../ProtectedRoute';

const MemberRoutinesPage = lazy(() => import('@/pages/member/MemberRoutinesPage'));
const MemberClassesPage = lazy(() => import('@/pages/member/ClassesPage'));

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