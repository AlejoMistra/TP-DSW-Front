import { createBrowserRouter } from 'react-router-dom'
import RoleLayout from '@/layouts/RoleLayout'
import TemporalLanding from '../pages/TemporalLanding'
import { ClasesPage } from '@/pages/admin/ClasesPage'
import SociosPage from '@/pages/admin/SociosPage'
import RutinasPage from '@/pages/instructor/RutinasPage'
import EjerciciosPage from '@/pages/instructor/EjerciciosPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <TemporalLanding />,
  },
  {
    path: '/administrativo',
    element: <RoleLayout role="admin" />,
    children: [
      { path: 'clases', element: <ClasesPage /> },
      { path: 'socios', element: <SociosPage /> },
    ],
  },
  {
    path: '/instructor',
    element: <RoleLayout role="instructor" />,
    children: [
      { index: true, element: <div className="p-4 text-2xl font-bold">Inicio Instructor</div> },
      { path: 'rutinas', element: <RutinasPage /> },
      { path: 'ejercicios', element: <EjerciciosPage /> },
    ],
  },
  {
    path: '/socio',
    element: <RoleLayout role="member" />,
    children: [
      { index: true, element: <div className="p-4 text-2xl font-bold">Inicio Socio</div> },
      { path: 'rutinas', element: <RutinasPage /> },
    ],
  },
])