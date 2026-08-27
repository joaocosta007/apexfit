import { BrandMark } from "@/components/brand-mark";
import { LogoutButton } from "@/components/logout-button";
import { StudentPageTransition } from "@/components/student-page-transition";
import { Bell } from "lucide-react";

type AppShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "student";
  bottomNav?: React.ReactNode;
  userName?: string | null;
  showPageHeader?: boolean;
  hideStudentTopBar?: boolean;
};

function initials(name?: string | null) {
  return (name ?? "Apex Fit").split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export function AppShell({ title, subtitle, children, action, variant = "default", bottomNav, userName, showPageHeader = true, hideStudentTopBar = false }: AppShellProps) {
  if (variant === "student") {
    return (
      <div className="mx-auto flex h-[100dvh] w-full max-w-lg flex-col overflow-hidden bg-apex-background shadow-floating">
        {!hideStudentTopBar && (
          <header className="flex h-20 flex-shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-4">
            <BrandMark compact />
            <div className="flex items-center gap-1.5">
              {action}
              <button type="button" aria-label="Notificações" className="tap-feedback focus-app relative flex h-10 w-10 items-center justify-center rounded-full text-apex-muted">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500" />
              </button>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-apex-blue text-sm font-bold text-white">
                {initials(userName)}
              </span>
              <LogoutButton />
            </div>
          </header>
        )}

        <div className={`flex-1 overflow-y-auto px-4 pt-5 ${bottomNav ? "pb-[calc(6.5rem+env(safe-area-inset-bottom))]" : "pb-6"}`}>
          <StudentPageTransition>
            <div className={showPageHeader ? "mb-5" : "sr-only"}>
              <h1 className="text-2xl font-black tracking-tight text-apex-ink">{title}</h1>
              {subtitle && <p className="mt-1 text-sm font-medium text-apex-muted">{subtitle}</p>}
            </div>
            {children}
          </StudentPageTransition>
        </div>

        {bottomNav}
      </div>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col bg-apex-background px-4 pb-24 pt-5 sm:px-6">
      <header className="mb-8 flex items-center justify-between gap-3 border-b border-slate-200/80 bg-white px-4 py-3 shadow-sm sm:rounded-[20px] sm:border">
        <BrandMark compact />
        <div className="flex items-center gap-2">{action}<LogoutButton /></div>
      </header>

      <section className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-apex-blue">Painel ApexFit</p>
          <h1 className="text-3xl font-black tracking-tight text-apex-ink">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-apex-muted">{subtitle}</p>}
        </div>
      </section>

      {children}
    </main>
  );
}
