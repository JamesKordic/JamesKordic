import type { Metadata } from 'next';
import { AboutPortfolio } from '@/components/about-portfolio';
import { PROJECTS } from '@/lib/projects';

export const metadata: Metadata = { title: 'About', description: 'Meet James Kordic, a New York-based graphic and motion designer working across music, entertainment, food, and tech.' };
export default function AboutPage() { return <AboutPortfolio projects={PROJECTS.slice(0, 3)} />; }
