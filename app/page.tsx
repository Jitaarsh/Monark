'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import { MENU } from '@/data/menu';
import OrderSheet from '@/components/OrderSheet';

type CartItem = { name: string; price: number };

export default function Home() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const ribbonRef = useRef<HTMLDivElement>(null);

  const items = useMemo(() => {
    const map: Record<string, CartItem> = {};
    MENU.forEach((c, ci) =>
      c.items.forEach((it, ii) => {
        map[`${ci}-${ii}`] = { name: it[0] as string, price: it[2] as number };
      })
    );
    return map;
  }, []);

  const searchableItems = useMemo(() => {
    const list: Array<{
      id: string;
      raw: [string, string, number, number];
      catName: string;
      catIco: string;
    }> = [];
    MENU.forEach((c, ci) => {
      c.items.forEach((it, ii) => {
        list.push({
          id: `${ci}-${ii}`,
          raw: it as [string, string, number, number],
          catName: c.cat,
          catIco: c.ico,
        });
      });
    });
    return list;
  }, []);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return searchableItems.filter(
      item =>
        item.raw[0].toLowerCase().includes(q) ||
        item.raw[1].toLowerCase().includes(q) ||
        item.catName.toLowerCase().includes(q)
    );
  }, [searchQuery, searchableItems]);

  const [sheetOpen, setSheetOpen]   = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeTab, setActiveTab]   = useState(0);
  const [revealedCards, setRevealedCards] = useState<Set<string>>(() => new Set());
  const [done, setDone] = useState(false);

  /* Scroll-spy — update activeTab as user scrolls */
  useEffect(() => {
    if (searchQuery.trim()) return;
    const sections = MENU.map((_, i) => document.getElementById(`c${i}`)).filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const obs = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const id = visible[0].target.id;
          const idx = parseInt(id.replace('c', ''), 10);
          if (!isNaN(idx)) setActiveTab(idx);
        }
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0 }
    );
    sections.forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, [searchQuery]);

  /* Auto-scroll active pill into view */
  useEffect(() => {
    if (ribbonRef.current) {
      const activeEl = ribbonRef.current.querySelector<HTMLElement>('.cat-pill.active');
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [activeTab]);

  /* Card reveal animation */
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
      { threshold: 0, rootMargin: '60px 0px 0px 0px' }
    );
    document.querySelectorAll('.card').forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, [searchQuery]);

  const handleDone  = () => { setDone(true); setSheetOpen(false); };
  const handleAgain = () => { setDone(false); setCart({}); };

  const setQ = (id: string, q: number) => {
    setCart(prev => {
      const next = { ...prev };
      if (q <= 0) delete next[id];
      else next[id] = q;
      return next;
    });
  };

  const jumpTo = (i: number) => {
    if (searchQuery) setSearchQuery('');
    setPickerOpen(false);
    setActiveTab(i);
    setTimeout(() => {
      document.getElementById(`c${i}`)?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  };

  const total = Object.keys(cart).reduce((s, k) => s + (items[k]?.price || 0) * cart[k], 0);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);

  const renderCard = (
    id: string,
    it: [string, string, number, number],
    catBadge?: { ico: string; name: string }
  ) => {
    const selected = !!cart[id];
    const isRevealed = revealedCards.has(id) || !!searchQuery.trim();
    return (
      <div
        key={id}
        data-card-id={id}
        className={`card ${isRevealed ? 'show' : ''} ${selected ? 'sel' : ''}`}
        onClick={() => setQ(id, selected ? 0 : 1)}
      >
        <div className="info">
          {catBadge && (
            <span className="item-cat-badge">
              {catBadge.ico} {catBadge.name}
            </span>
          )}
          <div className="nm">
            <i className={`dot ${it[3] ? '' : 'nv'}`} />
            {it[0]}
          </div>
          {it[1] ? <div className="ds">{it[1]}</div> : null}
          <div className="pr">{it[2]}</div>
        </div>
        <div className="side">
          <input
            type="checkbox"
            className="chk"
            checked={selected}
            onChange={() => {}}
            onClick={e => e.stopPropagation()}
            aria-label={`Select ${it[0]}`}
          />
          <div
            className="qty"
            aria-hidden={!selected}
            inert={!selected}
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              tabIndex={selected ? 0 : -1}
              onClick={() => setQ(id, (cart[id] || 1) - 1)}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span>{cart[id] || 1}</span>
            <button
              type="button"
              tabIndex={selected ? 0 : -1}
              onClick={() => setQ(id, (cart[id] || 1) + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* HERO */}
      <header className="hero">
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
        <svg className="arches" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
          <path d="M30 300V120a45 45 0 0 1 90 0V300M75 300V80M120 300V190a60 60 0 0 1 120 0V300M280 300V90a40 40 0 0 1 80 0V300M320 300V60"/>
        </svg>
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

      {/* STICKY QUICK-ACCESS NAVIGATION */}
      <nav className="sticky-nav" aria-label="Menu Navigation">
        <div className="sticky-nav-inner">
          <div className="nav-actions">
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search dishes (e.g. Tomato Soup, Paneer, Pizza)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                aria-label="Search dishes"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="button"
              className="all-cats-btn"
              onClick={() => setPickerOpen(true)}
              aria-label="View all categories"
            >
              <span>☰ All</span>
              <span className="badge">{MENU.length}</span>
            </button>
          </div>

          {!searchQuery && (
            <div className="cat-ribbon" ref={ribbonRef} role="tablist">
              {MENU.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === i}
                  className={`cat-pill ${activeTab === i ? 'active' : ''}`}
                  onClick={() => jumpTo(i)}
                >
                  <span className="pill-ico">{c.ico}</span>
                  <span className="pill-name">{c.cat}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* MENU */}
      <main id="menu">
        {searchQuery.trim() ? (
          <section className="search-results-section">
            <div className="search-header-box">
              <h2>
                🔍 Results for &ldquo;{searchQuery}&rdquo;
                <small className="catnote">{filteredItems.length} found</small>
              </h2>
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </button>
            </div>

            {filteredItems.length === 0 ? (
              <div className="empty-search">
                <p>No dishes found matching &ldquo;{searchQuery}&rdquo;.</p>
                <small>Try searching for &quot;soup&quot;, &quot;paneer&quot;, &quot;roti&quot;, &quot;dal&quot;, or &quot;sizzler&quot;.</small>
              </div>
            ) : (
              <div className="menu-grid">
                {filteredItems.map(item =>
                  renderCard(item.id, item.raw, {
                    ico: item.catIco,
                    name: item.catName,
                  })
                )}
              </div>
            )}
          </section>
        ) : (
          MENU.map((c, ci) => (
            <section key={ci} id={`c${ci}`}>
              <div className="sec-header">
                <h2>
                  {c.ico} {c.cat}
                  {c.note ? <small className="catnote">{c.note}</small> : null}
                  <span className="catcount">{c.items.length} dishes</span>
                </h2>
              </div>
              <div className="menu-grid">
                {c.items.map((it, ii) => {
                  const id = `${ci}-${ii}`;
                  return renderCard(id, it as [string, string, number, number]);
                })}
              </div>
            </section>
          ))
        )}
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
            onDone={handleDone}
          />
        </>
      )}

      {/* CATEGORY PICKER MODAL */}
      {pickerOpen && (
        <>
          <div className="ov on" onClick={() => setPickerOpen(false)} />
          <div className="picker on">
            <div className="picker-head">
              <span>Browse Categories</span>
              <button className="x" onClick={() => setPickerOpen(false)}>×</button>
            </div>
            <div className="picker-grid">
              {MENU.map((c, i) => (
                <button
                  key={i}
                  className={`pcat ${activeTab === i ? 'pcat-on' : ''}`}
                  onClick={() => jumpTo(i)}
                >
                  <span className="pcat-ico">{c.ico}</span>
                  <span className="pcat-label">{c.cat}</span>
                  <span className="pcat-count">{c.items.length} items</span>
                </button>
              ))}
            </div>
          </div>
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
          <p>Your order has been sent to reception.<br />We&apos;ll deliver to your room shortly.</p>
          <button onClick={handleAgain}>Back to Menu</button>
        </div>
      )}
    </>
  );
}
