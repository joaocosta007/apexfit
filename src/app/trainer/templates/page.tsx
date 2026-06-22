import Link from "next/link";
import { Role } from "@prisma/client";
import { ArrowLeft, BookTemplate, ChevronRight, Plus } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

export default async function TemplatesPage() {
  const session = await requireRole(Role.TRAINER);

  const templates = await prisma.workoutTemplate.findMany({
    where: { trainerId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      splits: {
        include: { _count: { select: { exercises: true } } }
      }
    }
  });

  return (
    <AppShell
      title="Templates de Treino"
      subtitle="Crie treinos-modelo para reutilizar com seus alunos."
      action={
        <Button asChild variant="outline" size="icon">
          <Link href="/trainer" aria-label="Voltar">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
      }
    >
      <section className="space-y-4">
        <Button asChild className="w-full">
          <Link href="/trainer/templates/new">
            <Plus className="mr-2 h-4 w-4" />
            Criar novo template
          </Link>
        </Button>

        {templates.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <BookTemplate className="mx-auto mb-3 h-10 w-10 text-slate-300" />
              <p className="font-semibold text-slate-700">Nenhum template criado ainda.</p>
              <p className="mt-1 text-sm text-slate-500">
                Crie um template para montar treinos padrão e aplicar a alunos com um clique.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {templates.map((template) => {
              const totalExercises = template.splits.reduce(
                (sum, s) => sum + s._count.exercises,
                0
              );
              return (
                <Link
                  key={template.id}
                  href={`/trainer/templates/${template.id}`}
                  className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-4 transition-colors hover:bg-slate-50"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-50">
                    <BookTemplate className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900">{template.name}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {template.splits.length} divisão{template.splits.length !== 1 ? "ões" : ""} •{" "}
                      {totalExercises} exercício{totalExercises !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 flex-shrink-0 text-slate-300" />
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </AppShell>
  );
}
