import { Controller } from "react-hook-form"
import { Input } from "@/shared/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { FieldError } from "@/shared/components/ui/field"
import { User } from "lucide-react"
import { useMemberForm } from "../hooks/useMemberForm"
import type { Member } from "../models/Member"
import type { MemberFormValues } from "../models/memberFormSchema"
import { BirthDateInput } from "./BirthDateInput"

type MemberFormProps = {
  showActions?: boolean
  member?: Member
  onSubmit: (data: MemberFormValues) => Promise<void> | void
}

export default function MemberForm({
  member,
  onSubmit,
}: MemberFormProps) {
  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors },
  } = useMemberForm(member)

  return (
    <form
      id="member-form"
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-xl border bg-background px-4 py-2 items-baseline sm:px-6 sm:py-6"
    >
      <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
        <User className="size-5" aria-hidden="true" />
        {member ? 'Editar socio' : 'Información del socio'}
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Nombre
          </label>
          <Input
            id="name"
            {...register('name')}
            aria-invalid={!!errors.name}
            required
          />
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </div>

        <div className="space-y-2">
          <label htmlFor="surname" className="text-sm font-medium">
            Apellido
          </label>
          <Input
            id="surname"
            {...register('surname')}
            aria-invalid={!!errors.surname}
          />
          {errors.surname && <FieldError>{errors.surname.message}</FieldError>}
        </div>

        <div className="space-y-2">
          <label htmlFor="birthDate" className="text-sm font-medium">
            Fecha de nacimiento
          </label>
          <Controller
            control={control}
            name="birthDate"
            render={({ field }) => (
              <BirthDateInput
                id="birthDate"
                value={field.value}
                onChange={(date) => {
                  field.onChange(date)
                  if (errors.birthDate) {
                    trigger('birthDate')
                  }
                }}
                onBlur={field.onBlur}
                error={!!errors.birthDate}
              />
            )}
          />
          {errors.birthDate && <FieldError>{errors.birthDate.message}</FieldError>}
        </div>


        <div className="space-y-2">
          <label htmlFor="docNumber" className="text-sm font-medium">
            Nº de documento
          </label>
          <Input
            id="docNumber"
            {...register('docNumber')}
            aria-invalid={!!errors.docNumber}
          />
          {errors.docNumber && <FieldError>{errors.docNumber.message}</FieldError>}
        </div>

        <div className="space-y-2">
          <label htmlFor="docType" className="text-sm font-medium">
            Tipo de documento
          </label>
          <Controller
            control={control}
            name="docType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="docType" className="w-full">
                  <SelectValue placeholder="Tipo de documento" />
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

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            aria-invalid={!!errors.email}
          />
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Teléfono
          </label>
          <Input
            id="phone"
            {...register('phone')}
            aria-invalid={!!errors.phone}
          />
          {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
        </div>

        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium">
            Estado
          </label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Activo</SelectItem>
                  <SelectItem value="INACTIVE">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && <FieldError>{errors.status.message}</FieldError>}
        </div>
      </div>
    </form>
  )
}

