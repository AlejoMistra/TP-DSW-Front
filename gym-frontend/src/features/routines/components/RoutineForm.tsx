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
        handleAddExercise,
        handleExerciseChange,
        handleRemoveExercise,
        handleSubmit,
    } = useRoutineForm({ initialRoutine: routine, onSuccess });

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center text-muted-foreground">
                Cargando datos de la rutina...
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-4 px-2 sm:px-6 space-y-6">
            {/* Barra superior estilo PRO-FLOW */}
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
                    {isEditing ? 'EDITAR RUTINA' : 'PRO-FLOW'}
                </h1>
                <div className="w-10" />
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Selector de Instructor */}
                <div className="space-y-1.5 bg-card/60 p-4 rounded-2xl border border-border/50">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                        Instructor Responsable
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
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                        Nombre de la Rutina
                    </label>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej: Rutina A: Pecho y Tríceps"
                        className="h-14 text-lg sm:text-xl font-semibold px-4 rounded-2xl bg-card border-border/80 focus-visible:ring-1"
                    />
                </div>

                {/* Etiquetas de Dificultad */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                        Nivel / Dificultad
                    </label>
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => setDifficulty('BEGINNER')}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${difficulty === 'BEGINNER'
                                ? 'bg-amber-500 text-black shadow-md scale-105'
                                : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                                }`}
                        >
                            Principiante
                        </button>
                        <button
                            type="button"
                            onClick={() => setDifficulty('INTERMEDIATE')}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${difficulty === 'INTERMEDIATE'
                                ? 'bg-amber-500 text-black shadow-md scale-105'
                                : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                                }`}
                        >
                            Intermedio
                        </button>
                        <button
                            type="button"
                            onClick={() => setDifficulty('ADVANCED')}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${difficulty === 'ADVANCED'
                                ? 'bg-amber-500 text-black shadow-md scale-105'
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
                        Descripción o Enfoque (Opcional)
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
                            size="sm"
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
                            className="cursor-pointer border-2 border-dashed border-border/80 rounded-2xl p-8 text-center hover:border-amber-500/60 hover:bg-amber-500/5 transition-all"
                        >
                            <Plus className="size-8 mx-auto text-muted-foreground mb-2" />
                            <p className="font-semibold text-sm text-foreground">
                                No hay ejercicios en esta rutina
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
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
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Botón Guardar Rutina (Estilo Pro-Flow Dorado/Amarillo) */}
                <div className="pt-4 sticky bottom-4">
                    <Button
                        type="submit"
                        disabled={saving}
                        className="w-full h-14 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-base shadow-xl gap-2 transition-transform active:scale-[0.99]"
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
                onSelect={handleAddExercise}
            />
        </div>
    );
}
