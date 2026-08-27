import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { authOptions, roleHomePath } from "@/lib/auth";
import { BrandMark } from "@/components/brand-mark";
import { PhaseOneDemo } from "@/app/design-preview/phase-one-demo";
import { StudentNavDemo } from "@/app/design-preview/student-nav-demo";
import { WorkoutExecutionDemo } from "@/app/design-preview/workout-execution-demo";
import { StudentProgressDemo } from "@/app/design-preview/student-progress-demo";
import { StudentProfileDemo } from "@/app/design-preview/student-profile-demo";
import { StudentAssessmentsDemo } from "@/app/design-preview/student-assessments-demo";
import { TrainerDashboardDemo } from "@/app/design-preview/trainer-dashboard-demo";
import { TrainerWorkoutDemo } from "@/app/design-preview/trainer-workout-demo";
import { ManagerDashboardDemo } from "@/app/design-preview/manager-dashboard-demo";
import { RouteSkeleton } from "@/components/route-skeleton";

export default async function LoginPage({
  searchParams
}: {
  searchParams?: Promise<{
    erro?: string;
    error?: string;
    cadastro?: string;
    verificado?: string;
    senha?: string;
    preview?: string;
  }>;
}) {
  const params = await searchParams;

  if (params?.preview === "design-system" && process.env.VERCEL_ENV !== "production") {
    return <PhaseOneDemo />;
  }

  if (params?.preview === "student-navigation" && process.env.VERCEL_ENV !== "production") {
    return <StudentNavDemo />;
  }

  if (params?.preview === "workout-execution" && process.env.VERCEL_ENV !== "production") {
    return <WorkoutExecutionDemo />;
  }

  if (params?.preview === "student-progress" && process.env.VERCEL_ENV !== "production") {
    return <StudentProgressDemo />;
  }

  if (params?.preview === "student-progress-empty" && process.env.VERCEL_ENV !== "production") {
    return <StudentProgressDemo empty />;
  }

  if (params?.preview === "student-profile" && process.env.VERCEL_ENV !== "production") {
    return <StudentProfileDemo />;
  }

  if (params?.preview === "student-assessments" && process.env.VERCEL_ENV !== "production") {
    return <StudentAssessmentsDemo />;
  }

  if (params?.preview === "student-assessments-empty" && process.env.VERCEL_ENV !== "production") {
    return <StudentAssessmentsDemo empty />;
  }

  if (params?.preview === "trainer-dashboard" && process.env.VERCEL_ENV !== "production") {
    return <TrainerDashboardDemo />;
  }

  if (params?.preview === "trainer-workout" && process.env.VERCEL_ENV !== "production") {
    return <TrainerWorkoutDemo />;
  }

  if (params?.preview === "manager-dashboard" && process.env.VERCEL_ENV !== "production") {
    return <ManagerDashboardDemo />;
  }

  if (params?.preview === "student-loading" && process.env.VERCEL_ENV !== "production") {
    return <RouteSkeleton variant="student" />;
  }

  if (params?.preview === "dashboard-loading" && process.env.VERCEL_ENV !== "production") {
    return <RouteSkeleton />;
  }

  const session = await getServerSession(authOptions);
  if (session?.user?.role) redirect(roleHomePath[session.user.role]);

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
