"use client";

import { StudentBottomNav } from "@/components/student-bottom-nav";
import { StudentWeeklyWorkout } from "@/components/student-weekly-workout";

const previewPlan = {
  planName: "Peito e Tríceps",
  trainerName: "Marina Costa",
  trainingDays: [{ indice: 1, letra: "T", nome: "Terça-feira" }],
  splits: [
    {
      id: "preview-split-a",
      splitName: "Treino A — Peito e Tríceps",
      sortOrder: 0,
      exercises: [
        { id: "preview-1", name: "Supino Reto com Halteres", group: "Peitoral", sets: 4, reps: 12, loadKg: 28, restTime: "90s", lastLoad: 26, videoUrl: null },
        { id: "preview-2", name: "Crucifixo Inclinado", group: "Peitoral Superior", sets: 4, reps: 15, loadKg: 18, restTime: "75s", lastLoad: 16, videoUrl: null },
        { id: "preview-3", name: "Tríceps Pulley", group: "Tríceps", sets: 4, reps: 15, loadKg: 25, restTime: "60s", lastLoad: 25, videoUrl: null },
        { id: "preview-4", name: "Tríceps Francês", group: "Tríceps", sets: 4, reps: 12, loadKg: 16, restTime: "60s", lastLoad: 14, videoUrl: null }
      ]
    }
  ]
};

export function WorkoutExecutionDemo() {
  return (
    <main className="mx-auto flex h-[100dvh] w-full max-w-lg flex-col overflow-hidden bg-apex-background">
      <div className="flex-1 overflow-y-auto px-4 pb-6 pt-5">
        <StudentWeeklyWorkout plan={previewPlan} todayIndex={1} todayLabel="terça-feira, 26 ago" streak={12} persist={false} />
      </div>
      <StudentBottomNav active="workout" onNavigate={() => undefined} />
    </main>
  );
}
