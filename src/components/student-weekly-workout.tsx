"use client";

import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, Flame } from "lucide-react";
import { toast } from "sonner";
import { ExerciseExecutionCard } from "@/components/exercise-execution-card";
import { Button } from "@/components/ui/button";
import { cn, diasDaSemana } from "@/lib/utils";
import { normalizarDiasTreino, selecionarIndiceSplitPorDia } from "@/lib/workout";

type WorkoutExercise = {
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

type StudentWeeklyWorkoutProps = {
  plan: {
    planName: string;
    trainerName: string;
    trainingDays: unknown;
    splits: Array<{ id: string; splitName: string; sortOrder: number; exercises: WorkoutExercise[] }>;
  };
  todayIndex: number;
  todayLabel?: string;
  streak?: number;
  persist?: boolean;
  notice?: ReactNode;
};

function diasDoSplit(trainingDays: unknown, splitIndex: number, splitCount: number): string[] {
  const dias = normalizarDiasTreino(trainingDays);
  return dias.filter((_, position) => position % splitCount === splitIndex).map((day) => day.nome.slice(0, 3));
}

function displaySplitName(splitName: string) {
  const [title, ...description] = splitName.split(/\s+[—–-]\s+/);
  return { title, description: description.join(" — ") };
}

/** Experiência completa de treino do aluno, com progresso por série e celebração final. */
export function StudentWeeklyWorkout({ plan, todayIndex, todayLabel, streak, persist = true, notice }: StudentWeeklyWorkoutProps) {
  const todaySplitIndex = selecionarIndiceSplitPorDia(plan.trainingDays, plan.splits.length, todayIndex);
  const [selectedSplitIndex, setSelectedSplitIndex] = useState(todaySplitIndex ?? 0);
  const selectedSplit = plan.splits[selectedSplitIndex];
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(selectedSplit?.exercises[0]?.id ?? null);
  const [completedSetsMap, setCompletedSetsMap] = useState<Record<string, number>>({});
  const celebratedRef = useRef(false);

  const totalSets = useMemo(() => selectedSplit?.exercises.reduce((total, exercise) => total + exercise.sets, 0) ?? 0, [selectedSplit]);
  const completedSets = useMemo(() => selectedSplit?.exercises.reduce((total, exercise) => total + (completedSetsMap[exercise.id] ?? 0), 0) ?? 0, [completedSetsMap, selectedSplit]);
  const progress = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;
  const allSetsCompleted = totalSets > 0 && completedSets === totalSets;
  const isRestDay = todaySplitIndex === null;
  const selectedName = displaySplitName(selectedSplit?.splitName ?? plan.planName);

  const celebrate = useCallback(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      void confetti({ particleCount: 120, spread: 75, origin: { y: 0.72 }, colors: ["#2563eb", "#22c55e", "#f97316", "#ffffff"] });
    }
    toast.success("Treino concluído!", { description: "Excelente trabalho. Sua evolução foi registrada." });
  }, []);

  useEffect(() => {
    if (allSetsCompleted && !celebratedRef.current) {
      celebratedRef.current = true;
      celebrate();
    }
    if (!allSetsCompleted) celebratedRef.current = false;
  }, [allSetsCompleted, celebrate]);

  function selectSplit(index: number) {
    const nextSplit = plan.splits[index];
    setSelectedSplitIndex(index);
    setExpandedExerciseId(nextSplit?.exercises[0]?.id ?? null);
  }

  function handleRegistered(exerciseIndex: number) {
    const nextExercise = selectedSplit?.exercises[exerciseIndex + 1];
    setExpandedExerciseId(nextExercise?.id ?? null);
  }

  return (
    <div className="space-y-4">
      <section className="sticky top-0 z-20 -mx-4 -mt-5 overflow-hidden bg-apex-navy px-5 pb-7 pt-10 text-white shadow-[0_8px_20px_rgba(13,35,66,0.18)]">
        <span className="absolute -right-12 -top-10 h-44 w-44 rounded-full bg-blue-500/10" aria-hidden="true" />
        <span className="absolute right-10 -top-7 h-28 w-28 rounded-full bg-blue-500/20" aria-hidden="true" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium capitalize text-slate-400">{todayLabel ?? diasDaSemana[todayIndex]?.nome}</p>
            <h1 className="mt-2 truncate text-3xl font-black tracking-tight">{selectedName.title}</h1>
            <p className="mt-1 truncate text-base text-slate-300">{selectedName.description || (plan.planName !== selectedName.title ? plan.planName : `Treino com ${plan.trainerName}`)}</p>
          </div>
          {streak !== undefined && <span className="flex h-11 flex-none items-center gap-1 rounded-xl bg-apex-orange/15 px-3 text-sm font-black text-orange-400"><Flame className="h-5 w-5 fill-current" aria-hidden="true" />{streak}</span>}
        </div>
        <div className="relative mt-6 flex items-center justify-between text-sm text-slate-400"><span>{completedSets} de {totalSets} séries</span><strong className="text-slate-200">{progress}%</strong></div>
        <div className="relative mt-2 h-1.5 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-apex-blue transition-[width] duration-normal ease-app" style={{ width: `${progress}%` }} /></div>
      </section>

      {notice && <div className="!mt-0 pt-11">{notice}</div>}

      {plan.splits.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Divisões de treino">
          {plan.splits.map((split, index) => {
            const isSelected = selectedSplitIndex === index;
            const isToday = index === todaySplitIndex;
            const days = diasDoSplit(plan.trainingDays, index, plan.splits.length);
            return (
              <button key={split.id} type="button" onClick={() => selectSplit(index)} aria-pressed={isSelected} className={cn("tap-feedback focus-app flex min-h-12 flex-none items-center gap-2 rounded-control border px-4 text-sm font-bold", isSelected ? "border-apex-navy bg-apex-navy text-white" : "border-border bg-white text-apex-muted")}>
                <span>{split.splitName}</span>
                <span className={cn("text-[10px]", isSelected ? "text-slate-300" : "text-slate-400")}>{days.join("/")}{isToday ? " · hoje" : ""}</span>
              </button>
            );
          })}
        </div>
      )}

      {!selectedSplit || selectedSplit.exercises.length === 0 ? (
        <div className="app-card p-5"><p className="text-sm font-semibold text-apex-muted">{isRestDay ? "Hoje é dia de descanso. Aproveite para recuperar!" : "Nenhum exercício cadastrado nesta divisão."}</p></div>
      ) : (
        <div className="space-y-3">
          {selectedSplit.exercises.map((exercise, exerciseIndex) => (
            <ExerciseExecutionCard
              key={exercise.id}
              index={exerciseIndex + 1}
              exercise={exercise}
              lastLoad={exercise.lastLoad}
              videoUrl={exercise.videoUrl}
              expanded={expandedExerciseId === exercise.id}
              persist={persist}
              onToggleExpanded={() => setExpandedExerciseId((current) => current === exercise.id ? null : exercise.id)}
              onCompletedSetsChange={(count) => setCompletedSetsMap((current) => ({ ...current, [exercise.id]: count }))}
              onRegistered={() => handleRegistered(exerciseIndex)}
            />
          ))}
        </div>
      )}

      {totalSets > 0 && (
        <Button type="button" disabled={!allSetsCompleted} className={cn("h-16 w-full text-base", allSetsCompleted ? "bg-apex-green hover:bg-green-600" : "bg-slate-400 shadow-none")} onClick={celebrate}>
          {allSetsCompleted && <CheckCircle2 className="mr-2 h-5 w-5" aria-hidden="true" />}
          Concluir treino ({completedSets}/{totalSets})
        </Button>
      )}
    </div>
  );
}
