import type { Metadata } from 'next';
import { ContactScreen } from '@/components/contact-screen';
export const metadata: Metadata = { title: 'Contact', description: 'Work with James Kordic — graphic and motion design, based in New York.' };
export default function ContactPage(){return <ContactScreen/>;}
