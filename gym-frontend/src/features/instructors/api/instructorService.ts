import { apiClient } from '@/shared/api/apiClient';
import type {
  CreateInstructorInput,
  Instructor,
  UpdateInstructorInput,
} from '@/features/instructors/models/Instructor';

export const instructorService = {
  async getAll(): Promise<Instructor[]> {
    const response = await apiClient.get<Instructor[]>('/api/instructors');
    return response.data;
  },

  async getById(id: number | string): Promise<Instructor> {
    const response = await apiClient.get<Instructor>(`/api/instructors/${id}`);
    return response.data;
  },

  async create(data: CreateInstructorInput): Promise<Instructor> {
    const response = await apiClient.post<Instructor>('/api/instructors', data);
    return response.data;
  },

  async update(id: number, data: UpdateInstructorInput): Promise<Instructor> {
    const response = await apiClient.put<Instructor>(`/api/instructors/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/instructors/${id}`);
  },
};