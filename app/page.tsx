'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { MENU } from '@/data/menu';
import OrderSheet from '@/components/OrderSheet';

type CartItem = { name: string; price: number };
type MenuItemTuple = [string, string, number, number, string[]?];
type SectionType = 'breakfast' | 'fastfood' | 'main';

export default function Home() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<SectionType>('breakfast');
  const ribbonRef = useRef<HTMLDivElement>(null);

  const breakfastCategories = useMemo(() =>
    MENU.map((c, i) => ({ ...c, originalIndex: i })).filter(c => c.section === 'breakfast'),
    []
  );

  const fastFoodCategories = useMemo(() =>
    MENU.map((c, i) => ({ ...c, originalIndex: i })).filter(c => c.section === 'fastfood'),
    []
  );

  const mainCategories = useMemo(() =>
    MENU.map((c, i) => ({ ...c, originalIndex: i })).filter(c => c.section === 'main'),
    []
  );

  const displayedCategories =
    activeSection === 'breakfast'
      ? breakfastCategories
      : activeSection === 'fastfood'
        ? fastFoodCategories
        : mainCategories;

  const items = useMemo(() => {
    const map: Record<string, CartItem> = {};
    MENU.forEach((c, ci) =>
      c.items.forEach((it, ii) => {
        const id = `${ci}-${ii}`;
        const opts = (it as MenuItemTuple)[4];
        let name = it[0] as string;
        if (opts && opts.length > 0) {
          const chosen = selectedOptions[id] || opts[0];
          name = `${it[0]} (${chosen})`;
        }
        map[id] = { name, price: it[2] as number };
      })
    );
    return map;
  }, [selectedOptions]);

  const searchableItems = useMemo(() => {
    const list: Array<{
      id: string;
      raw: MenuItemTuple;
      catName: string;
      catIco: string;
      section: SectionType;
      originalIndex: number;
    }> = [];
    MENU.forEach((c, ci) => {
      c.items.forEach((it, ii) => {
        list.push({
          id: `${ci}-${ii}`,
          raw: it as MenuItemTuple,
          catName: c.cat,
          catIco: c.ico,
          section: (c.section as SectionType) || 'main',
          originalIndex: ci,
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

  const [sheetOpen, setSheetOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [revealedCards, setRevealedCards] = useState<Set<string>>(() => new Set());
  const [done, setDone] = useState(false);

  /* Scroll-spy — update activeTab as user scrolls within active section */
  useEffect(() => {
    if (searchQuery.trim()) return;
    const sections = displayedCategories
      .map(c => document.getElementById(`c${c.originalIndex}`))
      .filter(Boolean) as HTMLElement[];
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
  }, [searchQuery, displayedCategories]);

  /* Auto-scroll active pill into view in horizontal ribbon */
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
  }, [searchQuery, displayedCategories]);

  const handleDone = () => { setDone(true); setSheetOpen(false); };
  const handleAgain = () => { setDone(false); setCart({}); };

  const setQ = (id: string, q: number) => {
    setCart(prev => {
      const next = { ...prev };
      if (q <= 0) delete next[id];
      else next[id] = q;
      return next;
    });
  };

  const switchSection = (sec: SectionType) => {
    setActiveSection(sec);
    const targetCats =
      sec === 'breakfast'
        ? breakfastCategories
        : sec === 'fastfood'
          ? fastFoodCategories
          : mainCategories;
    if (targetCats.length > 0) {
      setActiveTab(targetCats[0].originalIndex);
    }
    if (ribbonRef.current) {
      ribbonRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  const jumpTo = (originalIndex: number) => {
    const targetCat = MENU[originalIndex];
    if (targetCat && targetCat.section && targetCat.section !== activeSection) {
      setActiveSection(targetCat.section as SectionType);
    }
    if (searchQuery) setSearchQuery('');
    setPickerOpen(false);
    setActiveTab(originalIndex);
    setTimeout(() => {
      document.getElementById(`c${originalIndex}`)?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  };

  const total = Object.keys(cart).reduce((s, k) => s + (items[k]?.price || 0) * cart[k], 0);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);

  const renderCard = (
    id: string,
    it: MenuItemTuple,
    catBadge?: { ico: string; name: string; section?: SectionType }
  ) => {
    const selected = !!cart[id];
    const isRevealed = revealedCards.has(id) || !!searchQuery.trim();
    const options = it[4];
    const hasOptions = Array.isArray(options) && options.length > 0;
    const currentOption = selectedOptions[id] || (hasOptions ? options[0] : null);

    const toggleSelect = () => {
      if (selected) {
        setQ(id, 0);
      } else {
        setQ(id, 1);
        if (hasOptions && !selectedOptions[id]) {
          setSelectedOptions(prev => ({ ...prev, [id]: options[0] }));
        }
      }
    };

    return (
      <div
        key={id}
        data-card-id={id}
        className={`card ${isRevealed ? 'show' : ''} ${selected ? 'sel' : ''} ${hasOptions ? 'has-opt' : ''}`}
        onClick={toggleSelect}
      >
        <div className="card-main">
          <div className="info">
            {catBadge && (
              <span className={`item-cat-badge ${catBadge.section || 'main'}`}>
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
              onChange={e => {
                if (e.target.checked) {
                  setQ(id, 1);
                  if (hasOptions && !selectedOptions[id]) {
                    setSelectedOptions(prev => ({ ...prev, [id]: options[0] }));
                  }
                } else {
                  setQ(id, 0);
                }
              }}
              onClick={e => {
                e.stopPropagation();
                toggleSelect();
              }}
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

        {hasOptions && selected && (
          <div
            className="card-options-drawer"
            onClick={e => e.stopPropagation()}
          >
            <span className="card-options-title">Choice:</span>
            <div className="card-options-list">
              {options.map((opt: string) => {
                const isChosen = currentOption === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    role="checkbox"
                    aria-checked={isChosen}
                    className={`card-opt-btn ${isChosen ? 'active' : ''}`}
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedOptions(prev => ({ ...prev, [id]: opt }));
                    }}
                  >
                    <span className={`opt-checkbox ${isChosen ? 'checked' : ''}`}>
                      {isChosen && <span className="opt-check-icon">✓</span>}
                    </span>
                    <span className="opt-label">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* HERO */}
      <header className="hero">
        <svg className="arches" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
          <path d="M30 300V120a45 45 0 0 1 90 0V300M75 300V80M120 300V190a60 60 0 0 1 120 0V300M280 300V90a40 40 0 0 1 80 0V300M320 300V60" />
        </svg>
        <div className="hero-in">
          <div className="brand-logo-wrap">
            <div className="orb o1" aria-hidden="true">
              <Image src="/logo-left.png" alt="Hotel Monark Emblem (Left)" width={54} height={54} priority />
            </div>
            <Image
              src="/logo-monark.png"
              alt="Hotel Monark - AC Rooms"
              width={310}
              height={147}
              priority
              className="brand-logo-img"
            />
            <div className="orb o2" aria-hidden="true">
              <Image src="/logo-right.png" alt="Hotel Monark Emblem (Right)" width={46} height={46} priority />
            </div>
          </div>
          <p className="tag">In-Room Dining · Pick your dishes, we <b>deliver to your room</b></p>
        </div>
        <svg className="wave" viewBox="0 0 1440 70" preserveAspectRatio="none">
          <path fill="#f5fbf6" d="M0 40C240 80 480 0 720 30s480 40 720 0v40H0z" />
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

          {/* THREE PRIMARY SECTIONS: BREAKFAST, FAST FOOD & MAIN COURSE */}
          {!searchQuery && (
            <div className="section-switcher" role="tablist" aria-label="Menu Sections">
              <button
                type="button"
                role="tab"
                aria-selected={activeSection === 'breakfast'}
                className={`sec-tab ${activeSection === 'breakfast' ? 'active breakfast-active' : ''}`}
                onClick={() => switchSection('breakfast')}
              >
                <span className="sec-ico">🌅</span>
                <span className="sec-label">Breakfast</span>
                <span className="sec-pill">{breakfastCategories.length}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeSection === 'fastfood'}
                className={`sec-tab ${activeSection === 'fastfood' ? 'active fast-active' : ''}`}
                onClick={() => switchSection('fastfood')}
              >
                <span className="sec-ico">🍔</span>
                <span className="sec-label">Fast Food</span>
                <span className="sec-pill">{fastFoodCategories.length}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeSection === 'main'}
                className={`sec-tab ${activeSection === 'main' ? 'active main-active' : ''}`}
                onClick={() => switchSection('main')}
              >
                <span className="sec-ico">🍽️</span>
                <span className="sec-label">Main Course</span>
                <span className="sec-pill">{mainCategories.length}</span>
              </button>
            </div>
          )}

          {!searchQuery && (
            <div className="cat-ribbon" ref={ribbonRef} role="tablist">
              {displayedCategories.map(c => (
                <button
                  key={c.originalIndex}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === c.originalIndex}
                  className={`cat-pill ${activeTab === c.originalIndex ? 'active' : ''}`}
                  onClick={() => jumpTo(c.originalIndex)}
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
                <small>Try searching for &quot;soup&quot;, &quot;paneer&quot;, &quot;roti&quot;, &quot;dal&quot;, or &quot;pizza&quot;.</small>
              </div>
            ) : (
              <div className="menu-grid">
                {filteredItems.map(item =>
                  renderCard(item.id, item.raw, {
                    ico: item.catIco,
                    name: `${item.section === 'breakfast'
                      ? '🌅 Breakfast'
                      : item.section === 'fastfood'
                        ? '🍔 Fast Food'
                        : '🍽️ Main'
                      } · ${item.catName}`,
                    section: item.section,
                  })
                )}
              </div>
            )}
          </section>
        ) : (
          displayedCategories.map(c => (
            <section key={c.originalIndex} id={`c${c.originalIndex}`}>
              <div className="sec-header">
                <h2>
                  {c.ico} {c.cat}
                  {c.note ? <small className="catnote">{c.note}</small> : null}
                  <span className="catcount">{c.items.length} dishes</span>
                </h2>
              </div>
              <div className="menu-grid">
                {c.items.map((it, ii) => {
                  const id = `${c.originalIndex}-${ii}`;
                  return renderCard(id, it as MenuItemTuple);
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

            <div className="picker-group-title breakfast">
              <span>🌅 Breakfast</span>
              <span className="pcat-count">{breakfastCategories.length} categories</span>
            </div>
            <div className="picker-grid">
              {breakfastCategories.map(c => (
                <button
                  key={c.originalIndex}
                  className={`pcat ${activeTab === c.originalIndex ? 'pcat-on' : ''}`}
                  onClick={() => jumpTo(c.originalIndex)}
                >
                  <span className="pcat-ico">{c.ico}</span>
                  <span className="pcat-label">{c.cat}</span>
                  <span className="pcat-count">{c.items.length} items</span>
                </button>
              ))}
            </div>

            <div className="picker-group-title fast">
              <span>🍔 Fast Food</span>
              <span className="pcat-count">{fastFoodCategories.length} categories</span>
            </div>
            <div className="picker-grid">
              {fastFoodCategories.map(c => (
                <button
                  key={c.originalIndex}
                  className={`pcat ${activeTab === c.originalIndex ? 'pcat-on' : ''}`}
                  onClick={() => jumpTo(c.originalIndex)}
                >
                  <span className="pcat-ico">{c.ico}</span>
                  <span className="pcat-label">{c.cat}</span>
                  <span className="pcat-count">{c.items.length} items</span>
                </button>
              ))}
            </div>

            <div className="picker-group-title main">
              <span>🍽️ Main Course</span>
              <span className="pcat-count">{mainCategories.length} categories</span>
            </div>
            <div className="picker-grid">
              {mainCategories.map(c => (
                <button
                  key={c.originalIndex}
                  className={`pcat ${activeTab === c.originalIndex ? 'pcat-on' : ''}`}
                  onClick={() => jumpTo(c.originalIndex)}
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
              <path d="M12 27l10 10 19-21" stroke="#07402f" strokeWidth="6" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="done-title">
            Please call reception to confirm your order.
          </h2>
          <a
            href="tel:+918980010026"
            className="call-btn"
            aria-label="Call Reception to confirm your order"
          >
            <span className="call-icon">📞</span>
            <span>Call Reception</span>
          </a>
          <button className="done-back" onClick={handleAgain}>Back to Menu</button>
        </div>
      )}
    </>
  );
}
