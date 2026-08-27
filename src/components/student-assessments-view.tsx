"use client";

import { useState } from "react";
import { ClipboardCheck, FileText } from "lucide-react";

export type StudentAssessmentData = {
  id: string;
  date: string;
  weight: number | null;
  bodyFat: number | null;
  chest: number | null;
  waist: number | null;
  abdomen: number | null;
  hip: number | null;
  rightArm: number | null;
  leftArm: number | null;
  rightThigh: number | null;
  leftThigh: number | null;
  rightCalf: number | null;
  leftCalf: number | null;
  notes: string | null;
};

type StudentAssessmentsViewProps = {
  assessments: StudentAssessmentData[];
  heightCm: number | null;
};

type Metric = {
  key: keyof StudentAssessmentData | "bmi";
  label: string;
  value: number | null;
  previous: number | null;
  unit: string;
  digits?: number;
};

const DETAILED_MEASURES: { key: keyof StudentAssessmentData; label: string }[] = [
  { key: "abdomen", label: "Abdômen" },
  { key: "rightArm", label: "Braço direito" },
  { key: "leftArm", label: "Braço esquerdo" },
  { key: "rightThigh", label: "Coxa direita" },
  { key: "leftThigh", label: "Coxa esquerda" },
  { key: "rightCalf", label: "Panturrilha direita" },
  { key: "leftCalf", label: "Panturrilha esquerda" },
];

function parseDate(date: string) {
  return new Date(`${date}T12:00:00`);
}

function formatDate(date: string, short = false) {
  return parseDate(date).toLocaleDateString("pt-BR", short
    ? { day: "2-digit", month: "2-digit", year: "numeric" }
    : { day: "2-digit", month: "short", year: "numeric" });
}

function calculateBmi(weight: number | null, heightCm: number | null) {
  if (!weight || !heightCm) return null;
  return weight / ((heightCm / 100) ** 2);
}

function numberValue(value: StudentAssessmentData[keyof StudentAssessmentData]) {
  return typeof value === "number" ? value : null;
}

