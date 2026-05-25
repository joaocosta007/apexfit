"use client";

import { useState, useEffect, useRef } from "react";
import { Clock, Play, Pause, RotateCcw, X, CheckCircle2, Circle, Timer } from "lucide-react";
import { registrarTreinoAction } from "@/app/actions";
import { formatarCarga } from "@/lib/utils";

function parseRestSeconds(restTime: string): number {
  if (!restTime) return 60;
  const colonMatch = restTime.match(/^(\d+):(\d+)$/);
  if (colonMatch) return parseInt(colonMatch[1]) * 60 + parseInt(colonMatch[2]);
  const numMatch = restTime.match(/(\d+)/);
  return numMatch ? parseInt(numMatch[1]) : 60;
}

function formatTimer(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function toEmbedUrl(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : url;
}

type ExerciseExecutionCardProps = {
  exercise: {
    id: string;
    name: string;
    sets: number;
    reps: number;
    loadKg: number;
    restTime: string;
  };
  lastLoad?: number | null;
  videoUrl?: string | null;
  onCompletedChange?: (completed: boolean) => void;
};

export function ExerciseExecutionCard({ exercise, lastLoad, videoUrl, onCompletedChange }: ExerciseExecutionCardProps) {
  const [completed, setCompleted] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [load, setLoad] = useState(exercise.loadKg);
  const [showVideo, setShowVideo] = useState(false);

  // Timer state
  const restSeconds = parseRestSeconds(exercise.restTime);
  const [timerSecs, setTimerSecs] = useState(restSeconds);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerVisible, setTimerVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const action = registrarTreinoAction.bind(null, exercise.id);

  // Tick
  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setTimerSecs((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [timerRunning]);

  function handleTimerPlay() { setTimerRunning(true); }
  function handleTimerPause() { setTimerRunning(false); }
  function handleTimerReset() {
    setTimerRunning(false);
    setTimerSecs(restSeconds);
  }

  function handleToggle() {
    const next = !completed;
    setCompleted(next);
    onCompletedChange?.(next);
    if (next) {
      // Abre e inicia o timer automaticamente
      setTimerSecs(restSeconds);
      setTimerRunning(true);
      setTimerVisible(true);
    } else {
      setTimerRunning(false);
      setTimerVisible(false);
      setTimerSecs(restSeconds);
    }
  }

  const pct = restSeconds > 0 ? ((restSeconds - timerSecs) / restSeconds) * 100 : 0;
  const timerDone = timerSecs === 0;

  // Exercício registrado → card verde compacto
  if (registered) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3.5">
        <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600" />
        <div>
          <p className="text-sm font-bold text-green-800">{exercise.name}</p>
          <p className="text-xs text-green-600">Registrado • {formatarCarga(load)}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Modal de vídeo */}
      {showVideo && videoUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setShowVideo(false)}
        >
          <div className="relative w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setShowVideo(false)}
              className="absolute -top-10 right-0 flex items-center gap-1 text-sm font-semibold text-white"
            >
              <X className="h-5 w-5" /> Fechar
            </button>
            <div className="relative w-full overflow-hidden rounded-2xl bg-black" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src={toEmbedUrl(videoUrl)}
                title={`Vídeo: ${exercise.name}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        </div>
      )}

      <div className={`overflow-hidden rounded-2xl bg-white shadow-sm transition-all ${completed ? "border-l-4 border-l-green-500" : ""}`}>

        {/* ── Temporizador de descanso ── */}
        {timerVisible && (
          <div className={`px-4 py-3 ${timerDone ? "bg-green-50" : "bg-amber-50"}`}>
            {/* Cabeçalho do timer */}
            <div className="mb-2 flex items-center gap-2">
              <Timer className={`h-4 w-4 ${timerDone ? "text-green-600" : "text-amber-500"}`} />
              <span className={`text-xs font-semibold ${timerDone ? "text-green-700" : "text-amber-700"}`}>
                {timerDone ? "Descanso concluído!" : "Descanso"}
              </span>
              {/* Tempo grande */}
              <span className={`ml-auto text-2xl font-black tabular-nums ${timerDone ? "text-green-600" : "text-amber-600"}`}>
                {formatTimer(timerSecs)}
              </span>
            </div>

            {/* Barra de progresso */}
            <div className="mb-2.5 h-1.5 w-full overflow-hidden rounded-full bg-black/10">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${timerDone ? "bg-green-500" : "bg-amber-400"}`}
                style={{ width: `${pct}%` }}
              />
            </div>

            {/* Controles: Play / Pause / Reset */}
            <div className="flex items-center gap-2">
              {timerRunning ? (
                <button
                  type="button"
                  onClick={handleTimerPause}
                  className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700 transition-all active:scale-95"
                >
                  <Pause className="h-3.5 w-3.5 fill-amber-700" />
                  Pausar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleTimerPlay}
                  disabled={timerDone}
                  className="flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1.5 text-xs font-bold text-white transition-all active:scale-95 disabled:opacity-40"
                >
                  <Play className="h-3.5 w-3.5 fill-white" />
                  {timerSecs === restSeconds ? "Iniciar" : "Continuar"}
                </button>
              )}

              <button
                type="button"
                onClick={handleTimerReset}
                className="flex items-center gap-1.5 rounded-full bg-black/10 px-3 py-1.5 text-xs font-bold text-slate-600 transition-all active:scale-95"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Resetar
              </button>
            </div>
          </div>
        )}

        <div className="p-4">
          {/* Linha: toggle + nome + vídeo */}
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={handleToggle}
              aria-label={completed ? "Desmarcar" : "Marcar como feito"}
              className="mt-0.5 flex-shrink-0 transition-transform active:scale-90"
            >
              {completed
                ? <CheckCircle2 className="h-6 w-6 text-green-500" />
                : <Circle className="h-6 w-6 text-slate-300" />
              }
            </button>

            <div className="flex-1 min-w-0">
              <h3 className={`text-base font-bold leading-tight ${completed ? "text-slate-400 line-through" : "text-slate-900"}`}>
                {exercise.name}
              </h3>
              <p className="mt-0.5 text-xs text-slate-400">
                {exercise.sets} séries • {exercise.reps} reps • {formatarCarga(exercise.loadKg)}
              </p>
            </div>

            {videoUrl && (
              <button
                type="button"
                onClick={() => setShowVideo(true)}
                className="flex flex-shrink-0 items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600"
              >
                <Play className="h-3 w-3 fill-blue-600" />
                Vídeo
              </button>
            )}
          </div>

          {/* Linha: descanso + última carga + carga */}
          <div className="mt-3 flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              <Clock className="h-3 w-3" />
              {exercise.restTime}
            </span>

            {lastLoad != null && (
              <span className="text-[10px] text-slate-400">
                Última: <span className="font-semibold">{formatarCarga(lastLoad)}</span>
              </span>
            )}

            <div className="ml-auto flex items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-400">Carga:</span>
              <input
                type="number"
                min="0"
                step="0.5"
                value={load}
                onChange={(e) => setLoad(Number(e.target.value))}
                className="w-14 rounded-lg border border-slate-200 bg-slate-50 px-1.5 py-1 text-center text-sm font-black text-blue-600 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
                aria-label="Carga em kg"
              />
              <span className="text-xs font-semibold text-slate-400">kg</span>
            </div>
          </div>

          {/* Botão registrar */}
          {completed && (
            <form action={action} onSubmit={() => setRegistered(true)} className="mt-3">
              <input type="hidden" name="completedLoadKg" value={load} />
              <button
                type="submit"
                className="w-full rounded-xl bg-green-500 py-2.5 text-sm font-bold text-white shadow-sm shadow-green-500/30 transition-all active:scale-[0.98] active:bg-green-600"
              >
                ✓ Registrar Exercício
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
