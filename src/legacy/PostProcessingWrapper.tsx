/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * LEGACY ARCHIVE: PostProcessingWrapper
 * Moved from active tree per non-negotiables rule 3:
 * The fullscreen z-30 WebGL canvas overlay occluded DOM content and created conflicting WebGL contexts.
 * Replaced by zero-overhead hardware-accelerated CSS noise-overlay and BackgroundCanvas.
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

    if (!isWebGLSupported()) {
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
