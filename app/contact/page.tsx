import type { Metadata } from 'next';
import { ContactScreen } from '@/components/contact-screen';
import { SITE_TEXT } from '@/lib/site-text';

const description = 'Work with James Kordic — graphic and motion design, based in New York.';

export const metadata: Metadata = {
  title: 'Contact',
  description,
  openGraph: {
    title: `Contact — ${SITE_TEXT.artist.name}`,
    description,
    siteName: SITE_TEXT.artist.name,
    type: 'website',
  },
};
export default function ContactPage(){return <ContactScreen/>;}
