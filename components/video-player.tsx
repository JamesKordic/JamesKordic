'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { SITE_TEXT } from '@/lib/site-text';

/**
 * Custom video player used inside case-study sections.
 *
 * Behavior:
 *  - Always STARTS UNMUTED (per spec)
 *  - Does NOT autoplay. Browsers block sound from autoplaying anyway;
 *    requiring the user to press play is both spec-compliant and
 *    avoids surprise audio when scrolling past a section.
 *  - Click on the VIDEO body toggles play/pause
 *  - Clicks on the control bar are isolated — they do their own thing
 *    and don't toggle play
 *  - Full control bar at the bottom: play, time, scrubbable progress
 *    bar, total time, mute, and fullscreen
 *  - Keyboard shortcuts when the player is focused/hovered:
 *      Space    play/pause
 *      ←/→      seek -5s / +5s
 *      M        mute toggle
 *      F        fullscreen toggle
 *  - Auto-thumbnail: nudges currentTime to 0.05 on mount so a real frame
 *    shows instead of a black box
 *  - Pauses when scrolled out of view (no surprise audio later)
 *
 * Props:
 *  - src: video URL
 *  - aspect: CSS aspect-ratio string for the container (e.g. "16/9")
 *  - poster: optional poster image URL
 *  - fit: 'contain' (no cropping, may letterbox) or 'cover' (crop to fill)
 */
