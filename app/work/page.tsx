import { redirect } from 'next/navigation';

/** Preserve old bookmarks while the project index now lives on the homepage. */
export default function WorkPage() {
  redirect('/#work');
}
