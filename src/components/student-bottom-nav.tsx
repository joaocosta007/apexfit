"use client";

import Link from "next/link";
import { Dumbbell, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type StudentBottomNavProps = {
  active: "workout" | "progress";
};

export function StudentBottomNav({ active }: StudentBottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-lg">
        <Link
          href="/student/workouts/today"
          className={cn(
            "flex flex-1 flex-col items-center gap-1 py-3 text-xs font-semibold transition-colors",
            active === "workout" ? "text-primary" : "text-slate-400 hover:text-slate-600"
          )}
        >
          <Dumbbell className="h-5 w-5" />
          Treino
        </Link>
        <Link
          href="/student/progress"
          className={cn(
            "flex flex-1 flex-col items-center gap-1 py-3 text-xs font-semibold transition-colors",
            active === "progress" ? "text-primary" : "text-slate-400 hover:text-slate-600"
          )}
        >
          <TrendingUp className="h-5 w-5" />
          Evolução
        </Link>
      </div>
    </nav>
  );
}
