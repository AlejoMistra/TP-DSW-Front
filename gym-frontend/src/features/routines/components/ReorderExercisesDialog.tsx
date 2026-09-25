import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { GripVertical, ArrowUp, ArrowDown, Check } from 'lucide-react';
import { cn } from '@/shared/utils/utils';
import type { RoutineExerciseItem } from '../models/Routine';

interface ReorderExercisesDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    items: RoutineExerciseItem[];
    onSaveOrder: (reorderedItems: RoutineExerciseItem[]) => void;
}

interface ReorderItemEntry {
    uid: string;
    item: RoutineExerciseItem;
}

export function ReorderExercisesDialog({
    open,
    onOpenChange,
    items,
    onSaveOrder,
}: ReorderExercisesDialogProps) {
    const [orderedList, setOrderedList] = useState<ReorderItemEntry[]>([]);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    // Initialize with stable unique UIDs for smooth animations
    useEffect(() => {
        if (open) {
            setOrderedList(
                items.map((item, idx) => ({
                    uid: `exercise-${item.exerciseId}-${idx}`,
                    item,
                }))
            );
            setDraggedIndex(null);
        }
    }, [open, items]);

    const move = (fromIndex: number, toIndex: number) => {
        if (toIndex < 0 || toIndex >= orderedList.length) return;
        setOrderedList((prev) => {
            const next = [...prev];
            const [moved] = next.splice(fromIndex, 1);
            next.splice(toIndex, 0, moved);
            return next;
        });
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(index));

        // Use the solid card element for the drag preview image
        const cardElement = e.currentTarget;
        if (cardElement) {
            const rect = cardElement.getBoundingClientRect();
            e.dataTransfer.setDragImage(cardElement, e.clientX - rect.left, e.clientY - rect.top);
        }

        // Asynchronously set draggedIndex to ensure browser takes snapshot of solid card
        setTimeout(() => {
            setDraggedIndex(index);
        }, 0);
    };

    const handleDragEnter = (targetIndex: number) => {
        if (draggedIndex === null || draggedIndex === targetIndex) return;

        // Move the item in real-time as the user drags across items
        setOrderedList((prev) => {
            const next = [...prev];
            const [moved] = next.splice(draggedIndex, 1);
            next.splice(targetIndex, 0, moved);
            return next;
        });
        setDraggedIndex(targetIndex);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const handleSave = () => {
        onSaveOrder(orderedList.map((entry) => entry.item));
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md w-[95vw] sm:w-full max-h-[85dvh] flex flex-col p-4 sm:p-6 gap-0 overflow-hidden">
                <DialogHeader className="shrink-0 pb-1">
                    <DialogTitle className="text-xl font-bold">Reordenar Ejercicios</DialogTitle>
                    <DialogDescription>
                        Arrastrá los ejercicios o usá las flechas para modificar el orden.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 my-3">
                    {orderedList.length === 0 ? (
                        <p className="text-center py-8 text-sm text-muted-foreground">
                            No hay ejercicios para reordenar.
                        </p>
                    ) : (
                        orderedList.map((entry, index) => {
                            const isDragging = draggedIndex === index;

                            return (
                                <div
                                    key={entry.uid}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragEnter={() => handleDragEnter(index)}
                                    onDragOver={handleDragOver}
                                    onDragEnd={handleDragEnd}
                                    className={cn(
                                        'flex items-center justify-between gap-2 p-3 rounded-xl border select-none transition-all duration-150 ease-out cursor-grab active:cursor-grabbing',
                                        isDragging
                                            ? 'opacity-40 border-dashed border-primary bg-primary/5 shadow-inner scale-[0.99]'
                                            : 'border-border bg-card hover:border-border/80 hover:bg-muted/40 shadow-xs'
                                    )}
                                >
                                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                        <div
                                            className="text-muted-foreground/60 hover:text-muted-foreground p-1"
                                            title="Arrastrar para reordenar"
                                        >
                                            <GripVertical className="size-4" />
                                        </div>

                                        <span className="flex size-7 items-center justify-center rounded-lg bg-muted text-xs font-bold text-foreground shrink-0">
                                            {index + 1}
                                        </span>

                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-sm truncate">
                                                {entry.item.exercise?.name ?? `Ejercicio #${entry.item.exerciseId}`}
                                            </p>
                                            {entry.item.exercise?.muscleGroup && (
                                                <span className="text-xs text-muted-foreground">
                                                    {entry.item.exercise.muscleGroup}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Flechas para reordenar */}
                                    <div
                                        className="flex items-center gap-1 shrink-0"
                                        draggable={false}
                                        onDragStart={(e) => e.stopPropagation()}
                                    >
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon-sm"
                                            disabled={index === 0}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                move(index, index - 1);
                                            }}
                                            className="size-7 rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-30 active:scale-95 transition-transform"
                                            title="Mover arriba"
                                        >
                                            <ArrowUp className="size-3.5" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon-sm"
                                            disabled={index === orderedList.length - 1}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                move(index, index + 1);
                                            }}
                                            className="size-7 rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-30 active:scale-95 transition-transform"
                                            title="Mover abajo"
                                        >
                                            <ArrowDown className="size-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <DialogFooter className="shrink-0 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 p-4 sm:px-6 sm:py-3.5 flex flex-row items-center justify-end gap-2 border-t border-border bg-muted/20 mt-auto">
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
                        onClick={handleSave}
                        className="gap-1.5"
                    >
                        <Check className="size-3.5" />
                        Guardar Orden
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
