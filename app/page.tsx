'use client';
import { useState, useEffect, useMemo } from 'react';
import { MENU } from '@/data/menu';
import OrderSheet from '@/components/OrderSheet';

type CartItem = { name: string; price: number };

export default function Home() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const items = useMemo(() => {
    const map: Record<string, CartItem> = {};
    MENU.forEach((c, ci) =>
      c.items.forEach((it, ii) => {
        map[`${ci}-${ii}`] = { name: it[0] as string, price: it[2] as number };
      })
    );
    return map;
  }, []);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [revealedCards, setRevealedCards] = useState<Set<string>>(() => new Set());
  const [done, setDone] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const visibleIds: string[] = [];
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-card-id');
            if (id) visibleIds.push(id);
            observer.unobserve(entry.target);
          }
        });
        if (visibleIds.length) {
          setRevealedCards(previous => new Set([...previous, ...visibleIds]));
        }
      },
      { threshold: 0, rootMargin: '0px 0px -20px 0px' }
    );

    document.querySelectorAll('.card').forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, []);
  
  const handleDone = () => {
  setDone(true);
  setSheetOpen(false);
};

const handleAgain = () => {
  setDone(false);
  setCart({});
};
  const setQ = (id: string, q: number) => {
    setCart(prev => {
      const next = { ...prev };
      if (q <= 0) delete next[id];
      else next[id] = q;
      return next;
    });
  };


  const total = Object.keys(cart).reduce((s, k) => s + (items[k]?.price || 0) * cart[k], 0);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <>
      {/* HERO */}
      <header className="hero">

  {/* Hidden SVG symbol definitions */}
  <svg width="0" height="0" style={{ position: 'absolute' }}>
    <defs>
      <symbol id="leaf" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="#fff" stroke="#0b5a43" strokeWidth="3"/>
        <g stroke="#0b5a43" strokeWidth="4" fill="none" strokeLinecap="round">
          <path d="M50 88V22"/><path d="M50 88C34 72 30 46 38 26"/>
          <path d="M50 88C66 72 70 46 62 26"/><path d="M50 88C26 76 16 56 20 36"/>
          <path d="M50 88C74 76 84 56 80 36"/>
        </g>
      </symbol>
    </defs>
  </svg>

  {/* Arch lines that draw themselves in */}
  <svg className="arches" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
    <path d="M30 300V120a45 45 0 0 1 90 0V300M75 300V80M120 300V190a60 60 0 0 1 120 0V300M280 300V90a40 40 0 0 1 80 0V300M320 300V60"/>
  </svg>

  {/* Floating orbs */}
  <div className="orb o1"><svg><use href="#leaf"/></svg></div>
  <div className="orb o2"><svg><use href="#leaf"/></svg></div>

  <div className="hero-in">
    <div className="brand"><small>Hotel</small>Monark</div>
    <div className="pill">AC ROOMS</div>
    <p className="tag">In-Room Dining · Pick your dishes, we <b>deliver to your room</b></p>
  </div>

  <svg className="wave" viewBox="0 0 1440 70" preserveAspectRatio="none">
    <path fill="#f5fbf6" d="M0 40C240 80 480 0 720 30s480 40 720 0v40H0z"/>
  </svg>

</header>

      {/* TABS */}
      <nav className="tabs">
        {MENU.map((c, i) => (
          <button
            key={i}
            className={`tab ${activeTab === i ? 'on' : ''}`}
            onClick={() => {
              setActiveTab(i);
              document.getElementById(`c${i}`)?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {c.ico} {c.cat}
          </button>
        ))}
      </nav>

      {/* MENU */}
      <main id="menu">
        {MENU.map((c, ci) => (
          <section key={ci} id={`c${ci}`}>
            <h2>{c.ico} {c.cat}</h2>
            {c.items.map((it, ii) => {
              const id = `${ci}-${ii}`;
              const selected = !!cart[id];
              return (
                <div
                  key={ii}
                  data-card-id={id}
                  className={`card ${revealedCards.has(id) ? 'show' : ''} ${selected ? 'sel' : ''}`}
                  onClick={() => setQ(id, selected ? 0 : 1)}
                >
                  <div className="info">
                    <div className="nm">
                      <i className={`dot ${it[3] ? '' : 'nv'}`}></i>
                      {it[0]}
                    </div>
                    <div className="ds">{it[1]}</div>
                    <div className="pr">{it[2]}</div>
                  </div>
                  <div className="side">
                    <input
                      type="checkbox"
                      className="chk"
                      checked={selected}
                      onChange={() => {}}
                      onClick={e => e.stopPropagation()}
                    />
                    <div
                      className="qty"
                      aria-hidden={!selected}
                      inert={!selected}
                      onClick={e => e.stopPropagation()}
                    >
                      <button
                        tabIndex={selected ? 0 : -1}
                        onClick={() => setQ(id, (cart[id] || 1) - 1)}
                      >
                        −
                      </button>
                      <span>{cart[id] || 1}</span>
                      <button
                        tabIndex={selected ? 0 : -1}
                        onClick={() => setQ(id, (cart[id] || 1) + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        ))}
      </main>

      <footer>
        Opp. Saint Arnold School, Ahmedabad Road, Godhra – 389001<br />
        Reception: <a href="tel:+918980010026">+91 89800 10026</a>
      </footer>

      {/* CART BAR */}
      {count > 0 && (
        <button className="bar on" onClick={() => setSheetOpen(true)}>
          <span>{count} item{count !== 1 ? 's' : ''} · ₹{total}</span>
          <em>View Order ›</em>
        </button>
      )}
      

      {/* ORDER SHEET */}
      {sheetOpen && (
        <>
          <div className="ov on" onClick={() => setSheetOpen(false)} />
          <OrderSheet
            cart={cart}
            items={items}
            total={total}
            onClose={() => setSheetOpen(false)}
            onDone={handleDone}   // ← add this
          />
        </>
        
      )}

      {done && (
  <div className="done on">
    <div className="tick">
      <svg viewBox="0 0 52 52">
        <path d="M12 27l10 10 19-21" stroke="#07402f" strokeWidth="6" fill="none" strokeLinecap="round"/>
      </svg>
    </div>
    <h2>Order Placed!</h2>
    <p>Your order has been sent to reception.<br />We'll deliver to your room shortly.</p>
    <button onClick={handleAgain}>Back to Menu</button>
  </div>
)}
    </>
  );
}