import { useState } from 'react'
import { Pencil } from 'lucide-react'
import BackButton from '@/shared/components/BackButton'

import { Button } from '@/shared/components/ui/button'
import MemberForm from '@/features/members/components/MemberForm'
import MemberPersonalDetails from '@/features/members/components/MemberPersonalDetails'
import { useMemberProfileData } from '@/features/members/hooks/useMemberProfileData'
import { usePageTitle } from '@/shared/context/PageHeaderContext'
import { useCurrentMemberId } from '@/features/auth/hooks/useCurrentMemberId'

export default function MemberDataPage() {
  usePageTitle('Mis datos')

  const [isEditing, setIsEditing] = useState(false)

  // Con este hook obtenemos el ID del socio actual desde el contexto de autenticación
  const currentMemberId = useCurrentMemberId()

  const {
    member,
    loading,
    saving,
    error,
    handleSubmit,
  } = useMemberProfileData(currentMemberId)

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-2xl border border-border/70 bg-card/80 p-8 text-center">
          <p className="text-muted-foreground">
            Cargando tus datos...
          </p>
        </div>
      </div>
    )
  }

  if (error || !member) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-2xl border border-destructive/30 bg-card/80 p-8 text-center">
          <p className="text-sm text-destructive">
            {error || 'No se encontraron tus datos.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <BackButton to="/socio/perfil" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Mis datos
          </h1>

          <p className="text-sm text-muted-foreground">
            Consultá y actualizá tu información personal.
          </p>
        </div>

        {!isEditing && (
          <Button
            type="button"
            onClick={() => setIsEditing(true)}
            className="w-full sm:w-auto"
          >
            <Pencil className="mr-2 size-4" />
            Editar perfil
          </Button>
        )}
      </div>

      {!isEditing ? (
        <MemberPersonalDetails member={member} />
      ) : (
        <section className="space-y-4">
          <MemberForm
            member={member}
            mode="self-service"
            formId="member-profile-form"
            onSubmit={handleSubmit}
          />

          <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
              disabled={saving}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              form="member-profile-form"
              disabled={saving}
              className="w-full sm:w-auto"
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </div>
        </section>
      )}
    </div>
  )
}