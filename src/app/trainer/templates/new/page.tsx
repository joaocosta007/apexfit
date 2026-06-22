import Link from "next/link";
import { Role } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import { criarTemplateAction } from "@/app/actions";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requireRole } from "@/lib/session";

export default async function NovoTemplatePage() {
  await requireRole(Role.TRAINER);

  return (
    <AppShell
      title="Novo Template"
      subtitle="Dê um nome ao template e depois adicione exercícios."
      action={
        <Button asChild variant="outline" size="icon">
          <Link href="/trainer/templates" aria-label="Voltar">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Nome do template</CardTitle>
          <CardDescription>
            Use um nome que descreva o objetivo, ex.: &ldquo;Hipertrofia ABC&rdquo;, &ldquo;Força Upper/Lower&rdquo;.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={criarTemplateAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                placeholder="Ex.: Hipertrofia ABC"
                autoFocus
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Criar template
            </Button>
          </form>
        </CardContent>
      </Card>
    </AppShell>
  );
}
