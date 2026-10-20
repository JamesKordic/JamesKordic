import { PortfolioHome } from '@/components/portfolio-home';
import { PROJECTS } from '@/lib/projects';

export default function HomePage() {
  // Send only the homepage metadata, not all case-study media, to the browser.
  const projects = PROJECTS.map(({ id, title, cover, coverAlt, coverFit, carouselVideo, themeColor, blurb, work, desc }) => ({
    id, title, cover, coverAlt, coverFit, carouselVideo, themeColor, blurb, work, desc,
  }));
  return <PortfolioHome projects={projects} />;
}
