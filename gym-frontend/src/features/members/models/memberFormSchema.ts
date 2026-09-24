import { z } from 'zod';

export const memberFormSchema = z.object({
  name: z
    .string({
      error: (iss) => (iss.input === undefined ? 'El nombre es requerido' : undefined),
    })
    .trim()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres'),
  surname: z
    .string({
      error: (iss) => (iss.input === undefined ? 'El apellido es requerido' : undefined),
    })
    .trim()
    .min(1, 'El apellido es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'El apellido no puede tener más de 100 caracteres'),
  email: z
    .string({
      error: (iss) => (iss.input === undefined ? 'El email es requerido' : undefined),
    })
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
    error: (iss) => (iss.input === undefined ? 'El tipo de documento es requerido' : undefined),
  }),
  docNumber: z
    .string({
      error: (iss) => (iss.input === undefined ? 'El número de documento es requerido' : undefined),
    })
    .trim()
    .min(1, 'El número de documento es requerido')
    .min(6, 'El documento debe tener al menos 6 caracteres')
    .max(20, 'El documento no puede tener más de 20 caracteres'),
  birthDate: z
    .date({
      error: (iss) =>
        iss.input === undefined
          ? 'La fecha de nacimiento es obligatoria'
          : 'Fecha de nacimiento inválida',
    })
    .max(new Date(), 'La fecha de nacimiento no puede ser futura'),
  status: z.enum(['ACTIVE', 'INACTIVE'], {
    error: (iss) => (iss.input === undefined ? 'El estado es requerido' : undefined),
  }),
});

export type MemberFormValues = z.infer<typeof memberFormSchema>;