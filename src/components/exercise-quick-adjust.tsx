"use client";

import { Minus, Plus } from "lucide-react";
import { ajustarExercicioAction } from "@/app/actions";

type ExerciseQuickAdjustProps = {
  exerciseId: string;
  studentId: string;
  field: "sets" | "reps" | "restTime";
  value: number | string;
  label: string;
  suffix?: string;
  min?: number;
  step?: number;
};

export function ExerciseQuickAdjust({ exerciseId, studentId, field, value, label, suffix = "", min = 1, step = 1 }: ExerciseQuickAdjustProps) {
  const current = typeof value === "number" ? value : Number.parseInt(value, 10) || 60;
  const change = (amount: number) => ajustarExercicioAction.bind(null, exerciseId, studentId, field, String(Math.max(min, current + amount)));

  return (
    <div className="rounded-2xl bg-apex-soft px-2 py-2.5 text-center">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <div className="mt-1 flex items-center justify-center gap-1">
        <form action={change(-step)}><button type="submit" aria-label={`Diminuir ${label}`} className="focus-app flex h-7 w-7 items-center justify-center rounded-lg bg-white text-apex-muted shadow-sm transition-colors hover:text-apex-blue"><Minus className="h-3.5 w-3.5" /></button></form>
        <strong className="min-w-10 text-sm font-black text-apex-navy">{value}{suffix}</strong>
        <form action={change(step)}><button type="submit" aria-label={`Aumentar ${label}`} className="focus-app flex h-7 w-7 items-center justify-center rounded-lg bg-white text-apex-muted shadow-sm transition-colors hover:text-apex-blue"><Plus className="h-3.5 w-3.5" /></button></form>
      </div>
    </div>
  );
}
