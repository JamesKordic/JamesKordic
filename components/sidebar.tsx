'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { PROJECTS, ARTIST } from '@/lib/projects';
import { usePlayer } from '@/lib/player-context';
import { HomeIcon, SearchIcon, UserIcon, LibraryIcon } from './icons';

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
        <Link href="/" onClick={onClose} className="flex items-center gap-[9px]">
          <span className={`brand-disc ${state.playing ? 'spinning' : ''}`} />
          <span>
            <span className="block font-display font-extrabold text-[15px] tracking-[-0.02em] leading-none">
              {ARTIST}
            </span>
            <span className="block text-[10px] tracking-[0.22em] uppercase text-muted-2 mt-[3px]">
              Design Records
            </span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <div className="bg-panel rounded-[11px]">
        <nav className="px-[10px] pt-[6px] pb-3">
          <NavItem href="/" icon={<HomeIcon className="w-[21px] h-[21px]" />} active={isActive('/')} onClick={onClose}>
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
          {PROJECTS.map((p) => (
            <Link
              key={p.id}
              href={`/work/${p.id}`}
              onClick={onClose}
              className={`flex items-center gap-[11px] w-full text-left p-2 rounded-lg transition-colors hover:bg-elev ${
                state.id === p.id && state.playing ? 'text-accent' : ''
              }`}
            >
              <div className="w-[46px] h-[46px] rounded-[5px] flex-none overflow-hidden bg-panel-2 relative">
                <Image src={p.cover} alt="" fill sizes="46px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-[13.5px] truncate">{p.title}</div>
                <div className="text-[11.5px] text-muted-2 truncate mt-[2px]">
                  Project · {ARTIST}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}

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
      className={`flex items-center gap-[15px] w-full px-3 py-[11px] rounded-lg font-bold text-[14px] transition-colors ${
        active ? 'text-text' : 'text-muted hover:text-text'
      }`}
    >
      <span className={active ? '[&_.ic-fill]:fill-accent' : ''}>{icon}</span>
      {children}
    </Link>
  );
}
