import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
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
import { Textarea } from '@/shared/components/ui/textarea'
import { FieldError } from '@/shared/components/ui/field'
import type {
  CreateMembershipPlanInput,
  MembershipPlan,
} from '@/features/membershipPlans/models/MembershipPlan'
import {
  membershipPlanFormSchema,
  type MembershipPlanFormValues,
} from '../models/membershipPlanFormSchema'

type MembershipPlanFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  planToEdit?: MembershipPlan | null
  onSave: (plan: CreateMembershipPlanInput, id?: number) => Promise<any>
}

export default function MembershipPlanFormDialog({
  open,
  onOpenChange,
  planToEdit,
  onSave,
}: MembershipPlanFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MembershipPlanFormValues>({
    resolver: zodResolver(membershipPlanFormSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      price: undefined,
      durationDays: undefined,
      description: '',
    },
  })

  useEffect(() => {
    if (open) {
      if (planToEdit) {
        reset({
          name: planToEdit.name,
          price: planToEdit.price,
          durationDays: planToEdit.durationDays,
          description: planToEdit.description ?? '',
        })
      } else {
        reset({
          name: '',
          price: undefined,
          durationDays: undefined,
          description: '',
        })
      }
    }
  }, [open, planToEdit, reset])

  async function onSubmit(data: MembershipPlanFormValues) {
    try {
      await onSave(
        {
          name: data.name.trim(),
          price: Number(data.price),
          durationDays: Number(data.durationDays),
          description: data.description?.trim() || undefined,
        },
        planToEdit?.id,
      )
      onOpenChange(false)
    } catch {
      // Si falla onSave, el modal permanece abierto para que el usuario pueda corregir
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{planToEdit ? 'Editar Plan' : 'Nuevo Plan'}</DialogTitle>
          <DialogDescription>
            {planToEdit
              ? 'Modificá los datos del plan seleccionado.'
              : 'Completá los datos para crear un plan nuevo.'}
          </DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="plan-name">Nombre</Label>
            <Input
              id="plan-name"
              {...register('name')}
              disabled={isSubmitting}
              aria-invalid={!!errors.name}
            />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="plan-price">Precio ($)</Label>
              <Input
                id="plan-price"
                type="number"
                step="any"
                {...register('price', { valueAsNumber: true })}
                disabled={isSubmitting}
                aria-invalid={!!errors.price}
              />
              {errors.price && <FieldError>{errors.price.message}</FieldError>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="plan-durationDays">Duración (días)</Label>
              <Input
                id="plan-durationDays"
                type="number"
                step="1"
                {...register('durationDays', { valueAsNumber: true })}
                disabled={isSubmitting}
                aria-invalid={!!errors.durationDays}
              />
              {errors.durationDays && (
                <FieldError>{errors.durationDays.message}</FieldError>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="plan-description">Descripción</Label>
            <Textarea
              id="plan-description"
              rows={3}
              {...register('description')}
              disabled={isSubmitting}
              aria-invalid={!!errors.description}
            />
            {errors.description && (
              <FieldError>{errors.description.message}</FieldError>
            )}
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
                : planToEdit
                  ? 'Guardar cambios'
                  : 'Crear plan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
