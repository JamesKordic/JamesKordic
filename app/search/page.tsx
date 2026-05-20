'use client';

import { useState, useMemo } from 'react';
import { PROJECTS, CATEGORIES } from '@/lib/projects';
import { AlbumCard } from '@/components/album-card';
import { SearchIcon } from '@/components/icons';

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
    <div className="px-5 lg:px-8 pt-[78px] pb-[26px]">
      <div className="flex items-center gap-3 bg-elev rounded-[30px] px-5 py-[13px] max-w-[380px] border border-transparent focus-within:border-text transition-colors">
        <SearchIcon className="w-[22px] h-[22px] flex-none text-muted" />
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search projects, clients, disciplines…"
          autoComplete="off"
          className="bg-transparent border-none outline-none text-text font-medium text-[15px] w-full placeholder:text-muted-2"
        />
      </div>

      {filter.trim() && (
        <>
          <h3 className="font-display font-extrabold text-[23px] mt-[30px] mb-[14px]">
            {hits.length} result{hits.length !== 1 ? 's' : ''}
          </h3>
          {hits.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2">
              {hits.map((p, i) => (
                <AlbumCard key={p.id} p={p} i={i} />
              ))}
            </div>
          ) : (
            <p className="text-muted">No projects match &ldquo;{filter}&rdquo;.</p>
          )}
        </>
      )}

      <h3 className="font-display font-extrabold text-[23px] mt-[30px] mb-[14px]">
        Browse by discipline
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-[14px]">
        {CATEGORIES.map((c) => (
          <button
            key={c.name}
            onClick={() => setFilter(c.name)}
            style={{ background: c.c }}
            className="relative aspect-[1.7] rounded-[9px] overflow-hidden p-4 font-display font-extrabold text-[20px] tracking-[-0.01em] hover:scale-[1.03] transition-transform text-left"
          >
            {c.name}
            <span
              className="absolute -right-[14px] -bottom-[14px] w-[84px] h-[84px] bg-[rgba(0,0,0,0.28)] rounded-[9px]"
              style={{ transform: 'rotate(28deg)' }}
            />
          </button>
        ))}
      </div>

      <h3 className="font-display font-extrabold text-[23px] mt-[30px] mb-[14px]">All projects</h3>
      <div className="grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2">
        {PROJECTS.map((p, i) => (
          <AlbumCard key={p.id} p={p} i={i} />
        ))}
      </div>
    </div>
  );
}
