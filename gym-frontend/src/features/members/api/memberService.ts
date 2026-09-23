import { apiClient } from '@/shared/api/apiClient';
import {
  type Member,
  type CreateMemberInput,
  type UpdateMemberInput,
} from '../models/Member';

export const memberService = {
  async getAllMembers(): Promise<Member[]> {
    const response = await apiClient.get<Member[]>('/api/members');
    return response.data;
  },

  async getAllMembersWithMembership() {
    const response = await apiClient.get('/api/members/with-membership');
    return response.data;
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
