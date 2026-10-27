import {
  Dumbbell,
  Calendar,
  CreditCard,
  Info,
  ShieldAlert,
} from 'lucide-react'

import { usePageTitle } from '@/shared/context/PageHeaderContext'
import MemberMembershipCard from '@/features/memberships/components/MemberMembershipCard'
import MemberUpcomingBookingsCard from '@/features/ClassSession/components/MemberUpcomingBookingsCard'
import { useMemberProfileData } from '@/features/members/hooks/useMemberProfileData'
import { useMemberMembership } from '@/features/memberships/hooks/useMemberMembership'
import { Card } from '@/shared/components/ui/card'
import { QuickActionCard } from '@/shared/components/QuickActionCard'

export default function HomePage() {
  usePageTitle('Inicio')

  const {
    member,
    loading: memberLoading,
  } = useMemberProfileData()

  const {
    membership,
    plan,
    loading: membershipLoading,
    error: membershipError,
  } = useMemberMembership()

  const loading = memberLoading || membershipLoading

  const quickActions = [
    {
      title: 'Rutinas',
      description: 'Rutinas personalizadas',
      icon: Dumbbell,
      to: '/socio/rutinas',
    },
    {
      title: 'Horario de Clases',
      description: 'Cronograma y reservas',
      icon: Calendar,
      to: '/socio/clases',
    },
    {
      title: 'Mis Pagos',
      description: 'Facturas e historial',
      icon: CreditCard,
      to: '/socio/perfil/pagos',
    },
    {
      title: 'Soporte y Ayuda',
      description: 'Preguntas y consultas',
      icon: Info,
      to: '/socio/perfil/soporte',
    },
  ]

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted/60 rounded-xl animate-pulse" />
          <div className="h-4 w-72 bg-muted/40 rounded-lg animate-pulse" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="h-64 rounded-3xl border border-border/60 bg-muted/20 animate-pulse" />
          <div className="h-64 rounded-3xl border border-border/60 bg-muted/20 animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-4">
      {/* Saludo y Encabezado de Bienvenida */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl tracking-tight text-foreground sm:text-3xl">
            {member?.name && member?.surname
              ? `Hola ${member.name} ${member.surname}!`
              : "Bienvenido de nuevo!"}
          </h1>
        </div>
      </div>

      {/* Grid Principal: Membresía y Próximas Clases */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-start">
        {/* Tarjeta de Membresía */}
        {membership && plan ? (
          <MemberMembershipCard membership={membership} plan={plan} />
        ) : (
          <Card className="rounded-3xl border border-destructive/30 bg-card p-6 text-center shadow-md">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-3">
              <ShieldAlert className="size-6" />
            </div>
            <h3 className="font-bold text-foreground text-base">
              Sin información de membresía
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
              {membershipError ||
                'No se encontró una membresía activa asignada a tu usuario.'}
            </p>
          </Card>
        )}

        {/* Widget de Próximas Clases Reservadas */}
        <MemberUpcomingBookingsCard />
      </div>

      {/* Accesos Rápidos */}
      <div className="space-y-3">
        <h2 className="text-lg tracking-tight text-foreground">
          Accesos Rápidos
        </h2>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <QuickActionCard
              key={action.to}
              title={action.title}
              description={action.description}
              icon={action.icon}
              to={action.to}
            />
          ))}
        </div>
      </div>
    </div>
  )
}