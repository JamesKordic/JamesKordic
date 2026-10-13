import { PortfolioHome } from '@/components/portfolio-home';
import { PROJECTS } from '@/lib/projects';

export default function HomePage() {
  // Send only the homepage metadata, not all case-study media, to the browser.
  const projects = PROJECTS.map(({ id, title, cover, carouselVideo, themeColor, blurb, work, desc, year }) => ({
    id, title, cover, carouselVideo, themeColor, blurb, work, desc, year,
  }));
  return <PortfolioHome projects={projects} />;
}
