'use client';

import Link from 'next/link';
import { SITE_TEXT } from '@/lib/site-text';

const T = SITE_TEXT;

/**
 * Flat Pentagram-style footer: a sitemap of small link columns over a hairline
 * rule, with a copyright / location row underneath. Pure ink on paper.
 */
export function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-line">
      <div className="mx-auto max-w-[1200px] px-6 pb-12 pt-16 sm:px-8">
      <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
        <FooterCol title="Contact">
          <FooterLink href={`mailto:${T.contact.email}`} external>
            {T.contact.email}
          </FooterLink>
          <FooterLink href={`tel:${T.contact.phoneRaw}`} external>
            {T.contact.phone}
          </FooterLink>
        </FooterCol>

        <FooterCol title="Elsewhere">
          <FooterLink href={T.contact.instagramUrl} external>
            Instagram
          </FooterLink>
          <FooterLink href={T.contact.linkedinUrl} external>
            LinkedIn
          </FooterLink>
        </FooterCol>

        <FooterCol title="Studio">
          <FooterLink href="/about">About</FooterLink>
          <FooterLink href="/">Work</FooterLink>
          <FooterLink href={T.contact.resumeUrl} external>
            Résumé
          </FooterLink>
        </FooterCol>

        <FooterCol title="Available">
          <p className="text-[14px] leading-[1.4] text-muted">
            Open for freelance and full-time work, 2026.
            <br />
            {T.artist.location}.
          </p>
        </FooterCol>
      </div>

      <div className="mt-16 flex flex-wrap justify-between gap-3 border-t border-line pt-8 text-[13px] text-muted">
        <span>{T.footer.copyright}</span>
        <span>{T.artist.location}</span>
      </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="mb-3.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">
        {title}
      </h4>
      {children}
    </div>
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
    'block py-[3px] text-[15px] font-medium underline-offset-2 hover:underline';
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
