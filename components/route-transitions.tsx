'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type NativeTransition = {
  ready: Promise<void>;
  finished: Promise<void>;
  skipTransition: () => void;
};
type TransitionDocument = Document & {
  startViewTransition?: (update: () => Promise<void>) => NativeTransition;
};
type PendingRoute = { from: string | null; complete: () => void };

/** Let Next own navigation; briefly hold the new snapshot until it commits. */
export function RouteTransitions() {
  const router = useRouter();
  const pathname = usePathname();
  const currentPath = useRef(pathname);
  const pending = useRef<PendingRoute | null>(null);
  const active = useRef<NativeTransition | null>(null);

  useLayoutEffect(() => {
    currentPath.current = pathname;
    if (pending.current && pathname !== pending.current.from) pending.current.complete();
  }, [pathname]);

  useEffect(() => {
    const documentWithTransitions = document as TransitionDocument;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const cancel = () => {
      active.current?.skipTransition();
      pending.current?.complete();
    };
    const onPreferenceChange = () => { if (reducedMotion.matches) cancel(); };

    const onClick = (event: MouseEvent) => {
      if (!documentWithTransitions.startViewTransition || reducedMotion.matches || active.current || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
      if (!(anchor instanceof HTMLAnchorElement) || anchor.hasAttribute('download') || anchor.closest('[data-no-route-transition]') || (anchor.target && anchor.target.toLowerCase() !== '_self')) return;

      const destination = new URL(anchor.href, window.location.href);
      // Hash navigation and query-only updates keep their usual scrolling.
      if (destination.origin !== window.location.origin || destination.pathname === window.location.pathname || destination.hash) return;

      const href = `${destination.pathname}${destination.search}`;
      let transition: NativeTransition;
      try {
        transition = documentWithTransitions.startViewTransition(() => new Promise<void>((resolve) => {
          const request: PendingRoute = {
            from: currentPath.current,
            complete: () => {
              window.clearTimeout(timeout);
              if (pending.current === request) pending.current = null;
              resolve();
            },
          };
          // A failed or slow route must never leave the browser snapshot frozen.
          const timeout = window.setTimeout(() => { transition.skipTransition(); request.complete(); }, 2000);
          pending.current = request;
          try { router.push(href); }
          catch { transition.skipTransition(); request.complete(); }
        }));
      } catch {
        return; // Leave the original link event for ordinary Next navigation.
      }

      event.preventDefault();
      active.current = transition;
      // Skipped snapshots (for example, a hidden tab) can reject ready.
      void transition.ready.catch(() => undefined);
      const finish = () => {
        if (active.current === transition) {
          active.current = null;
          pending.current?.complete();
        }
      };
      void transition.finished.then(finish, finish);
    };

    document.addEventListener('click', onClick, true);
    reducedMotion.addEventListener('change', onPreferenceChange);
    return () => {
      document.removeEventListener('click', onClick, true);
      reducedMotion.removeEventListener('change', onPreferenceChange);
      cancel();
    };
  }, [router]);

  return <style>{`
    ::view-transition-group(root),
    ::view-transition-old(root),
    ::view-transition-new(root) {
      animation-duration: 250ms;
      animation-timing-function: cubic-bezier(.2, 0, .2, 1);
    }
    @media (prefers-reduced-motion: reduce) {
      ::view-transition-group(root),
      ::view-transition-old(root),
      ::view-transition-new(root) { animation-duration: 0s; }
    }
  `}</style>;
}
