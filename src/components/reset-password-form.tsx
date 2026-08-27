"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { redefinirSenhaAction } from "@/app/actions";
import { toast } from "sonner";

export function ResetPasswordForm({ token }: { token: string }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm") as string;

    if (password !== confirm) {
      const message = "As senhas não coincidem.";
      setError(message);
      toast.error(message);
      return;
    }

    setError("");
    setLoading(true);
    try {
      await redefinirSenhaAction(token, formData);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (!msg.includes("NEXT_REDIRECT")) {
        const friendlyMessage = msg.includes("inválido ou expirado") ? "Este link expirou. Solicite um novo link de recuperação." : "Não foi possível salvar a nova senha. Tente novamente.";
        setError(friendlyMessage);
        toast.error("Não foi possível alterar a senha", { description: friendlyMessage });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && <p className="sr-only" role="alert">{error}</p>}

      <div className="space-y-2">
        <Label htmlFor="password">Nova senha</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Mínimo 6 caracteres"
          minLength={6}
          required
          autoComplete="new-password"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm">Confirmar senha</Label>
        <Input
          id="confirm"
          name="confirm"
          type="password"
          placeholder="Repita a nova senha"
          minLength={6}
          required
          autoComplete="new-password"
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : (
          "Salvar nova senha"
        )}
      </Button>
    </form>
  );
}
