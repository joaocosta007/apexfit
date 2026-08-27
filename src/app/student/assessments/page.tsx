import { Role } from "@prisma/client";
import { AppShell } from "@/components/app-shell";
import { StudentAssessmentData, StudentAssessmentsView } from "@/components/student-assessments-view";
import { StudentBottomNav } from "@/components/student-bottom-nav";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

export default async function StudentAssessmentsPage() {
  const session = await requireRole(Role.STUDENT);
  const [assessments, anamnese] = await Promise.all([
    prisma.physicalAssessment.findMany({ where: { studentId: session.user.id }, orderBy: { date: "desc" } }),
    prisma.anamnese.findUnique({ where: { studentId: session.user.id }, select: { heightCm: true } }),
  ]);

  const serialized: StudentAssessmentData[] = assessments.map((assessment) => ({
    id: assessment.id,
    date: assessment.date.toISOString().slice(0, 10),
    weight: assessment.weight,
    bodyFat: assessment.bodyFat,
    chest: assessment.chest,
    waist: assessment.waist,
    abdomen: assessment.abdomen,
    hip: assessment.hip,
    rightArm: assessment.rightArm,
    leftArm: assessment.leftArm,
    rightThigh: assessment.rightThigh,
    leftThigh: assessment.leftThigh,
    rightCalf: assessment.rightCalf,
    leftCalf: assessment.leftCalf,
    notes: assessment.notes,
  }));
  const latestDate = serialized[0]
    ? new Date(`${serialized[0].date}T12:00:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
    : "Aguardando primeira avaliação";

  return (
    <AppShell title="Avaliações" variant="student" userName={session.user.name} showPageHeader={false} hideStudentTopBar bottomNav={<StudentBottomNav active="assessments" />}>
      <header className="relative -mx-4 -mt-5 mb-5 overflow-hidden bg-apex-navy px-5 pb-8 pt-10 text-white">
        <span aria-hidden="true" className="absolute -right-12 -top-14 h-44 w-44 rounded-full bg-white/[0.04]" />
        <span aria-hidden="true" className="absolute right-10 -top-9 h-28 w-28 rounded-full bg-apex-blue/10" />
        <p className="relative text-sm font-semibold tracking-wide text-slate-400">{serialized.length ? `Última avaliação: ${latestDate}` : latestDate}</p>
        <h1 className="relative mt-2 text-2xl font-black">Avaliações</h1>
      </header>
      <StudentAssessmentsView assessments={serialized} heightCm={anamnese?.heightCm ?? null} />
    </AppShell>
  );
}
