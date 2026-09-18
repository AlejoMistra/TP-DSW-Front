import { Trash2, MoreVertical, ArrowUpDown, Repeat } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@/shared/components/ui/dropdown-menu';
import type { RoutineExerciseItem } from '../models/Routine';

interface RoutineExerciseItemCardProps {
    index: number;
    item: RoutineExerciseItem;
    onChange: (field: keyof RoutineExerciseItem, value: any) => void;
    onRemove: () => void;
    onReorder: () => void;
    onReplace: () => void;
}

export function RoutineExerciseItemCard({
    index,
    item,
    onChange,
    onRemove,
    onReorder,
    onReplace,
}: RoutineExerciseItemCardProps) {
    return (
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-md transition-all hover:border-border">
            {/* Cabecera de la tarjeta: Orden, Nombre y Menú de Acciones */}
            <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-muted font-bold text-base text-foreground">
                        {index + 1}
                    </span>
                    <div>
                        <h4 className="text-lg font-bold text-foreground">
                            {item.exercise?.name ?? `Ejercicio #${item.exerciseId}`}
                        </h4>
                        {item.exercise?.muscleGroup && (
                            <span className="text-xs text-muted-foreground">
                                {item.exercise.muscleGroup}
                            </span>
                        )}
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="text-muted-foreground hover:text-foreground rounded-lg"
                            title="Opciones del ejercicio"
                        >
                            <MoreVertical className="size-4" />
                            <span className="sr-only">Opciones</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuItem onClick={onReorder} className="cursor-pointer gap-2">
                            <ArrowUpDown className="size-4 text-muted-foreground" />
                            <span>Reordenar Ejercicios</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onReplace} className="cursor-pointer gap-2">
                            <Repeat className="size-4 text-muted-foreground" />
                            <span>Reemplazar Ejercicio</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={onRemove}
                            className="cursor-pointer gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                        >
                            <Trash2 className="size-4" />
                            <span>Eliminar Ejercicio</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Cajas de Parámetros: Series, Reps, Peso (kg) */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="rounded-xl bg-muted/40 p-2.5 text-center border border-border/50 focus-within:border-primary/50 transition-colors">
                    <label className="block text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Series
                    </label>
                    <Input
                        type="number"
                        min={1}
                        value={item.sets ?? ''}
                        onChange={(e) =>
                            onChange('sets', e.target.value === '' ? null : Number(e.target.value))
                        }
                        className="text-center font-bold text-lg h-9 bg-transparent border-0 focus-visible:ring-0 p-0"
                    />
                </div>

                <div className="rounded-xl bg-muted/40 p-2.5 text-center border border-border/50 focus-within:border-primary/50 transition-colors">
                    <label className="block text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Reps
                    </label>
                    <Input
                        type="number"
                        min={1}
                        value={item.reps ?? ''}
                        onChange={(e) =>
                            onChange('reps', e.target.value === '' ? null : Number(e.target.value))
                        }
                        className="text-center font-bold text-lg h-9 bg-transparent border-0 focus-visible:ring-0 p-0"
                    />
                </div>

                <div className="rounded-xl bg-muted/40 p-2.5 text-center border border-border/50 focus-within:border-primary/50 transition-colors">
                    <label className="block text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Peso (kg)
                    </label>
                    <Input
                        type="number"
                        min={0}
                        step={0.5}
                        value={item.weight ?? ''}
                        onChange={(e) =>
                            onChange('weight', e.target.value === '' ? null : Number(e.target.value))
                        }
                        className="text-center font-bold text-lg h-9 bg-transparent border-0 focus-visible:ring-0 p-0"
                    />
                </div>
            </div>

            {/* Sección Aclaraciones / Notas */}
            <div className="rounded-xl bg-muted/40 p-3 border border-border/50">
                <label className="text-sm font-semibold text-muted-foreground tracking-wide mb-1.5 flex items-center gap-1.5">
                    Aclaraciones
                </label>
                <Textarea
                    rows={2}
                    value={item.notes ?? ''}
                    onChange={(e) => onChange('notes', e.target.value)}
                    className="bg-transparent border-0 focus-visible:ring-0 p-2.5 resize-none text-sm placeholder:text-muted-foreground/60"
                />
            </div>
        </div>
    );
}
