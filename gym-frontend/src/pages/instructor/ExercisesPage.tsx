import { useState } from 'react'
import { useExercises } from '@/features/exercises/hooks/useExercises'
import { ExerciseHeader } from '@/features/exercises/components/ExerciseHeader'
import { ExerciseDataTable } from '@/features/exercises/components/ExerciseDataTable'
import { ExerciseFormDialog } from '@/features/exercises/components/ExerciseFormDialog'
import type { Exercise } from '@/features/exercises/models/Exercise'

export default function ExercisesPage() {
  const { exercises, loading, handleDelete, refetch } = useExercises()
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
        loading={loading}
      />
      <ExerciseFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        exercise={selectedExercise}
        onSuccess={refetch}
      />
    </div>
  )
}