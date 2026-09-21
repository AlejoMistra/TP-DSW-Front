import { Input } from '@/shared/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { User } from 'lucide-react'
import { useState } from 'react'

import {
  type Member,
  type CreateMemberInput,
  type UpdateMemberInput,
  type DocType,
  type Status,
} from '../models/Member'

export type MemberFormMode = 'admin' | 'self-service'

type MemberFormProps = {
  showActions?: boolean
  member?: Member
  mode?: MemberFormMode
  formId?: string
  onSubmit: (
    data: CreateMemberInput | UpdateMemberInput) => Promise<void>
}

export default function MemberForm({
  member,
  mode = 'admin',
  formId = 'member-form',
  onSubmit,
}: MemberFormProps) {
  const isSelfService = mode === 'self-service'

  const [formData, setFormData] = useState<CreateMemberInput>({
    name: member?.name || '',
    surname: member?.surname || '',
    email: member?.email || '',
    phone: member?.phone || '',
    docType: member?.docType || 'DNI',
    docNumber: member?.docNumber || '',
    birthDate: member?.birthDate?.split('T')[0] || '',
    status: member?.status || 'ACTIVE',
    membershipPlanId: 0,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'membershipPlanId' ? parseInt(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const dataToSubmit: CreateMemberInput | UpdateMemberInput = member
      ? isSelfService
        ? {
            email: formData.email,
            phone: formData.phone,
          }
        : {
            name: formData.name,
            surname: formData.surname,
            email: formData.email,
            phone: formData.phone,
            docType: formData.docType,
            docNumber: formData.docNumber,
            birthDate: formData.birthDate,
            status: formData.status,
          }
      : formData

    await onSubmit(dataToSubmit)
  }

  return (
    <form
      id={formId}
      onSubmit={handleSubmit}
      className="items-baseline rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6"
    >
      <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
        <User className="size-5" aria-hidden="true" />

        {isSelfService
          ? 'Editar mis datos'
          : member
            ? 'Editar socio'
            : 'Información del socio'}
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor={`${formId}-name`} className="text-sm font-medium">
            Nombre
          </label>

          <Input
            id={`${formId}-name`}
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={isSelfService}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor={`${formId}-surname`} className="text-sm font-medium">
            Apellido
          </label>

          <Input
            id={`${formId}-surname`}
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            disabled={isSelfService}
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor={`${formId}-birthDate`}
            className="text-sm font-medium"
          >
            Fecha de nacimiento
          </label>

          <Input
            id={`${formId}-birthDate`}
            name="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={handleChange}
            disabled={isSelfService}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor={`${formId}-docNumber`}
            className="text-sm font-medium"
          >
            Nº de documento
          </label>

          <Input
            id={`${formId}-docNumber`}
            name="docNumber"
            value={formData.docNumber}
            onChange={handleChange}
            disabled={isSelfService}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor={`${formId}-docType`} className="text-sm font-medium">
            Tipo de documento
          </label>

          <Select
            value={formData.docType}
            disabled={isSelfService}
            onValueChange={(val) =>
              setFormData((prev) => ({
                ...prev,
                docType: val as DocType,
              }))
            }
          >
            <SelectTrigger id={`${formId}-docType`} className="w-full">
              <SelectValue placeholder="Tipo de documento" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="DNI">DNI</SelectItem>
              <SelectItem value="PASAPORTE">Pasaporte</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor={`${formId}-email`} className="text-sm font-medium">
            Email
          </label>

          <Input
            id={`${formId}-email`}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor={`${formId}-phone`} className="text-sm font-medium">
            Teléfono
          </label>

          <Input
            id={`${formId}-phone`}
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor={`${formId}-status`} className="text-sm font-medium">
            Estado
          </label>

          <Select
            value={formData.status}
            disabled={isSelfService}
            onValueChange={(val) =>
              setFormData((prev) => ({
                ...prev,
                status: val as Status,
              }))
            }
          >
            <SelectTrigger id={`${formId}-status`} className="w-full">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ACTIVE">Activo</SelectItem>
              <SelectItem value="INACTIVE">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </form>
  )
}