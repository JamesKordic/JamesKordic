'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import type { Section, Media } from '@/lib/projects';
import { useLightbox } from '@/lib/lightbox-context';

export function CaseSection({ section }: { section: Section }) {
  const { show } = useLightbox();

  // Build list of all media in this section for lightbox navigation
  const allMedia: Media[] = section.media;

  return (
    <section className="py-[18px] pb-9 border-b border-line mb-9 last:border-b-0 last:mb-0">
      {section.eyebrow && (
        <div className="text-[11px] tracking-[0.16em] uppercase text-accent font-bold mb-[10px]">
          {section.eyebrow}
        </div>
      )}
      <h2 className="font-display font-extrabold text-[28px] sm:text-[34px] lg:text-[42px] tracking-[-0.025em] leading-[1.04] mb-[18px]">
        {section.title}
      </h2>
      {section.body && (
        <p className="text-[15.5px] leading-[1.66] text-[#cfcdc7] max-w-[780px] mb-[14px] whitespace-pre-line">
          {section.body}
        </p>
      )}
      {section.media.length > 0 && (
        <div
          className={`mt-6 grid gap-[10px] ${
            section.cols === 1
              ? 'grid-cols-1'
              : section.cols === 2
                ? 'grid-cols-1 sm:grid-cols-2'
                : section.cols === 3
                  ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
                  : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          }`}
        >
          {section.media.map((m, i) => (
            <MediaTile key={i} media={m} index={i} all={allMedia} onLightbox={show} />
          ))}
        </div>
      )}
    </section>
  );
}

function MediaTile({
  media,
  index,
  all,
  onLightbox,
}: {
  media: Media;
  index: number;
  all: Media[];
  onLightbox: (items: Media[], i: number) => void;
}) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (media.type === 'video') {
    return (
      <div
        className={`cs-tile relative rounded-lg overflow-hidden bg-panel-2 cursor-pointer hover:-translate-y-0.5 transition-transform aspect-video ${
          playing ? 'playing-inline' : ''
        }`}
        onClick={() => {
          const v = videoRef.current;
          if (!v) return;
          if (v.paused) {
            v.play();
            setPlaying(true);
          } else {
            v.pause();
            setPlaying(false);
          }
        }}
      >
        <video
          ref={videoRef}
          src={media.src}
          preload="metadata"
          playsInline
          loop
          muted
          onEnded={() => setPlaying(false)}
          className="w-full h-full object-cover bg-black"
        />
        <div className="play-overlay" />
      </div>
    );
  }

  return (
    <div
      className="cs-tile is-image relative rounded-lg overflow-hidden bg-panel-2 cursor-zoom-in hover:-translate-y-0.5 transition-transform"
      onClick={() => onLightbox(all, index)}
    >
      <Image
        src={media.src}
        alt=""
        width={1600}
        height={1000}
        sizes="(max-width:600px) 100vw, (max-width:1200px) 50vw, 33vw"
        className="w-full h-auto object-cover"
        unoptimized
      />
    </div>
  );
}
