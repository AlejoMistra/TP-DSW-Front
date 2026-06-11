import { createBrowserRouter } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import { LandingTemporal } from '../pages/LandingTemporal'
//import DashboardPage from '../pages/admin/DashboardPage'
import { ClasesPage } from '@/pages/administrativo/ClasesPage'
import SociosPage from '@/pages/administrativo/SociosPage'
import InstructorLayout from '@/layouts/InstructorLayout'


export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingTemporal />,
  },

  {
    path: '/administrativo',
    element: <AdminLayout />,
    children: [
      //{ index: true, element: <DashboardPage /> },
      { path: 'clases', element: <ClasesPage /> },
      { path: 'socios', element: <SociosPage /> },
    ],
  },
  {
    path: "/instructor",
    element: <InstructorLayout />,
    children: [
      { index: true, element: <div>Instructor Home</div> }
    ]
  }
])