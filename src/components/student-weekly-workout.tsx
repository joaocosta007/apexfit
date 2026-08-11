"use client";

import { useState, useCallback } from "react";
import { ExerciseExecutionCard } from "@/components/exercise-execution-card";
import { cn, diasDaSemana } from "@/lib/utils";
import { normalizarDiasTreino, selecionarIndiceSplitPorDia } from "@/lib/workout";

type StudentWeeklyWorkoutProps = {
  plan: {
    planName: string;
    trainerName: string;
    trainingDays: unknown;
    splits: Array<{
      id: string;
      splitName: string;
      sortOrder: number;
      exercises: Array<{
        id: string;
        name: string;
        sets: number;
        reps: number;
        loadKg: number;
        restTime: string;
        lastLoad: number | null;
        videoUrl: string | null;
      }>;
    }>;
  };
  todayIndex: number;
};

/** Retorna os nomes curtos dos dias associados a um split (ex: ["Seg", "Qui"]) */
function diasDoSplit(trainingDays: unknown, splitIndex: number, splitCount: number): string[] {
  const dias = normalizarDiasTreino(trainingDays);
  return dias
    .filter((_, pos) => pos % splitCount === splitIndex)
    .map((dia) => dia.nome.slice(0, 3));
}

export function StudentWeeklyWorkout({ plan, todayIndex }: StudentWeeklyWorkoutProps) {
  const todaySplitIndex = selecionarIndiceSplitPorDia(plan.trainingDays, plan.splits.length, todayIndex);
  const [selectedSplitIndex, setSelectedSplitIndex] = useState(todaySplitIndex ?? 0);
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});

  const handleCompletedChange = useCallback((exerciseId: string, completed: boolean) => {
    setCompletedMap((prev) => ({ ...prev, [exerciseId]: completed }));
  }, []);

  const selectedSplit = plan.splits[selectedSplitIndex];
  const today = diasDaSemana[todayIndex];
  const isRestDay = todaySplitIndex === null;

  const totalExercises = selectedSplit?.exercises.length ?? 0;
  const completedCount = selectedSplit?.exercises.filter((e) => completedMap[e.id]).length ?? 0;
  const progressPct = totalExercises > 0 ? (completedCount / totalExercises) * 100 : 0;

  return (
    <div className="space-y-4">
      <section className="-mx-4 -mt-5 bg-[#0d2342] px-5 py-6 text-white">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-slate-300">{selectedSplit?.splitName ?? plan.planName}</p>
            <h1 className="mt-1 text-2xl font-black">{plan.planName}</h1>
          </div>
          <p className="text-sm font-bold">{completedCount}/{totalExercises} concluídos</p>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/25"><div className="h-full rounded-full bg-white transition-all" style={{ width: `${progressPct}%` }} /></div>
        <div className="mt-4 flex gap-5 text-sm font-medium text-slate-300"><span>◷ ~45 min</span><span>🏋 {totalExercises} exercícios</span></div>
      </section>

      {/* Abas com dias da semana */}
      <div className="flex flex-wrap gap-2">
        {plan.splits.map((split, index) => {
          const dias = diasDoSplit(plan.trainingDays, index, plan.splits.length);
          const isSelected = selectedSplitIndex === index;
          const isToday = index === todaySplitIndex;

          return (
            <button
              key={split.id}
              type="button"
              onClick={() => setSelectedSplitIndex(index)}
              className={cn(
                "flex flex-col items-center rounded-2xl px-4 py-2 text-xs font-bold transition-all",
                isSelected
                  ? "bg-[#0d2342] text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              )}
            >
              {/* Dias da semana */}
              <span className={cn("text-[10px] font-semibold", isSelected ? "text-blue-100" : "text-slate-400")}>
                {dias.length > 0 ? dias.join(" / ") : split.splitName}
              </span>
              {/* Nome do split */}
              <span className="text-sm font-black">{split.splitName}</span>
              {/* Indicador de hoje */}
              {isToday && (
                <span className={cn(
                  "mt-0.5 h-1 w-1 rounded-full",
                  isSelected ? "bg-white" : "bg-blue-500"
                )} />
              )}
            </button>
          );
        })}
      </div>

      {/* Exercícios */}
      {!selectedSplit || selectedSplit.exercises.length === 0 ? (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-700">
            {isRestDay && selectedSplitIndex === (todaySplitIndex ?? -1)
              ? "Hoje é dia de descanso. Aproveite para recuperar!"
              : "Nenhum exercício cadastrado nesta divisão."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {selectedSplit.exercises.map((exercise) => (
            <ExerciseExecutionCard
              key={exercise.id}
              exercise={exercise}
              lastLoad={exercise.lastLoad}
              videoUrl={exercise.videoUrl}
              onCompletedChange={(completed) => handleCompletedChange(exercise.id, completed)}
            />
          ))}
        </div>
      )}

      {totalExercises > 0 && completedCount === totalExercises && (
        <div className="rounded-[22px] bg-green-500 p-4 shadow-md shadow-green-500/20">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-bold text-white">Progresso do Treino</span>
            <span className="text-sm font-bold text-white">{completedCount}/{totalExercises}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-green-400/50">
            <div
              className="h-full rounded-full bg-white transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
