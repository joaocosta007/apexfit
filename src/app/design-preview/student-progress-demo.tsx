"use client";

import { LoadEvolutionChart } from "@/components/load-evolution-chart";
import { StudentBottomNav } from "@/components/student-bottom-nav";

const loads = [20, 22, 24, 24, 26, 28, 28, 30].map((load, index) => ({
  date: `2026-${String(7 + Math.floor(index / 4)).padStart(2, "0")}-${String(6 + (index % 4) * 7).padStart(2, "0")}`,
  load,
}));

export function StudentProgressDemo({ empty = false }: { empty?: boolean }) {
  return (
    <main className="mx-auto flex h-[100dvh] w-full max-w-lg flex-col overflow-hidden bg-apex-background">
      <div className="flex-1 overflow-y-auto px-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-5">
        <header className="relative -mx-4 -mt-5 mb-5 overflow-hidden bg-apex-navy px-5 pb-8 pt-10 text-white">
          <span className="absolute -right-10 -top-14 h-40 w-40 rounded-full bg-white/[0.04]" /><span className="absolute right-12 -top-8 h-24 w-24 rounded-full bg-apex-blue/10" />
          <p className="relative text-sm font-semibold tracking-wide text-slate-400">Semana de 19–25 ago</p><h1 className="relative mt-2 text-2xl font-black">Progresso</h1>
        </header>
        <LoadEvolutionChart exercises={empty ? [] : [{ name: "Supino Reto", data: loads }, { name: "Tríceps Pulley", data: loads.map((item) => ({ ...item, load: item.load - 4 })) }, { name: "Crucifixo Inclinado", data: loads.map((item) => ({ ...item, load: item.load - 8 })) }]} completedWeekDays={empty ? [] : [0, 1, 3]} weeklyGoal={4} />
      </div>
      <StudentBottomNav active="progress" onNavigate={() => undefined} />
    </main>
  );
}
