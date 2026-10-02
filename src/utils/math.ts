/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Math utilities for creative development and WebGL transformations.
 */

/**
 * Linear interpolation between start and end by factor t.
 */
export function lerp(start: number, end: number, t: number): number {
  return start * (1 - t) + end * t;
}

/**
 * Constrains a number between a minimum and maximum boundary.
 */
export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

/**
 * Maps a value from an input range [inMin, inMax] to an output range [outMin, outMax].
 */
export function mapRange(
  val: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  const norm = (val - inMin) / (inMax - inMin);
  return lerp(outMin, outMax, clamp(norm, 0, 1));
}

/**
 * Smooth exponential damping toward a target value (frame-rate independent).
 */
export function damp(current: number, target: number, lambda: number, dt: number): number {
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}

/**
 * Normalizes a value between 0 and 1 relative to a range.
 */
export function norm(val: number, min: number, max: number): number {
  return clamp((val - min) / (max - min), 0, 1);
}
