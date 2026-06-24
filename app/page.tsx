'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { PROJECTS } from '@/lib/projects';
import { SITE_TEXT } from '@/lib/site-text';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

const T = SITE_TEXT;

/**
 * Home — a single scrolling page in the reference design: an intro line, the
 * work grid (the main event), then About and Contact sections, closed by the
 * footer. Mirrors `mportfolio.html`.
 */
export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main id="top">
        {/* Intro */}
        <section className="intro">
          <h1>{T.home.introHeadline}</h1>
          <p>{T.home.tagline} Currently open for freelance and full-time work — 2026.</p>
        </section>

        {/* Work grid */}
        <section className="work">
          <div className="workgrid">
            {PROJECTS.map((p) => (
              <Link key={p.id} className="card" href={`/work/${p.id}`}>
                <div className="thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.cover} alt={p.title} />
                </div>
                <div className="meta">
                  <span className="name">{p.title}</span>
                  <span className="kind">{p.tags.slice(0, 2).join(' · ')}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* About */}
        <section className="pageblock" id="about">
          <p className="block-head">About</p>
          <div className="about-grid">
            <div>
              <h2>{T.about.headline}</h2>
              {T.about.bio.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
              <a className="btn" href={T.contact.resumeUrl} target="_blank" rel="noopener noreferrer">
                Download Résumé (PDF)
              </a>
              <a className="btn" href={T.contact.linkedinUrl} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </div>
            <dl className="sidecard">
              {T.about.sidecard.map((row) => (
                <Fragment key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </Fragment>
              ))}
            </dl>
          </div>
        </section>

        {/* Contact */}
        <section className="pageblock contact" id="contact">
          <p className="block-head">Contact</p>
          <a className="line" href={`mailto:${T.contact.email}`}>
            {T.contact.email}
          </a>
          <span className="ph">{T.contact.phone}</span>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              (e.currentTarget as HTMLFormElement).reset();
              alert('Thanks — your message would be sent here.');
            }}
          >
            <div>
              <label htmlFor="n">Name *</label>
              <input id="n" name="name" required />
            </div>
            <div>
              <label htmlFor="c">Company</label>
              <input id="c" name="company" />
            </div>
            <div>
              <label htmlFor="e">Email</label>
              <input id="e" name="email" type="email" />
            </div>
            <div>
              <label htmlFor="m">Message *</label>
              <textarea id="m" name="message" required />
            </div>
            <button type="submit">Send message</button>
          </form>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
