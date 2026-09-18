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
            <DialogContent className="max-w-lg w-[95vw] sm:w-full max-h-[85dvh] flex flex-col p-4 sm:p-6 gap-0 overflow-hidden">
                <DialogHeader className="shrink-0 text-left pr-6 sm:pr-8 space-y-1.5">
                    <div className="flex items-start justify-between gap-3">
                        <DialogTitle className="text-xl sm:text-2xl font-bold leading-tight wrap-break-word">
                            {current.name}
                        </DialogTitle>
                        <Badge
                            variant="outline"
                            className="text-xs uppercase shrink-0 mt-0.5"
                        >
                            {current.difficulty === 'BEGINNER' && 'Principiante'}
                            {current.difficulty === 'INTERMEDIATE' && 'Intermedio'}
                            {current.difficulty === 'ADVANCED' && 'Avanzado'}
                        </Badge>
                    </div>
                    {current.description && (
                        <DialogDescription className="text-sm text-muted-foreground wrap-break-word text-left">
                            {current.description}
                        </DialogDescription>
                    )}
                </DialogHeader>

                <div className="flex-1 min-h-0 overflow-y-auto mt-4 space-y-3 pr-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-muted-foreground">
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
                                    className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3 sm:p-4 text-card-foreground shadow-sm"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
                                                {item.order ?? idx + 1}
                                            </span>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-sm sm:text-base wrap-break-word">
                                                    {item.exercise?.name ?? `Ejercicio #${item.exerciseId}`}
                                                </p>
                                                {item.exercise?.muscleGroup && (
                                                    <span className="text-xs text-muted-foreground block truncate">
                                                        {item.exercise.muscleGroup}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 text-center text-xs mt-1">
                                        <div className="rounded-lg bg-muted/60 p-1.5 sm:p-2">
                                            <span className="text-muted-foreground block text-[11px] sm:text-xs">Series</span>
                                            <span className="font-bold text-xs sm:text-sm">{item.sets ?? '-'}</span>
                                        </div>
                                        <div className="rounded-lg bg-muted/60 p-1.5 sm:p-2">
                                            <span className="text-muted-foreground block text-[11px] sm:text-xs">Reps</span>
                                            <span className="font-bold text-xs sm:text-sm">{item.reps ?? '-'}</span>
                                        </div>
                                        <div className="rounded-lg bg-muted/60 p-1.5 sm:p-2">
                                            <span className="text-muted-foreground block text-[11px] sm:text-xs">Peso (kg)</span>
                                            <span className="font-bold text-xs sm:text-sm">{item.weight ?? '-'}</span>
                                        </div>
                                    </div>

                                    {item.notes && (
                                        <div className="text-xs text-muted-foreground mt-1 rounded-md bg-muted/30 px-2.5 py-1.5 border border-border/50 wrap-break-word">
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
