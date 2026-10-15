import { redirect } from 'next/navigation';

/** Older work links now lead to the projects on the homepage. */
export default function WorkPage() {
  redirect('/#work');
}
