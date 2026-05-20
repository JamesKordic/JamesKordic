'use client';

import { createContext, useContext, RefObject, ReactNode } from 'react';

const ScrollContext = createContext<RefObject<HTMLDivElement> | null>(null);

export function ScrollProvider({
  value,
  children,
}: {
  value: RefObject<HTMLDivElement>;
  children: ReactNode;
}) {
  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
}

export function useScroll() {
  return useContext(ScrollContext);
}
