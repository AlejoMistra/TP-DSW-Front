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

export interface CreateClassBookingInput {
  memberId: number
  classSessionId: number
}

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

export const classBookingService = {
  async getAll(): Promise<ClassBooking[]> {
    const response = await fetch(`${baseUrl}/api/classBookings`)
    if (!response.ok) {
      throw new Error(`Error al obtener reservas: ${response.statusText}`)
    }
    return response.json()
  },

  async getById(id: number): Promise<ClassBooking> {
    const response = await fetch(`${baseUrl}/api/classBookings/${id}`)
    if (!response.ok) {
      throw new Error(`Error al obtener reserva ${id}: ${response.statusText}`)
    }
    return response.json()
  },

  async create(data: CreateClassBookingInput): Promise<ClassBooking> {
    const response = await fetch(`${baseUrl}/api/classBookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const err = await response.json().catch(() => null)
      throw new Error(err?.message || `Error al crear la reserva: ${response.statusText}`)
    }
    return response.json()
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${baseUrl}/api/classBookings/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      const err = await response.json().catch(() => null)
      throw new Error(err?.message || `Error al cancelar la reserva: ${response.statusText}`)
    }
  },
}

export default classBookingService
