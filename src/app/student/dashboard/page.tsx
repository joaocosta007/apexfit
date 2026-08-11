import Link from "next/link";
import { Role } from "@prisma/client";
import { ClipboardList, Flame, Play, Target, Trophy } from "lucide-react";
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

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [user, plan, logs, anamnese] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { name: true } }),
    prisma.workoutPlan.findFirst({
      where: { studentId: userId, isActive: true },
      select: {
        planName: true,
        trainingDays: true,
        splits: {
          orderBy: { sortOrder: "asc" },
          take: 1,
          select: {
            splitName: true,
            exercises: { take: 3, select: { name: true } }
          }
        }
      }
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
  // Conta dias únicos de treino (não registros individuais de exercício)
  const thisWeek  = new Set(logs.filter(l => l.date >= weekAgo).map(l => l.date.toISOString().slice(0, 10))).size;
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

  return (
    <AppShell
      title={`Olá, ${firstName}! 👋`}
      subtitle="Pronto para treinar hoje?"
      variant="student"
      userName={user?.name}
      bottomNav={<StudentBottomNav active="dashboard" />}
    >
      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="app-card p-5">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-500"><Flame className="h-5 w-5 text-amber-500" /> Sequência</div>
          <p className="text-4xl font-black tracking-tight text-slate-900">{streak}</p>
          <p className="text-sm font-medium text-slate-500">dias seguidos</p>
          <div className="mt-4 flex gap-1.5">{Array.from({ length: 7 }).map((_, index) => <span key={index} className={`h-2 flex-1 rounded-full ${index < Math.min(streak, 7) ? "bg-amber-500" : "bg-slate-100"}`} />)}</div>
        </div>
        <div className="app-card p-5">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-500"><Target className="h-5 w-5 text-blue-600" /> Meta semanal</div>
          <p className="text-4xl font-black tracking-tight text-slate-900">{thisWeek}<span className="text-xl text-slate-500">/{metaDias || 0}</span></p>
          <p className="text-sm font-medium text-slate-500">dias de treino</p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${metaDias ? Math.min((thisWeek / metaDias) * 100, 100) : 0}%` }} /></div>
        </div>
      </div>

      {plan && (
        <Link href="/student/workouts/today" className="app-card mb-6 block p-5 transition-transform active:scale-[0.99]">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">Treino de hoje</span>
              <h2 className="mt-3 truncate text-lg font-black text-slate-900">{plan.splits[0]?.splitName ?? plan.planName}</h2>
              <p className="mt-1 text-sm text-slate-500">{plan.splits[0]?.exercises.length ?? 0} exercícios · ~45 min</p>
            </div>
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white"><Play className="ml-0.5 h-7 w-7 fill-white" /></span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">{plan.splits[0]?.exercises.map((exercise) => <span key={exercise.name} className="rounded-full bg-[#f1f5fb] px-3 py-1.5 text-xs font-semibold text-slate-500">{exercise.name}</span>)}</div>
        </Link>
      )}

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-900">Recordes pessoais</h2>
        <Link href="/student/progress" className="text-sm font-bold text-blue-600">Ver evolução</Link>
      </div>
      <div className="mb-6 grid grid-cols-3 gap-3">
        {recordes.length === 0 ? <div className="app-card col-span-3 p-5 text-sm text-slate-500">Complete seus primeiros treinos para ver seus recordes.</div> : recordes.slice(0, 3).map(([name, load], i) => (
          <div key={name} className="app-card flex min-w-0 flex-col items-center p-4 text-center">
            <Trophy className={`mb-2 h-5 w-5 ${trophyColor(i)}`} />
            <span className="text-lg font-black text-slate-900">{formatarCarga(load)}</span>
            <span className="w-full truncate text-xs font-medium text-slate-500">{name}</span>
          </div>
        ))}
      </div>

      {/* Anamnese */}
      {!anamnese ? (
        <div className="app-card border-l-4 border-l-amber-500 p-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-50">
              <ClipboardList className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Complete sua anamnese</p>
              <p className="text-sm text-slate-500">Ajude seu professor a personalizar seu treino</p>
            </div>
          </div>
          <Link
            href="/student/anamnese"
            className="block w-full rounded-xl bg-blue-600 py-2.5 text-center text-sm font-bold text-white"
          >
            Preencher
          </Link>
        </div>
      ) : (
        <Link
          href="/student/anamnese"
          className="app-card flex items-center gap-3 border-l-4 border-l-blue-600 px-5 py-4"
        >
          <span className="text-xl">✅</span>
          <div>
            <p className="font-bold text-slate-900">Anamnese preenchida</p>
            <p className="text-xs text-slate-500">Toque para atualizar suas informações</p>
          </div>
        </Link>
      )}

    </AppShell>
  );
}
