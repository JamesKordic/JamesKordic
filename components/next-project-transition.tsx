'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import '@/app/case-study.css';

type Rect = { left: number; top: number; width: number; height: number; borderRadius: string };
type ProjectTransition = {
  from: string | null;
  to: string;
  mode: 'home' | 'next';
  dialog: HTMLDialogElement;
  visual: HTMLElement;
  media: HTMLImageElement | HTMLVideoElement;
  sourcePlaying: boolean;
  header: HTMLElement | null;
  animations: Animation[];
  cleanups: Set<() => void>;
  landing: boolean;
  navigate: () => void;
  dispose: () => void;
};

const EXPANSION_EASE = 'cubic-bezier(.65,0,.35,1)';
const pathKey = (path: string | null) => path?.replace(/\/+$/, '') || '/';
const mediaSource = (media: HTMLImageElement | HTMLVideoElement) => new URL(media.currentSrc || media.src, window.location.href).href;

/** Measure the real case layout without guessing its responsive hero geometry. */
function measureCaseHero(): Rect | null {
  const page = document.createElement('div');
  page.className = 'case-study-page';
  page.inert = true;
  page.setAttribute('aria-hidden', 'true');
  Object.assign(page.style, { position: 'fixed', inset: '0', visibility: 'hidden', pointerEvents: 'none' });
  const main = document.createElement('main');
  main.className = 'case-study-layout';
  const sidebar = document.createElement('aside');
  sidebar.className = 'case-study-sidebar';
  const content = document.createElement('div');
  content.className = 'case-study-content';
  const hero = document.createElement('div');
  hero.className = 'case-study-media-tile case-study-hero';
  content.append(hero);
  main.append(sidebar, content);
  page.append(main);
  document.body.append(page);
  try {
    const { left, top, width, height } = hero.getBoundingClientRect();
    return width && height ? { left, top, width, height, borderRadius: getComputedStyle(hero).borderRadius } : null;
  } finally { page.remove(); }
}

function visibleMedia(frame: HTMLElement, home: boolean): HTMLImageElement | HTMLVideoElement | null {
  const video = Array.from(frame.querySelectorAll('video')).find((clip) => (
    !clip.error && (!home || clip.readyState >= 2) && Number(getComputedStyle(clip).opacity) > 0
  ));
  return video ?? frame.querySelector('img');
}

