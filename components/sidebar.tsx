'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { PROJECTS, ARTIST } from '@/lib/projects';
import { usePlayer } from '@/lib/player-context';
import { HomeIcon, SearchIcon, UserIcon, LibraryIcon } from './icons';
import { ProjectMonogram } from './project-monogram';

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { state } = usePlayer();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  return (
    <aside
      className={`flex flex-col gap-2 min-h-0 fixed lg:static top-0 bottom-0 left-0 w-[280px] lg:w-[248px] z-[130] p-2 lg:p-0 lg:row-start-1 lg:col-start-1 bg-bg lg:bg-transparent transition-transform duration-[260ms] ${
        open ? 'translate-x-0' : '-translate-x-[104%] lg:translate-x-0'
      }`}
    >
      {/* Brand */}
      <div className="bg-panel rounded-[11px] px-[18px] py-[20px] pb-[18px]">
        <Link href="/" onClick={onClose} className="flex items-center gap-[10px] group">
          {/* Custom logo — replaces the spinning disc.
              On hover, gets a soft gradient glow.
              When player is playing, gets a subtle pulse. */}
          <span className="relative w-9 h-9 flex-none flex items-center justify-center">
            <span
              className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md ${state.playing ? 'opacity-60' : ''}`}
              style={{
                background:
                  'conic-gradient(from 0deg, #c8f135, #22d3ee, #ff2d8a, #c8f135)',
              }}
              aria-hidden
            />
            <Image
              src="/logo.png"
              alt="James Kordic logo"
              width={36}
              height={36}
              className="relative w-9 h-9 object-contain"
              priority
            />
          </span>
          <span>
            <span className="block font-display font-extrabold text-[15px] tracking-[-0.02em] leading-none">
              {ARTIST}
            </span>
            <span className="block text-[10px] tracking-[0.22em] uppercase text-muted-2 mt-[3px]">
              Graphic Design
            </span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <div className="bg-panel rounded-[11px]">
        <nav className="px-[10px] pt-[6px] pb-3">
          <NavItem
            href="/"
            icon={<HomeIcon className="w-[21px] h-[21px]" />}
            active={isActive('/')}
            onClick={onClose}
          >
            Home
          </NavItem>
          <NavItem
            href="/search"
            icon={<SearchIcon className="w-[21px] h-[21px]" />}
            active={isActive('/search')}
            onClick={onClose}
          >
            Browse Work
          </NavItem>
          <NavItem
            href="/about"
            icon={<UserIcon className="w-[21px] h-[21px]" />}
            active={isActive('/about')}
            onClick={onClose}
          >
            About / Contact
          </NavItem>
        </nav>
      </div>

      {/* Library */}
      <div className="bg-panel rounded-[11px] flex-1 min-h-0 flex flex-col pt-[14px] px-[6px] pb-[6px]">
        <div className="flex items-center justify-between px-3 pb-3">
          <span className="flex items-center gap-[11px] font-bold text-[14px] text-muted">
            <LibraryIcon className="w-5 h-5" />
            Your Library
          </span>
          <span className="text-[11px] text-muted-2 border border-line rounded-[20px] px-[9px] py-[3px]">
            {PROJECTS.length} projects
          </span>
        </div>
        <div className="overflow-y-auto flex-1 px-[6px] pb-[6px] scrollbar-thin">
          {PROJECTS.map((p) => {
            const isPlayingThis = state.id === p.id && state.playing;
            const isOnThisPage = pathname === `/work/${p.id}`;
            return (
              <Link
                key={p.id}
                href={`/work/${p.id}`}
                onClick={onClose}
                className={`flex items-center gap-[11px] w-full text-left p-2 rounded-lg transition-colors ${
                  isOnThisPage ? 'bg-elev' : 'hover:bg-elev'
                }`}
              >
                <ProjectMonogram p={p} size={46} />
                <div className="min-w-0">
                  <div
                    className={`font-semibold text-[13.5px] truncate ${
                      // Both "currently on this page" and "currently playing"
                      // get the gradient treatment — keeps the palette
                      // consistent and avoids any solid green
                      isOnThisPage || isPlayingThis ? 'gradient-text-static' : ''
                    }`}
                  >
                    {p.title}
                  </div>
                  <div className="text-[11.5px] text-muted-2 truncate mt-[2px]">
                    Project · {ARTIST}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

/**
 * Sidebar nav item.
 *
 * When active (the current page):
 *  - A vertical gradient bar appears on the left edge
 *  - The text uses gradient-text-static (lime → cyan → magenta)
 *  - A subtle background pill highlights the row
 *
 * When inactive:
 *  - Muted grey text
 *  - On hover, brightens to full white
 */
function NavItem({
  href,
  icon,
  active,
  children,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`relative flex items-center gap-[15px] w-full px-3 py-[11px] rounded-lg font-bold text-[14px] transition-all ${
        active ? 'bg-elev/60' : 'text-muted hover:text-text hover:bg-elev/30'
      }`}
    >
      {/* Active-state indicator bar on the left edge */}
      {active && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[18px] rounded-full"
          style={{
            background:
              'linear-gradient(180deg, #c8f135 0%, #22d3ee 50%, #ff2d8a 100%)',
          }}
          aria-hidden
        />
      )}
      <span className={active ? 'text-cyan' : ''}>{icon}</span>
      <span className={active ? 'gradient-text-static' : ''}>{children}</span>
    </Link>
  );
}
