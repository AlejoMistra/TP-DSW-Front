import { apiClient } from '@/shared/api/apiClient';
import type {
  ClassBooking,
  CreateClassBookingInput,
} from '../models/ClassBooking';

export const classBookingService = {
  async getAll(): Promise<ClassBooking[]> {
    const response = await apiClient.get<
      ClassBooking[] | { items: ClassBooking[] }
    >('/api/classBookings');
    const data = response.data;
    return Array.isArray(data) ? data : data?.items || [];
  },

  async getMyBookings(): Promise<ClassBooking[]> {
    const response = await apiClient.get<
      ClassBooking[] | { items: ClassBooking[] }
    >('/api/classBookings/me');
    const data = response.data;
    return Array.isArray(data) ? data : data?.items || [];
  },

  async getById(id: number): Promise<ClassBooking> {
    const response = await apiClient.get<ClassBooking>(
      `/api/classBookings/${id}`,
    );
    return response.data;
  },

  async create(data: CreateClassBookingInput): Promise<ClassBooking> {
    const response = await apiClient.post<ClassBooking>(
      '/api/classBookings',
      data,
    );
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/classBookings/${id}`);
  },
};

export default classBookingService;
