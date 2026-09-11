import type {
  ClassSchedule,
  CreateClassScheduleInput,
  UpdateClassScheduleInput,
} from '../models/ClassSchedule'

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

export const classScheduleService = {
  async getAll(): Promise<ClassSchedule[]> {
    const response = await fetch(`${baseUrl}/api/classSchedules`)
    if (!response.ok) {
      throw new Error(`Error al obtener tipos de clases: ${response.statusText}`)
    }
    return response.json()
  },

  async getById(id: number | string): Promise<ClassSchedule> {
    const response = await fetch(`${baseUrl}/api/classSchedules/${id}`)
    if (!response.ok) {
      throw new Error(`Error al obtener tipo de clase ${id}: ${response.statusText}`)
    }
    return response.json()
  },

  async create(data: CreateClassScheduleInput): Promise<ClassSchedule> {
    const response = await fetch(`${baseUrl}/api/classSchedules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const err = await response.json().catch(() => null)
      throw new Error(err?.message || `Error al crear tipo de clase: ${response.statusText}`)
    }
    return response.json()
  },

  async update(id: number | string, data: UpdateClassScheduleInput): Promise<ClassSchedule> {
    const response = await fetch(`${baseUrl}/api/classSchedules/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const err = await response.json().catch(() => null)
      throw new Error(err?.message || `Error al actualizar tipo de clase: ${response.statusText}`)
    }
    return response.json()
  },

  async delete(id: number | string): Promise<void> {
    const response = await fetch(`${baseUrl}/api/classSchedules/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      const err = await response.json().catch(() => null)
      throw new Error(err?.message || `Error al eliminar tipo de clase: ${response.statusText}`)
    }
  },
}
