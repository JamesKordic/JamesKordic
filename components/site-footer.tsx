import { SITE_TEXT } from '@/lib/site-text';

const T = SITE_TEXT;

/**
 * Editorial footer: a single legal hairline row.
 */
export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="flex flex-col gap-2 border-t border-line px-6 pb-14 pt-12 text-[13px] text-muted sm:flex-row sm:justify-between sm:px-8"
    >
      <span>{T.footer.copyright}</span>
      <span>{T.artist.location}</span>
    </footer>
  );
}
