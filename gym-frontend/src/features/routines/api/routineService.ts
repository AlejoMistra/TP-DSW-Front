import { apiClient } from '@/shared/api/apiClient';
import type {
    Routine,
    CreateRoutineInput,
    UpdateRoutineInput,
} from '../models/Routine';

export const routineService = {
    async getAll(): Promise<Routine[]> {
        const response = await apiClient.get<Routine[] | { items: Routine[] }>('/api/routines');
        const data = response.data;
        return Array.isArray(data) ? data : data.items || [];
    },

    async getById(id: number): Promise<Routine> {
        const response = await apiClient.get<Routine>(`/api/routines/${id}`);
        return response.data;
    },

    async create(data: CreateRoutineInput): Promise<Routine> {
        const response = await apiClient.post<Routine>('/api/routines', data);
        return response.data;
    },

    async update(id: number, data: UpdateRoutineInput): Promise<Routine> {
        const response = await apiClient.patch<Routine>(`/api/routines/${id}`, data);
        return response.data;
    },

    async delete(id: number, instructorId: number = 1): Promise<void> {
        await apiClient.delete(`/api/routines/${id}`, {
            data: { instructorId },
        });
    },
};
