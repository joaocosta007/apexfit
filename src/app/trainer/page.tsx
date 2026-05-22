import Link from "next/link";
import { Role } from "@prisma/client";
import { AlertTriangle, ChevronRight, Dumbbell, UsersRound } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { FAB } from "@/components/fab";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { iniciais } from "@/lib/utils";
import { resumoDiasTreino } from "@/lib/workout";

// ─── helpers ────────────────────────────────────────────────────────────────

function diasDesdeUltimoTreino(date: Date | null | undefined): number | null {
  if (!date) return null;
  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
}

type Status = "active" | "warning" | "danger";

function calcStatus(dias: number | null): Status {
  if (dias === null || dias >= 5) return "danger";
  if (dias >= 2) return "warning";
  return "active";
}

function labelUltimoTreino(dias: number | null): string {
  if (dias === null) return "Nunca treinou";
  if (dias === 0)    return "Treinou hoje";
  if (dias === 1)    return "Treinou ontem";
  return `Há ${dias} dias`;
}

const statusStyle: Record<Status, { avatar: string; badge: string }> = {
  active:  { avatar: "bg-green-50  text-green-700",  badge: "bg-green-100  text-green-700"  },
  warning: { avatar: "bg-yellow-50 text-yellow-700", badge: "bg-yellow-100 text-yellow-700" },
  danger:  { avatar: "bg-red-50    text-red-600",    badge: "bg-red-100    text-red-600"    },
};

const statusOrder: Record<Status, number> = { danger: 0, warning: 1, active: 2 };

// ─── page ───────────────────────────────────────────────────────────────────

export default async function TrainerDashboardPage() {
  const session = await requireRole(Role.TRAINER);

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const relations = await prisma.studentTrainer.findMany({
    where: { trainerId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      student: {
        include: {
          studentPlans: {
            where: { trainerId: session.user.id, isActive: true },
            include: { splits: { include: { exercises: true } } }
          },
          workoutLogs: {
            orderBy: { date: "desc" },
            take: 1,
            select: { date: true }
          }
        }
      }
    }
  });

  // Contar treinos nesta semana por aluno
  const studentIds = relations.map((r) => r.student.id);
  const weeklyCountsRaw = await prisma.workoutLog.groupBy({
    by: ["studentId"],
    where: { studentId: { in: studentIds }, date: { gte: sevenDaysAgo } },
    _count: { id: true }
  });
  const weeklyByStudent = Object.fromEntries(
    weeklyCountsRaw.map((r) => [r.studentId, r._count.id])
  );

  // Enriquecer dados de cada aluno
  const students = relations
    .map(({ student }) => {
      const lastLog   = student.workoutLogs[0]?.date ?? null;
      const dias      = diasDesdeUltimoTreino(lastLog);
      const status    = calcStatus(dias);
      const weekCount = weeklyByStudent[student.id] ?? 0;
      return { student, plan: student.studentPlans[0], dias, status, weekCount };
    })
    .sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

  const totalAlunos      = students.length;
  const treinosSemana    = students.filter((s) => s.weekCount > 0).length;
  const emRisco          = students.filter((s) => s.status === "danger").length;

  return (
    <AppShell title="Painel do Professor" subtitle="Gerencie alunos, planos e acompanhe a frequência de treinos.">
      {/* ── cards de resumo ── */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4">
            <UsersRound className="mb-2 h-4 w-4 text-primary" />
            <p className="text-2xl font-black text-slate-900">{totalAlunos}</p>
            <p className="text-xs text-slate-500">Alunos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <Dumbbell className="mb-2 h-4 w-4 text-green-600" />
            <p className="text-2xl font-black text-slate-900">{treinosSemana}</p>
            <p className="text-xs text-slate-500">Treinaram<br />esta semana</p>
          </CardContent>
        </Card>
        <Card className={emRisco > 0 ? "border-red-200" : ""}>
          <CardContent className="pt-4">
            <AlertTriangle className={`mb-2 h-4 w-4 ${emRisco > 0 ? "text-red-500" : "text-slate-400"}`} />
            <p className={`text-2xl font-black ${emRisco > 0 ? "text-red-600" : "text-slate-900"}`}>{emRisco}</p>
            <p className="text-xs text-slate-500">Em risco<br />(5+ dias)</p>
          </CardContent>
        </Card>
      </div>

      {/* ── lista de alunos ── */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-[0.22em] text-slate-500">Meus alunos</h2>

        {students.length === 0 ? (
          <Card>
            <CardContent className="pt-5">
              <p className="font-semibold text-slate-900">Nenhum aluno cadastrado ainda.</p>
              <p className="mt-2 text-sm text-slate-600">Toque no botão azul para adicionar seu primeiro aluno.</p>
            </CardContent>
          </Card>
        ) : null}

        {students.map(({ student, plan, dias, status, weekCount }) => {
          const style = statusStyle[status];
          return (
            <Link key={student.id} href={`/trainer/workouts/${student.id}`} className="block">
              <Card className="transition-colors hover:border-primary/40">
                <CardContent className="flex items-center gap-4 pt-4 pb-4">
                  <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-sm font-black ${style.avatar}`}>
                    {iniciais(student.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-bold text-slate-900">{student.name}</h3>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${style.badge}`}>
                        {labelUltimoTreino(dias)}
                      </span>
                      {weekCount > 0 && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                          {weekCount}× esta semana
                        </span>
                      )}
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      <Badge variant="outline">{plan?.planName ?? "Sem plano"}</Badge>
                      <Badge variant="outline">{resumoDiasTreino(plan?.trainingDays)}</Badge>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 flex-shrink-0 text-slate-400" />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </section>

      <FAB href="/trainer/students/new" label="Adicionar Aluno" />
    </AppShell>
  );
}
