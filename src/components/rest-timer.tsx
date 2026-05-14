"use client";

import { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function parseRestTimeToSeconds(restTime: string) {
  const normalized = restTime.trim().toLowerCase();

  if (!normalized) {
    return 60;
  }

  const clockMatch = normalized.match(/^(\d{1,2}):(\d{2})$/);
  if (clockMatch) {
    const minutes = Number(clockMatch[1]);
    const seconds = Number(clockMatch[2]);
    return Math.max(1, minutes * 60 + seconds);
  }

  const minutesMatch = normalized.match(/(\d+(?:[.,]\d+)?)\s*(min|m|minuto|minutos)/);
  if (minutesMatch) {
    return Math.max(1, Math.round(Number(minutesMatch[1].replace(",", ".")) * 60));
  }

  const secondsMatch = normalized.match(/(\d+(?:[.,]\d+)?)\s*(s|seg|segundo|segundos)?/);
  if (secondsMatch) {
    return Math.max(1, Math.round(Number(secondsMatch[1].replace(",", "."))));
  }

  return 60;
}

function formatSeconds(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function RestTimer({ restTime }: { restTime: string }) {
  return <RestTimerContent key={restTime} restTime={restTime} />;
}

function RestTimerContent({ restTime }: { restTime: string }) {
  const initialSeconds = useMemo(() => parseRestTimeToSeconds(restTime), [restTime]);
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const isFinished = remainingSeconds === 0;

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = window.setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          setIsRunning(false);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning]);

  function startOrPause() {
    if (isFinished) {
      setRemainingSeconds(initialSeconds);
      setIsRunning(true);
      return;
    }

    setIsRunning((current) => !current);
  }

  function reset() {
    setRemainingSeconds(initialSeconds);
    setIsRunning(false);
  }

  const progress = initialSeconds > 0 ? ((initialSeconds - remainingSeconds) / initialSeconds) * 100 : 0;

  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-blue-700 shadow-sm">
            <Timer className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900">Timer de descanso</p>
            <p className="text-xs text-slate-600">Descanso previsto: {restTime}</p>
          </div>
        </div>
        <Badge variant={isFinished ? "default" : "secondary"}>{isFinished ? "Concluído" : "Ativo"}</Badge>
      </div>

      <div className="mb-3 overflow-hidden rounded-full bg-slate-200">
        <div
          className={cn("h-2 rounded-full transition-all", isFinished ? "bg-primary" : "bg-blue-700")}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <div>
          <p className={cn("text-3xl font-black tabular-nums", isFinished ? "text-primary" : "text-slate-900")}>
            {formatSeconds(remainingSeconds)}
          </p>
          <p className="text-xs text-slate-600">
            {isFinished ? "Descanso concluído!" : isRunning ? "Contando regressivamente" : "Pronto para iniciar"}
          </p>
        </div>

        <div className="flex gap-2">
          <Button type="button" size="sm" variant={isRunning ? "outline" : "secondary"} onClick={startOrPause}>
            {isRunning ? <Pause className="mr-1 h-4 w-4" /> : <Play className="mr-1 h-4 w-4" />}
            {isRunning ? "Pausar" : isFinished ? "Reiniciar" : remainingSeconds === initialSeconds ? "Iniciar" : "Retomar"}
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={reset} aria-label="Resetar timer">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}