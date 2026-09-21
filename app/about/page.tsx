import type { Metadata } from 'next';
import { PageFooter } from '@/components/page-footer';
import { SiteHeader } from '@/components/site-header';
import { SITE_TEXT } from '@/lib/site-text';
import { BLOCK_PT, BLOCK_T, GAP, GUTTER_X, LABEL, STACK, TIGHT } from '@/lib/spacing';

const T = SITE_TEXT;

export const metadata: Metadata = {
  title: `About — ${T.artist.name}`,
  description: T.about.bio[0],
};

/** "Design Consultant @ THE·TEAM" → ["Design Consultant", "THE·TEAM"] */
function splitRole(line: string): [string, string] {
  const [role, place] = line.split(' @ ');
  return [role, place ?? ''];
}

export default function AboutPage() {
  const [lead, ...rest] = T.about.bio;

  return (
    <div className="min-h-screen bg-bg text-[17px] leading-[1.6] text-text">
      <SiteHeader />

      <main className={`w-full ${GUTTER_X}`}>
        <div className={`grid items-start ${GAP} ${BLOCK_PT} md:grid-cols-[1.3fr_1fr] md:gap-x-16`}>
          <div>
            <h1 className="text-[clamp(28px,3.6vw,42px)] font-medium leading-[1.18] tracking-[-0.02em]">
              {lead}
            </h1>
            {rest.map((paragraph) => (
              <p key={paragraph} className={`${STACK} max-w-[58ch]`}>{paragraph}</p>
            ))}

            <div className={BLOCK_T}>
              <h2 className={LABEL}>Experience</h2>
              <div className={TIGHT}>
              {T.home.masthead.previously.map((line) => {
                const [role, place] = splitRole(line);
                return (
                  <div key={line} className="flex justify-between gap-4 border-t border-line py-3 text-[16px]">
                    <span>{role}</span>
                    <span className="text-right text-muted">{place}</span>
                  </div>
                );
              })}
              <div className="flex justify-between gap-4 border-t border-line py-3 text-[16px]">
                <span>BFA Graphic Design, minor in Photography</span>
                <span className="text-right text-muted">RIT</span>
              </div>
              </div>
            </div>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/about/headshot.jpg"
            alt={T.artist.name}
            className="aspect-[4/5] w-full object-cover"
          />
        </div>
      </main>

      <PageFooter />
    </div>
  );
}
