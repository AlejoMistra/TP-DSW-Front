import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { membershipService } from '@/features/memberships/api/membershipService';
import type { Membership } from '@/features/memberships/models/Membership';
import { membershipPlanService } from '@/features/membershipPlans/api/membershipPlanService';
import type { MembershipPlan } from '@/features/membershipPlans/models/MembershipPlan';

export function useMemberMembership() {
  const [membership, setMembership] = useState<Membership | null>(null);
  const [plan, setPlan] = useState<MembershipPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const requestMembership = async () => {
      try {
        const membershipData = await membershipService.getMyMembership();

        const planData = await membershipPlanService.getById(
          membershipData.membershipPlanId,
        );

        if (cancelled) {
          return;
        }

        setMembership(membershipData);
        setPlan(planData);
        setError(null);
      } catch (err) {
        if (cancelled) {
          return;
        }

        const message =
          err instanceof Error ? err.message : 'Error al cargar la membresía';

        setError(message);
        toast.error(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void requestMembership();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    membership,
    plan,
    loading,
    error,
  };
}
