import { BrandMark } from "@/components/brand-mark";
import { LogoutButton } from "@/components/logout-button";

type AppShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "student";
  bottomNav?: React.ReactNode;
};

export function AppShell({ title, subtitle, children, action, variant = "default", bottomNav }: AppShellProps) {
  if (variant === "student") {
    return (
      <div
        className="mx-auto flex w-full max-w-lg flex-col"
        style={{ background: "#EEF2F7", height: "100dvh" }}
      >
        {/* Cabeçalho fixo no topo */}
        <div className="flex-shrink-0 px-4 pb-3 pt-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">{title}</h1>
              {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
            </div>
            <div className="flex flex-shrink-0 items-center gap-2">
              {action}
              <LogoutButton />
            </div>
          </div>
        </div>

        {/* Conteúdo com scroll */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {children}
        </div>

        {/* Nav sempre visível no rodapé */}
        {bottomNav}
      </div>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col bg-slate-50 px-4 pb-24 pt-5">
      <header className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <BrandMark />
        <LogoutButton />
      </header>

      <section className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.28em] text-primary">ApexFit</p>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-slate-600">{subtitle}</p>}
        </div>
        {action}
      </section>

      {children}
    </main>
  );
}
