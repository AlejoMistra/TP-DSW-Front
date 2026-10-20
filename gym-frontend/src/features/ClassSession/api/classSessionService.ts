import { apiClient } from '@/shared/api/apiClient';
import {
  type ClassSession,
  type CreateClassSessionInput,
  type UpdateClassSessionInput,
} from '../models/ClassSession';

export interface GetAllClassSessionsParams {
  date?: string;
  page?: number;
  limit?: number;
}

export const classSessionService = {
  async getAll(params?: GetAllClassSessionsParams): Promise<ClassSession[]> {
    const response = await apiClient.get<ClassSession[] | { items: ClassSession[] }>(
      '/api/classSessions',
      { params }
    );
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object' && 'items' in data && Array.isArray(data.items)) {
      return data.items;
    }
    return [];
  },

  async getById(id: number): Promise<ClassSession> {
    const response = await apiClient.get<ClassSession>(`/api/classSessions/${id}`);
    return response.data;
  },

  async create(data: CreateClassSessionInput): Promise<ClassSession> {
    const response = await apiClient.post<ClassSession>('/api/classSessions', data);
    return response.data;
  },

  async update(id: number, data: UpdateClassSessionInput): Promise<ClassSession> {
    const response = await apiClient.put<ClassSession>(`/api/classSessions/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/classSessions/${id}`);
  },
};
