/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Marquee — Infinite smooth technical ticker.
 * Displays continuous architectural telemetry and stack competencies
 * with hardware-accelerated CSS transforms and hover pause.
 */

import React from 'react';
import { prefersReducedMotion } from '../utils/media';

export interface MarqueeProps {
  items: string[];
  speed?: number; // duration in seconds
  reverse?: boolean;
  className?: string;
}

export const Marquee: React.FC<MarqueeProps> = ({
  items,
  speed = 28,
  reverse = false,
  className = '',
}) => {
  const isReduced = prefersReducedMotion();

  return (
    <div
      className={`relative w-full overflow-hidden select-none py-3 border-y border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50 ${className}`}
      aria-hidden="true"
    >
      {/* Side gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white dark:from-zinc-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white dark:from-zinc-950 to-transparent z-10 pointer-events-none" />

      <div
        className={`flex items-center gap-8 whitespace-nowrap will-change-transform ${
          !isReduced ? (reverse ? 'animate-marquee-reverse' : 'animate-marquee') : ''
        }`}
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {/* First track */}
        <div className="flex items-center gap-8 shrink-0">
          {items.map((item, idx) => (
            <div key={`track1-${idx}`} className="flex items-center gap-4 text-xs font-mono font-medium text-zinc-500 dark:text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span className="tracking-wider uppercase">{item}</span>
            </div>
          ))}
        </div>

        {/* Duplicate track for seamless infinite loop */}
        <div className="flex items-center gap-8 shrink-0">
          {items.map((item, idx) => (
            <div key={`track2-${idx}`} className="flex items-center gap-4 text-xs font-mono font-medium text-zinc-500 dark:text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span className="tracking-wider uppercase">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
