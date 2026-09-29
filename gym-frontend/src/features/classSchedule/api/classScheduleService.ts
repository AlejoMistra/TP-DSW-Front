import { apiClient } from '@/shared/api/apiClient';
import type {
  ClassSchedule,
  CreateClassScheduleInput,
  UpdateClassScheduleInput,
} from '../models/ClassSchedule';

export const classScheduleService = {
  async getAll(): Promise<ClassSchedule[]> {
    const response = await apiClient.get<ClassSchedule[]>('/api/classSchedules');
    return response.data;
  },

  async getById(id: number | string): Promise<ClassSchedule> {
    const response = await apiClient.get<ClassSchedule>(`/api/classSchedules/${id}`);
    return response.data;
  },

  async create(data: CreateClassScheduleInput): Promise<ClassSchedule> {
    const response = await apiClient.post<ClassSchedule>('/api/classSchedules', data);
    return response.data;
  },

  async update(id: number | string, data: UpdateClassScheduleInput): Promise<ClassSchedule> {
    const response = await apiClient.put<ClassSchedule>(`/api/classSchedules/${id}`, data);
    return response.data;
  },

  async delete(id: number | string): Promise<void> {
    await apiClient.delete(`/api/classSchedules/${id}`);
  },
};
