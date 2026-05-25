'use client';

import { useEffect, useRef, useState } from 'react';
import { SITE_TEXT } from '@/lib/site-text';

/**
 * Custom video player used inside case-study sections.
 *
 * Behavior:
 *  - Always STARTS UNMUTED (per spec)
 *  - Does NOT autoplay. Browsers block sound from autoplaying anyway;
 *    requiring the user to press play is both spec-compliant and
 *    avoids surprise audio when scrolling past a section.
 *  - Click anywhere on the video toggles play/pause
 *  - Mute/unmute button in the bottom-right corner of the video
 *  - When paused, a large play button appears centered
 *  - Container locks aspect ratio so the video always fits without
 *    cropping when fit='contain', or fills the container by cropping
 *    when fit='cover' (use when aligning a video with images of a
 *    different aspect in the same row)
 *  - Native controls hidden in favor of our minimal overlay
 *
 * Props:
 *  - src: video URL
 *  - aspect: CSS aspect-ratio string for the CONTAINER (e.g. "16/9", "1/1")
 *  - poster: optional poster image URL
 *  - fit: 'contain' (default, no cropping, may letterbox) or 'cover' (crop to fill)
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false); // Always start unmuted per spec
  const [hovering, setHovering] = useState(false);
  /** Whether the first frame has been decoded and is visible as a
   *  pseudo-thumbnail. Used to hide the loading shimmer once we have
   *  something to show, even before the user presses play. */
  const [thumbnailReady, setThumbnailReady] = useState(false);

  // Keep DOM muted attribute in sync with state
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  /* Auto-thumbnail: nudge the video to decode and display its first frame
   * so it doesn't show as a black box before the user presses play.
   *
   * Mechanism: once metadata is loaded, we set currentTime slightly past 0
   * (0.05s). The browser is then required to decode and present that frame,
   * which becomes the visible "poster" without us needing a separate image.
   *
   * This is necessary because:
   *   1. Most case-study videos don't have an explicit poster image set
   *   2. <video preload="metadata"> only fetches headers, not pixels
   *   3. Without this nudge, the video element renders as a black rectangle
   *      until play() is called
   *
   * Safe across Chrome / Firefox / Safari / iOS Safari (playsInline is set).
   * Skipped when an explicit poster is provided — that takes precedence. */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (poster) {
      // Explicit poster wins — let the browser handle it
      setThumbnailReady(true);
      return;
    }

    const handleLoadedMetadata = () => {
      // Nudge to a fraction of a second to force a frame decode.
      // Using 0.05 (not 0) because some browsers won't render frame 0
      // until seeking actually moves the playhead — exact 0 == no-op.
      try {
        v.currentTime = 0.05;
      } catch {
        // Some browsers throw if the video isn't seekable yet. Safe to skip.
      }
    };

    const handleSeeked = () => {
      // After the seek lands, a frame is now on screen
      setThumbnailReady(true);
    };

    v.addEventListener('loadedmetadata', handleLoadedMetadata);
    v.addEventListener('seeked', handleSeeked);
    return () => {
      v.removeEventListener('loadedmetadata', handleLoadedMetadata);
      v.removeEventListener('seeked', handleSeeked);
    };
  }, [poster, src]);

  // Pause when scrolled out of view (avoids leaving sound playing
  // when the user has moved on to another section).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && !v.paused) {
          v.pause();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(v);
    return () => observer.disconnect();
  }, []);

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
      // If play() rejects (some browsers reject unmuted play attempts when
      // the user hasn't interacted yet), retry muted as a graceful fallback.
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
    e.stopPropagation(); // don't trigger play toggle
    setMuted((m) => !m);
  };

  return (
    <div
      className="relative w-full bg-black rounded-lg overflow-hidden group cursor-pointer select-none"
      style={{ aspectRatio: aspect }}
      onClick={togglePlay}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
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
        className={`absolute inset-0 w-full h-full bg-black ${fit === 'cover' ? 'object-cover' : 'object-contain'}`}
      />

      {/* Loading shimmer — visible until we have something to show.
       *  Hidden once either:
       *   - the first frame has been decoded (auto-thumbnail), OR
       *   - the poster image (if any) is in place */}
      {!thumbnailReady && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-2 text-[12px] font-mono">
          {SITE_TEXT.videoPlayer.loadingLabel}
        </div>
      )}

      {/* Center play button (visible when paused) */}
      {!playing && thumbnailReady && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-bg/80 backdrop-blur-md flex items-center justify-center shadow-[0_8px_24px_-6px_rgba(0,0,0,0.6)]">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-7 h-7 sm:w-8 sm:h-8 text-text translate-x-[2px]"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Bottom-right controls bar */}
      <div
        className={`absolute bottom-3 right-3 flex items-center gap-2 transition-opacity duration-200 ${
          hovering || !playing ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Mute toggle */}
        <button
          onClick={toggleMute}
          className="w-10 h-10 rounded-full bg-bg/80 backdrop-blur-md flex items-center justify-center hover:bg-bg transition-colors text-text"
          aria-label={muted ? 'Unmute' : 'Mute'}
          title={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M3 9v6h4l5 5V4L7 9zm13 .5a4 4 0 0 1 0 5" />
              <path
                d="M19 7l4 10M23 7l-4 10"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M3 9v6h4l5 5V4L7 9zm13 .5a4 4 0 0 1 0 5M18 6a8 8 0 0 1 0 12" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
