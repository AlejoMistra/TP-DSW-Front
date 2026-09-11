import { useState, useEffect } from 'react'
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
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<{
    name: string
    muscleGroup: string
    difficultyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
    description: string
  }>({
    name: '',
    muscleGroup: '',
    difficultyLevel: 'BEGINNER',
    description: '',
  })

  useEffect(() => {
    if (exercise) {
      setFormData({
        name: exercise.name,
        muscleGroup: exercise.muscleGroup,
        difficultyLevel: exercise.difficultyLevel,
        description: exercise.description || '',
      })
    } else {
      setFormData({
        name: '',
        muscleGroup: '',
        difficultyLevel: 'BEGINNER',
        description: '',
      })
    }
  }, [exercise])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const dataToSubmit: CreateExerciseInput = {
        name: formData.name,
        muscleGroup: formData.muscleGroup,
        difficultyLevel: formData.difficultyLevel,
        description: formData.description,
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
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setFormData({
        name: '',
        muscleGroup: '',
        difficultyLevel: 'BEGINNER',
        description: '',
      })
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Dumbbell className="size-5" aria-hidden="true" />
            {exercise ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}
          </DialogTitle>
          <DialogDescription>
            {exercise ? 'Modifica los datos del ejercicio' : 'Crea un nuevo ejercicio'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Ej: Flexiones"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="muscleGroup">Grupo Muscular *</Label>
              <Input
                id="muscleGroup"
                name="muscleGroup"
                placeholder="Ej: Pecho"
                value={formData.muscleGroup}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficultyLevel">Dificultad *</Label>
              <Select
                value={formData.difficultyLevel}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    difficultyLevel: value as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
                  })
                }
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
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Descripción del ejercicio"
                value={formData.description || ''}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}