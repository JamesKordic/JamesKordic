'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { AspectRatio, Media, Section } from '@/lib/projects';
import { useLightbox } from '@/lib/lightbox-context';
import { getMediaPreviewSrc } from '@/lib/media-preview';
import { EmbedFrame } from './embed-frame';

function MotionTile({ media, hero, aspect }: { media: Extract<Media, { type: 'video' }>; hero: boolean; aspect?: string }) {
  const { open: lightboxOpen } = useLightbox();
  const video = useRef<HTMLVideoElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const manualPlayback = useRef<'play' | 'pause' | null>(null);
  const [ready, setReady] = useState(hero);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const element = frame.current;
    const clip = video.current;
    if (!element || !clip) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const synchronize = () => {
      const mayPlay = manualPlayback.current === 'play' || !reduceMotion.matches;
      if (visible && !document.hidden && !lightboxOpen && mayPlay && manualPlayback.current !== 'pause') {
        clip.muted = true;
        clip.play().catch(() => undefined);
      } else clip.pause();
    };
    const preload = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setReady(true); preload.disconnect(); } }, { rootMargin: '400px' });
    const playback = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; synchronize(); }, { threshold: .05 });
    preload.observe(element);
    playback.observe(element);
    clip.addEventListener('loadeddata', synchronize);
    document.addEventListener('visibilitychange', synchronize);
    reduceMotion.addEventListener('change', synchronize);
    return () => {
      preload.disconnect(); playback.disconnect(); clip.pause();
      clip.removeEventListener('loadeddata', synchronize);
      document.removeEventListener('visibilitychange', synchronize);
      reduceMotion.removeEventListener('change', synchronize);
    };
  }, [lightboxOpen]);

  const toggle = () => {
    const clip = video.current;
    if (!clip) return;
    if (clip.paused) { manualPlayback.current = 'play'; setReady(true); clip.play().catch(() => undefined); }
    else { manualPlayback.current = 'pause'; clip.pause(); }
  };

  return (
    <div ref={frame} className={`case-study-media-tile case-study-motion${hero ? ' case-study-hero' : ''}`} style={!hero ? { aspectRatio: aspect ?? media.aspect ?? '16/9' } : undefined}>
      <video ref={video} src={ready ? media.src : undefined} poster={media.poster} muted loop playsInline preload={hero || !media.poster ? 'auto' : 'metadata'} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} style={{ objectFit: hero ? 'cover' : media.fit ?? 'cover' }} />
      <button className="case-study-video-toggle" type="button" onClick={toggle} aria-label={playing ? 'Pause video' : 'Play video'}>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.25" opacity=".25" />{playing ? <path d="M9.5 8v8M14.5 8v8" stroke="currentColor" strokeWidth="1.5" /> : <path d="m10 8 6 4-6 4V8Z" fill="currentColor" />}</svg>
      </button>
    </div>
  );
}

export function CaseStudyMedia({ media, aspect, hero = false, imageSet }: { media: Media; aspect?: string; hero?: boolean; imageSet?: Media[] }) {
  const { show } = useLightbox();
  if (media.type === 'video') return <MotionTile key={media.src} media={media} hero={hero} aspect={media.aspect ?? aspect} />;
  if (media.type === 'embed') return <div className="case-study-media-tile"><EmbedFrame src={media.src} aspect={media.aspect ?? aspect ?? '16/9'} label={media.label} autoload={media.autoload} /></div>;
  const ratio = media.aspect ?? aspect;
  const images = imageSet ?? [media];
  // The matching JPGs are page previews; the lightbox keeps the original 4K media.
  const preview = getMediaPreviewSrc(media.src);
  return (
    <button type="button" className={`case-study-media-tile case-study-image${hero ? ' case-study-hero' : ''}${ratio ? ' case-study-image-fixed' : ''}`} style={!hero && ratio ? { aspectRatio: ratio } : undefined} onClick={() => show(images, Math.max(0, images.indexOf(media)))} aria-label={media.alt ? `View ${media.alt} full screen` : 'View image full screen'}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={preview}
        alt={media.alt ?? ''}
        loading={hero ? 'eager' : 'lazy'}
        fetchPriority={hero ? 'high' : undefined}
        decoding="async"
        onError={(event) => {
          const image = event.currentTarget;
          if (image.getAttribute('src') !== media.src) image.src = media.src;
        }}
      />
    </button>
  );
}

export function CaseStudyGallery({ section }: { section: Section }) {
  const layout = section.layout;
  const images = (layout?.type === 'mixed' ? layout.rows.flatMap((row) => row.media) : section.media).filter((media) => media.type === 'image');
  const row = (media: Media[], cols: number, aspect?: AspectRatio, key = 'row') => (
    <div key={key} className="case-study-media-grid" style={{ '--case-columns': cols, '--case-mobile-columns': Math.min(cols, 2) } as CSSProperties}>
      {media.map((item, index) => <CaseStudyMedia key={`${item.src}-${index}`} media={item} aspect={aspect} imageSet={images} />)}
    </div>
  );
  if (layout?.type === 'mixed') return <div className="case-study-media-stack">{layout.rows.map((item, index) => row(item.media, item.cols, item.aspect, String(index)))}</div>;
  if (layout?.type === 'feature-grid') {
    const featured = layout.featuredIndex ?? 1;
    const columns = section.media.length === 2 ? section.media.map((_, index) => index === featured ? '16fr' : '9fr').join(' ') : section.media.map((_, index) => index === featured ? '3.1605fr' : '1fr').join(' ');
    return <div className="case-study-feature-grid" style={{ '--case-feature-columns': columns } as CSSProperties}>{section.media.map((media, index) => <CaseStudyMedia key={`${media.src}-${index}`} media={media} aspect={index === featured ? '3/2' : '1/2'} imageSet={images} />)}</div>;
  }
  if (layout?.type === 'carousel') return <div className="case-study-media-carousel">{section.media.map((media, index) => <CaseStudyMedia key={`${media.src}-${index}`} media={media} aspect={layout.aspect} imageSet={images} />)}</div>;
  return row(section.media, layout?.type === 'uniform' || layout?.type === 'legacy' ? layout.cols : section.cols ?? 1, layout?.type === 'uniform' ? layout.aspect : undefined);
}
