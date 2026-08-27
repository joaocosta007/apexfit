"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatarCarga } from "@/lib/utils";

export type ExerciseProgress = { name: string; data: { date: string; load: number }[] };

type LoadEvolutionChartProps = {
  exercises: ExerciseProgress[];
  completedWeekDays: number[];
  weeklyGoal: number;
};

const WEEK_DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

function formatDateFull(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function aggregateLastEightWeeks(data: ExerciseProgress["data"]) {
  const latestByWeek = new Map<string, { label: string; load: number; time: number }>();
  data.forEach((entry) => {
    const date = new Date(`${entry.date}T12:00:00`);
    const monday = new Date(date);
    const day = date.getDay();
    monday.setDate(date.getDate() - (day === 0 ? 6 : day - 1));
    const key = monday.toISOString().slice(0, 10);
    const previous = latestByWeek.get(key);
    if (!previous || date.getTime() >= previous.time) latestByWeek.set(key, { label: key, load: entry.load, time: date.getTime() });
  });
  return [...latestByWeek.values()].sort((a, b) => a.time - b.time).slice(-8).map((entry, index) => ({ ...entry, week: `S${index + 1}` }));
}

export function LoadEvolutionChart({ exercises, completedWeekDays, weeklyGoal }: LoadEvolutionChartProps) {
  const sorted = useMemo(() => [...exercises].sort((a, b) => b.data.length - a.data.length), [exercises]);
  const [selectedName, setSelectedName] = useState(sorted[0]?.name ?? "");
  const selected = sorted.find((exercise) => exercise.name === selectedName) ?? sorted[0];
  const weeklyData = aggregateLastEightWeeks(selected?.data ?? []);
  const firstLoad = weeklyData[0]?.load ?? selected?.data[0]?.load ?? 0;
  const currentLoad = weeklyData.at(-1)?.load ?? selected?.data.at(-1)?.load ?? 0;
  const gain = currentLoad - firstLoad;
  const latestSessions = [...(selected?.data ?? [])].reverse().slice(0, 3);

  return (
    <div className="space-y-4">
      <section className="app-card p-5" aria-labelledby="weekly-frequency-title">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p id="weekly-frequency-title" className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">Frequência semanal</p>
            <p className="mt-2 text-3xl font-black text-apex-navy">{completedWeekDays.length}<span className="text-base font-bold text-apex-muted"> / 7 dias</span></p>
          </div>
          <span className="flex items-center gap-1 rounded-2xl bg-blue-100 px-3 py-2 text-sm font-extrabold text-apex-blue"><CheckCircle2 className="h-4 w-4" /> Meta: {weeklyGoal || 0}×</span>
        </div>
        <div className="mt-5 grid grid-cols-7 gap-2">
          {WEEK_DAYS.map((day, index) => {
            const completed = completedWeekDays.includes(index);
            return (
              <div key={day} className="text-center">
                <span className={`flex aspect-square items-center justify-center rounded-xl border text-base font-black ${completed ? "border-apex-green bg-apex-green text-white" : "border-slate-200 bg-apex-soft text-slate-300"}`}>{completed ? "✓" : ""}</span>
                <span className={`mt-2 block text-[10px] font-bold ${completed ? "text-apex-green" : "text-slate-400"}`}>{day}</span>
              </div>
            );
          })}
        </div>
      </section>

      {sorted.length === 0 ? (
        <section className="app-card flex min-h-56 flex-col items-center justify-center px-8 text-center">
          <TrendingUp className="h-9 w-9 text-slate-300" />
          <h2 className="mt-4 text-lg font-black text-apex-navy">Seu progresso começa no primeiro treino</h2>
          <p className="mt-2 text-sm font-medium leading-relaxed text-apex-muted">Registre as cargas dos exercícios para acompanhar sua evolução aqui.</p>
        </section>
      ) : (
        <>
      <section className="app-card overflow-hidden p-5" aria-labelledby="load-evolution-title">
        <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">Evolução de carga</p>
        <h2 id="load-evolution-title" className="mt-1 text-xl font-black text-apex-navy">Últimas 8 semanas</h2>
        <div className="-mx-1 mt-5 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Selecionar exercício">
          {sorted.map((exercise) => {
            const active = exercise.name === selected?.name;
            return <button key={exercise.name} type="button" role="tab" aria-selected={active} onClick={() => setSelectedName(exercise.name)} className={`focus-app shrink-0 rounded-xl px-4 py-2.5 text-xs font-extrabold transition-colors ${active ? "bg-apex-navy text-white" : "bg-apex-soft text-apex-muted hover:text-apex-navy"}`}>{exercise.name}</button>;
          })}
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          <Metric label="Início" value={formatarCarga(firstLoad)} />
          <Metric label="Atual" value={formatarCarga(currentLoad)} highlight="blue" />
          <Metric label="Ganho" value={`${gain >= 0 ? "+" : ""}${formatarCarga(gain)}`} highlight={gain >= 0 ? "green" : undefined} />
        </div>
        {weeklyData.length >= 2 ? (
          <div className="mt-5 h-52 min-w-0 w-full" aria-label={`Gráfico de carga de ${selected?.name}`}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 320, height: 208 }}>
              <LineChart data={weeklyData} margin={{ top: 10, right: 6, left: -18, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="4 4" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} width={42} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <Tooltip formatter={(value) => [formatarCarga(Number(value)), "Carga"]} labelFormatter={(_, payload) => payload[0]?.payload?.label ? formatDateFull(payload[0].payload.label) : ""} contentStyle={{ borderRadius: 14, border: "1px solid #e2e8f0", boxShadow: "0 8px 24px rgba(13,35,66,.12)", fontSize: 12 }} />
                <Line type="monotone" dataKey="load" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: "#2563eb", strokeWidth: 0 }} activeDot={{ r: 6, fill: "#2563eb", strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="mt-5 flex min-h-40 flex-col items-center justify-center rounded-2xl bg-apex-soft px-6 text-center">
            <TrendingUp className="h-8 w-8 text-slate-300" /><p className="mt-3 text-sm font-bold text-apex-navy">Mais um registro libera o gráfico</p><p className="mt-1 text-xs text-apex-muted">Continue registrando suas cargas neste exercício.</p>
          </div>
        )}
      </section>

      <section className="app-card p-5" aria-labelledby="recent-workouts-title">
        <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">Últimos treinos</p>
        <h2 id="recent-workouts-title" className="mt-1 text-xl font-black text-apex-navy">Histórico</h2>
        <div className="mt-4 divide-y divide-slate-100">
          {latestSessions.map((session, index) => <div key={`${session.date}-${session.load}-${index}`} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"><div><p className="text-sm font-extrabold text-apex-navy">{selected?.name}</p><p className="mt-0.5 text-xs font-medium text-apex-muted">{formatDateFull(session.date)}</p></div><span className="rounded-xl bg-apex-soft px-3 py-2 text-sm font-black text-apex-blue">{formatarCarga(session.load)}</span></div>)}
        </div>
      </section>
        </>
      )}
    </div>
  );
}

function Metric({ label, value, highlight }: { label: string; value: string; highlight?: "blue" | "green" }) {
  return <div className={`rounded-2xl p-3.5 ${highlight === "green" ? "bg-green-100" : "bg-apex-soft"}`}><p className="text-[11px] font-bold text-slate-400">{label}</p><p className={`mt-1 whitespace-nowrap text-lg font-black ${highlight === "green" ? "text-apex-green" : highlight === "blue" ? "text-apex-blue" : "text-slate-400"}`}>{value}</p></div>;
}
