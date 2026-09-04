import Link from "next/link";
import { notFound } from "next/navigation";
import { Role } from "@prisma/client";
import { Activity, ArrowLeft, CalendarDays, ClipboardCheck, Dumbbell, FileCheck2, UserRound, UsersRound } from "lucide-react";
import { removerProfessorAction } from "@/app/actions";
import { AppShell } from "@/components/app-shell";
import { ConfirmButton } from "@/components/confirm-button";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { iniciais } from "@/lib/utils";
import { resumoDiasTreino } from "@/lib/workout";

type TrainerMonitoringPageProps = { params: Promise<{ trainerId: string }> };

function activityLabel(date?: Date) {
  if (!date) return { label: "Sem treino registrado", tone: "bg-slate-100 text-slate-500", dot: "bg-slate-300" };
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (days <= 1) return { label: "Treinou recentemente", tone: "bg-emerald-50 text-emerald-700", dot: "bg-apex-green" };
  if (days <= 7) return { label: `Treinou há ${days} dias`, tone: "bg-blue-50 text-apex-blue", dot: "bg-apex-blue" };
  return { label: `Sem treino há ${days} dias`, tone: "bg-amber-50 text-amber-700", dot: "bg-amber-500" };
}

export default async function TrainerMonitoringPage({ params }: TrainerMonitoringPageProps) {
  const { trainerId } = await params;
  await requireRole(Role.MANAGER);

  const trainer = await prisma.user.findFirst({
    where: { id: trainerId, role: Role.TRAINER, isActive: true },
    include: {
      trainerStudents: {
        where: { student: { isActive: true } },
        orderBy: { student: { name: "asc" } },
        include: {
          student: {
            include: {
              anamnese: { select: { id: true } },
              workoutLogs: { where: { completed: true }, orderBy: { date: "desc" }, take: 1, select: { date: true } },
              studentPlans: {
                where: { trainerId, isActive: true },
                orderBy: { updatedAt: "desc" },
                take: 1,
                include: { splits: { orderBy: { sortOrder: "asc" }, include: { exercises: { select: { id: true } } } } }
              }
            }
          }
        }
      }
    }
  });

  if (!trainer) notFound();

  const students = trainer.trainerStudents.map(({ student }) => {
    const plan = student.studentPlans[0];
    return { ...student, plan, totalExercises: plan?.splits.reduce((total, split) => total + split.exercises.length, 0) ?? 0, lastWorkout: student.workoutLogs[0]?.date };
  });
  const activePlans = students.filter((student) => student.plan).length;
  const totalExercises = students.reduce((total, student) => total + student.totalExercises, 0);

  return (
    <AppShell
      title="Acompanhamento"
      subtitle="Veja os alunos, planos ativos e a atividade deste professor."
      action={<Link href="/manager" aria-label="Voltar ao painel" className="focus-app tap-feedback flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-apex-navy"><ArrowLeft className="h-5 w-5" /></Link>}
    >
      <section className="relative overflow-hidden rounded-[28px] bg-apex-navy px-5 py-6 text-white shadow-floating">
        <span aria-hidden="true" className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-white/[0.04]" />
        <div className="relative flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-apex-blue text-lg font-black">{iniciais(trainer.name)}</span>
          <div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-300">Professor</p><h2 className="truncate text-2xl font-black">{trainer.name}</h2><p className="truncate text-sm text-slate-400">{trainer.email}</p></div>
        </div>
        <div className="relative mt-5 grid grid-cols-3 gap-2">
          <TeacherMetric icon={UsersRound} value={students.length} label="Alunos" />
          <TeacherMetric icon={ClipboardCheck} value={activePlans} label="Planos ativos" />
          <TeacherMetric icon={Dumbbell} value={totalExercises} label="Exercícios" />
        </div>
      </section>

      <section className="mt-6" aria-labelledby="monitored-students-title">
        <div className="flex items-end justify-between gap-3"><div><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">Carteira do professor</p><h2 id="monitored-students-title" className="mt-1 text-2xl font-black text-apex-navy">Alunos acompanhados</h2></div><span className="text-sm font-bold text-apex-muted">{students.length}</span></div>
        {students.length ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {students.map((student) => {
              const activity = activityLabel(student.lastWorkout);
              return (
                <article key={student.id} className="app-card overflow-hidden p-4">
                  <div className="flex items-start gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-xs font-black text-apex-blue">{iniciais(student.name)}</span><div className="min-w-0 flex-1"><h3 className="truncate font-black text-apex-navy">{student.name}</h3><p className="truncate text-xs text-slate-400">{student.email}</p></div><span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${activity.dot}`} aria-hidden="true" /></div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className={`rounded-full px-3 py-1.5 text-[11px] font-extrabold ${activity.tone}`}><Activity className="mr-1 inline h-3.5 w-3.5" />{activity.label}</span>
                    <span className={`rounded-full px-3 py-1.5 text-[11px] font-extrabold ${student.anamnese ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}><FileCheck2 className="mr-1 inline h-3.5 w-3.5" />{student.anamnese ? "Anamnese preenchida" : "Sem anamnese"}</span>
                  </div>
                  {student.plan ? (
                    <div className="mt-4 rounded-2xl bg-apex-soft p-4">
                      <div className="flex items-center justify-between gap-2"><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Plano atual</p><p className="truncate font-black text-apex-navy">{student.plan.planName}</p></div><span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[10px] font-extrabold text-apex-blue">Ativo</span></div>
                      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-200/80 pt-3">
                        <div><p className="text-[10px] font-semibold text-slate-400"><CalendarDays className="mr-1 inline h-3 w-3" />Dias de treino</p><p className="mt-1 text-xs font-extrabold text-apex-navy">{resumoDiasTreino(student.plan.trainingDays)}</p></div>
                        <div><p className="text-[10px] font-semibold text-slate-400"><Dumbbell className="mr-1 inline h-3 w-3" />Estrutura</p><p className="mt-1 text-xs font-extrabold text-apex-navy">{student.plan.splits.length} divisões · {student.totalExercises} exercícios</p></div>
                      </div>
                    </div>
                  ) : <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center"><p className="text-sm font-extrabold text-slate-500">Nenhum plano ativo</p></div>}
                </article>
              );
            })}
          </div>
        ) : <div className="app-card mt-4 flex min-h-52 flex-col items-center justify-center px-6 text-center"><UserRound className="h-10 w-10 text-slate-300" /><p className="mt-3 font-black text-apex-navy">Nenhum aluno vinculado</p><p className="mt-1 max-w-sm text-sm text-apex-muted">Este professor ainda não acompanha alunos. Os novos vínculos aparecerão aqui.</p></div>}
      </section>

      <section className="mt-8 rounded-[24px] border border-red-100 bg-red-50/60 p-5">
        <h3 className="font-black text-apex-navy">Zona de perigo</h3>
        <p className="mb-4 mt-1 text-sm text-slate-500">Remover o professor exclui a conta, desvincula seus alunos e apaga os planos criados por ele. Esta ação não pode ser desfeita.</p>
        <ConfirmButton action={removerProfessorAction.bind(null, trainer.id)} message={`Tem certeza que deseja remover o professor ${trainer.name}? Todos os alunos serão desvinculados e os planos de treino serão excluídos.`} label="Remover professor" variant="destructive" />
      </section>
    </AppShell>
  );
}

function TeacherMetric({ icon: Icon, value, label }: { icon: typeof UsersRound; value: number; label: string }) {
  return <div className="rounded-2xl bg-white/[0.07] px-2 py-3 text-center"><Icon className="mx-auto h-4 w-4 text-blue-300" /><p className="mt-1 text-xl font-black">{value}</p><p className="text-[10px] font-semibold leading-tight text-slate-400">{label}</p></div>;
}
