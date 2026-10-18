import type { Media, Project } from './projects';

const PREVIEW_POSTERS: Record<string, string> = {
  voltage: '/projects/voltage/citrus-distortion/01-campaign-hero.jpg',
  'the-syndicate': '/posters/the-syndicate-sizzle-reel.jpg',
};

export function getProjectPreviewPoster(project: Pick<Project, 'id' | 'cover'>): string {
  return PREVIEW_POSTERS[project.id] ?? project.cover;
}

/** Keep homepage cards, project heroes, and next-project previews on the same media. */
export function getProjectPreview(project: Pick<Project, 'id' | 'title' | 'cover' | 'carouselVideo'>): Media {
  const poster = getProjectPreviewPoster(project);
  return project.carouselVideo
    ? { type: 'video', src: project.carouselVideo, poster, aspect: '16/9' }
    : { type: 'image', src: poster, alt: `${project.title} campaign` };
}
