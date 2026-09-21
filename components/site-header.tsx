'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE_TEXT } from '@/lib/site-text';

const T = SITE_TEXT;

/** Shared header: name on the left, four plain links on the right. */
export function SiteHeader() {
  const pathname = usePathname() ?? '/';
  const onWork = pathname === '/' || pathname.startsWith('/work');
  const onAbout = pathname.startsWith('/about');
  const link = 'transition-colors hover:text-text';

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur-md">
      <div className="flex h-16 w-full items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" className="text-[18px] font-semibold tracking-[-0.01em]">
          {T.artist.name}
        </Link>
        <nav aria-label="Primary" className="flex gap-4 text-[15px] text-muted sm:gap-7 sm:text-[16px]">
          <Link href="/" className={`${link} ${onWork ? 'text-text' : ''}`}>Work</Link>
          <Link href="/about" className={`${link} ${onAbout ? 'text-text' : ''}`}>About</Link>
          <a href={T.contact.resumeUrl} target="_blank" rel="noopener noreferrer" className={link}>Resume</a>
          <a href={`mailto:${T.contact.email}`} className={link}>Contact</a>
        </nav>
      </div>
    </header>
  );
}
