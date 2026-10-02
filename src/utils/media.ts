/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Media, pointer, hardware concurrency, accessibility, and WebGL precision utilities.
 */

export type HardwareTier = 'high' | 'medium' | 'low';

export const HardwareTier = {
  HIGH: 'high' as const,
  MEDIUM: 'medium' as const,
  LOW: 'low' as const,
};

/**
 * Polyfill for WebGL getShaderPrecisionFormat to guard against the known Three.js bug:
 * In WebGL 1.0 or constrained GPU environments, getShaderPrecisionFormat(FRAGMENT_SHADER, HIGH_FLOAT)
 * can return null. Three.js accesses .precision directly without null checking, throwing:
 * "TypeError: Cannot read properties of null (reading 'precision')".
 * This polyfill safely returns a valid format with precision 0, allowing Three.js to cleanly fall back to mediump.
 */
export function ensureWebGLPrecisionPolyfill(): void {
  if (typeof window === 'undefined') return;

  const patch = (proto: any) => {
    if (!proto || typeof proto.getShaderPrecisionFormat !== 'function') return;
    if (proto.__three_precision_patched) return;

    const original = proto.getShaderPrecisionFormat;
    proto.getShaderPrecisionFormat = function (shaderType: number, precisionType: number) {
      try {
        const result = original.call(this, shaderType, precisionType);
        if (!result || typeof result.precision !== 'number') {
          return { rangeMin: 0, rangeMax: 0, precision: 0 };
        }
        return result;
      } catch {
        return { rangeMin: 0, rangeMax: 0, precision: 0 };
      }
    };
    proto.__three_precision_patched = true;
  };

  if (typeof WebGLRenderingContext !== 'undefined') {
    patch(WebGLRenderingContext.prototype);
  }
  if (typeof WebGL2RenderingContext !== 'undefined') {
    patch(WebGL2RenderingContext.prototype);
  }
}

// Ensure polyfill is active immediately
ensureWebGLPrecisionPolyfill();

/**
 * Checks whether the current environment prefers reduced motion.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Checks whether the current pointer device is coarse / touch.
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches
  );
}

/**
 * Checks whether the device is considered mobile (viewport or touch).
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || isTouchDevice();
}

/**
 * Evaluates device hardware tier (high / medium / low) based on screen, concurrency, and memory.
 */
export function getHardwareTier(): HardwareTier {
  if (typeof window === 'undefined') return 'medium';

  // If reduced motion is requested, treat as low tier to disable heavy WebGL
  if (prefersReducedMotion()) return 'low';

  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency || 4;
  const memory = nav.deviceMemory || 4;
  const isMobile = window.innerWidth < 768 || isTouchDevice();

  if (cores <= 2 || memory <= 2) {
    return 'low';
  }

  if (isMobile || cores <= 4 || memory <= 4) {
    return 'medium';
  }

  return 'high';
}

let _cachedWebGLSupport: boolean | null = null;

/**
 * Verifies whether WebGL is truly available and capable of running.
 */
export function isWebGLSupported(_targetCanvas?: HTMLCanvasElement | null): boolean {
  if (typeof window === 'undefined') return false;
  if (_cachedWebGLSupport !== null) return _cachedWebGLSupport;

  try {
    ensureWebGLPrecisionPolyfill();

    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');

    if (!gl) {
      _cachedWebGLSupport = false;
      return false;
    }

    const loseContext = (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context');
    loseContext?.loseContext();

    _cachedWebGLSupport = true;
    return true;
  } catch {
    _cachedWebGLSupport = false;
    return false;
  }
}
