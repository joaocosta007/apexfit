"use client";

import { useRef } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type ConfirmButtonProps = {
  action: (formData: FormData) => Promise<void>;
  message: string;
  label?: string;
  variant?: "destructive" | "outline" | "ghost";
  className?: string;
};

export function ConfirmButton({
  action,
  message,
  label,
  variant = "destructive",
  className
}: ConfirmButtonProps) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={action}>
      <Button
        type="button"
        variant={variant}
        className={className}
        onClick={() => {
          if (window.confirm(message)) {
            formRef.current?.requestSubmit();
          }
        }}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        {label ?? "Remover"}
      </Button>
    </form>
  );
}
