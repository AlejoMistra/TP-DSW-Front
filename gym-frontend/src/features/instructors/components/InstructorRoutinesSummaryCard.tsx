import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, ClipboardList, Layers } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { useRoutines } from '@/features/routines/hooks/useRoutines';
import { exerciseService } from '@/features/exercises/api/exerciseService';
import type { Routine, RoutineDifficulty } from '@/features/routines/models/Routine';

interface InstructorRoutinesSummaryCardProps {
  maxItems?: number;
  className?: string;
}

const DIFFICULTY_MAP: Record<
  RoutineDifficulty,
  { label: string; variant: 'secondary' | 'default' | 'destructive' | 'outline' }
> = {
  BEGINNER: { label: 'Principiante', variant: 'secondary' },
  INTERMEDIATE: { label: 'Intermedio', variant: 'default' },
  ADVANCED: { label: 'Avanzado', variant: 'destructive' },
};

export function InstructorRoutinesSummaryCard({
  maxItems = 3,
  className,
}: InstructorRoutinesSummaryCardProps) {
  const { routines, loading: routinesLoading } = useRoutines();
  const [exercisesCount, setExercisesCount] = useState<number>(0);
  const [exercisesLoading, setExercisesLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;
    async function loadExerciseCount() {
      try {
        const exercises = await exerciseService.getAllExercises();
        if (!cancelled) {
          setExercisesCount(exercises.length);
        }
      } catch {
        // Fallback gracefully
      } finally {
        if (!cancelled) {
          setExercisesLoading(false);
        }
      }
    }
    void loadExerciseCount();
    return () => {
      cancelled = true;
    };
  }, []);

  const loading = routinesLoading || exercisesLoading;
  const recentRoutines = routines.slice(0, maxItems);

  return (
    <Card
      className={`relative overflow-hidden rounded-3xl border border-border/80 bg-card p-2 sm:p-6 shadow-md transition-all hover:shadow-lg ${className || ''}`}
    >
      <CardHeader className="p-4 pb-2 sm:p-5 sm:pb-3 md:p-4 md:pb-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] sm:text-xs font-bold tracking-widest text-muted-foreground uppercase">
            Gestión de Rutinas
          </span>

          <Badge
            variant="default"
            className="rounded-full px-2.5 sm:px-3 py-0.5 text-[10px] sm:text-xs font-extrabold tracking-wider uppercase shrink-0"
          >
            Catálogo Activo
          </Badge>
        </div>

        <div className="mt-2">
          <CardTitle className="text-xl sm:text-2xl tracking-tight text-foreground">
            Rutinas y Ejercicios
          </CardTitle>
          <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground line-clamp-1">
            Planes de entrenamiento y ejercicios preparados para los socios
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4 p-2 pt-1 sm:p-0 sm:pt-2">
        {/* Métricas destacadas */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-1">
          <div className="flex items-center gap-2 sm:gap-3 rounded-2xl border border-border/60 bg-muted/20 p-2.5 sm:p-3.5">
            <div className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <ClipboardList className="size-4 sm:size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-muted-foreground font-medium truncate">Rutinas Creadas</p>
              <p className="text-lg sm:text-xl font-black text-foreground">
                {loading ? '...' : routines.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 rounded-2xl border border-border/60 bg-muted/20 p-2.5 sm:p-3.5">
            <div className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Dumbbell className="size-4 sm:size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-muted-foreground font-medium truncate">Ejercicios en Banco</p>
              <p className="text-lg sm:text-xl font-black text-foreground">
                {loading ? '...' : exercisesCount}
              </p>
            </div>
          </div>
        </div>

        {/* Listado de Rutinas Recientes */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase text-muted-foreground">
              Últimas Rutinas
            </span>
            <Link
              to="/instructor/rutinas"
              className="text-[11px] sm:text-xs font-semibold text-primary hover:underline"
            >
              Ver todas ({routines.length})
            </Link>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-12 sm:h-14 rounded-2xl border border-border/60 bg-muted/20 animate-pulse"
                />
              ))}
            </div>
          ) : recentRoutines.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/60 bg-muted/10 p-5 text-center text-xs text-muted-foreground">
              Aún no creaste rutinas de entrenamiento.
            </div>
          ) : (
            <div className="space-y-2">
              {recentRoutines.map((routine: Routine) => {
                const diffConfig = DIFFICULTY_MAP[routine.difficulty] || {
                  label: routine.difficulty,
                  variant: 'outline' as const,
                };
                const count = routine.routineExercises?.length || 0;

                return (
                  <div
                    key={routine.id}
                    className="flex items-center justify-between gap-2.5 sm:gap-3 rounded-2xl border border-border/70 bg-card/80 p-2.5 sm:p-3 transition-colors hover:bg-muted/30"
                  >
                    <div className="min-w-0 flex items-center gap-2 sm:gap-2.5">
                      <div className="size-7 sm:size-8 rounded-lg bg-muted/60 flex items-center justify-center shrink-0 text-muted-foreground">
                        <Layers className="size-3.5 sm:size-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-xs sm:text-sm text-foreground truncate">
                          {routine.name}
                        </p>
                        <p className="text-[10px] sm:text-[11px] text-muted-foreground">
                          {count} {count === 1 ? 'ejercicio' : 'ejercicios'}
                        </p>
                      </div>
                    </div>

                    <Badge
                      variant={diffConfig.variant}
                      className="text-[10px] sm:text-[11px] font-bold py-0.5 px-2 sm:px-2.5 shrink-0"
                    >
                      {diffConfig.label}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default InstructorRoutinesSummaryCard;
