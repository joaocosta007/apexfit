"use client";

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
  { href: "/student/dashboard",      icon: UserRound,            label: "Perfil",      key: "profile"     },
] as const;

export function StudentBottomNav({ active, onNavigate }: StudentBottomNavProps) {
  return (
    <nav aria-label="Navegação principal do aluno" className="safe-bottom fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-lg border-t border-border/80 bg-apex-surface/95 shadow-[0_-8px_24px_rgba(13,35,66,0.06)] backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-lg px-2">
        {items.map(({ href, icon: Icon, label, key }, index) => {
          const isActive = active === key;
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
                }
                if (onNavigate) {
                  event.preventDefault();
                  onNavigate(key);
                }
              }}
              className={cn(
                "tap-feedback focus-app group relative flex min-h-12 flex-1 flex-col items-center justify-center gap-1 rounded-2xl text-apex-muted transition-colors duration-fast ease-app",
                isActive ? "text-apex-blue" : "hover:bg-apex-soft hover:text-apex-ink"
              )}
            >
              <span className={cn("flex h-9 min-w-12 items-center justify-center rounded-[14px] transition-all duration-normal ease-app", isActive && "bg-blue-100")}>
                <Icon aria-hidden="true" className={cn("h-[22px] w-[22px] transition-transform duration-fast", isActive && "scale-105")} />
              </span>
              <span className="text-[11px] font-bold leading-none">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
