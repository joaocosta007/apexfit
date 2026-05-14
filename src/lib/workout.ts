import { diaAtualApexFit, diasDaSemana } from "@/lib/utils";

type DiaTreinoJson = string | { indice?: number; letra?: string; label?: string; nome?: string };

export type DiaTreinoNormalizado = {
  indice: number;
  letra: string;
  nome: string;
};

export function normalizarDiasTreino(value: unknown): DiaTreinoNormalizado[] {
  if (!Array.isArray(value)) {
    return [];
  }

  let cursorDiaSemana = 0;

  return value
    .map((item: DiaTreinoJson, index) => {
      if (typeof item === "string") {
        const indiceEncontrado = diasDaSemana.findIndex(
          (dia, indice) => indice >= cursorDiaSemana && dia.label === item
        );
        const indice = indiceEncontrado >= 0 ? indiceEncontrado : index;
        const fallback = diasDaSemana[indice] ?? diasDaSemana[index] ?? diasDaSemana[0];
        cursorDiaSemana = Math.min(indice + 1, diasDaSemana.length);

        return {
          indice,
          letra: item,
          nome: fallback.nome
        };
      }

      const indice = typeof item.indice === "number" ? item.indice : index;
      const fallback = diasDaSemana[indice] ?? diasDaSemana[index] ?? diasDaSemana[0];
      cursorDiaSemana = Math.min(indice + 1, diasDaSemana.length);

      return {
        indice,
        letra: item.letra ?? item.label ?? fallback.label,
        nome: item.nome ?? fallback.nome
      };
    })
    .filter((item) => item.indice >= 0 && item.indice <= 6);
}

export function resumoDiasTreino(value: unknown) {
  const dias = normalizarDiasTreino(value);

  if (!dias.length) {
    return "Nenhum dia definido";
  }

  return dias.map((dia) => dia.letra).join(" • ");
}

export function indicesDiasTreino(value: unknown) {
  return normalizarDiasTreino(value).map((dia) => dia.indice);
}

export function selecionarIndiceSplitPorDia(trainingDays: unknown, splitCount: number, dayIndex: number) {
  if (splitCount <= 0) {
    return null;
  }

  const dias = normalizarDiasTreino(trainingDays);
  const posicaoDoTreino = dias.findIndex((dia) => dia.indice === dayIndex);

  if (posicaoDoTreino < 0) {
    return null;
  }

  return posicaoDoTreino % splitCount;
}

export function selecionarIndiceSplitDoDia(trainingDays: unknown, splitCount: number) {
  return selecionarIndiceSplitPorDia(trainingDays, splitCount, diaAtualApexFit());
}

export function diaPossuiTreino(trainingDays: unknown, dayIndex: number) {
  return normalizarDiasTreino(trainingDays).some((dia) => dia.indice === dayIndex);
}