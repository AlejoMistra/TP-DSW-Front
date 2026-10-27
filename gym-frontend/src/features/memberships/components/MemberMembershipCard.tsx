import { CalendarDays } from 'lucide-react'

import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { Progress } from '@/shared/components/ui/progress'

import {
  MEMBERSHIP_STATUS,
  type Membership,
} from '@/features/memberships/models/Membership'
import type { MembershipPlan } from '@/features/membershipPlans/models/MembershipPlan'
import { formatDate } from '@/shared/utils/formatDate'

type MemberMembershipCardProps = {
  membership: Membership
  plan: MembershipPlan
  className?: string
}

function getRemainingDays(endDate: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expirationDate = new Date(endDate)
  expirationDate.setHours(23, 59, 59, 999)
  const difference = expirationDate.getTime() - today.getTime()

  return Math.max(
    0,
    Math.ceil(difference / (1000 * 60 * 60 * 24)),
  )
}

export default function MemberMembershipCard({
  membership,
  plan,
  className,
}: MemberMembershipCardProps) {
  const membershipStatus = MEMBERSHIP_STATUS.find(
    (status) => status.id === membership.status,
  )

  const membershipLabel = membershipStatus?.label || 'Activo'
  const isExpired = membership.status === 'EXPIRED' || membership.status === 'CANCELLED'
  const remainingDays = getRemainingDays(membership.endDate)

  const totalPeriodDays = plan.durationDays > 0 ? plan.durationDays : 30

  // Progress percentage decreases as expiration approaches
  const progressPercentage = isExpired
    ? 0
    : Math.min(100, Math.max(0, Math.round((remainingDays / totalPeriodDays) * 100)))

  return (
    <Card
      className={`relative overflow-hidden rounded-3xl border border-border/80 bg-card p-2 shadow-md transition-all hover:shadow-lg ${className || ''}`}
    >
      <CardHeader className="p-5 pb-3 md:p-4 md:pb-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
            Membresía
          </span>

          <Badge
            variant="default"
            className="rounded-full px-3 py-0.5 text-xs font-extrabold tracking-wider uppercase"
          >
            {membershipLabel}
          </Badge>
        </div>

        <div className="mt-2">
          <CardTitle className="text-3xl tracking-tight text-foreground md:text-2xl">
            Plan {plan.name}
          </CardTitle>
          {plan.description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
              {plan.description}
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-4 pt-1 sm:p-5 sm:pt-2">
        {/* Next expiration date */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="size-4 shrink-0 text-muted-foreground/80" />
          <span>
            Próximo vencimiento:{' '}
            <strong className="font-bold text-foreground">
              {formatDate(membership.endDate)}
            </strong>
          </span>
        </div>

        {/* Progress bar and days remaining */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-muted-foreground">
              {isExpired
                ? 'Membresía vencida'
                : remainingDays === 0
                  ? 'Vence hoy'
                  : remainingDays === 1
                    ? 'Queda 1 día restante'
                    : `Días restantes: ${remainingDays}`}
            </span>
          </div>

          <Progress
            value={progressPercentage}
            className="h-2 w-full bg-muted/60"
          />
        </div>

        {/* CTA Button: disabled as requested */}
        <div className="pt-2">
          <Button
            type="button"
            disabled
            className="w-full h-12 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
            title="Próximamente disponible"
          >
            Renovar Membresía
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}