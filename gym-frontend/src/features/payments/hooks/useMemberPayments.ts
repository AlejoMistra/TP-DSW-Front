import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { paymentService } from '@/features/payments/api/paymentService';
import type { Payment } from '@/features/payments/models/Payment';

export function useMemberPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const requestPayments = async () => {
      try {
        const paymentData = await paymentService.getMyPayments();

        if (cancelled) {
          return;
        }

        const orderedPayments = [...paymentData].sort(
          (firstPayment, secondPayment) =>
            new Date(secondPayment.paymentDate).getTime() -
            new Date(firstPayment.paymentDate).getTime(),
        );

        setPayments(orderedPayments);
        setError(null);
      } catch (err) {
        if (cancelled) {
          return;
        }

        const message =
          err instanceof Error
            ? err.message
            : 'Error al cargar el historial de pagos';

        setError(message);
        toast.error(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void requestPayments();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    payments,
    loading,
    error,
  };
}