function place(visual: HTMLElement, rect: Rect) {
  Object.assign(visual.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`, borderRadius: rect.borderRadius });
}

function cloneHeader(header: HTMLElement | null): HTMLElement | null {
  if (!header) return null;
  const clone = header.cloneNode(true) as HTMLElement;
  clone.inert = true;
  clone.setAttribute('aria-hidden', 'true');
  clone.removeAttribute('id');
  clone.querySelectorAll('[id]').forEach((element) => element.removeAttribute('id'));
  clone.style.pointerEvents = 'none';
  return clone;
}

function delay(transition: ProjectTransition, milliseconds: number) {
  return new Promise<void>((resolve) => {
    const done = () => { window.clearTimeout(timer); transition.cleanups.delete(done); resolve(); };
    const timer = window.setTimeout(done, milliseconds);
    transition.cleanups.add(done);
  });
}

/** Seek before playback, then wait until the browser has painted that video. */
function prepareVideoFrame(video: HTMLVideoElement, time: number, playing: boolean, transition: ProjectTransition) {
  return new Promise<boolean>((resolve) => {
    let complete = false;
    let prepared = false;
    let presenting = false;
    let videoFrame = 0;
    let paintFrame = 0;
    const finish = (ready: boolean) => {
      if (complete) return;
      complete = true;
      window.clearTimeout(timer);
      if (videoFrame) video.cancelVideoFrameCallback(videoFrame);
      window.cancelAnimationFrame(paintFrame);
      video.removeEventListener('loadedmetadata', prepare);
      video.removeEventListener('loadeddata', present);
      video.removeEventListener('seeked', present);
      video.removeEventListener('error', failed);
      transition.cleanups.delete(cancel);
      resolve(ready);
    };
    const cancel = () => finish(false);
    const failed = () => finish(false);
    const afterPaint = () => {
      if (complete) return;
      paintFrame = window.requestAnimationFrame(() => {
        paintFrame = window.requestAnimationFrame(() => finish(true));
      });
    };
    const present = () => {
      if (complete || presenting || !prepared || video.seeking || video.readyState < 2) return;
      presenting = true;
      if (playing) {
        if (typeof video.requestVideoFrameCallback === 'function') {
          videoFrame = video.requestVideoFrameCallback(() => finish(true));
        }
        void video.play().then(() => { if (!videoFrame) afterPaint(); }, afterPaint);
      } else {
        video.pause();
        afterPaint();
      }
    };
    const prepare = () => {
      if (complete || prepared || video.readyState < 1) return;
      prepared = true;
      video.muted = true;
      video.pause();
      try {
        if (Number.isFinite(time) && Math.abs(video.currentTime - time) > .001) video.currentTime = time;
      } catch { /* A decoded frame is still usable when seeking is unavailable. */ }
      present();
    };
    const timer = window.setTimeout(() => finish(prepared && video.readyState >= 2 && !video.seeking), 2000);
    transition.cleanups.add(cancel);
    video.addEventListener('loadedmetadata', prepare);
    video.addEventListener('loadeddata', present);
    video.addEventListener('seeked', present);
    video.addEventListener('error', failed);
    prepare();
  });
}

/** Keep the selected live preview above both routes until the hero is ready. */
export function NextProjectTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const currentPath = useRef(pathname);
  const active = useRef<ProjectTransition | null>(null);

  useLayoutEffect(() => {
    currentPath.current = pathname;
    const transition = active.current;
    if (!transition || pathKey(transition.from) === pathKey(pathname)) return;
    if (pathKey(pathname) !== transition.to) { transition.dispose(); return; }
    if (transition.landing) return;
    transition.landing = true;

    const land = async () => {
      transition.animations.forEach((animation) => animation.cancel());
      transition.animations.length = 0;
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      const main = document.querySelector<HTMLElement>('.case-study-layout');
      const hero = main?.querySelector<HTMLElement>('.case-study-hero');
      if (!main || !hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { transition.dispose(); return; }

      const rect = hero.getBoundingClientRect();
      const borderRadius = getComputedStyle(hero).borderRadius;
      place(transition.visual, { left: rect.left, top: rect.top, width: rect.width, height: rect.height, borderRadius });
      transition.visual.style.transform = 'none';
      transition.visual.style.clipPath = `inset(0% round ${transition.mode === 'home' ? borderRadius : '.25rem'})`;
      if (transition.mode === 'home') {
        const header = cloneHeader(main.closest('.case-study-page')?.querySelector<HTMLElement>('.jk-header') ?? null);
        if (header) {
          if (transition.header) transition.header.replaceWith(header);
          else transition.dialog.append(header);
          transition.header = header;
        }
      }
      const reveals: Animation[] = [];
      const reveal = (selector: string, wait = 0) => main.querySelectorAll<HTMLElement>(selector).forEach((element) => {
        const animation = element.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 667, delay: wait, easing: 'linear', fill: 'backwards' });
        reveals.push(animation);
        transition.animations.push(animation);
      });
      if (transition.mode === 'home') {
        // Animate sibling pieces independently so nested opacities don't multiply.
        reveal('.case-study-sidebar > .case-study-sidebar-title > h1, .case-study-sidebar > .case-study-sidebar-title > p, .case-study-content > :not(.case-study-hero):not(.case-study-mobile-title), .case-study-mobile-title > h1, .case-study-mobile-title > p');
        reveal('.case-study-sidebar > .case-study-sidebar-title > .case-study-tags, .case-study-mobile-title > .case-study-tags', 33);
        reveal('.case-study-sidebar > .case-study-anchor-nav', 66);
      } else {
        reveal('.case-study-sidebar, .case-study-content > :not(.case-study-hero)');
        main.querySelectorAll<HTMLElement>('.case-study-tags, .case-study-anchor-nav').forEach((element, index) => {
          const animation = element.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 667, delay: (index + 1) * 33, easing: 'linear', fill: 'backwards' });
          reveals.push(animation);
          transition.animations.push(animation);
        });
      }

      const destination = hero.querySelector('img, video');
      const ready = new Promise<void>((resolve) => {
        let timer = 0;
        let complete = false;
        const done = () => {
          if (complete) return;
          complete = true;
          window.clearTimeout(timer);
          destination?.removeEventListener('loadeddata', synchronize);
          destination?.removeEventListener('seeked', done);
          destination?.removeEventListener('error', done);
          transition.cleanups.delete(done);
          resolve();
        };
        const synchronize = () => {
          if (active.current !== transition) { done(); return; }
          if (destination instanceof HTMLVideoElement && transition.media instanceof HTMLVideoElement && mediaSource(destination) === mediaSource(transition.media)) {
            try {
              const time = transition.media.currentTime;
              if (transition.sourcePlaying) void destination.play().catch(() => undefined);
              else destination.pause();
              if (Number.isFinite(time) && Math.abs(destination.currentTime - time) > .1) {
                destination.addEventListener('seeked', done, { once: true });
                destination.currentTime = time;
                return;
              }
            } catch { /* An unseekable video can still reveal its poster. */ }
          }
          done();
        };
        transition.cleanups.add(done);
        timer = window.setTimeout(done, 1000);
        destination?.addEventListener('error', done, { once: true });
        if (destination instanceof HTMLImageElement) void destination.decode().then(done, done);
        else if (destination instanceof HTMLVideoElement && destination.readyState < 2) destination.addEventListener('loadeddata', synchronize, { once: true });
        else synchronize();
      });
      await Promise.all([ready, transition.mode === 'home' ? delay(transition, window.innerWidth >= 1194 ? 800 : 733) : Promise.resolve()]);
      if (active.current !== transition) return;
      if (destination instanceof HTMLVideoElement && transition.media instanceof HTMLVideoElement && mediaSource(destination) === mediaSource(transition.media)) {
        // Two independently decoded clips must not crossfade over one another.
        // Hold the last transition frame until the hero has presented it.
        transition.media.pause();
        const presented = await prepareVideoFrame(destination, transition.media.currentTime, transition.sourcePlaying, transition);
        if (active.current !== transition) return;
        if (presented) transition.visual.style.visibility = 'hidden';
      }
      const fade = transition.dialog.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 167, easing: 'linear', fill: 'forwards' });
      transition.animations.push(fade);
      await fade.finished.catch(() => undefined);
      if (active.current !== transition) return;
      // A successful landing can release its overlay before the copy finishes.
      // Interrupted transitions still cancel these through the shared cleanup.
      transition.animations = transition.animations.filter((animation) => !reveals.includes(animation));
      reveals.forEach((animation) => { void animation.finished.then(() => animation.cancel(), () => undefined); });
      transition.dispose();
      const heading = Array.from(main.querySelectorAll<HTMLElement>('h1')).find((element) => element.getClientRects().length);
      if (heading) {
        const previous = heading.getAttribute('tabindex');
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
        heading.addEventListener('blur', () => { if (previous === null) heading.removeAttribute('tabindex'); else heading.setAttribute('tabindex', previous); }, { once: true });
      }
    };
    void land().catch(transition.dispose);
  }, [pathname]);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[data-next-project-link], a[data-home-project-link]') : null;
      if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target.toLowerCase() !== '_self')) return;
      const href = new URL(anchor.href, window.location.href);
      if (href.origin !== window.location.origin || pathKey(href.pathname) === pathKey(window.location.pathname) || href.hash) return;
      if (active.current) { event.preventDefault(); return; }
      if (reducedMotion.matches || typeof HTMLDialogElement === 'undefined') return;

      const home = anchor.hasAttribute('data-home-project-link');
      const homePage = home ? anchor.closest<HTMLElement>('.portfolio-home') : null;
      const panel = home ? null : anchor.closest<HTMLElement>('[data-next-project-panel]');
      const card = homePage && Array.from(homePage.querySelectorAll<HTMLElement>('.work-project[data-project-id]')).find((element) => element.dataset.projectId === anchor.dataset.homeProjectLink);
      const frame = home ? card?.querySelector<HTMLElement>('.project-visual') : panel?.querySelector<HTMLElement>('[data-next-project-frame]');
      if (!frame || typeof frame.animate !== 'function') return;
      const source = visibleMedia(frame, home);
      if (!source) return;
      // The probe is removed before querying or fading either real page.
      const measured = home ? measureCaseHero() : null;
      const main = home ? homePage?.querySelector<HTMLElement>('main') : document.querySelector<HTMLElement>('.case-study-layout');
      const hero = !home ? main?.querySelector<HTMLElement>('.case-study-hero') : null;
      if (!main || (home ? !measured : !panel || !hero)) return;
      const start = frame.getBoundingClientRect();
      if (!start.width || !start.height) return;
      const mainRect = main.getBoundingClientRect();
      const heroRect = hero?.getBoundingClientRect();
      const target: Rect = measured ?? { left: heroRect!.left - mainRect.left, top: heroRect!.top - mainRect.top, width: heroRect!.width, height: heroRect!.height, borderRadius: getComputedStyle(hero!).borderRadius };
      const targetClip = `inset(0% round ${home ? target.borderRadius : '.25rem'})`;
      const outgoing = [main, home ? homePage?.querySelector<HTMLElement>('.jk-footer') : panel].filter((element): element is HTMLElement => Boolean(element));
      const dialog = document.createElement('dialog');
      dialog.className = 'next-project-transition';
      dialog.setAttribute('aria-label', `Opening ${anchor.getAttribute('data-project-title') || 'project'}`);
      const visual = document.createElement('div');
      visual.className = 'next-project-transition-visual';
      place(visual, { left: start.left, top: start.top, width: start.width, height: start.height, borderRadius: getComputedStyle(frame).borderRadius });
      const sourceClip = getComputedStyle(frame).clipPath;
      visual.style.clipPath = sourceClip;
      const media = source.cloneNode(true) as HTMLImageElement | HTMLVideoElement;
      media.removeAttribute('id');
      media.removeAttribute('loading');
      media.removeAttribute('autoplay');
      media.removeAttribute('controls');
      media.setAttribute('aria-hidden', 'true');
      const sourcePlaying = source instanceof HTMLVideoElement && !source.paused && !source.ended;
      let snapshot: HTMLCanvasElement | null = null;
      if (media instanceof HTMLVideoElement && source instanceof HTMLVideoElement) {
        media.muted = true;
        media.loop = true;
        media.playsInline = true;
        media.preload = 'auto';
        media.poster = source.poster || frame.querySelector('img')?.src || '';
        try {
          const canvas = document.createElement('canvas');
          canvas.width = source.videoWidth;
          canvas.height = source.videoHeight;
          const context = canvas.getContext('2d');
          if (context && canvas.width && canvas.height) {
            context.drawImage(source, 0, 0);
            canvas.setAttribute('aria-hidden', 'true');
            Object.assign(canvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', objectFit: 'cover' });
            snapshot = canvas;
          }
        } catch { /* Unavailable frames retain the ordinary poster. */ }
      }
      visual.append(media);
      if (snapshot) visual.append(snapshot);
      dialog.append(visual);
      // Top-layer media must not cover the fixed header on narrow layouts.
      const header = home ? cloneHeader(homePage?.querySelector<HTMLElement>('.jk-header') ?? null) : null;
      if (header) dialog.append(header);
      document.body.append(dialog);
      document.documentElement.classList.add('has-project-transition');
      try { dialog.showModal(); }
      catch { dialog.remove(); document.documentElement.classList.remove('has-project-transition'); return; }

      event.preventDefault();
      if (source instanceof HTMLVideoElement && !source.muted) source.pause();
      const originalVisibility = frame.style.visibility;
      const originalOverflow = document.body.style.overflow;
      frame.style.visibility = 'hidden';
      // Keep sticky homepage text anchored to the viewport during the fade.
      // overflow:hidden on body creates a new scroll ancestor when Lenis stops.
      document.body.style.overflow = 'clip';
      let navigated = false;
      let timeout = 0;
      const transition: ProjectTransition = {
        from: currentPath.current, to: pathKey(href.pathname), mode: home ? 'home' : 'next', dialog, visual, media, sourcePlaying, header,
        animations: [], cleanups: new Set(), landing: false,
        navigate: () => {
          if (navigated || active.current !== transition) return;
          navigated = true;
          transition.animations.forEach((animation) => animation.cancel());
          transition.animations.length = 0;
          place(visual, target);
          visual.style.transform = 'none';
          visual.style.clipPath = targetClip;
          for (const element of outgoing) transition.animations.push(element.animate([{ opacity: 0 }, { opacity: 0 }], { duration: 1, fill: 'forwards' }));
          try { router.push(`${href.pathname}${href.search}`); }
          catch { transition.dispose(); window.location.assign(href.href); }
        },
        dispose: () => {
          if (active.current !== transition) return;
          active.current = null;
          window.clearTimeout(timeout);
          transition.cleanups.forEach((cleanup) => cleanup());
          transition.cleanups.clear();
          transition.animations.forEach((animation) => animation.cancel());
          frame.style.visibility = originalVisibility;
          document.body.style.overflow = originalOverflow;
          if (media instanceof HTMLVideoElement) { media.pause(); media.removeAttribute('src'); media.querySelectorAll('source').forEach((element) => element.remove()); media.load(); }
          if (dialog.open) dialog.close();
          dialog.remove();
          document.documentElement.classList.remove('has-project-transition');
        },
      };
      active.current = transition;
      timeout = window.setTimeout(() => { if (active.current !== transition) return; transition.navigate(); transition.dispose(); }, 8000);
      const cancel = (cancelEvent: Event) => { cancelEvent.preventDefault(); transition.navigate(); };
      dialog.addEventListener('cancel', cancel);
      transition.cleanups.add(() => dialog.removeEventListener('cancel', cancel));
      if (media instanceof HTMLVideoElement && source instanceof HTMLVideoElement) {
        void prepareVideoFrame(media, source.currentTime, sourcePlaying, transition).then((presented) => {
          if (active.current !== transition || !presented) return;
          snapshot?.remove();
        });
      }
      try { router.prefetch(href.pathname); } catch { /* Navigation still works without prefetch. */ }

      const animate = async (frames: Keyframe[], options: KeyframeAnimationOptions) => {
        if (active.current !== transition) return;
        const animation = visual.animate(frames, { ...options, fill: 'forwards' });
        transition.animations.push(animation);
        await animation.finished;
      };
      const run = async () => {
        if (!home && window.innerWidth >= 1194) {
          await animate([{ transform: 'scale(1)' }, { transform: 'scale(.95)' }], { duration: 167, easing: 'cubic-bezier(.33,0,0,1)' });
          await animate([{ transform: 'scale(.95)' }, { transform: 'scale(1)' }], { duration: 833, easing: EXPANSION_EASE });
        }
        if (active.current !== transition || navigated) return;
        for (const element of outgoing) transition.animations.push(element.animate([{ opacity: getComputedStyle(element).opacity }, { opacity: 0 }], { duration: 250, easing: 'linear', fill: 'forwards' }));
        await animate([
          { left: `${start.left}px`, top: `${start.top}px`, width: `${start.width}px`, height: `${start.height}px`, clipPath: sourceClip },
          { left: `${target.left}px`, top: `${target.top}px`, width: `${target.width}px`, height: `${target.height}px`, borderRadius: target.borderRadius, clipPath: targetClip },
        ], { duration: 1000, easing: EXPANSION_EASE });
        transition.navigate();
      };
      void run().catch(transition.navigate);
    };
    const skip = () => active.current?.navigate();
    const preferenceChanged = () => { if (reducedMotion.matches) { active.current?.navigate(); active.current?.dispose(); } };
    const cancel = () => active.current?.dispose();
    document.addEventListener('click', onClick, true);
    window.addEventListener('resize', skip);
    window.addEventListener('popstate', cancel);
    window.addEventListener('pagehide', cancel);
    reducedMotion.addEventListener('change', preferenceChanged);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('resize', skip);
      window.removeEventListener('popstate', cancel);
      window.removeEventListener('pagehide', cancel);
      reducedMotion.removeEventListener('change', preferenceChanged);
      cancel();
    };
  }, [router]);

  return <style>{`
    html.has-project-transition,
    html.has-project-transition.lenis.lenis-stopped { overflow: hidden; scrollbar-gutter: stable; }
    .next-project-transition { position: fixed; inset: 0; width: 100%; max-width: none; height: 100%; max-height: none; margin: 0; padding: 0; overflow: hidden; border: 0; background: transparent; outline: none; }
    .next-project-transition::backdrop { background: transparent; }
    .next-project-transition-visual { position: absolute; overflow: hidden; background: var(--color-panel); transform-origin: bottom right; will-change: width, height, left, top, transform; }
    .next-project-transition-visual img, .next-project-transition-visual video { display: block; width: 100%; height: 100%; object-fit: cover; opacity: 1; }
  `}</style>;
}
