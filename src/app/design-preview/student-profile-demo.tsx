"use client";

import { StudentBottomNav } from "@/components/student-bottom-nav";
import { ProfileWeekDay, StudentProfileView } from "@/components/student-profile-view";

const weekDays: ProfileWeekDay[] = [
  { short: "Seg", name: "Segunda", title: "Treino A", detail: "Peito e Tríceps", isTraining: true, completed: true },
  { short: "Ter", name: "Terça", title: "Treino B", detail: "Costas e Bíceps", isTraining: true, completed: true },
  { short: "Qua", name: "Quarta", title: "Descanso", detail: "Recuperação ativa", isTraining: false, completed: false },
  { short: "Qui", name: "Quinta", title: "Treino C", detail: "Pernas", isTraining: true, completed: false },
  { short: "Sex", name: "Sexta", title: "Treino D", detail: "Ombros e Abdômen", isTraining: true, completed: false },
  { short: "Sáb", name: "Sábado", title: "Descanso", detail: "Mobilidade", isTraining: false, completed: false },
  { short: "Dom", name: "Domingo", title: "Descanso", detail: "Recuperação", isTraining: false, completed: false },
];

export function StudentProfileDemo() {
  return (
    <main className="mx-auto flex h-[100dvh] w-full max-w-lg flex-col overflow-hidden bg-apex-background">
      <div className="flex-1 overflow-y-auto px-4 pb-6 pt-5">
        <StudentProfileView name="Rafael Mendes" memberSince="Março de 2026" totalWorkouts={87} streak={12} weeks={22} weekDays={weekDays} exportData={{ preview: true }} />
      </div>
      <StudentBottomNav active="profile" onNavigate={() => undefined} />
    </main>
  );
}
