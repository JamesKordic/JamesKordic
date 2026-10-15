'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { Project } from '@/lib/projects';
import { SITE_TEXT } from '@/lib/site-text';
import { SiteHeader } from './site-header';
import { PageFooter } from './page-footer';
import '@/app/about-portfolio.css';

const VALUES = [
  { title: 'Curiosity', text: 'Music, photography, and the world beyond the screen all shape how I see. I bring that curiosity to each new brief, looking for the idea that makes it distinct.' },
  { title: 'Collaboration', text: 'I work alongside clients and creative teams to turn a shared idea into something real. Clear communication and thoughtful feedback are part of the design process.' },
  { title: 'Craft', text: 'From typography to timing, the details matter. I bring care to the still image and the moving frame, making work that feels considered wherever it lives.' },
];

/** Three interactive light studies echo the reference's values canvases. */
function ValueCanvas({ mode, motion }: { mode: number; motion: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const animation = useRef({
    elapsed: .43 / .14,
    orbs: Array.from({ length: 4 }, (_, index) => ({ x: .3 + (index % 2) * .4, y: .3 + Math.floor(index / 2) * .4 })),
  });
  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    let frame = 0;
    let visible = false;
    let elapsed = animation.current.elapsed;
    let previousTime = 0;
    let width = canvas.width;
    let height = canvas.height;
    const pointer = { x: .5, y: .5, active: false };
    const orbs = animation.current.orbs;
    const drawOrb = (x: number, y: number, radius: number, sharp = false, alpha = 1) => {
      const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgba(255,155,140,${alpha})`);
      gradient.addColorStop(sharp ? .27 : .08, `rgba(255,59,31,${alpha * .88})`);
      gradient.addColorStop(sharp ? .45 : .25, `rgba(177,35,22,${alpha * .78})`);
      gradient.addColorStop(.63, `rgba(62,16,12,${alpha * .6})`);
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      context.fillStyle = gradient;
      context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    };
    const paint = (now: number) => {
      frame = 0;
      if (previousTime && motion) elapsed += Math.min(now - previousTime, 40) / 1000;
      animation.current.elapsed = elapsed;
      previousTime = now;
      context.fillStyle = '#0a0a0a';
      context.fillRect(0, 0, width, height);
      if (mode === 0) {
        const phase = (elapsed * .14) % 1;
        const y = height * (.8 - phase * .57);
        const radius = height * (pointer.active ? .36 : .24);
        for (let i = 14; i >= 1; i--) drawOrb(width * .5, y + i * height / 60, radius * (.85 - i * .025), false, .065);
        drawOrb(width * .5, y, radius, true, .95);
      } else if (mode === 1) {
        orbs.forEach((orb, index) => {
          const targetX = pointer.active ? pointer.x + Math.cos(index * Math.PI / 2 + elapsed) * .12 : .5 + Math.sin(elapsed * .4 + index * 1.7) * .28;
          const targetY = pointer.active ? pointer.y + Math.sin(index * Math.PI / 2 + elapsed) * .12 : .5 + Math.cos(elapsed * .5 + index * 2) * .25;
          if (motion) {
            orb.x += (targetX - orb.x) * .025;
            orb.y += (targetY - orb.y) * .025;
          }
          drawOrb(orb.x * width, orb.y * height, height * .3, true, .88);
        });
      } else {
        const proximity = pointer.active ? Math.max(0, 1 - Math.hypot(pointer.x - .5, pointer.y - .5) * 1.6) : 0;
        drawOrb(width * .5, height * .5, height * (.48 - proximity * .17), proximity > .45, .7 + proximity * .3);
      }
      if (visible && motion && mode !== 2 && !document.hidden) frame = requestAnimationFrame(paint);
    };
    const start = () => { if (!frame && !document.hidden) { previousTime = 0; frame = requestAnimationFrame(paint); } };
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const nextWidth = Math.max(1, Math.round(rect.width * dpr));
      const nextHeight = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width === nextWidth && canvas.height === nextHeight) return;
      width = nextWidth;
      height = nextHeight;
      canvas.width = width;
      canvas.height = height;
      start();
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) start(); else { cancelAnimationFrame(frame); frame = 0; } });
    observer.observe(canvas);
    const sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(canvas);
    const move = (event: PointerEvent) => {
      if (!motion) return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width;
      pointer.y = (event.clientY - rect.top) / rect.height;
      pointer.active = true;
      if (mode === 2) start();
    };
    const leave = () => { pointer.active = false; if (motion && mode === 2) start(); };
    const visibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else if (visible) start(); };
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerleave', leave);
    document.addEventListener('visibilitychange', visibility);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); sizeObserver.disconnect(); canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerleave', leave); document.removeEventListener('visibilitychange', visibility); };
  }, [mode, motion]);
  return <canvas ref={ref} aria-hidden="true" />;
}

export function AboutPortfolio({ projects }: { projects: Project[] }) {
  const banner = useRef<HTMLDivElement>(null);
  const bannerProgress = useRef(0);
  const [motion, setMotion] = useState(false);
  const [profileTab, setProfileTab] = useState(0);
  const dragStart = useRef<{ id: number; x: number; y: number } | null>(null);
  const [time, setTime] = useState('');
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState('');
  const copyTimer = useRef<number | undefined>(undefined);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setMotion(!media.matches);
    sync();
    media.addEventListener('change', sync);
    const updateTime = () => setTime(new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()));
    updateTime();
    const timer = window.setInterval(updateTime, 30_000);
    return () => { media.removeEventListener('change', sync); window.clearInterval(timer); window.clearTimeout(copyTimer.current); };
  }, []);
  useEffect(() => {
    const node = banner.current;
    if (!node) return;
    let frame = 0;
    let lastHeight = '';
    const desktop = window.matchMedia('(min-width: 52.125rem)');
    const update = () => {
      frame = 0;
      if (!desktop.matches) { node.style.removeProperty('height'); lastHeight = ''; return; }
      if (motion) {
        const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        bannerProgress.current = Math.min(1, Math.max(0, (window.scrollY - 7.5 * rem) / (40.625 * rem)));
      }
      const height = `${Math.round(node.clientWidth * (230 / 1480 + bannerProgress.current * (.6 - 230 / 1480)))}px`;
      if (height !== lastHeight) { node.style.height = height; lastHeight = height; }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, [motion]);
  const copyEmail = async () => {
    window.clearTimeout(copyTimer.current);
    setCopyError('');
    try { await navigator.clipboard.writeText(SITE_TEXT.contact.email); setCopied(true); }
    catch { setCopied(false); setCopyError('Copy is unavailable. Select the email address to copy it.'); }
    copyTimer.current = window.setTimeout(() => { setCopied(false); setCopyError(''); }, 3000);
  };
  const profileContent = [
    { title: 'James Kordic', label: 'Graphic & Motion Designer', image: '/about/James_HS.jpeg', paragraphs: [SITE_TEXT.about.bio[0], SITE_TEXT.about.bio[1]] },
    { title: 'Ideas, made real.', label: 'Experience & education', image: '/projects/wwimf/visual-identity-exhibition.png', paragraphs: [...SITE_TEXT.home.masthead.previously, SITE_TEXT.about.bio[2]] },
    { title: 'Beyond the screen.', label: 'Music & photography', image: '/about/headshot.jpg', paragraphs: [SITE_TEXT.about.bio[3]] },
  ];
  const current = profileContent[profileTab];
  return <div className="ka-page">
    <SiteHeader overlay />
    <main id="main-content" className="ka-main">
      <section className="ka-hero" aria-labelledby="ka-title"><div className="ka-hero-copy"><h1 id="ka-title">About me<span>.</span></h1><p>One designer. Many possibilities.<br />Graphic design and motion, made in New York.</p></div><nav className="ka-jump" aria-label="Jump to about section"><span>(Jump to)</span><a href="#section-values">Values</a><a href="#section-designer">Designer</a><a href="#section-location">Location</a><a href="#section-latest">Latest work</a></nav></section>
      <div className="ka-banner" ref={banner}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/projects/wwimf/visual-identity-exhibition.png" alt="James Kordic’s What Would I Miss Fest exhibition and visual identity work" fetchPriority="high" /></div>
      <section id="section-values" className="ka-values" aria-labelledby="ka-values-title"><div className="ka-section-label"><h2 id="ka-values-title">About</h2><span>My values</span></div><p className="ka-section-statement">How I work. <span>Led by curiosity. Shaped through collaboration. Refined through craft.</span></p><div className="ka-values-grid">{VALUES.map((value, index) => <article key={value.title}><div className="ka-value-visual"><ValueCanvas mode={index} motion={motion} /></div><div className="ka-value-text"><h3>{value.title}</h3><p>{value.text}</p></div></article>)}</div><button className="ka-motion" onClick={() => setMotion(value => !value)} aria-pressed={!motion}>{motion ? 'Ⅱ Pause motion' : '▷ Play motion'}</button></section>
      <section className="ka-designer" id="section-designer" aria-labelledby="ka-designer-title">
        <p className="ka-designer-intro">A designer bringing curiosity, musical instinct, and a love of making things together.</p>
        <div className="ka-profile-stage">
          <div className="ka-section-label"><h2 id="ka-designer-title">The designer</h2><span>(1)</span></div>
          <div className="ka-profile-interaction" role="group" aria-label="Designer profile. Use the tabs or left and right arrow keys to explore." tabIndex={0}
            onKeyDown={event => {
              if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                event.preventDefault();
                setProfileTab(index => (index + (event.key === 'ArrowRight' ? 1 : 2)) % 3);
              }
            }}
            onPointerDown={event => {
              if (!event.isPrimary || event.button !== 0) return;
              dragStart.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerUp={event => {
              const start = dragStart.current;
              if (start?.id !== event.pointerId) return;
              const distanceX = event.clientX - start.x;
              const distanceY = event.clientY - start.y;
              if (Math.abs(distanceX) > 50 && Math.abs(distanceX) > Math.abs(distanceY)) {
                setProfileTab(index => (index + (distanceX < 0 ? 1 : 2)) % 3);
              }
              dragStart.current = null;
              if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
            }}
            onPointerCancel={() => { dragStart.current = null; }}
            onLostPointerCapture={() => { dragStart.current = null; }}>
            <h3>{current.title}</h3>
            <div className="ka-profile-image" key={current.image}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={current.image} alt={profileTab === 1 ? 'What Would I Miss Fest exhibition design by James Kordic' : 'James Kordic'} loading="lazy" decoding="async" draggable={false} />
            </div>
            <p className="ka-profile-role" aria-live="polite" aria-atomic="true">{current.label}<span>New York, NY</span></p>
          </div>
          <div className="ka-profile-location"><span>(1)</span> Location</div>
        </div>
        <div className="ka-profile-controls">
          <div className="ka-profile-tabs" role="tablist" aria-label="About James" onKeyDown={event => {
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault();
            const next = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (profileTab + (event.key === 'ArrowRight' ? 1 : 2)) % 3;
            setProfileTab(next);
            document.getElementById(`ka-profile-tab-${next}`)?.focus();
          }}>
            {['Profile', 'Experience', 'Outside work'].map((label, index) => <button role="tab" id={`ka-profile-tab-${index}`} aria-selected={profileTab === index} tabIndex={profileTab === index ? 0 : -1} aria-controls="ka-profile-content" key={label} onClick={() => setProfileTab(index)}>{label}</button>)}
          </div>
          <a href={SITE_TEXT.contact.resumeUrl} target="_blank" rel="noopener noreferrer">Résumé ↗</a>
        </div>
        <div className="ka-profile-copy" id="ka-profile-content" role="tabpanel" tabIndex={0} aria-labelledby={`ka-profile-tab-${profileTab}`}>
          {current.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </section>
      <section id="section-location" className="ka-location" aria-labelledby="ka-location-title"><div className="ka-section-label"><h2 id="ka-location-title">Location</h2><span>(1)</span></div><p className="ka-section-statement">New York. <span>Home base for work that moves.</span></p><div className="ka-location-grid"><aside><p>Based in</p><a href="#ka-new-york">↳ The Americas</a></aside><div className="ka-location-cards" id="ka-new-york"><article><div className="ka-city-card"><div className="ka-city-lines" aria-hidden="true" /><span className="ka-city-time">{time || '—:—'} / NYC</span><p>New<br />York.</p><span className="ka-city-marker" aria-hidden="true">✳</span></div><div className="ka-location-caption"><h3>New York</h3><a href="https://www.google.com/maps/place/New+York,+NY/" target="_blank" rel="noopener noreferrer">New York, NY<br />United States<br /><span>Open in Maps ↗</span></a></div></article><article className="ka-contact-card"><span className="ka-small-label">Open for work</span><h3>Freelance.<br />Full-time.<br /><span>Let’s talk.</span></h3><p>{SITE_TEXT.home.masthead.availability}</p><div><a href={`mailto:${SITE_TEXT.contact.email}`}>{SITE_TEXT.contact.email}</a><button aria-label={copied ? 'Email address copied' : 'Copy email address'} onClick={copyEmail}>{copied ? 'Copied ✓' : copyError ? 'Try again ↗' : 'Copy ↗'}</button></div><span className="ka-status" role="status">{copied ? 'Email address copied.' : copyError}</span></article></div></div></section>
      <section id="section-latest" className="ka-latest" aria-labelledby="ka-latest-title"><div className="ka-latest-heading"><div className="ka-section-label"><h2 id="ka-latest-title">Latest work</h2><span>Projects and collaborations</span></div></div><div className="ka-latest-grid">{projects.map(project => <Link key={project.id} href={`/work/${project.id}`}><div className="ka-latest-image">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={project.cover} alt="" loading="lazy" decoding="async" /></div><h3>{project.title}</h3><p>{project.blurb}</p><span className="ka-small-label">{project.work ?? 'Graphic & Motion Design'}</span></Link>)}</div></section>
    </main>
    <PageFooter />
  </div>;
}
