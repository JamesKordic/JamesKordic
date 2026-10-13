'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Project } from '@/lib/projects';
import { SITE_TEXT } from '@/lib/site-text';
import { SiteHeader } from './site-header';
import { PageFooter } from './page-footer';
import '@/app/portfolio.css';

export type PortfolioProject = Pick<Project, 'id' | 'title' | 'cover' | 'carouselVideo' | 'themeColor' | 'blurb' | 'work' | 'desc' | 'year'>;

const POSTERS: Record<string, string> = {
  voltage: '/projects/voltage/citrus-distortion/01-campaign-hero.jpg',
  'the-syndicate': '/posters/the-syndicate-sizzle-reel.jpg',
};

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M5 19 19 5M5 5h14v14' : 'M4 12h16m-7-7 7 7-7 7'} stroke="currentColor" strokeWidth="1.5" /></svg>;
}

/** Only nearby clips load; the shared motion control pauses decorative video. */
function ProjectVisual({ project, motion }: { project: PortfolioProject; motion: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const source = project.carouselVideo;
  const poster = POSTERS[project.id] ?? project.cover;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const preload = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setNear(true); }, { rootMargin: '150px' });
    const playback = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.05 });
    preload.observe(node);
    playback.observe(node);
    return () => { preload.disconnect(); playback.disconnect(); };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const sync = () => {
      if (motion && visible && !document.hidden) {
        video.muted = true;
        video.play().catch(() => undefined);
      } else video.pause();
    };
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, [motion, visible, near]);

  return <div className="project-visual" ref={ref} style={{ backgroundColor: project.themeColor }}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={poster} alt={`${project.title} — ${project.blurb}`} loading="lazy" width="1600" height="1000" />
    {source && near && !failed && <video ref={videoRef} src={source} muted loop playsInline preload="metadata" aria-hidden="true" onPlaying={() => setReady(true)} onError={() => setFailed(true)} className={ready && motion ? 'is-ready' : ''} />}
    <span className="project-view">View project <Arrow diagonal /></span>
  </div>;
}

function FeaturedWork({ projects, motion, toggleMotion }: { projects: PortfolioProject[]; motion: boolean; toggleMotion: () => void }) {
  const [active, setActive] = useState(0);
  const gallery = useRef<HTMLDivElement>(null);
  const current = projects[active];

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const cards = gallery.current?.querySelectorAll<HTMLElement>('[data-project]');
      if (!cards?.length) return;
      const focalPoint = window.innerHeight * 0.5;
      let nearest = 0;
      let distance = Infinity;
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const delta = Math.abs(rect.top + rect.height / 2 - focalPoint);
        if (delta < distance) { distance = delta; nearest = index; }
      });
      setActive(nearest);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, []);

  return <section id="work" className="selected-work" aria-labelledby="work-title">
    <aside className="work-story">
      <div>
        <p className="portfolio-label">Selected work <span>({String(projects.length).padStart(2, '0')})</span></p>
        <h2 id="work-title">Ideas in motion.</h2>
        <div className="work-story-copy" key={current.id}>
          <h3>{current.title}</h3>
          <p>{current.desc}</p>
          <Link href={`/work/${current.id}`} className="bracket-link">[ Explore project <span aria-hidden="true">↗</span> ]</Link>
        </div>
      </div>
      <div className="work-story-bottom">
        <nav className="project-position" aria-label="Jump to project">
          {projects.map((project, i) => <a key={project.id} href={`#selected-${project.id}`} aria-label={`Jump to ${project.title}`} aria-current={active === i ? 'true' : undefined}><span>{String(i + 1).padStart(2, '0')}</span></a>)}
        </nav>
        <button className="motion-toggle" onClick={toggleMotion} aria-label={motion ? 'Pause project motion' : 'Play project motion'}>{motion ? 'Ⅱ' : '▷'} <span>{motion ? 'Pause motion' : 'Play motion'}</span></button>
      </div>
    </aside>
    <div className="work-gallery" ref={gallery}>
      {projects.map((project, index) => <article key={project.id} data-project id={`selected-${project.id}`} className="work-project">
        <Link href={`/work/${project.id}`} className="project-link" aria-label={`Explore ${project.title}`}>
          <ProjectVisual project={project} motion={motion} />
          <div className="project-caption"><div><span className="project-number">{String(index + 1).padStart(2, '0')}</span><h3>{project.title}</h3></div><span className="project-discipline">{project.work ?? project.blurb}</span><Arrow diagonal /></div>
        </Link>
        <p className="project-mobile-desc">{project.desc}</p>
        {project.id === 'voltage' && <p className="project-disclosure">Self-initiated concept · AI-assisted imagery</p>}
      </article>)}
    </div>
  </section>;
}

