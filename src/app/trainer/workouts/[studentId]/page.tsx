import Link from "next/link";
import { notFound } from "next/navigation";
import { PlanType, Role } from "@prisma/client";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import {
  adicionarDivisaoAction,
  adicionarExercicioAction,
  removerDivisaoAction,
  removerExercicioAction,
  salvarAvaliacaoAction,
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
import { exerciseCatalog, exerciseGroups } from "@/lib/exercise-catalog";

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
  const salvarAvaliacao = salvarAvaliacaoAction.bind(null, student.id);

  const assessments = await prisma.physicalAssessment.findMany({
    where: { studentId: student.id },
    orderBy: { date: "desc" }
  });

  const todayStr = new Date().toISOString().slice(0, 10);

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
                          <Label htmlFor={`catalogId-${split.id}`}>Exercício</Label>
                          <select
                            id={`catalogId-${split.id}`}
                            name="catalogId"
                            required
                            defaultValue=""
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <option value="" disabled>Selecione um exercício...</option>
                            {exerciseGroups.map((group) => (
                              <optgroup key={group} label={group}>
                                {exerciseCatalog
                                  .filter((e) => e.group === group)
                                  .map((e) => (
                                    <option key={e.id} value={e.id}>{e.name}</option>
                                  ))}
                              </optgroup>
                            ))}
                          </select>
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
        <Card>
          <CardHeader>
            <CardTitle>Avaliação Física</CardTitle>
            <CardDescription>Registre peso, medidas e percentual de gordura do aluno.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form action={salvarAvaliacao} className="space-y-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <h4 className="font-bold text-slate-900">Nova avaliação</h4>

              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input id="date" name="date" type="date" defaultValue={todayStr} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input id="weight" name="weight" type="number" step="0.1" min="0" placeholder="75.5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bodyFat">% Gordura</Label>
                  <Input id="bodyFat" name="bodyFat" type="number" step="0.1" min="0" max="100" placeholder="18.0" />
                </div>
              </div>

              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Medidas (cm)</p>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="chest">Peitoral</Label>
                  <Input id="chest" name="chest" type="number" step="0.1" min="0" placeholder="95" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waist">Cintura</Label>
                  <Input id="waist" name="waist" type="number" step="0.1" min="0" placeholder="80" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="abdomen">Abdômen</Label>
                  <Input id="abdomen" name="abdomen" type="number" step="0.1" min="0" placeholder="85" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hip">Quadril</Label>
                  <Input id="hip" name="hip" type="number" step="0.1" min="0" placeholder="98" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rightArm">Braço D.</Label>
                  <Input id="rightArm" name="rightArm" type="number" step="0.1" min="0" placeholder="35" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leftArm">Braço E.</Label>
                  <Input id="leftArm" name="leftArm" type="number" step="0.1" min="0" placeholder="34" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rightThigh">Coxa D.</Label>
                  <Input id="rightThigh" name="rightThigh" type="number" step="0.1" min="0" placeholder="56" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leftThigh">Coxa E.</Label>
                  <Input id="leftThigh" name="leftThigh" type="number" step="0.1" min="0" placeholder="55" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rightCalf">Panturrilha D.</Label>
                  <Input id="rightCalf" name="rightCalf" type="number" step="0.1" min="0" placeholder="37" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leftCalf">Panturrilha E.</Label>
                  <Input id="leftCalf" name="leftCalf" type="number" step="0.1" min="0" placeholder="36" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  placeholder="Ex.: aluno relatou boa disposição, aumentou carga no leg press..."
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <Button type="submit" className="w-full">Salvar avaliação</Button>
            </form>

            {assessments.length > 0 ? (
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900">Histórico</h4>
                {assessments.map((a) => (
                  <div key={a.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
                    <p className="mb-2 font-bold text-slate-900">
                      {a.date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })}
                    </p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-600">
                      {a.weight     != null && <span>Peso: <strong>{a.weight} kg</strong></span>}
                      {a.bodyFat    != null && <span>Gordura: <strong>{a.bodyFat}%</strong></span>}
                      {a.chest      != null && <span>Peitoral: <strong>{a.chest} cm</strong></span>}
                      {a.waist      != null && <span>Cintura: <strong>{a.waist} cm</strong></span>}
                      {a.abdomen    != null && <span>Abdômen: <strong>{a.abdomen} cm</strong></span>}
                      {a.hip        != null && <span>Quadril: <strong>{a.hip} cm</strong></span>}
                      {a.rightArm   != null && <span>Braço D.: <strong>{a.rightArm} cm</strong></span>}
                      {a.leftArm    != null && <span>Braço E.: <strong>{a.leftArm} cm</strong></span>}
                      {a.rightThigh != null && <span>Coxa D.: <strong>{a.rightThigh} cm</strong></span>}
                      {a.leftThigh  != null && <span>Coxa E.: <strong>{a.leftThigh} cm</strong></span>}
                      {a.rightCalf  != null && <span>Pant. D.: <strong>{a.rightCalf} cm</strong></span>}
                      {a.leftCalf   != null && <span>Pant. E.: <strong>{a.leftCalf} cm</strong></span>}
                    </div>
                    {a.notes && <p className="mt-2 italic text-slate-500">{a.notes}</p>}
                  </div>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}