import { apiClient } from '@/shared/api/apiClient';

export interface ClassBooking {
  id: number;
  memberId: number;
  classSessionId: number;
  bookingDate?: string | Date;
  status: 'CONFIRMED' | 'CANCELLED';
  createdAt?: string | Date;
  updatedAt?: string | Date;
  deletedAt?: string | Date | null;
}

export interface CreateClassBookingInput {
  memberId: number;
  classSessionId: number;
}

export const classBookingService = {
  async getAll(): Promise<ClassBooking[]> {
    const response = await apiClient.get<ClassBooking[]>('/api/classBookings');
    return response.data;
  },

  async getById(id: number): Promise<ClassBooking> {
    const response = await apiClient.get<ClassBooking>(`/api/classBookings/${id}`);
    return response.data;
  },

  async create(data: CreateClassBookingInput): Promise<ClassBooking> {
    const response = await apiClient.post<ClassBooking>('/api/classBookings', data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/classBookings/${id}`);
  },
};

export default classBookingService;
