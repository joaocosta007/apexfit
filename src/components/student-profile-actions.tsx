"use client";

import Link from "next/link";
import { BarChart3, Bell, ChevronRight, LogOut, Target, UserRound } from "lucide-react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

type StudentProfileActionsProps = {
  exportData: Record<string, unknown>;
};

const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from([...raw].map((character) => character.charCodeAt(0)));
}

export function StudentProfileActions({ exportData }: StudentProfileActionsProps) {
  async function enableNotifications() {
    if (!("Notification" in window) || !("serviceWorker" in navigator) || !PUBLIC_KEY) {
      toast.error("As notificações não estão disponíveis neste dispositivo.");
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        toast.error("Permissão de notificações não concedida.");
        return;
      }
      const registration = await navigator.serviceWorker.ready;
      const existing = await registration.pushManager.getSubscription();
      const subscription = existing ?? await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_KEY).buffer as ArrayBuffer,
      });
      await fetch("/api/push/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(subscription) });
      toast.success("Notificações ativadas com sucesso.");
    } catch {
      toast.error("Não foi possível ativar as notificações.");
    }
  }

  function exportProfile() {
    const content = JSON.stringify({ exportedAt: new Date().toISOString(), ...exportData }, null, 2);
    const url = URL.createObjectURL(new Blob([content], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `apexfit-meus-dados-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Arquivo de dados gerado.");
  }

  return (
    <section className="app-card overflow-hidden" aria-label="Configurações do perfil">
      <ActionLink href="/student/anamnese#dados-basicos" icon={UserRound} label="Dados pessoais" />
      <ActionLink href="/student/anamnese#objetivos" icon={Target} label="Metas e objetivos" />
      <ActionButton icon={Bell} label="Notificações" onClick={enableNotifications} />
      <ActionButton icon={BarChart3} label="Exportar dados" onClick={exportProfile} />
      <ActionButton icon={LogOut} label="Sair da conta" onClick={() => signOut({ callbackUrl: "/login" })} danger />
    </section>
  );
}

function ActionLink({ href, icon: Icon, label }: { href: string; icon: typeof UserRound; label: string }) {
  return <Link href={href} className="focus-app flex min-h-16 items-center gap-4 border-b border-slate-100 px-5 text-apex-navy transition-colors hover:bg-apex-soft"><Icon className="h-5 w-5 text-apex-blue" /><span className="flex-1 text-sm font-extrabold">{label}</span><ChevronRight className="h-4 w-4 text-slate-400" /></Link>;
}

function ActionButton({ icon: Icon, label, onClick, danger = false }: { icon: typeof UserRound; label: string; onClick: () => void; danger?: boolean }) {
  return <button type="button" onClick={onClick} className={`focus-app flex min-h-16 w-full items-center gap-4 border-b border-slate-100 px-5 text-left transition-colors last:border-b-0 hover:bg-apex-soft ${danger ? "text-red-600" : "text-apex-navy"}`}><Icon className={`h-5 w-5 ${danger ? "text-red-500" : "text-apex-blue"}`} /><span className="flex-1 text-sm font-extrabold">{label}</span><ChevronRight className="h-4 w-4 text-slate-400" /></button>;
}
