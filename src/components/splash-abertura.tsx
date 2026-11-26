"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Tempo mínimo de tela, para a animação de entrada não "piscar". */
const TEMPO_MINIMO_MS = 1100;
const NOME = "ApexFit";

/**
 * Tela de abertura do PWA: o halter do logo se monta (barra, colares e anilhas),
 * o nome aparece e o halter faz "repetições" até o app de verdade carregar.
 * Com `destino`, navega para lá enquanto a animação continua visível.
 */
export function SplashAbertura({ destino = "/" }: { destino?: string | null }) {
  const router = useRouter();

  useEffect(() => {
    if (!destino) return;
    router.prefetch(destino);
    const timer = window.setTimeout(() => router.replace(destino), TEMPO_MINIMO_MS);
    return () => window.clearTimeout(timer);
  }, [destino, router]);

  return (
    <main
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-apex-navy text-white"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Abrindo o ApexFit…</span>
      <div className="pointer-events-none absolute -right-24 top-16 h-72 w-72 rounded-full bg-apex-blue/25 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-28 bottom-24 h-64 w-64 rounded-full bg-apex-blue/10 blur-3xl" aria-hidden="true" />

      <div className="relative flex flex-col items-center" aria-hidden="true">
        <div className="splash-halter">
          <svg viewBox="40 176 432 160" className="h-auto w-44 overflow-visible" focusable="false">
            <rect className="splash-anilha splash-anilha-esq fill-white" x="52" y="192" width="64" height="128" rx="14" />
            <rect className="splash-colar splash-colar-esq fill-white/75" x="104" y="214" width="72" height="84" rx="10" />
            <rect className="splash-barra fill-white" x="164" y="234" width="184" height="44" rx="8" />
            <rect className="splash-colar splash-colar-dir fill-white/75" x="336" y="214" width="72" height="84" rx="10" />
            <rect className="splash-anilha splash-anilha-dir fill-white" x="396" y="192" width="64" height="128" rx="14" />
          </svg>
        </div>
        <span className="splash-sombra mt-3 h-2 w-28 rounded-full bg-black/25 blur-[3px]" />

        <p className="mt-7 flex text-[2rem] font-black tracking-tight">
          {NOME.split("").map((letra, indice) => (
            <span key={indice} className="splash-letra" style={{ animationDelay: `${560 + indice * 45}ms` }}>
              {letra}
            </span>
          ))}
        </p>

        <span className="splash-carregando relative mt-6 h-1 w-14 overflow-hidden rounded-full bg-white/15">
          <span className="splash-carregando-barra absolute inset-y-0 left-0 w-1/2 rounded-full bg-white/70" />
        </span>
      </div>
    </main>
  );
}
