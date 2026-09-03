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

      <main className="view-anim flex-1">
        <div className="border-b border-line px-5 py-10 sm:px-7 sm:py-14 lg:py-16">
          <h1 className="font-display text-[clamp(56px,11vw,164px)] font-semibold uppercase leading-[0.8] tracking-[-0.075em]">
            Info
          </h1>
        </div>

        <section className="grid lg:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.75fr)]">
          <div className="order-2 lg:order-1">
            <div className="border-b border-line px-5 py-10 sm:px-7 sm:py-14">
              <p className="max-w-[900px] font-display text-[clamp(28px,4vw,58px)] font-medium leading-[1.1] tracking-[-0.045em]">
                Graphic designer and motion artist working at the intersection of music, culture, and brand storytelling.
              </p>
            </div>

            <dl className="grid sm:grid-cols-2">
              <AboutFact label="Previously">
                The Syndicate<br />THE·TEAM<br />Rochester Institute of Technology
              </AboutFact>
              <AboutFact label="Education">BFA Graphic Design<br />Rochester Institute of Technology</AboutFact>
              <AboutFact label="Based">New York City</AboutFact>
              <AboutFact label="Currently">Available for selected freelance and full-time opportunities</AboutFact>
            </dl>

            <a
              href={T.contact.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative -mt-px block overflow-hidden border-y border-line"
            >
              <span className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-700 ease-out group-hover:scale-x-100" />
              <span className="relative z-10 grid min-h-[150px] grid-cols-[1fr_92px] sm:min-h-[180px] sm:grid-cols-[1fr_150px]">
                <span className="flex items-center overflow-hidden px-5 py-8 sm:px-7">
                  <span className="font-display text-[clamp(32px,5vw,68px)] font-semibold uppercase leading-[0.86] tracking-[-0.06em] transition-all duration-500 group-hover:translate-x-2 group-hover:text-accent-ink">
                    Download My Resume!
                  </span>
                </span>
                <span className="flex items-center justify-center border-l border-line transition-colors duration-500 group-hover:border-accent-ink/45">
                  <span className="flex h-14 w-14 items-center justify-center border border-line text-3xl transition-all duration-500 group-hover:-rotate-45 group-hover:border-accent-ink group-hover:text-accent-ink sm:h-20 sm:w-20 sm:text-5xl">
                    →
                  </span>
                </span>
              </span>
            </a>
          </div>

          <div className="order-1 border-b border-line lg:order-2 lg:border-b-0 lg:border-l">
            <div className="relative aspect-[4/5] overflow-hidden bg-panel lg:aspect-auto lg:h-full lg:min-h-[520px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/about/headshot.jpg"
                alt={`${T.artist.name}, ${T.artist.discipline}`}
                className="absolute inset-0 h-full w-full object-cover object-top grayscale transition-[filter] duration-500 hover:grayscale-0"
              />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function AboutFact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-line px-5 py-7 last:border-b-0 sm:min-h-[170px] sm:border-r sm:px-7 sm:py-8 sm:[&:nth-last-child(-n+2)]:border-b-0 sm:[&:nth-child(2n)]:border-r-0">
      <dt className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.13em] text-accent">{label}</dt>
      <dd className="text-[16px] leading-[1.55] text-text sm:text-[18px]">{children}</dd>
    </div>
  );
}
