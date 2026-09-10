import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LightboxProvider } from '@/lib/lightbox-context';
import { AppShell } from '@/components/app-shell';
import { SITE_TEXT } from '@/lib/site-text';

/* `metadataBase` is what turns the relative icon/OG paths below into the
 * absolute URLs that Slack, LinkedIn, iMessage and X require. Without it,
 * a shared link renders as a bare grey card with no image. */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_TEXT.meta.siteUrl),
  title: {
    default: SITE_TEXT.meta.title,
    template: `%s — ${SITE_TEXT.artist.name}`,
  },
  description: SITE_TEXT.meta.description,
  applicationName: SITE_TEXT.artist.name,
  authors: [{ name: SITE_TEXT.artist.name, url: SITE_TEXT.meta.siteUrl }],
  creator: SITE_TEXT.artist.name,
  keywords: SITE_TEXT.meta.keywords,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE_TEXT.artist.name,
    title: SITE_TEXT.meta.title,
    description: SITE_TEXT.meta.description,
    url: SITE_TEXT.meta.siteUrl,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TEXT.meta.title,
    description: SITE_TEXT.meta.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

// Viewport config — REQUIRED for mobile browsers to render the page at the
// device's actual width. Without this, iOS/Android default to a 980px
// virtual viewport and zoom out to fit, causing horizontal overflow.
// Allow up to 5× zoom so visitors can enlarge text and artwork.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FAF9F6',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LightboxProvider>
          <AppShell>{children}</AppShell>
        </LightboxProvider>
      </body>
    </html>
  );
}
