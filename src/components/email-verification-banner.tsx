"use client";

import { useState } from "react";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmailVerificationBanner() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleResend() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/resend-verification", { method: "POST" });
      if (!response.ok) throw new Error("Não foi possível reenviar o e-mail agora.");
      setSent(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Não foi possível reenviar o e-mail agora.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-4 flex items-start gap-3 rounded-card border border-blue-100 bg-white p-4 shadow-card" role="status">
      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-blue-100 text-apex-blue">
        <MailCheck className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-black text-apex-navy">Confirme seu e-mail</p>
        {sent ? (
          <p className="mt-1 text-sm font-medium text-apex-muted">
            Novo link enviado. Verifique sua caixa de entrada.
          </p>
        ) : (
          <>
            <p className="mt-1 text-sm font-medium text-apex-muted">Enviamos um link de confirmação para o seu e-mail.</p>
            <Button variant="outline" size="sm" className="mt-3 border-blue-100 text-apex-blue hover:bg-blue-50" onClick={handleResend} disabled={loading}>
              {loading ? "Enviando..." : "Reenviar e-mail"}
            </Button>
            {error && <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
}
