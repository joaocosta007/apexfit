import { CalendarDays } from "lucide-react";
import { Role } from "@prisma/client";
import { AppShell } from "@/components/app-shell";
import { StudentBottomNav } from "@/components/student-bottom-nav";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

type Medida = { label: string; value: number | null; unit: string };

function medidas(a: {
  weight: number | null; bodyFat: number | null; chest: number | null;
  waist: number | null; abdomen: number | null; hip: number | null;
  rightArm: number | null; leftArm: number | null; rightThigh: number | null;
  leftThigh: number | null; rightCalf: number | null; leftCalf: number | null;
}): Medida[] {
  return [
    { label: "Peitoral",    value: a.chest,      unit: "cm" },
    { label: "Cintura",     value: a.waist,      unit: "cm" },
    { label: "Braço",       value: a.rightArm,   unit: "cm" },
    { label: "Coxa",        value: a.rightThigh, unit: "cm" },
    { label: "Panturrilha", value: a.rightCalf,  unit: "cm" },
    { label: "Quadril",     value: a.hip,        unit: "cm" },
  ].filter(m => m.value !== null);
}

function delta(curr: number | null, prev: number | null): { text: string; positive: boolean } | null {
  if (curr == null || prev == null) return null;
  const diff = curr - prev;
  if (diff === 0) return null;
  return { text: `${diff > 0 ? "+" : ""}${diff.toFixed(1)}`, positive: diff > 0 };
}

export default async function StudentAssessmentsPage() {
  const session = await requireRole(Role.STUDENT);

  const assessments = await prisma.physicalAssessment.findMany({
    where: { studentId: session.user.id },
    orderBy: { date: "desc" }
  });

  const latest   = assessments[0] ?? null;
  const previous = assessments[1] ?? null;

  return (
    <AppShell
      title="Avaliação Física"
      subtitle="Acompanhe suas medidas corporais"
      variant="student"
    >
      {!latest ? (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="font-semibold text-slate-900">Nenhuma avaliação registrada.</p>
          <p className="mt-2 text-sm text-slate-500">
            Peça ao seu professor para registrar sua primeira avaliação física.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Header azul */}
          <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-4 shadow-lg shadow-blue-600/20">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <CalendarDays className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-blue-100">Última avaliação</p>
              <p className="text-lg font-black text-white">
                {latest.date.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* Peso + Gordura — destaque */}
          {(latest.weight != null || latest.bodyFat != null) && (
            <div className="grid grid-cols-2 gap-3">
              {latest.weight != null && (() => {
                const d = delta(latest.weight, previous?.weight ?? null);
                return (
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Peso atual</p>
                    <p className="mt-1 text-2xl font-black text-slate-900">
                      {latest.weight}<span className="text-sm font-semibold text-slate-400">kg</span>
                    </p>
                    {d && (
                      <p className={`mt-1 flex items-center gap-0.5 text-xs font-bold ${d.positive ? "text-red-500" : "text-green-600"}`}>
                        <span>{d.positive ? "↗" : "↘"}</span>
                        <span>{d.text}kg</span>
                      </p>
                    )}
                  </div>
                );
              })()}
              {latest.bodyFat != null && (() => {
                const d = delta(latest.bodyFat, previous?.bodyFat ?? null);
                return (
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Gordura corporal</p>
                    <p className="mt-1 text-2xl font-black text-slate-900">
                      {latest.bodyFat}<span className="text-sm font-semibold text-slate-400">%</span>
                    </p>
                    {d && (
                      <p className={`mt-1 flex items-center gap-0.5 text-xs font-bold ${d.positive ? "text-red-500" : "text-green-600"}`}>
                        <span>{d.positive ? "↗" : "↘"}</span>
                        <span>{d.text}%</span>
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Outras medidas */}
          {medidas(latest).length > 0 && (
            <>
              <h2 className="text-base font-black text-slate-900">Outras Medidas</h2>
              <div className="grid grid-cols-2 gap-3">
                {medidas(latest).map((m) => {
                  const prev = previous ? medidas(previous).find(p => p.label === m.label)?.value ?? null : null;
                  const d = delta(m.value, prev);
                  return (
                    <div key={m.label} className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{m.label}</p>
                      <p className="mt-1 text-xl font-black text-slate-900">
                        {m.value} <span className="text-xs font-semibold text-slate-400">{m.unit}</span>
                      </p>
                      {d && (
                        <p className={`mt-1 flex items-center gap-0.5 text-xs font-bold ${d.positive ? "text-green-600" : "text-red-500"}`}>
                          <span>{d.positive ? "↗" : "↘"}</span>
                          <span>{d.text}cm</span>
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Histórico */}
          {assessments.length > 1 && (
            <>
              <h2 className="text-base font-black text-slate-900">Histórico de Avaliações</h2>
              <div className="space-y-2">
                {assessments.map((a, index) => (
                  <div key={a.id} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-sm">
                    <div className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 ${index === 0 ? "border-blue-600 bg-blue-600" : "border-slate-200 bg-white"}`}>
                      {index === 0 && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {index === 0 ? "Atual" : index === 1 ? "Anterior" : a.date.toLocaleDateString("pt-BR", { month: "long" })}
                      </p>
                      <p className="text-xs text-slate-400">
                        {a.date.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <StudentBottomNav active="assessments" />
    </AppShell>
  );
}
