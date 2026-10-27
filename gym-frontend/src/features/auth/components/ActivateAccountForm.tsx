import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/shared/components/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { authService } from '../api/authService';
import {
  activateAccountSchema,
  type ActivateAccountFormValues,
} from '../models/authSchemas';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function ActivateAccountForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const initialEmail = searchParams.get('email') ?? '';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ActivateAccountFormValues>({
    resolver: zodResolver(activateAccountSchema),
    mode: 'onBlur',
    defaultValues: {
      email: initialEmail,
      name: '',
      surname: '',
      docNumber: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (initialEmail) {
      setValue('email', initialEmail);
    }
  }, [initialEmail, setValue]);

  const onSubmit = async (data: ActivateAccountFormValues) => {
    setErrorMessage(null);

    try {
      const response = await authService.activateAccount({
        email: data.email.trim(),
        name: data.name.trim(),
        surname: data.surname.trim(),
        docNumber: data.docNumber.trim(),
        newPassword: data.newPassword,
      });

      toast.success(response.message || 'Cuenta activada exitosamente. Ya puedes iniciar sesión.');
      navigate('/', { replace: true });
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message || 'No se pudieron verificar los datos');
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="name">Nombre</FieldLabel>
            <Input
              id="name"
              disabled={isSubmitting}
              aria-invalid={!!errors.name}
              {...register('name')}
            />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>
          <Field>
            <FieldLabel htmlFor="surname">Apellido</FieldLabel>
            <Input
              id="surname"
              disabled={isSubmitting}
              aria-invalid={!!errors.surname}
              {...register('surname')}
            />
            {errors.surname && <FieldError>{errors.surname.message}</FieldError>}
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="docNumber">Número de Documento (DNI)</FieldLabel>
          <Input
            id="docNumber"
            disabled={isSubmitting}
            aria-invalid={!!errors.docNumber}
            {...register('docNumber')}
          />
          {errors.docNumber && <FieldError>{errors.docNumber.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="activation-email">Correo electrónico</FieldLabel>
          <Input
            id="activation-email"
            type="email"
            autoComplete="email"
            disabled={isSubmitting}
            aria-invalid={!!errors.email}
            {...register('email')}
          />
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="newPassword">Nueva Contraseña</FieldLabel>
          <Input
            id="newPassword"
            type="password"
            autoComplete="new-password"
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
                Validando y activando...
              </>
            ) : (
              'Activar Cuenta'
            )}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="text-center pt-2">
            ¿Ya activaste tu cuenta?{' '}
            <Link
              to="/"
              className="font-medium text-primary underline underline-offset-4 hover:opacity-80"
            >
              Iniciar sesión
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
