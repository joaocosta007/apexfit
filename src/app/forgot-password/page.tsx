import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { BrandMark } from "@/components/brand-mark";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage({
  searchParams
}: {
  searchParams?: { enviado?: string };
}) {
  const enviado = searchParams?.enviado === "ok";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center bg-slate-50 px-4 py-8">
      <div className="mb-8 flex flex-col items-center gap-5 text-center">
        <BrandMark />
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Recuperar senha</CardTitle>
          <CardDescription>
            Informe seu e-mail e enviaremos um link para criar uma nova senha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {enviado ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                ✓ Se o e-mail estiver cadastrado, você receberá o link em instantes. Verifique também a caixa de spam.
              </div>
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar para o login
              </Link>
            </div>
          ) : (
            <ForgotPasswordForm />
          )}
        </CardContent>
      </Card>
    </main>
  );
}
