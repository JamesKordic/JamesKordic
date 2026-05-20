'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BackIcon, ForwardIcon, MenuIcon, PlayIcon } from './icons';
import { usePlayer } from '@/lib/player-context';

export function TopBar({
  title,
  showPlay = false,
  onPlayClick,
  onMenu,
  scrollRef,
}: {
  title: string;
  showPlay?: boolean;
  onPlayClick?: () => void;
  onMenu: () => void;
  scrollRef: React.RefObject<HTMLElement>;
}) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const { playFrom, state } = usePlayer();

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 180);
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, [scrollRef]);

  const handlePlay = () => {
    if (onPlayClick) onPlayClick();
    else playFrom(state.id);
  };

  return (
    <div
      className={`absolute top-0 left-0 right-0 z-20 flex items-center gap-[14px] px-[22px] py-[14px] transition-colors duration-[250ms] ${
        scrolled ? 'bg-[rgba(10,10,12,0.86)] backdrop-blur-[14px]' : ''
      }`}
    >
      <button
        onClick={onMenu}
        className="lg:hidden w-8 h-8 rounded-full bg-[rgba(0,0,0,0.55)] flex items-center justify-center hover:scale-[1.07] active:scale-[0.94] transition-transform"
        aria-label="Menu"
      >
        <MenuIcon className="w-[17px] h-[17px]" />
      </button>

      <div className="flex gap-2">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 rounded-full bg-[rgba(0,0,0,0.55)] flex items-center justify-center hover:scale-[1.07] active:scale-[0.94] transition-transform"
          aria-label="Back"
        >
          <BackIcon className="w-[17px] h-[17px]" />
        </button>
        <button
          onClick={() => router.forward()}
          className="w-8 h-8 rounded-full bg-[rgba(0,0,0,0.55)] flex items-center justify-center opacity-50 hover:opacity-100 hover:scale-[1.07] transition-all"
          aria-label="Forward"
        >
          <ForwardIcon className="w-[17px] h-[17px]" />
        </button>
      </div>

      {showPlay && scrolled && (
        <button
          onClick={handlePlay}
          className="w-[42px] h-[42px] rounded-full bg-accent flex items-center justify-center flex-none hover:scale-[1.06] transition-transform"
        >
          <PlayIcon className="w-[18px] h-[18px] fill-accent-ink" />
        </button>
      )}

      <span
        className={`font-display font-extrabold text-[21px] tracking-[-0.02em] whitespace-nowrap overflow-hidden text-ellipsis transition-all duration-[250ms] ${
          scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[6px]'
        }`}
      >
        {title}
      </span>

      <span className="flex-1" />

      <a
        href="mailto:Jkordic@me.com"
        className="hidden sm:block font-bold text-[13px] px-[17px] py-[9px] rounded-[30px] bg-text text-[#0a0a0a] hover:scale-[1.05] transition-transform flex-none"
      >
        Get in touch
      </a>
    </div>
  );
}
