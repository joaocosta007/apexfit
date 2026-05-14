import Link from "next/link";
import { Role } from "@prisma/client";
import { ChevronRight, Plus, UsersRound } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { iniciais } from "@/lib/utils";

export default async function ManagerDashboardPage() {
  await requireRole(Role.MANAGER);

  const trainers = await prisma.user.findMany({
    where: { role: Role.TRAINER },
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          trainerStudents: true
        }
      }
    }
  });

  return (
    <AppShell
      title="Painel do Gerente"
      subtitle="Monitore professores, alunos ativos e evolução dos treinos."
      action={
        <Button asChild>
          <Link href="/manager/trainers/new">
            <Plus className="mr-2 h-4 w-4" />
            Professor
          </Link>
        </Button>
      }
    >
      <div className="mb-4 grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="pt-5">
            <p className="text-2xl font-black text-primary">{trainers.length}</p>
            <p className="text-xs text-slate-600">Professores</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-2xl font-black text-blue-700">
              {trainers.reduce((total, trainer) => total + trainer._count.trainerStudents, 0)}
            </p>
            <p className="text-xs text-slate-600">Alunos ativos</p>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-[0.22em] text-slate-500">Professores</h2>

        {trainers.map((trainer) => (
          <Link key={trainer.id} href={`/manager/${trainer.id}`} className="block">
            <Card className="transition-colors hover:border-primary/40">
              <CardContent className="flex items-center gap-4 pt-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-lg font-black text-primary">
                  {iniciais(trainer.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-bold text-slate-900">{trainer.name}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="secondary">
                      <UsersRound className="mr-1 h-3 w-3" />
                      {trainer._count.trainerStudents} alunos ativos
                    </Badge>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </AppShell>
  );
}