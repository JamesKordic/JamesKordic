import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { PageFooter } from '@/components/page-footer';
import { SITE_TEXT } from '@/lib/site-text';

const SHARE_CARD = { url: '/opengraph-image.png', width: 1200, height: 630, alt: 'James Kordic — Graphic & Motion Designer' };
const ABOUT_DESC = 'James Kordic is a New York-based graphic and motion designer working across music, entertainment, and live experiences.';
export const metadata: Metadata = {
  title: 'About',
  description: ABOUT_DESC,
  alternates: { canonical: '/about' },
  openGraph: { type: 'profile', title: 'About — James Kordic', description: ABOUT_DESC, url: '/about', images: [SHARE_CARD] },
  twitter: { card: 'summary_large_image', title: 'About — James Kordic', description: ABOUT_DESC, images: [SHARE_CARD] },
};
export default function AboutPage() {
  return <><SiteHeader /><main id="main-content" className="portfolio-container about-page"><section className="about-hero"><div><p className="eyebrow">About James / New York, NY</p><h1>From first idea<br />to final export<span className="accent-period">.</span></h1><p className="about-lead">I’m a graphic and motion designer working across music, entertainment, and live experiences.</p><p>My work connects campaign design with the practical details of bringing it into the world—from social templates and motion to print and event graphics.</p><p>Outside of design, I’m usually playing guitar or photographing the world around me.</p><a className="text-link" href={SITE_TEXT.contact.resumeUrl} target="_blank" rel="noopener noreferrer">Read my résumé ↗</a></div><figure><img src="/about/headshot.jpg" alt="James Kordic" width={1578} height={2070} /><figcaption>Graphic design. Motion. A little photography.</figcaption></figure></section>
    <section className="about-section"><h2>Experience</h2><div className="experience-list"><article><div><h3>THE·TEAM</h3><p>Multidisciplinary Design Consultant</p></div><span className="eyebrow">Apr — May 2026</span></article><article><div><h3>The Syndicate</h3><p>Freelance Graphic & Motion Designer</p></div><span className="eyebrow">May 2025 — Mar 2026</span></article><article><div><h3>The Syndicate</h3><p>Video, Motion, Design & Content Intern</p></div><span className="eyebrow">Aug 2024 — May 2025</span></article><article><div><h3>Rochester Institute of Technology</h3><p>Visual Designer</p></div><span className="eyebrow">Oct 2022 — May 2025</span></article></div></section>
    <section className="about-section"><h2>Practice</h2><div className="practice-grid"><p>Campaign design<br />Brand identity & layout<br />Motion graphics & video editing<br />Print & event production</p><p>Adobe Creative Suite<br />Figma<br />Blender & Maya<br />Photography</p></div></section>
    <section className="about-section"><h2>Education</h2><div><h3>Rochester Institute of Technology</h3><p>BFA, Graphic Design · 2025<br />Minor in Photography</p></div></section>
    <section className="about-section"><h2>Get in touch</h2><div><p>Available for freelance projects and full-time design roles.</p><a className="text-link" href={`mailto:${SITE_TEXT.contact.email}`}>{SITE_TEXT.contact.email.toLowerCase()} ↗</a></div></section>
  </main><PageFooter /></>;
}
