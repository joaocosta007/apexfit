"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CUSTOM_EXERCISE_VALUE, exerciseCatalog, exerciseGroups } from "@/lib/exercise-catalog";

export function ExerciseSelectorFields({ fieldId }: { fieldId: string }) {
  const [selectedExercise, setSelectedExercise] = useState("");
  const isCustom = selectedExercise === CUSTOM_EXERCISE_VALUE;

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor={fieldId}>Exercício</Label>
        <select
          id={fieldId}
          name="catalogId"
          required
          value={selectedExercise}
          onChange={(event) => setSelectedExercise(event.target.value)}
          className="flex h-12 w-full rounded-xl border border-input bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="" disabled>Selecione um exercício...</option>
          <option value={CUSTOM_EXERCISE_VALUE}>Outro exercício (digitar nome)</option>
          {exerciseGroups.map((group) => (
            <optgroup key={group} label={group}>
              {exerciseCatalog
                .filter((exercise) => exercise.group === group)
                .map((exercise) => (
                  <option key={exercise.id} value={exercise.id}>{exercise.name}</option>
                ))}
            </optgroup>
          ))}
        </select>
      </div>

      {isCustom ? (
        <div className="space-y-2 rounded-xl border border-blue-200 bg-white p-3">
          <Label htmlFor={`${fieldId}-customName`}>Nome do novo exercício</Label>
          <Input
            id={`${fieldId}-customName`}
            name="customExerciseName"
            placeholder="Ex.: Remada unilateral no cabo"
            minLength={2}
            maxLength={100}
            autoFocus
            required
          />
          <p className="text-xs text-slate-500">Este nome será exibido no treino do aluno.</p>
        </div>
      ) : null}
    </div>
  );
}
