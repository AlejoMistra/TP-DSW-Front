import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Plus } from 'lucide-react'

interface ExerciseHeaderProps {
  totalExercises: number
  onNew: () => void
}

export function ExerciseHeader({ totalExercises, onNew }: ExerciseHeaderProps) {
  return (
    <section className="rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Ejercicios</h1>
            <p className="max-w-2xl text-sm sm:text-base">
              Gestioná los ejercicios disponibles. Podés agregar, editar o eliminar según sea necesario.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1 text-xs sm:text-sm">
              Total de ejercicios: {totalExercises}
            </Badge>
          </div>
        </div>

        <Button size="default" className="w-full md:w-auto md:px-5" onClick={onNew}>
          <Plus className="mr-1 size-3.5" aria-hidden="true" />
          Nuevo Ejercicio
        </Button>
      </div>
    </section>
  )
}