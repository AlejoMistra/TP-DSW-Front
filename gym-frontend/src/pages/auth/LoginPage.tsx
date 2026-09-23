import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import LoginForm from '@/features/auth/components/LoginForm';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { getDefaultPathForRole } from '@/features/auth/models/auth';

export default function LoginPage() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (!isLoading && isAuthenticated && user) {
    return <Navigate to={getDefaultPathForRole(user.role)} replace />;
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-muted/20">
      <Card className="w-full max-w-md p-6 md:p-8 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Bienvenido a GymPass</CardTitle>
          <CardDescription>
            Ingresá tus credenciales para acceder al sistema.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div >
  );
}