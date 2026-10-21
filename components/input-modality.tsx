'use client';

import { useEffect } from 'react';

/** Keep native dialog focus without painting keyboard rings after a tap. */
export function InputModality() {
  useEffect(() => {
    const root = document.documentElement;
    const onPointerDown = () => { root.dataset.inputModality = 'pointer'; };
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.metaKey && !event.ctrlKey && !event.altKey) {
        root.dataset.inputModality = 'keyboard';
      }
    };
    const onClick = (event: MouseEvent) => {
      // Assistive technology can activate controls without a preceding keydown.
      if (event.detail === 0) root.dataset.inputModality = 'keyboard';
    };

    // Capture runs before the menu opens and native dialog autofocus takes over.
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('click', onClick, true);
      delete root.dataset.inputModality;
    };
  }, []);

  return null;
}
