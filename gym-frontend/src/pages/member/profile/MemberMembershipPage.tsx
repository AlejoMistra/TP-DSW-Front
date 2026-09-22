import { usePageTitle } from '@/shared/context/PageHeaderContext'
import MemberMembershipCard from '@/features/memberships/components/MemberMembershipCard'
import { useMemberMembership } from '@/features/memberships/hooks/useMemberMembership'

export default function MemberMembershipPage() {
  usePageTitle('Mi membresía')

  // Temporal hasta implementar autenticación.
  const currentMemberId = 1

  const {
    membership,
    plan,
    loading,
    error,
  } = useMemberMembership(currentMemberId)

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-2xl border border-border/70 bg-card/80 p-8 text-center">
          <p className="text-muted-foreground">
            Cargando tu membresía...
          </p>
        </div>
      </div>
    )
  }

  if (error || !membership || !plan) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-2xl border border-destructive/30 bg-card/80 p-8 text-center">
          <p className="text-sm text-destructive">
            {error || 'No se encontró información de la membresía.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Mi membresía
        </h1>

        <p className="text-sm text-muted-foreground">
          Consultá el estado y la vigencia de tu plan actual.
        </p>
      </div>

      <MemberMembershipCard
        membership={membership}
        plan={plan}
      />
    </div>
  )
}