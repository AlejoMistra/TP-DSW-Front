export type Exercise = {
  id: number;
  name: string;
  description?: string | null;
  muscleGroup: string;
  difficultyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export type CreateExerciseInput = Omit<
  Exercise,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export type UpdateExerciseInput = Partial<CreateExerciseInput>;
