/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MagneticButton — High-mass physical magnetic button / container.
 * Uses cursor proximity to physically attract the element,
 * settling smoothly with spring physics upon pointer exit.
 * Defaults to rendering an inline-block container (div) to prevent
 * invalid HTML descendant nesting (e.g. <button> inside <button>).
 */

import React, { useRef, useState } from 'react';
import { isTouchDevice, prefersReducedMotion } from '../utils/media';

export interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  href?: string;
  target?: string;
  rel?: string;
  strength?: number; // Distance pull factor (default 0.35)
  ariaLabel?: string;
  as?: 'div' | 'span' | 'button' | 'a';
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  onClick,
  href,
  target,
  rel,
  strength = 0.35,
  ariaLabel,
  as = 'div',
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (isTouchDevice() || prefersReducedMotion() || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    setOffset({ x: deltaX, y: deltaY });
  };

  const handlePointerLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  const style = {
    transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
    transition:
      offset.x === 0 && offset.y === 0
        ? 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        : 'transform 0.1s ease-out',
  };

  if (href || as === 'a') {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={style}
        aria-label={ariaLabel}
        data-cursor="pointer"
        className={`inline-block will-change-transform ${className}`}
      >
        {children}
      </a>
    );
  }

  if (as === 'button') {
    return (
      <button
        ref={ref as React.RefObject<HTMLButtonElement>}
        onClick={onClick}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={style}
        aria-label={ariaLabel}
        data-cursor="pointer"
        className={`inline-block will-change-transform cursor-pointer ${className}`}
      >
        {children}
      </button>
    );
  }

  if (as === 'span') {
    return (
      <span
        ref={ref as React.RefObject<HTMLSpanElement>}
        onClick={onClick}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={style}
        aria-label={ariaLabel}
        data-cursor="pointer"
        className={`inline-block will-change-transform ${className}`}
      >
        {children}
      </span>
    );
  }

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={style}
      aria-label={ariaLabel}
      className={`inline-block will-change-transform ${className}`}
    >
      {children}
    </div>
  );
};

export default MagneticButton;
