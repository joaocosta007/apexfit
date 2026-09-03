export type OfflineWorkoutExercise = {
  id: string;
  name: string;
  group: string;
  sets: number;
  reps: number;
  loadKg: number;
  restTime: string;
  lastLoad: number | null;
  videoUrl: string | null;
};

export type OfflineWorkoutPlan = {
  id: string;
  planName: string;
  trainerName: string;
  trainingDays: unknown;
  updatedAt: string;
  splits: Array<{
    id: string;
    splitName: string;
    sortOrder: number;
    exercises: OfflineWorkoutExercise[];
  }>;
};

export type OfflineWorkoutSnapshot = {
  key: "current-student";
  savedAt: string;
  plan: OfflineWorkoutPlan | null;
  streak: number;
};
