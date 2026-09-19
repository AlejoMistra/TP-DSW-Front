import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { memberService } from '@/features/members/api/memberService';
import type { ExtendedMember } from '@/features/members/models/ExtendedMember';
import type { MemberWithMembership } from '@/features/members/models/MemberWithMembership';

export function useMembers() {
  const [members, setMembers] = useState<ExtendedMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado para el modal de confirmación
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    member: ExtendedMember | null;
  }>({
    open: false,
    member: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        setLoading(true);
        const data = await memberService.getAllMembersWithMembership();
        const extendedMembers: ExtendedMember[] = (
          data as MemberWithMembership[]
        ).map((member) => {
          const isCancelled = member.membership?.status === 'CANCELLED';
          const effectiveStatus = isCancelled ? 'INACTIVE' : member.status;
          return {
            ...member,
            status: effectiveStatus,
            plan:
              member.membership?.membershipPlan?.name || 'Plan no disponible',
            nextExpiration: member.membership?.endDate || member.createdAt,
            membershipStatus: isCancelled
              ? 'INACTIVE'
              : (member.membership
                  ?.status as ExtendedMember['membershipStatus']) ||
                member.status,
          };
        });

        setMembers(extendedMembers);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error desconocido';
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, []);

  // Abre el modal guardando el socio seleccionado
  const handleDelete = (id: number) => {
    const member = members.find((m) => m.id === id) || null;
    setDeleteConfirm({
      open: true,
      member,
    });
  };

  // Ejecuta la eliminación al confirmar en el modal
  const confirmDelete = async () => {
    if (!deleteConfirm.member) return;

    const { id } = deleteConfirm.member;

    try {
      setIsDeleting(true);
      await memberService.delete(id);
      toast.success('Miembro eliminado exitosamente');
      setMembers((prevMembers) => prevMembers.filter((m) => m.id !== id));
      setDeleteConfirm({ open: false, member: null });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al eliminar';
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const activeCount = members.filter((m) => m.status === 'ACTIVE').length;
  const inactiveCount = members.filter((m) => m.status === 'INACTIVE').length;
  const totalCount = members.length;

  return {
    members,
    loading,
    activeCount,
    inactiveCount,
    totalCount,
    handleDelete,
    deleteConfirm,
    setDeleteConfirm,
    confirmDelete,
    isDeleting,
  };
}
