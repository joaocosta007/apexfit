"use client";

import { useState, useEffect } from "react";
import { Clock, Play, X, CheckCircle2, Circle, Timer } from "lucide-react";
import { registrarTreinoAction } from "@/app/actions";
import { formatarCarga } from "@/lib/utils";

function parseRestSeconds(restTime: string): number {
  if (!restTime) return 60;
  const colonMatch = restTime.match(/^(\d+):(\d+)$/);
  if (colonMatch) return parseInt(colonMatch[1]) * 60 + parseInt(colonMatch[2]);
  const numMatch = restTime.match(/(\d+)/);
  return numMatch ? parseInt(numMatch[1]) : 60;
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
  const [timerSecs, setTimerSecs] = useState<number | null>(null);
  const restSeconds = parseRestSeconds(exercise.restTime);
  const action = registrarTreinoAction.bind(null, exercise.id);

  // Countdown
  useEffect(() => {
    if (timerSecs === null || timerSecs <= 0) return;
    const id = setInterval(() => {
      setTimerSecs((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [timerSecs]);

  function formatTimer(secs: number) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m > 0 ? `${m}:${s.toString().padStart(2, "0")}` : `${s}s`;
  }

  function handleToggle() {
    const next = !completed;
    setCompleted(next);
    onCompletedChange?.(next);
    if (next) {
      setTimerSecs(restSeconds);
    } else {
      setTimerSecs(null);
    }
  }

  // Exercício registrado → card verde resumido
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
        {/* Barra do temporizador */}
        {timerSecs !== null && timerSecs > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 px-4 py-2">
            <Timer className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-semibold text-amber-700">Descansando…</span>
            <span className="ml-auto text-lg font-black text-amber-600">{formatTimer(timerSecs)}</span>
          </div>
        )}
        {timerSecs === 0 && (
          <div className="flex items-center gap-2 bg-green-50 px-4 py-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-sm font-semibold text-green-700">Descansou! Registre o exercício.</span>
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

          {/* Linha: descanso + última carga + carga atual */}
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

          {/* Botão registrar — aparece só quando marcado */}
          {completed && (
            <form
              action={action}
              onSubmit={() => setRegistered(true)}
              className="mt-3"
            >
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
