import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { PageFooter } from '@/components/page-footer';
import { SiteHeader } from '@/components/site-header';
import { SITE_TEXT } from '@/lib/site-text';
import { BLOCK_PB, BLOCK_PT, GAP_X, GUTTER_X, LABEL, RULE_PY } from '@/lib/spacing';

const T = SITE_TEXT;

export const metadata: Metadata = {
  title: `About — ${T.artist.name}`,
  description: T.about.bio[0],
};

const CLIENTS = ['Guns N’ Roses', 'Taco Bell', 'FX', 'CoinDesk', 'MNRK Heavy', 'The Syndicate', 'THE·TEAM'];

/** "Design Consultant @ THE·TEAM" → ["Design Consultant", "THE·TEAM"] */
function splitRole(line: string): [string, string] {
  const [role, place] = line.split(' @ ');
  return [role, place ?? ''];
}

/** One labelled row: label on the left third, content on the right. */
function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={`grid grid-cols-1 border-t border-line ${RULE_PY} ${GAP_X} gap-y-3 lg:grid-cols-3`}>
      <h2 className={LABEL}>{label}</h2>
      <div className="lg:col-span-2">{children}</div>
    </div>
  );
}

const link = 'transition-colors hover:text-accent';

export default function AboutPage() {
  const [lead, ...rest] = T.about.bio;

  return (
    <div className="min-h-screen bg-bg text-[17px] leading-[1.6] text-text">
      <SiteHeader />

      <main className={`w-full ${GUTTER_X}`}>
        <section className={`${BLOCK_PT} ${BLOCK_PB}`}>
          <h1 className="max-w-[24ch] text-[clamp(30px,4.6vw,64px)] font-medium leading-[1.12] tracking-[-0.025em]">
            {lead}
          </h1>
        </section>

        <div>
          <Row label="About">
            <div className="max-w-[60ch] space-y-5">
              {rest.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Row>

          <Row label="Experience">
            <ul>
              {T.home.masthead.previously.map((line, i) => {
                const [role, place] = splitRole(line);
                return (
                  <li
                    key={line}
                    className={`flex flex-wrap justify-between gap-x-5 ${i ? 'border-t border-line pt-3' : ''} pb-3`}
                  >
                    <span>{role}</span>
                    <span className="text-muted">{place}</span>
                  </li>
                );
              })}
            </ul>
          </Row>

          <Row label="Education">
            <p className="flex flex-wrap justify-between gap-x-5">
              <span>BFA Graphic Design, minor in Photography</span>
              <span className="text-muted">Rochester Institute of Technology</span>
            </p>
          </Row>

          <Row label="Clients">
            <p className="max-w-[60ch]">{CLIENTS.join(', ')}</p>
          </Row>

          <Row label="Contact">
            <div className="flex flex-col gap-1">
              <a href={`mailto:${T.contact.email}`} className={link}>{T.contact.email}</a>
              <a href={T.contact.linkedinUrl} target="_blank" rel="noopener noreferrer" className={link}>LinkedIn</a>
              <a href={T.contact.resumeUrl} target="_blank" rel="noopener noreferrer" className={link}>Resume</a>
            </div>
          </Row>
        </div>
      </main>

      <PageFooter />
    </div>
  );
}
