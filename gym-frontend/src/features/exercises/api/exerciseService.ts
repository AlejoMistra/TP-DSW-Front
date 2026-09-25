import { apiClient } from '@/shared/api/apiClient';
import type {
  Exercise,
  CreateExerciseInput,
  UpdateExerciseInput,
} from '../models/Exercise';

export const exerciseService = {
  async getAllExercises(): Promise<Exercise[]> {
    const response = await apiClient.get<Exercise[] | { items: Exercise[] }>('/api/exercises');
    const data = response.data;
    return Array.isArray(data) ? data : data.items || [];
  },

  async getExerciseById(id: number): Promise<Exercise> {
    const response = await apiClient.get<Exercise>(`/api/exercises/${id}`);
    return response.data;
  },

  async create(data: CreateExerciseInput): Promise<Exercise> {
    const response = await apiClient.post<Exercise>('/api/exercises', data);
    return response.data;
  },

  async update(id: number, data: UpdateExerciseInput): Promise<Exercise> {
    const response = await apiClient.patch<Exercise>(`/api/exercises/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/exercises/${id}`);
  },
};
