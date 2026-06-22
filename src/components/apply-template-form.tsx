"use client";

import { useRef } from "react";
import { aplicarTemplateFormAction } from "@/app/actions";
import { Button } from "@/components/ui/button";

type ApplyTemplateFormProps = {
  planId: string;
  studentId: string;
  templates: { id: string; name: string }[];
};

export function ApplyTemplateForm({ planId, studentId, templates }: ApplyTemplateFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);
  const applyAction = aplicarTemplateFormAction.bind(null, planId, studentId);

  function handleApply() {
    const name = selectRef.current?.options[selectRef.current.selectedIndex]?.text ?? "";
    if (window.confirm(`Aplicar o template "${name}"?\n\nIsso irá substituir todas as divisões e exercícios do plano atual.`)) {
      formRef.current?.requestSubmit();
    }
  }

  return (
    <form ref={formRef} action={applyAction} className="flex gap-2">
      <select
        ref={selectRef}
        name="templateId"
        className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {templates.map((t) => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>
      <Button type="button" variant="secondary" onClick={handleApply}>
        Aplicar
      </Button>
    </form>
  );
}
