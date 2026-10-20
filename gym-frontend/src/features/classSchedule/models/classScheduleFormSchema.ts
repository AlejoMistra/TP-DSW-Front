import { z } from 'zod';

export const classScheduleFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre de la clase es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(200, 'El nombre no puede superar los 200 caracteres'),
  category: z.enum(
    [
      'CARDIO',
      'CROSSFIT',
      'DANCE',
      'FUNCTIONAL',
      'HIIT',
      'PILATES',
      'SPINNING',
      'STRETCHING',
      'YOGA',
      'OTHER',
    ],
    {
      error: (iss) =>
        iss.input === undefined ? 'Seleccione una categoría' : undefined,
    },
  ),
  durationMinutes: z
    .number({
      error: (iss) =>
        iss.input === undefined
          ? 'La duración es requerida'
          : 'La duración debe ser un número entero',
    })
    .int('La duración debe ser un número entero')
    .min(5, 'La duración mínima es de 5 minutos')
    .max(300, 'La duración máxima es de 300 minutos'),
  maxCapacity: z
    .number({
      error: (iss) =>
        iss.input === undefined
          ? 'Los cupos son requeridos'
          : 'Los cupos deben ser un número entero',
    })
    .int('Los cupos deben ser un número entero')
    .min(1, 'La capacidad mínima es de 1 cupo')
    .max(500, 'La capacidad máxima es de 500 cupos'),
  description: z
    .string()
    .trim()
    .max(1000, 'La descripción no puede superar los 1000 caracteres')
    .optional()
    .or(z.literal('')),
});

export type ClassScheduleFormValues = z.infer<typeof classScheduleFormSchema>;
