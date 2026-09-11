import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { exerciseService } from '../api/exerciseService';
import type { Exercise } from '../models/Exercise';

export function useExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    ids: number[];
  }>({
    open: false,
    ids: [],
  });
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = (id: number) => {
    setDeleteConfirm({ open: true, ids: [id] });
  };

  const handleMultipleDelete = (ids: number[]) => {
    setDeleteConfirm({ open: true, ids });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.ids || deleteConfirm.ids.length === 0) return;

    try {
      setIsDeleting(true);
      await Promise.all(
        deleteConfirm.ids.map((id) => exerciseService.delete(id)),
      );
      toast.success('Ejercicio(s) eliminado(s) exitosamente');
      setExercises((prev) =>
        prev.filter((e) => !deleteConfirm.ids.includes(e.id)),
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al eliminar';
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setDeleteConfirm({ open: false, ids: [] });
    }
  };

  return {
    exercises,
    loading,
    error,
    handleDelete,
    handleMultipleDelete,
    deleteConfirm,
    setDeleteConfirm,
    confirmDelete,
    isDeleting,
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
