/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CustomCursor — High-precision technical command center cursor.
 * Features dual-point tracking (zero-lag center dot + high-mass damped follower ring),
 * interactive targeting brackets, context-aware cursor labels, and touch-device suppression.
 */

import React, { useEffect, useRef, useState } from 'react';
import { isTouchDevice, prefersReducedMotion } from '../utils/media';

export type CursorMode = 'default' | 'pointer' | 'orbit' | 'view';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<CursorMode>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  // Position state for high-mass interpolation
  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isTouchDevice() || prefersReducedMotion()) {
      setIsTouch(true);
      return;
    }

    const handlePointerMove = (e: PointerEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;

      if (!isVisible) setIsVisible(true);

      // Instant dot positioning
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }

      // Detect hover target modes
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorAttr = target.closest('[data-cursor]')?.getAttribute('data-cursor');
      if (cursorAttr === 'orbit' || target.closest('canvas')) {
        setMode('orbit');
      } else if (cursorAttr === 'view') {
        setMode('view');
      } else if (
        cursorAttr === 'pointer' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.closest('input') ||
        target.closest('textarea')
      ) {
        setMode('pointer');
      } else {
        setMode('default');
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Smooth RAF follower loop with high-damping physical lerp
    const loop = () => {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.18;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      rafId.current = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    rafId.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [isVisible]);

  if (isTouch) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* 1. Precision Center Core Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -ml-1 -mt-1 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] will-change-transform"
      />

      {/* 2. Damped Follower Reticle */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 will-change-transform flex items-center justify-center transition-all duration-200 ${
          mode === 'pointer'
            ? '-ml-6 -mt-6 w-12 h-12 rounded-full border border-indigo-500/60 bg-indigo-500/10 backdrop-blur-[1px] scale-110'
            : mode === 'orbit'
            ? '-ml-7 -mt-7 w-14 h-14 rounded-full border border-dashed border-violet-400/70 bg-violet-500/10 rotate-45'
            : mode === 'view'
            ? '-ml-8 -mt-8 w-16 h-16 rounded-2xl border border-indigo-400/80 bg-indigo-500/15'
            : '-ml-4 -mt-4 w-8 h-8 rounded-full border border-zinc-400/40 dark:border-zinc-500/40'
        }`}
      >
        {/* Reticle micro-labels */}
        {mode === 'orbit' && (
          <span className="text-[9px] font-mono font-bold tracking-widest text-violet-400 -rotate-45">
            ORBIT
          </span>
        )}
        {mode === 'view' && (
          <span className="text-[9px] font-mono font-bold tracking-widest text-indigo-300">
            VIEW
          </span>
        )}
      </div>
    </div>
  );
};

export default CustomCursor;
