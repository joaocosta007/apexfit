"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SplashVisual } from "@/components/splash-visual";

/**
 * Página de abertura (/abrir, start_url do PWA): mostra o desenho da abertura
 * e já navega para `destino`. A duração mínima na tela é controlada pela
 * camada de abertura do layout (AberturaApp), não aqui.
 */
export function SplashAbertura({ destino = "/" }: { destino?: string | null }) {
  const router = useRouter();

  useEffect(() => {
    if (destino) router.replace(destino);
  }, [destino, router]);

  return <SplashVisual className="z-[100]" />;
}
