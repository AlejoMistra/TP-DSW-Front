import { createBrowserRouter } from 'react-router-dom';
import { publicRoutes } from './routes/publicRoutes';
import { adminRoutes } from './routes/adminRoutes';
import { instructorRoutes } from './routes/instructorRoutes';
import { memberRoutes } from './routes/memberRoutes';

export const router = createBrowserRouter([
  adminRoutes,
  instructorRoutes,
  memberRoutes,
  ...publicRoutes,
]);