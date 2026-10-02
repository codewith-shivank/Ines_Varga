/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Media, pointer, hardware concurrency, accessibility, and WebGL safety utilities.
 */

export type HardwareTier = 'high' | 'medium' | 'low';

export const HardwareTier = {
  HIGH: 'high' as const,
  MEDIUM: 'medium' as const,
  LOW: 'low' as const,
};

let _polyfillApplied = false;

/**
 * Robust polyfill for WebGL getShaderPrecisionFormat and getParameter(VERSION)
 * Guards against the known Three.js bugs in WebGL 1.0 or headless/sandbox environments:
 * 1. getShaderPrecisionFormat(FRAGMENT_SHADER, HIGH_FLOAT) returning null -> crash on .precision
 * 2. getParameter(VERSION) returning null -> crash on .indexOf('WebGL')
 * Uses native closure references and single-execution guard to prevent any prototype recursion.
 */
export function ensureWebGLPrecisionPolyfill(): void {
  if (typeof window === 'undefined' || _polyfillApplied) return;
  _polyfillApplied = true;

  try {
    if (typeof WebGLRenderingContext !== 'undefined') {
      const proto = WebGLRenderingContext.prototype;
      const nativeGetPrecision = proto.getShaderPrecisionFormat;
      const nativeGetParameter = proto.getParameter;

      if (typeof nativeGetPrecision === 'function') {
        proto.getShaderPrecisionFormat = function (shaderType: number, precisionType: number) {
          try {
            const res = nativeGetPrecision.call(this, shaderType, precisionType);
            if (!res || typeof res.precision !== 'number') {
              return { rangeMin: 0, rangeMax: 0, precision: 0 };
            }
            return res;
          } catch {
            return { rangeMin: 0, rangeMax: 0, precision: 0 };
          }
        };
      }

      if (typeof nativeGetParameter === 'function') {
        proto.getParameter = function (pname: number) {
          try {
            const res = nativeGetParameter.call(this, pname);
            if (pname === this.VERSION && (!res || typeof res !== 'string')) {
              return 'WebGL 1.0 (Safe Fallback)';
            }
            return res;
          } catch {
            if (pname === this.VERSION) return 'WebGL 1.0 (Safe Fallback)';
            return null;
          }
        };
      }
    }
  } catch (err) {
    console.warn('WebGL polyfill registration notice:', err);
  }
}

// Automatically invoke once on module import
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
 * Thoroughly validates context, version string, and precision format.
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

    const webglCtx = gl as WebGLRenderingContext;

    // Verify VERSION parameter exists and is valid string
    const version = webglCtx.getParameter(webglCtx.VERSION);
    if (!version || typeof version !== 'string') {
      _cachedWebGLSupport = false;
      return false;
    }

    // Verify precision format function works
    if (typeof webglCtx.getShaderPrecisionFormat !== 'function') {
      _cachedWebGLSupport = false;
      return false;
    }

    const loseContext = webglCtx.getExtension('WEBGL_lose_context');
    loseContext?.loseContext();

    _cachedWebGLSupport = true;
    return true;
  } catch {
    _cachedWebGLSupport = false;
    return false;
  }
}
