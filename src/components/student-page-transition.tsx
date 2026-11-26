"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const navigationDirectionKey = "apexfit-student-navigation-direction";
const navigationTargetKey = "apexfit-student-navigation-target";
/** Duração da entrada mais folga; depois a classe sai para não reanimar. */
const DURACAO_ENTRADA_MS = 420;

export type StudentNavigationDirection = "forward" | "backward";

export function rememberStudentNavigation(target: string, direction: StudentNavigationDirection) {
  sessionStorage.setItem(navigationDirectionKey, direction);
  sessionStorage.setItem(navigationTargetKey, target);
}

type StudentPageTransitionProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Entrada suave do conteúdo ao trocar de aba do aluno. Cada página monta um
 * AppShell novo, então a animação roda na montagem, quando a barra registrou
 * (rememberStudentNavigation) que este é o destino do toque. A classe é aplicada
 * antes da pintura (useLayoutEffect), sem estado, para não piscar.
 */
export function StudentPageTransition({ children, className }: StudentPageTransitionProps) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const alvo = sessionStorage.getItem(navigationTargetKey);
    if (alvo !== pathname) return;

    const voltando = sessionStorage.getItem(navigationDirectionKey) === "backward";
    sessionStorage.removeItem(navigationTargetKey);
    sessionStorage.removeItem(navigationDirectionKey);

    const elemento = ref.current;
    if (!elemento) return;
    elemento.classList.add("tela-entrando");
    if (voltando) elemento.classList.add("tela-voltando");
    const timer = window.setTimeout(() => elemento.classList.remove("tela-entrando", "tela-voltando"), DURACAO_ENTRADA_MS);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return <div ref={ref} className={className}>{children}</div>;
}
