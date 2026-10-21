/* eslint-disable react-refresh/only-export-components */

import type { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import RoleLayout from '@/layouts/RoleLayout';
import ProtectedRoute from '../ProtectedRoute';

const InstructorHomePage = lazy(() => import('@/pages/instructor/InstructorHomePage'));
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
    { index: true, element: <Navigate to="/instructor/inicio" replace /> },
    { path: 'inicio', element: <InstructorHomePage /> },
    { path: 'rutinas', element: <RoutinesPage /> },
    { path: 'ejercicios', element: <ExercisesPage /> },
    { path: 'exercises', element: <ExercisesPage /> },
  ],
};