import { apiClient } from '@/shared/api/apiClient';
import type {
  CreateMembershipPaymentInput,
  CreatePaymentInput,
  Payment,
  UpdatePaymentInput,
} from '../models/Payment';

export const paymentService = {
  async getAll(membershipId?: number): Promise<Payment[]> {
    const params = membershipId ? { membershipId } : undefined;
    const response = await apiClient.get<Payment[]>('/api/payments', { params });
    return response.data;
  },

  async getById(id: number): Promise<Payment> {
    const response = await apiClient.get<Payment>(`/api/payments/${id}`);
    return response.data;
  },

  async create(data: CreatePaymentInput): Promise<Payment> {
    const response = await apiClient.post<Payment>('/api/payments', data);
    return response.data;
  },

  async createForMembership(
    membershipId: number,
    data: CreateMembershipPaymentInput,
  ): Promise<Payment> {
    const response = await apiClient.post<Payment>(
      `/api/memberships/${membershipId}/payments`,
      data,
    );
    return response.data;
  },

  async update(id: number, data: UpdatePaymentInput): Promise<Payment> {
    const response = await apiClient.patch<Payment>(`/api/payments/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/payments/${id}`);
  },
};