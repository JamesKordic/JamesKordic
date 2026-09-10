import Link from 'next/link';
import type { Project } from '@/lib/projects';
import { PROJECT_PRESENTATION, TACO_ARTISTS } from '@/lib/portfolio';

export function HomeProjectIndex({ projects }: { projects: Project[] }) {
  return <div className="project-grid">{projects.map((project, index) => {
    const detail = PROJECT_PRESENTATION[project.id];
    return <article key={project.id} className={`project-card ${index === 0 ? 'project-card-featured' : ''}`}><Link href={`/work/${project.id}`} className="project-card-link">
      {project.id === 'taco-bell' ? <div className="campaign-cover">{TACO_ARTISTS.map(artist => <img key={artist.name} src={artist.src} alt={`Feed the Beat artist campaign: ${artist.name}`} width={800} height={1422} loading="eager" />)}</div> : <div className="project-card-image"><img src={project.id === 'the-syndicate' ? '/projects/the-syndicate/mnrk-heavy-social-mockup.png' : project.cover} alt={`${detail.title} — ${detail.caption}`} loading="lazy" width={1200} height={800} /></div>}
      <div className="project-card-caption"><div><p className="eyebrow">{String(index + 1).padStart(2, '0')} / {detail.discipline}</p><h3>{detail.title}</h3><p>{detail.caption}</p></div><span className="project-arrow" aria-hidden="true">↗</span></div>
    </Link></article>;
  })}</div>;
}
