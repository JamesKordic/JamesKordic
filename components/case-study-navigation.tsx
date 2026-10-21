'use client';

import { useEffect, useRef, useState } from 'react';

type SectionLink = { id: string; title: string };
type Props = { title: string; blurb: string; category: string; sections: SectionLink[] };
type ReadingPosition = { x: number; y: number };
type SectionHistory = { id: string; page: string; expanded: string[]; position?: ReadingPosition };
const SECTION_HISTORY_KEY = '__jkCaseStudyNavigation';
const readingPositions = new Map<string, ReadingPosition>();

function scrollToSection(element: HTMLElement, behavior: ScrollBehavior) {
  const main = element.closest<HTMLElement>('.case-study-layout');
  const revealing = main?.closest('.case-study-page')?.classList.contains('is-next-revealing');
  const revealOffset = revealing && main
    ? parseFloat(window.getComputedStyle(main).getPropertyValue('--case-reveal-y')) || 0
    : 0;
  const margin = parseFloat(window.getComputedStyle(element).scrollMarginTop) || 0;
  // Section links use document positions, including when the outgoing page is
  // visually translated by the next-project animation.
  window.scrollTo({ top: window.scrollY + element.getBoundingClientRect().top - revealOffset - margin, behavior });
}

export function CaseStudyNavigation({ title, blurb, category, sections }: Props) {
  const [active, setActive] = useState(sections[0]?.id ?? '');
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLElement>(null);
  const navigationFrame = useRef(0);

  useEffect(() => () => window.cancelAnimationFrame(navigationFrame.current), []);

  useEffect(() => {
    let frame = 0;
    let hashFrame = 0;
    let entryId = '';
    let restoring: ReadingPosition | null = null;
    let aligningHash = false;
    const content = document.querySelector('.case-study-content');
    const page = content?.closest('.case-study-page');
    const pageUrl = window.location.pathname + window.location.search;
    const isCurrentPage = () => window.location.pathname + window.location.search === pageUrl;
    const savedHistory = (): SectionHistory | null => {
      const saved = window.history.state?.[SECTION_HISTORY_KEY] as SectionHistory | undefined;
      return saved?.page === pageUrl && typeof saved.id === 'string' && Array.isArray(saved.expanded) ? saved : null;
    };
    const capturePosition = () => {
      if (restoring || aligningHash || !isCurrentPage() || savedHistory()?.id !== entryId) return;
      readingPositions.set(entryId, { x: window.scrollX, y: window.scrollY });
    };
    const rememberHistory = (includePosition = false) => {
      const saved = savedHistory();
      if (!isCurrentPage() || saved?.id !== entryId) return;
      const expanded = Array.from(content?.querySelectorAll<HTMLDetailsElement>('details[id][open]') ?? [], (element) => element.id);
      window.history.replaceState({
        ...window.history.state,
        [SECTION_HISTORY_KEY]: { ...saved, expanded, ...(includePosition ? { position: readingPositions.get(entryId) } : {}) },
      }, '');
    };
    const update = () => {
      frame = 0;
      // The outgoing page moves during the next-project reveal; those visual
      // transforms must not change which section the reader has reached.
      if (page?.classList.contains('is-next-revealing')) {
        setActive(sections[sections.length - 1]?.id ?? '');
        return;
      }
      let current = sections[0]?.id ?? '';
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (!element || !element.getClientRects().length) continue;
        // Share the exact anchor landing position with scrollToSection. Round
        // to screen pixels so fractional layout values cannot miss a landing.
        const threshold = parseFloat(window.getComputedStyle(element).scrollMarginTop) || 0;
        if (Math.round(element.getBoundingClientRect().top) <= Math.round(threshold)) current = section.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      capturePosition();
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const restorePosition = () => {
      window.cancelAnimationFrame(hashFrame);
      hashFrame = window.requestAnimationFrame(() => {
        if (!restoring || !isCurrentPage() || savedHistory()?.id !== entryId) return;
        const maximum = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        window.scrollTo({ left: restoring.x, top: Math.min(restoring.y, maximum), behavior: 'instant' });
        // Lazy media can make the saved position temporarily unreachable.
        // ResizeObserver retries when its space is available, without timers.
        if (restoring.y <= maximum + 1) restoring = null;
        onScroll();
      });
    };
    const revealHash = () => {
      window.cancelAnimationFrame(hashFrame);
      restoring = null;
      aligningHash = false;
      if (!isCurrentPage()) return;
      let saved = savedHistory();
      if (!saved) {
        const id = window.crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        saved = { id, page: pageUrl, expanded: [] };
        window.history.replaceState({ ...window.history.state, [SECTION_HISTORY_KEY]: saved }, '');
      }
      entryId = saved.id;
      const position = readingPositions.get(entryId) ?? saved.position;
      if (position) {
        // Restore this particular entry, even when another entry has the same
        // URL or its hash no longer describes the last place the reader reached.
        content?.querySelectorAll<HTMLDetailsElement>('details[id]').forEach((element) => {
          element.open = saved.expanded.includes(element.id);
        });
        restoring = position;
        restorePosition();
        onScroll();
        return;
      }
      let id;
      try { id = decodeURIComponent(window.location.hash.slice(1)); }
      catch { rememberHistory(); return; }
      const element = document.getElementById(id);
      if (element?.closest('.case-study-content')) {
        aligningHash = true;
        let disclosure = element.closest('details');
        while (disclosure) {
          disclosure.open = true;
          disclosure = disclosure.parentElement?.closest('details') ?? null;
        }
        hashFrame = window.requestAnimationFrame(() => {
          if (!isCurrentPage() || savedHistory()?.id !== entryId) return;
          scrollToSection(element, 'instant');
          aligningHash = false;
          capturePosition();
          rememberHistory(true);
          onScroll();
        });
      } else {
        capturePosition();
        rememberHistory(true);
      }
      onScroll();
    };
    const onToggle = (event: Event) => {
      if (event.target instanceof HTMLDetailsElement && content?.contains(event.target)) rememberHistory();
      onScroll();
    };
    const saveBeforeNavigation = (event: MouseEvent) => {
      cancelRestoration();
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
      if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return;
      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin || destination.pathname + destination.search !== pageUrl) {
        capturePosition();
        rememberHistory(true);
      }
    };
    const cancelRestoration = () => {
      if (!restoring) return;
      window.cancelAnimationFrame(hashFrame);
      restoring = null;
      capturePosition();
    };
    const saveBeforeUnload = () => {
      capturePosition();
      rememberHistory(true);
    };
    revealHash();
    const sizes = new ResizeObserver(() => { if (restoring) restorePosition(); onScroll(); });
    if (content) {
      sizes.observe(content);
      for (const child of content.children) sizes.observe(child);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('hashchange', revealHash);
    window.addEventListener('popstate', revealHash);
    window.addEventListener('pagehide', saveBeforeUnload);
    window.addEventListener('wheel', cancelRestoration, { passive: true });
    window.addEventListener('touchstart', cancelRestoration, { passive: true });
    window.addEventListener('keydown', cancelRestoration);
    document.addEventListener('click', saveBeforeNavigation, true);
    document.addEventListener('toggle', onToggle, true);
    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(hashFrame);
      sizes.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('hashchange', revealHash);
      window.removeEventListener('popstate', revealHash);
      window.removeEventListener('pagehide', saveBeforeUnload);
      window.removeEventListener('wheel', cancelRestoration);
      window.removeEventListener('touchstart', cancelRestoration);
      window.removeEventListener('keydown', cancelRestoration);
      document.removeEventListener('click', saveBeforeNavigation, true);
      document.removeEventListener('toggle', onToggle, true);
    };
  }, [sections]);

  useEffect(() => {
    const element = dialog.current;
    if (!element || !open) return;
    const mobile = window.matchMedia('(max-width: 52.0625rem)');
    const closeOnDesktop = () => { if (!mobile.matches) setOpen(false); };
    if (!mobile.matches) { setOpen(false); return; }
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    element.showModal();
    mobile.addEventListener('change', closeOnDesktop);
    return () => {
      mobile.removeEventListener('change', closeOnDesktop);
      element.close();
      document.body.style.overflow = overflow;
      const focusTarget = trigger.current?.getClientRects().length
        ? trigger.current
        : sidebar.current?.querySelector<HTMLAnchorElement>('a[aria-current="location"]');
      focusTarget?.focus({ preventScroll: true });
    };
  }, [open]);

  const navigate = (id: string, moveFocus: boolean) => {
    setOpen(false);
    window.cancelAnimationFrame(navigationFrame.current);
    const visit = () => {
      // Wait for modal cleanup to restore its opener before moving focus onward.
      if (dialog.current?.open) {
        navigationFrame.current = window.requestAnimationFrame(visit);
        return;
      }
      navigationFrame.current = 0;
      const element = document.getElementById(id);
      if (element instanceof HTMLDetailsElement) element.open = true;
      if (element) scrollToSection(element, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth');
      if (moveFocus && element) {
        const target = element instanceof HTMLDetailsElement ? element.querySelector('summary') ?? element : element;
        const previousTabIndex = target.getAttribute('tabindex');
        if (target.tabIndex < 0 && previousTabIndex === null) {
          target.setAttribute('tabindex', '-1');
          target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
        }
        target.focus({ preventScroll: true });
      }
    };
    navigationFrame.current = window.requestAnimationFrame(visit);
  };

  const links = () => sections.map((section) => (
    <a
      key={section.id}
      href={`#${section.id}`}
      className={active === section.id ? 'is-active' : undefined}
      aria-current={active === section.id ? 'location' : undefined}
      onClick={(event) => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        window.history.replaceState(window.history.state, '', `#${section.id}`);
        navigate(section.id, event.detail === 0);
      }}
    >
      <span className="case-study-nav-dot" aria-hidden="true" />{section.title}
    </a>
  ));

  return (
    <>
      <aside ref={sidebar} className="case-study-sidebar">
        <div className="case-study-sidebar-title">
          <h1>{title}</h1>
          <p>{blurb}</p>
          <div className="case-study-tags"><span>{category}</span></div>
        </div>
        <nav className="case-study-anchor-nav" aria-label="Project sections">{links()}</nav>
      </aside>
      <button ref={trigger} type="button" className="case-study-mobile-trigger" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open} aria-controls="case-study-mobile-navigation">
        <span>{title}</span><span>{sections.find((section) => section.id === active)?.title ?? sections[0]?.title}</span><span aria-hidden="true">⌃</span>
      </button>
      <dialog ref={dialog} id="case-study-mobile-navigation" className="case-study-mobile-navigation" aria-label="Project sections" onCancel={(event) => { event.preventDefault(); setOpen(false); }}>
        <div className="case-study-mobile-navigation-scroll">
          <div className="case-study-sidebar-title">
            <p className="case-study-mobile-name">{title}</p><p>{blurb}</p>
            <div className="case-study-tags"><span>{category}</span></div>
          </div>
          <nav className="case-study-anchor-nav" aria-label="Mobile project sections">{links()}</nav>
        </div>
        <button type="button" className="case-study-mobile-close" onClick={() => setOpen(false)}>Close <span aria-hidden="true">×</span></button>
      </dialog>
    </>
  );
}
