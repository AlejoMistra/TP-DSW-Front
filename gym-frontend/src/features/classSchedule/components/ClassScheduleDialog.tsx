import React, { useState, useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import { ConfirmDeleteDialog } from '@/shared/components/ConfirmDeleteDialog'
import type {
  ClassSchedule,
  CategoryEnum,
  CreateClassScheduleInput,
} from '../models/ClassSchedule'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
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

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<CategoryEnum>('HIIT')
  const [durationMinutes, setDurationMinutes] = useState('45')
  const [maxCapacity, setMaxCapacity] = useState('15')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (open) {
      if (classSchedule) {
        setName(classSchedule.name || '')
        setDescription(classSchedule.description || '')
        setCategory(classSchedule.category || 'HIIT')
        setDurationMinutes(String(classSchedule.durationMinutes || 45))
        setMaxCapacity(String(classSchedule.maxCapacity || 15))
      } else {
        setName('')
        setDescription('')
        setCategory('HIIT')
        setDurationMinutes('45')
        setMaxCapacity('15')
      }
      setConfirmDelete(false)
    }
  }, [open, classSchedule])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || null,
        category,
        durationMinutes: Number(durationMinutes) || 45,
        maxCapacity: Number(maxCapacity) || 15,
      })
      onClose()
    } catch {
      // Handled by parent toasts
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!classSchedule || !onDelete) return
    setIsSubmitting(true)
    try {
      await onDelete(classSchedule.id)
      setConfirmDelete(false)
      onClose()
    } finally {
      setIsSubmitting(false)
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

          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
            {/* Nombre */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Nombre de la Clase *
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. HIIT Warriors, Yoga Flow"
                required
              />
            </div>

            {/* Categoría */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Categoría *
              </Label>
              <Select
                value={category}
                onValueChange={(val) => setCategory(val as CategoryEnum)}
                required
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
            </div>

            {/* Descripción */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Descripción (Opcional)
              </Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detalles sobre los ejercicios, intensidad o nivel requerido..."
                rows={2}
              />
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
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Cupos Máximos *
                </Label>
                <Input
                  type="number"
                  min={1}
                  max={500}
                  value={maxCapacity}
                  onChange={(e) => setMaxCapacity(e.target.value)}
                  required
                />
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
                  disabled={isSubmitting || !name.trim()}
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
