"use client";

import { useEffect, useRef, useState } from "react";
import { Check, CheckCircle2, Minus, Pause, Play, Plus, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";
import { registrarTreinoAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { cn, formatarCarga } from "@/lib/utils";

function parseRestSeconds(restTime: string): number {
  if (!restTime) return 60;
  const colonMatch = restTime.match(/^(\d+):(\d+)$/);
  if (colonMatch) return Number(colonMatch[1]) * 60 + Number(colonMatch[2]);
  const numberMatch = restTime.match(/(\d+(?:[.,]\d+)?)/);
  if (!numberMatch) return 60;
  const value = Number(numberMatch[1].replace(",", "."));
  return /min|\bm\b/i.test(restTime) ? Math.round(value * 60) : Math.round(value);
}

function formatTimer(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

function toEmbedUrl(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : url;
}

type ExerciseExecutionCardProps = {
  index: number;
  exercise: { id: string; name: string; group: string; sets: number; reps: number; loadKg: number; restTime: string };
  lastLoad?: number | null;
  videoUrl?: string | null;
  expanded: boolean;
  persist?: boolean;
  onToggleExpanded: () => void;
  onCompletedSetsChange?: (count: number) => void;
  onRegistered?: () => void;
};

/** Card de execução otimizado para toque: séries, carga e descanso em um único fluxo. */
export function ExerciseExecutionCard({ index, exercise, lastLoad, videoUrl, expanded, persist = true, onToggleExpanded, onCompletedSetsChange, onRegistered }: ExerciseExecutionCardProps) {
  const restSeconds = parseRestSeconds(exercise.restTime);
  const [completedSets, setCompletedSets] = useState<Set<number>>(new Set());
  const [registered, setRegistered] = useState(false);
  const [load, setLoad] = useState(exercise.loadKg);
  const [draftLoad, setDraftLoad] = useState(exercise.loadKg);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(restSeconds);
  const [timerRunning, setTimerRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const action = registrarTreinoAction.bind(null, exercise.id);

  useEffect(() => {
    if (!timerRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimerSeconds((current) => {
        if (current <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerRunning]);

  function toggleSet(setIndex: number) {
    const next = new Set(completedSets);
    const isCompleting = !next.has(setIndex);

    if (isCompleting) {
      next.add(setIndex);
      setTimerSeconds(restSeconds);
      setTimerRunning(true);
    } else {
      next.delete(setIndex);
    }

    setCompletedSets(next);
    onCompletedSetsChange?.(next.size);
  }

  function registerPreview() {
    setRegistered(true);
    onRegistered?.();
    toast.success("Exercício registrado", { description: `${exercise.name} · ${formatarCarga(load)}` });
  }

  function handleProductionSubmit() {
    setRegistered(true);
    onRegistered?.();
  }

  const allSetsCompleted = completedSets.size === exercise.sets;
  const timerProgress = restSeconds > 0 ? ((restSeconds - timerSeconds) / restSeconds) * 100 : 0;

  return (
    <article className={cn("overflow-hidden rounded-card border bg-apex-surface shadow-card transition-colors", registered ? "border-apex-green/30" : expanded ? "border-apex-blue/15" : "border-border/80")}>
      {showVideo && videoUrl && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-apex-navy/90 p-4" onClick={() => setShowVideo(false)}>
          <div className="relative w-full max-w-lg" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => setShowVideo(false)} className="tap-feedback focus-app absolute -top-11 right-0 flex min-h-11 items-center gap-2 rounded-xl px-2 text-sm font-bold text-white">
              <X className="h-5 w-5" aria-hidden="true" /> Fechar
            </button>
            <div className="relative aspect-video w-full overflow-hidden rounded-card bg-black">
              <iframe src={toEmbedUrl(videoUrl)} title={`Vídeo: ${exercise.name}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="absolute inset-0 h-full w-full" />
            </div>
          </div>
        </div>
      )}

      <button type="button" onClick={onToggleExpanded} aria-expanded={expanded} className="tap-feedback focus-app flex min-h-[76px] w-full items-center gap-3 px-4 py-3 text-left">
        <span className={cn("flex h-11 w-11 flex-none items-center justify-center rounded-full border text-sm font-bold", registered ? "border-apex-green/20 bg-apex-green/10 text-apex-green" : "border-slate-200 bg-apex-soft text-slate-400")}>
          {registered ? <Check className="h-5 w-5" aria-hidden="true" /> : index}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-base font-black leading-tight text-apex-navy">{exercise.name}</span>
          <span className="mt-0.5 block truncate text-sm font-medium text-slate-400">{exercise.group}</span>
        </span>
        <span className="rounded-xl bg-apex-soft px-3 py-2 text-sm font-black text-apex-navy">{exercise.sets}×{exercise.reps}</span>
      </button>

      {expanded && (
        <div className="border-t border-border/70 px-4 pb-4 pt-3">
          <div className="flex items-center justify-between gap-4 rounded-control bg-apex-soft p-4">
            <div>
              <p className="text-xs font-medium text-slate-400">Carga atual</p>
              <p className="mt-1 text-2xl font-black text-apex-navy">{formatarCarga(load)}</p>
            </div>
            <div className="text-right">
              <p className="mb-2 text-xs font-medium text-slate-400">Último: {lastLoad == null ? "—" : formatarCarga(lastLoad)}</p>
              <Drawer open={drawerOpen} onOpenChange={(open) => { setDrawerOpen(open); if (open) setDraftLoad(load); }}>
                <DrawerTrigger asChild><Button type="button" size="sm">Ajustar</Button></DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Ajustar carga</DrawerTitle>
                    <DrawerDescription>{exercise.name} · valor usado no registro desta execução.</DrawerDescription>
                  </DrawerHeader>
                  <div className="px-6 pb-6">
                    <div className="soft-surface flex items-center justify-between p-4">
                      <Button type="button" variant="outline" size="icon" aria-label="Diminuir carga" onClick={() => setDraftLoad((value) => Math.max(0, Number((value - 0.5).toFixed(1))))}><Minus className="h-5 w-5" aria-hidden="true" /></Button>
                      <div className="text-center">
                        <strong className="block text-4xl font-black tracking-tight text-apex-ink">{draftLoad.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}</strong>
                        <span className="text-sm font-semibold text-apex-muted">quilogramas</span>
                      </div>
                      <Button type="button" variant="outline" size="icon" aria-label="Aumentar carga" onClick={() => setDraftLoad((value) => Number((value + 0.5).toFixed(1)))}><Plus className="h-5 w-5" aria-hidden="true" /></Button>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-3" aria-label="Ajustes rápidos de carga">
                      {[1, 5, 10].map((increment) => (
                        <button
                          key={increment}
                          type="button"
                          onClick={() => setDraftLoad((value) => Number((value + increment).toFixed(1)))}
                          className="tap-feedback focus-app mx-auto flex h-16 w-16 flex-col items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-apex-blue hover:bg-blue-100"
                          aria-label={`Adicionar ${increment} quilogramas`}
                        >
                          <strong className="text-base leading-none">+{increment}</strong>
                          <span className="mt-1 text-[10px] font-bold">kg</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <DrawerFooter>
                    <Button type="button" onClick={() => { setLoad(draftLoad); setDrawerOpen(false); toast.success("Carga ajustada", { description: formatarCarga(draftLoad) }); }}>Salvar carga</Button>
                    <DrawerClose asChild><Button type="button" variant="ghost">Cancelar</Button></DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2" aria-label={`Séries de ${exercise.name}`}>
            {Array.from({ length: exercise.sets }, (_, setIndex) => {
              const isCompleted = completedSets.has(setIndex);
              return (
                <button key={setIndex} type="button" aria-pressed={isCompleted} aria-label={`${isCompleted ? "Desmarcar" : "Concluir"} série ${setIndex + 1}`} onClick={() => toggleSet(setIndex)} className={cn("tap-feedback focus-app flex min-h-[60px] flex-col items-center justify-center rounded-control border text-apex-navy transition-colors", isCompleted ? "border-apex-green bg-apex-green text-white" : "border-slate-200 bg-apex-soft")}>
                  {isCompleted ? <Check className="h-5 w-5" aria-hidden="true" /> : <strong className="text-base">{setIndex + 1}</strong>}
                  <span className={cn("mt-0.5 text-[10px]", isCompleted ? "text-white/80" : "text-slate-400")}>série</span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex min-h-[76px] items-center gap-3 rounded-control bg-apex-soft px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-apex-muted">Descanso: {exercise.restTime}</p>
              <p className="mt-0.5 text-xs text-slate-400">{timerRunning ? "Cronômetro em andamento" : timerSeconds === 0 ? "Descanso concluído" : "Pronto para iniciar"}</p>
            </div>
            <div className="relative flex h-14 w-14 flex-none items-center justify-center rounded-full p-[3px]" style={{ background: `conic-gradient(#2563eb ${timerProgress}%, #dbe5f3 ${timerProgress}% 100%)` }} aria-label={`${formatTimer(timerSeconds)} restantes`}>
              <span className="flex h-full w-full items-center justify-center rounded-full bg-white text-sm font-black tabular-nums text-apex-navy">{formatTimer(timerSeconds)}</span>
            </div>
            <button type="button" onClick={() => { if (timerSeconds === 0) setTimerSeconds(restSeconds); setTimerRunning((running) => !running); }} className="tap-feedback focus-app flex min-h-11 min-w-16 items-center justify-center rounded-xl bg-apex-navy px-3 text-xs font-bold text-white" aria-label={timerRunning ? "Pausar descanso" : "Iniciar descanso"}>
              {timerRunning ? <Pause className="h-4 w-4" aria-hidden="true" /> : "Iniciar"}
            </button>
            <button type="button" onClick={() => { setTimerRunning(false); setTimerSeconds(restSeconds); }} className="tap-feedback focus-app flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-slate-200 bg-white text-apex-muted hover:bg-apex-soft hover:text-apex-navy" aria-label="Resetar tempo de descanso">
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {allSetsCompleted && !registered && (persist ? (
            <form action={action} onSubmit={handleProductionSubmit} className="mt-3">
              <input type="hidden" name="completedLoadKg" value={load} />
              <Button type="submit" className="w-full bg-apex-green hover:bg-green-600"><CheckCircle2 className="mr-2 h-5 w-5" aria-hidden="true" />Registrar exercício</Button>
            </form>
          ) : (
            <Button type="button" className="mt-3 w-full bg-apex-green hover:bg-green-600" onClick={registerPreview}><CheckCircle2 className="mr-2 h-5 w-5" aria-hidden="true" />Registrar exercício</Button>
          ))}

          {videoUrl && (
            <button type="button" onClick={() => setShowVideo(true)} className="tap-feedback focus-app mt-3 flex min-h-11 items-center gap-2 rounded-xl px-2 text-sm font-bold text-apex-blue"><Play className="h-4 w-4 fill-current" aria-hidden="true" /> Ver execução em vídeo</button>
          )}
        </div>
      )}
    </article>
  );
}
