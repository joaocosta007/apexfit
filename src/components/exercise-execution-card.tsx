"use client";

import { useState } from "react";
import { Clock, Play, X } from "lucide-react";
import { registrarTreinoAction } from "@/app/actions";
import { formatarCarga } from "@/lib/utils";

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
  const [load, setLoad] = useState(exercise.loadKg);
  const [showVideo, setShowVideo] = useState(false);
  const action = registrarTreinoAction.bind(null, exercise.id);

  function handleCheck() {
    const next = !completed;
    setCompleted(next);
    onCompletedChange?.(next);
  }

  return (
    <>
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

      <form action={action}>
        <input type="hidden" name="completedLoadKg" value={load} />

        <div className={`relative rounded-2xl bg-white p-4 shadow-sm transition-all ${completed ? "border-l-4 border-l-green-500" : ""}`}>
          {/* Checkbox circular — top right */}
          <button
            type={completed ? "submit" : "button"}
            onClick={completed ? undefined : handleCheck}
            aria-label={completed ? "Registrar exercício" : "Marcar como feito"}
            className={`absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all ${
              completed
                ? "border-green-500 bg-green-500 text-white"
                : "border-slate-300 bg-white"
            }`}
          >
            {completed && (
              <svg className="h-3.5 w-3.5" viewBox="0 0 12 10" fill="none">
                <path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>

          {/* Nome e detalhes */}
          <div className="pr-10">
            <h3 className={`text-base font-bold ${completed ? "text-slate-400 line-through" : "text-slate-900"}`}>
              {exercise.name}
            </h3>
            <p className="mt-0.5 text-xs text-slate-400">
              {exercise.sets} séries • {exercise.reps} reps • {formatarCarga(exercise.loadKg)}
            </p>
          </div>

          {/* Linha de chips + carga */}
          <div className="mt-3 flex items-center gap-2">
            {/* Descanso */}
            <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              <Clock className="h-3 w-3" />
              {exercise.restTime}
            </span>

            {/* Vídeo */}
            {videoUrl && (
              <button
                type="button"
                onClick={() => setShowVideo(true)}
                className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600"
              >
                <Play className="h-3 w-3 fill-blue-600" />
                Vídeo
              </button>
            )}

            {/* Carga inline */}
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

          {/* Última carga */}
          {lastLoad != null && (
            <p className="mt-2 text-[10px] text-slate-400">
              Última sessão: <span className="font-semibold">{formatarCarga(lastLoad)}</span>
            </p>
          )}
        </div>
      </form>
    </>
  );
}
