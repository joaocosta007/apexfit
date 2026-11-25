import type { Metadata } from "next";
import { headers } from "next/headers";
import QRCode from "qrcode";
import { BrandMark } from "@/components/brand-mark";
import { InstallAction } from "@/components/install-action";

export const metadata: Metadata = {
  title: "Instalar ApexFit",
  description: "Adicione o ApexFit à tela inicial do seu celular."
};

/**
 * Guarda o evento `beforeinstallprompt` assim que o HTML é lido: no Android ele
 * pode disparar antes da hidratação do React e seria perdido.
 */
const capturarPromptDeInstalacao = `
window.addEventListener("beforeinstallprompt", function (event) {
  event.preventDefault();
  window.__apexInstallPrompt = event;
  window.dispatchEvent(new Event("apex:installprompt"));
});
`;

async function urlDaPagina() {
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host") ?? "localhost:3000";
  const protocolo =
    headersList.get("x-forwarded-proto") ?? (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
  return `${protocolo}://${host}/instalar`;
}

async function qrCodeSvg(url: string) {
  const svg = await QRCode.toString(url, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
    color: { dark: "#000000", light: "#0000" }
  });
  // A cor dos módulos herda do texto (token apex-navy) em vez de um hex fixo.
  return svg.replace(/stroke="#000000"/g, 'stroke="currentColor"');
}

export default async function InstalarPage() {
  const installUrl = await urlDaPagina();
  const qrSvg = await qrCodeSvg(installUrl);

  return (
    <main className="min-h-[100dvh] bg-apex-ink text-white lg:flex lg:items-center lg:justify-center lg:p-8">
      <script dangerouslySetInnerHTML={{ __html: capturarPromptDeInstalacao }} />
      <section className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-apex-ink lg:min-h-[720px] lg:max-w-[440px] lg:rounded-[2.5rem] lg:shadow-floating">
        <div className="pointer-events-none absolute -right-20 top-8 h-56 w-56 rounded-full bg-apex-blue/20 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-24 top-44 h-44 w-44 rounded-full bg-apex-surface/5 blur-3xl" aria-hidden="true" />

        <header className="relative flex flex-1 flex-col items-center justify-center px-7 pb-10 pt-[max(2.5rem,env(safe-area-inset-top))] text-center">
          <BrandMark inverted />
          <h1 className="mt-6 max-w-[17rem] text-2xl font-black tracking-tight text-white">
            Seu treino na tela inicial do celular.
          </h1>
          <p className="mt-3 max-w-[18rem] text-sm leading-6 text-white/65">
            Instale o app para abrir em um toque, como qualquer outro aplicativo.
          </p>
        </header>

        <div className="login-sheet-enter relative rounded-t-[2.5rem] bg-apex-surface px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-8 text-apex-ink shadow-floating sm:px-9 lg:rounded-[2.5rem]">
          <div className="mx-auto mb-7 h-1.5 w-12 rounded-full bg-apex-muted/20" aria-hidden="true" />
          <InstallAction installUrl={installUrl} qrSvg={qrSvg} />
        </div>
      </section>
    </main>
  );
}
