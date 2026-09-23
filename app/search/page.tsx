import { redirect } from 'next/navigation';

/** The old Browse page. Preserve bookmarks; the project index now lives on
 *  the homepage. */
export default function SearchPage() {
  redirect('/#work');
}
