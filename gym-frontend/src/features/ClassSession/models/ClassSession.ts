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


