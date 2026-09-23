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
import { Search, Plus, Check } from 'lucide-react';
import { cn } from '@/shared/utils/utils';
import type { Exercise } from '@/features/exercises/models/Exercise';

interface AddExerciseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    availableExercises: Exercise[];
    existingExerciseIds?: number[];
    onAddExercises: (exercises: Exercise[]) => void;
    onSelect?: (exercise: Exercise) => void;
}

export function AddExerciseDialog({
    open,
    onOpenChange,
    availableExercises,
    existingExerciseIds = [],
    onAddExercises,
    onSelect,
}: AddExerciseDialogProps) {
    const [search, setSearch] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

    // Reset selection and search state when dialog closes
    useEffect(() => {
        if (!open) {
            setSelectedIds(new Set());
            setSearch('');
        }
    }, [open]);

    const existingSet = useMemo(() => new Set(existingExerciseIds), [existingExerciseIds]);

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

    const toggleSelect = (id: number) => {
        if (existingSet.has(id)) return;
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const handleAdd = () => {
        const toAdd = availableExercises.filter((ex) => selectedIds.has(ex.id));
        if (toAdd.length === 0) return;

        if (onAddExercises) {
            onAddExercises(toAdd);
        } else if (onSelect) {
            toAdd.forEach((ex) => onSelect(ex));
        }

        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg w-[95vw] sm:w-full max-h-[90dvh] flex flex-col p-4 sm:p-6 gap-0 overflow-hidden">
                <DialogHeader className="shrink-0 pb-1">
                    <DialogTitle className="text-xl font-bold">Añadir Ejercicios</DialogTitle>
                    <DialogDescription>
                        Seleccioná uno o varios ejercicios para incorporarlos a la rutina.
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
                            const isAlreadyAdded = existingSet.has(ex.id);
                            const isSelected = selectedIds.has(ex.id);

                            return (
                                <div
                                    key={ex.id}
                                    role={isAlreadyAdded ? undefined : 'button'}
                                    tabIndex={isAlreadyAdded ? undefined : 0}
                                    onKeyDown={(e) => {
                                        if (!isAlreadyAdded && (e.key === 'Enter' || e.key === ' ')) {
                                            e.preventDefault();
                                            toggleSelect(ex.id);
                                        }
                                    }}
                                    onClick={() => {
                                        if (!isAlreadyAdded) {
                                            toggleSelect(ex.id);
                                        }
                                    }}
                                    className={cn(
                                        'flex items-center justify-between gap-3 p-3 rounded-xl border transition-all text-left select-none',
                                        isAlreadyAdded
                                            ? 'opacity-60 bg-muted/20 border-border/50 cursor-not-allowed'
                                            : isSelected
                                                ? 'border-primary bg-primary/10 ring-1 ring-primary/40 cursor-pointer shadow-xs'
                                                : 'border-border bg-card hover:bg-muted/40 hover:border-border/80 cursor-pointer'
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
                                        {isAlreadyAdded ? (
                                            <Badge variant="secondary" className="text-xs font-normal py-1 px-2">
                                                Ya en la rutina
                                            </Badge>
                                        ) : isSelected ? (
                                            <Button
                                                size="sm"
                                                variant="default"
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleSelect(ex.id);
                                                }}
                                                className="gap-1.5 text-xs font-medium"
                                            >
                                                <Check className="size-3.5" />
                                                Seleccionado
                                            </Button>
                                        ) : (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleSelect(ex.id);
                                                }}
                                                className="gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                                            >
                                                <Plus className="size-3.5" />
                                                Seleccionar
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <DialogFooter className="shrink-0 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 p-4 sm:px-6 sm:py-3.5 flex flex-row items-center justify-between sm:justify-between border-t border-border bg-muted/20 mt-auto">
                    <span className="text-xs sm:text-sm text-muted-foreground font-medium">
                        {selectedIds.size === 0
                            ? 'Ninguno seleccionado'
                            : `${selectedIds.size} seleccionado${selectedIds.size === 1 ? '' : 's'}`}
                    </span>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            disabled={selectedIds.size === 0}
                            onClick={handleAdd}
                            className="gap-1.5"
                        >
                            <Plus className="size-3.5" />
                            Agregar {selectedIds.size > 0 ? `(${selectedIds.size})` : ''}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
