'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PROJECTS } from '@/lib/projects';
import { SITE_TEXT } from '@/lib/site-text';

const T = SITE_TEXT;

/**
 * Fixed editorial sidebar — dark panel with the name mark, availability
 * status, primary navigation, and contact details pinned to the bottom.
 * Sticky/full-height on desktop; a slide-in drawer on mobile (toggled from
 * the top bar in AppShell via the `open` / `onClose` props).
 */
export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  const navItems: { label: string; href: string; marker: string; external?: boolean }[] = [
    { label: 'Work', href: '/', marker: String(PROJECTS.length).padStart(2, '0') },
    { label: 'About', href: '/about', marker: '↓' },
    { label: 'Contact', href: `mailto:${T.contact.email}`, marker: '↗', external: true },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href);

  return (
    <aside
      className={`bg-paneldark text-panelfg flex flex-col justify-between gap-10 px-9 py-12 sm:py-14 lg:py-16
        fixed inset-y-0 left-0 z-50 w-[300px] max-w-[85vw] overflow-y-auto transition-transform duration-300 ease-out
        md:sticky md:top-0 md:z-auto md:h-screen md:w-auto md:max-w-none md:translate-x-0 md:border-r md:border-panelline
        ${open ? 'translate-x-0' : '-translate-x-full'}`}
    >
      {/* Close button — mobile drawer only */}
      <button
        onClick={onClose}
        aria-label="Close menu"
        className="md:hidden absolute top-5 right-5 w-9 h-9 flex items-center justify-center text-paneldim hover:text-panelfg text-2xl leading-none"
      >
        ×
      </button>

      <div>
        {/* Name mark */}
        <Link href="/" onClick={onClose} className="block">
          <span className="font-display text-[26px] leading-[1.05] tracking-[-0.5px] text-panelfg whitespace-nowrap">
            {T.artist.name}
          </span>
        </Link>

        {/* Availability */}
        <div className="inline-flex items-center gap-2 text-[13px] mt-7 border border-panelline rounded-full px-3.5 py-[7px] text-panelfg">
          <span className="w-[7px] h-[7px] rounded-full bg-accent" />
          {T.home.cta.availability}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col mt-9">
          {navItems.map((item) =>
            item.external ? (
              <a
                key={item.label}
                href={item.href}
                className="group flex items-center justify-between text-[15px] py-[7px] border-b border-panelline text-paneldim hover:text-panelfg hover:pl-2 transition-all"
              >
                <span>{item.label}</span>
                <span className="text-[11px] text-accent">{item.marker}</span>
              </a>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center justify-between text-[15px] py-[7px] border-b border-panelline hover:pl-2 transition-all ${
                  isActive(item.href) ? 'text-panelfg pl-2' : 'text-paneldim hover:text-panelfg'
                }`}
              >
                <span>{item.label}</span>
                <span className="text-[11px] text-accent">{item.marker}</span>
              </Link>
            )
          )}
        </nav>
      </div>

      {/* Bottom — location + contact */}
      <div className="text-[12px] text-paneldim leading-[2]">
        Based in {T.artist.location}
        <br />
        <a
          href={`mailto:${T.contact.email}`}
          className="text-panelfg border-b border-panelline hover:border-accent transition-colors"
        >
          {T.contact.email}
        </a>
        <br />
        <a
          href={T.contact.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-panelfg transition-colors"
        >
          LinkedIn
        </a>
      </div>
    </aside>
  );
}
