"use client";

import { useState } from "react";
import { diasDaSemana } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function DayToggleFields({ selectedIndices = [] }: { selectedIndices?: number[] }) {
  const [selected, setSelected] = useState<number[]>(selectedIndices);

  function toggle(indice: number) {
    setSelected((current) =>
      current.includes(indice) ? current.filter((item) => item !== indice) : [...current, indice].sort((a, b) => a - b)
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-slate-700">Dias da semana</p>
      <div className="grid grid-cols-7 gap-2">
        {diasDaSemana.map((dia, indice) => {
          const active = selected.includes(indice);
          return (
            <button
              key={`${dia.nome}-${indice}`}
              type="button"
              aria-pressed={active}
              title={dia.nome}
              onClick={() => toggle(indice)}
              className={cn(
                "h-11 rounded-full border text-sm font-black transition-all",
                active
                  ? "border-primary bg-primary text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-primary/40 hover:text-primary"
              )}
            >
              {dia.label}
            </button>
          );
        })}
      </div>
      {selected.map((indice) => (
        <input key={indice} type="hidden" name="dias" value={indice} />
      ))}
    </div>
  );
}