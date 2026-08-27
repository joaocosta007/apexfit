"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Bell, BookTemplate, ChevronRight, Dumbbell, Link2, Plus, Search, UsersRound } from "lucide-react";
import { enviarLembreteAction, gerarLinkCadastroAction } from "@/app/actions";
import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

export type TrainerStudentItem = {
  id: string;
  name: string;
  email: string;
  initials: string;
  status: "active" | "warning" | "danger";
  lastWorkoutLabel: string;
  daysSinceLastWorkout: number | null;
  workoutsThisWeek: number;
  planName: string | null;
  trainingDaysLabel: string;
  hasAnamnese: boolean;
};

type TrainerDashboardViewProps = {
  students: TrainerStudentItem[];
  inviteUrl: string | null;
  preview?: boolean;
};

const statusStyles = {
  active: { avatar: "bg-green-100 text-green-700", badge: "bg-green-100 text-green-700", dot: "bg-apex-green" },
  warning: { avatar: "bg-amber-100 text-amber-700", badge: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  danger: { avatar: "bg-red-100 text-red-600", badge: "bg-red-100 text-red-600", dot: "bg-red-500" },
};

export function TrainerDashboardView({ students, inviteUrl, preview = false }: TrainerDashboardViewProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "attention" | "active">("all");
  const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");
  const filteredStudents = useMemo(() => students.filter((student) => {
    const matchesSearch = !normalizedSearch || student.name.toLocaleLowerCase("pt-BR").includes(normalizedSearch) || student.email.toLocaleLowerCase("pt-BR").includes(normalizedSearch);
    const matchesFilter = filter === "all" || (filter === "attention" ? student.status !== "active" || !student.planName : student.status === "active");
    return matchesSearch && matchesFilter;
  }), [students, normalizedSearch, filter]);

  const trainedThisWeek = students.filter((student) => student.workoutsThisWeek > 0).length;
  const needAttention = students.filter((student) => student.status === "danger" || !student.planName).length;

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[28px] bg-apex-navy px-5 py-6 text-white shadow-floating">
        <span aria-hidden="true" className="absolute -right-14 -top-16 h-44 w-44 rounded-full bg-white/[0.04]" />
        <span aria-hidden="true" className="absolute right-14 -top-10 h-28 w-28 rounded-full bg-apex-blue/10" />
        <div className="relative"><p className="text-sm font-semibold text-slate-400">Acompanhamento da turma</p><h2 className="mt-1 text-2xl font-black">Visão geral dos alunos</h2></div>
        <div className="relative mt-5 grid grid-cols-3 gap-3">
          <SummaryStat icon={UsersRound} value={students.length} label="Alunos" />
          <SummaryStat icon={Dumbbell} value={trainedThisWeek} label="Treinaram" />
          <SummaryStat icon={AlertTriangle} value={needAttention} label="Atenção" alert={needAttention > 0} />
        </div>
      </section>

      <section className="grid grid-cols-3 gap-3" aria-label="Ações rápidas">
        <QuickLink href="/trainer/students/new" icon={Plus} label="Novo aluno" preview={preview} />
        <InviteDrawer inviteUrl={inviteUrl} preview={preview} />
        <QuickLink href="/trainer/templates" icon={BookTemplate} label="Templates" preview={preview} />
      </section>

      <section aria-labelledby="students-title">
        <div className="flex items-end justify-between gap-3"><div><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">Gestão da turma</p><h2 id="students-title" className="mt-1 text-2xl font-black text-apex-navy">Meus alunos</h2></div><span className="text-sm font-bold text-apex-muted">{filteredStudents.length} de {students.length}</span></div>
        <div className="relative mt-4"><Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nome ou e-mail" aria-label="Buscar alunos" className="focus-app h-13 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-semibold text-apex-navy shadow-card placeholder:text-slate-400" /></div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filtrar alunos">
          <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>Todos</FilterButton>
          <FilterButton active={filter === "attention"} onClick={() => setFilter("attention")}>Precisam de atenção</FilterButton>
          <FilterButton active={filter === "active"} onClick={() => setFilter("active")}>Ativos</FilterButton>
        </div>

        {filteredStudents.length ? (
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {filteredStudents.map((student) => <StudentCard key={student.id} student={student} preview={preview} />)}
          </div>
        ) : (
          <div className="app-card mt-4 flex min-h-48 flex-col items-center justify-center px-6 text-center"><UsersRound className="h-9 w-9 text-slate-300" /><p className="mt-3 font-black text-apex-navy">Nenhum aluno encontrado</p><p className="mt-1 text-sm text-apex-muted">Tente mudar a busca ou o filtro selecionado.</p></div>
        )}
      </section>
    </div>
  );
}

function SummaryStat({ icon: Icon, value, label, alert = false }: { icon: typeof UsersRound; value: number; label: string; alert?: boolean }) {
  return <div className="rounded-2xl bg-white/[0.07] px-2 py-3.5 text-center"><Icon className={`mx-auto h-4 w-4 ${alert ? "text-orange-400" : "text-blue-300"}`} /><p className="mt-1 text-xl font-black">{value}</p><p className="text-[10px] font-semibold text-slate-400">{label}</p></div>;
}

function QuickLink({ href, icon: Icon, label, preview }: { href: string; icon: typeof Plus; label: string; preview: boolean }) {
  return <Link href={href} onClick={(event) => { if (preview) event.preventDefault(); }} className="focus-app tap-feedback app-card flex min-h-24 flex-col items-center justify-center gap-2 px-2 text-center"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100"><Icon className="h-5 w-5 text-apex-blue" /></span><span className="text-xs font-extrabold text-apex-navy">{label}</span></Link>;
}

