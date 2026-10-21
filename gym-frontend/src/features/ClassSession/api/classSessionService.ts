import { apiClient } from '@/shared/api/apiClient';
import {
  type ClassSession,
  type CreateClassSessionInput,
  type UpdateClassSessionInput,
  type RecurrenceScope,
} from '../models/ClassSession';

export interface GetAllClassSessionsParams {
  date?: string;
  page?: number;
  limit?: number;
}

export const classSessionService = {
  async getAll(params?: GetAllClassSessionsParams): Promise<ClassSession[]> {
    const response = await apiClient.get<
      ClassSession[] | { items: ClassSession[] }
    >('/api/classSessions', {
      params: { limit: 500, ...params },
    });
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object' && 'items' in data && Array.isArray(data.items)) {
      return data.items;
    }
    return [];
  },

  async getById(id: number): Promise<ClassSession> {
    const response = await apiClient.get<ClassSession>(
      `/api/classSessions/${id}`,
    );
    return response.data;
  },

  async getAffectedBookings(
    id: number,
    scope: RecurrenceScope = 'this',
  ): Promise<{ sessionCount: number; confirmedBookingsCount: number }> {
    const response = await apiClient.get<{
      sessionCount: number;
      confirmedBookingsCount: number;
    }>(`/api/classSessions/${id}/affected-bookings?scope=${scope}`);
    return response.data;
  },

  async getByInstructor(instructorId: number): Promise<ClassSession[]> {
    const response = await apiClient.get<ClassSession[] | { items: ClassSession[] }>(
      `/api/classSessions/instructor/${instructorId}`
    );
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object' && 'items' in data && Array.isArray((data as any).items)) {
      return (data as any).items;
    }
    return [];
  },

  async create(data: CreateClassSessionInput): Promise<ClassSession> {
    const response = await apiClient.post<ClassSession>(
      '/api/classSessions',
      data,
    );
    return response.data;
  },

  async update(
    id: number,
    data: UpdateClassSessionInput,
  ): Promise<ClassSession> {
    const response = await apiClient.put<ClassSession>(
      `/api/classSessions/${id}`,
      data,
    );
    return response.data;
  },

  async cancel(id: number, scope: RecurrenceScope = 'this'): Promise<void> {
    await apiClient.patch(`/api/classSessions/${id}/cancel`, { scope });
  },

  async delete(id: number, scope: RecurrenceScope = 'this'): Promise<void> {
    await apiClient.delete(`/api/classSessions/${id}?scope=${scope}`);
  },
};
