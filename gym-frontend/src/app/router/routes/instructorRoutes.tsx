/* eslint-disable react-refresh/only-export-components */

import type { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import RoleLayout from '@/layouts/RoleLayout';
import ProtectedRoute from '../ProtectedRoute';

const RoutinesPage = lazy(() => import('@/pages/instructor/RoutinesPage'));
const ExercisesPage = lazy(() => import('@/pages/instructor/ExercisesPage'));

export const instructorRoutes: RouteObject = {
  path: '/instructor',
  element: (
    <ProtectedRoute allowedRoles={['instructor']}>
      <RoleLayout role="instructor" />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <Navigate to="/instructor/rutinas" replace /> },
    { path: 'rutinas', element: <RoutinesPage /> },
    { path: 'ejercicios', element: <ExercisesPage /> },
    { path: 'exercises', element: <ExercisesPage /> },
  ],
};