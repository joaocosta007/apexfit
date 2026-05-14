import Link from "next/link";
import { Role } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import { adicionarProfessorAction } from "@/app/actions";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requireRole } from "@/lib/session";

export default async function NewTrainerPage() {
  await requireRole(Role.MANAGER);

  return (
    <AppShell
      title="Adicionar Professor"
      subtitle="Cadastre um professor para acompanhar alunos e montar planos de treino."
      action={
        <Button asChild variant="outline" size="icon">
          <Link href="/manager" aria-label="Voltar">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Novo professor</CardTitle>
          <CardDescription>O professor poderá entrar no sistema usando o e-mail e a senha inicial.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={adicionarProfessorAction} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input id="name" name="name" placeholder="Ex.: Carlos Almeida" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" placeholder="professor@email.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha inicial</Label>
              <Input id="password" name="password" type="password" placeholder="Mínimo de 6 caracteres" required />
            </div>
            <Button type="submit" size="lg" className="w-full">
              Adicionar Professor
            </Button>
          </form>
        </CardContent>
      </Card>
    </AppShell>
  );
}