export async function sendTelegramMessage(message) {
  const ids = (process.env.TG_CHAT_ID || '')
    .split(',')
    .map(id => id.trim())
    .filter(Boolean);

  const results = await Promise.allSettled(ids.map(chat_id =>
    fetch(`https://api.telegram.org/bot${process.env.TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id, text: message }),
    }).then(res => res.json()).then(data => {
      if (!data.ok) throw new Error(data.description);
    })
  ));

  if (!results.some(result => result.status === 'fulfilled')) {
    throw new Error('No Telegram recipient received the order');
  }
}