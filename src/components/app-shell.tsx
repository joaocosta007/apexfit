import { BrandMark } from "@/components/brand-mark";
import { LogoutButton } from "@/components/logout-button";

type AppShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  action?: React.ReactNode;
};

export function AppShell({ title, subtitle, children, action }: AppShellProps) {
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
          <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
        </div>
        {action}
      </section>

      {children}
    </main>
  );
}