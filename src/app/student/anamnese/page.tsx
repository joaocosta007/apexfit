import { Role } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { salvarAnamneseAction } from "@/app/actions";
import { AppShell } from "@/components/app-shell";
import { StudentBottomNav } from "@/components/student-bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

const GOALS = [
  "Hipertrofia (ganho de massa muscular)",
  "Emagrecimento (perda de gordura)",
  "Força e potência",
  "Condicionamento físico",
  "Saúde e qualidade de vida",
  "Reabilitação",
];

const ACTIVITY_LEVELS = [
  { value: "sedentary",  label: "Sedentário — não pratico atividade física" },
  { value: "light",     label: "Levemente ativo — atividade 1–2x por semana" },
  { value: "moderate",  label: "Moderadamente ativo — atividade 3–4x por semana" },
  { value: "very",      label: "Muito ativo — atividade 5+ vezes por semana" },
];

export default async function StudentAnamnesePage({
  searchParams
}: {
  searchParams?: Promise<{ salvo?: string }>;
}) {
  const session = await requireRole(Role.STUDENT);
  const params = await searchParams;
  const salvo = params?.salvo === "ok";

  const anamnese = await prisma.anamnese.findUnique({
    where: { studentId: session.user.id }
  });

  return (
    <AppShell
      title="Anamnese"
      subtitle="Informe seu histórico de saúde para que seu professor monte o plano ideal."
      variant="student"
      action={
        <Button asChild variant="outline" size="icon">
          <Link href="/student/dashboard" aria-label="Voltar">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
      }
    >
      {salvo && (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          ✓ Anamnese salva com sucesso!
        </div>
      )}

      <form action={salvarAnamneseAction} className="space-y-5">
        {/* ── dados básicos ── */}
        <Card>
          <CardHeader>
            <CardTitle>Dados básicos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="age">Idade</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  min="10"
                  max="100"
                  placeholder="25"
                  defaultValue={anamnese?.age ?? ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heightCm">Altura (cm)</Label>
                <Input
                  id="heightCm"
                  name="heightCm"
                  type="number"
                  step="0.1"
                  min="100"
                  max="250"
                  placeholder="175"
                  defaultValue={anamnese?.heightCm ?? ""}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── objetivo ── */}
        <Card>
          <CardHeader>
            <CardTitle>Objetivo principal</CardTitle>
            <CardDescription>O que você quer alcançar com os treinos?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {GOALS.map((g) => (
                <label
                  key={g}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                >
                  <input
                    type="radio"
                    name="goal"
                    value={g}
                    defaultChecked={anamnese?.goal === g}
                    className="accent-primary"
                  />
                  <span className="text-sm font-medium text-slate-700">{g}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── nível de atividade ── */}
        <Card>
          <CardHeader>
            <CardTitle>Nível de atividade atual</CardTitle>
            <CardDescription>Antes de começar nesta academia, como era sua rotina?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {ACTIVITY_LEVELS.map(({ value, label }) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                >
                  <input
                    type="radio"
                    name="activityLevel"
                    value={value}
                    defaultChecked={anamnese?.activityLevel === value}
                    className="accent-primary"
                  />
                  <span className="text-sm font-medium text-slate-700">{label}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── saúde ── */}
        <Card>
          <CardHeader>
            <CardTitle>Saúde e restrições</CardTitle>
            <CardDescription>Estas informações são confidenciais e visíveis apenas para o seu professor.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="healthConditions">Condições de saúde</Label>
              <textarea
                id="healthConditions"
                name="healthConditions"
                rows={3}
                placeholder="Ex.: hipertensão, diabetes, problemas cardíacos, asma..."
                defaultValue={anamnese?.healthConditions ?? ""}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="injuries">Lesões ou restrições físicas</Label>
              <textarea
                id="injuries"
                name="injuries"
                rows={3}
                placeholder="Ex.: dor no joelho, hérnia de disco, ombro operado..."
                defaultValue={anamnese?.injuries ?? ""}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medications">Medicamentos de uso contínuo</Label>
              <textarea
                id="medications"
                name="medications"
                rows={2}
                placeholder="Ex.: losartana, metformina, omeprazol..."
                defaultValue={anamnese?.medications ?? ""}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="observations">Observações adicionais</Label>
              <textarea
                id="observations"
                name="observations"
                rows={2}
                placeholder="Qualquer outra informação relevante para o seu professor..."
                defaultValue={anamnese?.observations ?? ""}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" size="lg">
          Salvar anamnese
        </Button>
      </form>

      <StudentBottomNav active="dashboard" />
    </AppShell>
  );
}
