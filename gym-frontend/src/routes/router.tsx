import { createBrowserRouter } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import { LandingTemporal } from '../pages/LandingTemporal'
//import DashboardPage from '../pages/admin/DashboardPage'
import { ClasesPage } from '@/pages/admin/ClasesPage'
import { SociosPage } from '@/pages/admin/SociosPage'


export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingTemporal />,
  },

  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      //{ index: true, element: <DashboardPage /> },
      { path: 'clases', element: <ClasesPage /> },
      { path: 'socios', element: <SociosPage /> },
    ],
  },
])