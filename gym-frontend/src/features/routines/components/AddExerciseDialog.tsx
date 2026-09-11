import { useState, useMemo } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Search, Plus } from 'lucide-react';
import type { Exercise } from '@/features/exercises/models/Exercise';

interface AddExerciseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    availableExercises: Exercise[];
    onSelect: (exercise: Exercise) => void;
}

export function AddExerciseDialog({
    open,
    onOpenChange,
    availableExercises,
    onSelect,
}: AddExerciseDialogProps) {
    const [search, setSearch] = useState('');

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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg p-6">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Añadir Ejercicio</DialogTitle>
                    <DialogDescription>
                        Elegí un ejercicio del catálogo para incorporarlo a la rutina.
                    </DialogDescription>
                </DialogHeader>

                <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre o músculo..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <div className="mt-3 max-h-80 overflow-y-auto space-y-2 pr-1">
                    {filtered.length === 0 ? (
                        <p className="text-center py-6 text-sm text-muted-foreground">
                            No se encontraron ejercicios.
                        </p>
                    ) : (
                        filtered.map((ex) => (
                            <div
                                key={ex.id}
                                className="flex items-center justify-between p-3 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors"
                            >
                                <div>
                                    <p className="font-semibold text-sm">{ex.name}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-xs text-muted-foreground">{ex.muscleGroup}</span>
                                        <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                                            {ex.difficultyLevel === 'BEGINNER' && 'Principiante'}
                                            {ex.difficultyLevel === 'INTERMEDIATE' && 'Intermedio'}
                                            {ex.difficultyLevel === 'ADVANCED' && 'Avanzado'}
                                        </Badge>
                                    </div>
                                </div>

                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        onSelect(ex);
                                        onOpenChange(false);
                                    }}
                                    className="gap-1"
                                >
                                    <Plus className="size-3.5" />
                                    Agregar
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
