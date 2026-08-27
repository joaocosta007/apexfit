import { BrandMark } from "@/components/brand-mark";

type RouteSkeletonProps = {
  variant?: "default" | "student";
};

const pulse = "motion-safe:animate-pulse bg-slate-200/80";

export function RouteSkeleton({ variant = "default" }: RouteSkeletonProps) {
  if (variant === "student") {
    return (
      <main className="mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col bg-apex-background" aria-busy="true" aria-label="Carregando conteúdo">
        <header className="flex h-20 items-center justify-between border-b border-slate-200/80 bg-white px-4">
          <BrandMark compact />
          <div className="flex gap-2"><Skeleton className="h-10 w-10 rounded-full" /><Skeleton className="h-10 w-10 rounded-full" /></div>
        </header>
        <div className="flex-1 space-y-5 px-4 py-5">
          <div><Skeleton className="h-7 w-44" /><Skeleton className="mt-2 h-4 w-64 max-w-full" /></div>
          <Skeleton className="h-44 w-full rounded-[28px]" />
          <div className="grid grid-cols-2 gap-3"><Skeleton className="h-28 rounded-card" /><Skeleton className="h-28 rounded-card" /></div>
          <Skeleton className="h-48 w-full rounded-card" />
        </div>
        <div className="grid h-20 grid-cols-4 gap-3 border-t border-slate-200 bg-white px-5 py-4"><Skeleton className="rounded-xl" /><Skeleton className="rounded-xl" /><Skeleton className="rounded-xl" /><Skeleton className="rounded-xl" /></div>
        <LoadingText />
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl bg-apex-background px-4 pb-24 pt-5 sm:px-6" aria-busy="true" aria-label="Carregando conteúdo">
      <header className="flex h-[66px] items-center justify-between rounded-[20px] border border-slate-200/80 bg-white px-4 shadow-sm"><BrandMark compact /><Skeleton className="h-10 w-20 rounded-xl" /></header>
      <div className="mt-8"><Skeleton className="h-3 w-28" /><Skeleton className="mt-3 h-9 w-64 max-w-full" /><Skeleton className="mt-3 h-4 w-96 max-w-full" /></div>
      <section className="mt-7 space-y-5">
        <Skeleton className="h-48 w-full rounded-[28px]" />
        <div className="grid gap-4 md:grid-cols-2"><Skeleton className="h-44 rounded-card" /><Skeleton className="h-44 rounded-card" /><Skeleton className="h-44 rounded-card" /><Skeleton className="h-44 rounded-card" /></div>
      </section>
      <LoadingText />
    </main>
  );
}

function Skeleton({ className }: { className: string }) {
  return <div aria-hidden="true" className={`${pulse} ${className}`} />;
}

function LoadingText() {
  return <span className="sr-only" role="status">Carregando, aguarde...</span>;
}
