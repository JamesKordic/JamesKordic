'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { SITE_TEXT } from '@/lib/site-text';
import '@/app/chrome.css';

const T = SITE_TEXT;

/** Shared navigation contracts as the work takes over the screen. */
export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const pathname = usePathname() ?? '/';
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 80);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit', hour12: true,
    });
    const update = () => setTime(formatter.format(new Date()));
    update();
    const interval = window.setInterval(update, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (!open) {
      if (element.open) element.close();
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    element.showModal();
    closeButton.current?.focus();
    return () => {
      if (element.open) element.close();
      document.body.style.overflow = previousOverflow;
      trigger.current?.focus({ preventScroll: true });
    };
  }, [open]);

  const links = [
    { label: 'Work', href: '/#work', external: false },
    { label: 'About', href: '/#about', external: false },
    { label: 'Contact', href: '/contact', external: false },
    { label: 'Résumé', href: T.contact.resumeUrl, external: true },
  ];

  const follow = (href: string) => {
    setOpen(false);
    const [path, hash] = href.split('#');
    if (hash && (path || '/') === pathname) {
      window.setTimeout(() => document.getElementById(hash)?.scrollIntoView(), 0);
    }
  };
  const pageLabel = pathname.startsWith('/contact') ? 'Contact' : pathname.startsWith('/work/') ? 'Work' : 'Home';

  return (
    <>
      {!overlay && <div className="jk-header-spacer" aria-hidden="true" />}
      <header className={`jk-header${overlay ? ' jk-header--overlay' : ''}${scrolled ? ' jk-header--compact' : ''}`}>
        <Link href="/" className="jk-wordmark" aria-label={`${T.artist.name}, home`}>
          James Kordic
        </Link>
        <nav className="jk-header-nav" aria-label="Primary">
          {links.map((item) => item.external ? (
            <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">{item.label}<span aria-hidden="true"> ↗</span></a>
          ) : (
            <Link key={item.label} href={item.href} onClick={() => follow(item.href)}>{item.label}</Link>
          ))}
        </nav>
        <div className="jk-header-actions">
          <span className="jk-header-clock" aria-label={time ? `New York, ${time}` : 'New York'}>NYC <span>{time || '—:—'}</span></span>
          <button ref={trigger} type="button" className="jk-menu-trigger" aria-haspopup="dialog" aria-expanded={open} aria-controls="jk-navigation-dialog" aria-label="Open navigation menu" onClick={() => setOpen(true)}>
            <span className="jk-menu-page">{pageLabel}</span>
            <span className="jk-menu-label">Menu</span>
            <span className="jk-menu-plus" aria-hidden="true">+</span>
          </button>
        </div>
      </header>
      <dialog ref={dialog} id="jk-navigation-dialog" className="jk-menu-dialog" aria-label="Site navigation" onCancel={(event) => { event.preventDefault(); setOpen(false); }} onClose={() => setOpen(false)}>
        <div className="jk-menu-top">
          <Link href="/" className="jk-wordmark" onClick={() => setOpen(false)}>James Kordic</Link>
          <button ref={closeButton} type="button" className="jk-menu-close" onClick={() => setOpen(false)}>Close <span aria-hidden="true">×</span></button>
        </div>
        <div className="jk-menu-body">
          <nav className="jk-menu-links" aria-label="Expanded navigation">
            {links.map((item, index) => {
              const contents = <><span className="jk-menu-index">0{index + 1}</span><span>{item.label}</span><span className="jk-menu-arrow" aria-hidden="true">↗</span></>;
              return item.external ? (
                <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>{contents}</a>
              ) : (
                <Link key={item.label} href={item.href} onClick={() => follow(item.href)}>{contents}</Link>
              );
            })}
          </nav>
          <div className="jk-menu-info">
            <p className="jk-chrome-label">New York, NY<br />Graphic &amp; Motion Design</p>
            <div><p className="jk-chrome-label">Have something in mind?</p><a className="jk-menu-email" href={`mailto:${T.contact.email}`}>{T.contact.email} ↗</a></div>
            <a className="jk-chrome-label jk-chrome-link" href={T.contact.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          </div>
        </div>
      </dialog>
    </>
  );
}
