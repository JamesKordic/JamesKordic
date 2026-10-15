import { notFound } from 'next/navigation';
import { PROJECTS, getProject } from '@/lib/projects';
import { getProjectPresentation } from '@/lib/project-presentation';
import { CASE_STUDY_SECTIONS, getCaseStudyStory } from '@/lib/case-study-stories';
import { CaseStudyOverview } from '@/components/case-study-overview';
import { CaseStudyGallery, CaseStudyMedia } from '@/components/case-study-media';
import { CaseStudyNavigation } from '@/components/case-study-navigation';
import { NextProject } from '@/components/next-project';
import { SiteHeader } from '@/components/site-header';
import { SITE_TEXT } from '@/lib/site-text';
import '@/app/case-study.css';

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = getProject(params.slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.desc.slice(0, 160),
  };
}

/**
 * Project page — a case study read top to bottom: the project named over its
 * headline, its write-up, the work itself, and the projects either side.
 *
 * Not every project carries every part — `brief`, `approach`, and `recap` are
 * optional in the data, and a project with only sections still reads as a
 * complete page.
 */
export default function ProjectPage({ params }: { params: { slug: string } }) {
  const p = getProject(params.slug);
  if (!p) notFound();

  const idx = PROJECTS.findIndex((x) => x.id === p.id);
  const next = PROJECTS[(idx + 1) % PROJECTS.length];
  const story = getCaseStudyStory(p);
  const { hero, gallerySections, archive } = getProjectPresentation(p);
  const nextHero = getProjectPresentation(next).hero;
  const archiveLabel = p.id === 'adults' ? 'What I worked on' : 'View full campaign archive';

  const category = p.industry || p.tags[0];
  const sectionLinks = [
    ...CASE_STUDY_SECTIONS.map(({ id, title }) => ({ id, title })),
    ...gallerySections.map((section, index) => ({ id: `project-section-${index + 1}`, title: section.title })),
    ...(archive.length ? [{ id: 'campaign-archive', title: 'Campaign archive' }] : []),
  ];

  return (
    <div className="case-study-page">
      <SiteHeader overlay />
      <main className="case-study-layout">
        <CaseStudyNavigation title={p.title} blurb={p.blurb} category={category} year={p.year} sections={sectionLinks} />
        <div className="case-study-content">
          <CaseStudyMedia media={hero} hero />
          <div className="case-study-mobile-title">
            <h1>{p.title}</h1>
            <p>{p.blurb}</p>
            <div className="case-study-tags"><span>{category}</span><i aria-hidden="true" /><span>{p.year}</span></div>
          </div>
          <CaseStudyOverview project={p} story={story} />

          {gallerySections.map((section, index) => (
            <section key={`${section.title}-${index}`} id={`project-section-${index + 1}`} className="case-study-section">
              <div className={`case-study-text-section${section.context || section.body || section.role ? '' : ' case-study-text-section--compact'}`}>
                <div className="case-study-text-label"><h2 className="case-study-overline">{section.title}</h2></div>
                {(section.context || section.body || section.role) && (
                  <div className="case-study-text-body">
                    {section.context && <p>{section.context}</p>}
                    {section.body && section.body.split('\n\n').map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
                    {section.role && <p>{section.role}</p>}
                  </div>
                )}
              </div>
              <CaseStudyGallery section={section} />
            </section>
          ))}

          {archive.length > 0 && (
            <details id="campaign-archive" className="case-study-archive">
              <summary><span>{archiveLabel}</span><span aria-hidden="true">+</span></summary>
              {archive.map((section, index) => (
                <section key={`${section.title}-${index}`} className="case-study-section">
                  <div className="case-study-text-section case-study-text-section--compact"><h2 className="case-study-overline">{section.title}</h2></div>
                  <CaseStudyGallery section={section} />
                </section>
              ))}
            </details>
          )}

          {p.id === 'voltage' && (
            <p className="case-study-disclosure">Self-initiated concept · 2026 · AI-assisted imagery. Packaging, merchandise and campaign placements are proposed design visualizations.</p>
          )}
          {p.id === 'the-syndicate' && (
            <p className="case-study-further">Want to see more? <a href={`mailto:${SITE_TEXT.contact.email}`}>Get in touch.</a></p>
          )}
        </div>
      </main>
      <NextProject id={next.id} title={next.title} blurb={next.blurb} hero={nextHero} />
    </div>
  );
}
