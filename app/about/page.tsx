import { redirect } from 'next/navigation';

/** Keep older About links working after removing the page. */
export default function AboutPage() {
  redirect('/');
}
