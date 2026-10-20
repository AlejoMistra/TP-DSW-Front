import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { FieldError } from '@/shared/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import type {
  CreateInstructorInput,
  Instructor,
} from '@/features/instructors/models/Instructor'
import {
  instructorFormSchema,
  type InstructorFormValues,
} from '../models/instructorFormSchema'

type InstructorFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  instructorToEdit: Instructor | null
  onSave: (data: CreateInstructorInput, id?: number) => Promise<void>
}

export default function InstructorFormDialog({
  open,
  onOpenChange,
  instructorToEdit,
  onSave,
}: InstructorFormDialogProps) {
  const isEditing = instructorToEdit !== null

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InstructorFormValues>({
    resolver: zodResolver(instructorFormSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      surname: '',
      email: '',
      phone: '',
      docType: 'DNI',
      docNumber: '',
    },
  })

  useEffect(() => {
    if (open) {
      if (instructorToEdit) {
        reset({
          name: instructorToEdit.name,
          surname: instructorToEdit.surname,
          email: instructorToEdit.email,
          phone: instructorToEdit.phone ?? '',
          docType: instructorToEdit.docType ?? 'DNI',
          docNumber: instructorToEdit.docNumber ?? '',
        })
      } else {
        reset({
          name: '',
          surname: '',
          email: '',
          phone: '',
          docType: 'DNI',
          docNumber: '',
        })
      }
    }
  }, [open, instructorToEdit, reset])

  async function onSubmit(data: InstructorFormValues) {
    const payload: CreateInstructorInput = {
      name: data.name.trim(),
      surname: data.surname.trim(),
      email: data.email.trim(),
      phone: data.phone?.trim() || null,
      docType: data.docType,
      docNumber: data.docNumber.trim(),
    }

    await onSave(payload, instructorToEdit?.id)
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

        <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="instructor-name">Nombre</Label>
              <Input
                id="instructor-name"
                {...register('name')}
                disabled={isSubmitting}
                aria-invalid={!!errors.name}
              />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="instructor-surname">Apellido</Label>
              <Input
                id="instructor-surname"
                {...register('surname')}
                disabled={isSubmitting}
                aria-invalid={!!errors.surname}
              />
              {errors.surname && <FieldError>{errors.surname.message}</FieldError>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="instructor-docType">Tipo de documento</Label>
              <Controller
                control={control}
                name="docType"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="instructor-docType" className="w-full">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DNI">DNI</SelectItem>
                      <SelectItem value="PASAPORTE">Pasaporte</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.docType && <FieldError>{errors.docType.message}</FieldError>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="instructor-docNumber">Nº de documento</Label>
              <Input
                id="instructor-docNumber"
                {...register('docNumber')}
                disabled={isSubmitting}
                aria-invalid={!!errors.docNumber}
              />
              {errors.docNumber && <FieldError>{errors.docNumber.message}</FieldError>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="instructor-email">Email</Label>
            <Input
              id="instructor-email"
              type="email"
              {...register('email')}
              disabled={isSubmitting}
              aria-invalid={!!errors.email}
            />
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="instructor-phone">Teléfono</Label>
            <Input
              id="instructor-phone"
              type="tel"
              placeholder="Ej: 1122334455"
              {...register('phone')}
              disabled={isSubmitting}
              aria-invalid={!!errors.phone}
            />
            <p className="text-xs text-muted-foreground">
              Opcional. Debe contener entre 7 y 15 dígitos.
            </p>
            {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
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
