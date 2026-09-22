import { CalendarDays, CheckCircle2, Clock3 } from 'lucide-react'

import { Badge } from '@/shared/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'

import {
  MEMBERSHIP_STATUS,
  type Membership,
} from '@/features/memberships/models/Membership'
import type { MembershipPlan } from '@/features/membershipPlans/models/MembershipPlan'
import { formatDate } from '@/shared/utils/formatDate'

type MemberMembershipCardProps = {
  membership: Membership
  plan: MembershipPlan
}

function getRemainingDays(endDate: string) {
  const today = new Date()
  const expirationDate = new Date(endDate)
  const difference = expirationDate.getTime() - today.getTime()

  return Math.max(
    0,
    Math.ceil(difference / (1000 * 60 * 60 * 24)),
  )
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(price)
}

export default function MemberMembershipCard({
  membership,
  plan,
}: MemberMembershipCardProps) {
  const membershipStatus = MEMBERSHIP_STATUS.find(
    (status) => status.id === membership.status,
  )

  const membershipLabel = membershipStatus?.label || 'Sin estado'
  const membershipVariant = membershipStatus?.variant || 'outline'
  const remainingDays = getRemainingDays(membership.endDate)

  return (
    <Card className="border-border/70 bg-card/80 shadow-sm">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold">
            Plan {plan.name}
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            {plan.description || 'Sin descripción disponible.'}
          </p>
        </div>

        <Badge
          variant={membershipVariant}
          className="w-fit px-3 py-1.5"
        >
          {membershipLabel}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <CalendarDays className="size-5" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Fecha de inicio
              </p>
              <p className="font-semibold">
                {formatDate(membership.startDate)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Clock3 className="size-5" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Próximo vencimiento
              </p>
              <p className="font-semibold">
                {formatDate(membership.endDate)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-5 text-primary" />

            <div>
              <p className="font-semibold">
                {membership.status === 'ACTIVE'
                  ? `Te quedan ${remainingDays} días`
                  : 'Membresía no vigente'}
              </p>

              <p className="text-sm text-muted-foreground">
                Estado actual de tu membresía
              </p>
            </div>
          </div>

          <p className="text-lg font-bold text-primary">
            {formatPrice(plan.price)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}