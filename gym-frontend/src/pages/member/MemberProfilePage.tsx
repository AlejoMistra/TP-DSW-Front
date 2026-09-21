import {
  CreditCard,
  FileText,
  History,
} from 'lucide-react'
import { usePageTitle } from '@/shared/context/PageHeaderContext'
import ProfileSummary from '@/features/members/components/ProfileSummary'
import ProfileNavigationCard from '@/features/members/components/ProfileNavigationCard'

export default function MemberProfilePage() {
  usePageTitle('Mi Perfil')

  // TODO: reemplazar estos datos por el socio obtenido
  // desde el contexto de autenticación.
  const member = {
    name: 'Nombre del socio',
    email: 'correo@ejemplo.com',
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <ProfileSummary
        name={member.name}
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