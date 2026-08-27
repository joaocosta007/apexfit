import { Role } from "@prisma/client";
import { AppShell } from "@/components/app-shell";
import { LoadEvolutionChart } from "@/components/load-evolution-chart";
import { StudentBottomNav } from "@/components/student-bottom-nav";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { indicesDiasTreino } from "@/lib/workout";

function startOfWeek(date = new Date()) {
  const start = new Date(date);
  const jsDay = start.getDay();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (jsDay === 0 ? 6 : jsDay - 1));
  return start;
}

function apexWeekDay(date: Date) {
  const jsDay = date.getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

export default async function StudentProgressPage() {
  const session = await requireRole(Role.STUDENT);
  const weekStart = startOfWeek();
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  const [logs, plan] = await Promise.all([
    prisma.workoutLog.findMany({
      where: { studentId: session.user.id },
      orderBy: { date: "asc" },
      select: { date: true, completedLoadKg: true, exercise: { select: { name: true } } },
    }),
    prisma.workoutPlan.findFirst({
      where: { studentId: session.user.id, isActive: true },
      select: { trainingDays: true },
    }),
  ]);

  const grouped: Record<string, { date: string; load: number }[]> = {};
  const completedWeekDays = new Set<number>();
  for (const log of logs) {
    const name = log.exercise.name;
    if (!grouped[name]) grouped[name] = [];
    grouped[name].push({ date: log.date.toISOString().slice(0, 10), load: log.completedLoadKg });
    if (log.date >= weekStart && log.date <= weekEnd) completedWeekDays.add(apexWeekDay(log.date));
  }

  const exercises = Object.entries(grouped).map(([name, data]) => ({ name, data }));
  const weekLabel = `${weekStart.toLocaleDateString("pt-BR", { day: "2-digit" })}–${weekEnd.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}`;

  return (
    <AppShell title="Progresso" variant="student" userName={session.user.name} showPageHeader={false} hideStudentTopBar bottomNav={<StudentBottomNav active="progress" />}>
      <header className="relative -mx-4 -mt-5 mb-5 overflow-hidden bg-apex-navy px-5 pb-8 pt-10 text-white">
        <span aria-hidden="true" className="absolute -right-10 -top-14 h-40 w-40 rounded-full bg-white/[0.04]" />
        <span aria-hidden="true" className="absolute right-12 -top-8 h-24 w-24 rounded-full bg-apex-blue/10" />
        <p className="relative text-sm font-semibold tracking-wide text-slate-400">Semana de {weekLabel}</p>
        <h1 className="relative mt-2 text-2xl font-black">Progresso</h1>
      </header>
      <LoadEvolutionChart exercises={exercises} completedWeekDays={[...completedWeekDays]} weeklyGoal={plan ? indicesDiasTreino(plan.trainingDays).length : 0} />
    </AppShell>
  );
}
