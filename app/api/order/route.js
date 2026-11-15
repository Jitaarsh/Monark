import { NextResponse } from 'next/server';
import { MENU } from '@/data/menu';
import { sendTelegramMessage } from '@/lib/telegram';

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

  const breakfastLines = [];
  const fastFoodLines = [];
  const mainLines = [];

  for (const item of items.slice(0, 60)) {
    if (!item || typeof item.name !== 'string') continue;

    let info = null;

    // 1. Direct index lookup if id is provided (format: `${ci}-${ii}`)
    if (typeof item.id === 'string' && item.id.includes('-')) {
      const [ciStr, iiStr] = item.id.split('-');
      const cat = MENU[Number(ciStr)];
      const raw = cat?.items?.[Number(iiStr)];
      if (cat && raw) {
        info = {
          price: raw[2],
          section: cat.section || 'main',
          catName: cat.cat
        };
      }
    }

    // 2. Fallback search by item name or base name
    if (!info) {
      const baseName = item.name.replace(/\s*\([^)]+\)$/, '').trim();
      for (const cat of MENU) {
        const found = cat.items.find(it => it[0] === item.name || it[0] === baseName);
        if (found) {
          info = {
            price: found[2],
            section: cat.section || 'main',
            catName: cat.cat
          };
          break;
        }
      }
    }

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

    if (info.section === 'breakfast') {
      breakfastLines.push(record);
    } else if (info.section === 'fastfood') {
      fastFoodLines.push(record);
    } else {
      mainLines.push(record);
    }
  }

  if ((!breakfastLines.length && !fastFoodLines.length && !mainLines.length) ||
      typeof name !== 'string' || !name.trim() ||
      typeof room !== 'string' || !room.trim() ||
      typeof phone !== 'string' || !phone.trim()) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  let msg = `🛎️ New Room Order – Hotel Monark\n\n`;
  msg += `👤 Name: ${name.trim()}\n`;
  msg += `🚪 Room: ${room.trim()}\n`;
  msg += `📞 Phone: ${phone.trim()}\n\n`;

  if (breakfastLines.length > 0) {
    msg += `🌅 Breakfast:\n`;
    breakfastLines.forEach((it, idx) => {
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

  if (mainLines.length > 0) {
    msg += `🍽️ Main Course:\n`;
    mainLines.forEach((it, idx) => {
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
