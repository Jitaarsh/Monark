import { NextResponse } from 'next/server';
import { sendTelegramMessage } from '@/lib/telegram';

export async function POST(req) {
  const { name, room, items, total, note } = await req.json();

  let msg = `*New Room Order – Hotel Monark*\n\n`;
  msg += `*Name:* ${name}\n*Room:* ${room}\n\n*Items:*\n`;
  items.forEach((it, i) => {
    msg += `${i + 1}. ${it.name} × ${it.qty} = ₹${it.price * it.qty}\n`;
  });
  msg += `\n*Total:* ₹${total}`;
  if (note) msg += `\n*Note:* ${note}`;

  try {
    await sendTelegramMessage(msg);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Telegram error:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}