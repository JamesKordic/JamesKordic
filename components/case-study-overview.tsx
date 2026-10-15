import type { Project } from '@/lib/projects';
import { CASE_STUDY_SECTIONS, type CaseStudyStory } from '@/lib/case-study-stories';

export function CaseStudyOverview({ project, story }: { project: Project; story: CaseStudyStory }) {
  return (
    <>
      <div id="introduction" className="case-study-project-details">
        <dl className="case-study-overview-details">
          <div>
            <dt>Date</dt>
            <dd>{project.date || project.year}</dd>
          </div>
          <div>
            <dt>My role</dt>
            <dd>{project.role}</dd>
          </div>
        </dl>
      </div>
      {CASE_STUDY_SECTIONS.map(({ id, title, key }) => (
        <section key={id} id={id} className="case-study-section case-study-overview-section" aria-labelledby={`${id}-heading`}>
          <h2 id={`${id}-heading`}>{title}</h2>
          <p>{story[key]}</p>
        </section>
      ))}
    </>
  );
}
