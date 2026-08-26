import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { buildMonitoringReport, type ReportPeriod } from "@/lib/monitoring-report";
import { sendTelegramMessage } from "@/lib/telegram";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isAuthorized(request: Request) {
  const configuredSecret = process.env.REPORT_CRON_SECRET;
  const authorization = request.headers.get("authorization");
  const receivedSecret = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";

  if (!configuredSecret || !receivedSecret) return false;

  const configuredBuffer = Buffer.from(configuredSecret);
  const receivedBuffer = Buffer.from(receivedSecret);

  return (
    configuredBuffer.length === receivedBuffer.length &&
    timingSafeEqual(configuredBuffer, receivedBuffer)
  );
}

function parsePeriod(request: Request): ReportPeriod {
  const requestedPeriod = new URL(request.url).searchParams.get("period");
  return requestedPeriod === "evening" ? "evening" : "morning";
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const period = parsePeriod(request);

  try {
    const report = await buildMonitoringReport(period);
    await sendTelegramMessage(report);

    return NextResponse.json(
      { ok: true, period, sentAt: new Date().toISOString() },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Falha ao gerar relatório do ApexFit:", error);

    try {
      await sendTelegramMessage(
        [
          "🔴 APEXFIT — FALHA NO RELATÓRIO",
          `🕒 ${new Intl.DateTimeFormat("pt-BR", {
            timeZone: "America/Sao_Paulo",
            dateStyle: "short",
            timeStyle: "short"
          }).format(new Date())}`,
          "Não foi possível consultar o banco de dados. Verifique o Supabase e a Vercel."
        ].join("\n")
      );

      return NextResponse.json(
        { ok: false, alertSent: true, period },
        { headers: { "Cache-Control": "no-store" } }
      );
    } catch (notificationError) {
      console.error("Falha ao enviar alerta ao Telegram:", notificationError);
      return NextResponse.json(
        { error: "Não foi possível gerar nem enviar o relatório." },
        { status: 502, headers: { "Cache-Control": "no-store" } }
      );
    }
  }
}
