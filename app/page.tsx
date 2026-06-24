'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { PROJECTS } from '@/lib/projects';
import { SITE_TEXT } from '@/lib/site-text';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

const T = SITE_TEXT;

/**
 * Home — a Pentagram-style editorial index: a paper canvas with a sticky name
 * header, a single oversized intro line, a sticky discipline filter row, and a
 * bordered grid of project tiles. Each tile shows its title over the cover and
 * slides up a meta panel on hover, then links through to its case study.
 */
export default function HomePage() {
  const [filter, setFilter] = useState('all');

  // Discipline filters, derived from the projects' own tags so the bar always
  // reflects the real catalog. "All" is prepended.
  const filters = useMemo(() => {
    const set = new Set<string>();
    PROJECTS.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return ['all', ...Array.from(set)];
  }, []);

  const shown = PROJECTS.filter(
    (p) => filter === 'all' || p.tags.includes(filter)
  );

  return (
    <div className="min-h-screen bg-bg text-text">
      <SiteHeader />

      {/* Intro line */}
      <section className="max-w-[1100px] border-b border-line px-6 pb-10 pt-16 sm:px-8">
        <h1 className="text-[clamp(28px,4.4vw,58px)] font-semibold leading-[1.06] tracking-[-0.025em]">
          {T.artist.name} is a graphic &amp; motion designer building brands,
          campaigns and identities.{' '}
          <em className="not-italic text-muted">
            Selected work below — across music, entertainment, food and tech.
          </em>
        </h1>
      </section>

      {/* Filter row */}
      <div className="sticky top-[61px] z-40 flex flex-wrap gap-x-5 gap-y-1.5 border-b border-line bg-bg px-6 py-[18px] text-[14px] font-medium sm:px-8">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`transition-colors ${
              filter === f ? 'text-text' : 'text-muted hover:text-text'
            }`}
          >
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <main className="jk-grid">
        {shown.map((p) => (
          <Link key={p.id} href={`/work/${p.id}`} className="jk-card">
            <div className="jk-art">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.cover} alt={p.title} />
            </div>
            <div className="jk-always">
              <h3>{p.title}</h3>
              <p>{p.blurb}</p>
            </div>
            <div className="jk-meta">
              <h3>{p.title}</h3>
              <p>{p.blurb}</p>
            </div>
          </Link>
        ))}
      </main>

      <SiteFooter />

      <style jsx>{`
        .jk-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
        }
        .jk-card {
          position: relative;
          display: block;
          aspect-ratio: 1 / 1.04;
          overflow: hidden;
          border-right: 1px solid var(--jk-line);
          border-bottom: 1px solid var(--jk-line);
        }
        .jk-card:nth-child(3n) {
          border-right: none;
        }
        .jk-art {
          position: absolute;
          inset: 0;
          background: #ececec;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .jk-art :global(img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .jk-card:hover .jk-art {
          transform: scale(1.04);
        }

        .jk-always {
          position: absolute;
          left: 20px;
          bottom: 18px;
          right: 20px;
          transition: opacity 0.25s;
          pointer-events: none;
        }
        .jk-card:hover .jk-always {
          opacity: 0;
        }
        .jk-always h3 {
          font-size: 18px;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: #fff;
          text-shadow: 0 1px 14px rgba(0, 0, 0, 0.5);
        }
        .jk-always p {
          margin-top: 3px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.88);
          text-shadow: 0 1px 12px rgba(0, 0, 0, 0.5);
        }

        .jk-meta {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 18px 20px;
          background: var(--jk-paper);
          border-top: 1px solid var(--jk-line);
          transform: translateY(101%);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .jk-card:hover .jk-meta {
          transform: translateY(0);
        }
        .jk-meta h3 {
          font-size: 18px;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: var(--jk-ink);
        }
        .jk-meta p {
          margin-top: 3px;
          font-size: 13px;
          color: var(--jk-grey);
        }

        @media (max-width: 880px) {
          .jk-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .jk-card:nth-child(3n) {
            border-right: 1px solid var(--jk-line);
          }
          .jk-card:nth-child(2n) {
            border-right: none;
          }
        }
        @media (max-width: 560px) {
          .jk-grid {
            grid-template-columns: 1fr;
          }
          .jk-card {
            aspect-ratio: 1 / 0.78;
            border-right: none !important;
          }
          .jk-meta {
            position: static;
            transform: none;
            border-top: 1px solid var(--jk-line);
          }
          .jk-always {
            display: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .jk-art,
          .jk-meta,
          .jk-always {
            transition: none;
          }
        }
      `}</style>

      <style jsx global>{`
        :root {
          --jk-ink: #0a0a0a;
          --jk-paper: #ffffff;
          --jk-grey: #727272;
          --jk-line: #e6e6e6;
        }
      `}</style>
    </div>
  );
}
