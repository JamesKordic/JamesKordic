'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import type { Section, Media } from '@/lib/projects';
import { useLightbox } from '@/lib/lightbox-context';

export function CaseSection({
  section,
  index,
  total,
}: {
  section: Section;
  index: number;
  total: number;
}) {
  const { show } = useLightbox();
  const allMedia: Media[] = section.media;
  const sectionNumber = String(index + 1).padStart(2, '0');

  return (
    <section className="py-10 lg:py-16 border-b border-ink/15 last:border-b-0">
      {/* Section header — editorial layout */}
      <div className="grid lg:grid-cols-12 gap-4 lg:gap-10 mb-10">
        <div className="lg:col-span-3">
          <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted">
            <span className="text-coral">●</span> Section {sectionNumber} / {String(total).padStart(2, '0')}
          </div>
          {section.eyebrow && (
            <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted mt-3">
              {section.eyebrow}
            </div>
          )}
        </div>
        <div className="lg:col-span-9">
          <h2 className="font-display font-light text-[36px] sm:text-[48px] lg:text-[64px] tracking-[-0.025em] leading-[0.96] mb-4">
            {section.title}
          </h2>
          {section.body && (
            <p className="text-[15px] lg:text-[16px] leading-[1.62] text-ink-3 max-w-[780px] whitespace-pre-line">
              {section.body}
            </p>
          )}
        </div>
      </div>

      {/* Media grid */}
      {section.media.length > 0 && (
        <div
          className={`grid gap-2 lg:gap-3 ${
            section.cols === 1
              ? 'grid-cols-1'
              : section.cols === 2
                ? 'grid-cols-1 sm:grid-cols-2'
                : section.cols === 3
                  ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
                  : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
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
        className={`cs-tile relative overflow-hidden bg-ink cursor-pointer hover:scale-[1.01] transition-transform aspect-video ${
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
          className="w-full h-full object-cover"
        />
        <div className="play-overlay" />
      </div>
    );
  }

  return (
    <div
      className="cs-tile is-image relative overflow-hidden bg-paper-3 cursor-zoom-in hover:scale-[1.01] transition-transform group"
      onClick={() => onLightbox(all, index)}
    >
      <Image
        src={media.src}
        alt=""
        width={1600}
        height={1000}
        sizes="(max-width:600px) 50vw, (max-width:1200px) 33vw, 25vw"
        className="w-full h-auto object-cover"
        unoptimized
      />
    </div>
  );
}
