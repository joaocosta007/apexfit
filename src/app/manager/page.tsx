import { Role } from "@prisma/client";
import { AppShell } from "@/components/app-shell";
import { ManagerDashboardView } from "@/components/manager-dashboard-view";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { iniciais } from "@/lib/utils";

export default async function ManagerDashboardPage() {
  await requireRole(Role.MANAGER);

  const startOfWeek = new Date();
  const day = startOfWeek.getDay();
  startOfWeek.setDate(startOfWeek.getDate() - (day === 0 ? 6 : day - 1));
  startOfWeek.setHours(0, 0, 0, 0);

  const [trainers, linkedStudents, activePlans, weeklyStudents] = await Promise.all([
    prisma.user.findMany({
      where: { role: Role.TRAINER, isActive: true },
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            trainerStudents: true,
            trainerPlans: { where: { isActive: true } }
          }
        }
      }
    }),
    prisma.studentTrainer.count(),
    prisma.workoutPlan.count({ where: { isActive: true } }),
    prisma.workoutLog.findMany({
      where: { completed: true, date: { gte: startOfWeek } },
      distinct: ["studentId"],
      select: { studentId: true }
    })
  ]);

  const trainerItems = trainers.map((trainer) => ({
    id: trainer.id,
    name: trainer.name,
    email: trainer.email,
    initials: iniciais(trainer.name),
    students: trainer._count.trainerStudents,
    activePlans: trainer._count.trainerPlans,
    memberSince: new Intl.DateTimeFormat("pt-BR", { month: "short", year: "numeric" }).format(trainer.createdAt).replace(" de ", " ")
  }));

  return (
    <AppShell title="Painel do Gerente" subtitle="Acompanhe a equipe, os alunos vinculados e a atividade da academia.">
      <ManagerDashboardView trainers={trainerItems} linkedStudents={linkedStudents} activePlans={activePlans} trainedThisWeek={weeklyStudents.length} />
    </AppShell>
  );
}
