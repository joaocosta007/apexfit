"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, LockKeyhole, Mail } from "lucide-react";
import { toast } from "sonner";

export function LoginForm({ initialError }: { initialError?: string }) {
  const router = useRouter();
  const [erro, setErro] = useState(initialError ?? "");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (initialError) toast.error(initialError);
  }, [initialError]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    startTransition(async () => {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        const message = "E-mail ou senha inválidos. Tente novamente.";
        setErro(message);
        toast.error(message);
        return;
      }
      router.push("/");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block space-y-2" htmlFor="email">
        <span className="text-sm font-bold text-slate-900">E-mail</span>
        <span className="relative block">
          <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input id="email" name="email" type="email" placeholder="voce@exemplo.com" autoComplete="email" required
            className="h-14 w-full rounded-2xl border border-transparent bg-[#f1f5fb] pl-12 pr-4 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100" />
        </span>
      </label>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-900" htmlFor="password">Senha</label>
        <div className="relative">
          <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
          id="password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••"
          autoComplete="current-password"
          required
          className="h-14 w-full rounded-2xl border border-transparent bg-[#f1f5fb] pl-12 pr-12 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
        />
          <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        <div>
          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Esqueceu a senha?
          </Link>
        </div>
      </div>

      {erro && <p className="sr-only" role="alert">{erro}</p>}

      <div className="pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="flex h-14 w-full items-center justify-center rounded-2xl bg-blue-600 text-base font-bold text-white shadow-sm shadow-blue-600/20 transition-colors hover:bg-blue-700 disabled:opacity-70"
        >
          {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
          Entrar
        </button>
      </div>
    </form>
  );
}
