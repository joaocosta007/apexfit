"use client";

import { useEffect, useState } from "react";
import { RefreshCw, WifiOff } from "lucide-react";
import { StudentWeeklyWorkout } from "@/components/student-weekly-workout";
import { Button } from "@/components/ui/button";
import { loadWorkoutSnapshot } from "@/lib/offline-db";
import type { OfflineWorkoutSnapshot } from "@/lib/offline-types";

function currentWorkoutDay() {
  const date = new Date();
  const jsDay = date.getDay();
  return { index: [6, 0, 1, 2, 3, 4, 5][jsDay] ?? 0, date };
}

export function OfflineWorkoutView() {
  const [snapshot, setSnapshot] = useState<OfflineWorkoutSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const { index, date } = currentWorkoutDay();
  const todayLabel = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "short" }).format(date);

  useEffect(() => {
    void loadWorkoutSnapshot()
      .then(setSnapshot)
      .catch(() => setSnapshot(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="app-card p-5 text-sm font-semibold text-apex-muted">Carregando treino salvo neste aparelho…</div>;
  }

  if (!snapshot?.plan) {
    return (
      <div className="app-card p-6 text-center">
        <WifiOff className="mx-auto h-10 w-10 text-apex-muted" aria-hidden="true" />
        <h2 className="mt-4 text-lg font-black text-apex-navy">Nenhum treino salvo offline</h2>
        <p className="mt-2 text-sm leading-6 text-apex-muted">Abra seu treino pelo menos uma vez com internet para disponibilizá-lo sem sinal.</p>
        <Button type="button" className="mt-5 w-full" onClick={() => window.location.reload()}><RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />Tentar novamente</Button>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-4 rounded-control border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-apex-blue">
        Última atualização: {new Date(snapshot.savedAt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}. Alterações do professor aparecerão quando a internet voltar.
      </p>
      <StudentWeeklyWorkout plan={snapshot.plan} todayIndex={index} todayLabel={todayLabel} streak={snapshot.streak} persist={false} />
    </div>
  );
}
