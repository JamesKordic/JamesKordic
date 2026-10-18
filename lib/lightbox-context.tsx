'use client';

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import type { Media } from './projects';

type LbCtx = {
  items: Media[];
  index: number;
  open: boolean;
  show: (items: Media[], index: number) => void;
  close: () => void;
  step: (d: number) => void;
};

const LightboxContext = createContext<LbCtx | null>(null);

export function LightboxProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [items, setItems] = useState<Media[]>([]);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const show = useCallback((newItems: Media[], i: number) => {
    setItems(newItems);
    setIndex(i);
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    close();
    window.addEventListener('popstate', close);
    return () => window.removeEventListener('popstate', close);
  }, [pathname, close]);

  const step = useCallback(
    (d: number) => {
      setIndex((i) => (i + d + items.length) % items.length);
    },
    [items.length]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    };
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close, step]);

  return (
    <LightboxContext.Provider value={{ items, index, open, show, close, step }}>
      {children}
    </LightboxContext.Provider>
  );
}

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error('useLightbox must be used within LightboxProvider');
  return ctx;
}
