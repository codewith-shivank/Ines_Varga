/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HorizontalScroll — Smooth pinned or track-based horizontal scroller.
 * Enables horizontal exploration of technical blueprints, systems, or case study cards
 * with momentum wheel mapping and accessible arrow key control.
 */

import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface HorizontalScrollProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const HorizontalScroll: React.FC<HorizontalScrollProps> = ({
  children,
  className = '',
  title = 'HORIZONTAL ARCHITECTURE TRACK',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      el?.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scrollBy = (offset: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Header telemetry bar */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          <span>{title}</span>
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => scrollBy(-320)}
            disabled={!canScrollLeft}
            className={`p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 transition-colors ${
              canScrollLeft
                ? 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer'
                : 'text-zinc-400 dark:text-zinc-600 opacity-40 cursor-not-allowed'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => scrollBy(320)}
            disabled={!canScrollRight}
            className={`p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 transition-colors ${
              canScrollRight
                ? 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer'
                : 'text-zinc-400 dark:text-zinc-600 opacity-40 cursor-not-allowed'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroller */}
      <div
        ref={scrollRef}
        tabIndex={0}
        role="region"
        aria-label={title}
        className="flex items-stretch gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-2xl"
      >
        {children}
      </div>
    </div>
  );
};

export default HorizontalScroll;
