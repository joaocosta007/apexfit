import { Role } from "@prisma/client";
import { AppShell } from "@/components/app-shell";
import { LoadEvolutionChart } from "@/components/load-evolution-chart";
import { StudentBottomNav } from "@/components/student-bottom-nav";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

export default async function StudentProgressPage() {
  const session = await requireRole(Role.STUDENT);

  const logs = await prisma.workoutLog.findMany({
    where: { studentId: session.user.id },
    orderBy: { date: "asc" },
    include: {
      exercise: {
        select: { name: true }
      }
    }
  });

  const grouped: Record<string, { date: string; load: number }[]> = {};

  for (const log of logs) {
    const name = log.exercise.name;
    if (!grouped[name]) grouped[name] = [];
    grouped[name].push({
      date: log.date.toISOString().slice(0, 10),
      load: log.completedLoadKg
    });
  }

  const exercises = Object.entries(grouped).map(([name, data]) => ({ name, data }));

  return (
    <AppShell
      title="Evolução de Carga"
      subtitle="Acompanhe seu progresso ao longo do tempo"
      variant="student"
    >
      {exercises.length === 0 ? (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="font-semibold text-slate-900">Nenhum registro ainda.</p>
          <p className="mt-2 text-sm text-slate-500">
            Complete treinos e registre a carga para ver sua evolução aqui.
          </p>
        </div>
      ) : (
        <LoadEvolutionChart exercises={exercises} />
      )}

      <StudentBottomNav active="progress" />
    </AppShell>
  );
}
