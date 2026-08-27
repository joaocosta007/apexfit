import { Role } from "@prisma/client";
import { AppShell } from "@/components/app-shell";
import { ProfileWeekDay, StudentProfileView } from "@/components/student-profile-view";
import { StudentBottomNav } from "@/components/student-bottom-nav";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { diasDaSemana } from "@/lib/utils";
import { normalizarDiasTreino } from "@/lib/workout";

function dateKey(date: Date) {
  return date.toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
}

function startOfWeek(date = new Date()) {
  const start = new Date(date);
  const jsDay = start.getDay();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (jsDay === 0 ? 6 : jsDay - 1));
  return start;
}

function calculateStreak(dates: Date[]) {
  const unique = [...new Set(dates.map(dateKey))].sort().reverse();
  if (!unique.length) return 0;
  const today = dateKey(new Date());
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  if (unique[0] !== today && unique[0] !== dateKey(yesterdayDate)) return 0;
  let streak = 1;
  for (let index = 1; index < unique.length; index++) {
    const previous = new Date(`${unique[index - 1]}T12:00:00`).getTime();
    const current = new Date(`${unique[index]}T12:00:00`).getTime();
    if (Math.round((previous - current) / 86_400_000) === 1) streak += 1;
    else break;
  }
  return streak;
}

export default async function StudentDashboardPage() {
  const session = await requireRole(Role.STUDENT);
  const userId = session.user.id;
  const [user, plan, logs] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { name: true, createdAt: true } }),
    prisma.workoutPlan.findFirst({
      where: { studentId: userId, isActive: true },
      select: {
        planName: true,
        trainingDays: true,
        splits: { orderBy: { sortOrder: "asc" }, select: { splitName: true, exercises: { take: 2, select: { name: true } } } },
      },
    }),
    prisma.workoutLog.findMany({ where: { studentId: userId }, orderBy: { date: "desc" }, select: { date: true } }),
  ]);

  const name = user?.name ?? session.user.name ?? "Aluno";
  const createdAt = user?.createdAt ?? new Date();
  const uniqueWorkoutDays = new Set(logs.map((log) => dateKey(log.date)));
  const weekStart = startOfWeek();
  const completedThisWeek = new Set(logs.filter((log) => log.date >= weekStart).map((log) => dateKey(log.date)));
  const trainingDays = plan ? normalizarDiasTreino(plan.trainingDays) : [];

  const weekDays: ProfileWeekDay[] = diasDaSemana.map((day, index) => {
    const trainingPosition = trainingDays.findIndex((trainingDay) => trainingDay.indice === index);
    const split = trainingPosition >= 0 && plan?.splits.length ? plan.splits[trainingPosition % plan.splits.length] : null;
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    const completed = Boolean(split && completedThisWeek.has(dateKey(date)));
    return {
      short: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"][index],
      name: day.nome,
      title: split?.splitName ?? "Descanso",
      detail: split?.exercises.map((exercise) => exercise.name).join(" · ") || (split ? plan?.planName ?? "Treino programado" : "Recuperação"),
      isTraining: Boolean(split),
      completed,
    };
  });

  const weeks = Math.max(0, Math.floor((weekStart.getTime() - createdAt.getTime()) / (7 * 86_400_000)));
  const memberSince = createdAt.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }).replace(/^./, (letter) => letter.toUpperCase());
  const exportData = {
    profile: { name, memberSince: createdAt.toISOString(), totalWorkouts: uniqueWorkoutDays.size, currentStreak: calculateStreak(logs.map((log) => log.date)) },
    activePlan: plan ? { name: plan.planName, trainingDays: weekDays.filter((day) => day.isTraining).map((day) => day.name) } : null,
  };

  return (
    <AppShell title="Perfil" variant="student" userName={name} showPageHeader={false} hideStudentTopBar bottomNav={<StudentBottomNav active="profile" />}>
      <StudentProfileView name={name} memberSince={memberSince} totalWorkouts={uniqueWorkoutDays.size} streak={calculateStreak(logs.map((log) => log.date))} weeks={weeks} weekDays={weekDays} exportData={exportData} />
    </AppShell>
  );
}
