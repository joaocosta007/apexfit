import Link from "next/link";
import { Role } from "@prisma/client";
import { CalendarCheck, Dumbbell, Flame, Trophy } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StudentBottomNav } from "@/components/student-bottom-nav";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { formatarCarga } from "@/lib/utils";
import { indicesDiasTreino } from "@/lib/workout";

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
    if ((prev - curr) / 86_400_000 === 1) streak++;
    else break;
  }
  return streak;
}

export default async function StudentDashboardPage() {
  const session = await requireRole(Role.STUDENT);
  const userId = session.user.id;

  const now        = new Date();
  const weekAgo    = new Date(Date.now() - 7 * 86_400_000);
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

  const allDates  = logs.map(l => l.date.toISOString().slice(0, 10));
  const streak    = calcularStreak(allDates);
  const thisWeek  = logs.filter(l => l.date >= weekAgo).length;
  const thisMonth = logs.filter(l => l.date >= monthStart).length;
  const metaDias  = plan ? indicesDiasTreino(plan.trainingDays).length : 0;

  const recordMap: Record<string, number> = {};
  for (const log of logs) {
    const name = log.exercise.name;
    if (!recordMap[name] || log.completedLoadKg > recordMap[name]) recordMap[name] = log.completedLoadKg;
  }
  const recordes = Object.entries(recordMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const firstName = user?.name.split(" ")[0] ?? "Aluno";

  const trophyColor = (i: number) =>
    i === 0 ? "text-amber-500" : i === 1 ? "text-slate-400" : "text-amber-700/60";
  const trophyBg = (i: number) =>
    i === 0 ? "bg-amber-50" : i === 1 ? "bg-slate-100" : "bg-orange-50";

  return (
    <AppShell
      title={`Olá, ${firstName}! 👋`}
      subtitle="Pronto para treinar hoje?"
      variant="student"
      bottomNav={<StudentBottomNav active="dashboard" />}
    >
      {/* Stats */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{streak}</p>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Dias</p>
        </div>
        <div className="flex flex-col items-center rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <CalendarCheck className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{thisWeek}</p>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Esta semana</p>
        </div>
        <div className="flex flex-col items-center rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
            <Dumbbell className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{thisMonth}</p>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Este mês</p>
        </div>
      </div>

      {/* Meta semanal */}
      {plan && metaDias > 0 && (
        <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900">Meta semanal: {Math.min(thisWeek, metaDias)}/{metaDias} dias</span>
            <span className="text-sm font-bold text-blue-600">{Math.round(Math.min((thisWeek / metaDias) * 100, 100))}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{ width: `${Math.min((thisWeek / metaDias) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Recordes */}
      <div className="mb-4 space-y-2">
        <h2 className="text-base font-black text-slate-900">Recordes Pessoais</h2>
        {recordes.length === 0 ? (
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Complete seus primeiros treinos para ver seus recordes aqui!</p>
          </div>
        ) : (
          recordes.map(([name, load], i) => (
            <div key={name} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-sm">
              <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${trophyBg(i)}`}>
                <Trophy className={`h-4 w-4 ${trophyColor(i)}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-900">{name}</p>
                <p className="text-xs text-slate-400">Melhor carga</p>
              </div>
              <span className="text-base font-black text-slate-900">{formatarCarga(load)}</span>
            </div>
          ))
        )}
      </div>

      {/* Anamnese */}
      {!anamnese ? (
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-5 shadow-lg shadow-blue-600/20">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <span className="text-xl">📋</span>
            </div>
            <div>
              <p className="font-bold text-white">Complete sua Anamnese</p>
              <p className="text-xs text-blue-100">Nos ajuda a personalizar seu treino</p>
            </div>
          </div>
          <Link
            href="/student/anamnese"
            className="block w-full rounded-xl bg-white py-2.5 text-center text-sm font-bold text-blue-600"
          >
            Preencher
          </Link>
        </div>
      ) : (
        <Link
          href="/student/anamnese"
          className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 px-5 py-4 shadow-lg shadow-blue-600/20"
        >
          <span className="text-xl">✅</span>
          <div>
            <p className="font-bold text-white">Anamnese preenchida</p>
            <p className="text-xs text-blue-100">Toque para atualizar suas informações</p>
          </div>
        </Link>
      )}

    </AppShell>
  );
}
