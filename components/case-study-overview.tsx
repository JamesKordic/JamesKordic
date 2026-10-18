import type { Project } from '@/lib/projects';
import { getProjectIntroduction } from '@/lib/project-introduction';

export function CaseStudyOverview({ project }: { project: Project }) {
  const introduction = getProjectIntroduction(project);

  return (
    <div id="introduction" className="case-study-overview">
      <section className="case-study-text-body" aria-labelledby="overview-heading">
        <h2 id="overview-heading" className="case-study-overline">Overview</h2>
        <p>{introduction.overview}</p>
      </section>
      <section className="case-study-text-body" aria-labelledby="role-heading">
        <h2 id="role-heading" className="case-study-overline">My role</h2>
        <p>{introduction.role}</p>
      </section>
    </div>
  );
}
