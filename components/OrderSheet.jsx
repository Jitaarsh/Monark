'use client';
import { useState } from 'react';

export default function OrderSheet({ cart, items, total, onClose, onDone }) {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const errs = {};
    if (!name.trim()) errs.name = true;
    if (!room.trim()) errs.room = true;
    if (!phone.trim()) errs.phone = true;
    if (Object.keys(errs).length) return setErrors(errs);

    const payload = {
      name: name.trim(),
      room: room.trim(),
      phone: phone.trim(),
      note: note.trim(),
      total,
      items: Object.keys(cart).map(id => ({
        name: items[id].name,
        qty: cart[id],
        price: items[id].price,
      })),
    };

    setLoading(true);
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        alert('Failed to send order. Try again.');
        return;
      }

      const data = await res.json();
      if (data.success) onDone();
      else alert('Failed to send order. Try again.');
    } catch (err) {
      console.error(err);
      alert('Network error. Your order was NOT sent. Please try again or call reception.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sheet on">
      <button className="x" onClick={onClose}>×</button>
      <h3>Your Order</h3>

      <div id="lines">
        {Object.keys(cart).map(k => (
          <div className="ln" key={k}>
            <span>{items[k]?.name} × {cart[k]}</span>
            <b>₹{items[k]?.price * cart[k]}</b>
          </div>
        ))}
      </div>

      <div className="tot">
        <span>Total</span>
        <span>₹{total}</span>
      </div>

      <label>Your Name</label>
      <input
        type="text"
        className={errors.name ? 'err' : ''}
        value={name}
        onChange={e => { setName(e.target.value); setErrors(p => ({...p, name: false})); }}
        placeholder="e.g. Rahul Shah"
      />

      <label>Room Number</label>
      <input
        type="text"
        className={errors.room ? 'err' : ''}
        value={room}
        onChange={e => { setRoom(e.target.value); setErrors(p => ({...p, room: false})); }}
        placeholder="e.g. 204"
        inputMode="numeric"
      />

      <label>Phone Number</label>
      <input
        type="tel"
        className={errors.phone ? 'err' : ''}
        value={phone}
        onChange={e => { setPhone(e.target.value); setErrors(p => ({...p, phone: false})); }}
        placeholder="e.g. 98765 43210"
        inputMode="tel"
      />

      <label>Special Instructions (optional)</label>
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        rows={2}
        placeholder="Less spicy, no onion…"
      />

      <button className="go" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Sending Order…' : 'Send Order to Reception'}
      </button>
      <p className="note">Your order goes directly to reception.</p>
    </div>
  );
}
