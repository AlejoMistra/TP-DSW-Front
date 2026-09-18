import type { ClassSchedule as RealClassSchedule } from '@/features/classSchedule/models/ClassSchedule'
import type { Instructor } from '@/features/instructors/models/Instructor'

export type ClassCategory = string
export type DayOfWeek =
  | 'Lunes'
  | 'Martes'
  | 'Miércoles'
  | 'Jueves'
  | 'Viernes'
  | 'Sábado'
  | 'Domingo'

export const CATEGORY_LABELS: Record<string, string> = {
  CARDIO: 'Cardio',
  CROSSFIT: 'CrossFit',
  DANCE: 'Dance',
  FUNCTIONAL: 'Functional',
  HIIT: 'HIIT',
  PILATES: 'Pilates',
  SPINNING: 'Spinning',
  STRETCHING: 'Stretching',
  YOGA: 'Yoga',
  OTHER: 'Otro',
}

export function getCategoryLabel(category?: string | null): string {
  if (!category) return 'General'
  const upper = category.toUpperCase()
  return CATEGORY_LABELS[upper] || category
}

export interface ClassSchedule {
  id: string | number
  name: string
  description?: string | null
  category: ClassCategory
  instructorId?: string | number
  instructorName?: string
  dayOfWeek?: DayOfWeek | string
  startTime?: string
  durationMinutes: number
  maxCapacity: number
  currentCapacity?: number
  reserved?: boolean
  status?: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
}

export interface ClassDateOption {
  day: string
  date: string
  fullDate: string
  month?: string
  isToday?: boolean
  active?: boolean
}

export type ClassSessionStatus = 'SCHEDULED' | 'CANCELLED'

export interface ClassSession {
  id: number
  classScheduleId: number
  instructorId?: number | null
  date: string | Date
  startTime: string
  endTime?: string
  remainingCapacity: number
  status: ClassSessionStatus
  createdAt?: string | Date
  updatedAt?: string | Date
  deletedAt?: string | Date | null

  // Populated relations
  classSchedule?: RealClassSchedule | ClassSchedule
  instructor?: Instructor | null
}

export interface MemberClassSession extends ClassSession {
  userBookingId?: number | null
  isReserved: boolean
}

export interface ClassBooking {
  id: number
  memberId: number
  classSessionId: number
  bookingDate?: string | Date
  status: 'CONFIRMED' | 'CANCELLED'
  createdAt?: string | Date
  updatedAt?: string | Date
  deletedAt?: string | Date | null
}

export interface CreateClassSessionInput {
  classScheduleId: number
  instructorId?: number | null
  date: string
  startTime: string
  status?: ClassSessionStatus
}

export interface UpdateClassSessionInput {
  classScheduleId?: number
  instructorId?: number | null
  date?: string
  startTime?: string
  status?: ClassSessionStatus
}


