import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { routineService } from '../api/routineService';
import type { Routine } from '../models/Routine';

export function useRoutines() {
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState<{
        open: boolean;
        ids: number[];
    }>({
        open: false,
        ids: [],
    });
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchRoutines = useCallback(async () => {
        try {
            setLoading(true);
            const data = await routineService.getAll();
            setRoutines(data);
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Error al cargar rutinas';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRoutines();
    }, [fetchRoutines]);

    const handleDelete = (id: number) => {
        setDeleteConfirm({ open: true, ids: [id] });
    };

    const handleMultipleDelete = (ids: number[]) => {
        setDeleteConfirm({ open: true, ids });
    };

    const confirmDelete = async () => {
        if (deleteConfirm.ids.length === 0) return;
        try {
            setIsDeleting(true);
            for (const id of deleteConfirm.ids) {
                const routine = routines.find((r) => r.id === id);
                await routineService.delete(id, routine?.instructorId);
            }
            toast.success(
                deleteConfirm.ids.length === 1
                    ? 'Rutina eliminada con éxito'
                    : 'Rutinas eliminadas con éxito'
            );
            setDeleteConfirm({ open: false, ids: [] });
            await fetchRoutines();
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Error al eliminar rutina';
            toast.error(msg);
        } finally {
            setIsDeleting(false);
        }
    };

    return {
        routines,
        loading,
        refetch: fetchRoutines,
        handleDelete,
        handleMultipleDelete,
        deleteConfirm,
        setDeleteConfirm,
        confirmDelete,
        isDeleting,
    };
}
