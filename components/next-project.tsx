'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { Media } from '@/lib/projects';
import { getMediaPreviewSrc } from '@/lib/media-preview';

type Props = { id: string; title: string; blurb: string; hero: Media };

export function NextProject({ id, title, blurb, hero }: Props) {
  const shell = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLElement>(null);
  const mediaFrame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const track = shell.current;
    const section = panel.current;
    const page = track?.closest<HTMLElement>('.case-study-page');
    const main = page?.querySelector<HTMLElement>('.case-study-layout');
    if (!track || !section || !page || !main) return;

    const desktop = window.matchMedia('(min-width: 1194px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let enabled = false;
    let start = 0;
    let distance = 0;
    let progress = 0;
    let frame = 0;

    const synchronizeVideo = () => {
      const clip = video.current;
      const bounds = mediaFrame.current?.getBoundingClientRect();
      if (!clip || !bounds) return;
      const visible = enabled ? progress > 0 : bounds.bottom > 0 && bounds.top < window.innerHeight;
      if (visible && !document.hidden && !reducedMotion.matches) {
        if (clip.paused) void clip.play().catch(() => undefined);
      } else clip.pause();
    };

    const reset = () => {
      page.classList.remove('is-next-revealing');
      track.classList.remove('is-reveal-enabled');
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
        section.inert = progress < .7;
      }
      synchronizeVideo();
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    const measure = () => {
      reset();
      enabled = desktop.matches && !reducedMotion.matches;
      progress = 0;
      if (enabled) {
        const rem = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
        distance = Math.max(1, main.offsetWidth - 23 * rem);
        track.style.setProperty('--case-next-width', `${distance}px`);
        track.classList.add('is-reveal-enabled');
        start = track.getBoundingClientRect().top + window.scrollY - window.innerHeight;
      }
      update();
    };

    const preload = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setReady(true); preload.disconnect(); }
    }, { rootMargin: '100% 0px' });
    preload.observe(track);
    const resize = new ResizeObserver(measure);
    resize.observe(main);
    const clip = video.current;
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
            <Link href={`/work/${id}`} className="case-study-next-visual" aria-label={`View ${title}`} data-no-route-transition data-next-project-link={id} data-project-title={title}>
              <div ref={mediaFrame} className="case-study-next-frame" data-next-project-frame>
                {hero.type === 'video' ? (
                  <video ref={video} src={ready ? hero.src : undefined} poster={hero.poster ? getMediaPreviewSrc(hero.poster) : undefined} muted loop playsInline preload="auto" />
                ) : hero.type === 'image' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={getMediaPreviewSrc(hero.src)} alt="" loading="lazy" decoding="async" onError={(event) => { if (event.currentTarget.getAttribute('src') !== hero.src) event.currentTarget.src = hero.src; }} />
                ) : null}
              </div>
              <span className="case-study-next-open" aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
