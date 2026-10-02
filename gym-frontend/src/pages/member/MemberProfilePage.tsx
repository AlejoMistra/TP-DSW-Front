import {
  FileText,
  HelpCircle,
  History,
  LogOut,
} from 'lucide-react'
import { usePageTitle } from '@/shared/context/PageHeaderContext'
import ProfileSummary from '@/features/members/components/ProfileSummary'
import ProfileNavigationCard from '@/features/members/components/ProfileNavigationCard'
import MemberMembershipCard from '@/features/memberships/components/MemberMembershipCard'
import { useMemberProfileData } from '@/features/members/hooks/useMemberProfileData'
import { useCurrentMemberId } from '@/features/auth/hooks/useCurrentMemberId'
import { Separator } from '@/shared/components/ui/separator'
import { useAuth } from '@/features/auth/hooks/useAuth.ts'
import { useNavigate } from 'react-router-dom'
import { useMemberMembership } from '@/features/memberships/hooks/useMemberMembership'

export default function MemberProfilePage() {
  usePageTitle('Mi Cuenta')
  const { logout } = useAuth()
  const navigate = useNavigate()
  const currentMemberId = useCurrentMemberId()

  const {
    member,
    loading: memberLoading,
    error,
  } = useMemberProfileData(currentMemberId)

  const {
    membership,
    plan,
    loading: membershipLoading,
  } = useMemberMembership(currentMemberId)

  const loading = memberLoading || membershipLoading

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

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

      {membership && plan && (
        <MemberMembershipCard
          membership={membership}
          plan={plan}
        />
      )}

      <section className="space-y-3">
        <div className="grid gap-4 md:grid-cols-3">
          <ProfileNavigationCard
            to="/socio/perfil/datos"
            title="Mis datos"
            description="Consultá tu información personal."
            icon={FileText}
          />

          <ProfileNavigationCard
            to="/socio/perfil/pagos"
            title="Historial de pagos"
            description="Consultá tus pagos realizados."
            icon={History}
          />

          <ProfileNavigationCard
            to="/socio/perfil/soporte"
            title="Soporte"
            description="Encontrá ayuda y formas de contacto."
            icon={HelpCircle}
          />
        </div>
      </section>

      <Separator />

      <div
        className="flex items-center justify-center cursor-pointer px-2 text-destructive hover:opacity-80 transition-opacity md:justify-start"
        onClick={handleLogout}
      >
        <LogOut className="mr-2 size-4" />
        <span className="text-sm font-semibold">Cerrar sesión</span>
      </div>
    </div>
  )
}