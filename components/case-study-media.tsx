'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import type { AspectRatio, Media, Section } from '@/lib/projects';
import { useLightbox } from '@/lib/lightbox-context';
import { getMediaPreviewSrc } from '@/lib/media-preview';
import { EmbedFrame } from './embed-frame';
import { ProjectVideo } from './video-player';

function HeroMotionTile({ media }: { media: Extract<Media, { type: 'video' }> }) {
  const { open: lightboxOpen } = useLightbox();
  const video = useRef<HTMLVideoElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = frame.current;
    const clip = video.current;
    if (!element || !clip) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const synchronize = () => {
      if (visible && !document.hidden && !lightboxOpen && !reduceMotion.matches) {
        clip.muted = true;
        clip.play().catch(() => undefined);
      } else clip.pause();
    };
    const playback = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; synchronize(); }, { threshold: .05 });
    playback.observe(element);
    clip.addEventListener('loadeddata', synchronize);
    document.addEventListener('visibilitychange', synchronize);
    reduceMotion.addEventListener('change', synchronize);
    return () => {
      playback.disconnect(); clip.pause();
      clip.removeEventListener('loadeddata', synchronize);
      document.removeEventListener('visibilitychange', synchronize);
      reduceMotion.removeEventListener('change', synchronize);
    };
  }, [lightboxOpen]);

  return (
    <div ref={frame} className="case-study-media-tile case-study-motion case-study-hero">
      <video ref={video} src={media.src} poster={media.poster} muted loop playsInline preload="auto" style={{ objectFit: 'cover' }} />
    </div>
  );
}

function MotionTile({ media, aspect }: { media: Extract<Media, { type: 'video' }>; aspect?: string }) {
  return (
    <div className="case-study-media-tile case-study-motion" style={{ aspectRatio: aspect ?? media.aspect ?? '16/9' }}>
      <ProjectVideo src={media.src} poster={media.poster} style={{ objectFit: media.fit ?? 'cover' }} />
    </div>
  );
}

export function CaseStudyMedia({ media, aspect, hero = false, imageSet }: { media: Media; aspect?: string; hero?: boolean; imageSet?: Media[] }) {
  const { show } = useLightbox();
  if (media.type === 'video') return hero ? <HeroMotionTile key={media.src} media={media} /> : <MotionTile key={media.src} media={media} aspect={media.aspect ?? aspect} />;
  if (media.type === 'embed') return <div className="case-study-media-tile"><EmbedFrame src={media.src} aspect={media.aspect ?? aspect ?? '16/9'} label={media.label} autoload={media.autoload} /></div>;
  const ratio = media.aspect ?? aspect;
  const images = imageSet ?? [media];
  // The matching JPGs are page previews; the lightbox keeps the original 4K media.
  const preview = getMediaPreviewSrc(media.src);
  return (
    <button type="button" className={`case-study-media-tile case-study-image${hero ? ' case-study-hero' : ''}${ratio ? ' case-study-image-fixed' : ''}`} style={{ aspectRatio: !hero ? ratio : undefined, backgroundColor: media.background }} onClick={() => show(images, Math.max(0, images.indexOf(media)))} aria-label={media.alt ? `View ${media.alt} full screen` : 'View image full screen'}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={preview}
        alt={media.alt ?? ''}
        style={{ objectFit: media.fit ?? 'cover', backgroundColor: media.background }}
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
  const sourceImages = (layout?.type === 'mixed' ? layout.rows.flatMap((row) => row.media) : section.media).filter((media) => media.type === 'image');
  const labeledImages = new Map<Media, Media>();
  const images = sourceImages.map((image, index) => {
    const labeledImage = image.alt !== undefined
      ? image
      : { ...image, alt: `${section.title}, image ${index + 1} of ${sourceImages.length}` };
    labeledImages.set(image, labeledImage);
    return labeledImage;
  });
  // Tiles and the lightbox share the same objects, preserving clicked-image
  // lookup while carrying the section context through next/previous controls.
  const withImageLabel = (media: Media) => labeledImages.get(media) ?? media;
  const row = (media: Media[], cols: number, aspect?: AspectRatio, key = 'row') => (
    <div key={key} className="case-study-media-grid" style={{ '--case-columns': cols, '--case-mobile-columns': Math.min(cols, 2) } as CSSProperties}>
      {media.map((item, index) => <CaseStudyMedia key={`${item.src}-${index}`} media={withImageLabel(item)} aspect={aspect} imageSet={images} />)}
    </div>
  );
  if (layout?.type === 'mixed') return <div className="case-study-media-stack">{layout.rows.map((item, index) => row(item.media, item.cols, item.aspect, String(index)))}</div>;
  if (layout?.type === 'feature-grid') {
    const featured = layout.featuredIndex ?? 1;
    const columns = section.media.length === 2 ? section.media.map((_, index) => index === featured ? '16fr' : '9fr').join(' ') : section.media.map((_, index) => index === featured ? '3.1605fr' : '1fr').join(' ');
    return <div className="case-study-feature-grid" style={{ '--case-feature-columns': columns } as CSSProperties}>{section.media.map((media, index) => <CaseStudyMedia key={`${media.src}-${index}`} media={withImageLabel(media)} aspect={index === featured ? '3/2' : '1/2'} imageSet={images} />)}</div>;
  }
  if (layout?.type === 'carousel') return <div className="case-study-media-carousel" data-lenis-prevent-horizontal>{section.media.map((media, index) => <CaseStudyMedia key={`${media.src}-${index}`} media={withImageLabel(media)} aspect={layout.aspect} imageSet={images} />)}</div>;
  return row(section.media, layout?.type === 'uniform' || layout?.type === 'legacy' ? layout.cols : section.cols ?? 1, layout?.type === 'uniform' ? layout.aspect : undefined);
}
