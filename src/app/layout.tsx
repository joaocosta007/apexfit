import type { Metadata, Viewport } from "next";
import { ServiceWorkerInit } from "@/components/service-worker-init";
import "./globals.css";

export const metadata: Metadata = {
  title: "ApexFit",
  description: "Gestão inteligente de treinos — CENAPE",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "ApexFit",
    statusBarStyle: "default"
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg"
  }
};

export const viewport: Viewport = {
  themeColor: "#1E40AF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ServiceWorkerInit />
        {children}
      </body>
    </html>
  );
}
