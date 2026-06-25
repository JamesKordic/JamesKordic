'use client';

import { PROJECTS } from '@/lib/projects';
import { SITE_TEXT } from '@/lib/site-text';

const T = SITE_TEXT;

/**
 * About — an editorial profile in the same Pentagram-style language as the rest
 * of the site: an oversized name hero with a metadata strip, a lead bio paired
 * with a sticky "at a glance" rail, a capabilities list, a real client logo
 * strip (data-driven from PROJECTS), an availability banner, and a connect
 * list. All copy lives in lib/site-text.ts.
 */

/** Disciplines worked across the catalog — generic descriptors, no claims. */
const CAPABILITIES = [
  { title: 'Creative Direction', desc: 'Setting the visual tone and through-line that holds a campaign together.' },
  { title: 'Motion Design', desc: 'Bringing brand systems to life in motion, video, and social cutdowns.' },
  { title: 'Branding', desc: 'Identity systems, logos, and the rules that keep them consistent.' },
  { title: 'Marketing', desc: 'Social, advertising, and campaign assets built to perform at scroll speed.' },
  { title: 'Interactive Design', desc: 'Digital layouts and interfaces with a clear point of view.' },
  { title: 'Concept Work', desc: 'Self-initiated explorations, capstones, and what-ifs.' },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="pb-12 border-b border-line">
        <div className="text-[12px] uppercase tracking-[2px] text-accent font-bold mb-5">
          About — 2026
        </div>
        <h1 className="font-display font-normal text-[clamp(40px,7vw,92px)] leading-[0.98] tracking-[-1px]">
          {T.artist.firstName}{' '}
          <em className="italic text-accent">{T.artist.lastName}</em>
        </h1>
        <p className="mt-6 max-w-[640px] text-[clamp(17px,2vw,21px)] leading-[1.5] text-text/85">
          {T.home.tagline} Designing brand, motion, and advertising work that
          needs to move and make noise.
        </p>

        {/* Metadata strip */}
        <div className="mt-8 flex flex-wrap gap-x-10 gap-y-5">
          <Meta label="Based in" value={T.artist.location} />
          <Meta label="Focus" value={T.artist.discipline} />
          <Meta label="Experience" value="4 yrs professional" />
          <Meta label="Education" value="BFA · RIT" />
          <Meta label="Released" value={`${PROJECTS.length} projects`} />
        </div>
      </section>

      {/* Bio + sticky rail */}
      <section className="grid lg:grid-cols-[1fr_320px] gap-12 lg:gap-16 mt-14">
        <div>
          <h2 className="text-[13px] uppercase tracking-[2px] text-muted mb-7">
            {T.about.headings.about}
          </h2>
          {T.about.bio.map((paragraph, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? 'text-[clamp(20px,2.2vw,24px)] leading-[1.5] text-text mb-6 font-display'
                  : 'text-[16px] leading-[1.7] text-text/80 mb-5 last:mb-0'
              }
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* At a glance */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="border border-line p-7">
            <div className="inline-flex items-center gap-2 text-[14px] font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-accent" />
              {T.about.availability.title}
            </div>

            <dl className="space-y-0">
              {T.about.factoids.map((f, i) => (
                <div
                  key={i}
                  className="flex items-baseline justify-between gap-4 border-t border-line py-3.5 first:border-t-0 first:pt-0"
                >
                  <dt className="text-[11px] text-muted-2 uppercase tracking-[0.1em] font-semibold">
                    {f.label}
                  </dt>
                  <dd className="font-display font-medium text-[22px] tracking-[-0.5px] tabular-nums leading-none text-accent">
                    {f.useProjectCount ? PROJECTS.length.toString() : f.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-7 flex flex-col gap-2.5">
              <a
                href={`mailto:${T.contact.email}`}
                className="inline-flex items-center justify-center gap-2 text-[14px] font-semibold bg-text text-bg rounded-full px-5 py-3 hover:bg-accent transition-colors"
              >
                {T.about.actionRow.getInTouchLabel} →
              </a>
              <a
                href={T.contact.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 text-[14px] font-semibold border border-text rounded-full px-5 py-3 hover:bg-text hover:text-bg transition-colors"
              >
                {T.about.actionRow.resumeLabel}
              </a>
            </div>
          </div>
        </aside>
      </section>

      {/* Capabilities */}
      <section className="mt-16 pt-12 border-t border-line">
        <h2 className="text-[13px] uppercase tracking-[2px] text-muted mb-8">
          What I do
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-9">
          {CAPABILITIES.map((c, i) => (
            <div key={c.title}>
              <div className="flex items-baseline gap-3">
                <span className="font-display text-[14px] text-muted-2 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-[20px] tracking-[-0.3px]">
                  {c.title}
                </h3>
              </div>
              <p className="mt-2 pl-8 text-[15px] leading-[1.6] text-muted">
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Selected clients */}
      <section className="mt-16 pt-12 border-t border-line">
        <h2 className="text-[13px] uppercase tracking-[2px] text-muted mb-8">
          Selected clients &amp; brands
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-line border border-line">
          {PROJECTS.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-center bg-bg px-6 py-9"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/logos/${p.id}.png`}
                alt={p.title}
                className="max-h-9 w-auto max-w-[140px] object-contain opacity-55 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Availability banner */}
      <section className="mt-16">
        <div className="border border-line bg-panel px-7 py-10 sm:px-10 sm:py-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="max-w-[560px]">
            <h2 className="font-display text-[clamp(24px,3vw,38px)] leading-[1.1] tracking-[-0.5px]">
              {T.about.availability.title}
            </h2>
            <p className="text-[15px] text-muted mt-3">
              {T.about.availability.subtitle}
            </p>
          </div>
          <a
            href={`mailto:${T.contact.email}`}
            className="self-start sm:self-auto inline-flex items-center gap-2 text-[14px] font-semibold bg-text text-bg rounded-full px-6 py-3 hover:bg-accent transition-colors whitespace-nowrap"
          >
            {T.about.availability.buttonLabel} →
          </a>
        </div>
      </section>

      {/* Connect */}
      <section className="mt-16 pt-12 border-t border-line">
        <h2 className="text-[13px] uppercase tracking-[2px] text-muted mb-2">
          {T.about.headings.connect}
        </h2>
        <ul>
          <ContactRow label="Email" value={T.contact.email} href={`mailto:${T.contact.email}`} />
          <ContactRow label="Phone" value={T.contact.phone} href={`tel:${T.contact.phoneRaw}`} />
          <ContactRow
            label="LinkedIn"
            value={`@${T.contact.linkedinHandle}`}
            href={T.contact.linkedinUrl}
            external
          />
          <ContactRow
            label="Instagram"
            value={`@${T.contact.instagramHandle}`}
            href={T.contact.instagramUrl}
            external
          />
          <ContactRow label="Résumé" value="Download PDF" href={T.contact.resumeUrl} external />
        </ul>
      </section>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.12em] text-muted-2 font-semibold mb-1.5">
        {label}
      </div>
      <div className="text-[15px] font-medium text-text">{value}</div>
    </div>
  );
}

function ContactRow({
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
    <li>
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className="group flex items-center justify-between gap-4 py-4 border-b border-line hover:pl-2 transition-all"
      >
        <span className="text-[12px] uppercase tracking-[1.5px] text-muted-2 w-[110px] flex-none">
          {label}
        </span>
        <span className="font-display text-[clamp(18px,2vw,24px)] flex-1 group-hover:text-accent transition-colors">
          {value}
        </span>
        <span className="text-[15px] text-muted group-hover:text-accent transition-colors">↗</span>
      </a>
    </li>
  );
}
