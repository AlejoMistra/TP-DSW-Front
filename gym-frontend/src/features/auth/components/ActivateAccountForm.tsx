import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/shared/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { useAuth } from '../hooks/useAuth';
import { getDefaultPathForRole } from '../models/auth';
import {
  activateAccountSchema,
  type ActivateAccountFormValues,
} from '../models/authSchemas';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function ActivateAccountForm() {
  const { user, activateAccount, logout } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ActivateAccountFormValues>({
    resolver: zodResolver(activateAccountSchema),
    mode: 'onBlur',
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ActivateAccountFormValues) => {
    setErrorMessage(null);

    try {
      await activateAccount(data.newPassword);
      toast.success('¡Cuenta activada con éxito! Bienvenido al gimnasio.');
      if (user) {
        navigate(getDefaultPathForRole(user.role), { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Ocurrió un error al activar la cuenta');
      }
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errorMessage && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive flex items-start gap-2">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="font-medium flex-1">{errorMessage}</p>
        </div>
      )}

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="newPassword">Nueva Contraseña</FieldLabel>
          <Input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Mínimo 8 caracteres"
            disabled={isSubmitting}
            aria-invalid={!!errors.newPassword}
            {...register('newPassword')}
          />
          {errors.newPassword && <FieldError>{errors.newPassword.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirmar Contraseña</FieldLabel>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Repetí la contraseña"
            disabled={isSubmitting}
            aria-invalid={!!errors.confirmPassword}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <FieldError>{errors.confirmPassword.message}</FieldError>
          )}
        </Field>

        <Field className="pt-2">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Activando cuenta...
              </>
            ) : (
              'Activar Cuenta y Continuar'
            )}
          </Button>
        </Field>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={logout}
            className="text-xs text-muted-foreground hover:underline"
          >
            Cerrar sesión e ingresar más tarde
          </button>
        </div>
      </FieldGroup>
    </form>
  );
}