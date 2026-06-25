'use client';

import { SITE_TEXT } from '@/lib/site-text';

const T = SITE_TEXT;

/**
 * About — a résumé-style editorial profile (à la kimeunsoo.com/About):
 * a friendly first-person intro with a headshot to the side, then left-label /
 * right-content rows (Experience, Education, Capabilities, Contact) each topped
 * by a hairline. Left-aligned and monochrome with one accent on link hover.
 * Copy lives in lib/site-text.ts; experience/education mirror the résumé.
 */

/** Roles + dates from the résumé (no descriptions, per the design). */
const EXPERIENCE = [
  { role: 'Senior Designer Consultant', company: 'THE·TEAM', date: 'Apr 2026 – Present' },
  { role: 'Freelance Graphic & Motion Designer', company: 'The Syndicate', date: 'May 2025 – Mar 2026' },
  { role: 'Video, Motion, Design & Content Intern', company: 'The Syndicate', date: 'Aug 2024 – May 2025' },
  { role: 'Visual Designer', company: 'Rochester Institute of Technology', date: 'Oct 2022 – May 2025' },
];

/** Disciplines drawn from the résumé skill set. */
const CAPABILITIES = [
  'Creative Direction',
  'Motion Design',
  'Branding',
  'Marketing',
  'Interactive Design',
  '3D Design',
  'Concept Work',
];

export default function AboutPage() {
  return (
    <div className="pb-4">
      {/* Intro + headshot */}
      <section className="grid items-start gap-x-10 gap-y-8 md:grid-cols-12 md:items-stretch">
        {/* Text */}
        <div className="order-2 md:order-1 md:col-span-8">
          <p className="font-display text-[clamp(24px,3vw,38px)] leading-[1.3] tracking-[-0.5px]">
            Hi, I’m {T.artist.firstName} — feel free to reach out anytime.
          </p>

          <div className="mt-8 max-w-[680px] space-y-5">
            {T.about.bio.map((paragraph, i) => (
              <p
                key={i}
                className="text-[16px] md:text-[17px] leading-[1.7] text-text/80"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <p className="mt-8 text-[16px] md:text-[17px] text-text">
            Get in touch to chat more!
          </p>
          <div className="mt-3 flex flex-wrap gap-x-7 gap-y-2 text-[15px]">
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

        {/* Headshot */}
        <div className="order-1 md:order-2 md:col-span-4">
          <div className="relative aspect-[4/5] w-full overflow-hidden border border-line bg-panel md:aspect-auto md:h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/about/headshot.jpg"
              alt={`${T.artist.name}, ${T.artist.discipline}`}
              className="absolute inset-0 h-full w-full object-cover"
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

      {/* Experience */}
      <Row label="Experience">
        {EXPERIENCE.map((e, i) => (
          <Entry key={i} name={e.role} lines={[e.company]} meta={e.date} />
        ))}
      </Row>

      {/* Education */}
      <Row label="Education">
        <Entry
          name="BFA, Graphic Design"
          lines={['Rochester Institute of Technology']}
          meta="Aug 2021 – May 2025"
        />
      </Row>

      {/* Capabilities */}
      <Row label="Capabilities">
        <ul>
          {CAPABILITIES.map((c) => (
            <li
              key={c}
              className="font-display text-[clamp(19px,2vw,24px)] tracking-[-0.3px] leading-[1.5]"
            >
              {c}
            </li>
          ))}
        </ul>
      </Row>

      {/* Contact */}
      <Row label="Contact">
        <dl className="space-y-3.5">
          <ContactLine label="Email" value={T.contact.email} href={`mailto:${T.contact.email}`} />
          <ContactLine label="Phone" value={T.contact.phone} href={`tel:${T.contact.phoneRaw}`} />
          <ContactLine
            label="LinkedIn"
            value={`@${T.contact.linkedinHandle}`}
            href={T.contact.linkedinUrl}
            external
          />
          <ContactLine
            label="Instagram"
            value={`@${T.contact.instagramHandle}`}
            href={T.contact.instagramUrl}
            external
          />
          <ContactLine label="Résumé" value="Download PDF" href={T.contact.resumeUrl} external />
        </dl>
      </Row>
    </div>
  );
}

/* ---- Building blocks ---- */

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12 grid border-t border-line pt-8 md:mt-14 md:grid-cols-12 md:gap-x-8 md:pt-9">
      <h2 className="mb-5 text-[14px] text-muted md:col-span-3 md:mb-0">
        {label}
      </h2>
      <div className="md:col-span-7">{children}</div>
    </section>
  );
}

function Entry({
  name,
  lines,
  meta,
}: {
  name: string;
  lines: string[];
  meta?: string;
}) {
  return (
    <div className="mb-7 last:mb-0">
      <div className="flex items-baseline justify-between gap-4">
        <div className="font-display text-[clamp(20px,2.2vw,26px)] tracking-[-0.3px] leading-tight">
          {name}
        </div>
        {meta && (
          <div className="flex-none text-[13px] tabular-nums text-muted-2">
            {meta}
          </div>
        )}
      </div>
      {lines.length > 0 && (
        <div className="mt-1.5 text-[15px] leading-[1.5] text-muted">
          {lines.map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
      )}
    </div>
  );
}

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

function ContactLine({
  label,
  value,
  href,
  external = false,
}: {
  label: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-5">
      <dt className="w-[90px] flex-none text-[12px] uppercase tracking-[1.2px] text-muted-2">
        {label}
      </dt>
      <dd>
        <a
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          className="font-display text-[clamp(18px,2vw,22px)] tracking-[-0.3px] transition-colors hover:text-accent"
        >
          {value}
        </a>
      </dd>
    </div>
  );
}
