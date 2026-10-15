'use client';

import { useEffect, useRef, useState } from 'react';

type SectionLink = { id: string; title: string };
type Props = { title: string; blurb: string; category: string; year: string; sections: SectionLink[] };

export function CaseStudyNavigation({ title, blurb, category, year, sections }: Props) {
  const [active, setActive] = useState(sections[0]?.id ?? '');
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = sections[0]?.id ?? '';
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (!element) continue;
        const threshold = (parseFloat(window.getComputedStyle(element).scrollMarginTop) || 0) + 2;
        if (element.getBoundingClientRect().top <= threshold) current = section.id;
      }
      setActive(current);
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    const revealHash = () => {
      const section = sections.find(({ id }) => window.location.hash === `#${id}`);
      const element = section && document.getElementById(section.id);
      if (element instanceof HTMLDetailsElement) element.open = true;
      onScroll();
    };
    revealHash();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('hashchange', revealHash);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('hashchange', revealHash);
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

  const navigate = (id: string) => {
    setActive(id);
    setOpen(false);
    window.setTimeout(() => {
      const element = document.getElementById(id);
      if (element instanceof HTMLDetailsElement) element.open = true;
      element?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    }, 0);
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
        navigate(section.id);
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
          <div className="case-study-tags"><span>{category}</span><i aria-hidden="true" /><span>{year}</span></div>
        </div>
        <nav className="case-study-anchor-nav" aria-label="Project sections">{links()}</nav>
      </aside>
      <button ref={trigger} type="button" className="case-study-mobile-trigger" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open} aria-controls="case-study-mobile-navigation">
        <span>{title}</span><span>{sections.find((section) => section.id === active)?.title ?? sections[0]?.title}</span><span aria-hidden="true">⌃</span>
      </button>
      <dialog ref={dialog} id="case-study-mobile-navigation" className="case-study-mobile-navigation" aria-label="Project sections" onCancel={(event) => { event.preventDefault(); setOpen(false); }}>
        <div className="case-study-sidebar-title">
          <p className="case-study-mobile-name">{title}</p><p>{blurb}</p>
          <div className="case-study-tags"><span>{category}</span><i aria-hidden="true" /><span>{year}</span></div>
        </div>
        <nav className="case-study-anchor-nav" aria-label="Mobile project sections">{links()}</nav>
        <button type="button" className="case-study-mobile-close" onClick={() => setOpen(false)}>Close <span aria-hidden="true">×</span></button>
      </dialog>
    </>
  );
}
