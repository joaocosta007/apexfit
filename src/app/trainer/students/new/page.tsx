import Link from "next/link";
import { Role } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import { adicionarAlunoAction } from "@/app/actions";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requireRole } from "@/lib/session";

export default async function NewStudentPage() {
  await requireRole(Role.TRAINER);

  return (
    <AppShell
      title="Adicionar Aluno"
      subtitle="Cadastre um novo aluno e crie o plano de treino em seguida."
      action={
        <Button asChild variant="outline" size="icon">
          <Link href="/trainer" aria-label="Voltar">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Novo aluno</CardTitle>
          <CardDescription>O aluno receberá acesso com e-mail e senha definidos abaixo.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={adicionarAlunoAction} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input id="name" name="name" placeholder="Ex.: João Pereira" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" placeholder="aluno@email.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha inicial</Label>
              <Input id="password" name="password" type="password" placeholder="Mínimo de 6 caracteres" required />
            </div>
            <Button type="submit" size="lg" className="w-full">
              Adicionar Aluno
            </Button>
          </form>
        </CardContent>
      </Card>
    </AppShell>
  );
}