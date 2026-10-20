import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { FieldError } from '@/shared/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Dumbbell } from 'lucide-react'
import { exerciseService } from '../api/exerciseService'
import type { Exercise, CreateExerciseInput } from '../models/Exercise'
import {
  exerciseFormSchema,
  type ExerciseFormValues,
} from '../models/exerciseFormSchema'

interface ExerciseFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  exercise?: Exercise | null
  onSuccess: () => void
}

export function ExerciseFormDialog({
  open,
  onOpenChange,
  exercise,
  onSuccess,
}: ExerciseFormDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExerciseFormValues>({
    resolver: zodResolver(exerciseFormSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      muscleGroup: '',
      difficultyLevel: 'BEGINNER',
      description: '',
    },
  })

  useEffect(() => {
    if (open) {
      if (exercise) {
        reset({
          name: exercise.name,
          muscleGroup: exercise.muscleGroup,
          difficultyLevel: exercise.difficultyLevel,
          description: exercise.description || '',
        })
      } else {
        reset({
          name: '',
          muscleGroup: '',
          difficultyLevel: 'BEGINNER',
          description: '',
        })
      }
    }
  }, [open, exercise, reset])

  const onSubmit = async (data: ExerciseFormValues) => {
    try {
      const dataToSubmit: CreateExerciseInput = {
        name: data.name.trim(),
        muscleGroup: data.muscleGroup.trim(),
        difficultyLevel: data.difficultyLevel,
        description: data.description?.trim() || null,
      }

      if (exercise) {
        await exerciseService.update(exercise.id, dataToSubmit)
        toast.success('Ejercicio actualizado exitosamente')
      } else {
        await exerciseService.create(dataToSubmit)
        toast.success('Ejercicio creado exitosamente')
      }

      onOpenChange(false)
      onSuccess()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Dumbbell className="size-5" aria-hidden="true" />
            {exercise ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}
          </DialogTitle>
          <DialogDescription>
            {exercise
              ? 'Modifica los datos del ejercicio'
              : 'Crea un nuevo ejercicio'}
          </DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                placeholder="Ej: Flexiones"
                {...register('name')}
                disabled={isSubmitting}
                aria-invalid={!!errors.name}
              />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="muscleGroup">Grupo Muscular *</Label>
              <Input
                id="muscleGroup"
                placeholder="Ej: Pecho"
                {...register('muscleGroup')}
                disabled={isSubmitting}
                aria-invalid={!!errors.muscleGroup}
              />
              {errors.muscleGroup && (
                <FieldError>{errors.muscleGroup.message}</FieldError>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="difficultyLevel">Dificultad *</Label>
              <Controller
                control={control}
                name="difficultyLevel"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="difficultyLevel" className="w-full">
                      <SelectValue placeholder="Selecciona dificultad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BEGINNER">Principiante</SelectItem>
                      <SelectItem value="INTERMEDIATE">Intermedio</SelectItem>
                      <SelectItem value="ADVANCED">Avanzado</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.difficultyLevel && (
                <FieldError>{errors.difficultyLevel.message}</FieldError>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="description">
                Descripción{' '}
                <span className="text-muted-foreground text-xs font-normal">
                  (opcional, máx 1000 caracteres)
                </span>
              </Label>
              <Textarea
                id="description"
                placeholder="Descripción del ejercicio"
                rows={3}
                {...register('description')}
                disabled={isSubmitting}
                aria-invalid={!!errors.description}
              />
              {errors.description && (
                <FieldError>{errors.description.message}</FieldError>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
export default ExerciseFormDialog