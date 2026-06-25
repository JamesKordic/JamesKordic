'use client';

import { useState, useMemo } from 'react';
import { PROJECTS, CATEGORIES } from '@/lib/projects';
import { WorkCard } from '@/components/work-card';
import { SITE_TEXT } from '@/lib/site-text';

const T = SITE_TEXT;

export default function SearchPage() {
  const [filter, setFilter] = useState('');

  const hits = useMemo(() => {
    const f = filter.trim().toLowerCase();
    if (!f) return [];
    return PROJECTS.filter(
      (p) =>
        p.title.toLowerCase().includes(f) ||
        p.tags.join(' ').toLowerCase().includes(f) ||
        p.client.toLowerCase().includes(f) ||
        p.sections.some((s) => s.title.toLowerCase().includes(f))
    );
  }, [filter]);

  return (
    <div>
      {/* Intro */}
      <section className="max-w-[640px] pb-10 border-b border-line">
        <div className="text-[12px] uppercase tracking-[2px] text-accent font-bold mb-5">
          Browse — {PROJECTS.length} projects
        </div>
        <h1 className="font-display font-semibold text-[clamp(32px,4.2vw,52px)] leading-[1.1] tracking-[-0.025em]">
          {T.search.heading}
        </h1>
      </section>

      {/* Search field */}
      <div className="mt-8 flex items-center gap-3 border-b border-text/30 focus-within:border-text pb-3 max-w-[440px] transition-colors">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 flex-none text-muted">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder={T.search.placeholder}
          autoComplete="off"
          className="bg-transparent border-none outline-none text-text font-medium text-[16px] w-full placeholder:text-muted-2"
        />
      </div>

      {filter.trim() && (
        <>
          <h3 className="text-[13px] uppercase tracking-[2px] text-muted mt-10 mb-6">
            {hits.length} {T.search.resultLabel}
            {hits.length !== 1 ? 's' : ''}
          </h3>
          {hits.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-7 gap-y-9">
              {hits.map((p, i) => (
                <WorkCard key={p.id} p={p} i={i} />
              ))}
            </div>
          ) : (
            <p className="text-muted text-[16px]">
              {T.search.noResults} &ldquo;{filter}&rdquo;.
            </p>
          )}
        </>
      )}

      {/* Browse by discipline */}
      <h3 className="text-[13px] uppercase tracking-[2px] text-muted mt-12 mb-5">
        {T.search.browseByDiscipline}
      </h3>
      <div className="flex flex-wrap gap-2.5">
        {CATEGORIES.map((c) => (
          <button
            key={c.name}
            onClick={() => setFilter(c.name)}
            className="text-[14px] border border-line rounded-full px-4 py-2 text-muted hover:border-accent hover:text-accent transition-colors"
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* All projects */}
      <h3 className="text-[13px] uppercase tracking-[2px] text-muted mt-12 mb-6">
        {T.search.allProjects}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-7 gap-y-9">
        {PROJECTS.map((p, i) => (
          <WorkCard key={p.id} p={p} i={i} />
        ))}
      </div>

      <p className="text-muted-2 text-[12px] mt-14">{T.footer.copyright}</p>
    </div>
  );
}
