import InstructorsDataTable from '@/features/instructors/components/InstructorsDataTable'
import InstructorFormDialog from '@/features/instructors/components/InstructorFormDialog'
import InstructorsHeader from '@/features/instructors/components/InstructorsHeader'
import { useInstructors } from '@/features/instructors/hooks/useInstructors'

export default function InstructorsPage() {
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
  } = useInstructors()

  return (
    <div className="space-y-4">
      <InstructorsHeader
        totalInstructors={instructors.length}
        onNew={handleNew}
      />

      <div className="rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6">
        <InstructorsDataTable
          instructors={instructors}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <InstructorFormDialog
        key={`${instructorToEdit?.id ?? 'new'}-${dialogOpen ? 'open' : 'closed'}`}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        instructorToEdit={instructorToEdit}
        onSave={handleSave}
      />
    </div>
  )
}