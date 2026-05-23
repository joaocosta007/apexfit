import { notFound } from "next/navigation";
import { registrarAlunoComConviteAction } from "@/app/actions";
import { UnaspLogo } from "@/components/unasp-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { prisma } from "@/lib/prisma";

type CadastroPageProps = {
  params: Promise<{ token: string }>;
  searchParams?: Promise<{ erro?: string }>;
};

export default async function CadastroPage({ params, searchParams }: CadastroPageProps) {
  const { token } = await params;
  const sp = await searchParams;

  const erroMsg =
    sp?.erro === "email-existente"
      ? "Este e-mail já está cadastrado. Use outro e-mail ou recupere sua senha."
      : sp?.erro === "link-invalido"
        ? "Este link de convite é inválido ou já foi utilizado."
        : "";

  const invite = await prisma.inviteToken.findUnique({
    where: { token },
    include: { trainer: { select: { name: true } } }
  });

  if (!invite || invite.used || invite.expiresAt < new Date()) {
    notFound();
  }

  const action = registrarAlunoComConviteAction.bind(null, token);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <UnaspLogo className="mx-auto h-16" priority />
          <h1 className="mt-5 text-2xl font-black text-slate-900">Criar sua conta</h1>
          <p className="mt-2 text-sm text-slate-600">
            Convite de{" "}
            <span className="font-semibold text-primary">{invite.trainer.name}</span>
          </p>
        </div>

        {erroMsg && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            ✕ {erroMsg}
          </div>
        )}

        <Card>
          <CardContent className="pt-5">
            <form action={action} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Seu nome completo"
                  required
                  autoComplete="name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>
              <Button type="submit" className="w-full">
                Criar conta
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-400">
          Link válido até{" "}
          {invite.expiresAt.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric"
          })}
        </p>
      </div>
    </main>
  );
}
