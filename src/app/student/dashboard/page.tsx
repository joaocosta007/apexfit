import Link from "next/link";
import { Role } from "@prisma/client";
import { ClipboardList, Flame, Trophy, Dumbbell, CalendarCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StudentBottomNav } from "@/components/student-bottom-nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { formatarCarga } from "@/lib/utils";
import { indicesDiasTreino } from "@/lib/workout";

// ─── helpers ────────────────────────────────────────────────────────────────

function calcularStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  const sorted = [...new Set(dates)].sort().reverse();
  const today     = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);

  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]).getTime();
    const curr = new Date(sorted[i]).getTime();
    if ((prev - curr) / 86_400_000 === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

// ─── page ───────────────────────────────────────────────────────────────────

export default async function StudentDashboardPage() {
  const session = await requireRole(Role.STUDENT);
  const userId = session.user.id;

  const now       = new Date();
  const weekAgo   = new Date(Date.now() - 7  * 86_400_000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [user, plan, logs, anamnese] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { name: true } }),
    prisma.workoutPlan.findFirst({
      where: { studentId: userId, isActive: true },
      select: { planName: true, trainingDays: true }
    }),
    prisma.workoutLog.findMany({
      where: { studentId: userId },
      orderBy: { date: "desc" },
      select: { date: true, completedLoadKg: true, exercise: { select: { name: true } } }
    }),
    prisma.anamnese.findUnique({ where: { studentId: userId } })
  ]);

  // ── estatísticas ──
  const allDates   = logs.map(l => l.date.toISOString().slice(0, 10));
  const streak     = calcularStreak(allDates);
  const thisWeek   = logs.filter(l => l.date >= weekAgo).length;
  const thisMonth  = logs.filter(l => l.date >= monthStart).length;

  // meta semanal = número de dias no plano
  const metaDias = plan ? indicesDiasTreino(plan.trainingDays).length : 0;

  // ── recordes pessoais ──
  const recordMap: Record<string, number> = {};
  for (const log of logs) {
    const name = log.exercise.name;
    if (!recordMap[name] || log.completedLoadKg > recordMap[name]) {
      recordMap[name] = log.completedLoadKg;
    }
  }
  const recordes = Object.entries(recordMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const firstName = user?.name.split(" ")[0] ?? "Aluno";

  return (
    <AppShell
      title={`Olá, ${firstName}! 👋`}
      subtitle="Veja seu progresso e mantenha a consistência."
    >
      {/* ── cards de estatísticas ── */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4">
            <Flame className={`mb-2 h-4 w-4 ${streak > 0 ? "text-orange-500" : "text-slate-300"}`} />
            <p className={`text-2xl font-black ${streak > 0 ? "text-orange-500" : "text-slate-900"}`}>
              {streak}
            </p>
            <p className="text-xs text-slate-500">Sequência<br />de dias</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <CalendarCheck className="mb-2 h-4 w-4 text-primary" />
            <p className="text-2xl font-black text-slate-900">{thisWeek}</p>
            <p className="text-xs text-slate-500">Treinos<br />esta semana</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <Dumbbell className="mb-2 h-4 w-4 text-blue-600" />
            <p className="text-2xl font-black text-slate-900">{thisMonth}</p>
            <p className="text-xs text-slate-500">Treinos<br />este mês</p>
          </CardContent>
        </Card>
      </div>

      {/* ── meta semanal ── */}
      {plan && metaDias > 0 ? (
        <Card className="mb-4">
          <CardContent className="pt-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-bold text-slate-900">Meta semanal</p>
              <span className="text-sm font-semibold text-slate-500">
                {Math.min(thisWeek, metaDias)}/{metaDias} dias
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${Math.min((thisWeek / metaDias) * 100, 100)}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-slate-400">{plan.planName}</p>
          </CardContent>
        </Card>
      ) : null}

      {/* ── recordes pessoais ── */}
      <section className="mb-4 space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-[0.22em] text-slate-500">
          Recordes pessoais
        </h2>

        {recordes.length === 0 ? (
          <Card>
            <CardContent className="pt-5">
              <p className="text-sm text-slate-600">
                Nenhum treino registrado ainda. Complete seus primeiros exercícios para ver seus recordes aqui!
              </p>
            </CardContent>
          </Card>
        ) : (
          recordes.map(([name, load], index) => (
            <div
              key={name}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-50">
                <Trophy className={`h-4 w-4 ${index === 0 ? "text-amber-500" : index === 1 ? "text-slate-400" : "text-amber-800/60"}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-900">{name}</p>
              </div>
              <Badge variant="secondary" className="flex-shrink-0 font-bold">
                {formatarCarga(load)}
              </Badge>
            </div>
          ))
        )}
      </section>

      {/* ── anamnese ── */}
      <Card className={anamnese ? "border-green-200 bg-green-50" : "border-blue-200 bg-blue-50"}>
        <CardContent className="flex items-center gap-4 pt-4 pb-4">
          <ClipboardList className={`h-8 w-8 flex-shrink-0 ${anamnese ? "text-green-600" : "text-primary"}`} />
          <div className="min-w-0 flex-1">
            <p className="font-bold text-slate-900">
              {anamnese ? "Anamnese preenchida" : "Preencha sua anamnese"}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              {anamnese
                ? "Seu professor pode ver suas informações de saúde e objetivos."
                : "Informe seu histórico de saúde para que seu professor monte um plano mais adequado."}
            </p>
          </div>
          <Link
            href="/student/anamnese"
            className="flex-shrink-0 rounded-lg border border-current px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/5"
          >
            {anamnese ? "Atualizar" : "Preencher"}
          </Link>
        </CardContent>
      </Card>

      <StudentBottomNav active="dashboard" />
    </AppShell>
  );
}
