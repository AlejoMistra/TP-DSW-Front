import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/shared/components/ui/dialog';
import { Badge } from '@/shared/components/ui/badge';
import type { Routine } from '../models/Routine';
import { routineService } from '../api/routineService';

interface RoutineDetailsDialogProps {
    routine: Routine | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function RoutineDetailsDialog({
    routine,
    open,
    onOpenChange,
}: RoutineDetailsDialogProps) {
    const [fullRoutine, setFullRoutine] = useState<Routine | null>(routine);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && routine?.id) {
            setLoading(true);
            routineService
                .getById(routine.id)
                .then((data) => setFullRoutine(data))
                .catch(() => setFullRoutine(routine))
                .finally(() => setLoading(false));
        } else {
            setFullRoutine(routine);
        }
    }, [open, routine]);

    if (!routine) return null;

    const current = fullRoutine || routine;
    const exercises = current.routineExercises || [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-6">
                <DialogHeader>
                    <div className="flex items-center justify-between gap-4">
                        <DialogTitle className="text-2xl font-bold">
                            {current.name}
                        </DialogTitle>
                        <Badge
                            variant={
                                current.difficulty === 'BEGINNER'
                                    ? 'default'
                                    : current.difficulty === 'INTERMEDIATE'
                                        ? 'outline'
                                        : 'destructive'
                            }
                            className={
                                current.difficulty === 'BEGINNER'
                                    ? 'bg-green-700 text-green-300'
                                    : ''
                            }
                        >
                            {current.difficulty === 'BEGINNER' && 'Principiante'}
                            {current.difficulty === 'INTERMEDIATE' && 'Intermedio'}
                            {current.difficulty === 'ADVANCED' && 'Avanzado'}
                        </Badge>
                    </div>
                    {current.description && (
                        <DialogDescription className="mt-1 text-sm text-muted-foreground">
                            {current.description}
                        </DialogDescription>
                    )}
                </DialogHeader>

                <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                            Ejercicios ({exercises.length})
                        </h3>
                        {loading && (
                            <span className="text-xs text-muted-foreground animate-pulse">
                                Actualizando ejercicios...
                            </span>
                        )}
                    </div>

                    {exercises.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-6 text-center border border-dashed rounded-xl">
                            Esta rutina todavía no tiene ejercicios asociados.
                        </p>
                    ) : (
                        <div className="space-y-2.5">
                            {exercises.map((item, idx) => (
                                <div
                                    key={item.id ?? idx}
                                    className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3.5 sm:p-4 text-card-foreground shadow-sm"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
                                                {item.order ?? idx + 1}
                                            </span>
                                            <div>
                                                <p className="font-semibold text-base">
                                                    {item.exercise?.name ?? `Ejercicio #${item.exerciseId}`}
                                                </p>
                                                {item.exercise?.muscleGroup && (
                                                    <span className="text-xs text-muted-foreground">
                                                        {item.exercise.muscleGroup}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 text-center text-xs mt-1">
                                        <div className="rounded-lg bg-muted/60 p-2">
                                            <span className="text-muted-foreground block">Series</span>
                                            <span className="font-bold text-sm">{item.sets ?? '-'}</span>
                                        </div>
                                        <div className="rounded-lg bg-muted/60 p-2">
                                            <span className="text-muted-foreground block">Reps</span>
                                            <span className="font-bold text-sm">{item.reps ?? '-'}</span>
                                        </div>
                                        <div className="rounded-lg bg-muted/60 p-2">
                                            <span className="text-muted-foreground block">Peso (kg)</span>
                                            <span className="font-bold text-sm">{item.weight ?? '-'}</span>
                                        </div>
                                    </div>

                                    {item.notes && (
                                        <div className="text-xs text-muted-foreground mt-1 rounded-md bg-muted/30 px-2.5 py-1.5 border border-border/50">
                                            <span className="font-medium text-foreground">Aclaraciones:</span>{' '}
                                            {item.notes}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
