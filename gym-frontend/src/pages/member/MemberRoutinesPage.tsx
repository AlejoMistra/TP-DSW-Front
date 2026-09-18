import { useState } from 'react'
import { Dumbbell, Eye, Play, Search } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Input } from '@/shared/components/ui/input'
import { useRoutines } from '@/features/routines/hooks/useRoutines'
import { RoutineDetailsDialog } from '@/features/routines/components/RoutineDetailsDialog'
import type { Routine } from '@/features/routines/models/Routine'
import { ActiveRoutineTracker } from '@/features/routines/components/ActiveRoutineTracker'
import { usePageTitle } from '@/shared/context/PageHeaderContext'

export default function MemberRoutinesPage() {
  const { routines, loading } = useRoutines()

  const [view, setView] = useState<'catalog' | 'workout'>('catalog')
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  usePageTitle(view === 'workout' ? 'Entrenamiento Activo' : 'Rutinas')

  // Si está en modo entrenamiento activo, renderizamos el tracker
  if (view === 'workout' && selectedRoutine) {
    return (
      <ActiveRoutineTracker
        routine={selectedRoutine}
        onFinish={() => {
          setView('catalog')
          setSelectedRoutine(null)
        }}
        onCancel={() => {
          setView('catalog')
          setSelectedRoutine(null)
        }}
      />
    )
  }

  // Filtrado de rutinas
  const filteredRoutines = routines.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Buscador */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar rutina por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Catálogo de Rutinas en Tarjetas */}
      {loading ? (
        <div className="py-12 text-center text-muted-foreground">
          Cargando rutinas disponibles...
        </div>
      ) : filteredRoutines.length === 0 ? (
        <div className="rounded-xl border border-dashed py-12 text-center text-muted-foreground">
          No se encontraron rutinas registradas.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRoutines.map((routine) => (
            <div
              key={routine.id}
              className="flex flex-col justify-between rounded-2xl border bg-card p-5 shadow-sm transition-all hover:border-amber-400/50 hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-bold text-foreground">
                    {routine.name}
                  </h3>
                  <Badge
                    variant={
                      routine.difficulty === 'BEGINNER'
                        ? 'default'
                        : routine.difficulty === 'INTERMEDIATE'
                          ? 'outline'
                          : 'destructive'
                    }
                    className="text-xs uppercase"
                  >
                    {routine.difficulty === 'BEGINNER' && 'Principiante'}
                    {routine.difficulty === 'INTERMEDIATE' && 'Intermedio'}
                    {routine.difficulty === 'ADVANCED' && 'Avanzado'}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {routine.description || 'Sin descripción disponible.'}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Dumbbell className="size-4 text-primary" />
                  <span>
                    {routine.routineExercises?.length || 0} ejercicios
                  </span>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="mt-5 flex items-center gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setSelectedRoutine(routine)
                    setDetailsOpen(true)
                  }}
                >
                  <Eye className="mr-1 size-4" />
                  Ver detalle
                </Button>

                <Button
                  size="sm"
                  className="flex-1 bg-amber-400 font-bold text-black hover:bg-amber-300"
                  onClick={() => {
                    setSelectedRoutine(routine)
                    setView('workout')
                  }}
                >
                  <Play className="mr-1 size-4 fill-current" />
                  Entrenar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para ver detalles de los ejercicios antes de entrenar */}
      <RoutineDetailsDialog
        routine={selectedRoutine}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </div>
  )
}
