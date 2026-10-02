/* eslint-disable react-refresh/only-export-components */

import type { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import RoleLayout from '@/layouts/RoleLayout';
import ProtectedRoute from '../ProtectedRoute';

const AdminClassesPage = lazy(() => import('@/pages/admin/ClassesPage'));
const MembersPage = lazy(() => import('@/pages/admin/MembersPage'));
const NewMemberPage = lazy(() => import('@/pages/admin/members/NewMemberPage'));
const EditMemberPage = lazy(() => import('@/pages/admin/members/EditMemberPage'));
const MemberDetailsPage = lazy(() => import('@/pages/admin/members/MemberDetailsPage'));
const MembershipPlansPage = lazy(() => import('@/pages/admin/MembershipPlansPage'));
const InstructorsPage = lazy(() => import('@/pages/admin/InstructorsPage'));

export const adminRoutes: RouteObject = {
  path: '/administrativo',
  element: (
    <ProtectedRoute allowedRoles={['admin']}>
      <RoleLayout role="admin" />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <Navigate to="/administrativo/socios" replace /> },
    { path: 'clases', element: <AdminClassesPage /> },
    { path: 'clases/nueva', element: <Navigate to="/administrativo/clases" replace /> },
    { path: 'clases/:id/editar', element: <Navigate to="/administrativo/clases" replace /> },
    { path: 'socios', element: <MembersPage /> },
    { path: 'socios/nuevo', element: <NewMemberPage /> },
    { path: 'socios/editar/:id', element: <EditMemberPage /> },
    { path: 'socios/:id', element: <MemberDetailsPage /> },
    { path: 'planes', element: <MembershipPlansPage /> },
    { path: 'instructores', element: <InstructorsPage /> },
  ],
};