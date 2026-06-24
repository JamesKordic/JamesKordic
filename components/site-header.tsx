'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE_TEXT } from '@/lib/site-text';

const T = SITE_TEXT;

/**
 * Sticky paper header in the Pentagram editorial style: a name mark with a
 * single accent dot on the left, and a minimal Work / About / Contact nav on
 * the right. Shared by the home grid and the inner content pages so the
 * chrome is identical everywhere.
 */
export function SiteHeader() {
  const pathname = usePathname();

  const links: { label: string; href: string; external?: boolean }[] = [
    { label: 'Work', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: `mailto:${T.contact.email}`, external: true },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-line bg-bg px-6 py-4 sm:px-8">
      <Link
        href="/"
        className="text-[22px] sm:text-[26px] font-bold tracking-[-0.03em] leading-none"
      >
        {T.artist.name}
      </Link>

      <nav className="flex items-center gap-5 sm:gap-7">
        {links.map((l) =>
          l.external ? (
            <a
              key={l.label}
              href={l.href}
              className="text-[15px] font-medium underline-offset-[3px] hover:underline"
            >
              {l.label}
            </a>
          ) : (
            <Link
              key={l.label}
              href={l.href}
              className={`text-[15px] font-medium underline-offset-[3px] hover:underline ${
                isActive(l.href) ? 'underline' : ''
              }`}
            >
              {l.label}
            </Link>
          )
        )}
      </nav>
    </header>
  );
}
