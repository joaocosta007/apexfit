"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Dumbbell } from "lucide-react";
import { ExerciseExecutionCard } from "@/components/exercise-execution-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn, diasDaSemana } from "@/lib/utils";
import { diaPossuiTreino, resumoDiasTreino, selecionarIndiceSplitPorDia } from "@/lib/workout";

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
      }>;
    }>;
  };
  todayIndex: number;
};

export function StudentWeeklyWorkout({ plan, todayIndex }: StudentWeeklyWorkoutProps) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(todayIndex);
  const selectedSplitIndex = selecionarIndiceSplitPorDia(plan.trainingDays, plan.splits.length, selectedDayIndex);
  const selectedSplit = selectedSplitIndex !== null ? plan.splits[selectedSplitIndex] : null;
  const selectedDay = diasDaSemana[selectedDayIndex] ?? diasDaSemana[0];

  const dayStatus = useMemo(
    () => diasDaSemana.map((_, index) => diaPossuiTreino(plan.trainingDays, index)),
    [plan.trainingDays]
  );

  return (
    <section className="space-y-5">
      <Card className="border-primary/30">
        <CardContent className="pt-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Badge>Plano ativo</Badge>
              <h2 className="mt-3 text-2xl font-black text-slate-900">{plan.planName}</h2>
              <p className="mt-1 text-sm text-slate-600">Professor: {plan.trainerName}</p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-primary">
              <Dumbbell className="h-6 w-6" />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <CalendarDays className="mb-2 h-4 w-4 text-primary" />
              <p className="text-xs text-slate-600">Dias do plano</p>
              <p className="mt-1 text-sm font-bold text-slate-900">{resumoDiasTreino(plan.trainingDays)}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <Dumbbell className="mb-2 h-4 w-4 text-blue-700" />
              <p className="text-xs text-slate-600">Divisão selecionada</p>
              <p className="mt-1 text-sm font-bold text-slate-900">{selectedSplit?.splitName ?? "Descanso"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900">Agenda semanal</h2>
              <p className="text-sm text-slate-600">Toque em um dia para ver o treino correspondente.</p>
            </div>
            <Badge variant="outline">{selectedDay.nome}</Badge>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {diasDaSemana.map((dia, index) => {
              const isSelected = selectedDayIndex === index;
              const hasWorkout = dayStatus[index];
              const isToday = todayIndex === index;

              return (
                <button
                  key={`${dia.nome}-${index}`}
                  type="button"
                  onClick={() => setSelectedDayIndex(index)}
                  className={cn(
                    "flex min-h-16 flex-col items-center justify-center rounded-2xl border px-1 text-center transition-all",
                    isSelected
                      ? "border-primary bg-primary text-white shadow-sm"
                      : hasWorkout
                        ? "border-primary/20 bg-blue-50 text-primary hover:border-primary/60"
                        : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                  )}
                  aria-pressed={isSelected}
                >
                  <span className="text-base font-black">{dia.label}</span>
                  <span className="mt-1 text-[10px] font-semibold leading-none">{isToday ? "Hoje" : hasWorkout ? "Treino" : "Off"}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {!selectedSplit ? (
        <Card>
          <CardContent className="pt-5">
            <p className="font-semibold text-slate-900">{selectedDay.nome} é dia de descanso.</p>
            <p className="mt-2 text-sm text-slate-600">Aproveite para recuperar, hidratar e preparar o próximo treino.</p>
          </CardContent>
        </Card>
      ) : null}

      {selectedSplit ? (
        <div className="space-y-3">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              {selectedSplit.splitName} • {selectedDay.nome}
            </h2>
            <p className="text-sm text-slate-600">Marque cada exercício concluído e informe a carga real.</p>
          </div>

          {selectedSplit.exercises.length === 0 ? (
            <Card>
              <CardContent className="pt-5">
                <p className="text-sm text-slate-600">Nenhum exercício cadastrado nesta divisão.</p>
              </CardContent>
            </Card>
          ) : null}

          {selectedSplit.exercises.map((exercise) => (
            <ExerciseExecutionCard key={exercise.id} exercise={exercise} lastLoad={exercise.lastLoad} />
          ))}
        </div>
      ) : null}
    </section>
  );
}