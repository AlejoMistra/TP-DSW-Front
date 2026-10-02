import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { membershipService } from '@/features/memberships/api/membershipService'
import type { Membership } from '@/features/memberships/models/Membership'
import { membershipPlanService } from '@/features/membershipPlans/api/membershipPlanService'
import type { MembershipPlan } from '@/features/membershipPlans/models/MembershipPlan'

export function useMemberMembership(memberId: number | null) {
  const [membership, setMembership] = useState<Membership | null>(null)
  const [plan, setPlan] = useState<MembershipPlan | null>(null)
  const [loading, setLoading] = useState(memberId !== null)
  const [error, setError] = useState<string | null>(
    memberId === null
      ? 'No se encontró el socio autenticado'
      : null,
  )

  useEffect(() => {
    if (!memberId) {
      return
    }

    let cancelled = false

    const requestMembership = async () => {
      try {
        const membershipData =
          await membershipService.getMembershipByMemberId(memberId)

        const planData = await membershipPlanService.getById(
          membershipData.membershipPlanId,
        )

        if (cancelled) {
          return
        }

        setMembership(membershipData)
        setPlan(planData)
        setError(null)
      } catch (err) {
        if (cancelled) {
          return
        }

        const message =
          err instanceof Error
            ? err.message
            : 'Error al cargar la membresía'

        setError(message)
        toast.error(message)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void requestMembership()

    return () => {
      cancelled = true
    }
  }, [memberId])

  return {
    membership,
    plan,
    loading,
    error,
  }
}