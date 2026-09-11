import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { routineService } from '../api/routineService';
import { exerciseService } from '@/features/exercises/api/exerciseService';
import { instructorService } from '@/features/instructors/api/instructorService';
import type {
    Routine,
    RoutineDifficulty,
    RoutineExerciseItem,
    CreateRoutineInput,
} from '../models/Routine';
import type { Exercise } from '@/features/exercises/models/Exercise';
import type { Instructor } from '@/features/instructors/models/Instructor';

interface UseRoutineFormProps {
    initialRoutine?: Routine | null;
    onSuccess?: () => void;
}

export function useRoutineForm({ initialRoutine, onSuccess }: UseRoutineFormProps = {}) {
    const isEditing = Boolean(initialRoutine?.id);

    const [name, setName] = useState(initialRoutine?.name ?? '');
    const [description, setDescription] = useState(initialRoutine?.description ?? '');
    const [difficulty, setDifficulty] = useState<RoutineDifficulty>(
        initialRoutine?.difficulty ?? 'BEGINNER'
    );
    const [instructorId, setInstructorId] = useState<number | null>(
        initialRoutine?.instructorId ?? null
    );
    const [exercises, setExercises] = useState<RoutineExerciseItem[]>(
        initialRoutine?.routineExercises ?? []
    );

    const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [addExerciseOpen, setAddExerciseOpen] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const [instList, exList] = await Promise.all([
                    instructorService.getAll(),
                    exerciseService.getAllExercises(),
                ]);
                setInstructors(instList);
                setAvailableExercises(exList);

                if (instList.length > 0 && !instructorId) {
                    setInstructorId(Number(instList[0].id));
                }

                if (initialRoutine?.id) {
                    // Obtener rutina completa con sus ejercicios actualizados
                    const fullRoutine = await routineService.getById(initialRoutine.id);
                    setName(fullRoutine.name);
                    setDescription(fullRoutine.description || '');
                    setDifficulty(fullRoutine.difficulty);
                    setInstructorId(fullRoutine.instructorId);
                    setExercises(fullRoutine.routineExercises || []);
                }
            } catch (err) {
                const msg = err instanceof Error ? err.message : 'Error al cargar datos';
                toast.error(msg);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [initialRoutine?.id]);

    const handleAddExercise = (exercise: Exercise) => {
        const newItem: RoutineExerciseItem = {
            exerciseId: exercise.id,
            exercise,
            order: exercises.length + 1,
            sets: null,
            reps: null,
            weight: null,
            notes: '',
        };
        setExercises((prev) => [...prev, newItem]);
        toast.success(`Ejercicio "${exercise.name}" agregado`);
    };

    const handleExerciseChange = (
        index: number,
        field: keyof RoutineExerciseItem,
        value: any
    ) => {
        setExercises((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleRemoveExercise = (index: number) => {
        setExercises((prev) => {
            const filtered = prev.filter((_, i) => i !== index);
            return filtered.map((item, idx) => ({ ...item, order: idx + 1 }));
        });
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!name.trim()) {
            toast.error('El nombre de la rutina es obligatorio');
            return;
        }

        if (!instructorId) {
            toast.error('Por favor, seleccioná un instructor');
            return;
        }

        if (exercises.length === 0) {
            toast.error('Agregá al menos un ejercicio a la rutina');
            return;
        }

        const hasInvalid = exercises.some(
            (ex) => !ex.sets || ex.sets <= 0 || !ex.reps || ex.reps <= 0
        );
        if (hasInvalid) {
            toast.error('Por favor, completá series y repeticiones válidas (mayores a 0) en todos los ejercicios');
            return;
        }

        try {
            setSaving(true);
            const payload: CreateRoutineInput = {
                name: name.trim(),
                description: description.trim() || undefined,
                difficulty,
                instructorId,
                exercises: exercises.map((item, idx) => ({
                    exerciseId: item.exerciseId,
                    order: idx + 1,
                    sets: item.sets ? Number(item.sets) : null,
                    reps: item.reps ? Number(item.reps) : null,
                    weight: item.weight ? Number(item.weight) : null,
                    notes: item.notes?.trim() || null,
                })),
            };

            if (initialRoutine?.id) {
                await routineService.update(initialRoutine.id, payload);
                toast.success('Rutina actualizada con éxito');
            } else {
                await routineService.create(payload);
                toast.success('Rutina creada con éxito');
            }

            onSuccess?.();
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Error al guardar rutina';
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    return {
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
    };
}
