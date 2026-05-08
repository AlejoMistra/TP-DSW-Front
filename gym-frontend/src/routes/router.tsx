import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import { AdminLayout } from '../layouts/AdminLayout';
import { SociosPage } from '../pages/administrativo/SociosPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, //Por ahora es la landing por defecto de vite
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'socios',
        element: <SociosPage />
      },
      // Aca van las otras rutas de admin, ej membresias, clases, etc
    ]
  },
  // Y aca van a ir las otras rutas para los otros roles, instructor y socio. 
])

export default router;