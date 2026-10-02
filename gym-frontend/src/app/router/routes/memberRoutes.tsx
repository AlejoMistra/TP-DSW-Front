import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import RoleLayout from '@/layouts/RoleLayout';
import ProtectedRoute from '../ProtectedRoute';
import MemberRoutinesPage from '@/pages/member/MemberRoutinesPage';
import MemberClassesPage from '@/pages/member/ClassesPage';
import MemberProfilePage from '@/pages/member/MemberProfilePage';
import MemberDataPage from '@/pages/member/profile/MemberDataPage';
import MemberMembershipPage from '@/pages/member/profile/MemberMembershipPage';
import MemberPaymentsPage from '@/pages/member/profile/MemberPaymentsPage';
import MemberSupportPage from '@/pages/member/profile/MemberSupportPage';
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

