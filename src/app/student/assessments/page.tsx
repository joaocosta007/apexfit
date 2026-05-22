import { Role } from "@prisma/client";
import { AppShell } from "@/components/app-shell";
import { StudentBottomNav } from "@/components/student-bottom-nav";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

type Measurement = {
  label: string;
  value: number | null;
  unit: string;
};

function measurements(a: {
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
}): Measurement[] {
  return [
    { label: "Peso",          value: a.weight,     unit: "kg" },
    { label: "% Gordura",     value: a.bodyFat,    unit: "%" },
    { label: "Peitoral",      value: a.chest,      unit: "cm" },
    { label: "Cintura",       value: a.waist,      unit: "cm" },
    { label: "Abdômen",       value: a.abdomen,    unit: "cm" },
    { label: "Quadril",       value: a.hip,        unit: "cm" },
    { label: "Braço D.",      value: a.rightArm,   unit: "cm" },
    { label: "Braço E.",      value: a.leftArm,    unit: "cm" },
    { label: "Coxa D.",       value: a.rightThigh, unit: "cm" },
    { label: "Coxa E.",       value: a.leftThigh,  unit: "cm" },
    { label: "Pant. D.",      value: a.rightCalf,  unit: "cm" },
    { label: "Pant. E.",      value: a.leftCalf,   unit: "cm" },
  ].filter((m) => m.value !== null);
}

function delta(current: number | null, previous: number | null): string | null {
  if (current == null || previous == null) return null;
  const diff = current - previous;
  if (diff === 0) return null;
  return `${diff > 0 ? "+" : ""}${diff.toFixed(1)}`;
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
      subtitle="Acompanhe sua evolução corporal ao longo do tempo."
    >
      {assessments.length === 0 ? (
        <Card>
          <CardContent className="pt-5">
            <p className="font-semibold text-slate-900">Nenhuma avaliação registrada.</p>
            <p className="mt-2 text-sm text-slate-600">
              Peça ao seu professor para registrar sua primeira avaliação física.
            </p>
          </CardContent>
        </Card>
      ) : null}

      {latest ? (
        <div className="space-y-4">
          {/* Avaliação mais recente */}
          <Card className="border-primary/30">
            <CardContent className="pt-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">Última avaliação</p>
                  <p className="mt-1 text-lg font-black text-slate-900">
                    {latest.date.toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric"
                    })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {measurements(latest).map((m) => {
                  const prev = previous
                    ? measurements(previous).find((p) => p.label === m.label)?.value ?? null
                    : null;
                  const d = delta(m.value, prev);

                  return (
                    <div key={m.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">{m.label}</p>
                      <p className="mt-1 text-lg font-black text-slate-900">
                        {m.value} {m.unit}
                      </p>
                      {d ? (
                        <p className="text-xs font-semibold text-slate-400">
                          {d} vs anterior
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              {latest.notes ? (
                <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm italic text-slate-600">
                  {latest.notes}
                </p>
              ) : null}
            </CardContent>
          </Card>

          {/* Histórico completo */}
          {assessments.length > 1 ? (
            <div className="space-y-3">
              <h2 className="text-lg font-black text-slate-900">Histórico</h2>
              {assessments.slice(1).map((a, index) => {
                const next = assessments[index]; // a avaliação mais recente em relação a esta
                return (
                  <Card key={a.id}>
                    <CardContent className="pt-4">
                      <p className="mb-3 font-bold text-slate-900">
                        {a.date.toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric"
                        })}
                      </p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-600">
                        {measurements(a).map((m) => {
                          const nextVal = measurements(next).find((p) => p.label === m.label)?.value ?? null;
                          const d = delta(nextVal, m.value);
                          return (
                            <span key={m.label}>
                              {m.label}: <strong>{m.value} {m.unit}</strong>
                              {d ? <span className="ml-1 text-xs text-slate-400">({d})</span> : null}
                            </span>
                          );
                        })}
                      </div>
                      {a.notes ? <p className="mt-2 text-xs italic text-slate-400">{a.notes}</p> : null}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : null}
        </div>
      ) : null}

      <StudentBottomNav active="assessments" />
    </AppShell>
  );
}
