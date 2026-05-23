"use client";

import { useState } from "react";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmailVerificationBanner() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleResend() {
    setLoading(true);
    try {
      await fetch("/api/resend-verification", { method: "POST" });
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-4 flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
      <MailCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-yellow-800">Confirme seu e-mail</p>
        {sent ? (
          <p className="mt-1 text-sm text-yellow-700">
            E-mail reenviado! Verifique sua caixa de entrada.
          </p>
        ) : (
          <p className="mt-1 text-sm text-yellow-700">
            Enviamos um link de confirmação para o seu e-mail.{" "}
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-sm font-semibold text-yellow-800 underline hover:bg-transparent"
              onClick={handleResend}
              disabled={loading}
            >
              {loading ? "Enviando..." : "Reenviar e-mail"}
            </Button>
          </p>
        )}
      </div>
    </div>
  );
}
