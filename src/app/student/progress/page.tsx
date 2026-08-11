import { Role } from "@prisma/client";
import { AppShell } from "@/components/app-shell";
import { LoadEvolutionChart } from "@/components/load-evolution-chart";
import { StudentBottomNav } from "@/components/student-bottom-nav";
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
      title="Evolução"
      variant="student"
      userName={session.user.name}
      bottomNav={<StudentBottomNav active="progress" />}
    >
      <div className="mb-5 grid grid-cols-3 rounded-2xl bg-[#eef2f8] p-1 text-center text-sm font-bold text-slate-500">
        <span className="rounded-xl px-2 py-2.5">Composição</span>
        <span className="rounded-xl px-2 py-2.5">Frequência</span>
        <span className="rounded-xl bg-white px-2 py-2.5 text-slate-900 shadow-sm">Cargas</span>
      </div>
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

    </AppShell>
  );
}
