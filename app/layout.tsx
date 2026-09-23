import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LightboxProvider } from '@/lib/lightbox-context';
import { AppShell } from '@/components/app-shell';
import { SITE_TEXT } from '@/lib/site-text';

export const metadata: Metadata = {
  // Inner pages set just their own name ("Info", "Taco Bell") and the
  // template adds the rest.
  title: { default: SITE_TEXT.meta.title, template: `%s — ${SITE_TEXT.artist.name}` },
  description: SITE_TEXT.meta.description,
  openGraph: {
    title: SITE_TEXT.meta.title,
    description: SITE_TEXT.meta.description,
    siteName: SITE_TEXT.artist.name,
    type: 'website',
  },
};

// Viewport config — REQUIRED for mobile browsers to render the page at the
// device's actual width. Without this, iOS/Android default to a 980px
// virtual viewport and zoom out to fit, causing horizontal overflow.
// Pinch-zoom stays available (up to 5×) for anyone who needs it.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0A0A0A',
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
