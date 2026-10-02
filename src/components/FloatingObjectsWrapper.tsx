/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FloatingObjectsWrapper — Thin React mount for the Three.js FloatingObjects scene.
 * Visualizes interactive engineering polyhedra in the Technical Skills section.
 */

import React, { useEffect, useRef, useState } from 'react';
import { FloatingObjects } from '../three/FloatingObjects';
import { isWebGLSupported } from '../utils/media';

interface FloatingObjectsWrapperProps {
  activeCategory: string;
}

export const FloatingObjectsWrapper: React.FC<FloatingObjectsWrapperProps> = ({ activeCategory }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<FloatingObjects | null>(null);
  const [hasWebGLError, setHasWebGLError] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    if (!isWebGLSupported(canvasRef.current)) {
      setHasWebGLError(true);
      return;
    }

    try {
      sceneRef.current = new FloatingObjects({
        container: containerRef.current,
        canvas: canvasRef.current,
      });
      sceneRef.current.setCategory(activeCategory);
    } catch (err) {
      console.warn('FloatingObjects WebGL fallback engaged:', err);
      setHasWebGLError(true);
    }

    return () => {
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.setCategory(activeCategory);
  }, [activeCategory]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current || !sceneRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    sceneRef.current.setPointer(x, y);
  };

  const handlePointerLeave = () => {
    sceneRef.current?.setPointer(0, 0);
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full h-44 sm:h-52 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 overflow-hidden flex items-center justify-center select-none"
      aria-hidden="true"
    >
      {/* Top telemetry tag */}
      <div className="absolute top-3 left-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest pointer-events-none flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
        <span>SYS.PILLARS // INTERACTIVE TOPOLOGY</span>
      </div>

      <div className="absolute top-3 right-4 text-[10px] font-mono text-zinc-500 uppercase tracking-wider pointer-events-none">
        FOCUS: [{activeCategory.toUpperCase()}]
      </div>

      {/* WebGL Canvas */}
      {!hasWebGLError ? (
        <canvas
          ref={canvasRef}
          className="w-full h-full block pointer-events-none"
        />
      ) : (
        /* CSS Fallback */
        <div className="flex items-center gap-6 text-zinc-400 font-mono text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/60 border border-zinc-700/60">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <span>UI ENGINE</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/60 border border-zinc-700/60">
            <span className="w-2 h-2 rounded-full bg-violet-400" />
            <span>DISTRIBUTED CORE</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/60 border border-zinc-700/60">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span>DATA MATRIX</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingObjectsWrapper;
