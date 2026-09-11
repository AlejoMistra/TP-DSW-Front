import { useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'

import type {
  CreateInstructorInput,
  Instructor,
} from '@/features/instructors/models/Instructor'

type InstructorFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  instructorToEdit: Instructor | null
  onSave: (
    data: CreateInstructorInput,
    id?: number,
  ) => Promise<void>
}

type FormState = {
  name: string
  surname: string
  email: string
  phone: string
}

const emptyForm: FormState = {
  name: '',
  surname: '',
  email: '',
  phone: '',
}

function getInitialForm(instructor: Instructor | null): FormState {
  if (!instructor) {
    return emptyForm
  }

  return {
    name: instructor.name,
    surname: instructor.surname,
    email: instructor.email,
    phone: instructor.phone ?? '',
  }
}

export default function InstructorFormDialog({
  open,
  onOpenChange,
  instructorToEdit,
  onSave,
}: InstructorFormDialogProps) {
  const [form, setForm] = useState<FormState>(() =>
    getInitialForm(instructorToEdit),
  )

  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEditing = instructorToEdit !== null

  function updateField(field: keyof FormState, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data: CreateInstructorInput = {
      name: form.name.trim(),
      surname: form.surname.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
    }

    try {
      setIsSubmitting(true)

      await onSave(data, instructorToEdit?.id)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar instructor' : 'Nuevo instructor'}
          </DialogTitle>

          <DialogDescription>
            {isEditing
              ? 'Modificá los datos del instructor seleccionado.'
              : 'Completá los datos para registrar un instructor nuevo.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="instructor-name">
              Nombre
            </Label>

            <Input
              id="instructor-name"
              value={form.name}
              onChange={(event) =>
                updateField('name', event.target.value)
              }
              minLength={2}
              maxLength={100}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="instructor-surname">
              Apellido
            </Label>

            <Input
              id="instructor-surname"
              value={form.surname}
              onChange={(event) =>
                updateField('surname', event.target.value)
              }
              minLength={2}
              maxLength={100}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="instructor-email">
              Email
            </Label>

            <Input
              id="instructor-email"
              type="email"
              value={form.email}
              onChange={(event) =>
                updateField('email', event.target.value)
              }
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="instructor-phone">
              Teléfono
            </Label>

            <Input
              id="instructor-phone"
              type="tel"
              value={form.phone}
              onChange={(event) =>
                updateField('phone', event.target.value)
              }
              pattern="[0-9]{7,15}"
              minLength={7}
              maxLength={15}
              placeholder="Ej: 1122334455"
              disabled={isSubmitting}
            />

            <p className="text-xs text-muted-foreground">
              Opcional. Debe contener entre 7 y 15 dígitos.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? 'Guardando...'
                : isEditing
                  ? 'Guardar cambios'
                  : 'Crear instructor'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}