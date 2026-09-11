import { type ClassSession, type CreateClassSessionInput, type UpdateClassSessionInput } from '../models/ClassSession'

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

export const classSessionService = {
  async getAll(): Promise<ClassSession[]> {
    const response = await fetch(`${baseUrl}/api/classSessions`)
    if (!response.ok) {
      throw new Error(`Error al obtener sesiones: ${response.statusText}`)
    }
    return response.json()
  },

  async getById(id: number): Promise<ClassSession> {
    const response = await fetch(`${baseUrl}/api/classSessions/${id}`)
    if (!response.ok) {
      throw new Error(`Error al obtener sesión ${id}: ${response.statusText}`)
    }
    return response.json()
  },

  async create(data: CreateClassSessionInput): Promise<ClassSession> {
    const response = await fetch(`${baseUrl}/api/classSessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const err = await response.json().catch(() => null)
      throw new Error(err?.message || `Error al crear la sesión: ${response.statusText}`)
    }
    return response.json()
  },

  async update(id: number, data: UpdateClassSessionInput): Promise<ClassSession> {
    const response = await fetch(`${baseUrl}/api/classSessions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const err = await response.json().catch(() => null)
      throw new Error(err?.message || `Error al actualizar la sesión: ${response.statusText}`)
    }
    return response.json()
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${baseUrl}/api/classSessions/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      const err = await response.json().catch(() => null)
      throw new Error(err?.message || `Error al eliminar la sesión: ${response.statusText}`)
    }
  },
}
