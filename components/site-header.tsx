'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE_TEXT } from '@/lib/site-text';

export function SiteHeader() {
  const pathname = usePathname();
  return <header className="portfolio-header"><a className="skip-link" href="#main-content">Skip to content</a><div className="portfolio-container header-inner">
    <Link href="/" className="wordmark" aria-label="James Kordic, home">James Kordic<span className="accent-period">.</span></Link>
    <nav aria-label="Primary navigation"><Link href="/#work" aria-current={pathname === '/' || pathname.startsWith('/work') ? 'page' : undefined}>Work</Link><Link href="/about" aria-current={pathname === '/about' ? 'page' : undefined}>About</Link><a className="header-resume" href={SITE_TEXT.contact.resumeUrl} target="_blank" rel="noopener noreferrer">Résumé <span aria-hidden="true">↗</span></a><a href={`mailto:${SITE_TEXT.contact.email}`}>Contact <span aria-hidden="true">↗</span></a></nav>
  </div></header>;
}
