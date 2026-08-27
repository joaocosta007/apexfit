import { Check, Flame } from "lucide-react";
import { StudentProfileActions } from "@/components/student-profile-actions";
import { iniciais } from "@/lib/utils";

export type ProfileWeekDay = {
  short: string;
  name: string;
  title: string;
  detail: string;
  isTraining: boolean;
  completed: boolean;
};

type StudentProfileViewProps = {
  name: string;
  memberSince: string;
  totalWorkouts: number;
  streak: number;
  weeks: number;
  weekDays: ProfileWeekDay[];
  exportData: Record<string, unknown>;
};

export function StudentProfileView({ name, memberSince, totalWorkouts, streak, weeks, weekDays, exportData }: StudentProfileViewProps) {
  return (
    <>
      <header className="relative -mx-4 -mt-5 overflow-hidden bg-apex-navy px-5 pb-9 pt-10 text-white">
        <span aria-hidden="true" className="absolute -right-16 -top-12 h-48 w-48 rounded-full bg-white/[0.04]" />
        <span aria-hidden="true" className="absolute right-10 -top-8 h-28 w-28 rounded-full bg-apex-blue/10" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-blue-300 bg-blue-500 text-2xl font-black">{iniciais(name)}</div>
          <div className="min-w-0"><h1 className="truncate text-2xl font-black">{name}</h1><p className="mt-1 text-sm font-medium text-slate-400">Aluno desde {memberSince}</p></div>
        </div>
        <div className="relative mt-7 grid grid-cols-3 gap-3">
          <HeaderStat value={totalWorkouts} label="Treinos" />
          <HeaderStat value={<>{streak}<Flame className="inline h-4 w-4 text-orange-400" /></>} label="Sequência" />
          <HeaderStat value={weeks} label="Semanas" />
        </div>
      </header>

      <div className="space-y-4 pt-4">
        <section className="app-card p-5" aria-labelledby="weekly-plan-title">
          <p id="weekly-plan-title" className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">Plano semanal</p>
          <div className="mt-4 space-y-2.5">
            {weekDays.map((day) => (
              <div key={day.name} className={`flex min-h-16 items-center gap-3 rounded-2xl border px-3.5 py-2.5 ${day.completed ? "border-green-200 bg-green-100/80" : "border-transparent bg-apex-soft"}`}>
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-black ${day.completed ? "bg-apex-green text-white" : day.isTraining ? "bg-apex-navy text-white" : "bg-slate-200 text-slate-400"}`}>{day.short}</span>
                <div className="min-w-0 flex-1"><p className={`truncate text-sm font-extrabold ${day.isTraining ? "text-apex-navy" : "text-slate-400"}`}>{day.title}</p><p className="mt-0.5 truncate text-xs font-medium text-slate-400">{day.detail}</p></div>
                {day.completed && <Check className="h-5 w-5 shrink-0 text-apex-green" />}
              </div>
            ))}
          </div>
        </section>
        <StudentProfileActions exportData={exportData} />
      </div>
    </>
  );
}

function HeaderStat({ value, label }: { value: React.ReactNode; label: string }) {
  return <div className="rounded-2xl bg-white/[0.07] px-2 py-4 text-center"><p className="text-xl font-black">{value}</p><p className="mt-1 text-[11px] font-semibold text-slate-400">{label}</p></div>;
}
