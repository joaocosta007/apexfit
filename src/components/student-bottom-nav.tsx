"use client";

import Link from "next/link";
import { ClipboardList, Dumbbell, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type StudentBottomNavProps = {
  active: "workout" | "progress" | "assessments";
};

const items = [
  { href: "/student/workouts/today", icon: Dumbbell,       label: "Treino",    key: "workout"     },
  { href: "/student/progress",       icon: TrendingUp,     label: "Evolução",  key: "progress"    },
  { href: "/student/assessments",    icon: ClipboardList,  label: "Avaliação", key: "assessments" },
] as const;

export function StudentBottomNav({ active }: StudentBottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-lg">
        {items.map(({ href, icon: Icon, label, key }) => (
          <Link
            key={key}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-3 text-xs font-semibold transition-colors",
              active === key ? "text-primary" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
