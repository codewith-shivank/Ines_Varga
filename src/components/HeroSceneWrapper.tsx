/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HeroSceneWrapper — Thin React mount for the framework-agnostic Three.js HeroScene.
 * Positions and syncs the 3D Noise-to-Signal crystal on the unified GlobalCanvas.
 * Manages pointer interaction, StrictMode cleanup, and CSS 2D fallback.
 */

import React, { useEffect, useRef, useState } from 'react';
import { HeroScene } from '../three/HeroScene';
import { isWebGLSupported } from '../utils/media';

export const HeroSceneWrapper: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroSceneRef = useRef<HeroScene | null>(null);
  const [hasWebGLError, setHasWebGLError] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!isWebGLSupported()) {
      setHasWebGLError(true);
      return;
    }

    try {
      heroSceneRef.current = new HeroScene({
        container: containerRef.current,
      });
    } catch (err) {
      console.warn('HeroScene WebGL fallback triggered:', err);
      setHasWebGLError(true);
    }

    return () => {
      heroSceneRef.current?.dispose();
      heroSceneRef.current = null;
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current || !heroSceneRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    heroSceneRef.current.setPointer(x, y);
  };

  const handlePointerLeave = () => {
    heroSceneRef.current?.setPointer(0, 0);
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full h-full min-h-[320px] lg:min-h-[440px] flex items-center justify-center touch-none select-none"
      aria-hidden="true"
    >
      {/* Ambient background glow behind 3D crystal */}
      <div className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 blur-3xl pointer-events-none" />
      <div className="absolute w-48 h-48 rounded-full bg-violet-500/8 dark:bg-violet-500/10 blur-3xl pointer-events-none translate-x-12 -translate-y-8" />

      {/* Graceful CSS 2D Fallback if WebGL unavailable */}
      {hasWebGLError && (
        <div className="relative w-48 h-48 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 backdrop-blur-md flex items-center justify-center shadow-2xl">
          <div className="w-24 h-24 rounded-xl border border-indigo-400/40 rotate-45 animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default HeroSceneWrapper;
