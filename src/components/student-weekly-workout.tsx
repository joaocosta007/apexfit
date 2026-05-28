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
      {/* Chip do dia */}
      <div className="flex items-center gap-2">
        <span className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold",
          isRestDay ? "bg-slate-100 text-slate-500" : "bg-green-100 text-green-700"
        )}>
          <span className={cn("h-1.5 w-1.5 rounded-full", isRestDay ? "bg-slate-400" : "bg-green-500")} />
          {today?.nome ?? "Hoje"} • {isRestDay ? "Descanso" : (selectedSplit?.splitName ?? "")}
        </span>
      </div>

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
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                  : "bg-white text-slate-500 shadow-sm hover:bg-slate-50"
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

      {/* Barra de progresso */}
      {totalExercises > 0 && (
        <div className="rounded-2xl bg-green-500 p-4 shadow-md shadow-green-500/25">
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
