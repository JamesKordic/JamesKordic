'use client';

import { PROJECTS } from '@/lib/projects';
import { SITE_TEXT } from '@/lib/site-text';

const T = SITE_TEXT;

/**
 * About — a résumé-style editorial profile (à la kimeunsoo.com/About):
 * a friendly first-person intro, then left-label / right-content rows
 * (Selected Work, Education, Capabilities, Contact) each topped by a hairline.
 * Everything is left-aligned and monochrome with one accent on link hover.
 * Copy lives in lib/site-text.ts; the work list is data-driven from PROJECTS.
 */

/** Disciplines worked across the catalog (drawn from the projects' roles). */
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
      {/* Intro */}
      <section className="grid md:grid-cols-12 md:gap-x-8">
        <div className="md:col-span-9">
          <p className="font-display text-[clamp(24px,3vw,38px)] leading-[1.3] tracking-[-0.5px]">
            Hi, I’m {T.artist.firstName} — feel free to reach out anytime.
          </p>

          <div className="mt-8 max-w-[700px] space-y-5">
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
      </section>

      {/* Selected Work */}
      <Row label="Selected Work">
        {PROJECTS.map((p) => {
          const name = p.client || p.title;
          const project = p.client && p.client !== p.title ? p.title : null;
          const detail = [p.role, p.year].filter(Boolean).join(' · ');
          return (
            <Entry
              key={p.id}
              name={name}
              lines={[project, detail].filter(Boolean) as string[]}
            />
          );
        })}
      </Row>

      {/* Education */}
      <Row label="Education">
        <Entry
          name="Rochester Institute of Technology"
          lines={['BFA, Graphic Design']}
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

function Entry({ name, lines }: { name: string; lines: string[] }) {
  return (
    <div className="mb-7 last:mb-0">
      <div className="font-display text-[clamp(20px,2.2vw,26px)] tracking-[-0.3px] leading-tight">
        {name}
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
