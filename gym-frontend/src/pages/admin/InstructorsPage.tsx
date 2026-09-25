import InstructorsDataTable from '@/features/instructors/components/InstructorsDataTable'
import InstructorFormDialog from '@/features/instructors/components/InstructorFormDialog'
import ConfirmDeleteDialog from '@/shared/components/ConfirmDeleteDialog'
import { useInstructors } from '@/features/instructors/hooks/useInstructors'
import { usePageTitle } from '@/shared/context/PageHeaderContext'

export default function InstructorsPage() {
  usePageTitle("Instructores")
  const {
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
  } = useInstructors()

  const instructorName = deleteConfirm.instructor
    ? `${deleteConfirm.instructor.name} ${deleteConfirm.instructor.surname}`
    : 'este instructor'

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6">
        <InstructorsDataTable
          instructors={instructors}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddNew={handleNew}
          totalInstructors={instructors.length}
        />
      </div>

      <InstructorFormDialog
        key={`${instructorToEdit?.id ?? 'new'}-${dialogOpen ? 'open' : 'closed'}`}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        instructorToEdit={instructorToEdit}
        onSave={handleSave}
      />

      {/* Modal de confirmación individual */}
      <ConfirmDeleteDialog
        open={deleteConfirm.open}
        title={`¿Confirmás eliminar a ${instructorName}?`}
        description="Esta acción eliminará al instructor del sistema y no se puede deshacer."
        isLoading={isDeleting}
        onClose={() => setDeleteConfirm({ open: false, instructor: null })}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
