import type {
    Routine,
    CreateRoutineInput,
    UpdateRoutineInput,
} from '../models/Routine';

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export const routineService = {
    async getAll(): Promise<Routine[]> {
        const response = await fetch(`${baseUrl}/api/routines`);
        if (!response.ok) {
            throw new Error('Error al obtener rutinas');
        }
        const data = await response.json();
        return Array.isArray(data) ? data : data.items || [];
    },

    async getById(id: number): Promise<Routine> {
        const response = await fetch(`${baseUrl}/api/routines/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener la rutina');
        }
        return response.json();
    },

    async create(data: CreateRoutineInput): Promise<Routine> {
        const response = await fetch(`${baseUrl}/api/routines`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error || error.message || 'Error al crear la rutina');
        }
        return response.json();
    },

    async update(id: number, data: UpdateRoutineInput): Promise<Routine> {
        const response = await fetch(`${baseUrl}/api/routines/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error || error.message || 'Error al actualizar la rutina');
        }
        return response.json();
    },

    async delete(id: number, instructorId: number = 1): Promise<void> {
        const response = await fetch(`${baseUrl}/api/routines/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ instructorId }),
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error || error.message || 'Error al eliminar la rutina');
        }
    },
};
