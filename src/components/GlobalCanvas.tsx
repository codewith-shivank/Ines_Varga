/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GlobalCanvas — Mounts the single fixed WebGL canvas owned by SceneManager.
 * Runs behind content (pointer-events-none, z-0) with automatic CSS fallback.
 */

import React, { useEffect, useRef, useState } from 'react';
import { sceneManager } from '../three/SceneManager';
import { isWebGLSupported } from '../utils/media';

export const GlobalCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (!isWebGLSupported()) {
      setIsSupported(false);
      return;
    }

    const success = sceneManager.init(canvasRef.current);
    if (!success) {
      setIsSupported(false);
    }

    return () => {
      sceneManager.destroy();
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {isSupported ? (
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

export default GlobalCanvas;
