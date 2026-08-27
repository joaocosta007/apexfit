"use client";

import { AppShell } from "@/components/app-shell";
import { ManagerDashboardView, type ManagerTrainerItem } from "@/components/manager-dashboard-view";

const trainers: ManagerTrainerItem[] = [
  { id: "trainer-1", name: "Marina Costa", email: "marina@apexfit.com", initials: "MC", students: 28, activePlans: 25, memberSince: "mar. 2026" },
  { id: "trainer-2", name: "Carlos Henrique", email: "carlos@apexfit.com", initials: "CH", students: 21, activePlans: 18, memberSince: "abr. 2026" },
  { id: "trainer-3", name: "Fernanda Lima", email: "fernanda@apexfit.com", initials: "FL", students: 17, activePlans: 16, memberSince: "mai. 2026" },
  { id: "trainer-4", name: "Ricardo Alves", email: "ricardo@apexfit.com", initials: "RA", students: 0, activePlans: 0, memberSince: "ago. 2026" }
];

export function ManagerDashboardDemo() {
  return (
    <AppShell title="Painel do Gerente" subtitle="Acompanhe a equipe, os alunos vinculados e a atividade da academia.">
      <ManagerDashboardView trainers={trainers} linkedStudents={66} activePlans={59} trainedThisWeek={48} preview />
    </AppShell>
  );
}
