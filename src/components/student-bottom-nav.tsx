"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ChartNoAxesCombined, ClipboardCheck, Dumbbell, UserRound } from "lucide-react";
import { rememberStudentNavigation } from "@/components/student-page-transition";
import { cn } from "@/lib/utils";

type StudentBottomNavProps = {
  active: "workout" | "progress" | "assessments" | "profile";
  onNavigate?: (item: StudentNavKey) => void;
};

type StudentNavKey = StudentBottomNavProps["active"];

const items = [
  { href: "/student/workouts/today", icon: Dumbbell,             label: "Treino",     key: "workout"     },
  { href: "/student/progress",       icon: ChartNoAxesCombined,  label: "Progresso",  key: "progress"    },
  { href: "/student/assessments",    icon: ClipboardCheck,       label: "Avaliações", key: "assessments" },
  { href: "/student/dashboard",      icon: UserRound,            label: "Perfil",     key: "profile"     },
] as const;

const FILTRO_REFRACAO = "apex-glass-refracao";
const semInscricao = () => () => {};

/**
 * A refração (SVG dentro do backdrop-filter) só funciona bem no Chromium.
 * Safari e Firefox ficam com o vidro base.
 */
function suportaRefracao() {
  const marcas = (navigator as Navigator & { userAgentData?: { brands?: { brand: string }[] } }).userAgentData?.brands;
  const chromium = marcas?.some(({ brand }) => brand === "Chromium") ?? false;
  return chromium && CSS.supports("backdrop-filter", `url(#${FILTRO_REFRACAO})`);
}

export function StudentBottomNav({ active, onNavigate }: StudentBottomNavProps) {
  const refracao = useSyncExternalStore(semInscricao, suportaRefracao, () => false);
  // Move a lente no toque, sem esperar a próxima tela carregar. Vale só
  // enquanto "active" não mudar; depois a barra volta a seguir a rota.
  const [toque, setToque] = useState<{ de: StudentNavKey; para: StudentNavKey } | null>(null);
  const destino = toque && toque.de === active ? toque.para : active;
  const indiceLente = items.findIndex((item) => item.key === destino);

  return (
    <nav
      aria-label="Navegação principal do aluno"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-lg px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      {refracao ? <FiltroRefracao /> : null}
      <div
        className="glass-tabbar pointer-events-auto relative mx-auto flex h-16 max-w-[26rem] rounded-full p-1.5"
        data-refracao={refracao ? "true" : undefined}
      >
        <span
          aria-hidden="true"
          className="glass-tabbar-lens pointer-events-none absolute inset-y-1.5 left-1.5 w-[calc((100%-0.75rem)/4)] rounded-full"
          style={{ transform: `translateX(${indiceLente * 100}%)` }}
        />
        {items.map(({ href, icon: Icon, label, key }, index) => {
          const isActive = active === key;
          const emDestaque = destino === key;
          return (
            <Link
              key={key}
              href={href}
              prefetch
              aria-current={isActive ? "page" : undefined}
              onClick={(event) => {
                if (!isActive) {
                  const activeIndex = items.findIndex((item) => item.key === active);
                  rememberStudentNavigation(href, index > activeIndex ? "forward" : "backward");
                  setToque({ de: active, para: key });
                }
                if (onNavigate) {
                  event.preventDefault();
                  onNavigate(key);
                }
              }}
              className={cn(
                "tap-feedback focus-app relative z-10 flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-full transition-colors duration-fast ease-app",
                emDestaque ? "text-[color:var(--tab-fg-active)]" : "text-[color:var(--tab-fg)]"
              )}
            >
              <Icon
                aria-hidden="true"
                strokeWidth={emDestaque ? 2.4 : 2}
                className="h-[22px] w-[22px]"
              />
              <span className={cn("text-[11px] leading-none", emDestaque ? "font-bold" : "font-semibold")}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/** Mapa de deslocamento sutil usado como "lente" pelo vidro no Chromium. */
function FiltroRefracao() {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" className="absolute">
      <filter id={FILTRO_REFRACAO} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        {/* O Chrome descarta o blur() que vem depois do url(), então o desfoque fica aqui dentro. */}
        <feGaussianBlur in="SourceGraphic" stdDeviation="11" edgeMode="duplicate" result="desfoque" />
        <feTurbulence type="fractalNoise" baseFrequency="0.006 0.022" numOctaves={1} seed={4} result="ruido" />
        <feGaussianBlur in="ruido" stdDeviation="3" result="ruidoSuave" />
        <feDisplacementMap in="desfoque" in2="ruidoSuave" scale={14} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}
