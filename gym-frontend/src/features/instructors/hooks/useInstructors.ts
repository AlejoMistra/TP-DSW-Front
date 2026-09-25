import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { instructorService } from '@/features/instructors/api/instructorService';
import type {
  CreateInstructorInput,
  Instructor,
} from '@/features/instructors/models/Instructor';

export function useInstructors() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [instructorToEdit, setInstructorToEdit] = useState<Instructor | null>(
    null,
  );

  // Estado para el modal de confirmación individual
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    instructor: Instructor | null;
  }>({
    open: false,
    instructor: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadInstructors() {
      try {
        setLoading(true);
        const data = await instructorService.getAll();
        setInstructors(data);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Error al cargar los instructores',
        );
      } finally {
        setLoading(false);
      }
    }

    loadInstructors();
  }, []);

  function handleNew() {
    setInstructorToEdit(null);
    setDialogOpen(true);
  }

  function handleEdit(instructor: Instructor) {
    setInstructorToEdit(instructor);
    setDialogOpen(true);
  }

  // Abre el modal guardando el instructor seleccionado
  function handleDelete(id: number) {
    const instructor = instructors.find((item) => item.id === id) || null;
    setDeleteConfirm({
      open: true,
      instructor,
    });
  }

  // Ejecuta la eliminación individual
  async function confirmDelete() {
    if (!deleteConfirm.instructor) return;

    const { id } = deleteConfirm.instructor;

    try {
      setIsDeleting(true);
      await instructorService.delete(id);

      setInstructors((previous) => previous.filter((item) => item.id !== id));

      toast.success('Instructor eliminado correctamente');
      setDeleteConfirm({ open: false, instructor: null });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Error al eliminar el instructor',
      );
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleSave(data: CreateInstructorInput, id?: number) {
    try {
      if (id !== undefined) {
        const updatedInstructor = await instructorService.update(id, data);

        setInstructors((previous) =>
          previous.map((item) =>
            item.id === updatedInstructor.id ? updatedInstructor : item,
          ),
        );

        toast.success('Instructor actualizado correctamente');
      } else {
        const newInstructor = await instructorService.create(data);

        setInstructors((previous) => [...previous, newInstructor]);

        toast.success('Instructor creado correctamente');
      }

      setDialogOpen(false);
      setInstructorToEdit(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Error al guardar el instructor',
      );

      throw error;
    }
  }

  return {
    instructors,
    loading,
    dialogOpen,
    setDialogOpen,
    instructorToEdit,
    handleNew,
    handleEdit,
    handleDelete,
    handleSave,
    deleteConfirm,
    setDeleteConfirm,
    confirmDelete,
    isDeleting,
  };
}
