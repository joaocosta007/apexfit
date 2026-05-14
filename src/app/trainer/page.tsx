import Link from "next/link";
import { Role } from "@prisma/client";
import { ChevronRight, Dumbbell, UsersRound } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { FAB } from "@/components/fab";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { iniciais } from "@/lib/utils";
import { resumoDiasTreino } from "@/lib/workout";

export default async function TrainerDashboardPage() {
  const session = await requireRole(Role.TRAINER);

  const relations = await prisma.studentTrainer.findMany({
    where: { trainerId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      student: {
        include: {
          studentPlans: {
            where: {
              trainerId: session.user.id,
              isActive: true
            },
            include: {
              splits: {
                include: { exercises: true }
              }
            }
          }
        }
      }
    }
  });

  return (
    <AppShell title="Painel do Professor" subtitle="Gerencie alunos, planos de treino e progressão de cargas.">
      <div className="mb-4 grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="pt-5">
            <UsersRound className="mb-3 h-5 w-5 text-primary" />
            <p className="text-2xl font-black text-slate-900">{relations.length}</p>
            <p className="text-xs text-slate-600">Alunos vinculados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <Dumbbell className="mb-3 h-5 w-5 text-blue-700" />
            <p className="text-2xl font-black text-slate-900">
              {relations.reduce((total, relation) => total + (relation.student.studentPlans[0]?.splits.length ?? 0), 0)}
            </p>
            <p className="text-xs text-slate-600">Divisões criadas</p>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-[0.22em] text-slate-500">Meus alunos</h2>

        {relations.length === 0 ? (
          <Card>
            <CardContent className="pt-5">
              <p className="font-semibold text-slate-900">Nenhum aluno cadastrado ainda.</p>
              <p className="mt-2 text-sm text-slate-600">Toque no botão azul para adicionar seu primeiro aluno.</p>
            </CardContent>
          </Card>
        ) : null}

        {relations.map(({ student }) => {
          const plan = student.studentPlans[0];
          return (
            <Link key={student.id} href={`/trainer/workouts/${student.id}`} className="block">
              <Card className="transition-colors hover:border-primary/40">
                <CardContent className="flex items-center gap-4 pt-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-lg font-black text-blue-700">
                    {iniciais(student.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-bold text-slate-900">{student.name}</h3>
                    <p className="mt-1 truncate text-sm text-slate-600">{student.email}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge>{plan?.planName ?? "Criar plano"}</Badge>
                      <Badge variant="outline">{resumoDiasTreino(plan?.trainingDays)}</Badge>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400" />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </section>

      <FAB href="/trainer/students/new" label="Adicionar Aluno" />
    </AppShell>
  );
}