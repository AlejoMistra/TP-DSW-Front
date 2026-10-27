import {
  CalendarDays,
  CreditCard,
  Receipt,
} from 'lucide-react'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'

import type { Payment } from '@/features/payments/models/Payment'
import { formatDate } from '@/shared/utils/formatDate'

type MemberPaymentCardProps = {
  payment: Payment
}

const paymentMethodLabels: Record<string, string> = {
  CREDIT_CARD: 'Tarjeta de crédito',
  DEBIT_CARD: 'Tarjeta de débito',
  TRANSFER: 'Transferencia',
  CASH: 'Efectivo',
  OTHER: 'Otro',
}

function formatPrice(amount: number | string) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(Number(amount))
}

function getPaymentMethodLabel(method: string) {
  return paymentMethodLabels[method] || method
}

export default function MemberPaymentCard({
  payment,
}: MemberPaymentCardProps) {
  return (
    <Card className="border-border/70 bg-card/80 shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Receipt className="size-5" />
          </div>

          <div>
            <CardTitle className="text-lg font-bold">
              Pago realizado
            </CardTitle>

            <p className="text-sm text-muted-foreground">
              {formatDate(payment.paymentDate)}
            </p>
          </div>
        </div>

        <p className="text-lg font-bold text-primary">
          {formatPrice(payment.amount)}
        </p>
      </CardHeader>

      <CardContent className="grid gap-3 border-t pt-4 sm:grid-cols-2">
        <div className="flex items-center gap-3">
          <CreditCard className="size-4 text-muted-foreground" />

          <div>
            <p className="text-xs text-muted-foreground">
              Método de pago
            </p>

            <p className="text-sm font-medium">
              {getPaymentMethodLabel(payment.method)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <CalendarDays className="size-4 text-muted-foreground" />

          <div>
            <p className="text-xs text-muted-foreground">
              Período cubierto
            </p>

            <p className="text-sm font-medium">
              {formatDate(payment.periodStart)} -{' '}
              {formatDate(payment.periodEnd)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}