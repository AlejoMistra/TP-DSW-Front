import { useState, useMemo, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Search } from 'lucide-react';
import { cn } from '@/shared/utils/utils';
import type { Exercise } from '@/features/exercises/models/Exercise';

interface ReplaceExerciseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentExerciseName?: string;
    currentExerciseId?: number;
    availableExercises: Exercise[];
    existingExerciseIds?: number[];
    onReplace: (newExercise: Exercise) => void;
}

export function ReplaceExerciseDialog({
    open,
    onOpenChange,
    currentExerciseName,
    currentExerciseId,
    availableExercises,
    existingExerciseIds = [],
    onReplace,
}: ReplaceExerciseDialogProps) {
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!open) {
            setSearch('');
        }
    }, [open]);

    // Exercises already in routine (except the one currently being replaced)
    const existingSet = useMemo(() => {
        const set = new Set(existingExerciseIds);
        if (currentExerciseId) {
            set.delete(currentExerciseId);
        }
        return set;
    }, [existingExerciseIds, currentExerciseId]);

    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        if (!q) return availableExercises;
        return availableExercises.filter(
            (e) =>
                e.name.toLowerCase().includes(q) ||
                e.muscleGroup.toLowerCase().includes(q) ||
                (e.description?.toLowerCase().includes(q) ?? false)
        );
    }, [availableExercises, search]);

    const handleSelect = (exercise: Exercise) => {
        if (existingSet.has(exercise.id)) return;
        onReplace(exercise);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg w-[95vw] sm:w-full max-h-[90dvh] flex flex-col p-4 sm:p-6 gap-0 overflow-hidden">
                <DialogHeader className="shrink-0 pb-1">
                    <DialogTitle className="text-xl font-bold">Reemplazar Ejercicio</DialogTitle>
                    <DialogDescription>
                        {currentExerciseName ? (
                            <>
                                Seleccioná el nuevo ejercicio para reemplazar{' '}
                                <span className="font-semibold text-foreground">
                                    {currentExerciseName}
                                </span>
                                .
                            </>
                        ) : (
                            'Seleccioná el nuevo ejercicio para reemplazar el actual.'
                        )}
                    </DialogDescription>
                </DialogHeader>

                <div className="relative mt-3 shrink-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre o músculo..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 my-3">
                    {filtered.length === 0 ? (
                        <p className="text-center py-8 text-sm text-muted-foreground">
                            No se encontraron ejercicios.
                        </p>
                    ) : (
                        filtered.map((ex) => {
                            const isAlreadyInRoutine = existingSet.has(ex.id);
                            const isCurrent = ex.id === currentExerciseId;

                            return (
                                <div
                                    key={ex.id}
                                    role={isAlreadyInRoutine || isCurrent ? undefined : 'button'}
                                    tabIndex={isAlreadyInRoutine || isCurrent ? undefined : 0}
                                    onKeyDown={(e) => {
                                        if (
                                            !isAlreadyInRoutine &&
                                            !isCurrent &&
                                            (e.key === 'Enter' || e.key === ' ')
                                        ) {
                                            e.preventDefault();
                                            handleSelect(ex);
                                        }
                                    }}
                                    onClick={() => {
                                        if (!isAlreadyInRoutine && !isCurrent) {
                                            handleSelect(ex);
                                        }
                                    }}
                                    className={cn(
                                        'flex items-center justify-between gap-3 p-3 rounded-xl border transition-all text-left select-none',
                                        isCurrent
                                            ? 'opacity-60 bg-muted/20 border-border/50 cursor-default'
                                            : isAlreadyInRoutine
                                                ? 'opacity-60 bg-muted/20 border-border/50 cursor-not-allowed'
                                                : 'border-border bg-card hover:bg-muted/40 hover:border-border/80 cursor-pointer shadow-xs'
                                    )}
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-sm truncate">{ex.name}</p>
                                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                            <span className="text-xs text-muted-foreground">{ex.muscleGroup}</span>
                                            <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                                                {ex.difficultyLevel === 'BEGINNER' && 'Principiante'}
                                                {ex.difficultyLevel === 'INTERMEDIATE' && 'Intermedio'}
                                                {ex.difficultyLevel === 'ADVANCED' && 'Avanzado'}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="shrink-0 flex items-center">
                                        {isCurrent ? (
                                            <Badge variant="outline" className="text-xs font-normal py-1 px-2">
                                                Actual
                                            </Badge>
                                        ) : isAlreadyInRoutine ? (
                                            <Badge variant="secondary" className="text-xs font-normal py-1 px-2">
                                                Ya en la rutina
                                            </Badge>
                                        ) : (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSelect(ex);
                                                }}
                                                className="gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                                            >
                                                Seleccionar
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <DialogFooter className="shrink-0 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 p-4 sm:px-6 sm:py-3.5 flex flex-row items-center justify-end border-t border-border bg-muted/20 mt-auto">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancelar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
