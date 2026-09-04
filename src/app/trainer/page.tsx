import { headers } from "next/headers";
import { Role } from "@prisma/client";
import { AppShell } from "@/components/app-shell";
import { TrainerDashboardView, TrainerStudentItem } from "@/components/trainer-dashboard-view";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { iniciais } from "@/lib/utils";
import { resumoDiasTreino } from "@/lib/workout";

type TrainerPageProps = { searchParams: Promise<{ invite?: string }> };
type StudentStatus = TrainerStudentItem["status"];

function statusFromDays(days: number | null): StudentStatus {
  if (days === null || days >= 5) return "danger";
  if (days >= 2) return "warning";
  return "active";
}

function lastWorkoutLabel(days: number | null) {
  if (days === null) return "Nunca treinou";
  if (days === 0) return "Treinou hoje";
  if (days === 1) return "Treinou ontem";
  return `Há ${days} dias`;
}

function dateKey(date: Date) {
  return date.toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
}

export default async function TrainerDashboardPage({ searchParams }: TrainerPageProps) {
  const session = await requireRole(Role.TRAINER);
  const { invite: inviteToken } = await searchParams;
  const now = new Date();
  const weekStart = new Date(now);
  const jsDay = weekStart.getDay();
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - (jsDay === 0 ? 6 : jsDay - 1));

  const relations = await prisma.studentTrainer.findMany({
    where: { trainerId: session.user.id, student: { isActive: true } },
    orderBy: { createdAt: "desc" },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
          anamnese: { select: { id: true } },
          studentPlans: { where: { trainerId: session.user.id, isActive: true }, take: 1, select: { planName: true, trainingDays: true } },
          workoutLogs: { orderBy: { date: "desc" }, take: 1, select: { date: true } },
        },
      },
    },
  });

  const studentIds = relations.map((relation) => relation.student.id);
  const weeklyLogs = studentIds.length ? await prisma.workoutLog.findMany({
    where: { studentId: { in: studentIds }, date: { gte: weekStart } },
    select: { studentId: true, date: true },
  }) : [];
  const weeklyDaysByStudent = new Map<string, Set<string>>();
  weeklyLogs.forEach((log) => {
    const dates = weeklyDaysByStudent.get(log.studentId) ?? new Set<string>();
    dates.add(dateKey(log.date));
    weeklyDaysByStudent.set(log.studentId, dates);
  });

  const statusOrder: Record<StudentStatus, number> = { danger: 0, warning: 1, active: 2 };
  const students: TrainerStudentItem[] = relations.map(({ student }) => {
    const lastWorkout = student.workoutLogs[0]?.date ?? null;
    const daysSinceLastWorkout = lastWorkout ? Math.max(0, Math.floor((now.getTime() - lastWorkout.getTime()) / 86_400_000)) : null;
    const plan = student.studentPlans[0] ?? null;
    return {
      id: student.id,
      name: student.name,
      email: student.email,
      initials: iniciais(student.name),
      status: statusFromDays(daysSinceLastWorkout),
      lastWorkoutLabel: lastWorkoutLabel(daysSinceLastWorkout),
      daysSinceLastWorkout,
      workoutsThisWeek: weeklyDaysByStudent.get(student.id)?.size ?? 0,
      planName: plan?.planName ?? null,
      trainingDaysLabel: plan ? resumoDiasTreino(plan.trainingDays) : "Nenhum dia definido",
      hasAnamnese: Boolean(student.anamnese),
    };
  }).sort((a, b) => statusOrder[a.status] - statusOrder[b.status] || a.name.localeCompare(b.name, "pt-BR"));

  let inviteUrl: string | null = null;
  if (inviteToken) {
    const headersList = await headers();
    const host = headersList.get("host") ?? "localhost:3000";
    inviteUrl = `${host.includes("localhost") ? "http" : "https"}://${host}/cadastro/${inviteToken}`;
  }

  return (
    <AppShell title="Painel do Professor" subtitle="Gerencie sua turma e acompanhe quem precisa de atenção.">
      <TrainerDashboardView students={students} inviteUrl={inviteUrl} />
    </AppShell>
  );
}
