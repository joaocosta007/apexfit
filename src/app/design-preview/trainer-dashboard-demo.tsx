"use client";

import { TrainerDashboardView, TrainerStudentItem } from "@/components/trainer-dashboard-view";
import { AppShell } from "@/components/app-shell";

const students: TrainerStudentItem[] = [
  { id: "student-1", name: "Lucas Andrade", email: "lucas@exemplo.com", initials: "LA", status: "danger", lastWorkoutLabel: "Há 7 dias", daysSinceLastWorkout: 7, workoutsThisWeek: 0, planName: null, trainingDaysLabel: "Nenhum dia definido", hasAnamnese: false },
  { id: "student-2", name: "Mariana Silva", email: "mariana@exemplo.com", initials: "MS", status: "warning", lastWorkoutLabel: "Há 3 dias", daysSinceLastWorkout: 3, workoutsThisWeek: 1, planName: "Hipertrofia ABC", trainingDaysLabel: "S • T • Q • S", hasAnamnese: true },
  { id: "student-3", name: "Rafael Mendes", email: "rafael@exemplo.com", initials: "RM", status: "active", lastWorkoutLabel: "Treinou hoje", daysSinceLastWorkout: 0, workoutsThisWeek: 3, planName: "Força e condicionamento", trainingDaysLabel: "S • Q • S", hasAnamnese: true },
  { id: "student-4", name: "Beatriz Costa", email: "bia@exemplo.com", initials: "BC", status: "active", lastWorkoutLabel: "Treinou ontem", daysSinceLastWorkout: 1, workoutsThisWeek: 2, planName: "Treino iniciante", trainingDaysLabel: "T • Q • S", hasAnamnese: false },
];

export function TrainerDashboardDemo() {
  return <AppShell title="Painel do Professor" subtitle="Gerencie sua turma e acompanhe quem precisa de atenção."><TrainerDashboardView students={students} inviteUrl="https://apexfit.app/cadastro/convite-exemplo" preview /></AppShell>;
}
