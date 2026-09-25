import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/shared/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { authService } from '../api/authService';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function ActivateAccountForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState(searchParams.get('email') ?? '');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (newPassword.length < 8) {
      setErrorMessage('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authService.activateAccount({
        email: email.trim(),
        name: name.trim(),
        surname: surname.trim(),
        docNumber: docNumber.trim(),
        newPassword,
      });

      toast.success(response.message || 'Cuenta activada exitosamente. Ya puedes iniciar sesión.');
      navigate('/', { replace: true });
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message || 'No se pudieron verificar los datos');
      } else {
        setErrorMessage('Ocurrió un error al activar la cuenta');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="surname">Apellido</FieldLabel>
            <Input
              id="surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="docNumber">Número de Documento (DNI)</FieldLabel>
          <Input
            id="docNumber"
            value={docNumber}
            onChange={(e) => setDocNumber(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="activation-email">Correo electrónico</FieldLabel>
          <Input
            id="activation-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={isSubmitting}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="newPassword">Nueva Contraseña</FieldLabel>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            disabled={isSubmitting}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirmar Contraseña</FieldLabel>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            disabled={isSubmitting}
          />
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
