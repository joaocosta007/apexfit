import { Role } from "@prisma/client";
import { AppShell } from "@/components/app-shell";
import { EmailVerificationBanner } from "@/components/email-verification-banner";
import { OfflineStatus } from "@/components/offline-status";
import { OfflineWorkoutBootstrap } from "@/components/offline-workout-bootstrap";
import { PushSubscriber } from "@/components/push-subscriber";
import { StudentBottomNav } from "@/components/student-bottom-nav";
import { StudentWeeklyWorkout } from "@/components/student-weekly-workout";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { diasDaSemana } from "@/lib/utils";
import { findExerciseByCatalogId, findExerciseByName } from "@/lib/exercise-catalog";
import type { OfflineWorkoutPlan } from "@/lib/offline-types";

function calculateStreak(dates: Date[]) {
  const uniqueDays = [...new Set(dates.map((date) => date.toISOString().slice(0, 10)))].sort().reverse();
  if (uniqueDays.length === 0) return 0;
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  if (uniqueDays[0] !== today && uniqueDays[0] !== yesterday) return 0;
  let streak = 1;
  for (let index = 1; index < uniqueDays.length; index++) {
    const previous = new Date(uniqueDays[index - 1]).getTime();
    const current = new Date(uniqueDays[index]).getTime();
    if ((previous - current) / 86_400_000 !== 1) break;
    streak += 1;
  }
  return streak;
}

export default async function StudentWorkoutTodayPage() {
  const session = await requireRole(Role.STUDENT);

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { emailVerified: true }
  });
  const emailVerified = !!currentUser?.emailVerified;
  const todayLabel = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    timeZone: "America/Sao_Paulo"
  }).format(new Date());

  const [plan, recentLogs] = await Promise.all([prisma.workoutPlan.findFirst({
    where: {
      studentId: session.user.id,
      isActive: true
    },
    orderBy: { createdAt: "desc" },
    include: {
      trainer: true,
      splits: {
        orderBy: { sortOrder: "asc" },
        include: {
          exercises: {
            orderBy: { createdAt: "asc" },
            include: {
              workoutLogs: {
                where: { studentId: session.user.id },
                orderBy: { date: "desc" },
                take: 1
              }
            }
          }
        }
      }
    }
  }), prisma.workoutLog.findMany({
    where: { studentId: session.user.id },
    orderBy: { date: "desc" },
    take: 200,
    select: { date: true }
  })]);
  const streak = calculateStreak(recentLogs.map((log) => log.date));

  const todayIndex = (() => {
    const jsIndex = new Date().getDay();
    return [6, 0, 1, 2, 3, 4, 5][jsIndex] ?? 0;
  })();

  const serializedPlan: OfflineWorkoutPlan | null = plan
    ? {
        id: plan.id,
        planName: plan.planName,
        trainerName: plan.trainer.name,
        trainingDays: plan.trainingDays,
        updatedAt: plan.updatedAt.toISOString(),
        splits: plan.splits.map((split) => ({
          id: split.id,
          splitName: split.splitName,
          sortOrder: split.sortOrder,
          exercises: split.exercises.map((exercise) => {
            const catalogItem = exercise.catalogId
              ? findExerciseByCatalogId(exercise.catalogId)
              : findExerciseByName(exercise.name);

            return {
              id: exercise.id,
              name: exercise.name,
              group: catalogItem?.group ?? "Exercício",
              sets: exercise.sets,
              reps: exercise.reps,
              loadKg: exercise.loadKg,
              restTime: exercise.restTime,
              lastLoad: exercise.workoutLogs[0]?.completedLoadKg ?? null,
              videoUrl: catalogItem?.videoUrl ?? null
            };
          })
        }))
      }
    : null;

  return (
    <AppShell title="Treino de Hoje" variant="student" userName={session.user.name} showPageHeader={false} hideStudentTopBar bottomNav={<StudentBottomNav active="workout" />}>
      <OfflineStatus />
      <OfflineWorkoutBootstrap plan={serializedPlan} streak={streak} />
      {!plan ? (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="font-semibold text-slate-900">Nenhum plano ativo encontrado.</p>
          <p className="mt-2 text-sm text-slate-500">Peça ao seu professor para montar seu treino na ApexFit.</p>
        </div>
      ) : null}

      {serializedPlan ? <StudentWeeklyWorkout plan={serializedPlan} todayIndex={todayIndex} todayLabel={todayLabel} streak={streak} notice={!emailVerified ? <EmailVerificationBanner /> : null} /> : null}

      <PushSubscriber />
    </AppShell>
  );
}
