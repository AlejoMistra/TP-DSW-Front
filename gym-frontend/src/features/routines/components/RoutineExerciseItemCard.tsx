import { Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import type { RoutineExerciseItem } from '../models/Routine';

interface RoutineExerciseItemCardProps {
    index: number;
    item: RoutineExerciseItem;
    onChange: (field: keyof RoutineExerciseItem, value: any) => void;
    onRemove: () => void;
}

export function RoutineExerciseItemCard({
    index,
    item,
    onChange,
    onRemove,
}: RoutineExerciseItemCardProps) {
    return (
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-md transition-all hover:border-border">
            {/* Cabecera de la tarjeta: Orden, Nombre y Botón Eliminar */}
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

                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={onRemove}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    title="Quitar ejercicio"
                >
                    <Trash2 className="size-4" />
                </Button>
            </div>

            {/* Cajas de Parámetros: Series, Reps, Peso (kg) */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="rounded-xl bg-muted/40 p-2.5 text-center border border-border/50 focus-within:border-primary/50 transition-colors">
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Series
                    </label>
                    <Input
                        type="number"
                        min={1}
                        value={item.sets ?? ''}
                        onChange={(e) =>
                            onChange('sets', e.target.value === '' ? null : Number(e.target.value))
                        }
                        placeholder="4"
                        className="text-center font-bold text-lg h-9 bg-transparent border-0 focus-visible:ring-0 p-0"
                    />
                </div>

                <div className="rounded-xl bg-muted/40 p-2.5 text-center border border-border/50 focus-within:border-primary/50 transition-colors">
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Reps
                    </label>
                    <Input
                        type="number"
                        min={1}
                        value={item.reps ?? ''}
                        onChange={(e) =>
                            onChange('reps', e.target.value === '' ? null : Number(e.target.value))
                        }
                        placeholder="10"
                        className="text-center font-bold text-lg h-9 bg-transparent border-0 focus-visible:ring-0 p-0"
                    />
                </div>

                <div className="rounded-xl bg-muted/40 p-2.5 text-center border border-border/50 focus-within:border-primary/50 transition-colors">
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
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
                        placeholder="Opcional"
                        className="text-center font-bold text-lg h-9 bg-transparent border-0 focus-visible:ring-0 p-0"
                    />
                </div>
            </div>

            {/* Sección Aclaraciones / Notas */}
            <div className="rounded-xl bg-muted/40 p-3 border border-border/50">
                <label className="block text-xs font-semibold text-muted-foreground tracking-wide mb-1.5 flex items-center gap-1.5">
                    <span>=</span> Aclaraciones
                </label>
                <Textarea
                    rows={2}
                    value={item.notes ?? ''}
                    onChange={(e) => onChange('notes', e.target.value)}
                    placeholder="Ej: Descanso de 90s. Bajar controlado."
                    className="bg-transparent border-0 focus-visible:ring-0 p-0 resize-none text-sm placeholder:text-muted-foreground/60"
                />
            </div>
        </div>
    );
}
