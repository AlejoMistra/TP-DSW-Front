import { useCallback, useEffect, useState } from 'react';
import type { ExpiredMembershipItemData } from '../models/adminDashboard';
import { memberService } from '@/features/members/api/memberService';

function calculateDaysExpired(endDateStr?: string): number {
  if (!endDateStr) return 0;
  const match = endDateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return 0;
  const [, y, m, d] = match;
  const endDate = new Date(Number(y), Number(m) - 1, Number(d));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.floor(
    (today.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  return Math.max(0, diffDays);
}

function getInitials(name = '', surname = ''): string {
  const first = name.trim().charAt(0) || '';
  const second = surname.trim().charAt(0) || '';
  return (first + second).toUpperCase() || 'S';
}

export function useExpiringMemberships() {
  const [items, setItems] = useState<ExpiredMembershipItemData[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState<number>(0);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    setReloadKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        const { items: members, total } =
          await memberService.getMembersWithMembershipPaginated({
            membershipStatus: 'EXPIRED',
            limit: 20,
          });

        if (cancelled) return;

        const mapped: ExpiredMembershipItemData[] = members.map((member) => {
          const daysExpired = calculateDaysExpired(member.membership?.endDate);
          return {
            id: member.membership?.id ?? member.id,
            memberId: member.id,
            memberName: `${member.name} ${member.surname}`.trim(),
            memberInitials: getInitials(member.name, member.surname),
            planName: member.membership?.membershipPlan?.name || 'Membresía',
            daysExpired,
            debtAmountArs: member.membership?.membershipPlan?.price || 0,
            isCritical: daysExpired > 0,
          };
        });

        setItems(mapped);
        setTotalCount(total);
        setError(null);
      } catch {
        if (!cancelled) {
          setError('Error al obtener membresías vencidas.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  return {
    items,
    totalCount,
    loading,
    error,
    refetch,
  };
}

export default useExpiringMemberships;
