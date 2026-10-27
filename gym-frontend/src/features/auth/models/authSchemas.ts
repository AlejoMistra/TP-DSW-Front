import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'El correo electrónico es requerido')
    .email('Ingrese un correo electrónico válido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const activateAccountSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, 'El correo electrónico es requerido')
      .email('Ingrese un correo electrónico válido'),
    name: z
      .string()
      .trim()
      .min(1, 'El nombre es requerido')
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(100, 'El nombre no puede tener más de 100 caracteres'),
    surname: z
      .string()
      .trim()
      .min(1, 'El apellido es requerido')
      .min(2, 'El apellido debe tener al menos 2 caracteres')
      .max(100, 'El apellido no puede tener más de 100 caracteres'),
    docNumber: z
      .string()
      .trim()
      .min(1, 'El número de documento es requerido')
      .min(6, 'El documento debe tener al menos 6 caracteres')
      .max(20, 'El documento no puede tener más de 20 caracteres'),
    newPassword: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmPassword: z.string().min(8, 'Debe confirmar su contraseña'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type ActivateAccountFormValues = z.infer<typeof activateAccountSchema>;
