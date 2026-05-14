import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatarCarga(valor?: number | null) {
  if (valor === null || valor === undefined) {
    return "0 kg";
  }

  return `${valor.toLocaleString("pt-BR", {
    minimumFractionDigits: valor % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 1
  })} kg`;
}

export function iniciais(nome: string) {
  return nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join("");
}

export const diasDaSemana = [
  { label: "S", nome: "Segunda" },
  { label: "T", nome: "Terça" },
  { label: "Q", nome: "Quarta" },
  { label: "Q", nome: "Quinta" },
  { label: "S", nome: "Sexta" },
  { label: "S", nome: "Sábado" },
  { label: "D", nome: "Domingo" }
] as const;

export function diaAtualApexFit() {
  const indiceJs = new Date().getDay();
  const mapa = [6, 0, 1, 2, 3, 4, 5];
  return mapa[indiceJs] ?? 0;
}