/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Preloader component — Noise-to-Signal countdown and curtain reveal.
 * Synchronizes with AppOrchestrator and emits global app:ready signal.
 */

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { orchestrator } from '../core/AppOrchestrator';
import { prefersReducedMotion } from '../utils/media';

export const Preloader: React.FC = () => {
  const [percent, setPercent] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('RESOLVING NOISE PATTERNS');
  const [isDone, setIsDone] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    if (prefersReducedMotion()) return true;
    return sessionStorage.getItem('sm_preloader_seen') === 'true';
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If already seen or prefers reduced motion, mark ready immediately
    if (isDone) {
      orchestrator.markReady();
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const counterObj = { val: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        // Mark session as visited
        try {
          sessionStorage.setItem('sm_preloader_seen', 'true');
        } catch {
          // Ignore private browsing storage restrictions
        }

        // Curtain reveal exit
        gsap.to(container, {
          yPercent: -100,
          duration: 0.75,
          ease: 'power3.inOut',
          onStart: () => {
            // Signal entrance animations to commence as curtain lifts
            orchestrator.markReady();
          },
          onComplete: () => {
            setIsDone(true);
          },
        });
      },
    });

    tl.to(counterObj, {
      val: 100,
      duration: 1.15,
      ease: 'power2.inOut',
      onUpdate: () => {
        const current = Math.floor(counterObj.val);
        setPercent(current);

        if (current < 35) {
          setStatusText('RESOLVING NOISE PATTERNS');
        } else if (current < 75) {
          setStatusText('CALIBRATING VIEWPORT MATRICES');
        } else if (current < 100) {
          setStatusText('LOCKING COHERENT SIGNAL');
        } else {
          setStatusText('SIGNAL COHERENT — READY');
        }

        if (progressLineRef.current) {
          gsap.set(progressLineRef.current, { scaleX: current / 100 });
        }
      },
    });

    // Support ESC key to skip preloader
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        tl.progress(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      tl.kill();
    };
  }, [isDone]);

  if (isDone) {
    return null;
  }

  return (
    <aside
      ref={containerRef}
      className="fixed inset-0 z-[99999] flex flex-col justify-between bg-zinc-950 text-zinc-100 p-6 sm:p-10 select-none overflow-hidden"
      role="status"
      aria-live="polite"
      aria-label="Application loading"
    >
      {/* Top Header metadata */}
      <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="tracking-wider uppercase font-semibold text-zinc-200">
            Shivank Maurya // Portfolio
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-zinc-500">
          <span>LKO, IN (UTC+5:30)</span>
          <span>EST. 2026</span>
        </div>
      </div>

      {/* Center Counter and Signal Status */}
      <div className="flex flex-col items-center justify-center my-auto space-y-6 text-center">
        <div className="space-y-1">
          <p className="text-xs font-mono text-indigo-400 tracking-widest uppercase">
            {statusText}
          </p>
          <div className="font-display font-bold text-7xl sm:text-9xl text-white tracking-tighter tabular-nums">
            {percent.toString().padStart(2, '0')}
            <span className="text-3xl sm:text-5xl text-zinc-500 font-mono font-normal ml-1">
              %
            </span>
          </div>
        </div>

        {/* Hairline Progress Bar */}
        <div className="w-full max-w-xs sm:max-w-md h-[2px] bg-zinc-900 rounded-full overflow-hidden relative">
          <div
            ref={progressLineRef}
            className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400 origin-left scale-x-0"
          />
        </div>
      </div>

      {/* Bottom Footer metadata and skip prompt */}
      <div className="flex items-center justify-between text-xs font-mono text-zinc-500 border-t border-zinc-800/80 pt-4">
        <span>CORE // MERN + DISTRIBUTED SYSTEMS</span>
        <button
          onClick={() => {
            setIsDone(true);
            orchestrator.markReady();
          }}
          className="hover:text-zinc-200 transition-colors cursor-pointer text-zinc-400 focus:outline-none"
        >
          [Press ESC to Skip]
        </button>
      </div>
    </aside>
  );
};

export default Preloader;
