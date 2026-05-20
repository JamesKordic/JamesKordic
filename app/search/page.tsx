'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PROJECTS, CATEGORIES } from '@/lib/projects';

export default function SearchPage() {
  const [filter, setFilter] = useState('');

  const hits = useMemo(() => {
    const f = filter.trim().toLowerCase();
    if (!f) return PROJECTS;
    return PROJECTS.filter(
      (p) =>
        p.title.toLowerCase().includes(f) ||
        p.tags.join(' ').toLowerCase().includes(f) ||
        p.client.toLowerCase().includes(f) ||
        p.sections.some((s) => s.title.toLowerCase().includes(f))
    );
  }, [filter]);

  return (
    <div className="px-4 lg:px-8 pt-20 lg:pt-24 pb-12">
      <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted mb-4">
        ◉ TUNING IN
      </div>
      <h1 className="font-display font-light text-[60px] lg:text-[120px] tracking-[-0.035em] leading-[0.88] mb-8">
        Search the <span className="display-italic text-coral">catalog</span>
      </h1>

      {/* Search field */}
      <div className="relative max-w-2xl mb-12 border-b-2 border-ink pb-2 focus-within:border-coral transition-colors">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[12px] text-muted">→</span>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="title, client, discipline..."
            autoComplete="off"
            className="bg-transparent border-none outline-none text-ink font-display text-[24px] lg:text-[32px] font-light w-full placeholder:text-muted/50"
          />
        </div>
      </div>

      {/* Category chips */}
      <div className="mb-12">
        <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted mb-4">
          ╳ FILTER BY DISCIPLINE
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const active = filter.toLowerCase() === c.name.toLowerCase();
            return (
              <button
                key={c.name}
                onClick={() => setFilter(active ? '' : c.name)}
                className={`font-mono text-[11px] tracking-[0.12em] uppercase px-4 py-2 border transition-all ${
                  active
                    ? 'bg-ink text-paper border-ink'
                    : 'border-ink/30 hover:border-ink hover:bg-paper-2'
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted mb-6 flex items-center gap-3">
        <span>● RESULTS</span>
        <span className="text-ink">{String(hits.length).padStart(2, '0')}</span>
        {filter && (
          <button
            onClick={() => setFilter('')}
            className="text-coral hover:underline ml-auto"
          >
            CLEAR ✕
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {hits.map((p, i) => (
          <Link key={p.id} href={`/work/${p.id}`} className="group block stagger" style={{ animationDelay: `${i * 40}ms` }}>
            <div className="relative aspect-[4/5] overflow-hidden bg-paper-3 mb-3">
              <Image
                src={p.cover}
                alt={p.title}
                fill
                sizes="(max-width:1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/30 transition-colors" />
            </div>
            <div className="font-display font-bold text-[18px] tracking-[-0.01em] leading-tight group-hover:text-coral transition-colors">
              {p.title}
            </div>
            <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted mt-1">
              {p.client} · {p.year}
            </div>
          </Link>
        ))}
      </div>

      {hits.length === 0 && (
        <div className="text-center py-16">
          <div className="font-display font-light text-[40px] text-muted">
            No signal on that frequency.
          </div>
        </div>
      )}
    </div>
  );
}
