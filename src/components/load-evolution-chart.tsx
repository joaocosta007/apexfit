"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatarCarga } from "@/lib/utils";

type ExerciseProgress = {
  name: string;
  data: { date: string; load: number }[];
};

type LoadEvolutionChartProps = {
  exercises: ExerciseProgress[];
};

function formatDate(dateStr: string) {
  const [, month, day] = dateStr.split("-");
  return `${day}/${month}`;
}

function formatDateFull(dateStr: string) {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

export function LoadEvolutionChart({ exercises }: LoadEvolutionChartProps) {
  const sorted = [...exercises].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  const [selectedName, setSelectedName] = useState(sorted[0]?.name ?? "");

  const selected = sorted.find((e) => e.name === selectedName);
  const data = selected?.data ?? [];

  const firstLoad = data[0]?.load ?? 0;
  const lastLoad = data[data.length - 1]?.load ?? 0;
  const bestLoad = data.length > 0 ? Math.max(...data.map((d) => d.load)) : 0;
  const improvement = firstLoad > 0 ? ((lastLoad - firstLoad) / firstLoad) * 100 : 0;
  const hasEnoughData = data.length >= 2;

  const ImprovementIcon =
    improvement > 0 ? TrendingUp : improvement < 0 ? TrendingDown : Minus;
  const improvementColor =
    improvement > 0 ? "text-green-600" : improvement < 0 ? "text-red-500" : "text-slate-500";
  const improvementBorder =
    improvement > 0 ? "border-green-200 bg-green-50" : improvement < 0 ? "border-red-200 bg-red-50" : "";

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-600">Exercício</label>
        <select
          value={selectedName}
          onChange={(e) => setSelectedName(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-primary"
        >
          {sorted.map((e) => (
            <option key={e.name} value={e.name}>
              {e.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-slate-500">1ª carga</p>
            <p className="mt-1 text-base font-black text-slate-900">{formatarCarga(firstLoad)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-slate-500">Melhor</p>
            <p className="mt-1 text-base font-black text-primary">{formatarCarga(bestLoad)}</p>
          </CardContent>
        </Card>
        <Card className={improvementBorder}>
          <CardContent className="p-3">
            <p className="text-xs text-slate-500">Evolução</p>
            <div className={`mt-1 flex items-center gap-1 ${improvementColor}`}>
              <ImprovementIcon className="h-4 w-4 flex-shrink-0" />
              <span className="text-base font-black">
                {improvement >= 0 ? "+" : ""}
                {improvement.toFixed(0)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-5">
          {!hasEnoughData ? (
            <div className="flex flex-col items-center py-8 text-center">
              <TrendingUp className="mb-3 h-10 w-10 text-slate-200" />
              <p className="text-sm font-semibold text-slate-500">
                {data.length === 0 ? "Sem registros" : "Poucos registros ainda"}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Complete mais treinos para o gráfico aparecer.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data} margin={{ top: 5, right: 8, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickFormatter={formatDate}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickFormatter={(v) => `${v}kg`}
                  domain={["auto", "auto"]}
                />
                <ReferenceLine
                  y={bestLoad}
                  stroke="#1E40AF"
                  strokeDasharray="4 4"
                  strokeOpacity={0.3}
                />
                <Tooltip
                  formatter={(value) => [formatarCarga(typeof value === "number" ? value : 0), "Carga"]}
                  labelFormatter={(label) => (typeof label === "string" ? formatDateFull(label) : String(label))}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.08)"
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="load"
                  stroke="#1E40AF"
                  strokeWidth={2.5}
                  dot={{ fill: "#1E40AF", r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <p className="text-center text-xs text-slate-400">
        {data.length} {data.length === 1 ? "registro" : "registros"} para {selectedName}
      </p>
    </div>
  );
}