export function VideoPlayer({
  src,
  aspect = '16/9',
  poster,
  fit = 'contain',
}: {
  src: string;
  aspect?: string;
  poster?: string;
  fit?: 'contain' | 'cover';
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrubRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [thumbnailReady, setThumbnailReady] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  /** How much of the video has been buffered, as a 0–1 fraction of duration.
   *  Drawn as a faint white overlay on the scrub bar behind the gradient fill,
   *  so the user can see what's already downloaded vs. what's being played. */
  const [buffered, setBuffered] = useState(0);
  /** Tracked separately from hover so we can keep controls visible during
   *  a scrub drag even if the cursor moves outside the bar momentarily. */
  const [scrubbing, setScrubbing] = useState(false);
  /** Hover state for the scrub bar's hit area specifically. Separate from
   *  the player-level `hovering` because we want the scrub handle to
   *  appear when the mouse is over the bar (not just anywhere on the
   *  player). Also drives the bar's 4px → 6px height growth on hover. */
  const [barHover, setBarHover] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  // Keep DOM muted attribute in sync with state
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  /* Auto-thumbnail — see longer explanation below. Seeks to 0.05s on mount
   * so the first frame decodes and replaces the black box. */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (poster) {
      setThumbnailReady(true);
      return;
    }
    const handleLoadedMetadata = () => {
      try {
        v.currentTime = 0.05;
      } catch {
        /* not seekable yet — fine to skip */
      }
    };
    const handleSeeked = () => setThumbnailReady(true);
    v.addEventListener('loadedmetadata', handleLoadedMetadata);
    v.addEventListener('seeked', handleSeeked);
    return () => {
      v.removeEventListener('loadedmetadata', handleLoadedMetadata);
      v.removeEventListener('seeked', handleSeeked);
    };
  }, [poster, src]);

  /* Wire up time / duration / buffered events. These drive the scrub bar,
   * the time readouts, and the buffered-progress overlay. */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // Read duration eagerly in case the metadata event already fired
    // before this effect ran. (preload="metadata" can complete fast.)
    if (isFinite(v.duration) && v.duration > 0) setDuration(v.duration);

    const onTime = () => setCurrentTime(v.currentTime);
    const onDuration = () => {
      if (isFinite(v.duration) && v.duration > 0) setDuration(v.duration);
    };
    const onProgress = () => {
      // buffered.end(N) might throw if no ranges are loaded — guard it
      if (v.buffered.length > 0 && v.duration) {
        setBuffered(v.buffered.end(v.buffered.length - 1) / v.duration);
      }
    };
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('durationchange', onDuration);
    v.addEventListener('loadedmetadata', onDuration);
    v.addEventListener('progress', onProgress);
    return () => {
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('durationchange', onDuration);
      v.removeEventListener('loadedmetadata', onDuration);
      v.removeEventListener('progress', onProgress);
    };
  }, []);

  /* Pause when scrolled out of view */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && !v.paused) v.pause();
      },
      { threshold: 0.25 }
    );
    observer.observe(v);
    return () => observer.disconnect();
  }, []);

  /* Track fullscreen state — the API doesn't directly tell us, so we
   * listen for the change event and check document.fullscreenElement. */
  useEffect(() => {
    const onFs = () => {
      setFullscreen(document.fullscreenElement === containerRef.current);
    };
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  /** Computes a seek position from a pointer event and applies it.
   *  Used for both click-to-seek and drag-to-scrub.
   *
   *  Note: we update currentTime state IMMEDIATELY here rather than waiting
   *  for the video's `timeupdate` event, because that event only fires at
   *  ~4Hz. During a scrub drag the time readout needs to feel like it's
   *  following the cursor, not lagging behind it. */
  const seekFromEvent = useCallback((clientX: number) => {
    const v = videoRef.current;
    const bar = scrubRef.current;
    if (!v || !bar) return;
    const dur = v.duration;
    if (!isFinite(dur) || dur <= 0) return;
    const rect = bar.getBoundingClientRect();
    const frac = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const target = frac * dur;
    v.currentTime = target;
    setCurrentTime(target);
  }, []);

  /** Tracks whether a scrub drag is active. We use a ref (not state) here
   *  because pointermove events can fire BEFORE React flushes the state
   *  update from setScrubbing(true) — and a stale-closure read of state
   *  would cause the move handler to bail out and never scrub. A ref
   *  updates synchronously, so the move handler always sees the truth. */
  const scrubbingRef = useRef(false);

  /* Scrubbing: pointerdown starts a drag, pointermove tracks it, pointerup
   * ends it. setPointerCapture keeps pointer events routed to the bar
   * element even when the cursor moves outside it — that's what makes a
   * smooth drag possible without losing the gesture mid-motion. */
  const handleScrubStart = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    scrubbingRef.current = true;
    setScrubbing(true);
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      /* Some browsers/elements don't support pointer capture — drag
       *  still works via the native pointer event flow, just less robustly. */
    }
    seekFromEvent(e.clientX);
  };
  const handleScrubMove = (e: React.PointerEvent) => {
    if (!scrubbingRef.current) return;
    e.stopPropagation();
    e.preventDefault();
    seekFromEvent(e.clientX);
  };
  const handleScrubEnd = (e: React.PointerEvent) => {
    if (!scrubbingRef.current) return;
    e.stopPropagation();
    scrubbingRef.current = false;
    setScrubbing(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* releasing pointer capture can throw if it wasn't held — ignore */
    }
  };

  const togglePlay = async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      if (v.paused) {
        await v.play();
        setPlaying(true);
      } else {
        v.pause();
        setPlaying(false);
      }
    } catch {
      // Some browsers block unmuted play() until first user gesture.
      // Retry muted as a graceful fallback.
      v.muted = true;
      setMuted(true);
      try {
        await v.play();
        setPlaying(true);
      } catch {
        /* give up silently */
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMuted((m) => !m);
  };

  const toggleFullscreen = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const el = containerRef.current;
    if (!el) return;
    try {
      if (document.fullscreenElement === el) {
        await document.exitFullscreen();
      } else {
        await el.requestFullscreen();
      }
    } catch {
      /* fullscreen API can be blocked or unsupported — silent skip */
    }
  };

  /* Keyboard shortcuts. The container is given tabindex=-1 + focusable
   * behavior; we listen on keydown only when this video is hovered or
   * focused so multiple videos on the page don't all respond at once. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = containerRef.current;
      if (!el) return;
      // Only act if this player is the focused element OR mouse is hovering it
      const isActive = document.activeElement === el || hovering;
      if (!isActive) return;
      const v = videoRef.current;
      if (!v) return;
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          v.currentTime = Math.max(0, v.currentTime - 5);
          break;
        case 'ArrowRight':
          e.preventDefault();
          v.currentTime = Math.min(v.duration || 0, v.currentTime + 5);
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          setMuted((x) => !x);
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen({ stopPropagation() {} } as unknown as React.MouseEvent);
          break;
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // togglePlay and toggleFullscreen are stable enough — including them
    // would require useCallback wrapping for every method. The closure
    // captures the latest refs/state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hovering]);

  const progressFrac = duration > 0 ? currentTime / duration : 0;
  // Show controls when not playing, when hovering, or while actively scrubbing
  const controlsVisible = !playing || hovering || scrubbing;

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black overflow-hidden group cursor-pointer select-none"
      style={{ aspectRatio: aspect }}
      onClick={togglePlay}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      tabIndex={-1}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        preload="metadata"
        playsInline
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        className={`absolute inset-0 w-full h-full bg-black ${
          fit === 'cover' ? 'object-cover' : 'object-contain'
        }`}
      />

      {/* Loading shimmer */}
      {!thumbnailReady && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-2 text-[12px] font-mono">
          {SITE_TEXT.videoPlayer.loadingLabel}
        </div>
      )}

      {/* Center play button when paused */}
      {!playing && thumbnailReady && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-bg/80 backdrop-blur-md flex items-center justify-center shadow-[0_8px_24px_-6px_rgba(0,0,0,0.6)]">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-7 h-7 sm:w-8 sm:h-8 text-text"
            >
              {/* Centred on the triangle's centroid — (8+8+19)/3 lands at
                  11.67, so the whole shape shifts a third of a unit right to
                  sit on the box's centre. A bounding-box centre would read as
                  too far left, which is why this had a hand-tuned nudge
                  before; the nudge overshot. */}
              <path d="M8.33 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Bottom control bar — full-width with gradient fade behind for legibility */}
      <div
        className={`absolute left-0 right-0 bottom-0 transition-opacity duration-200 ${
          controlsVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Backdrop gradient — fades the video edge so light pixels don't
         *  swallow the controls. Pointer-events-none so it doesn't catch
         *  clicks meant for the controls. */}
        <div
          className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
          }}
          aria-hidden
        />

        <div className="relative px-3 sm:px-4 pb-2.5 pt-1.5 flex flex-col gap-1.5">
          {/* Scrub bar — sits ABOVE the row of controls so it spans the
           *  full width. Pointer-event based for smooth drag scrubbing.
           *
           *  We wrap the visually-thin bar in a TALLER transparent hit
           *  area (h-4) so clicks always land. The visible bar inside is
           *  only 4-6px tall — without a hit zone, most user clicks miss
           *  it and bubble to the container, which interprets them as
           *  play/pause toggles instead of seek requests. */}
          <div
            onPointerDown={handleScrubStart}
            onPointerMove={handleScrubMove}
            onPointerUp={handleScrubEnd}
            onPointerCancel={handleScrubEnd}
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => setBarHover(true)}
            onMouseLeave={() => setBarHover(false)}
            className="relative h-4 flex items-center cursor-pointer group/bar"
          >
            <div
              ref={scrubRef}
              className={`relative w-full ${
                barHover || scrubbing ? 'h-[6px]' : 'h-[4px]'
              } transition-[height] bg-white/20 rounded-full pointer-events-none`}
              role="slider"
              aria-label="Seek"
              aria-valuemin={0}
              aria-valuemax={duration}
              aria-valuenow={currentTime}
            >
              {/* Buffered overlay — shows how much has loaded ahead */}
              <div
                className="absolute inset-y-0 left-0 bg-white/30 rounded-full"
                style={{ width: `${buffered * 100}%` }}
              />
              {/* Played overlay — uses the site's signature gradient */}
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: `${progressFrac * 100}%`,
                  background: '#FF3B1F',
                }}
              />
              {/* Scrub handle — appears on hover and during scrubbing */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white shadow-md transition-opacity ${
                  scrubbing || barHover ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ left: `${progressFrac * 100}%` }}
                aria-hidden
              />
            </div>
          </div>

          {/* Bottom row: play • time • spacer • mute • fullscreen */}
          <div
            className="flex items-center gap-3 text-white [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.5))]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="flex items-center justify-center w-7 h-7 hover:scale-110 transition-transform"
              aria-label={playing ? 'Pause' : 'Play'}
              title={playing ? 'Pause (Space)' : 'Play (Space)'}
            >
              {playing ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M8.33 5v14l11-7z" />
                </svg>
              )}
            </button>

            <span className="text-[11px] sm:text-[12px] font-mono tabular-nums text-white/90">
              {fmt(currentTime)} <span className="text-white/40">/</span>{' '}
              {fmt(duration)}
            </span>

            <div className="flex-1" />

            <button
              onClick={toggleMute}
              className="flex items-center justify-center w-7 h-7 hover:scale-110 transition-transform"
              aria-label={muted ? 'Unmute' : 'Mute'}
              title={muted ? 'Unmute (M)' : 'Mute (M)'}
            >
              {muted ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                  <path d="M3 9v6h4l5 5V4L7 9z" />
                  <path
                    d="M16 9l5 5m0-5l-5 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                  <path d="M3 9v6h4l5 5V4L7 9zm13.5 0a3 3 0 0 1 0 6M19 6a8 8 0 0 1 0 12" />
                </svg>
              )}
            </button>

            <button
              onClick={toggleFullscreen}
              className="flex items-center justify-center w-7 h-7 hover:scale-110 transition-transform"
              aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              title={fullscreen ? 'Exit fullscreen (F)' : 'Fullscreen (F)'}
            >
              {fullscreen ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M8 3v3a2 2 0 0 1-2 2H3M16 3v3a2 2 0 0 0 2 2h3M8 21v-3a2 2 0 0 0-2-2H3M16 21v-3a2 2 0 0 1 2-2h3" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M3 8V5a2 2 0 0 1 2-2h3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M21 16v3a2 2 0 0 1-2 2h-3" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Format a number of seconds as M:SS. Returns "0:00" for NaN/Infinity
 *  so duration shows something sensible before metadata loads. */
function fmt(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
