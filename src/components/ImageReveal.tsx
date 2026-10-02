/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ImageReveal — Editorial clip-path curtain reveal component.
 * Reveals architectural blueprints or technical imagery with a crisp,
 * physical settle transition upon entering viewport.
 */

import React from 'react';
import { motion } from 'motion/react';
import { prefersReducedMotion } from '../utils/media';

export interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}

export const ImageReveal: React.FC<ImageRevealProps> = ({
  src,
  alt,
  className = '',
  aspectRatio = 'aspect-video',
}) => {
  const isReduced = prefersReducedMotion();

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 ${aspectRatio} ${className}`}
    >
      {/* Underlying Image */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
      />

      {/* Wipe Curtain */}
      {!isReduced && (
        <motion.div
          initial={{ scaleY: 1 }}
          whileInView={{ scaleY: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-zinc-950 origin-top pointer-events-none z-10"
        />
      )}
    </div>
  );
};

export default ImageReveal;
