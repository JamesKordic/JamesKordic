import type { Metadata } from 'next';
import './globals.css';
import { PlayerProvider } from '@/lib/player-context';
import { LightboxProvider } from '@/lib/lightbox-context';
import { AppShell } from '@/components/app-shell';

export const metadata: Metadata = {
  title: 'James Kordic — Graphic & Motion Designer',
  description:
    'New York-based Graphic & Motion Designer. Work for Taco Bell, FX, MNRK Heavy, Consensus by CoinDesk, and The Syndicate.',
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