export function StudentAssessmentsView({ assessments, heightCm }: StudentAssessmentsViewProps) {
  const [selectedId, setSelectedId] = useState(assessments[0]?.id ?? "");
  const selectedIndex = Math.max(0, assessments.findIndex((assessment) => assessment.id === selectedId));
  const selected = assessments[selectedIndex];
  const previous = assessments[selectedIndex + 1] ?? null;

  if (!selected) {
    return (
      <section className="app-card flex min-h-72 flex-col items-center justify-center px-8 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100"><ClipboardCheck className="h-8 w-8 text-apex-blue" /></span>
        <h2 className="mt-5 text-xl font-black text-apex-navy">Nenhuma avaliação registrada</h2>
        <p className="mt-2 max-w-xs text-sm font-medium leading-relaxed text-apex-muted">Quando seu professor registrar a primeira avaliação física, os resultados aparecerão aqui.</p>
      </section>
    );
  }

  const selectedBmi = calculateBmi(selected.weight, heightCm);
  const previousBmi = calculateBmi(previous?.weight ?? null, heightCm);
  const allMetrics: Metric[] = [
    { key: "weight", label: "Peso corporal", value: selected.weight, previous: previous?.weight ?? null, unit: "kg" },
    { key: "bodyFat", label: "% Gordura", value: selected.bodyFat, previous: previous?.bodyFat ?? null, unit: "%" },
    { key: "bmi", label: "IMC", value: selectedBmi, previous: previousBmi, unit: "", digits: 1 },
    { key: "chest", label: "Tórax", value: selected.chest, previous: previous?.chest ?? null, unit: "cm" },
    { key: "waist", label: "Cintura", value: selected.waist, previous: previous?.waist ?? null, unit: "cm" },
    { key: "hip", label: "Quadril", value: selected.hip, previous: previous?.hip ?? null, unit: "cm" },
  ];
  const metrics = allMetrics.filter((metric) => metric.value !== null);
  const detailed = DETAILED_MEASURES.map((measure) => ({ ...measure, value: numberValue(selected[measure.key]) })).filter((measure) => measure.value !== null);

  return (
    <div className="space-y-4">
      <div className={assessments.length <= 3 ? "grid grid-cols-3 gap-2" : "-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"} role="tablist" aria-label="Datas das avaliações">
        {assessments.map((assessment) => {
          const active = assessment.id === selected.id;
          return (
            <button key={assessment.id} type="button" role="tab" aria-selected={active} onClick={() => setSelectedId(assessment.id)} className={`focus-app min-w-0 shrink-0 rounded-full border px-2 py-2.5 text-[11px] font-extrabold transition-colors sm:px-5 sm:text-sm ${active ? "border-apex-navy bg-apex-navy text-white" : "border-slate-200 bg-white text-apex-muted"}`}>
              {formatDate(assessment.date, true)}
            </button>
          );
        })}
      </div>

      <section className="app-card p-5" aria-labelledby="current-measures-title">
        <div className="flex items-start justify-between gap-3">
          <div><p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">Medidas atuais</p><h2 id="current-measures-title" className="mt-1 text-lg font-black text-apex-navy">Avaliação de {formatDate(selected.date)}</h2></div>
          {selectedIndex === 0 && <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-extrabold text-green-700">Recente</span>}
        </div>

        {metrics.length > 0 ? (
          <div className="mt-5 grid grid-cols-2 gap-3">
            {metrics.map((metric) => <AssessmentMetric key={metric.key} metric={metric} />)}
          </div>
        ) : (
          <p className="mt-5 rounded-2xl bg-apex-soft p-4 text-sm font-medium text-apex-muted">Esta avaliação não possui medidas numéricas registradas.</p>
        )}

        {detailed.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center gap-3"><span className="h-px flex-1 bg-slate-200" /><h3 className="text-xs font-extrabold uppercase tracking-wide text-slate-400">Medidas detalhadas</h3><span className="h-px flex-1 bg-slate-200" /></div>
            <div className="mt-2 grid grid-cols-1 gap-x-5 sm:grid-cols-2">
              {detailed.map((measure) => <div key={measure.key} className="flex items-center justify-between border-b border-slate-100 py-3"><span className="text-xs font-medium text-apex-muted">{measure.label}</span><strong className="text-sm text-apex-navy">{measure.value?.toLocaleString("pt-BR")} cm</strong></div>)}
            </div>
          </div>
        )}

        {selected.notes && <div className="mt-5 flex gap-3 rounded-2xl bg-blue-50 p-4"><FileText className="mt-0.5 h-5 w-5 shrink-0 text-apex-blue" /><div><p className="text-xs font-extrabold uppercase tracking-wide text-apex-blue">Observações</p><p className="mt-1 text-sm leading-relaxed text-apex-muted">{selected.notes}</p></div></div>}
      </section>

      <section className="app-card p-5" aria-labelledby="assessment-history-title">
        <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">Histórico de avaliações</p>
        <h2 id="assessment-history-title" className="mt-1 text-xl font-black text-apex-navy">Composição corporal</h2>
        <div className="mt-4 space-y-2.5">
          {assessments.map((assessment, index) => (
            <button key={assessment.id} type="button" onClick={() => setSelectedId(assessment.id)} className={`focus-app w-full rounded-2xl border p-4 text-left transition-colors ${assessment.id === selected.id ? "border-blue-200 bg-blue-50" : "border-transparent bg-apex-soft hover:border-slate-200"}`}>
              <div className="flex items-center justify-between gap-3"><div><p className="text-sm font-black text-apex-navy">Composição corporal</p><p className="mt-1 text-xs font-medium text-slate-400">{formatDate(assessment.date)}</p></div>{index === 0 && <span className="rounded-lg bg-blue-100 px-2.5 py-1 text-[10px] font-extrabold text-apex-blue">Recente</span>}</div>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-apex-muted">
                {assessment.weight != null && <span>Peso <strong className="ml-1 text-apex-navy">{assessment.weight.toLocaleString("pt-BR")} kg</strong></span>}
                {assessment.bodyFat != null && <span>Gordura <strong className="ml-1 text-apex-navy">{assessment.bodyFat.toLocaleString("pt-BR")}%</strong></span>}
                {calculateBmi(assessment.weight, heightCm) != null && <span>IMC <strong className="ml-1 text-apex-navy">{calculateBmi(assessment.weight, heightCm)?.toFixed(1)}</strong></span>}
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function AssessmentMetric({ metric }: { metric: Metric }) {
  const digits = metric.digits ?? (metric.value != null && metric.value % 1 !== 0 ? 1 : 0);
  const difference = metric.value != null && metric.previous != null ? metric.value - metric.previous : null;
  const hasDifference = difference !== null && Math.abs(difference) >= 0.05;
  return (
    <div className="rounded-2xl bg-apex-soft p-4">
      <p className="text-xs font-medium text-slate-400">{metric.label}</p>
      <p className="mt-2 text-2xl font-black text-apex-navy">{metric.value?.toLocaleString("pt-BR", { minimumFractionDigits: digits, maximumFractionDigits: digits })}<span className="ml-1 text-xs font-bold text-apex-muted">{metric.unit}</span></p>
      {hasDifference && <span className="mt-2 inline-flex rounded-lg bg-green-100 px-2 py-1 text-[11px] font-extrabold text-green-700">{difference > 0 ? "+" : ""}{difference.toFixed(1)}{metric.unit}</span>}
    </div>
  );
}
