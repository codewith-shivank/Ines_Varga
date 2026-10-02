/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * LEGACY ARCHIVE: BackgroundCanvasWrapper
 * Moved to legacy per engineering rules:
 * Replaced by the unified SceneManager single-canvas architecture (GlobalCanvas.tsx).
 */

import React, { useEffect, useRef, useState } from 'react';
import { BackgroundCanvas } from '../three/BackgroundCanvas';
import { isWebGLSupported } from '../utils/media';

export const BackgroundCanvasWrapper: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<BackgroundCanvas | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    if (!isWebGLSupported()) {
      setUseFallback(true);
      return;
    }

    try {
      sceneRef.current = new BackgroundCanvas({
        container: containerRef.current,
        canvas: canvasRef.current,
      });
    } catch (err) {
      console.warn('BackgroundCanvas fallback triggered:', err);
      setUseFallback(true);
    }

    return () => {
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30 dark:opacity-40 transition-opacity duration-500"
      aria-hidden="true"
    >
      {!useFallback ? (
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
        />
      ) : (
        <div className="w-full h-full bg-[radial-gradient(#6366f115_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />
      )}
    </div>
  );
};

export default BackgroundCanvasWrapper;
