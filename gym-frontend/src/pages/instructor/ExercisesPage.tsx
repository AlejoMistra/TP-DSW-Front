import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ConfirmDeleteDialog from '@/shared/components/ConfirmDeleteDialog'
import { useExercises } from '@/features/exercises/hooks/useExercises'
import { ExerciseDataTable } from '@/features/exercises/components/ExerciseDataTable'
import { ExerciseFormDialog } from '@/features/exercises/components/ExerciseFormDialog'
import type { Exercise } from '@/features/exercises/models/Exercise'
import { usePageTitle } from '@/shared/context/PageHeaderContext'

export default function ExercisesPage() {
  usePageTitle("Ejercicios")
  const [searchParams, setSearchParams] = useSearchParams()
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
  const [dialogOpen, setDialogOpen] = useState(() => searchParams.get('new') === 'true')
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)

  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setSelectedExercise(null)
      setDialogOpen(true)
    }
  }, [searchParams])

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open && searchParams.get('new')) {
      searchParams.delete('new')
      setSearchParams(searchParams, { replace: true })
    }
  }

  const handleEdit = (exercise: Exercise) => {
    setSelectedExercise(exercise)
    setDialogOpen(true)
  }

  const handleNewExercise = () => {
    setSelectedExercise(null)
    setDialogOpen(true)
  }

  return (
    <div className="flex flex-col">
      <ExerciseDataTable
        exercises={exercises}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onMultipleDelete={handleMultipleDelete}
        loading={loading}
        onNew={handleNewExercise}
        totalExercises={exercises.length}
      />
      <ExerciseFormDialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
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