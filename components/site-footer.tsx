'use client';

import Link from 'next/link';
import { SITE_TEXT } from '@/lib/site-text';

const T = SITE_TEXT;

/**
 * Editorial footer: an oversized contact call-to-action on the left, two
 * link columns, and a legal hairline row underneath. Mirrors the redesign's
 * `footer` grid (1.4fr / 1fr / 1fr collapsing on smaller screens).
 */
export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="grid grid-cols-1 gap-8 border-t border-line px-6 pb-14 pt-20 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]"
    >
      <h2 className="font-display text-[clamp(24px,3vw,40px)] font-semibold leading-[1.1] tracking-[-0.02em] md:col-span-2 lg:col-span-1 lg:max-w-[14ch]">
        Have a project?{' '}
        <a
          href={`mailto:${T.contact.email}`}
          className="border-b-2 border-accent"
        >
          Get in touch.
        </a>
      </h2>

      <div>
        <h4 className="mb-3.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">
          Studio
        </h4>
        <FooterLink href="/about">About</FooterLink>
        <FooterLink href="/">Work</FooterLink>
        <FooterLink href={T.contact.resumeUrl} external>
          Résumé
        </FooterLink>
      </div>

      <div>
        <h4 className="mb-3.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">
          Elsewhere
        </h4>
        <FooterLink href={T.contact.instagramUrl} external>
          Instagram
        </FooterLink>
        <FooterLink href={T.contact.linkedinUrl} external>
          LinkedIn
        </FooterLink>
        <FooterLink href={`mailto:${T.contact.email}`} external>
          Email
        </FooterLink>
      </div>

      <div className="col-span-full mt-6 flex flex-col gap-2 border-t border-line pt-12 text-[13px] text-muted sm:flex-row sm:justify-between">
        <span>{T.footer.copyright}</span>
        <span>Available for select commissions · {T.artist.location}</span>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const cls =
    'block py-[3px] text-[15px] font-medium transition-colors hover:text-accent';
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
