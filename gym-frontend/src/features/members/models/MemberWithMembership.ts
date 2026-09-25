import type { Member } from './Member';
import type { MembershipPlan } from '@/features/membershipPlans/models/MembershipPlan';

export type MembershipInfo = {
  id: number;
  status: string;
  membershipPlan: MembershipPlan;
  endDate: string;
} | null;

export type MemberWithMembership = Member & {
  membership: MembershipInfo;
};

