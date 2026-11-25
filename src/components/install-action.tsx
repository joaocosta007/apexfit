"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, CheckCircle2, Copy, Download, Globe, LoaderCircle, Share, SquarePlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

declare global {
  interface Window {
    __apexInstallPrompt?: BeforeInstallPromptEvent;
  }
}

type Aparelho = "detectando" | "instalado" | "navegador-interno" | "iphone" | "android" | "computador";

const NAVEGADOR_INTERNO = /FBAN|FBAV|FB_IAB|Instagram|WhatsApp|Line\/|Twitter|LinkedInApp|Snapchat|TikTok|musical_ly|Bytedance|Pinterest|GSA\/|; wv\)/i;
const IOS_FORA_DO_SAFARI = /CriOS|FxiOS|EdgiOS|OPiOS|OPT\/|YaBrowser|DuckDuckGo|GSA\//i;
const ESPERA_PELO_PROMPT_MS = 3500;

function detectarAparelho(): Aparelho {
  const ua = navigator.userAgent;
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;

  if (standalone) return "instalado";

  if (NAVEGADOR_INTERNO.test(ua)) return "navegador-interno";
  if (/Android/i.test(ua)) return "android";
  const ios = /iPhone|iPad|iPod/.test(ua) || ehIpadComoMac(ua);
  if (ios) return /Safari/.test(ua) && !IOS_FORA_DO_SAFARI.test(ua) ? "iphone" : "navegador-interno";
  return "computador";
}

/** iPadOS 13+ se apresenta como Mac; só a tela de toque o denuncia. */
function ehIpadComoMac(ua: string) {
  return /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
}

async function copiarTexto(texto: string) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    // Navegadores internos costumam bloquear a Clipboard API.
    const campo = document.createElement("textarea");
    campo.value = texto;
    campo.setAttribute("readonly", "");
    campo.style.position = "fixed";
    campo.style.opacity = "0";
    document.body.appendChild(campo);
    campo.select();
    const copiado = document.execCommand("copy");
    campo.remove();
    return copiado;
  }
}

const semInscricao = () => () => {};

export function InstallAction({ installUrl, qrSvg }: { installUrl: string; qrSvg: string }) {
  const router = useRouter();
  // No servidor não há navigator: mostra o carregando e detecta só no cliente.
  const aparelho = useSyncExternalStore<Aparelho>(semInscricao, detectarAparelho, () => "detectando");

  useEffect(() => {
    if (aparelho === "instalado") router.replace("/");
  }, [aparelho, router]);

  return (
    <div aria-live="polite">
      {aparelho === "detectando" ? <Detectando /> : null}
      {aparelho === "instalado" ? <AbrindoApp /> : null}
      {aparelho === "android" ? <InstalarAndroid /> : null}
      {aparelho === "iphone" ? <InstalarIphone /> : null}
      {aparelho === "navegador-interno" ? <AbrirNoNavegador installUrl={installUrl} /> : null}
      {aparelho === "computador" ? <EscanearQrCode installUrl={installUrl} qrSvg={qrSvg} /> : null}
    </div>
  );
}

function Titulo({ children, descricao }: { children: React.ReactNode; descricao: React.ReactNode }) {
  return (
    <div className="text-center">
      <h2 className="text-xl font-black tracking-tight">{children}</h2>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-apex-muted">{descricao}</p>
    </div>
  );
}

function Detectando() {
  return (
    <div className="flex h-[10.5rem] items-center justify-center" role="status">
      <LoaderCircle className="h-6 w-6 animate-spin text-apex-muted motion-reduce:animate-none" aria-hidden="true" />
      <span className="sr-only">Verificando seu aparelho…</span>
    </div>
  );
}

function AbrindoApp() {
  return (
    <div className="flex h-[10.5rem] flex-col items-center justify-center gap-3" role="status">
      <CheckCircle2 className="h-8 w-8 text-apex-green" aria-hidden="true" />
      <p className="text-sm font-semibold text-apex-muted">O ApexFit já está instalado. Abrindo o app…</p>
    </div>
  );
}

