import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import { type CreateMemberInput } from '@/features/members/models/Member';
import { type MemberFormValues } from '@/features/members/models/memberFormSchema';
import { memberService } from '@/features/members/api/memberService';
import { membershipPlanService } from '@/features/membershipPlans/api/membershipPlanService';
import { type MembershipPlan } from '@/features/membershipPlans/models/MembershipPlan';
import { type PaymentMethodId } from '@/features/payments/components/PaymentForm';

interface InactiveMemberConflict {
  memberId: number;
  name: string;
  surname: string;
  reason: 'STATUS_INACTIVE' | 'SOFT_DELETED';
}

export function useNewMember() {
  const navigate = useNavigate();

  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethodId>('CASH');
  const [includePayment, setIncludePayment] = useState(true);

  // Estado del modal de reactivación
  const [reactivateDialog, setReactivateDialog] = useState<{
    open: boolean;
    data: InactiveMemberConflict | null;
    pendingInput: CreateMemberInput | null;
  }>({
    open: false,
    data: null,
    pendingInput: null,
  });
  const [isReactivating, setIsReactivating] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const plansData = await membershipPlanService.getAll();
        setPlans(plansData);
        if (plansData.length > 0) {
          setSelectedPlanId(plansData[0].id);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error desconocido';
        toast.error(errorMessage);
        navigate('/administrativo/socios');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [navigate]);

  const totalAmount = useMemo(() => {
    if (!includePayment) return 0;
    if (selectedPlanId && plans.length > 0) {
      const plan = plans.find((p) => p.id === selectedPlanId);
      if (plan) return plan.price;
    }
    return 0;
  }, [includePayment, selectedPlanId, plans]);

  const activationDate = useMemo(() => new Date(), []);

  const freeTrialExpirationDate = useMemo(() => {
    const nextDueDate = new Date(activationDate);
    nextDueDate.setDate(nextDueDate.getDate() + 5);
    return nextDueDate;
  }, [activationDate]);

  const expirationDate = useMemo(() => {
    if (!includePayment) return freeTrialExpirationDate;
    if (selectedPlanId && plans.length > 0) {
      const plan = plans.find((p) => p.id === selectedPlanId);
      if (plan) {
        const nextDueDate = new Date(activationDate);
        nextDueDate.setDate(nextDueDate.getDate() + plan.durationDays);
        return nextDueDate;
      }
    }
    const nextDueDate = new Date(activationDate);
    nextDueDate.setMonth(nextDueDate.getMonth() + 1);
    return nextDueDate;
  }, [
    includePayment,
    selectedPlanId,
    plans,
    activationDate,
    freeTrialExpirationDate,
  ]);

  const handleSubmit = async (data: MemberFormValues) => {
    if (!selectedPlanId) {
      toast.error('Debes seleccionar un plan');
      return;
    }

    const dataWithPlan: CreateMemberInput = {
      ...data,
      birthDate: data.birthDate.toISOString().split('T')[0],
      phone: data.phone || null,
      membershipPlanId: selectedPlanId,
      ...(includePayment
        ? {
            payment: {
              amount: totalAmount,
              method: selectedPaymentMethod,
            },
          }
        : {}),
    };

    try {
      await memberService.create(dataWithPlan);
      toast.success('Socio creado correctamente');
      navigate('/administrativo/socios');
    } catch (err) {
      if (
        axios.isAxiosError(err) &&
        err.response?.data?.code === 'INACTIVE_MEMBER_EXISTS'
      ) {
        const details = err.response.data.details as InactiveMemberConflict;
        setReactivateDialog({
          open: true,
          data: details,
          pendingInput: dataWithPlan,
        });
        return;
      }

      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido';
      toast.error(errorMessage);
    }
  };

  const confirmReactivate = async () => {
    if (!reactivateDialog.data || !reactivateDialog.pendingInput) return;
    try {
      setIsReactivating(true);
      await memberService.reactivate(
        reactivateDialog.data.memberId,
        reactivateDialog.pendingInput,
      );
      toast.success(
        reactivateDialog.data.reason === 'STATUS_INACTIVE'
          ? 'Socio activado correctamente'
          : 'Socio reactivado correctamente',
      );
      navigate('/administrativo/socios');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al reactivar el socio';
      toast.error(errorMessage);
    } finally {
      setIsReactivating(false);
      setReactivateDialog({ open: false, data: null, pendingInput: null });
    }
  };

  const closeReactivateDialog = () => {
    setReactivateDialog({ open: false, data: null, pendingInput: null });
  };

  return {
    plans,
    loading,
    selectedPlanId,
    setSelectedPlanId,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    includePayment,
    setIncludePayment,
    totalAmount,
    activationDate,
    expirationDate,
    handleSubmit,
    reactivateDialog,
    isReactivating,
    confirmReactivate,
    closeReactivateDialog,
  };
}
