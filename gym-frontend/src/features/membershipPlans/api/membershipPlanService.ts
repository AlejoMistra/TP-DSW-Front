import { apiClient } from '@/shared/api/apiClient';
import {
  type MembershipPlan,
  type CreateMembershipPlanInput,
  type UpdateMembershipPlanInput,
} from '@/features/membershipPlans/models/MembershipPlan';

export const membershipPlanService = {
  async getAll(): Promise<MembershipPlan[]> {
    const response = await apiClient.get<MembershipPlan[] | { items: MembershipPlan[] }>('/api/membership-plans');
    const data = response.data;
    return Array.isArray(data) ? data : (data as any)?.items || [];
  },

  async getById(id: number): Promise<MembershipPlan> {
    const response = await apiClient.get<MembershipPlan>(`/api/membership-plans/${id}`);
    return response.data;
  },

  async create(data: CreateMembershipPlanInput): Promise<MembershipPlan> {
    const response = await apiClient.post<MembershipPlan>('/api/membership-plans', data);
    return response.data;
  },

  async update(id: number, data: UpdateMembershipPlanInput): Promise<MembershipPlan> {
    const response = await apiClient.patch<MembershipPlan>(`/api/membership-plans/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/membership-plans/${id}`);
  },
};