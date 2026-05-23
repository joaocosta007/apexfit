"use client";

import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatarCarga } from "@/lib/utils";

type ExerciseProgress = {
  name: string;
  data: { date: string; load: number }[];
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("pt-BR", { month: "short" });
}

function formatDateFull(dateStr: string) {
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

export function LoadEvolutionChart({ exercises }: { exercises: ExerciseProgress[] }) {
  const sorted = [...exercises].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  const [selectedName, setSelectedName] = useState(sorted[0]?.name ?? "");

  const selected = sorted.find((e) => e.name === selectedName);
  const data = selected?.data ?? [];

  const firstLoad   = data[0]?.load ?? 0;
  const bestLoad    = data.length > 0 ? Math.max(...data.map(d => d.load)) : 0;
  const lastLoad    = data[data.length - 1]?.load ?? 0;
  const improvement = firstLoad > 0 ? ((lastLoad - firstLoad) / firstLoad) * 100 : 0;
  const hasData     = data.length >= 2;

  const ImprovementIcon  = improvement > 0 ? TrendingUp : improvement < 0 ? TrendingDown : Minus;
  const improvementColor = improvement > 0 ? "text-green-600" : improvement < 0 ? "text-red-500" : "text-slate-500";

  return (
    <div className="space-y-4">
      {/* Selector */}
      <div className="relative">
        <select
          value={selectedName}
          onChange={(e) => setSelectedName(e.target.value)}
          className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3.5 pr-10 text-sm font-bold text-slate-900 shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        >
          {sorted.map((e) => (
            <option key={e.name} value={e.name}>{e.name}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">▾</div>
      </div>

      {/* Stat chips */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white p-3 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Início</p>
          <p className="mt-1 text-lg font-black text-slate-900">{formatarCarga(firstLoad)}</p>
        </div>
        <div className="rounded-2xl bg-white p-3 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Melhor</p>
          <p className="mt-1 text-lg font-black text-slate-900">{formatarCarga(bestLoad)}</p>
        </div>
        <div className={`rounded-2xl p-3 shadow-sm ${improvement > 0 ? "bg-green-500" : improvement < 0 ? "bg-red-50" : "bg-slate-100"}`}>
          <p className={`text-[10px] font-bold uppercase tracking-wide ${improvement > 0 ? "text-green-100" : "text-slate-400"}`}>Progresso</p>
          <div className={`mt-1 flex items-center gap-0.5 ${improvement > 0 ? "text-white" : improvementColor}`}>
            <ImprovementIcon className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-lg font-black">
              {improvement >= 0 ? "+" : ""}{improvement.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="mb-3 text-sm font-bold text-slate-900">Histórico de Carga</p>

        {!hasData ? (
          <div className="flex flex-col items-center py-10 text-center">
            <TrendingUp className="mb-3 h-10 w-10 text-slate-200" />
            <p className="text-sm font-semibold text-slate-400">
              {data.length === 0 ? "Sem registros ainda" : "Faça mais treinos para ver o gráfico"}
            </p>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data} margin={{ top: 5, right: 8, left: -12, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickFormatter={formatDate}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickFormatter={(v) => `${v}`}
                  domain={["auto", "auto"]}
                  axisLine={false}
                  tickLine={false}
                />
                <ReferenceLine y={bestLoad} stroke="#3B82F6" strokeDasharray="4 4" strokeOpacity={0.4} />
                <Tooltip
                  formatter={(value) => [formatarCarga(typeof value === "number" ? value : 0), "Carga"]}
                  labelFormatter={(label) => typeof label === "string" ? formatDateFull(label) : String(label)}
                  contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", fontSize: "12px", boxShadow: "0 4px 14px rgba(0,0,0,0.08)" }}
                />
                <Line
                  type="monotone"
                  dataKey="load"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: "#3B82F6", r: 5, strokeWidth: 0 }}
                  activeDot={{ r: 7, strokeWidth: 0, fill: "#2563EB" }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-2 flex items-center justify-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs text-slate-400">Recorde Pessoal: {formatarCarga(bestLoad)}</span>
            </div>
          </>
        )}
      </div>

      {/* Motivacional */}
      {hasData && improvement > 0 && (
        <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
          <p className="text-2xl">📊</p>
          <p className="mt-1 font-bold text-slate-900">Continue treinando!</p>
          <p className="mt-1 text-sm text-slate-400">Seus ganhos estão impressionantes. Mantenha a consistência!</p>
        </div>
      )}
    </div>
  );
}