function InviteDrawer({ inviteUrl, preview }: { inviteUrl: string | null; preview: boolean }) {
  return (
    <Drawer>
      <DrawerTrigger asChild><button type="button" className="focus-app tap-feedback app-card flex min-h-24 flex-col items-center justify-center gap-2 px-2 text-center"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100"><Link2 className="h-5 w-5 text-apex-blue" /></span><span className="text-xs font-extrabold text-apex-navy">Convidar</span></button></DrawerTrigger>
      <DrawerContent>
        <DrawerHeader><DrawerTitle>Convidar novo aluno</DrawerTitle><DrawerDescription>Gere um link válido por sete dias e envie para o aluno concluir o próprio cadastro.</DrawerDescription></DrawerHeader>
        <div className="px-6 pb-6">
          {inviteUrl ? <div className="rounded-2xl border border-green-200 bg-green-50 p-4"><p className="text-sm font-extrabold text-green-700">Link pronto para compartilhar</p><p className="mt-2 truncate rounded-xl border border-green-200 bg-white px-3 py-2 font-mono text-xs text-apex-muted">{inviteUrl}</p><div className="mt-3"><CopyButton text={inviteUrl} /></div></div> : <div className="rounded-2xl bg-apex-soft p-4 text-sm font-medium leading-relaxed text-apex-muted">O link conecta automaticamente o aluno ao seu perfil de professor.</div>}
        </div>
        <DrawerFooter>
          <form action={preview ? undefined : gerarLinkCadastroAction} onSubmit={(event) => { if (preview) event.preventDefault(); }}><Button type="submit" className="w-full"><Link2 className="mr-2 h-4 w-4" />{inviteUrl ? "Gerar outro link" : "Gerar link de convite"}</Button></form>
          <DrawerClose asChild><Button variant="ghost">Fechar</Button></DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" aria-pressed={active} onClick={onClick} className={`focus-app shrink-0 rounded-full px-4 py-2 text-xs font-extrabold transition-colors ${active ? "bg-apex-navy text-white" : "border border-slate-200 bg-white text-apex-muted"}`}>{children}</button>;
}

function StudentCard({ student, preview }: { student: TrainerStudentItem; preview: boolean }) {
  const style = statusStyles[student.status];
  return (
    <article className="app-card overflow-hidden p-4">
      <div className="flex gap-3"><span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-black ${style.avatar}`}>{student.initials}</span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h3 className="truncate text-base font-black text-apex-navy">{student.name}</h3><span className={`h-2 w-2 shrink-0 rounded-full ${style.dot}`} /></div><p className="mt-0.5 truncate text-xs font-medium text-slate-400">{student.email}</p></div></div>
      <div className="mt-3 flex flex-wrap gap-2"><span className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold ${style.badge}`}>{student.lastWorkoutLabel}</span><span className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold ${student.planName ? "bg-blue-100 text-apex-blue" : "bg-amber-100 text-amber-700"}`}>{student.planName ?? "Ficha pendente"}</span><span className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold ${student.hasAnamnese ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>{student.hasAnamnese ? "Anamnese preenchida" : "Anamnese pendente"}</span></div>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3"><div><p className="text-xs font-bold text-apex-muted">{student.workoutsThisWeek} {student.workoutsThisWeek === 1 ? "treino" : "treinos"} esta semana</p><p className="mt-0.5 text-[11px] text-slate-400">{student.trainingDaysLabel}</p></div><div className="flex items-center gap-2">{student.status === "danger" && <ReminderDrawer student={student} preview={preview} />}<Link href={`/trainer/workouts/${student.id}`} onClick={(event) => { if (preview) event.preventDefault(); }} aria-label={`Abrir ficha de ${student.name}`} className="focus-app flex h-10 w-10 items-center justify-center rounded-xl bg-apex-navy text-white"><ChevronRight className="h-5 w-5" /></Link></div></div>
    </article>
  );
}

function ReminderDrawer({ student, preview }: { student: TrainerStudentItem; preview: boolean }) {
  const reminderAction = enviarLembreteAction.bind(null, student.id, student.daysSinceLastWorkout ?? 0);
  return (
    <Drawer>
      <DrawerTrigger asChild><button type="button" aria-label={`Lembrar ${student.name}`} className="focus-app flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500"><Bell className="h-5 w-5" /></button></DrawerTrigger>
      <DrawerContent>
        <DrawerHeader><DrawerTitle>Enviar lembrete</DrawerTitle><DrawerDescription>{student.name} não registra treino {student.daysSinceLastWorkout == null ? "desde que entrou" : `há ${student.daysSinceLastWorkout} dias`}. Envie uma notificação de incentivo.</DrawerDescription></DrawerHeader>
        <div className="px-6 pb-6"><div className="flex items-center gap-3 rounded-2xl bg-apex-soft p-4"><span className={`flex h-11 w-11 items-center justify-center rounded-xl font-black ${statusStyles.danger.avatar}`}>{student.initials}</span><div><p className="font-black text-apex-navy">{student.name}</p><p className="text-xs text-apex-muted">{student.lastWorkoutLabel}</p></div></div></div>
        <DrawerFooter><form action={preview ? undefined : reminderAction} onSubmit={(event) => { if (preview) event.preventDefault(); }}><Button type="submit" className="w-full"><Bell className="mr-2 h-4 w-4" />Enviar notificação</Button></form><DrawerClose asChild><Button variant="ghost">Cancelar</Button></DrawerClose></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
