import { useState } from 'react'
import ConfirmDeleteDialog from '@/shared/components/ConfirmDeleteDialog'
import { useExercises } from '@/features/exercises/hooks/useExercises'
import { ExerciseHeader } from '@/features/exercises/components/ExerciseHeader'
import { ExerciseDataTable } from '@/features/exercises/components/ExerciseDataTable'
import { ExerciseFormDialog } from '@/features/exercises/components/ExerciseFormDialog'
import type { Exercise } from '@/features/exercises/models/Exercise'

export default function ExercisesPage() {
  const {
    exercises,
    loading,
    handleDelete,
    handleMultipleDelete,
    deleteConfirm,
    setDeleteConfirm,
    confirmDelete,
    isDeleting,
    refetch,
  } = useExercises()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)

  const handleEdit = (exercise: Exercise) => {
    setSelectedExercise(exercise)
    setDialogOpen(true)
  }

  const handleNewExercise = () => {
    setSelectedExercise(null)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <ExerciseHeader totalExercises={exercises.length} onNew={handleNewExercise} />
      <ExerciseDataTable
        exercises={exercises}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onMultipleDelete={handleMultipleDelete}
        loading={loading}
      />
      <ExerciseFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        exercise={selectedExercise}
        onSuccess={refetch}
      />
      <ConfirmDeleteDialog
        open={deleteConfirm.open}
        title="¿Confirmás eliminar este ejercicio?"
        description="Esta acción eliminará el ejercicio del sistema y no se puede deshacer."
        isLoading={isDeleting}
        onClose={() => setDeleteConfirm({ open: false, ids: [] })}
        onConfirm={confirmDelete}
      />
    </div>
  )
}