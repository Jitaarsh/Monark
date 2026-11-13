import { NextResponse } from 'next/server';
import { MENU } from '@/data/menu';
import { sendTelegramMessage } from '@/lib/telegram';

const PRICE = new Map(MENU.flatMap(category =>
  category.items.map(item => [item[0], item[2]])
));

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const { name, room, items, note } = body && typeof body === 'object' ? body : {};
  const lines = [];
  let total = 0;

  if (!Array.isArray(items)) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  for (const item of items.slice(0, 60)) {
    if (!item || typeof item.name !== 'string') continue;

    const price = PRICE.get(item.name);
    const qty = Math.min(20, Math.max(1, Math.floor(Number(item.qty))));
    if (price === undefined || !Number.isFinite(qty)) continue;

    total += price * qty;
    lines.push(`${lines.length + 1}. ${item.name} × ${qty} = ₹${price * qty}`);
  }

  if (!lines.length || typeof name !== 'string' || !name.trim() ||
      typeof room !== 'string' || !room.trim()) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  let msg = `New Room Order – Hotel Monark\n\n`;
  msg += `Name: ${name.trim()}\nRoom: ${room.trim()}\n\nItems:\n`;
  msg += lines.join('\n');
  msg += `\n\nTotal: ₹${total}`;
  if (typeof note === 'string' && note.trim()) msg += `\nNote: ${note.trim()}`;

  try {
    await sendTelegramMessage(msg);
    return NextResponse.json({ success: true });
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error('Telegram error:', error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}