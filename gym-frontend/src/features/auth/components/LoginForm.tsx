import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Button } from '@/shared/components/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { useAuth } from '../hooks/useAuth';
import { getDefaultPathForRole } from '../models/auth';
import { loginSchema, type LoginFormValues } from '../models/authSchemas';
import { AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPendingActivation, setIsPendingActivation] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const emailValue = watch('email');

  const onSubmit = async (data: LoginFormValues) => {
    setErrorMessage(null);
    setIsPendingActivation(false);

    try {
      const authUser = await login({ email: data.email, password: data.password });
      navigate(getDefaultPathForRole(authUser.role), { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (
          err.response?.status === 403 &&
          err.message.toLowerCase().includes('activar')
        ) {
          setIsPendingActivation(true);
          setErrorMessage(err.message);
        } else {
          setErrorMessage(err.message || 'Error al iniciar sesión');
        }
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Ocurrió un error inesperado al iniciar sesión');
      }
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errorMessage && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive flex items-start gap-2">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">{errorMessage}</p>
            {isPendingActivation && (
              <div className="mt-2">
                <Link
                  to={`/activar-cuenta?email=${encodeURIComponent(emailValue || '')}`}
                  className="inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-4 hover:opacity-80"
                >
                  Activar mi cuenta ahora
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="ejemplo@gimnasio.com"
            autoComplete="email"
            disabled={isSubmitting}
            aria-invalid={!!errors.email}
            {...register('email')}
          />
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </Field>

        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="password">Contraseña</FieldLabel>
            <span
              className="text-xs text-muted-foreground cursor-pointer hover:underline"
              onClick={() => alert('Por favor contacta a la administración para recuperar tu clave.')}
            >
              ¿Olvidaste tu contraseña?
            </span>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            disabled={isSubmitting}
            aria-invalid={!!errors.password}
            {...register('password')}
          />
          {errors.password && <FieldError>{errors.password.message}</FieldError>}
        </Field>

        <Field className="pt-2">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              'Ingresar'
            )}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="text-center pt-2">
            ¿Te dieron de alta y necesitas activar tu cuenta?{' '}
            <Link
              to="/activar-cuenta"
              className="font-medium text-primary underline underline-offset-4 hover:opacity-80"
            >
              Activala acá
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
