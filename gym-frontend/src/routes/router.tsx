import { createBrowserRouter } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import { LandingTemporal } from '../pages/LandingTemporal'
import { ClasesPage } from '@/pages/administrativo/ClasesPage'
import SociosPage from '@/pages/administrativo/SociosPage'
import InstructorLayout from '@/layouts/InstructorLayout'
import RutinasPage from '@/pages/instructor/RutinasPage'
import EjerciciosPage from '@/pages/instructor/EjerciciosPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingTemporal />,
  },
  {
    path: '/administrativo',
    element: <AdminLayout />,
    children: [
      { path: 'clases', element: <ClasesPage /> },
      { path: 'socios', element: <SociosPage /> },
    ],
  },
  {
    path: '/instructor',
    element: <InstructorLayout />,
    children: [
      { index: true, element: <div className="p-4 text-2xl font-bold">Inicio Instructor</div> },
      { path: 'rutinas', element: <RutinasPage /> },
      { path: 'ejercicios', element: <EjerciciosPage /> },
    ],
  },
])