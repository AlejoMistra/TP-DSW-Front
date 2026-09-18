import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import type {
  MembershipPlan,
  CreateMembershipPlanInput,
} from '@/features/membershipPlans/models/MembershipPlan';
import { membershipPlanService } from '@/features/membershipPlans/api/membershipPlanService';

export function useMembershipPlans() {
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [planToEdit, setPlanToEdit] = useState<MembershipPlan | null>(null);

  // Estado para el diálogo de confirmación
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    plan: MembershipPlan | null;
  }>({
    open: false,
    plan: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadMembershipPlans() {
      try {
        setLoading(true);
        const data = await membershipPlanService.getAll();
        setMembershipPlans(data);
      } catch (error) {
        toast.error('Error al cargar los planes de membresía');
      } finally {
        setLoading(false);
      }
    }
    loadMembershipPlans();
  }, []);

  function handleNew() {
    setPlanToEdit(null);
    setDialogOpen(true);
  }

  function handleEdit(plan: MembershipPlan) {
    setPlanToEdit(plan);
    setDialogOpen(true);
  }

  // Abre el modal de confirmación
  function handleDelete(id: number) {
    const plan = membershipPlans.find((p) => p.id === id) || null;
    setDeleteConfirm({
      open: true,
      plan,
    });
  }

  // Ejecuta la eliminación al confirmar en el modal
  async function confirmDelete() {
    if (!deleteConfirm.plan) return;

    const { id } = deleteConfirm.plan;

    try {
      setIsDeleting(true);
      await membershipPlanService.delete(id);
      setMembershipPlans((prev) => prev.filter((p) => p.id !== id));
      toast.success('Plan de membresía eliminado correctamente');
      setDeleteConfirm({ open: false, plan: null });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Error al eliminar el plan de membresía',
      );
    } finally {
      setIsDeleting(false);
    }
  }

  function handleSave(data: CreateMembershipPlanInput, id?: number) {
    const request =
      id !== undefined
        ? membershipPlanService.update(id, data).then((updatedPlan) => {
            setMembershipPlans((prev) =>
              prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)),
            );
          })
        : membershipPlanService.create(data).then((newPlan) => {
            setMembershipPlans((prev) => [...prev, newPlan]);
          });

    toast.promise(request, {
      loading: id !== undefined ? 'Actualizando plan...' : 'Creando plan...',
      success:
        id !== undefined
          ? 'Plan de membresía actualizado correctamente'
          : 'Plan de membresía creado correctamente',
      error: (error) =>
        error instanceof Error
          ? error.message
          : 'Error al guardar el plan de membresía',
    });

    return request;
  }

  return {
    membershipPlans,
    loading,
    dialogOpen,
    setDialogOpen,
    planToEdit,
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
