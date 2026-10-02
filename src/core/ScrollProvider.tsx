/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ScrollProvider — React context provider exposing Lenis and ScrollTrigger synchronization.
 */

import React, { createContext, useContext, useEffect, useMemo } from 'react';
import Lenis from 'lenis';
import { scrollService } from './Scroll';
import { on } from '../utils/dom';

interface ScrollContextValue {
  lenis: Lenis | null;
  scrollTo: (
    target: string | number | HTMLElement,
    options?: {
      offset?: number;
      immediate?: boolean;
      duration?: number;
      onComplete?: () => void;
    }
  ) => void;
  refresh: () => void;
}

const ScrollContext = createContext<ScrollContextValue>({
  lenis: null,
  scrollTo: () => {},
  refresh: () => {},
});

export const useScroll = (): ScrollContextValue => useContext(ScrollContext);

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const lenisInstance = scrollService.init();

    // Debounced refresh on window resize
    const cleanResize = on(window, 'resize', () => {
      scrollService.refresh();
    });

    // Refresh after fonts are verified rendered
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        scrollService.refresh();
      });
    }

    return () => {
      cleanResize();
      scrollService.destroy();
    };
  }, []);

  const contextValue = useMemo<ScrollContextValue>(
    () => ({
      lenis: scrollService.lenis,
      scrollTo: (target, options) => scrollService.scrollTo(target, options),
      refresh: () => scrollService.refresh(),
    }),
    []
  );

  return <ScrollContext.Provider value={contextValue}>{children}</ScrollContext.Provider>;
};
