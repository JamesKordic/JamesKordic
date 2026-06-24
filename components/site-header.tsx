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
    <header className="sticky top-0 z-50 border-b border-line bg-[rgba(247,246,243,0.88)] backdrop-blur-md backdrop-saturate-[1.4]">
      <div className="mx-auto flex w-full max-w-[1200px] items-baseline justify-between gap-6 px-6 py-4 sm:px-8">
        <Link
          href="/"
          className="text-[18px] sm:text-[20px] font-bold tracking-[-0.01em] leading-none"
        >
          {T.artist.name}{' '}
          <span className="font-normal text-muted">— {T.artist.discipline}</span>
        </Link>

        <nav className="flex items-center gap-5 sm:gap-7">
        {links.map((l) =>
          l.external ? (
            <a
              key={l.label}
              href={l.href}
              className="text-[14px] font-medium text-muted transition-colors hover:text-accent"
            >
              {l.label}
            </a>
          ) : (
            <Link
              key={l.label}
              href={l.href}
              className={`text-[14px] font-medium transition-colors hover:text-accent ${
                isActive(l.href) ? 'text-accent' : 'text-muted'
              }`}
            >
              {l.label}
            </Link>
          )
        )}
        </nav>
      </div>
    </header>
  );
}
