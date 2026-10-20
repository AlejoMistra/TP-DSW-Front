import { z } from 'zod';

export const exerciseFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre del ejercicio no puede estar vacío')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(200, 'El nombre no puede superar los 200 caracteres'),
  muscleGroup: z
    .string()
    .trim()
    .min(1, 'El grupo muscular no puede estar vacío')
    .max(100, 'El grupo muscular no puede superar los 100 caracteres'),
  difficultyLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], {
    error: (iss) =>
      iss.input === undefined ? 'Seleccione una dificultad' : undefined,
  }),
  description: z
    .string()
    .trim()
    .max(1000, 'La descripción no puede superar los 1000 caracteres')
    .optional()
    .or(z.literal('')),
});

export type ExerciseFormValues = z.infer<typeof exerciseFormSchema>;
