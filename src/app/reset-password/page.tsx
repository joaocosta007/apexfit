import { notFound } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { ResetPasswordForm } from "@/components/reset-password-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams;

  if (!token) notFound();

  const record = await prisma.passwordResetToken.findUnique({ where: { token } });

  if (!record || record.expiresAt < new Date()) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center bg-slate-50 px-4 py-8">
        <div className="mb-8 flex flex-col items-center gap-5 text-center">
          <BrandMark />
        </div>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl">Link expirado</CardTitle>
            <CardDescription>
              Este link de recuperação é inválido ou já expirou.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a
              href="/forgot-password"
              className="text-sm font-semibold text-primary underline"
            >
              Solicitar um novo link
            </a>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center bg-slate-50 px-4 py-8">
      <div className="mb-8 flex flex-col items-center gap-5 text-center">
        <BrandMark />
      </div>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Nova senha</CardTitle>
          <CardDescription>
            Escolha uma nova senha para sua conta. Mínimo de 6 caracteres.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm token={token} />
        </CardContent>
      </Card>
    </main>
  );
}
