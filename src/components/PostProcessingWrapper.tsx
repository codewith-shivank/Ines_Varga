/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PostProcessingWrapper — Thin React mount for the Three.js PostProcessing pipeline.
 * Fixed non-blocking optical shader layer that renders responsive Noise-to-Signal telemetry grain.
 */

import React, { useEffect, useRef } from 'react';
import { PostProcessing } from '../three/PostProcessing';
import { isWebGLSupported } from '../utils/media';

export const PostProcessingWrapper: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pipelineRef = useRef<PostProcessing | null>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    if (!isWebGLSupported(canvasRef.current)) {
      return;
    }

    try {
      pipelineRef.current = new PostProcessing({
        container: containerRef.current,
        canvas: canvasRef.current,
      });
    } catch (err) {
      console.warn('PostProcessing pipeline fallback engaged:', err);
    }

    return () => {
      pipelineRef.current?.dispose();
      pipelineRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-30 overflow-hidden"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
};

export default PostProcessingWrapper;
