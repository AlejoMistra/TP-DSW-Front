import { RouterProvider } from 'react-router-dom';
import { router } from './router/router';
import { TooltipProvider } from '@/shared/components/ui/tooltip';
import { Toaster } from '@/shared/components/ui/sonner';
import { AuthProvider } from '@/features/auth/context/AuthContext';

export default function App() {
  return (
    < AuthProvider >
      <TooltipProvider>
        <RouterProvider router={router} />
        <Toaster />
      </TooltipProvider>
    </AuthProvider >
  );
}