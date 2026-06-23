'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PROJECTS } from '@/lib/projects';
import { SITE_TEXT } from '@/lib/site-text';

const T = SITE_TEXT;

/**
 * Fixed editorial sidebar — dark panel with the name mark, availability
 * status, primary navigation, and contact details pinned to the bottom.
 * Sticky/full-height on desktop; stacks above the content on mobile.
 */
export function Sidebar() {
  const pathname = usePathname();

  const navItems: { label: string; href: string; marker: string; external?: boolean }[] = [
    { label: 'Work', href: '/', marker: String(PROJECTS.length).padStart(2, '0') },
    { label: 'Browse', href: '/search', marker: '↗' },
    { label: 'About', href: '/about', marker: '↓' },
    { label: 'Contact', href: `mailto:${T.contact.email}`, marker: '↗', external: true },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href);

  return (
    <aside className="bg-paneldark text-panelfg md:sticky md:top-0 md:h-screen flex flex-col justify-between gap-10 px-9 py-11 md:py-12">
      <div>
        {/* Name mark */}
        <Link href="/" className="block">
          <span className="font-display text-[30px] leading-[1.05] tracking-[-0.5px] text-panelfg">
            {T.artist.firstName}
            <br />
            {T.artist.lastName}
          </span>
        </Link>
        <div className="text-[12px] uppercase tracking-[2px] text-paneldim mt-4">
          {T.artist.discipline}
        </div>

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
          href={T.contact.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-panelfg transition-colors"
        >
          Instagram
        </a>
        {' · '}
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
