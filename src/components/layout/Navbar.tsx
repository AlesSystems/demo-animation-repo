'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useScrollDirection } from '@/hooks/useScrollDirection';

const navLinks = [
  { label: 'Products', href: '/products' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const direction = useScrollDirection();

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrollY(y);
      setScrolled(y > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHidden = direction === 'down' && scrollY > 100;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800'
          : 'bg-transparent'
      } ${isHidden ? '-translate-y-full' : 'translate-y-0'}`}
      style={{ transitionProperty: 'transform, background-color, border-color, backdrop-filter', transitionDuration: '300ms', transitionTimingFunction: 'var(--ease-cinematic)' }}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Brand */}
        <Link href="/" className="text-xl font-bold tracking-tight text-white">
          Ales
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-sm text-neutral-400 transition-colors hover:text-white"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-4">
          <Link
            href="/quote"
            className="hidden rounded-md bg-white px-4 py-2 text-sm font-medium text-neutral-950 transition-opacity hover:opacity-80 md:inline-flex"
          >
            Request a Quote
          </Link>

          {/* Hamburger — mobile only */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex flex-col gap-1.5 md:hidden"
          >
            <span
              className={`block h-0.5 w-5 bg-white transition-transform ${isMenuOpen ? 'translate-y-2 rotate-45' : ''}`}
            />
            <span
              className={`block h-0.5 w-5 bg-white transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`}
            />
            <span
              className={`block h-0.5 w-5 bg-white transition-transform ${isMenuOpen ? '-translate-y-2 -rotate-45' : ''}`}
            />
          </button>
        </div>
      </nav>
    </header>
  );
}
