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
      title="Avaliações Físicas"
      variant="student"
      userName={session.user.name}
      bottomNav={<StudentBottomNav active="assessments" />}
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
          <div className="flex gap-2 overflow-x-auto pb-1">
            {assessments.slice(0, 3).map((assessment, index) => <span key={assessment.id} className={`whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-bold ${index === 0 ? "border-[#0d2342] bg-[#0d2342] text-white" : "border-slate-200 bg-white text-slate-500"}`}>{assessment.date.toLocaleDateString("pt-BR")}</span>)}
          </div>

          <div className="app-card p-5">
            <div className="mb-5 flex items-center justify-between"><h2 className="font-black text-slate-900">Avaliação de {latest.date.toLocaleDateString("pt-BR")}</h2><span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700">Recente</span></div>

          {(latest.weight != null || latest.bodyFat != null) && (
            <div className="grid grid-cols-2 gap-3">
              {latest.weight != null && (() => {
                const d = delta(latest.weight, previous?.weight ?? null);
                return (
                  <div className="soft-surface p-4 text-center">
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
                  <div className="soft-surface p-4 text-center">
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

          {medidas(latest).length > 0 && (
            <>
              <div className="my-5 flex items-center gap-3"><span className="h-px flex-1 bg-slate-200" /><h3 className="text-sm font-bold text-slate-400">Medidas (cm)</h3><span className="h-px flex-1 bg-slate-200" /></div>
              <div className="grid grid-cols-2 gap-x-5">
                {medidas(latest).map((m) => {
                  return (
                    <div key={m.label} className="flex items-center justify-between border-b border-slate-100 py-3">
                      <p className="text-sm font-medium text-slate-500">{m.label}</p>
                      <p className="text-sm font-black text-slate-900">
                        {m.value} <span className="text-xs font-semibold text-slate-400">{m.unit}</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          </div>

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

    </AppShell>
  );
}
