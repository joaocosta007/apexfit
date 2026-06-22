import Link from "next/link";
import { notFound } from "next/navigation";
import { Role } from "@prisma/client";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import {
  adicionarDivisaoTemplateAction,
  adicionarExercicioTemplateAction,
  excluirTemplateAction,
  removerDivisaoTemplateAction,
  removerExercicioTemplateAction,
  renomearTemplateAction
} from "@/app/actions";
import { AppShell } from "@/components/app-shell";
import { ConfirmButton } from "@/components/confirm-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { formatarCarga } from "@/lib/utils";
import { exerciseCatalog, exerciseGroups } from "@/lib/exercise-catalog";

type TemplatePageProps = {
  params: Promise<{ templateId: string }>;
};

export default async function TemplatePage({ params }: TemplatePageProps) {
  const { templateId } = await params;
  const session = await requireRole(Role.TRAINER);

  const template = await prisma.workoutTemplate.findFirst({
    where: { id: templateId, trainerId: session.user.id },
    include: {
      splits: {
        orderBy: { sortOrder: "asc" },
        include: {
          exercises: { orderBy: { createdAt: "asc" } }
        }
      }
    }
  });

  if (!template) notFound();

  const renomear = renomearTemplateAction.bind(null, templateId);
  const adicionarDivisao = adicionarDivisaoTemplateAction.bind(null, templateId);
  const excluir = excluirTemplateAction.bind(null, templateId);

  return (
    <AppShell
      title={template.name}
      subtitle="Monte as divisões e exercícios deste template."
      action={
        <Button asChild variant="outline" size="icon">
          <Link href="/trainer/templates" aria-label="Voltar">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
      }
    >
      <section className="space-y-5">

        {/* ── Renomear ── */}
        <Card>
          <CardHeader>
            <CardTitle>Nome do template</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={renomear} className="flex gap-2">
              <Input name="name" defaultValue={template.name} className="flex-1" />
              <Button type="submit" variant="secondary">Salvar</Button>
            </form>
          </CardContent>
        </Card>

        {/* ── Divisões ── */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>Divisões</CardTitle>
                <CardDescription>Adicione exercícios em cada divisão do template.</CardDescription>
              </div>
              <form action={adicionarDivisao}>
                <Button type="submit" variant="secondary" size="icon" aria-label="Adicionar divisão">
                  <Plus className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </CardHeader>
          <CardContent>
            {template.splits.length === 0 ? (
              <p className="text-sm text-slate-600">Nenhuma divisão criada.</p>
            ) : (
              <Tabs defaultValue={template.splits[0].id}>
                <div className="-mx-1 overflow-x-auto px-1 pb-2">
                  <TabsList>
                    {template.splits.map((split) => (
                      <TabsTrigger key={split.id} value={split.id}>
                        {split.splitName.replace("Treino ", "")}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {template.splits.map((split) => {
                  const addExercise = adicionarExercicioTemplateAction.bind(null, split.id, templateId);
                  const removeSplit = removerDivisaoTemplateAction.bind(null, split.id, templateId);

                  return (
                    <TabsContent key={split.id} value={split.id}>
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-black text-slate-900">{split.splitName}</h3>
                          <p className="text-sm text-slate-600">{split.exercises.length} exercícios</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Divisão {split.sortOrder + 1}</Badge>
                          {split.sortOrder >= 3 && (
                            <form action={removeSplit}>
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

                        {split.exercises.map((exercise) => {
                          const removeExercise = removerExercicioTemplateAction.bind(null, exercise.id, templateId);
                          return (
                            <div key={exercise.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                              <div className="flex items-start gap-3">
                                <div className="min-w-0 flex-1">
                                  <h4 className="font-bold text-slate-900">{exercise.name}</h4>
                                  <p className="mt-1 text-sm text-slate-600">
                                    {exercise.sets} séries • {exercise.reps} reps • {formatarCarga(exercise.loadKg)} • descanso {exercise.restTime}
                                  </p>
                                </div>
                                <form action={removeExercise}>
                                  <Button type="submit" variant="ghost" size="icon" aria-label="Remover exercício">
                                    <Trash2 className="h-4 w-4 text-red-300" />
                                  </Button>
                                </form>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <form action={addExercise} className="space-y-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
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
                  );
                })}
              </Tabs>
            )}
          </CardContent>
        </Card>

        {/* ── Excluir template ── */}
        <Card className="border-red-100">
          <CardContent className="pt-5">
            <h3 className="mb-1 font-bold text-slate-900">Excluir template</h3>
            <p className="mb-4 text-sm text-slate-500">
              Esta ação remove o template permanentemente. Os planos de alunos já criados a partir dele não são afetados.
            </p>
            <ConfirmButton
              action={excluir}
              message={`Tem certeza que deseja excluir o template "${template.name}"? Esta ação não pode ser desfeita.`}
              label="Excluir template"
              variant="destructive"
            />
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
