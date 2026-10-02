/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * DOM utility helpers for element selection, safe listeners, and geometry calculations.
 */

/**
 * Type-safe querySelector wrapper.
 */
export function qs<T extends HTMLElement = HTMLElement>(
  selector: string,
  scope: ParentNode = document
): T | null {
  return scope.querySelector<T>(selector);
}

/**
 * Type-safe querySelectorAll wrapper returning an Array.
 */
export function qsa<T extends HTMLElement = HTMLElement>(
  selector: string,
  scope: ParentNode = document
): T[] {
  return Array.from(scope.querySelectorAll<T>(selector));
}

/**
 * Attaches an event listener and returns a cleanup function.
 */
export function on<K extends keyof WindowEventMap>(
  target: Window,
  type: K,
  listener: (this: Window, ev: WindowEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
): () => void;
export function on<K extends keyof DocumentEventMap>(
  target: Document,
  type: K,
  listener: (this: Document, ev: DocumentEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
): () => void;
export function on<K extends keyof HTMLElementEventMap, T extends HTMLElement = HTMLElement>(
  target: T,
  type: K,
  listener: (this: T, ev: HTMLElementEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
): () => void;
export function on(
  target: EventTarget,
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
): () => void {
  target.addEventListener(type, listener, options);
  return () => target.removeEventListener(type, listener, options);
}

/**
 * Calculates the bounding rectangle of an element relative to document scroll.
 */
export function getElementOffset(el: HTMLElement): { top: number; left: number; width: number; height: number } {
  const rect = el.getBoundingClientRect();
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft,
    width: rect.width,
    height: rect.height,
  };
}
