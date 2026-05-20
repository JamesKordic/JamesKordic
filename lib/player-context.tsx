'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from 'react';
import { PROJECTS, getProject } from './projects';

type PlayerState = {
  id: string;
  playing: boolean;
  progress: number;
  liked: Record<string, boolean>;
  shuffle: boolean;
  repeat: boolean;
  vol: number;
};

type Ctx = {
  state: PlayerState;
  playFrom: (id: string) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  seek: (progress: number) => void;
  setVol: (v: number) => void;
  toggleLike: (id?: string) => void;
  shufflePlay: () => void;
};

const PlayerContext = createContext<Ctx | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlayerState>({
    id: 'the-syndicate',
    playing: false,
    progress: 0,
    liked: {},
    shuffle: false,
    repeat: false,
    vol: 0.72,
  });
  const tickerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTicker = () => {
    if (tickerRef.current) {
      clearInterval(tickerRef.current);
      tickerRef.current = null;
    }
  };

  useEffect(() => {
    clearTicker();
    if (!state.playing) return;
    tickerRef.current = setInterval(() => {
      setState((s) => {
        const p = getProject(s.id);
        if (!p) return s;
        const nextProgress = s.progress + 1 / p.len;
        if (nextProgress >= 1) {
          if (s.repeat) return { ...s, progress: 0 };
          const idx = PROJECTS.findIndex((x) => x.id === s.id);
          const nextIdx = s.shuffle
            ? Math.floor(Math.random() * PROJECTS.length)
            : (idx + 1) % PROJECTS.length;
          return { ...s, id: PROJECTS[nextIdx].id, progress: 0 };
        }
        return { ...s, progress: nextProgress };
      });
    }, 1000);
    return clearTicker;
  }, [state.playing]);

  const playFrom = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      id,
      progress: s.id === id ? s.progress : 0,
      playing: true,
    }));
  }, []);

  const togglePlay = useCallback(() => {
    setState((s) => ({ ...s, playing: !s.playing }));
  }, []);

  const next = useCallback(() => {
    setState((s) => {
      const idx = PROJECTS.findIndex((p) => p.id === s.id);
      const nextIdx = s.shuffle
        ? Math.floor(Math.random() * PROJECTS.length)
        : (idx + 1) % PROJECTS.length;
      return { ...s, id: PROJECTS[nextIdx].id, progress: 0 };
    });
  }, []);

  const prev = useCallback(() => {
    setState((s) => {
      if (s.progress > 0.06) return { ...s, progress: 0 };
      const idx = PROJECTS.findIndex((p) => p.id === s.id);
      const prevIdx = (idx - 1 + PROJECTS.length) % PROJECTS.length;
      return { ...s, id: PROJECTS[prevIdx].id, progress: 0 };
    });
  }, []);

  const toggleShuffle = useCallback(
    () => setState((s) => ({ ...s, shuffle: !s.shuffle })),
    []
  );
  const toggleRepeat = useCallback(
    () => setState((s) => ({ ...s, repeat: !s.repeat })),
    []
  );

  const seek = useCallback((progress: number) => {
    setState((s) => ({ ...s, progress: Math.max(0, Math.min(1, progress)) }));
  }, []);

  const setVol = useCallback((v: number) => {
    setState((s) => ({ ...s, vol: Math.max(0, Math.min(1, v)) }));
  }, []);

  const toggleLike = useCallback((id?: string) => {
    setState((s) => {
      const target = id || s.id;
      return { ...s, liked: { ...s.liked, [target]: !s.liked[target] } };
    });
  }, []);

  const shufflePlay = useCallback(() => {
    const r = PROJECTS[Math.floor(Math.random() * PROJECTS.length)];
    playFrom(r.id);
  }, [playFrom]);

  return (
    <PlayerContext.Provider
      value={{
        state,
        playFrom,
        togglePlay,
        next,
        prev,
        toggleShuffle,
        toggleRepeat,
        seek,
        setVol,
        toggleLike,
        shufflePlay,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}
