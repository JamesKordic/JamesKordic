'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { Media } from '@/lib/projects';
import { getMediaPreviewSrc } from '@/lib/media-preview';
import { useLightbox } from '@/lib/lightbox-context';

type Props = { id: string; title: string; blurb: string; hero: Media };

export function NextProject({ id, title, blurb, hero }: Props) {
  const shell = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLElement>(null);
  const mediaFrame = useRef<HTMLDivElement>(null);
  const [readySrc, setReadySrc] = useState<string | null>(null);
  const { open: lightboxOpen } = useLightbox();
  const lightboxState = useRef(lightboxOpen);
  const playback = useRef<(() => void) | null>(null);

  useEffect(() => {
    lightboxState.current = lightboxOpen;
    playback.current?.();
  }, [lightboxOpen]);

  useEffect(() => {
    const track = shell.current;
    const section = panel.current;
    const page = track?.closest<HTMLElement>('.case-study-page');
    const main = page?.querySelector<HTMLElement>('.case-study-layout');
    if (!track || !section || !page || !main) return;

    // The fixed reveal needs room for its heading, preview and contact link.
    // Short windows use the normal flowing panel so every control stays reachable.
    const desktop = window.matchMedia('(min-width: 1194px) and (min-height: 640px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let enabled = false;
    let start = 0;
    let distance = 0;
    let progress = 0;
    let frame = 0;

    const synchronizeVideo = () => {
      const clip = mediaFrame.current?.querySelector('video');
      const bounds = mediaFrame.current?.getBoundingClientRect();
      if (!clip || !bounds || !clip.getAttribute('src')) return;
      const visible = enabled ? progress > 0 : bounds.bottom > 0 && bounds.top < window.innerHeight;
      if (visible && !document.hidden && !reducedMotion.matches && !lightboxState.current) {
        clip.muted = true;
        if (clip.paused) void clip.play().catch(() => undefined);
      } else clip.pause();
    };
    playback.current = synchronizeVideo;

    const reset = () => {
      page.classList.remove('is-next-revealing');
      track.classList.remove('is-reveal-enabled');
      main.inert = false;
      section.inert = false;
      for (const name of ['--case-reveal-x', '--case-reveal-y', '--case-reveal-opacity']) main.style.removeProperty(name);
      for (const name of ['--case-next-width', '--case-next-clip', '--case-next-scale', '--case-next-copy-opacity', '--case-next-contact-x']) track.style.removeProperty(name);
    };

    const update = () => {
      frame = 0;
      if (enabled) {
        const travel = Math.min(distance, Math.max(0, window.scrollY - start));
        progress = distance ? travel / distance : 0;
        page.classList.toggle('is-next-revealing', progress > 0);
        main.style.setProperty('--case-reveal-x', `${-travel}px`);
        main.style.setProperty('--case-reveal-y', `${travel}px`);
        main.style.setProperty('--case-reveal-opacity', String(1 - .8 * progress));
        track.style.setProperty('--case-next-clip', `${89 * (1 - progress)}%`);
        track.style.setProperty('--case-next-scale', String(.5 + .5 * progress));
        track.style.setProperty('--case-next-contact-x', `${distance - travel}px`);
        track.style.setProperty('--case-next-copy-opacity', String(Math.min(1, Math.max(0, (progress - .7) / .3))));
        const nextInteractive = progress >= .7;
        const handOffFocus = nextInteractive && !main.inert && main.contains(document.activeElement);
        section.inert = !nextInteractive;
        // Once the incoming project is usable, skip the outgoing links that
        // have slid offscreen. Scrolling back restores their normal tab order.
        main.inert = nextInteractive;
        if (handOffFocus) section.querySelector<HTMLAnchorElement>('.case-study-next-title')?.focus({ preventScroll: true });
      }
      synchronizeVideo();
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    const measure = () => {
      const wasRevealing = enabled && progress > 0;
      const previousProgress = progress;
      enabled = desktop.matches && !reducedMotion.matches;
      if (enabled) {
        // Keep the spacer in flow while measuring, otherwise the temporarily
        // shorter document can clamp the browser's scroll position.
        const rem = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
        distance = Math.max(1, main.offsetWidth - 23 * rem);
        track.style.setProperty('--case-next-width', `${distance}px`);
        track.classList.add('is-reveal-enabled');
        start = track.getBoundingClientRect().top + window.scrollY - window.innerHeight;
        if (wasRevealing) {
          window.scrollTo({ top: start + previousProgress * distance, behavior: 'instant' });
        }
      } else {
        reset();
        progress = 0;
      }
      update();
    };

    const preload = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setReadySrc(hero.src); preload.disconnect(); }
    }, { rootMargin: '100% 0px' });
    preload.observe(track);
    const resize = new ResizeObserver(measure);
    resize.observe(main);
    const clip = mediaFrame.current?.querySelector('video');
    clip?.addEventListener('loadeddata', synchronizeVideo);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    desktop.addEventListener('change', measure);
    reducedMotion.addEventListener('change', measure);
    document.addEventListener('visibilitychange', synchronizeVideo);
    measure();

    return () => {
      window.cancelAnimationFrame(frame);
      preload.disconnect();
      resize.disconnect();
      clip?.pause();
      clip?.removeEventListener('loadeddata', synchronizeVideo);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      desktop.removeEventListener('change', measure);
      reducedMotion.removeEventListener('change', measure);
      document.removeEventListener('visibilitychange', synchronizeVideo);
      if (playback.current === synchronizeVideo) playback.current = null;
      reset();
    };
  }, [id, hero.src]);

  return (
    <div ref={shell} className="case-study-next-shell">
      <section ref={panel} className="case-study-next-up" aria-label="Next project" data-next-project-panel>
        <div className="case-study-next-heading">
          <p className="case-study-overline">Next up</p>
          <Link href={`/work/${id}`} className="case-study-next-title" data-no-route-transition data-next-project-link={id} data-project-title={title}><span>{title}</span><span>{blurb}</span></Link>
        </div>
        <div className="case-study-next-bottom">
          <div className="case-study-next-contact">
            <p>Want to discuss a project?<span>I’d love to hear what you have in mind and how I can help.</span></p>
            <div className="case-study-next-links"><Link href="/contact">Get in touch ↗</Link></div>
          </div>
          <div className="case-study-next-media-column">
            <div className={`case-study-next-visual${hero.type === 'video' ? ' case-study-next-visual--video' : ''}`} style={{ backgroundColor: hero.type === 'image' ? hero.background : undefined }}>
              <div ref={mediaFrame} className="case-study-next-frame" data-next-project-frame>
                {hero.type !== 'embed' && (
                  <Link href={`/work/${id}`} className="case-study-next-media-link" aria-label={`View ${title}`} data-no-route-transition data-next-project-link={id} data-project-title={title}>
                    {hero.type === 'video' ? (
                      <video src={readySrc === hero.src ? hero.src : undefined} poster={hero.poster ? getMediaPreviewSrc(hero.poster) : undefined} muted loop playsInline preload="auto" aria-hidden="true" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={getMediaPreviewSrc(hero.src)} alt="" style={{ objectFit: hero.fit ?? 'cover', backgroundColor: hero.background ?? (hero.fit === 'contain' ? 'var(--color-panel)' : undefined) }} loading="lazy" decoding="async" onError={(event) => { if (event.currentTarget.getAttribute('src') !== hero.src) event.currentTarget.src = hero.src; }} />
                    )}
                  </Link>
                )}
              </div>
              <Link href={`/work/${id}`} className="case-study-next-open" aria-label={`Open ${title} project`} data-no-route-transition data-next-project-link={id} data-project-title={title}><span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
