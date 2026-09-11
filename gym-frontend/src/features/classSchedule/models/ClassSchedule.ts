export type CategoryEnum =
  | "CARDIO"
  | "CROSSFIT"
  | "DANCE"
  | "FUNCTIONAL"
  | "HIIT"
  | "OTHER"
  | "PILATES"
  | "SPINNING"
  | "STRETCHING"
  | "YOGA"
  | string

export type ClassSchedule = {
  id: number | string
  name: string
  description: string | null
  category: CategoryEnum
  maxCapacity: number
  durationMinutes: number
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
}

export interface CreateClassScheduleInput {
  name: string
  description?: string | null
  category: CategoryEnum
  maxCapacity: number
  durationMinutes: number
}

export interface UpdateClassScheduleInput {
  name?: string
  description?: string | null
  category?: CategoryEnum
  maxCapacity?: number
  durationMinutes?: number
}