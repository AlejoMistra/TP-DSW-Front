import type { RouteObject } from 'react-router-dom';
import LoginPage from '@/pages/auth/LoginPage';
import ActivateAccountPage from '@/pages/auth/ActivateAccountPage';
import NotFoundPage from '@/pages/public/NotFoundPage';

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/activar-cuenta',
    element: <ActivateAccountPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

