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
