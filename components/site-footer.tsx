import { SITE_TEXT } from '@/lib/site-text';

const T = SITE_TEXT;

/**
 * Editorial footer: a single legal hairline row.
 */
export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="border-t border-line px-6 py-7 text-[13px] text-muted sm:px-8"
    >
      <span>{T.footer.copyright}</span>
    </footer>
  );
}
