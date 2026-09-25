import type { Exercise } from '@/features/exercises/models/Exercise';
import type { Instructor } from '@/features/instructors/models/Instructor';

export type RoutineDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface RoutineExerciseItem {
    id?: number;
    routineId?: number;
    exerciseId: number;
    order?: number | null;
    sets?: number | null;
    reps?: number | null;
    weight?: number | null;
    notes?: string | null;
    exercise?: Exercise;
}

export interface Routine {
    id: number;
    name: string;
    description?: string | null;
    difficulty: RoutineDifficulty;
    instructorId: number;
    instructor?: Instructor;
    createdAt: string;
    updatedAt: string;
    routineExercises?: RoutineExerciseItem[];
}

export interface CreateRoutineInput {
    name: string;
    description?: string;
    difficulty: RoutineDifficulty;
    instructorId: number;
    exercises?: {
        exerciseId: number;
        order?: number | null;
        sets?: number | null;
        reps?: number | null;
        weight?: number | null;
        notes?: string | null;
    }[];
}

export type UpdateRoutineInput = Partial<CreateRoutineInput>;
