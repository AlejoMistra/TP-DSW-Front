import type {
  CreateInstructorInput,
  Instructor,
  UpdateInstructorInput,
} from '@/features/instructors/models/Instructor'

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

async function getErrorMessage(response: Response, fallback: string) {
  const error = await response.json().catch(() => null)
  return error?.message || error?.error || fallback
}

export const instructorService = {
  async getAll(): Promise<Instructor[]> {
    const response = await fetch(`${baseUrl}/api/instructors`)

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(response, 'Error al obtener instructores'),
      )
    }

    return response.json()
  },

  async getById(id: number | string): Promise<Instructor> {
    const response = await fetch(`${baseUrl}/api/instructors/${id}`)

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(response, 'Error al obtener el instructor'),
      )
    }

    return response.json()
  },

  async create(data: CreateInstructorInput): Promise<Instructor> {
    const response = await fetch(`${baseUrl}/api/instructors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(response, 'Error al crear el instructor'),
      )
    }

    return response.json()
  },

  async update(
    id: number,
    data: UpdateInstructorInput,
  ): Promise<Instructor> {
    const response = await fetch(`${baseUrl}/api/instructors/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(response, 'Error al actualizar el instructor'),
      )
    }

    return response.json()
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${baseUrl}/api/instructors/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(response, 'Error al eliminar el instructor'),
      )
    }
  },
}