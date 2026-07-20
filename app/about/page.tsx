'use client';

import { SITE_TEXT } from '@/lib/site-text';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

const T = SITE_TEXT;

/**
 * About — an editorial profile (à la kimeunsoo.com/About): a friendly
 * first-person intro with a headshot to the side; contact lives in the
 * intro's "Connect with me!" links and the résumé button on the headshot.
 * Bypasses the AppShell (see app-shell.tsx) so the page runs full-bleed:
 * the intro fills the full width and the viewport height between the
 * header and footer. Copy lives in lib/site-text.ts.
 */

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <SiteHeader />

      {/* Intro + headshot — flex-1 stretches the section to fill the
          viewport between header and footer on desktop */}
      <main className="view-anim flex flex-1 flex-col px-6 py-10 sm:px-8 sm:py-12">
        <section className="grid flex-1 items-start gap-x-10 gap-y-8 md:grid-cols-12 md:items-stretch">
        {/* Text — a flex column so the composition fills the full height:
            headline at the top, bio in the middle, Connect pinned to the
            bottom (mirroring the résumé button at the headshot's foot) */}
        <div className="order-2 flex flex-col md:order-1 md:col-span-8">
          <p className="font-display font-semibold text-[clamp(32px,4.2vw,60px)] leading-[1.15] tracking-[-0.025em] md:-mt-[0.25em]">
            Hi, I’m {T.artist.firstName}!
          </p>

          {/* Bio — first paragraph as an oversized display lead, the rest
              as larger editorial body. flex-1 pushes Connect down. */}
          <div className="mt-8 flex-1 md:mt-10">
            {T.about.bio.map((paragraph, i) =>
              i === 0 ? (
                <p
                  key={i}
                  className="max-w-[900px] font-display text-[clamp(20px,2.2vw,30px)] leading-[1.4] tracking-[-0.015em]"
                >
                  {paragraph}
                </p>
              ) : (
                <p
                  key={i}
                  className="mt-6 max-w-[760px] text-[16px] leading-[1.7] text-text/80 md:text-[18px]"
                >
                  {paragraph}
                </p>
              )
            )}
          </div>

          <div className="mt-10 md:mt-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
              Connect with me
            </p>
            <div className="mt-3.5 flex flex-wrap gap-x-8 gap-y-2 text-[16px] md:text-[17px]">
              <IntroLink href={`mailto:${T.contact.email}`}>
                {T.contact.email}
              </IntroLink>
              <IntroLink href={T.contact.linkedinUrl} external>
                LinkedIn
              </IntroLink>
              <IntroLink href={T.contact.instagramUrl} external>
                Instagram
              </IntroLink>
            </div>
          </div>
        </div>

        {/* Headshot */}
        <div className="order-1 md:order-2 md:col-span-4">
          <div className="relative aspect-[4/5] w-full overflow-hidden border border-line bg-panel md:aspect-auto md:h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/about/headshot.jpg"
              alt={`${T.artist.name}, ${T.artist.discipline}`}
              className="absolute inset-0 h-full w-full object-cover object-top"
            />

            {/* Résumé button — overlaid near the bottom of the image */}
            <a
              href={T.contact.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-x-4 bottom-4 inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-[14px] font-semibold text-text shadow-lg transition-colors hover:bg-accent hover:text-white"
            >
              ⤓ Résumé
            </a>
          </div>
        </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

/* ---- Building blocks ---- */

function IntroLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="text-text underline decoration-line underline-offset-[5px] transition-colors hover:text-accent hover:decoration-accent"
    >
      {children} <span className="text-muted-2">↗</span>
    </a>
  );
}
