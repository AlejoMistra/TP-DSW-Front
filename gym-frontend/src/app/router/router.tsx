import { createBrowserRouter } from 'react-router-dom'
import { publicRoutes } from './routes/publicRoutes'
import { adminRoutes } from './routes/adminRoutes'
import { instructorRoutes } from './routes/instructorRoutes'
import { memberRoutes } from './routes/memberRoutes'
import RouteErrorBoundary from '@/shared/components/RouteErrorBoundary'

const baseRoutes = [
  adminRoutes,
  instructorRoutes,
  memberRoutes,
  ...publicRoutes,
]

// Asigna automáticamente el RouteErrorBoundary al 100% de las rutas principales
export const router = createBrowserRouter(
  baseRoutes.map((route) => ({
    ...route,
    errorElement: route.errorElement ?? <RouteErrorBoundary />,
  }))
)