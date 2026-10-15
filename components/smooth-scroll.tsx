'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const NESTED_SCROLLERS = '.case-study-sidebar, .case-study-media-carousel';
const SCROLL_KEYS = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Tab']);

/** Ease wheel input while keeping native touch, anchors, and history restoration. */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lenis: Lenis | null = null;

    const syncPause = () => {
      if (document.hidden || document.querySelector('dialog[open]')) lenis?.stop();
      else lenis?.start();
    };

    const configure = () => {
      lenis?.destroy();
      lenis = null;
      if (preference.matches) return;
      lenis = new Lenis({
        autoRaf: true,
        smoothWheel: true,
        lerp: .085,
        wheelMultiplier: 1,
        syncTouch: false,
        anchors: false,
        stopInertiaOnNavigate: true,
        prevent: node => node.tagName === 'DIALOG'
          || node.matches('textarea, select')
          || (node.matches(NESTED_SCROLLERS)
            && (node.scrollHeight > node.clientHeight || node.scrollWidth > node.clientWidth)),
      });
      syncPause();
    };

    // Native focus, keyboard, and control-driven scrolling must not fight inertia.
    const cancelInertia = () => {
      if (lenis && !lenis.isStopped) lenis.scrollTo(window.scrollY, { immediate: true });
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.defaultPrevented && SCROLL_KEYS.has(event.key)) cancelInertia();
    };
    const onControlClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const control = event.target instanceof Element ? event.target.closest('a[href], button') : null;
      if (control instanceof HTMLButtonElement) { cancelInertia(); return; }
      const anchor = control instanceof HTMLAnchorElement ? control : null;
      if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return;
      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin === window.location.origin) cancelInertia();
    };

    configure();
    const dialogs = new MutationObserver(syncPause);
    dialogs.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });
    preference.addEventListener('change', configure);
    document.addEventListener('visibilitychange', syncPause);
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('click', onControlClick, true);
    window.addEventListener('popstate', cancelInertia);

    return () => {
      dialogs.disconnect();
      preference.removeEventListener('change', configure);
      document.removeEventListener('visibilitychange', syncPause);
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('click', onControlClick, true);
      window.removeEventListener('popstate', cancelInertia);
      lenis?.destroy();
    };
  }, [pathname]);

  return null;
}
