import type { Instructor } from '../models/Instructor'

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

export const instructorService = {
  async getAll(): Promise<Instructor[]> {
    const response = await fetch(`${baseUrl}/api/instructors`)
    if (!response.ok) {
      throw new Error(`Error al obtener instructores: ${response.statusText}`)
    }
    return response.json()
  },

  async getById(id: number | string): Promise<Instructor> {
    const response = await fetch(`${baseUrl}/api/instructors/${id}`)
    if (!response.ok) {
      throw new Error(`Error al obtener instructor ${id}: ${response.statusText}`)
    }
    return response.json()
  },
}
