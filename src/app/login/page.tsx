import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { authOptions, roleHomePath } from "@/lib/auth";
import { BrandMark } from "@/components/brand-mark";

export default async function LoginPage({
  searchParams
}: {
  searchParams?: Promise<{
    erro?: string;
    error?: string;
    cadastro?: string;
    verificado?: string;
    senha?: string;
  }>;
}) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role) redirect(roleHomePath[session.user.role]);

  const params = await searchParams;

  const initialError =
    params?.erro === "acesso-negado"
      ? "Acesso negado para esta área. Entre com o perfil correto."
      : params?.erro === "token-invalido"
        ? "Link de verificação inválido. Solicite um novo e-mail."
        : params?.erro === "token-expirado"
          ? "Link de verificação expirado. Solicite um novo e-mail após entrar."
          : params?.error
            ? "Não foi possível autenticar. Verifique suas credenciais."
            : "";

  const successMsg =
    params?.senha === "redefinida"
      ? "Senha redefinida com sucesso! Faça login com a nova senha."
      : params?.verificado === "ok"
        ? "E-mail confirmado! Faça login para continuar."
        : params?.cadastro === "ok"
          ? "Conta criada! Verifique seu e-mail para confirmar o cadastro."
          : "";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f5f7fb] px-5 py-10">
      <div className="w-full max-w-[430px]">
        <div className="mb-8 flex flex-col items-center text-center">
          <BrandMark />
          <p className="mt-3 text-sm font-semibold tracking-wide text-slate-500">CENAPE · UNASP · APEXFIT</p>
        </div>

        {/* Feedbacks */}
        {successMsg && (
          <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
            ✓ {successMsg}
          </div>
        )}

        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_2px_10px_rgba(15,23,42,0.09)] sm:p-8">
          <h1 className="mb-6 text-2xl font-black tracking-tight text-slate-900">Entrar na sua conta</h1>
          <LoginForm initialError={initialError} />
        </div>

        <p className="mt-7 text-center text-xs font-medium text-slate-400">Gestão inteligente de treinos</p>
      </div>
    </main>
  );
}
