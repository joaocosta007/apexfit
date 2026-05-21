import Link from "next/link";
import { notFound } from "next/navigation";
import { PlanType, Role } from "@prisma/client";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import {
  adicionarDivisaoAction,
  adicionarExercicioAction,
  removerDivisaoAction,
  removerExercicioAction,
  salvarPlanoTreinoAction
} from "@/app/actions";
import { AppShell } from "@/components/app-shell";
import { DayToggleFields } from "@/components/day-toggle-fields";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { formatarCarga } from "@/lib/utils";
import { indicesDiasTreino } from "@/lib/workout";

type WorkoutBuilderPageProps = {
  params: Promise<{ studentId: string }>;
};

export default async function WorkoutBuilderPage({ params }: WorkoutBuilderPageProps) {
  const { studentId } = await params;
  const session = await requireRole(Role.TRAINER);

  const relation = await prisma.studentTrainer.findUnique({
    where: {
      studentId_trainerId: {
        studentId,
        trainerId: session.user.id
      }
    },
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
                orderBy: { sortOrder: "asc" },
                include: {
                  exercises: {
                    orderBy: { createdAt: "asc" }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  if (!relation) {
    notFound();
  }

  const student = relation.student;
  const plan = student.studentPlans[0];
  const salvarPlano = salvarPlanoTreinoAction.bind(null, student.id);

  const planTypeConfig = {
    [PlanType.NORMAL]: {
      label: "Normal",
      hint: null,
      badge: "bg-slate-100 text-slate-700"
    },
    [PlanType.LOW_VOLUME]: {
      label: "Low Volume",
      hint: "Protocolo low volume: prefira 1–2 séries por exercício com alta intensidade.",
      badge: "bg-blue-100 text-blue-700"
    },
    [PlanType.STRENGTH]: {
      label: "Força",
      hint: "Protocolo de força: prefira 3–5 séries com cargas altas e baixas repetições (3–6 reps).",
      badge: "bg-amber-100 text-amber-700"
    }
  };

  return (
    <AppShell
      title="Builder de Treino"
      subtitle={`Monte o plano de ${student.name} com dias, divisões e exercícios.`}
      action={
        <Button asChild variant="outline" size="icon">
          <Link href="/trainer" aria-label="Voltar">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
      }
    >
      <section className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Configuração do plano</CardTitle>
            <CardDescription>Defina o nome do plano e os dias de treino da semana.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={salvarPlano} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="planName">Nome do plano</Label>
                <Input
                  id="planName"
                  name="planName"
                  defaultValue={plan?.planName ?? "Novo Plano de Treino"}
                  placeholder="Ex.: Hipertrofia Avançada"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="planType">Tipo de treino</Label>
                <select
                  id="planType"
                  name="planType"
                  defaultValue={plan?.planType ?? PlanType.NORMAL}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value={PlanType.NORMAL}>Normal</option>
                  <option value={PlanType.LOW_VOLUME}>Low Volume</option>
                  <option value={PlanType.STRENGTH}>Força</option>
                </select>
              </div>

              <DayToggleFields selectedIndices={indicesDiasTreino(plan?.trainingDays)} />

              <Button type="submit" className="w-full">
                Salvar plano
              </Button>
            </form>
          </CardContent>
        </Card>

        {!plan ? (
          <Card>
            <CardContent className="pt-5">
              <p className="font-semibold text-slate-900">Nenhum plano ativo encontrado.</p>
              <p className="mt-2 text-sm text-slate-600">
                Salve a configuração acima para criar automaticamente as divisões Treino A, Treino B e Treino C.
              </p>
            </CardContent>
          </Card>
        ) : null}

        {plan ? (
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>Divisões de treino</CardTitle>
                  <CardDescription>Use abas horizontais para alternar entre A, B, C e novas divisões.</CardDescription>
                </div>
                <form action={adicionarDivisaoAction.bind(null, plan.id, student.id)}>
                  <Button type="submit" variant="secondary" size="icon" aria-label="Adicionar divisão">
                    <Plus className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </CardHeader>
            <CardContent>
              {plan.splits.length === 0 ? (
                <p className="text-sm text-slate-600">Nenhuma divisão criada ainda.</p>
              ) : (
                <Tabs defaultValue={plan.splits[0].id}>
                  <div className="-mx-1 overflow-x-auto px-1 pb-2">
                    <TabsList>
                      {plan.splits.map((split) => (
                        <TabsTrigger key={split.id} value={split.id}>
                          {split.splitName.replace("Treino ", "")}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>

                  {plan.splits.map((split) => (
                    <TabsContent key={split.id} value={split.id}>
                      {planTypeConfig[plan.planType].hint && (
                        <div className={`mb-4 rounded-lg px-3 py-2 text-xs font-medium ${planTypeConfig[plan.planType].badge}`}>
                          {planTypeConfig[plan.planType].hint}
                        </div>
                      )}
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-black text-slate-900">{split.splitName}</h3>
                          <p className="text-sm text-slate-600">{split.exercises.length} exercícios cadastrados</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Divisão {split.sortOrder + 1}</Badge>
                          {split.sortOrder >= 3 && (
                            <form action={removerDivisaoAction.bind(null, split.id, student.id)}>
                              <Button type="submit" variant="ghost" size="icon" aria-label="Remover divisão">
                                <Trash2 className="h-4 w-4 text-red-400" />
                              </Button>
                            </form>
                          )}
                        </div>
                      </div>

                      <div className="mb-5 space-y-3">
                        {split.exercises.length === 0 ? (
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                            Nenhum exercício adicionado nesta divisão.
                          </div>
                        ) : null}

                        {split.exercises.map((exercise) => (
                          <div key={exercise.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-start gap-3">
                              <div className="min-w-0 flex-1">
                                <h4 className="font-bold text-slate-900">{exercise.name}</h4>
                                <p className="mt-1 text-sm text-slate-600">
                                  {exercise.sets} séries • {exercise.reps} reps • {formatarCarga(exercise.loadKg)} • descanso {exercise.restTime}
                                </p>
                              </div>
                              <form action={removerExercicioAction.bind(null, exercise.id, student.id)}>
                                <Button type="submit" variant="ghost" size="icon" aria-label="Remover exercício">
                                  <Trash2 className="h-4 w-4 text-red-300" />
                                </Button>
                              </form>
                            </div>
                          </div>
                        ))}
                      </div>

                      <form action={adicionarExercicioAction.bind(null, split.id, student.id)} className="space-y-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
                        <h4 className="font-bold text-slate-900">Adicionar exercício</h4>
                        <div className="space-y-2">
                          <Label htmlFor={`name-${split.id}`}>Nome do Exercício</Label>
                          <Input id={`name-${split.id}`} name="name" placeholder="Ex.: Supino Reto" required />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor={`sets-${split.id}`}>Séries</Label>
                            <Input id={`sets-${split.id}`} name="sets" type="number" min="1" placeholder="4" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`reps-${split.id}`}>Reps</Label>
                            <Input id={`reps-${split.id}`} name="reps" type="number" min="1" placeholder="12" required />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor={`load-${split.id}`}>Carga (kg)</Label>
                            <Input id={`load-${split.id}`} name="loadKg" type="number" min="0" step="0.5" placeholder="30" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`rest-${split.id}`}>Descanso</Label>
                            <Input id={`rest-${split.id}`} name="restTime" placeholder="60s" required />
                          </div>
                        </div>
                        <Button type="submit" className="w-full">
                          Adicionar exercício
                        </Button>
                      </form>
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </CardContent>
          </Card>
        ) : null}
      </section>
    </AppShell>
  );
}