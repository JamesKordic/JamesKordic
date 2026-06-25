import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PlayerProvider } from '@/lib/player-context';
import { LightboxProvider } from '@/lib/lightbox-context';
import { AppShell } from '@/components/app-shell';
import { SITE_TEXT } from '@/lib/site-text';

export const metadata: Metadata = {
  title: SITE_TEXT.meta.title,
  description: SITE_TEXT.meta.description,
};

// Viewport config — REQUIRED for mobile browsers to render the page at the
// device's actual width. Without this, iOS/Android default to a 980px
// virtual viewport and zoom out to fit, causing horizontal overflow.
// `maximum-scale: 1` prevents iOS Safari from auto-zooming on form input focus.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#08080c',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PlayerProvider>
          <LightboxProvider>
            <AppShell>{children}</AppShell>
          </LightboxProvider>
        </PlayerProvider>
      </body>
    </html>
  );
}
