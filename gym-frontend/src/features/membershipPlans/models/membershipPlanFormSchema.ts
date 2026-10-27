import { z } from 'zod';

export const membershipPlanFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre del plan no puede estar vacío')
    .max(100, 'El nombre no puede superar los 100 caracteres'),
  price: z
    .number({
      error: (iss) =>
        iss.input === undefined
          ? 'El precio es requerido'
          : 'El precio debe ser un número válido',
    })
    .positive('El precio del plan debe ser mayor a 0'),
  durationDays: z
    .number({
      error: (iss) =>
        iss.input === undefined
          ? 'La duración es requerida'
          : 'La duración debe ser un número entero',
    })
    .int('La duración debe ser en días completos')
    .min(1, 'La duración mínima es de 1 día'),
  description: z
    .string()
    .trim()
    .max(500, 'La descripción no puede superar los 500 caracteres')
    .optional()
    .or(z.literal('')),
});

export type MembershipPlanFormValues = z.infer<typeof membershipPlanFormSchema>;
