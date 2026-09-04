import { SITE_TEXT } from '@/lib/site-text';

/** Compact copyright footer shared by the homepage and project pages. */
export function PageFooter() {
  return (
    <footer className="-mt-px flex min-h-[60px] items-center border-t border-line bg-bg px-5 text-text sm:px-7">
      <p className="text-[10px] font-semibold uppercase tracking-[0.11em] text-muted">
        © {new Date().getFullYear()} {SITE_TEXT.artist.name}
      </p>
    </footer>
  );
}
