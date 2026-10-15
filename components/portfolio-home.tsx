'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import type { Project } from '@/lib/projects';
import { SiteHeader } from './site-header';
import { PageFooter } from './page-footer';
import '@/app/portfolio.css';

export type PortfolioProject = Pick<Project, 'id' | 'title' | 'cover' | 'carouselVideo' | 'themeColor' | 'blurb' | 'work' | 'desc' | 'year' | 'industry'>;

const POSTERS: Record<string, string> = {
  voltage: '/projects/voltage/citrus-distortion/01-campaign-hero.jpg',
  'the-syndicate': '/posters/the-syndicate-sizzle-reel.jpg',
};

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M5 19 19 5M5 5h14v14' : 'M4 12h16m-7-7 7 7-7 7'} stroke="currentColor" strokeWidth="1.5" /></svg>;
}

function movePointerLabel(event: PointerEvent<HTMLElement>) {
  if (event.pointerType === 'touch') return;
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`);
}

/** Only nearby clips load; previews respect motion preferences and individual controls. */
function ProjectVisual({ project, motion, suspended }: { project: PortfolioProject; motion: boolean; suspended: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [manualMotion,setManualMotion]=useState<boolean|null>(null);
  const effectiveMotion=manualMotion??motion;
  useEffect(()=>setManualMotion(null),[motion]);
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
      if (effectiveMotion && visible && !suspended && !document.hidden) {
        video.muted = true;
        video.play().catch(error => { if (error.name === 'NotAllowedError') setBlocked(true); });
      } else video.pause();
    };
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, [effectiveMotion, visible, near, suspended]);

  return <div className="project-visual" ref={ref} style={{ backgroundColor: project.themeColor }}>
    <Link href={`/work/${project.id}`} className="project-link" data-home-project-link={project.id} data-project-title={project.title} data-no-route-transition aria-label={`Explore ${project.title}`} onPointerMove={movePointerLabel}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={poster} alt={`${project.title} — ${project.blurb}`} loading="lazy" width="1600" height="1000" />
    {source && near && (effectiveMotion || ready) && !failed && <video ref={videoRef} src={source} muted loop playsInline preload="metadata" aria-hidden="true" onPlaying={() => { setReady(true); setBlocked(false); }} onError={() => setFailed(true)} className={ready ? 'is-ready' : ''} />}
    <span className="project-view" aria-hidden="true">View project <Arrow diagonal /></span></Link>
    {source && !failed && <button className="project-pause" aria-label={effectiveMotion && !blocked ? `Pause ${project.title} preview` : `Play ${project.title} preview`} onClick={()=>{if(blocked){setBlocked(false);videoRef.current?.play().catch(()=>setBlocked(true));}else setManualMotion(!effectiveMotion);}}>{effectiveMotion && !blocked?'Ⅱ':'▷'}</button>}
  </div>;
}

function FeaturedWork({ projects, motion, suspended }: { projects: PortfolioProject[]; motion: boolean; suspended: boolean }) {
  const [active, setActive] = useState(0);
  const section = useRef<HTMLElement>(null);
  const story = useRef<HTMLElement>(null);
  const gallery = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      frame = 0;
      const cards = gallery.current?.querySelectorAll<HTMLElement>('[data-project]');
      if (!cards || !section.current || !story.current) return;
      const viewport = window.innerHeight;
      const sectionTop = section.current.getBoundingClientRect().top;
      // Start when the gallery reaches mid-screen, but never before the user
      // scrolls: a short introduction can already be above that point on load.
      const revealStart = Math.max(0, sectionTop + window.scrollY - viewport * .5);
      const reveal = Math.min(1, Math.max(0, (window.scrollY - revealStart) / (viewport * .25)));
      const opacity = preference.matches ? Number(reveal > 0) : reveal;
      story.current.style.setProperty('--story-reveal', String(opacity));
      story.current.inert = opacity === 0;
      let next = 0;
      cards.forEach((card, index) => {
        if (card.getBoundingClientRect().top <= viewport * .5) next = index;
      });
      setActive(next);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    preference.addEventListener('change', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      preference.removeEventListener('change', schedule);
    };
  }, [projects]);

  return <section ref={section} id="work" className="selected-work" aria-labelledby="work-title">
    <h2 className="mobile-work-title">My work</h2>
    <div className="work-story-column">
      <aside ref={story} className="work-story">
        <div className="work-story-heading">
          <h2 id="work-title">My work</h2>
          <div className="work-story-titles">{projects.map((project, index) =>
            <h3 key={project.id} aria-hidden={index !== active} className={`work-story-title${index === active ? ' is-active' : index < active ? ' is-before' : ''}`}>{project.title}</h3>
          )}</div>
        </div>
        <div className="work-story-copy">{projects.map((project, index) =>
          <div key={project.id} aria-hidden={index !== active} className={`work-story-layer${index === active ? ' is-active' : ''}`}><p>{project.desc}</p></div>
        )}</div>
        <div className="work-story-meta-stack">{projects.map((project, index) =>
          <Link key={project.id} href={`/work/${project.id}`} data-home-project-link={project.id} data-project-title={project.title} data-no-route-transition aria-hidden={index !== active} tabIndex={index === active ? 0 : -1} className={`work-story-meta work-story-layer${index === active ? ' is-active' : ''}`}>
            <img src={POSTERS[project.id] ?? project.cover} alt="" />
            <div><p>{project.blurb}</p><span>{project.year}, {project.industry || 'Design'}</span></div>
          </Link>
        )}</div>
      </aside>
    </div>
    <div className="work-gallery" ref={gallery}>{projects.map((project, index) =>
      <article key={project.id} data-project data-project-id={project.id} id={`selected-${project.id}`} className={`work-project${index === active ? ' is-active' : ''}`}>
        <ProjectVisual project={project} motion={motion} suspended={suspended}/>
        <div className="project-mobile-info"><Link href={`/work/${project.id}`} data-home-project-link={project.id} data-project-title={project.title} data-no-route-transition><h3>{project.title}</h3><p>{project.blurb}</p><Arrow diagonal /></Link><span>{project.year}, {project.industry || 'Design'}</span></div>
      </article>
    )}</div>
  </section>;
}

export function PortfolioHome({ projects }: { projects: PortfolioProject[] }) {
  const [motion, setMotion] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setMotion(!preference.matches);
    const visibility = () => setPageVisible(!document.hidden);
    sync();
    visibility();
    preference.addEventListener('change', sync);
    document.addEventListener('visibilitychange', visibility);
    return () => { preference.removeEventListener('change', sync); document.removeEventListener('visibilitychange', visibility); };
  }, []);

  return <div className="portfolio-home">
    <SiteHeader />
    <main id="main-content">
      <section className="portfolio-intro" aria-labelledby="intro-title">
        <div className="portfolio-intro-title">
          <h1 id="intro-title">I’m James Kordic</h1>
          <p>Graphic &amp; Motion Designer</p>
        </div>
        <div className="portfolio-intro-copy">
          <p>I create motion graphics, social campaigns, and visual identities for music, entertainment, and brands.</p>
          <p className="portfolio-intro-credit">Selected work for Guns N’ Roses, Taco Bell, FX, and more. Based in New York.</p>
        </div>
      </section>
      <FeaturedWork projects={projects} motion={motion} suspended={!pageVisible}/>
    </main>
    <PageFooter />
  </div>;
}
