"use client";

import Link from "next/link";
import { ClipboardList, Dumbbell, LayoutDashboard, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type StudentBottomNavProps = {
  active: "dashboard" | "workout" | "progress" | "assessments";
};

const items = [
  { href: "/student/dashboard",      icon: LayoutDashboard, label: "Início",    key: "dashboard"   },
  { href: "/student/workouts/today", icon: Dumbbell,        label: "Treino",    key: "workout"     },
  { href: "/student/progress",       icon: TrendingUp,      label: "Evolução",  key: "progress"    },
  { href: "/student/assessments",    icon: ClipboardList,   label: "Avaliação", key: "assessments" },
] as const;

export function StudentBottomNav({ active }: StudentBottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-lg">
        {items.map(({ href, icon: Icon, label, key }) => {
          const isActive = active === key;
          return (
            <Link
              key={key}
              href={href}
              className="flex flex-1 flex-col items-center gap-1 py-3"
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  isActive ? "text-blue-600" : "text-slate-400"
                )}
              />
              <span className={cn(
                "text-[10px] font-semibold transition-colors",
                isActive ? "text-blue-600" : "text-slate-400"
              )}>
                {label}
              </span>
              {isActive && (
                <span className="h-1 w-1 rounded-full bg-blue-600" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
