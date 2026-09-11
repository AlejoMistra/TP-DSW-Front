import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { exerciseService } from '../api/exerciseService';
import type { Exercise } from '../models/Exercise';

export function useExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExercises = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await exerciseService.getAllExercises();
        setExercises(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este ejercicio?'))
      return;
    try {
      await exerciseService.delete(id);
      toast.success('Ejercicio eliminado exitosamente');
      setExercises((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al eliminar';
      toast.error(errorMessage);
    }
  };

  return {
    exercises,
    loading,
    error,
    handleDelete,
    refetch: async () => {
      try {
        const data = await exerciseService.getAllExercises();
        setExercises(data);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Error al cargar');
      }
    },
  };
}
