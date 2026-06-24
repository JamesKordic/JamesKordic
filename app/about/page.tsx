import { redirect } from 'next/navigation';

// About now lives as a section on the single-page home (matching the
// reference design). Keep the old route working by sending it to the anchor.
export default function AboutPage() {
  redirect('/#about');
}
