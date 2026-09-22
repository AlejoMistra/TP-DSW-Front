import {
  CreditCard,
  FileText,
  History,
} from 'lucide-react'

import { usePageTitle } from '@/shared/context/PageHeaderContext'
import ProfileSummary from '@/features/members/components/ProfileSummary'
import ProfileNavigationCard from '@/features/members/components/ProfileNavigationCard'
import { useMemberProfileData } from '@/features/members/hooks/useMemberProfileData'

export default function MemberProfilePage() {
  usePageTitle('Mi Perfil')

  // Temporal hasta implementar autenticación.
  const currentMemberId = 1

  const {
    member,
    loading,
    error,
  } = useMemberProfileData(currentMemberId)

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-2xl border border-border/70 bg-card/80 p-8 text-center">
          <p className="text-muted-foreground">
            Cargando tu perfil...
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
            {error || 'No se encontró la información del socio.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <ProfileSummary
        name={`${member.name} ${member.surname}`}
        email={member.email}
      />

      <section className="space-y-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            Mi cuenta
          </h2>

          <p className="text-sm text-muted-foreground">
            Consultá la información de tu cuenta y membresía.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <ProfileNavigationCard
            to="/socio/perfil/datos"
            title="Mis datos"
            description="Consultá tu información personal."
            icon={FileText}
          />

          <ProfileNavigationCard
            to="/socio/perfil/membresia"
            title="Membresía"
            description="Revisá tu plan y vencimiento."
            icon={CreditCard}
          />

          <ProfileNavigationCard
            to="/socio/perfil/pagos"
            title="Historial de pagos"
            description="Consultá tus pagos realizados."
            icon={History}
          />
        </div>
      </section>
    </div>
  )
}