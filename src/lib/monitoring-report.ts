import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type ReportPeriod = "morning" | "evening";

const DATABASE_LIMIT_BYTES = 500 * 1024 * 1024;
const SAO_PAULO_TIME_ZONE = "America/Sao_Paulo";

function getTimeZoneOffsetMs(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const representedAsUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second)
  );

  return representedAsUtc - date.getTime();
}

function startOfTodayInSaoPaulo(now: Date) {
  const dateParts = new Intl.DateTimeFormat("en-US", {
    timeZone: SAO_PAULO_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(now);
  const values = Object.fromEntries(dateParts.map((part) => [part.type, part.value]));
  const localMidnightAsUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day)
  );
  const guess = new Date(localMidnightAsUtc);
  const offset = getTimeZoneOffsetMs(guess, SAO_PAULO_TIME_ZONE);

  return new Date(localMidnightAsUtc - offset);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: SAO_PAULO_TIME_ZONE,
    dateStyle: "short",
    timeStyle: "short"
  }).format(value);
}

function databaseIndicator(percent: number) {
  if (percent >= 90) return "🔴";
  if (percent >= 70) return "⚠️";
  return "🟢";
}

export async function buildMonitoringReport(period: ReportPeriod) {
  const startedAt = new Date();
  const periodStart =
    period === "morning"
      ? new Date(startedAt.getTime() - 24 * 60 * 60 * 1000)
      : startOfTodayInSaoPaulo(startedAt);

  const [
    databaseSizeRows,
    students,
    trainers,
    activePlans,
    newStudents,
    workoutLogs,
    studentsWhoTrained,
    assessments
  ] = await Promise.all([
    prisma.$queryRaw<Array<{ bytes: bigint }>>`SELECT pg_database_size(current_database()) AS bytes`,
    prisma.user.count({ where: { role: Role.STUDENT } }),
    prisma.user.count({ where: { role: Role.TRAINER } }),
    prisma.workoutPlan.count({ where: { isActive: true } }),
    prisma.user.count({
      where: { role: Role.STUDENT, createdAt: { gte: periodStart } }
    }),
    prisma.workoutLog.count({ where: { date: { gte: periodStart } } }),
    prisma.workoutLog.findMany({
      where: { date: { gte: periodStart } },
      select: { studentId: true },
      distinct: ["studentId"]
    }),
    prisma.physicalAssessment.count({ where: { createdAt: { gte: periodStart } } })
  ]);

  const databaseBytes = databaseSizeRows[0] ? Number(databaseSizeRows[0].bytes) : 0;
  const databaseMb = databaseBytes / 1024 / 1024;
  const databasePercent = (databaseBytes / DATABASE_LIMIT_BYTES) * 100;
  const elapsedMs = Date.now() - startedAt.getTime();
  const periodLabel = period === "morning" ? "Últimas 24 horas" : "Hoje, desde 00h";
  const title = period === "morning" ? "RELATÓRIO DA MANHÃ" : "RELATÓRIO DA NOITE";

  return [
    `📊 APEXFIT — ${title}`,
    `🕒 ${formatDateTime(startedAt)}`,
    "",
    "🟢 Aplicação: online",
    "🟢 Banco de dados: conectado",
    `${databaseIndicator(databasePercent)} Espaço: ${databaseMb.toFixed(1)} MB de 500 MB (${databasePercent.toFixed(1)}%)`,
    `⚡ Consulta de saúde: ${formatNumber(elapsedMs)} ms`,
    "",
    `📅 Período: ${periodLabel}`,
    `👥 Alunos cadastrados: ${formatNumber(students)}`,
    `🧑‍🏫 Professores cadastrados: ${formatNumber(trainers)}`,
    `📋 Planos ativos: ${formatNumber(activePlans)}`,
    `🆕 Novos alunos: ${formatNumber(newStudents)}`,
    `🏋️ Alunos que treinaram: ${formatNumber(studentsWhoTrained.length)}`,
    `✅ Exercícios registrados: ${formatNumber(workoutLogs)}`,
    `📏 Avaliações registradas: ${formatNumber(assessments)}`
  ].join("\n");
}
