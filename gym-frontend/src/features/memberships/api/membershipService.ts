import { apiClient } from '@/shared/api/apiClient';
import { type Membership, type MembershipStatus } from '../models/Membership';

export const membershipService = {
  async getMembershipByMemberId(memberId: number): Promise<Membership> {
    const response = await apiClient.get<Membership>(`/api/memberships/member/${memberId}`);
    return response.data;
  },

  async create(data: {
    memberId: number;
    membershipPlanId: number;
    payment?: {
      amount: number;
      method: string;
    };
  }): Promise<Membership> {
    const response = await apiClient.post<Membership>('/api/memberships', data);
    return response.data;
  },

  async update(
    membershipId: number,
    data: {
      membershipPlanId?: number;
      status?: MembershipStatus;
    },
  ): Promise<Membership> {
    const response = await apiClient.patch<Membership>(`/api/memberships/${membershipId}`, data);
    return response.data;
  },
};
