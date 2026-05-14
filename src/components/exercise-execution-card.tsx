"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { registrarTreinoAction } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { RestTimer } from "@/components/rest-timer";
import { formatarCarga } from "@/lib/utils";

type ExerciseExecutionCardProps = {
  exercise: {
    id: string;
    name: string;
    sets: number;
    reps: number;
    loadKg: number;
    restTime: string;
  };
  lastLoad?: number | null;
};

export function ExerciseExecutionCard({ exercise, lastLoad }: ExerciseExecutionCardProps) {
  const [completed, setCompleted] = useState(false);
  const [load, setLoad] = useState(exercise.loadKg);
  const action = registrarTreinoAction.bind(null, exercise.id);

  return (
    <Card>
      <CardContent className="pt-5">
        <form action={action} className="space-y-4">
          <div className="flex items-start gap-4">
            <Checkbox checked={completed} onCheckedChange={(value) => setCompleted(Boolean(value))} aria-label="Marcar como feito" />
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-slate-900">{exercise.name}</h3>
              <p className="mt-1 text-sm text-slate-600">
                {exercise.sets} séries • {exercise.reps} reps • descanso {exercise.restTime}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-600">Carga realizada hoje</span>
              <Badge variant="secondary">Última carga: {formatarCarga(lastLoad)}</Badge>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setLoad((current) => Math.max(0, Number((current - 2.5).toFixed(1))))}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700"
                aria-label="Diminuir carga"
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                name="completedLoadKg"
                type="number"
                min="0"
                step="0.5"
                value={load}
                onChange={(event) => setLoad(Number(event.target.value))}
                className="h-11 min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3 text-center text-lg font-black text-primary outline-none focus:ring-2 focus:ring-primary"
                aria-label="Carga em quilos"
              />
              <button
                type="button"
                onClick={() => setLoad((current) => Number((current + 2.5).toFixed(1)))}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-blue-50 text-primary"
                aria-label="Aumentar carga"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <RestTimer restTime={exercise.restTime} />

          <Button type="submit" className="w-full" disabled={!completed}>
            Registrar exercício concluído
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}