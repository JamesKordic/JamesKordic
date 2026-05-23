import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PlayerProvider } from '@/lib/player-context';
import { LightboxProvider } from '@/lib/lightbox-context';
import { AppShell } from '@/components/app-shell';

export const metadata: Metadata = {
  title: 'James Kordic — Graphic & Motion Designer',
  description:
    'New York-based Graphic & Motion Designer. Work for Taco Bell, FX, MNRK Heavy, Consensus by CoinDesk, and The Syndicate.',
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
