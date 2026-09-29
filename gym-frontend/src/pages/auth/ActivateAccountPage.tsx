import { Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import ActivateAccountForm from '@/features/auth/components/ActivateAccountForm';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { getDefaultPathForRole } from '@/features/auth/models/auth';
import { ArrowLeft } from 'lucide-react';

export default function ActivateAccountPage() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (!isLoading && isAuthenticated && user) {
    return <Navigate to={getDefaultPathForRole(user.role)} replace />;
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-muted/20">
      <Card className="w-full max-w-lg p-6 md:p-8 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-start mb-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Volver al inicio de sesión
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold">Activar Cuenta</CardTitle>
          <CardDescription>
            Validá tu identidad con tus datos personales y creá tu contraseña de acceso.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ActivateAccountForm />
        </CardContent>
      </Card>
    </div>
  );
}

