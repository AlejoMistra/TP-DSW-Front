import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import RoleLayout from '@/layouts/RoleLayout';
import ProtectedRoute from '../ProtectedRoute';
import AdminClassesPage from '@/pages/admin/ClassesPage';
import MembersPage from '@/pages/admin/MembersPage';
import NewMemberPage from '@/pages/admin/members/NewMemberPage';
import EditMemberPage from '@/pages/admin/members/EditMemberPage';
import MemberDetailsPage from '@/pages/admin/members/MemberDetailsPage';
import MembershipPlansPage from '@/pages/admin/MembershipPlansPage';
import InstructorsPage from '@/pages/admin/InstructorsPage';

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
