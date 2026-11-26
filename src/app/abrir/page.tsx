import type { Metadata } from "next";
import { SplashAbertura } from "@/components/splash-abertura";

export const metadata: Metadata = {
  title: "ApexFit"
};

/** Página estática e pública: abre na hora enquanto o app carrega por trás. */
export default function AbrirPage() {
  return <SplashAbertura destino="/" />;
}
