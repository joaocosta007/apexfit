"use client";

import { Bell } from "lucide-react";
import { enviarLembreteAction } from "@/app/actions";

type LembreteButtonProps = {
  studentId: string;
  dias: number;
};

export function LembreteButton({ studentId, dias }: LembreteButtonProps) {
  const action = enviarLembreteAction.bind(null, studentId, dias);

  return (
    <form
      action={action}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="submit"
        title="Enviar lembrete por push"
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 transition-colors hover:bg-red-100"
      >
        <Bell className="h-4 w-4" />
      </button>
    </form>
  );
}