export function PortfolioHome({ projects }: { projects: PortfolioProject[] }) {
  const clips = projects.filter(project => project.carouselVideo);
  const [active, setActive] = useState(0);
  const [motion, setMotion] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [reelOpen, setReelOpen] = useState(false);
  const [reelIndex, setReelIndex] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reelDialog = useRef<HTMLDialogElement>(null);
  const reelTrigger = useRef<HTMLButtonElement>(null);
  const current = clips[active];
  const advance = useCallback(() => { setReady(false); setActive(index => (index + 1) % clips.length); }, [clips.length]);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setMotion(!preference.matches);
    sync();
    preference.addEventListener('change', sync);
    const visibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', visibility);
    return () => { preference.removeEventListener('change', sync); document.removeEventListener('visibilitychange', visibility); };
  }, []);

  useEffect(() => {
    const node = heroRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), { threshold: 0.1 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const playing = motion && heroVisible && pageVisible && !reelOpen;
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) { video.muted = true; video.play().catch(() => undefined); }
    else video.pause();
    if (!playing) return;
    const interval = window.setInterval(advance, 9000);
    return () => window.clearInterval(interval);
  }, [playing, active, advance]);

  useEffect(() => {
    if (!reelOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    reelDialog.current?.showModal();
    return () => { document.body.style.overflow = previous; };
  }, [reelOpen]);

  const closeReel = () => { reelDialog.current?.close(); setReelOpen(false); reelTrigger.current?.focus(); };

  return <div className="portfolio-home">
    <SiteHeader overlay />
    <main id="main-content">
      <section className="portfolio-hero" ref={heroRef} aria-labelledby="hero-title">
        <div className="hero-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={current.cover} alt="" width="1920" height="1080" fetchPriority="high" />
          <video key={current.id} ref={videoRef} src={current.carouselVideo} muted playsInline preload="metadata" onPlaying={() => setReady(true)} onEnded={advance} aria-hidden="true" className={ready && motion ? 'is-ready' : ''} />
        </div>
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-topline portfolio-label"><span>Independent designer</span><span>New York, NY</span></div>
        <div className="hero-bottom">
          <div><p className="portfolio-label hero-eyebrow">Design with a pulse.</p><h1 id="hero-title">I’m James.<br /><span>Graphic &amp; Motion Designer</span></h1></div>
          <button ref={reelTrigger} className="reel-trigger" aria-label="Play selected reels" onClick={() => { setReelIndex(active); setReelOpen(true); }}><span className="reel-play" aria-hidden="true">▶</span><span>Play selected reels</span></button>
        </div>
        <div className="hero-base">
          <a href="#work" className="hero-scroll">Scroll to explore <span aria-hidden="true">↓</span></a>
          <div className="hero-clip-control"><span>{current.title}</span><span>{String(active + 1).padStart(2, '0')} / {String(clips.length).padStart(2, '0')}</span><button onClick={() => setMotion(value => !value)} aria-label={motion ? 'Pause motion' : 'Play motion'}>{motion ? 'Ⅱ' : '▷'}</button></div>
        </div>
        <div key={active} className={`hero-progress ${playing ? 'is-playing' : ''}`} aria-hidden="true" />
      </section>

      <section className="portfolio-intro" aria-label="Introduction">
        <p className="portfolio-label">A little introduction</p>
        <p className="intro-statement">I bring brands to life<br className="desktop-break" /> through design and motion. <span>From music and entertainment to food and tech, I make work that moves.</span></p>
        <a href="#about" className="bracket-link">[ A little about me <span aria-hidden="true">↗</span> ]</a>
        <div className="intro-foot"><span>Good ideas. Made to move.</span><span>Selected projects, 2024—2026 <span aria-hidden="true">↓</span></span></div>
      </section>

      <FeaturedWork projects={projects} motion={motion && pageVisible && !reelOpen} toggleMotion={() => setMotion(value => !value)} />

      <section id="about" className="portfolio-about" aria-labelledby="about-title">
        <div className="about-heading"><p className="portfolio-label">Behind the work</p><h2 id="about-title">A designer.<br />A music person.<br /><span>Always curious.</span></h2></div>
        <div className="about-portrait">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/about/James_HS.jpeg" alt="James Kordic" loading="lazy" width="900" height="1100" /><span>James Kordic / New York, NY</span></div>
        <div className="about-copy"><p>{SITE_TEXT.about.bio[0]}</p><p>{SITE_TEXT.about.bio[2]}</p><p>{SITE_TEXT.about.bio[3]}</p><a href={SITE_TEXT.contact.resumeUrl} target="_blank" rel="noopener noreferrer" className="bracket-link">[ View my résumé <span aria-hidden="true">↗</span> ]</a></div>
        <div className="about-experience"><p className="portfolio-label">Previously</p>{SITE_TEXT.home.masthead.previously.map(role => <p key={role}>{role}</p>)}</div>
      </section>
    </main>
    <PageFooter />

    <dialog className="reel-dialog" ref={reelDialog} aria-label="Selected motion reels" onCancel={closeReel} onClose={() => setReelOpen(false)} onClick={event => { if (event.target === event.currentTarget) closeReel(); }}>
      {reelOpen && <div className="reel-dialog-inner"><div className="reel-dialog-top"><span>Selected reels / {clips[reelIndex].title}</span><button onClick={closeReel} aria-label="Close reel">Close <span aria-hidden="true">×</span></button></div><video key={clips[reelIndex].id} src={clips[reelIndex].carouselVideo} poster={clips[reelIndex].cover} autoPlay controls playsInline onEnded={() => setReelIndex(index => (index + 1) % clips.length)} /><div className="reel-dialog-bottom"><button onClick={() => setReelIndex(index => (index - 1 + clips.length) % clips.length)}>← Previous</button><span>{String(reelIndex + 1).padStart(2, '0')} / {String(clips.length).padStart(2, '0')}</span><button onClick={() => setReelIndex(index => (index + 1) % clips.length)}>Next →</button></div></div>}
    </dialog>
  </div>;
}
