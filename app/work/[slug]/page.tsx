import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PROJECTS, getProject, ARTIST } from '@/lib/projects';
import { getEditorial } from '@/lib/editorial';
import { PROJECT_PRESENTATION, SELECTED_PROJECTS } from '@/lib/portfolio';
import { CaseSection } from '@/components/case-section';
import { SiteHeader } from '@/components/site-header';
import { PageFooter } from '@/components/page-footer';

/* The share card lives at app/opengraph-image.png and is attached to the
 * root segment. A child route that sets its own `openGraph` replaces the
 * parent's whole block, so it has to be named again here or shared links
 * to case studies render with no image. */
const SHARE_CARD = { url: '/opengraph-image.png', width: 1200, height: 630, alt: `${ARTIST} — Graphic & Motion Designer` };

export async function generateStaticParams() { return PROJECTS.map(p => ({ slug: p.id })); }
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = getProject(params.slug);
  if (!p) return {};
  const detail = PROJECT_PRESENTATION[p.id];
  const url = `/work/${p.id}`;
  return {
    title: detail.title,
    description: detail.intro,
    alternates: { canonical: url },
    openGraph: { type: 'article', title: `${detail.title} — ${ARTIST}`, description: detail.intro, url, images: [SHARE_CARD] },
    twitter: { card: 'summary_large_image', title: `${detail.title} — ${ARTIST}`, description: detail.intro, images: [SHARE_CARD] },
  };
}
export default function ProjectPage({ params }: { params: { slug: string } }) {
  const p = getProject(params.slug);
  if (!p) notFound();
  const detail = PROJECT_PRESENTATION[p.id];
  const story = getEditorial(p);
  const index = SELECTED_PROJECTS.findIndex(project => project.id === p.id);
  const next = SELECTED_PROJECTS[(index + 1) % SELECTED_PROJECTS.length];
  return <><SiteHeader /><main id="main-content" className={`portfolio-container case-study case-${p.id}`}>
    <header className="case-intro"><Link className="text-link case-back" href="/#work">← All work</Link><p className="eyebrow">{detail.title} {p.kind === 'personal' ? ' / Independent concept' : ''}</p><h1>{detail.headline.split('\n').map((line, i) => <span key={line}>{i > 0 && <br />}{line}</span>)}</h1><p className="case-deck">{detail.intro}</p><dl className="case-meta"><div><dt>Contribution</dt><dd>{detail.discipline.replace(' / ', ' · ')}</dd></div><div><dt>{p.kind === 'personal' ? 'Context' : 'Agency'}</dt><dd>{p.kind === 'personal' ? 'RIT senior capstone' : 'The Syndicate'}</dd></div><div><dt>Year</dt><dd>{p.year}</dd></div></dl></header>
    <div className="case-hero"><CaseSection section={story.hero} showHeading={false} /></div>
    <section className="case-context"><div><h2 className="eyebrow">The brief</h2><p>{story.brief}</p></div><div><h2 className="eyebrow">My contribution</h2><p>{story.role}</p></div></section>
    {p.id === 'taco-bell' && <section className="template-section"><div><p className="eyebrow">Inside the system</p><h2>Fixed structure.<br />Room for the artist.</h2></div><dl><div><dt>01 / Recognition</dt><dd>The Feed the Beat lockup and brand graphics anchor each composition.</dd></div><div><dt>02 / Individuality</dt><dd>Photography, crop, and color give each artist a distinct presence within the shared layout.</dd></div><div><dt>03 / Repetition</dt><dd>A consistent artist-name zone and vertical format make the template reusable across the roster.</dd></div></dl></section>}
    {story.sections.map((section, i) => <CaseSection key={`${section.title}-${i}`} section={section} />)}
    <section className="case-credits"><div><h2 className="eyebrow">Delivery</h2><p>{story.delivery}</p></div><div><h2 className="eyebrow">Credits & scope</h2><p>{story.credits}</p>{story.tooling && <p className="tooling-note">{story.tooling}</p>}</div></section>
    {story.archive.length > 0 && <details className="project-archive"><summary><span>Everything else from this project</span><span className="archive-plus" aria-hidden="true">+</span></summary><div>{story.archive.map((section, i) => <CaseSection key={`${section.title}-${i}`} section={section} />)}</div></details>}
    <nav className="next-project" aria-label="Project navigation"><Link href="/#work" className="text-link">← All work</Link><Link href={`/work/${next.id}`}><span className="eyebrow">Next project</span><span className="next-project-title">{PROJECT_PRESENTATION[next.id].title} <span aria-hidden="true">↗</span></span></Link></nav>
  </main><PageFooter /></>;
}
