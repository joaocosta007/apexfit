"use client";

import Link from "next/link";
import { ClipboardList, Dumbbell, House, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type StudentBottomNavProps = {
  active: "dashboard" | "workout" | "progress" | "assessments";
};

const items = [
  { href: "/student/dashboard",      icon: House,           label: "Início",    key: "dashboard"   },
  { href: "/student/workouts/today", icon: Dumbbell,        label: "Treino",    key: "workout"     },
  { href: "/student/progress",       icon: TrendingUp,      label: "Evolução",  key: "progress"    },
  { href: "/student/assessments",    icon: ClipboardList,   label: "Avaliações", key: "assessments" },
] as const;

export function StudentBottomNav({ active }: StudentBottomNavProps) {
  return (
    <nav className="safe-bottom z-20 flex-shrink-0 border-t border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-lg">
        {items.map(({ href, icon: Icon, label, key }) => {
          const isActive = active === key;
          return (
            <Link
              key={key}
              href={href}
              className={cn(
                "relative flex flex-1 flex-col items-center justify-center gap-1 border-t-2 transition-colors",
                isActive ? "border-blue-600 bg-blue-50/40" : "border-transparent"
              )}
            >
              <Icon
                className={cn(
                  "h-[22px] w-[22px] transition-colors",
                  isActive ? "text-blue-600" : "text-slate-400"
                )}
              />
              <span className={cn(
                "text-[11px] font-bold transition-colors",
                isActive ? "text-blue-600" : "text-slate-400"
              )}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
