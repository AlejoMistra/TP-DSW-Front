/* eslint-disable react-refresh/only-export-components */

import type { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import RoleLayout from '@/layouts/RoleLayout';
import ProtectedRoute from '../ProtectedRoute';

const MemberRoutinesPage = lazy(() => import('@/pages/member/MemberRoutinesPage'));
const MemberClassesPage = lazy(() => import('@/pages/member/ClassesPage'));
const MemberProfilePage = lazy(() => import('@/pages/member/MemberProfilePage'));
const MemberDataPage = lazy(() => import('@/pages/member/profile/MemberDataPage'));
const MemberMembershipPage = lazy(() => import('@/pages/member/profile/MemberMembershipPage'));
const MemberPaymentsPage = lazy(() => import('@/pages/member/profile/MemberPaymentsPage'));
const MemberSupportPage = lazy(() => import('@/pages/member/profile/MemberSupportPage'));

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
    { path: 'perfil', element: <MemberProfilePage /> },
    { path: 'perfil/datos', element: <MemberDataPage /> },
    { path: 'perfil/membresia', element: <MemberMembershipPage /> },
    { path: 'perfil/pagos', element: <MemberPaymentsPage /> },
    { path: 'perfil/soporte', element: <MemberSupportPage /> },
  ],
};