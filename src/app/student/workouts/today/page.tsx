import { Role } from "@prisma/client";
import { AppShell } from "@/components/app-shell";
import { EmailVerificationBanner } from "@/components/email-verification-banner";
import { PushSubscriber } from "@/components/push-subscriber";
import { StudentBottomNav } from "@/components/student-bottom-nav";
import { StudentWeeklyWorkout } from "@/components/student-weekly-workout";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { diasDaSemana } from "@/lib/utils";
import { findExerciseByCatalogId, findExerciseByName } from "@/lib/exercise-catalog";

export default async function StudentWorkoutTodayPage() {
  const session = await requireRole(Role.STUDENT);

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { emailVerified: true }
  });
  const emailVerified = !!currentUser?.emailVerified;

  const plan = await prisma.workoutPlan.findFirst({
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
  });

  const todayIndex = (() => {
    const jsIndex = new Date().getDay();
    return [6, 0, 1, 2, 3, 4, 5][jsIndex] ?? 0;
  })();

  const serializedPlan = plan
    ? {
        planName: plan.planName,
        trainerName: plan.trainer.name,
        trainingDays: plan.trainingDays,
        splits: plan.splits.map((split) => ({
          id: split.id,
          splitName: split.splitName,
          sortOrder: split.sortOrder,
          exercises: split.exercises.map((exercise) => ({
            id: exercise.id,
            name: exercise.name,
            sets: exercise.sets,
            reps: exercise.reps,
            loadKg: exercise.loadKg,
            restTime: exercise.restTime,
            lastLoad: exercise.workoutLogs[0]?.completedLoadKg ?? null,
            videoUrl: exercise.catalogId
              ? (findExerciseByCatalogId(exercise.catalogId)?.videoUrl ?? null)
              : (findExerciseByName(exercise.name)?.videoUrl ?? null)
          }))
        }))
      }
    : null;

  return (
    <AppShell title="Treino de Hoje" variant="student">
      {!emailVerified && <EmailVerificationBanner />}

      {!plan ? (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="font-semibold text-slate-900">Nenhum plano ativo encontrado.</p>
          <p className="mt-2 text-sm text-slate-500">Peça ao seu professor para montar seu treino na ApexFit.</p>
        </div>
      ) : null}

      {serializedPlan ? <StudentWeeklyWorkout plan={serializedPlan} todayIndex={todayIndex} /> : null}

      <PushSubscriber />
      <StudentBottomNav active="workout" />
    </AppShell>
  );
}