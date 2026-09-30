import { Receipt } from 'lucide-react'

import { usePageTitle } from '@/shared/context/PageHeaderContext'
import MemberPaymentCard from '@/features/payments/components/MemberPaymentCard'
import { useMemberPayments } from '@/features/payments/hooks/useMemberPayments'
import { useCurrentMemberId } from '@/features/auth/hooks/useCurrentMemberId'

export default function MemberPaymentsPage() {
  usePageTitle('Historial de pagos')

  // Con este hook obtenemos el ID del socio actual desde el contexto de autenticación
  const currentMemberId = useCurrentMemberId()

  const {
    payments,
    loading,
    error,
  } = useMemberPayments(currentMemberId)

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-2xl border border-border/70 bg-card/80 p-8 text-center">
          <p className="text-muted-foreground">
            Cargando historial de pagos...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-2xl border border-destructive/30 bg-card/80 p-8 text-center">
          <p className="text-sm text-destructive">
            {error}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Historial de pagos
        </h1>

        <p className="text-sm text-muted-foreground">
          Consultá los pagos realizados y los períodos cubiertos.
        </p>
      </div>

      {payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/50 p-12 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground">
            <Receipt className="size-7" />
          </div>

          <h2 className="text-lg font-bold">
            Todavía no hay pagos registrados
          </h2>

          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Cuando se registre un pago asociado a tu membresía,
            aparecerá en esta sección.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {payments.map((payment) => (
            <MemberPaymentCard
              key={payment.id}
              payment={payment}
            />
          ))}
        </div>
      )}
    </div>
  )
}