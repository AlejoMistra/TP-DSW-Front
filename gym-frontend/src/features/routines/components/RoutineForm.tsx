import { useState } from 'react';
import { ArrowLeft, Save, Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import { useRoutineForm } from '../hooks/useRoutineForm';
import { RoutineExerciseItemCard } from './RoutineExerciseItemCard';
import { AddExerciseDialog } from './AddExerciseDialog';
import { ReorderExercisesDialog } from './ReorderExercisesDialog';
import { ReplaceExerciseDialog } from './ReplaceExerciseDialog';
import type { Routine } from '../models/Routine';

interface RoutineFormProps {
    routine?: Routine | null;
    onBack: () => void;
    onSuccess: () => void;
}

export function RoutineForm({ routine, onBack, onSuccess }: RoutineFormProps) {
    const {
        isEditing,
        name,
        setName,
        description,
        setDescription,
        difficulty,
        setDifficulty,
        instructorId,
        setInstructorId,
        instructors,
        exercises,
        availableExercises,
        loading,
        saving,
        addExerciseOpen,
        setAddExerciseOpen,
        handleAddExercises,
        handleExerciseChange,
        handleRemoveExercise,
        handleReorderExercises,
        handleReplaceExercise,
        handleSubmit,
    } = useRoutineForm({ initialRoutine: routine, onSuccess });

    const [reorderOpen, setReorderOpen] = useState(false);
    const [replaceIndex, setReplaceIndex] = useState<number | null>(null);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center text-muted-foreground">
                Cargando datos de la rutina...
            </div>
        );
    }

    return (
        <div className="rounded-xl border bg-background px-4 py-2 items-baseline sm:px-6 sm:py-6">
            {/* Barra superior*/}
            <header className="flex items-center justify-between pb-2 border-b border-border/40">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onBack}
                    className="rounded-full"
                >
                    <ArrowLeft className="size-5" />
                </Button>
                <h1 className="font-extrabold tracking-widest text-lg sm:text-xl uppercase text-foreground">
                    {isEditing ? `Edición de Rutina: ${routine?.name}` : 'Nueva Rutina'}
                </h1>
                <div className="w-10" />
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Selector de Instructor */}
                <div className="space-y-1.5 bg-card/60 p-4 rounded-2xl border border-border/50">
                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground block">
                        Instructor Responsable (Hasta implementar login)
                    </label>
                    <Select
                        value={instructorId ? String(instructorId) : ''}
                        onValueChange={(val) => setInstructorId(Number(val))}
                    >
                        <SelectTrigger className="w-full h-11 bg-background border-border">
                            <SelectValue placeholder="Seleccionar instructor..." />
                        </SelectTrigger>
                        <SelectContent>
                            {instructors.map((inst) => (
                                <SelectItem key={inst.id} value={String(inst.id)}>
                                    {inst.name} {inst.surname} ({inst.email})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Nombre de la Rutina */}
                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground block">
                        Nombre de la Rutina
                    </label>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej: Rutina A: Pecho y Tríceps"
                        className="h-14 text-lg sm:text-xl font-semibold px-4 rounded-2xl bg-card border-border/80"
                    />
                </div>

                {/* Etiquetas de Dificultad */}
                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground block">
                        Nivel / Dificultad
                    </label>
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => setDifficulty('BEGINNER')}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${difficulty === 'BEGINNER'
                                ? 'bg-primary text-primary-foreground shadow-md'
                                : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                                }`}
                        >
                            Principiante
                        </button>
                        <button
                            type="button"
                            onClick={() => setDifficulty('INTERMEDIATE')}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${difficulty === 'INTERMEDIATE'
                                ? 'bg-primary text-primary-foreground shadow-md'
                                : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                                }`}
                        >
                            Intermedio
                        </button>
                        <button
                            type="button"
                            onClick={() => setDifficulty('ADVANCED')}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${difficulty === 'ADVANCED'
                                ? 'bg-primary text-primary-foreground shadow-md'
                                : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                                }`}
                        >
                            Alta Intensidad (Avanzado)
                        </button>
                    </div>
                </div>

                {/* Descripción (Opcional) */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                        Descripción o detalle (Opcional)
                    </label>
                    <Textarea
                        rows={2}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Objetivo de la rutina, grupos musculares, etc."
                        className="rounded-xl bg-card border-border/80 resize-none text-sm"
                    />
                </div>

                {/* Sección de Ejercicios */}
                <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-extrabold text-foreground">
                            Ejercicios ({exercises.length})
                        </h3>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setAddExerciseOpen(true)}
                            className="rounded-full gap-1.5"
                        >
                            <Plus className="size-4" />
                            Añadir Ejercicio
                        </Button>
                    </div>

                    {exercises.length === 0 ? (
                        <div
                            onClick={() => setAddExerciseOpen(true)}
                            className="cursor-pointer border-2 border-dashed border-border/80 rounded-2xl p-8 text-center hover:border-primary/80 hover:bg-primary/20 transition-all"
                        >
                            <Plus className="size-8 mx-auto text-muted-foreground mb-2" />
                            <p className="font-semibold text-md text-foreground">
                                No hay ejercicios en esta rutina
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Hacé clic acá para añadir tu primer ejercicio
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {exercises.map((item, idx) => (
                                <RoutineExerciseItemCard
                                    key={item.exerciseId + '-' + idx}
                                    index={idx}
                                    item={item}
                                    onChange={(field, val) => handleExerciseChange(idx, field, val)}
                                    onRemove={() => handleRemoveExercise(idx)}
                                    onReorder={() => setReorderOpen(true)}
                                    onReplace={() => setReplaceIndex(idx)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Botón Guardar Rutina (Estilo Pro-Flow Dorado/Amarillo) */}
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={saving}
                    >
                        <Save className="size-5" />
                        {saving ? 'Guardando...' : 'Guardar Rutina'}
                    </Button>
                </div>
            </form>

            {/* Modal buscador de ejercicios */}
            <AddExerciseDialog
                open={addExerciseOpen}
                onOpenChange={setAddExerciseOpen}
                availableExercises={availableExercises}
                existingExerciseIds={exercises.map((e) => e.exerciseId)}
                onAddExercises={handleAddExercises}
            />

            {/* Modal reordenar ejercicios */}
            <ReorderExercisesDialog
                open={reorderOpen}
                onOpenChange={setReorderOpen}
                items={exercises}
                onSaveOrder={handleReorderExercises}
            />

            {/* Modal reemplazar ejercicio */}
            <ReplaceExerciseDialog
                open={replaceIndex !== null}
                onOpenChange={(open) => {
                    if (!open) setReplaceIndex(null);
                }}
                currentExerciseId={replaceIndex !== null ? exercises[replaceIndex]?.exerciseId : undefined}
                currentExerciseName={replaceIndex !== null ? exercises[replaceIndex]?.exercise?.name : undefined}
                availableExercises={availableExercises}
                existingExerciseIds={exercises.map((e) => e.exerciseId)}
                onReplace={(newEx) => {
                    if (replaceIndex !== null) {
                        handleReplaceExercise(replaceIndex, newEx);
                    }
                }}
            />
        </div>
    );
}
