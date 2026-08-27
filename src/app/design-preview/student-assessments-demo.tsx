"use client";

import { StudentAssessmentData, StudentAssessmentsView } from "@/components/student-assessments-view";
import { StudentBottomNav } from "@/components/student-bottom-nav";

const previewAssessments: StudentAssessmentData[] = [
  { id: "assessment-1", date: "2026-08-12", weight: 82.4, bodyFat: 18.2, chest: 104, waist: 84, abdomen: 88, hip: 98, rightArm: 36, leftArm: 35.5, rightThigh: 61, leftThigh: 60.5, rightCalf: 39, leftCalf: 38.5, notes: "Boa evolução geral. Manter o plano atual e reforçar a hidratação." },
  { id: "assessment-2", date: "2026-07-15", weight: 83.6, bodyFat: 19, chest: 103, waist: 86, abdomen: 90, hip: 99, rightArm: 35.6, leftArm: 35, rightThigh: 60, leftThigh: 59.5, rightCalf: 38.5, leftCalf: 38, notes: null },
  { id: "assessment-3", date: "2026-06-17", weight: 84.8, bodyFat: 19.8, chest: 102, waist: 88, abdomen: 92, hip: 100, rightArm: 35.2, leftArm: 34.8, rightThigh: 59.5, leftThigh: 59, rightCalf: 38, leftCalf: 37.8, notes: null },
];

export function StudentAssessmentsDemo({ empty = false }: { empty?: boolean }) {
  return (
    <main className="mx-auto flex h-[100dvh] w-full max-w-lg flex-col overflow-hidden bg-apex-background">
      <div className="flex-1 overflow-y-auto px-4 pb-6 pt-5">
        <header className="relative -mx-4 -mt-5 mb-5 overflow-hidden bg-apex-navy px-5 pb-8 pt-10 text-white">
          <span className="absolute -right-12 -top-14 h-44 w-44 rounded-full bg-white/[0.04]" /><span className="absolute right-10 -top-9 h-28 w-28 rounded-full bg-apex-blue/10" />
          <p className="relative text-sm font-semibold tracking-wide text-slate-400">{empty ? "Aguardando primeira avaliação" : "Última avaliação: 12 ago. 2026"}</p><h1 className="relative mt-2 text-2xl font-black">Avaliações</h1>
        </header>
        <StudentAssessmentsView assessments={empty ? [] : previewAssessments} heightCm={184} />
      </div>
      <StudentBottomNav active="assessments" onNavigate={() => undefined} />
    </main>
  );
}