function InstalarAndroid() {
  // Só é montado no cliente, então o prompt capturado antes da hidratação já pode ser lido aqui.
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(() => window.__apexInstallPrompt ?? null);
  const [esgotouEspera, setEsgotouEspera] = useState(false);
  const [instalando, setInstalando] = useState(false);
  const [instalado, setInstalado] = useState(false);

  useEffect(() => {
    const aoReceberPrompt = (event: Event) => {
      event.preventDefault?.();
      setPrompt((window.__apexInstallPrompt ?? event) as BeforeInstallPromptEvent);
    };
    const aoInstalar = () => {
      window.__apexInstallPrompt = undefined;
      setPrompt(null);
      setInstalado(true);
    };

    window.addEventListener("apex:installprompt", aoReceberPrompt);
    window.addEventListener("beforeinstallprompt", aoReceberPrompt);
    window.addEventListener("appinstalled", aoInstalar);
    const timer = window.setTimeout(() => setEsgotouEspera(true), ESPERA_PELO_PROMPT_MS);

    return () => {
      window.removeEventListener("apex:installprompt", aoReceberPrompt);
      window.removeEventListener("beforeinstallprompt", aoReceberPrompt);
      window.removeEventListener("appinstalled", aoInstalar);
      window.clearTimeout(timer);
    };
  }, []);

  async function instalar() {
    if (!prompt) return;
    setInstalando(true);
    try {
      await prompt.prompt();
      const { outcome } = await prompt.userChoice;
      if (outcome === "accepted") setInstalado(true);
    } catch {
      toast.error("Não foi possível abrir a instalação", {
        description: "Use o menu ⋮ do navegador e toque em Instalar app."
      });
    } finally {
      // O evento só pode ser usado uma vez.
      window.__apexInstallPrompt = undefined;
      setPrompt(null);
      setInstalando(false);
    }
  }

  if (instalado) {
    return (
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 className="h-9 w-9 text-apex-green" aria-hidden="true" />
        <Titulo descricao="O ApexFit foi adicionado à sua tela inicial. Abra pelo ícone sempre que for treinar.">Pronto!</Titulo>
      </div>
    );
  }

  if (!prompt && esgotouEspera) {
    return (
      <div>
        <Titulo descricao="Toque no menu ⋮ do navegador e escolha Instalar app ou Adicionar à tela inicial.">
          Adicione pelo menu
        </Titulo>
        <div className="mt-6 flex items-center justify-center gap-3 rounded-control bg-apex-soft px-4 py-4 text-sm font-semibold text-apex-navy">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-apex-surface text-lg font-black shadow-card" aria-hidden="true">
            ⋮
          </span>
          <span aria-hidden="true">→</span>
          <span>Instalar app</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Titulo descricao="Fica na tela inicial e abre em tela cheia, sem barra do navegador.">Instale em um toque</Titulo>
      <Button type="button" size="lg" className="mt-6 w-full" onClick={instalar} disabled={!prompt || instalando}>
        {!prompt || instalando ? (
          <LoaderCircle className="mr-2 h-5 w-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
        ) : (
          <Download className="mr-2 h-5 w-5" aria-hidden="true" />
        )}
        {prompt ? "Adicionar à tela inicial" : "Preparando instalação…"}
      </Button>
    </div>
  );
}

function InstalarIphone() {
  const iPad = /iPad/.test(navigator.userAgent) || ehIpadComoMac(navigator.userAgent);

  return (
    <div className={iPad ? undefined : "pb-12"}>
      <Titulo
        descricao={
          <>
            Toque em <strong className="text-apex-navy">Compartilhar ⬆️</strong> e depois em{" "}
            <strong className="text-apex-navy">Adicionar à Tela de Início</strong>.
          </>
        }
      >
        Adicione pelo Safari
      </Titulo>

      <ol className="mt-6 grid grid-cols-2 gap-3 text-sm font-semibold text-apex-navy">
        <li className="flex flex-col items-center gap-2 rounded-control bg-apex-soft px-3 py-4 text-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-apex-surface text-apex-blue shadow-card">
            <Share className="h-5 w-5" aria-hidden="true" />
          </span>
          1. Compartilhar
        </li>
        <li className="flex flex-col items-center gap-2 rounded-control bg-apex-soft px-3 py-4 text-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-apex-surface text-apex-blue shadow-card">
            <SquarePlus className="h-5 w-5" aria-hidden="true" />
          </span>
          2. Adicionar à Tela de Início
        </li>
      </ol>

      <p className="mt-4 text-center text-xs leading-5 text-apex-muted">
        Não achou o botão? Toque em <span className="font-bold">•••</span> na barra do Safari.
      </p>

      {iPad ? null : (
        <div
          className="pointer-events-none fixed inset-x-0 bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-20 flex justify-center"
          aria-hidden="true"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-apex-blue text-white shadow-action motion-safe:animate-bounce">
            <ArrowDown className="h-6 w-6" strokeWidth={2.6} />
          </span>
        </div>
      )}
    </div>
  );
}

function AbrirNoNavegador({ installUrl }: { installUrl: string }) {
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent);
  const navegador = ios ? "Safari" : "Chrome";

  async function copiar() {
    const copiado = await copiarTexto(installUrl);
    if (copiado) {
      toast.success("Link copiado", { description: `Agora cole na barra de endereço do ${navegador}.` });
    } else {
      toast.error("Não foi possível copiar", { description: "Toque e segure o link abaixo para copiar." });
    }
  }

  return (
    <div>
      <Titulo descricao={`Por aqui não dá para instalar. Copie o link e abra no ${navegador} para continuar.`}>
        Abra no navegador
      </Titulo>
      <Button type="button" size="lg" className="mt-6 w-full" onClick={copiar}>
        <Copy className="mr-2 h-5 w-5" aria-hidden="true" />
        Copiar link
      </Button>
      <p className="mt-4 flex items-center justify-center gap-1.5 break-all text-center text-xs font-medium text-apex-muted select-all">
        <Globe className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
        {installUrl}
      </p>
    </div>
  );
}

function EscanearQrCode({ installUrl, qrSvg }: { installUrl: string; qrSvg: string }) {
  return (
    <div>
      <Titulo descricao="Aponte a câmera do celular para o código e siga as instruções na tela.">Abra no seu celular</Titulo>
      <div
        className="mx-auto mt-6 h-48 w-48 rounded-card border border-border bg-apex-surface p-4 text-apex-navy shadow-card [&>svg]:h-full [&>svg]:w-full"
        role="img"
        aria-label={`QR code com o link ${installUrl}`}
        dangerouslySetInnerHTML={{ __html: qrSvg }}
      />
      <p className="mt-4 break-all text-center text-xs font-medium text-apex-muted select-all">{installUrl}</p>
    </div>
  );
}
