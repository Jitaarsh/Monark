export async function sendTelegramMessage(chatId, message) {
  const res = await fetch(
    `https://api.telegram.org/bot${process.env.TG_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,        // ← dynamic, not hardcoded
        text: message,
        parse_mode: 'Markdown',
      }),
    }
  );
  const data = await res.json();
  if (!data.ok) throw new Error(data.description);
  return data;
}