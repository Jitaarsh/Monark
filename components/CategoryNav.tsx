'use client';

import { useEffect, useRef, useState } from 'react';

type Category = {
  cat: string;
  ico?: string;
};

export default function CategoryNav({ categories }: { categories: Category[] }) {
  const [activeCategory, setActiveCategory] = useState(0);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sections = categories
      .map((_, index) => document.getElementById(`c${index}`))
      .filter((section): section is HTMLElement => section !== null);
    const observer = new IntersectionObserver(
      entries => {
        const visibleSections = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleSections.length) {
          setActiveCategory(Number(visibleSections[0].target.id.slice(1)));
        }
      },
      { rootMargin: '-90px 0px -65% 0px', threshold: 0 }
    );

    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [categories]);

  useEffect(() => {
    navRef.current
      ?.querySelector<HTMLElement>('[aria-current="true"]')
      ?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [activeCategory]);

  return (
    <nav className="category-nav" aria-label="Menu categories" ref={navRef}>
      {categories.map((category, index) => (
        <button
          key={category.cat}
          type="button"
          className={`category-nav__button ${activeCategory === index ? 'is-active' : ''}`}
          aria-current={activeCategory === index ? 'true' : undefined}
          onClick={() => {
            setActiveCategory(index);
            document.getElementById(`c${index}`)?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          {category.ico} {category.cat}
        </button>
      ))}
    </nav>
  );
}
