import { NextResponse } from 'next/server';
import { MENU, FAST_FOOD_CATEGORIES } from '@/data/menu';
import { sendTelegramMessage } from '@/lib/telegram';

const ITEM_INFO = new Map(MENU.flatMap(category =>
  category.items.map(item => [
    item[0],
    {
      price: item[2],
      isFastFood: FAST_FOOD_CATEGORIES.has(category.cat),
      catName: category.cat
    }
  ])
));

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const { name, room, phone, items, note } = body && typeof body === 'object' ? body : {};
  let total = 0;

  if (!Array.isArray(items)) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const mainLines = [];
  const fastFoodLines = [];

  for (const item of items.slice(0, 60)) {
    if (!item || typeof item.name !== 'string') continue;

    const info = ITEM_INFO.get(item.name);
    const qty = Math.min(20, Math.max(1, Math.floor(Number(item.qty))));
    if (!info || !Number.isFinite(qty)) continue;

    const lineTotal = info.price * qty;
    total += lineTotal;

    const record = {
      name: item.name,
      qty,
      price: info.price,
      lineTotal
    };

    if (info.isFastFood) {
      fastFoodLines.push(record);
    } else {
      mainLines.push(record);
    }
  }

  if ((!mainLines.length && !fastFoodLines.length) ||
      typeof name !== 'string' || !name.trim() ||
      typeof room !== 'string' || !room.trim() ||
      typeof phone !== 'string' || !phone.trim()) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  let msg = `🛎️ New Room Order – Hotel Monark\n\n`;
  msg += `👤 Name: ${name.trim()}\n`;
  msg += `🚪 Room: ${room.trim()}\n`;
  msg += `📞 Phone: ${phone.trim()}\n\n`;

  if (mainLines.length > 0) {
    msg += `🍽️ Main Course / Normal Food:\n`;
    mainLines.forEach((it, idx) => {
      msg += `  ${idx + 1}. ${it.name} × ${it.qty} = ₹${it.lineTotal}\n`;
    });
    msg += `\n`;
  }

  if (fastFoodLines.length > 0) {
    msg += `🍔 Fast Food:\n`;
    fastFoodLines.forEach((it, idx) => {
      msg += `  ${idx + 1}. ${it.name} × ${it.qty} = ₹${it.lineTotal}\n`;
    });
    msg += `\n`;
  }

  msg += `💰 Total: ₹${total}`;
  if (typeof note === 'string' && note.trim()) {
    msg += `\n📝 Note: ${note.trim()}`;
  }

  try {
    await sendTelegramMessage(msg);
    return NextResponse.json({ success: true });
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error('Telegram error:', error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
