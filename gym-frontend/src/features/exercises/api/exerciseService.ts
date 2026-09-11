import type {
  Exercise,
  CreateExerciseInput,
  UpdateExerciseInput,
} from '../models/Exercise';

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export const exerciseService = {
  async getAllExercises(): Promise<Exercise[]> {
    const response = await fetch(`${baseUrl}/api/exercises`);
    if (!response.ok) {
      throw new Error('Error al obtener ejercicios');
    }
    const data = await response.json();
    return data.items || [];
  },

  async getExerciseById(id: number): Promise<Exercise> {
    const response = await fetch(`${baseUrl}/api/exercises/${id}`);
    if (!response.ok) {
      throw new Error('Error al obtener ejercicio');
    }
    return response.json();
  },

  async create(data: CreateExerciseInput): Promise<Exercise> {
    const response = await fetch(`${baseUrl}/api/exercises`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear ejercicio');
    }
    return response.json();
  },

  async update(id: number, data: UpdateExerciseInput): Promise<Exercise> {
    const response = await fetch(`${baseUrl}/api/exercises/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar ejercicio');
    }
    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${baseUrl}/api/exercises/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error al eliminar ejercicio');
    }
  },
};
