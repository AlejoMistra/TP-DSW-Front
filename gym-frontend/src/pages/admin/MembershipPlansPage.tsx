import PlansDataTable from "@/features/membershipPlans/components/PlansDataTable"
import PlanFormDialog from "@/features/membershipPlans/components/MembershipPlanFormDialog"
import MembershipPlansHeader from "@/features/membershipPlans/components/MembershipPlansHeader"
import ConfirmDeleteDialog from "@/shared/components/ConfirmDeleteDialog"
import { useMembershipPlans } from "@/features/membershipPlans/hooks/useMembershipPlans"

export default function MembershipPlansPage() {
  const {
    membershipPlans,
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
  } = useMembershipPlans()

  const planName = deleteConfirm.plan ? deleteConfirm.plan.name : "este plan"

  return (
    <div className="space-y-4">
      <MembershipPlansHeader
        totalPlans={membershipPlans.length}
        onNew={handleNew}
      />

      <div className="rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6">
        <PlansDataTable
          plans={membershipPlans}
          onEdit={handleEdit}
          onDelete={handleDelete}
          title="Listado de Planes"
          subtitle="Planes registrados en el sistema"
        />
      </div>

      <PlanFormDialog
        key={`${planToEdit?.id ?? "new"}-${dialogOpen ? "open" : "closed"}`}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        planToEdit={planToEdit}
        onSave={handleSave}
      />

      {/* Diálogo de confirmación de eliminación */}
      <ConfirmDeleteDialog
        open={deleteConfirm.open}
        title={`¿Confirmás eliminar el plan "${planName}"?`}
        description="Esta acción eliminará el plan del sistema y no se puede deshacer."
        isLoading={isDeleting}
        onClose={() => setDeleteConfirm({ open: false, plan: null })}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
