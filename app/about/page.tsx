'use client';

import { PROJECTS } from '@/lib/projects';
import { SITE_TEXT } from '@/lib/site-text';

const T = SITE_TEXT;

export default function AboutPage() {
  return (
    <div className="max-w-[1200px]">
      {/* Intro */}
      <section className="max-w-[680px] pb-12 border-b border-line">
        <div className="text-[12px] uppercase tracking-[2px] text-accent font-bold mb-5">
          About — 2026
        </div>
        <h1 className="font-display font-normal text-[clamp(34px,4.5vw,58px)] leading-[1.1] tracking-[-0.5px]">
          {T.artist.firstName} <em className="italic text-accent">{T.artist.lastName}</em>
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-5 text-[14px] text-muted">
          <span className="text-text font-semibold">{PROJECTS.length} projects</span>
          <span className="w-1 h-1 rounded-full bg-muted-2 inline-block" />
          <span>{T.artist.location}</span>
          <span className="w-1 h-1 rounded-full bg-muted-2 inline-block" />
          <span>{T.artist.discipline}</span>
        </div>
      </section>

      {/* Bio + factoids */}
      <section className="grid lg:grid-cols-[1fr_300px] gap-10 lg:gap-14 mt-12">
        <div>
          {T.about.bio.map((paragraph, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? 'text-[19px] leading-[1.6] text-text mb-5'
                  : 'text-[16px] leading-[1.65] text-text/85 mb-5 last:mb-0'
              }
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div>
          {T.about.factoids.map((f, i) => (
            <div
              key={i}
              className="flex items-baseline gap-3 border-b border-line py-3.5 first:pt-0 last:border-b-0"
            >
              <div className="font-display font-medium text-[30px] tracking-[-0.5px] tabular-nums leading-none text-accent">
                {f.useProjectCount ? PROJECTS.length.toString() : f.value}
              </div>
              <div className="text-[11px] text-muted-2 uppercase tracking-[0.1em] font-semibold">
                {f.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Currently / availability */}
      <section className="mt-14 pt-12 border-t border-line">
        <h2 className="text-[13px] uppercase tracking-[2px] text-muted mb-5">
          {T.about.headings.currently}
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:justify-between">
          <div className="max-w-[520px]">
            <div className="inline-flex items-center gap-2 font-display text-[clamp(20px,2.4vw,28px)] leading-tight">
              <span className="w-2 h-2 rounded-full bg-accent" />
              {T.about.availability.title}
            </div>
            <p className="text-[15px] text-muted mt-2">{T.about.availability.subtitle}</p>
          </div>
          <a
            href={`mailto:${T.contact.email}`}
            className="self-start sm:self-auto inline-flex items-center gap-2 text-[14px] font-semibold border border-text rounded-full px-5 py-2.5 hover:bg-text hover:text-bg transition-colors whitespace-nowrap"
          >
            {T.about.availability.buttonLabel} →
          </a>
        </div>
      </section>

      {/* Connect */}
      <section className="mt-14 pt-12 border-t border-line">
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
