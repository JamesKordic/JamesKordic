import Link from 'next/link';
import { PageFooter } from '@/components/page-footer';
import { SiteHeader } from '@/components/site-header';
import { PROJECTS } from '@/lib/projects';
import { GUTTER_X, LABEL } from '@/lib/spacing';
import { TITLE } from '@/lib/type';

export const metadata = { title: 'Page not found' };

/**
 * 404 — a full page like every other, with its own header, gutters and
 * footer, so it looks the same whatever URL it turns up on. It fills the
 * space between header and footer: a giant 404 set in Inter, the message and
 * a way back beside it, and every project one click away underneath, so a
 * dead link never leaves anyone stranded.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-[17px] leading-[1.6] text-text">
      <SiteHeader />

      <main className={`flex w-full flex-1 flex-col ${GUTTER_X}`}>
        {/* Centred between the header and the footer's rule rather than its
            box: the footer carries 96px of margin above its rule from `sm`
            up, so the padding leans 96px toward the top to split that. */}
        <section className="flex flex-1 flex-col justify-center py-12 sm:pb-4 sm:pt-28">
          <div className="grid grid-cols-1 items-end gap-x-16 gap-y-8 lg:grid-cols-[auto_minmax(0,1fr)]">
            <p
              aria-hidden
              className="-ml-[0.05em] select-none text-[clamp(140px,28vw,420px)] font-medium leading-[0.78] tracking-[-0.07em]"
            >
              404
            </p>

            <div className="max-w-[46ch]">
              <h1 className={TITLE}>
                <span className="sr-only">Error 404. </span>
                This page isn’t on the setlist.
              </h1>
              <p className="mt-3 text-muted">
                The link might be old, or the page has moved. Everything else is right where you left it.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Link
                  href="/#work"
                  className="rounded-full bg-accent px-7 py-3.5 font-medium leading-none text-accent-ink transition-colors hover:bg-accent-deep"
                >
                  Back to the work
                </Link>
                <Link href="/contact" className="text-muted transition-colors hover:text-accent">
                  Get in touch →
                </Link>
              </div>
            </div>
          </div>

          <nav aria-labelledby="jump-to" className="mt-12 border-t border-line pt-5 sm:mt-16">
            <h2 id="jump-to" className={LABEL}>
              Or jump to a project
            </h2>
            <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
              {PROJECTS.map((p) => (
                <li key={p.id}>
                  <Link href={`/work/${p.id}`} className="transition-colors hover:text-accent">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </section>
      </main>

      <PageFooter />
    </div>
  );
}
