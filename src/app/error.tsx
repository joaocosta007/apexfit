"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { clearOfflineData } from "@/lib/offline-db";
import { toast } from "sonner";

export default function AppError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("ApexFit server error", error);
    toast.error("Não foi possível carregar esta página", {
      id: "app-load-error",
      description: "Tente novamente em alguns instantes."
    });
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-apex-background px-5 py-10">
      <section className="w-full max-w-md rounded-card border border-slate-200 bg-apex-surface p-7 text-center shadow-floating">
        <div className="mb-6 flex justify-center">
          <BrandMark />
        </div>
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          <AlertTriangle className="h-7 w-7" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-2xl font-black tracking-tight text-slate-900">
          Não foi possível carregar esta página
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          O serviço está temporariamente indisponível. Tente novamente ou encerre a sessão para voltar ao login.
        </p>
        <div className="mt-6 grid gap-3">
          <Button type="button" onClick={reset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar novamente
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={async () => {
              try {
                await clearOfflineData();
              } catch {
                console.warn("Não foi possível limpar os dados offline durante o logout.");
              }
              await signOut({ callbackUrl: "/login" });
            }}
          >
            Sair e voltar ao login
          </Button>
        </div>
        {error.digest ? (
          <p className="mt-5 text-xs font-medium text-slate-400">Código do erro: {error.digest}</p>
        ) : null}
      </section>
    </main>
  );
}
