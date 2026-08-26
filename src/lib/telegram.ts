type TelegramSendResult = {
  ok: boolean;
  description?: string;
};

export async function sendTelegramMessage(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error("TELEGRAM_BOT_TOKEN e TELEGRAM_CHAT_ID precisam estar configurados.");
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      disable_web_page_preview: true
    }),
    signal: AbortSignal.timeout(10_000)
  });

  const result = (await response.json()) as TelegramSendResult;

  if (!response.ok || !result.ok) {
    throw new Error(result.description || `Telegram respondeu com HTTP ${response.status}.`);
  }
}
