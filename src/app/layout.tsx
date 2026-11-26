import type { Metadata, Viewport } from "next";
import { ServiceWorkerInit } from "@/components/service-worker-init";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

/**
 * Imagens de abertura do iOS (apple-touch-startup-image): sem elas o iPhone
 * mostra uma tela preta enquanto o app inicia. São do mesmo azul da tela
 * /abrir, para emendar na animação. Uma por tamanho de tela (pontos × escala).
 */
const telasIphone = [
  { w: 440, h: 956, escala: 3 }, // 16/17 Pro Max
  { w: 420, h: 912, escala: 3 }, // Air
  { w: 402, h: 874, escala: 3 }, // 16/17 Pro, 17
  { w: 430, h: 932, escala: 3 }, // 14 Pro Max, 15 Plus/Pro Max, 16 Plus
  { w: 393, h: 852, escala: 3 }, // 14 Pro, 15, 15 Pro, 16, 16e
  { w: 428, h: 926, escala: 3 }, // 12/13 Pro Max, 14 Plus
  { w: 390, h: 844, escala: 3 }, // 12, 13, 14
  { w: 375, h: 812, escala: 3 }, // X, XS, 11 Pro, 12/13 mini
  { w: 414, h: 896, escala: 3 }, // XS Max, 11 Pro Max
  { w: 414, h: 896, escala: 2 }, // XR, 11
  { w: 414, h: 736, escala: 3 }, // 6+/7+/8 Plus
  { w: 375, h: 667, escala: 2 }, // 6/7/8, SE 2ª/3ª
  { w: 320, h: 568, escala: 2 } // SE 1ª
];

const imagensDeAbertura = telasIphone.map(({ w, h, escala }) => ({
  url: `/splash/iphone-${w * escala}x${h * escala}.png`,
  media: `(device-width: ${w}px) and (device-height: ${h}px) and (-webkit-device-pixel-ratio: ${escala}) and (orientation: portrait)`
}));

export const metadata: Metadata = {
  title: "ApexFit",
  description: "Gestão inteligente de treinos — CENAPE",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "ApexFit",
    statusBarStyle: "default",
    startupImage: imagensDeAbertura
  },
  // O Next 16 só gera "mobile-web-app-capable"; o iOS ainda depende da versão
  // "apple-" para usar as imagens de abertura acima.
  other: {
    "apple-mobile-web-app-capable": "yes"
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-touch-icon.png"
  }
};

export const viewport: Viewport = {
  themeColor: "#0d2342",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  // Libera env(safe-area-inset-*) no iPhone; sem isso a safe area vale 0 no PWA.
  viewportFit: "cover"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ServiceWorkerInit />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
