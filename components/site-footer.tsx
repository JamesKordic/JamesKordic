'use client';

import { SITE_TEXT } from '@/lib/site-text';

const T = SITE_TEXT;

/**
 * Single centered footer line, ported from the reference design:
 * copyright · location · email.
 */
export function SiteFooter() {
  return (
    <footer className="site-footer">
      {T.footer.copyright} · {T.artist.location} · {T.contact.email}
    </footer>
  );
}
