"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, ClipboardCheck, Dumbbell, Plus, Search, UserRoundCheck, UsersRound } from "lucide-react";

export type ManagerTrainerItem = {
  id: string;
  name: string;
  email: string;
  initials: string;
  students: number;
  activePlans: number;
  memberSince: string;
};

type ManagerDashboardViewProps = {
  trainers: ManagerTrainerItem[];
  linkedStudents: number;
  activePlans: number;
  trainedThisWeek: number;
  preview?: boolean;
};

export function ManagerDashboardView({ trainers, linkedStudents, activePlans, trainedThisWeek, preview = false }: ManagerDashboardViewProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "empty">("all");
  const query = search.trim().toLocaleLowerCase("pt-BR");
  const filtered = useMemo(() => trainers.filter((trainer) => {
    const matchesSearch = !query || trainer.name.toLocaleLowerCase("pt-BR").includes(query) || trainer.email.toLocaleLowerCase("pt-BR").includes(query);
    const matchesFilter = filter === "all" || (filter === "active" ? trainer.students > 0 : trainer.students === 0);
    return matchesSearch && matchesFilter;
  }), [trainers, query, filter]);

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[28px] bg-apex-navy px-5 py-6 text-white shadow-floating">
        <span aria-hidden="true" className="absolute -right-14 -top-16 h-44 w-44 rounded-full bg-white/[0.04]" />
        <span aria-hidden="true" className="absolute right-12 -top-8 h-28 w-28 rounded-full bg-apex-blue/10" />
        <div className="relative"><p className="text-sm font-semibold text-slate-400">Visão geral da academia</p><h2 className="mt-1 text-2xl font-black">Operação ApexFit</h2></div>
        <div className="relative mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Summary icon={UserRoundCheck} value={trainers.length} label="Professores" />
          <Summary icon={UsersRound} value={linkedStudents} label="Alunos vinculados" />
          <Summary icon={ClipboardCheck} value={activePlans} label="Planos ativos" />
          <Summary icon={Dumbbell} value={trainedThisWeek} label="Treinaram na semana" />
        </div>
      </section>

      <Link href="/manager/trainers/new" onClick={(event) => { if (preview) event.preventDefault(); }} className="focus-app tap-feedback app-card flex items-center gap-4 p-4"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100"><Plus className="h-6 w-6 text-apex-blue" /></span><div className="flex-1"><p className="font-black text-apex-navy">Cadastrar professor</p><p className="mt-0.5 text-xs text-apex-muted">Crie um novo acesso para a equipe.</p></div><ChevronRight className="h-5 w-5 text-slate-400" /></Link>

      <section aria-labelledby="manager-trainers-title">
        <div className="flex items-end justify-between gap-3"><div><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">Equipe técnica</p><h2 id="manager-trainers-title" className="mt-1 text-2xl font-black text-apex-navy">Professores</h2></div><span className="text-sm font-bold text-apex-muted">{filtered.length} de {trainers.length}</span></div>
        <div className="relative mt-4"><Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nome ou e-mail" aria-label="Buscar professores" className="focus-app h-13 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-semibold text-apex-navy shadow-card placeholder:text-slate-400" /></div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filtrar professores">
          <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>Todos</FilterButton>
          <FilterButton active={filter === "active"} onClick={() => setFilter("active")}>Com alunos</FilterButton>
          <FilterButton active={filter === "empty"} onClick={() => setFilter("empty")}>Sem alunos</FilterButton>
        </div>
        {filtered.length ? <div className="mt-4 grid gap-3 md:grid-cols-2">{filtered.map((trainer) => <TrainerCard key={trainer.id} trainer={trainer} preview={preview} />)}</div> : <div className="app-card mt-4 flex min-h-48 flex-col items-center justify-center px-6 text-center"><UsersRound className="h-9 w-9 text-slate-300" /><p className="mt-3 font-black text-apex-navy">Nenhum professor encontrado</p><p className="mt-1 text-sm text-apex-muted">Tente alterar a busca ou o filtro.</p></div>}
      </section>
    </div>
  );
}

function Summary({ icon: Icon, value, label }: { icon: typeof UsersRound; value: number; label: string }) {
  return <div className="rounded-2xl bg-white/[0.07] px-2 py-3.5 text-center"><Icon className="mx-auto h-4 w-4 text-blue-300" /><p className="mt-1 text-xl font-black">{value}</p><p className="text-[10px] font-semibold leading-tight text-slate-400">{label}</p></div>;
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" aria-pressed={active} onClick={onClick} className={`focus-app shrink-0 rounded-full px-4 py-2 text-xs font-extrabold transition-colors ${active ? "bg-apex-navy text-white" : "border border-slate-200 bg-white text-apex-muted"}`}>{children}</button>;
}

function TrainerCard({ trainer, preview }: { trainer: ManagerTrainerItem; preview: boolean }) {
  const hasStudents = trainer.students > 0;
  return <Link href={`/manager/${trainer.id}`} onClick={(event) => { if (preview) event.preventDefault(); }} className="focus-app app-card group block p-4 transition-colors hover:border-blue-200"><div className="flex items-start gap-3"><span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-black ${hasStudents ? "bg-blue-100 text-apex-blue" : "bg-slate-100 text-slate-500"}`}>{trainer.initials}</span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h3 className="truncate font-black text-apex-navy">{trainer.name}</h3><span className={`h-2 w-2 rounded-full ${hasStudents ? "bg-apex-green" : "bg-slate-300"}`} /></div><p className="mt-0.5 truncate text-xs text-slate-400">{trainer.email}</p><p className="mt-1 text-[11px] font-medium text-apex-muted">Na equipe desde {trainer.memberSince}</p></div><ChevronRight className="mt-3 h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-0.5" /></div><div className="mt-4 grid grid-cols-2 gap-2"><div className="rounded-xl bg-apex-soft p-3"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Alunos</p><p className="mt-1 text-lg font-black text-apex-navy">{trainer.students}</p></div><div className="rounded-xl bg-apex-soft p-3"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Planos ativos</p><p className="mt-1 text-lg font-black text-apex-blue">{trainer.activePlans}</p></div></div></Link>;
}
