import { useState, useEffect, useMemo } from 'react'
import {
  Timer,
  RotateCcw,
  Play,
  Pause,
  Check,
  Dumbbell,
  ArrowLeft,
  Flag,
  Flame,
} from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shared/components/ui/dialog'
import type { Routine } from '../models/Routine'
import { routineService } from '../api/routineService'

interface ActiveRoutineTrackerProps {
  routine: Routine
  onFinish: () => void
  onCancel: () => void
}

export function ActiveRoutineTracker({
  routine,
  onFinish,
  onCancel,
}: ActiveRoutineTrackerProps) {
  const [fullRoutine, setFullRoutine] = useState<Routine>(routine)
  const [loading, setLoading] = useState(false)

  const [totalSeconds, setTotalSeconds] = useState(0)

  const DEFAULT_REST = 90
  const [restSeconds, setRestSeconds] = useState(DEFAULT_REST)
  const [isResting, setIsResting] = useState(false)

  const [completedExercises, setCompletedExercises] = useState<number[]>([])

  const [showSummary, setShowSummary] = useState(false)

  useEffect(() => {
    if (routine.id) {
      setLoading(true)
      routineService
        .getById(routine.id)
        .then((data) => setFullRoutine(data))
        .catch(() => setFullRoutine(routine))
        .finally(() => setLoading(false))
    }
  }, [routine.id])

  useEffect(() => {
    if (showSummary) return

    const timer = setInterval(() => {
      setTotalSeconds((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [showSummary])


  useEffect(() => {
    if (!isResting) return

    const timer = setInterval(() => {
      setRestSeconds((prev) => {
        if (prev <= 1) {
          setIsResting(false)
          return DEFAULT_REST
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isResting])

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    const s = secs % 60
    return `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const formatRest = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const exercises = useMemo(
    () => fullRoutine.routineExercises || [],
    [fullRoutine],
  )

  const toggleExercise = (id: number) => {
    setCompletedExercises((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const handleFinalize = () => {
    setIsResting(false)
    setShowSummary(true)
  }

  return (
    <div className="mx-auto max-w-xl space-y-5 pb-10">
      {/* Botón Volver / Cancelar */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 size-4" />
          Cambiar rutina
        </Button>
      </div>

      {/* Header del Entrenamiento Actual y Tiempo */}
      <div className="flex items-center justify-between rounded-xl border border-border/80 bg-card p-4 shadow-sm">
        <div>
          <span className="text-sm font-semibold tracking-wider text-primary uppercase">
            Entrenamiento Actual
          </span>
          <h2 className="text-xl font-bold text-foreground">
            {fullRoutine.name}
          </h2>
        </div>
        <div className="text-right">
          <span className="text-sm font-medium text-muted-foreground uppercase">
            Tiempo
          </span>
          <p className="font-mono text-2xl font-bold tracking-tight text-primary">
            {formatTime(totalSeconds)}
          </p>
        </div>
      </div>

      {/* Tarjeta: Cronómetro de Descanso */}
      <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-card text-primary">
            <Timer className="size-6" />
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground uppercase">
              Cronómetro de descanso
            </span>
            <p className="font-mono text-xl font-bold text-foreground">
              {formatRest(restSeconds)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Botón Reset */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              setIsResting(false)
              setRestSeconds(DEFAULT_REST)
            }}
            className="size-10 rounded-full text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-4" />
          </Button>

          {/* Botón Play/Pause Amarillo */}
          <Button
            type="button"
            size="icon"
            onClick={() => setIsResting(!isResting)}
            className="size-11 rounded-full"
          >
            {isResting ? (
              <Pause className="size-5 fill-current" />
            ) : (
              <Play className="size-5 fill-current pl-0.5" />
            )}
          </Button>
        </div>
      </div>

      {/* Lista de Ejercicios */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Cargando ejercicios de la rutina...
          </div>
        ) : exercises.length === 0 ? (
          <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            Esta rutina no contiene ejercicios registrados.
          </div>
        ) : (
          exercises.map((item, index) => {
            const isDone = completedExercises.includes(item.id || index)
            const exerciseName = item.exercise?.name || `Ejercicio ${index + 1}`
            const muscleGroup = item.exercise?.muscleGroup || 'GENERAL'

            return (
              <div
                key={item.id || index}
                className={`relative flex items-center justify-between rounded-2xl border p-4 transition-all duration-200 ${isDone
                  ? 'border-primary bg-primary/5'
                  : 'border-border/80 bg-card hover:border-primary/30'
                  }`}
              >
                {/* Lado izquierdo: Icono de ejercicio + Textos */}
                <div className="flex items-center gap-3.5">
                  <div
                    className={`flex size-12 items-center justify-center rounded-xl transition-colors ${isDone
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                      }`}
                  >
                    <Dumbbell className="size-6" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold text-lg ${isDone
                          ? 'text-muted-foreground line-through'
                          : 'text-foreground'
                          }`}
                      >
                        {exerciseName}
                      </span>
                      <span className="rounded-full text-xs bg-foreground/10 px-2 py-0.5 font-semibold tracking-wider text-foreground uppercase">
                        {muscleGroup}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        SERIES:{' '}
                        <strong className="text-foreground font-semibold">
                          {item.sets ?? 3} × {item.reps ?? 12}
                        </strong>
                      </span>
                      {item.weight !== null && item.weight !== undefined && (
                        <span className="text-muted-foreground">
                          PESO:{' '}
                          <strong className="text-primary font-semibold">
                            {item.weight} kg
                          </strong>
                        </span>
                      )}
                    </div>

                    {item.notes && (
                      <p className="text-sm text-muted-foreground italic">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Botón Circular de Checkmark (Estilo Mockup) */}
                <button
                  type="button"
                  onClick={() => toggleExercise(item.id || index)}
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full border-2 transition-all ${isDone
                    ? 'border-primary bg-primary shadow-md'
                    : 'border-muted-foreground/30 text-transparent hover:border-primary/60'
                    }`}
                  aria-label={
                    isDone ? 'Marcar como pendiente' : 'Marcar como completado'
                  }
                >
                  <Check className={`size-5 stroke-3 ${isDone ? ' text-primary-foreground'
                    : ''}`} />
                </button>
              </div>
            )
          })
        )}
      </div>

      {/* Botón Grande: FINALIZAR ENTRENAMIENTO */}
      <div className="pt-2">
        <Button
          type="button"
          onClick={handleFinalize}
          className="h-14 w-full rounded-2xl bg-amber-400 text-base font-extrabold tracking-wider text-black shadow-lg transition-transform hover:scale-[1.01] hover:bg-amber-300"
        >
          FINALIZAR ENTRENAMIENTO
          <Flag className="ml-2 size-5 fill-current" />
        </Button>
      </div>

      {/* Modal Resumen de Finalización */}
      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="max-w-sm rounded-2xl text-center">
          <DialogHeader className="items-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 mb-2">
              <Flame className="size-8" />
            </div>
            <DialogTitle className="text-2xl font-bold">
              ¡Entrenamiento completado!
            </DialogTitle>
            <DialogDescription>
              Completaste tu sesión de{' '}
              <strong className="text-foreground">{fullRoutine.name}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 grid grid-cols-2 gap-3 rounded-xl border bg-muted/40 p-4">
            <div>
              <span className="text-xs text-muted-foreground">
                Tiempo total
              </span>
              <p className="font-mono text-xl font-bold text-amber-400">
                {formatTime(totalSeconds)}
              </p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Ejercicios</span>
              <p className="text-xl font-bold text-foreground">
                {completedExercises.length} / {exercises.length}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              className="w-full bg-amber-400 font-bold text-black hover:bg-amber-300"
              onClick={() => {
                setShowSummary(false)
                onFinish()
              }}
            >
              Volver a Rutinas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
