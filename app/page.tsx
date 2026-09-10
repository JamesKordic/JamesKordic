import Link from 'next/link';
import { HomeProjectIndex } from '@/components/home-project-index';
import { PageFooter } from '@/components/page-footer';
import { SiteHeader } from '@/components/site-header';
import { SELECTED_PROJECTS } from '@/lib/portfolio';

export default function HomePage() {
  return <><SiteHeader /><main id="main-content" className="portfolio-container">
    <section className="home-intro"><p className="eyebrow">James Kordic · Graphic & motion designer · New York</p><h1>Design for music<br />and entertainment<span className="accent-period">.</span></h1><div className="intro-bottom"><p>Campaign graphics, motion, and experiences.<br className="desktop-break" /> From the first idea to the final detail.</p><Link className="text-link" href="/about">A little about me <span aria-hidden="true">↗</span></Link></div></section>
    <section id="work" className="work-index" aria-labelledby="selected-work-heading"><div className="section-rule"><h2 id="selected-work-heading" className="eyebrow">Selected work</h2><span className="eyebrow">01 — 05</span></div><HomeProjectIndex projects={SELECTED_PROJECTS} /></section>
    <section className="home-about"><p className="eyebrow">Ideas into finished work</p><div><h2>A consistent idea.<br />Everywhere it appears.</h2><p>I work across graphic design, motion, and production, connecting what a campaign looks like with how it works in the real world.</p><Link href="/about" className="text-link">Experience & approach <span aria-hidden="true">↗</span></Link></div></section>
  </main><PageFooter /></>;
}
