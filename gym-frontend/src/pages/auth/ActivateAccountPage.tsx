import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import ActivateAccountForm from '@/features/auth/components/ActivateAccountForm';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { getDefaultPathForRole } from '@/features/auth/models/auth';

export default function ActivateAccountPage() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  if (user.accountStatus !== 'PENDING_ACTIVATION') {
    return <Navigate to={getDefaultPathForRole(user.role)} replace />;
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-muted/20">
      <Card className="w-full max-w-md p-6 md:p-8 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Primer Inicio de Sesión</CardTitle>
          <CardDescription>
            Para activar tu cuenta y acceder al gimnasio, definí tu nueva contraseña.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ActivateAccountForm />
        </CardContent>
      </Card>
    </div>
  );
}