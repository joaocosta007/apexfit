import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { LoginForm } from "@/components/login-form";
import { UnaspLogo } from "@/components/unasp-logo";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions, roleHomePath } from "@/lib/auth";

export default async function LoginPage({
  searchParams
}: {
  searchParams?: { erro?: string; error?: string };
}) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role) {
    redirect(roleHomePath[session.user.role]);
  }

  const initialError =
    searchParams?.erro === "acesso-negado"
      ? "Acesso negado para esta área. Entre com o perfil correto."
      : searchParams?.error
        ? "Não foi possível autenticar. Verifique suas credenciais."
        : "";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center bg-slate-50 px-4 py-8">
      <div className="mb-8 flex flex-col items-center gap-5 text-center">
        <UnaspLogo className="max-h-24 max-w-64" priority />
        <BrandMark />
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <Badge className="w-fit">Acesso seguro</Badge>
          <CardTitle className="text-3xl">Entrar</CardTitle>
          <CardDescription>
            Acesse como Gerente, Professor ou Aluno para continuar seu acompanhamento na ApexFit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm initialError={initialError} />
        </CardContent>
      </Card>
    </main>
  );
}