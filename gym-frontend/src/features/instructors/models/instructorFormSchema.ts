import { z } from 'zod';

export const instructorFormSchema = z.object({
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
  email: z
    .string()
    .trim()
    .min(1, 'El email es requerido')
    .email('Ingrese un correo electrónico válido'),
  phone: z
    .string()
    .trim()
    .regex(/^\d{7,15}$/, 'El teléfono debe tener entre 7 y 15 dígitos')
    .optional()
    .or(z.literal('')),
  docType: z.enum(['DNI', 'PASAPORTE'], {
    error: (iss) =>
      iss.input === undefined ? 'El tipo de documento es requerido' : undefined,
  }),
  docNumber: z
    .string()
    .trim()
    .min(1, 'El número de documento es requerido')
    .min(6, 'El documento debe tener al menos 6 caracteres')
    .max(20, 'El documento no puede tener más de 20 caracteres'),
});

export type InstructorFormValues = z.infer<typeof instructorFormSchema>;
