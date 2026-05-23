import Link from "next/link";
import { notFound } from "next/navigation";
import { Role } from "@prisma/client";
import { ArrowLeft, CalendarDays, Dumbbell } from "lucide-react";
import { removerProfessorAction } from "@/app/actions";
import { AppShell } from "@/components/app-shell";
import { ConfirmButton } from "@/components/confirm-button";
import { SparklinePlaceholder } from "@/components/sparkline-placeholder";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { resumoDiasTreino } from "@/lib/workout";

type TrainerMonitoringPageProps = {
  params: Promise<{ trainerId: string }>;
};

export default async function TrainerMonitoringPage({ params }: TrainerMonitoringPageProps) {
  const { trainerId } = await params;
  await requireRole(Role.MANAGER);

  const trainer = await prisma.user.findFirst({
    where: {
      id: trainerId,
      role: Role.TRAINER
    },
    include: {
      trainerStudents: {
        include: {
          student: {
            include: {
              studentPlans: {
                where: {
                  trainerId,
                  isActive: true
                },
                include: {
                  splits: {
                    include: {
                      exercises: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  if (!trainer) {
    notFound();
  }

  return (
    <AppShell
      title="Monitoramento"
      subtitle={`Professor ${trainer.name} • ${trainer.trainerStudents.length} alunos acompanhados`}
      action={
        <Button asChild variant="outline" size="icon">
          <Link href="/manager" aria-label="Voltar">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
      }
    >
      <section className="space-y-4">
        {trainer.trainerStudents.map(({ student }) => {

          const plan = student.studentPlans[0];
          const totalExercises = plan?.splits.reduce((total, split) => total + split.exercises.length, 0) ?? 0;

          return (
            <Card key={student.id}>
              <CardContent className="space-y-4 pt-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{student.name}</h2>
                    <p className="mt-1 text-sm text-slate-600">{student.email}</p>
                  </div>
                  <Badge>{plan?.planName ?? "Sem plano"}</Badge>
                </div>

                <SparklinePlaceholder />

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <CalendarDays className="mb-2 h-4 w-4 text-primary" />
                    <p className="text-xs text-slate-600">Dias de treino</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">{resumoDiasTreino(plan?.trainingDays)}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <Dumbbell className="mb-2 h-4 w-4 text-blue-700" />
                    <p className="text-xs text-slate-600">Resumo do plano</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {plan?.splits.length ?? 0} divisões • {totalExercises} exercícios
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        <Card className="border-red-100">
          <CardContent className="pt-5">
            <h3 className="mb-1 font-bold text-slate-900">Zona de perigo</h3>
            <p className="mb-4 text-sm text-slate-500">
              Remover o professor irá excluir a conta e desvincular todos os alunos associados a ele. Esta ação não pode ser desfeita.
            </p>
            <ConfirmButton
              action={removerProfessorAction.bind(null, trainer.id)}
              message={`Tem certeza que deseja remover o professor ${trainer.name}? Todos os alunos serão desvinculados e os planos de treino serão excluídos.`}
              label="Remover professor"
              variant="destructive"
            />
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}