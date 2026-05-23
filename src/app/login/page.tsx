import Image from "next/image";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { authOptions, roleHomePath } from "@/lib/auth";

export default async function LoginPage({
  searchParams
}: {
  searchParams?: { erro?: string; error?: string; cadastro?: string; verificado?: string; senha?: string };
}) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role) redirect(roleHomePath[session.user.role]);

  const initialError =
    searchParams?.erro === "acesso-negado"
      ? "Acesso negado para esta área. Entre com o perfil correto."
      : searchParams?.erro === "token-invalido"
        ? "Link de verificação inválido. Solicite um novo e-mail."
        : searchParams?.erro === "token-expirado"
          ? "Link de verificação expirado. Solicite um novo e-mail após entrar."
          : searchParams?.error
            ? "Não foi possível autenticar. Verifique suas credenciais."
            : "";

  const successMsg =
    searchParams?.senha === "redefinida"
      ? "Senha redefinida com sucesso! Faça login com a nova senha."
      : searchParams?.verificado === "ok"
        ? "E-mail confirmado! Faça login para continuar."
        : searchParams?.cadastro === "ok"
          ? "Conta criada! Verifique seu e-mail para confirmar o cadastro."
          : "";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12" style={{ background: "#EEF2F7" }}>
      <div className="w-full max-w-sm">
        {/* Cabeçalho institucional */}
        <div className="mb-8 flex flex-col items-center gap-5">

          {/* Logos CENAPE + UNASP */}
          <div className="flex items-center gap-4">
            <Image
              src="/cenape.png"
              alt="CENAPE"
              width={90}
              height={36}
              className="h-9 w-auto object-contain opacity-80"
            />
            <div className="h-8 w-px bg-slate-300" />
            <Image
              src="/unasp-logo.png"
              alt="UNASP"
              width={90}
              height={36}
              className="h-9 w-auto object-contain opacity-80"
            />
          </div>

          {/* Divisor com texto */}
          <div className="flex w-full items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">apresenta</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* ApexFit */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-[22px] bg-blue-600 shadow-lg shadow-blue-600/30">
              <Image src="/icon.svg" alt="ApexFit" width={48} height={48} />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">APEXFIT</h1>
            <p className="mt-1 text-sm text-slate-500">Seu treino, seu progresso</p>
          </div>
        </div>

        {/* Feedbacks */}
        {successMsg && (
          <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
            ✓ {successMsg}
          </div>
        )}

        <LoginForm initialError={initialError} />
      </div>
    </main>
  );
}
