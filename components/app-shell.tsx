'use client';

import { ReactNode } from 'react';
import { Lightbox } from './lightbox';
import { RouteTransitions } from './route-transitions';
import { SmoothScroll } from './smooth-scroll';
import { NextProjectTransition } from './next-project-transition';

/**
 * Site shell. Every page — home, project, contact and the 404 — brings its
 * own header, gutters and footer, so the shell only adds what's shared across
 * all of them: the image lightbox and optional native route transitions.
 *
 * (It used to wrap "other" routes in a header and gutters by pathname. That
 * broke the 404 page whenever it rendered under a path the shell skipped,
 * such as a missing project at /work/…, leaving it pressed to the left edge.)
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <RouteTransitions />
      <NextProjectTransition />
      {children}
      <Lightbox />
    </>
  );
}
