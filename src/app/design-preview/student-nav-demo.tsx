"use client";

import { CalendarDays, Flame, Play, Target } from "lucide-react";
import { useState } from "react";
import { StudentBottomNav } from "@/components/student-bottom-nav";

type ActiveItem = "workout" | "progress" | "assessments" | "profile";

const pageNames: Record<ActiveItem, string> = {
  workout: "Treino",
  progress: "Progresso",
  assessments: "Avaliações",
  profile: "Perfil"
};

export function StudentNavDemo() {
  const [active, setActive] = useState<ActiveItem>("workout");

  return (
    <main className="mx-auto flex h-[100dvh] w-full max-w-lg flex-col overflow-hidden bg-apex-background">
      <header className="relative overflow-hidden bg-apex-navy px-5 pb-7 pt-10 text-white">
        <span className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-blue-500/10" aria-hidden="true" />
        <span className="absolute right-10 -top-6 h-24 w-24 rounded-full bg-blue-500/20" aria-hidden="true" />
        <p className="relative text-sm font-medium text-slate-400">Terça-feira, 26 de agosto</p>
        <h1 className="relative mt-2 text-3xl font-black tracking-tight" aria-live="polite">{pageNames[active]}</h1>
        <p className="relative mt-1 text-sm text-slate-300">Peito e Tríceps</p>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-5">

        <section className="mt-7 grid grid-cols-2 gap-3" aria-label="Resumo do aluno">
          <article className="app-card p-5">
            <Flame className="h-6 w-6 text-apex-orange" aria-hidden="true" />
            <strong className="mt-4 block text-3xl font-black text-apex-ink">7</strong>
            <span className="text-sm font-medium text-apex-muted">dias seguidos</span>
          </article>
          <article className="app-card p-5">
            <Target className="h-6 w-6 text-apex-blue" aria-hidden="true" />
            <strong className="mt-4 block text-3xl font-black text-apex-ink">3/4</strong>
            <span className="text-sm font-medium text-apex-muted">treinos na semana</span>
          </article>
        </section>

        <article className="app-card mt-4 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-apex-blue">Treino de hoje</span>
              <h2 className="mt-1 text-lg font-black text-apex-ink">Peito e Tríceps</h2>
              <p className="mt-1 text-sm text-apex-muted">3 exercícios · aproximadamente 45 min</p>
            </div>
            <span className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-apex-blue text-white shadow-action">
              <Play className="ml-0.5 h-6 w-6 fill-current" aria-hidden="true" />
            </span>
          </div>
        </article>

        <div className="mt-4 flex items-center gap-3 rounded-card border border-apex-orange/20 bg-apex-orange/5 p-4">
          <CalendarDays className="h-5 w-5 flex-none text-apex-orange" aria-hidden="true" />
          <p className="text-sm font-semibold text-apex-ink">Próxima avaliação em 15 de setembro</p>
        </div>
      </div>

      <StudentBottomNav active={active} onNavigate={setActive} />
    </main>
  );
}
