import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { membershipService } from '@/features/memberships/api/membershipService'
import { paymentService } from '@/features/payments/api/paymentService'
import type { Payment } from '@/features/payments/models/Payment'

export function useMemberPayments(memberId: number | null) {
  const [payments, setPayments] = useState<Payment[]>([])
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

    const requestPayments = async () => {
      try {
        const membership =
          await membershipService.getMembershipByMemberId(memberId)

        const paymentData = await paymentService.getAll(
          membership.id,
        )

        if (cancelled) {
          return
        }

        const orderedPayments = [...paymentData].sort(
          (firstPayment, secondPayment) =>
            new Date(secondPayment.paymentDate).getTime() -
            new Date(firstPayment.paymentDate).getTime(),
        )

        setPayments(orderedPayments)
        setError(null)
      } catch (err) {
        if (cancelled) {
          return
        }

        const message =
          err instanceof Error
            ? err.message
            : 'Error al cargar el historial de pagos'

        setError(message)
        toast.error(message)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void requestPayments()

    return () => {
      cancelled = true
    }
  }, [memberId])

  return {
    payments,
    loading,
    error,
  }
}