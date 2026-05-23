"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function LoginForm({ initialError }: { initialError?: string }) {
  const router = useRouter();
  const [erro, setErro] = useState(initialError ?? "");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    startTransition(async () => {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        setErro("E-mail ou senha inválidos. Tente novamente.");
        return;
      }
      router.push("/");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        id="email"
        name="email"
        type="email"
        placeholder="Digite seu email"
        autoComplete="email"
        required
        className="w-full rounded-full border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />

      <div className="space-y-1.5">
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Digite sua senha"
          autoComplete="current-password"
          required
          className="w-full rounded-full border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
        <div className="px-1">
          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Esqueci minha senha
          </Link>
        </div>
      </div>

      {erro && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {erro}
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 py-4 text-base font-bold text-white shadow-md shadow-blue-600/25 transition-opacity hover:opacity-90 disabled:opacity-70"
        >
          {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
          Entrar
        </button>
      </div>
    </form>
  );
}
