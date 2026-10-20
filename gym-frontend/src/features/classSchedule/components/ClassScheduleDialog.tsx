import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash2 } from 'lucide-react'
import { ConfirmDeleteDialog } from '@/shared/components/ConfirmDeleteDialog'
import type {
  ClassSchedule,
  CategoryEnum,
  CreateClassScheduleInput,
} from '../models/ClassSchedule'
import {
  classScheduleFormSchema,
  type ClassScheduleFormValues,
} from '../models/classScheduleFormSchema'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { FieldError } from '@/shared/components/ui/field'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'

export const CLASS_CATEGORIES: { value: CategoryEnum; label: string }[] = [
  { value: 'CARDIO', label: 'Cardio' },
  { value: 'CROSSFIT', label: 'CrossFit' },
  { value: 'DANCE', label: 'Dance' },
  { value: 'FUNCTIONAL', label: 'Functional' },
  { value: 'HIIT', label: 'HIIT' },
  { value: 'PILATES', label: 'Pilates' },
  { value: 'SPINNING', label: 'Spinning' },
  { value: 'STRETCHING', label: 'Stretching' },
  { value: 'YOGA', label: 'Yoga' },
  { value: 'OTHER', label: 'Otro' },
]

interface ClassScheduleDialogProps {
  open: boolean
  classSchedule?: ClassSchedule | null
  onClose: () => void
  onSubmit: (data: CreateClassScheduleInput) => Promise<any>
  onDelete?: (id: number | string) => Promise<any>
}

export function ClassScheduleDialog({
  open,
  classSchedule,
  onClose,
  onSubmit,
  onDelete,
}: ClassScheduleDialogProps) {
  const isEditing = Boolean(classSchedule)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClassScheduleFormValues>({
    resolver: zodResolver(classScheduleFormSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      category: 'HIIT',
      durationMinutes: 45,
      maxCapacity: 15,
      description: '',
    },
  })

  useEffect(() => {
    if (open) {
      if (classSchedule) {
        reset({
          name: classSchedule.name || '',
          category: (classSchedule.category as any) || 'HIIT',
          durationMinutes: classSchedule.durationMinutes || 45,
          maxCapacity: classSchedule.maxCapacity || 15,
          description: classSchedule.description || '',
        })
      } else {
        reset({
          name: '',
          category: 'HIIT',
          durationMinutes: 45,
          maxCapacity: 15,
          description: '',
        })
      }
      setConfirmDelete(false)
    }
  }, [open, classSchedule, reset])

  const onFormSubmit = async (data: ClassScheduleFormValues) => {
    try {
      await onSubmit({
        name: data.name.trim(),
        description: data.description?.trim() || null,
        category: data.category,
        durationMinutes: Number(data.durationMinutes),
        maxCapacity: Number(data.maxCapacity),
      })
      onClose()
    } catch {
      // Manejado por toast superior
    }
  }

  const handleDelete = async () => {
    if (!classSchedule || !onDelete) return
    try {
      await onDelete(classSchedule.id)
      setConfirmDelete(false)
      onClose()
    } catch {
      // Error manejado por onDelete
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
        <DialogContent className="max-w-md p-6 bg-card border border-border/80 rounded-2xl shadow-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div>
                <DialogTitle className="text-lg font-bold text-foreground">
                  {isEditing ? `Editar Tipo de Clase` : 'Nuevo Tipo de Clase'}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  {isEditing
                    ? `Modificá los datos del tipo de clase ${classSchedule?.name}`
                    : 'Creá una nueva plantilla de clase con su duración y cupo predeterminado.'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form noValidate onSubmit={handleSubmit(onFormSubmit)} className="mt-4 flex flex-col gap-4">
            {/* Nombre */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Nombre de la Clase *
              </Label>
              <Input
                {...register('name')}
                placeholder="Ej. HIIT Warriors, Yoga Flow"
                disabled={isSubmitting}
                aria-invalid={!!errors.name}
              />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </div>

            {/* Categoría */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Categoría *
              </Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="w-full h-9 font-medium">
                      <SelectValue placeholder="Seleccioná una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {CLASS_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <FieldError>{errors.category.message}</FieldError>
              )}
            </div>

            {/* Descripción */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Descripción (Opcional, máx 1000 caracteres)
              </Label>
              <Textarea
                {...register('description')}
                placeholder="Detalles sobre los ejercicios, intensidad o nivel requerido..."
                rows={2}
                disabled={isSubmitting}
                aria-invalid={!!errors.description}
              />
              {errors.description && (
                <FieldError>{errors.description.message}</FieldError>
              )}
            </div>

            {/* Duración y Cupos */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Duración (min) *
                </Label>
                <Input
                  type="number"
                  min={5}
                  max={300}
                  {...register('durationMinutes', { valueAsNumber: true })}
                  disabled={isSubmitting}
                  aria-invalid={!!errors.durationMinutes}
                />
                {errors.durationMinutes && (
                  <FieldError>{errors.durationMinutes.message}</FieldError>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Cupos Máximos *
                </Label>
                <Input
                  type="number"
                  min={1}
                  max={500}
                  {...register('maxCapacity', { valueAsNumber: true })}
                  disabled={isSubmitting}
                  aria-invalid={!!errors.maxCapacity}
                />
                {errors.maxCapacity && (
                  <FieldError>{errors.maxCapacity.message}</FieldError>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between border-t border-border/60 pt-4 mt-2">
              {isEditing && onDelete ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmDelete(true)}
                  disabled={isSubmitting}
                  className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive gap-1.5"
                >
                  <Trash2 className="size-3.5" />
                  Eliminar
                </Button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? 'Guardando...'
                    : isEditing
                      ? 'Guardar cambios'
                      : 'Crear Tipo de Clase'}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={confirmDelete}
        title="¿Confirmás eliminar este tipo de clase?"
        description={`Esta acción eliminará "${classSchedule?.name}" del sistema y no se puede deshacer.`}
        isLoading={isSubmitting}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
      />
    </>
  )
}

export default ClassScheduleDialog
