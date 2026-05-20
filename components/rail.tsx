'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { PROJECTS, ARTIST } from '@/lib/projects';
import { usePlayer } from '@/lib/player-context';
import { useState } from 'react';

/**
 * Thin vertical icon rail. Hover/tap reveals a slide-out drawer with
 * library and full navigation. Replaces the Spotify-style sidebar.
 */
export function Rail({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { state } = usePlayer();
  const [hovered, setHovered] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  const expanded = hovered || open;

  return (
    <>
      {/* Desktop rail */}
      <aside
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`hidden lg:flex flex-col bg-paper border-r border-ink/10 transition-[width] duration-300 ease-out z-30 ${
          expanded ? 'w-[280px]' : 'w-[64px]'
        }`}
      >
        <RailContent expanded={expanded} isActive={isActive} playingId={state.id} playing={state.playing} />
      </aside>

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden fixed top-0 bottom-0 left-0 w-[280px] z-[130] bg-paper border-r border-ink/10 transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <RailContent expanded={true} isActive={isActive} playingId={state.id} playing={state.playing} onLinkClick={onClose} />
      </aside>
    </>
  );
}

function RailContent({
  expanded,
  isActive,
  playingId,
  playing,
  onLinkClick,
}: {
  expanded: boolean;
  isActive: (p: string) => boolean;
  playingId: string;
  playing: boolean;
  onLinkClick?: () => void;
}) {
  return (
    <>
      {/* Brand mark */}
      <div className="px-3 py-5 border-b border-ink/10">
        <Link
          href="/"
          onClick={onLinkClick}
          className="flex items-center gap-3 group"
        >
          <span className={`w-9 h-9 rounded-full flex-none disc-spin ${playing ? 'spinning' : ''}`} />
          {expanded && (
            <div className="overflow-hidden whitespace-nowrap">
              <div className="font-display font-extrabold text-[17px] tracking-[-0.02em] leading-none">
                {ARTIST}
              </div>
              <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-muted mt-1">
                FREQ · 105.8
              </div>
            </div>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="px-2 py-3 border-b border-ink/10">
        <NavLink href="/" expanded={expanded} active={isActive('/')} onLinkClick={onLinkClick} label="Home" />
        <NavLink href="/search" expanded={expanded} active={isActive('/search')} onLinkClick={onLinkClick} label="Browse" />
        <NavLink href="/about" expanded={expanded} active={isActive('/about')} onLinkClick={onLinkClick} label="Signal" />
      </nav>

      {/* Library — only show when expanded */}
      <div className="flex-1 min-h-0 flex flex-col">
        {expanded && (
          <>
            <div className="px-4 pt-4 pb-2 flex items-baseline justify-between">
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted">
                Catalog
              </span>
              <span className="font-mono text-[10px] tabular-nums text-muted">
                {String(PROJECTS.length).padStart(2, '0')}
              </span>
            </div>
            <div className="overflow-y-auto flex-1 px-2 pb-3 scrollbar-styled">
              {PROJECTS.map((p) => (
                <Link
                  key={p.id}
                  href={`/work/${p.id}`}
                  onClick={onLinkClick}
                  className="flex items-center gap-3 w-full text-left p-2 rounded-md hover:bg-paper-2 transition-colors group"
                >
                  <div className="w-10 h-10 flex-none overflow-hidden bg-paper-3 relative">
                    <Image src={p.cover} alt="" fill sizes="40px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={`text-[13px] font-semibold truncate leading-tight ${playingId === p.id && playing ? 'text-coral' : ''}`}>
                      {p.title}
                    </div>
                    <div className="font-mono text-[10px] text-muted truncate mt-0.5">
                      {p.tags[0]}
                    </div>
                  </div>
                  {playingId === p.id && playing && (
                    <span className="eq run text-coral flex-none">
                      <span /><span /><span /><span />
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

function NavLink({
  href,
  expanded,
  active,
  label,
  onLinkClick,
}: {
  href: string;
  expanded: boolean;
  active: boolean;
  label: string;
  onLinkClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onLinkClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors mb-0.5 ${
        active ? 'bg-ink text-paper' : 'hover:bg-paper-2'
      }`}
    >
      <span className={`w-3 h-3 rounded-full flex-none transition-colors ${active ? 'bg-coral glow-coral' : 'bg-ink/20'}`} />
      {expanded && (
        <span className="font-display font-semibold text-[15px] tracking-[-0.01em] whitespace-nowrap">
          {label}
        </span>
      )}
    </Link>
  );
}
