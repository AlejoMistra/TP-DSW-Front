import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import RoleLayout from '@/layouts/RoleLayout';
import ProtectedRoute from '../ProtectedRoute';
import RoutinesPage from '@/pages/instructor/RoutinesPage';
import ExercisesPage from '@/pages/instructor/ExercisesPage';

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

