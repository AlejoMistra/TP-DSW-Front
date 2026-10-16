import { apiClient } from '@/shared/api/apiClient';
import {
  type Member,
  type CreateMemberInput,
  type UpdateMemberInput,
  type UpdateMyProfileInput,
} from '../models/Member';
import type { MemberWithMembership } from '../models/MemberWithMembership';

export interface GetAllMembersWithMembershipParams {
  membershipStatus?: string;
  page?: number;
  limit?: number;
}

export const memberService = {
  async getMe(): Promise<Member> {
    const response = await apiClient.get<Member>('/api/members/me');
    return response.data;
  },

  async updateMe(data: UpdateMyProfileInput): Promise<Member> {
    const response = await apiClient.patch<Member>('/api/members/me', data);
    return response.data;
  },

  async getAllMembers(): Promise<Member[]> {
    const response = await apiClient.get<Member[] | { items: Member[] }>(
      '/api/members',
    );
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object' && 'items' in data && Array.isArray(data.items)) {
      return data.items;
    }
    return [];
  },

  async getAllMembersWithMembership(
    params?: GetAllMembersWithMembershipParams,
  ): Promise<MemberWithMembership[]> {
    const response = await apiClient.get<
      MemberWithMembership[] | { items: MemberWithMembership[] }
    >('/api/members/with-membership', { params });
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object' && 'items' in data && Array.isArray(data.items)) {
      return data.items;
    }
    return [];
  },

  async getMemberById(id: number): Promise<Member> {
    const response = await apiClient.get<Member>(`/api/members/${id}`);
    return response.data;
  },

  async create(data: CreateMemberInput): Promise<Member> {
    const response = await apiClient.post<Member>('/api/members', data);
    return response.data;
  },

  async update(id: number, data: UpdateMemberInput): Promise<Member> {
    const response = await apiClient.patch<Member>(`/api/members/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/members/${id}`);
  },
};
