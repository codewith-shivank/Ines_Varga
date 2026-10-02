/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Core Scroll Service — Lenis smooth scroll singleton synchronized with GSAP ticker.
 * StrictMode-safe with exact ticker teardown and touch preservation.
 */

import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { globalEmitter } from './EventEmitter';
import { isTouchDevice, prefersReducedMotion } from '../utils/media';
import { debounce } from '../utils/debounce';

export interface ScrollTickData {
  scroll: number;
  limit: number;
  velocity: number;
  direction: number;
  progress: number;
}

export class ScrollService {
  private static instance: ScrollService | null = null;
  public lenis: Lenis | null = null;
  private tickerFn: ((time: number) => void) | null = null;
  private isDestroyed: boolean = false;
  private listenersCount: number = 0;

  private constructor() {}

  public static getInstance(): ScrollService {
    if (!ScrollService.instance) {
      ScrollService.instance = new ScrollService();
    }
    return ScrollService.instance;
  }

  public init(): Lenis | null {
    if (typeof window === 'undefined') return null;

    // Increment mount counter for StrictMode resilience
    this.listenersCount++;

    if (this.lenis && !this.isDestroyed) {
      return this.lenis;
    }

    this.isDestroyed = false;

    // Respect user's motion preferences
    if (prefersReducedMotion()) {
      return null;
    }

    // Initialize single Lenis instance without hijacking native touch
    const isTouch = isTouchDevice();
    this.lenis = new Lenis({
      autoRaf: false, // Critical: GSAP ticker drives the RAF loop
      duration: isTouch ? 0.8 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential settle
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
      syncTouch: false, // Do not hijack native mobile touch inertia
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    this.lenis.on('scroll', (e: { scroll: number; limit: number; velocity: number; direction: number; progress: number }) => {
      ScrollTrigger.update();

      const tickData: ScrollTickData = {
        scroll: e.scroll,
        limit: e.limit,
        velocity: e.velocity,
        direction: e.direction,
        progress: e.progress,
      };

      globalEmitter.emit('scroll:tick', tickData);

      // Noise to Signal factor: 1.0 (unstable/noisy at top) -> 0.0 (clean signal as user enters content)
      const heroHeight = window.innerHeight * 0.9;
      const noiseFactor = Math.max(0, Math.min(1, 1 - e.scroll / heroHeight));
      globalEmitter.emit('noise:level', {
        noiseFactor,
        scroll: e.scroll,
      });
    });

    // GSAP Ticker callback reference for precise destruction
    this.tickerFn = (time: number) => {
      if (this.lenis && !this.isDestroyed) {
        this.lenis.raf(time * 1000);
      }
    };

    gsap.ticker.add(this.tickerFn);
    gsap.ticker.lagSmoothing(0);

    // Initial debounced refresh of ScrollTrigger
    this.refresh();

    return this.lenis;
  }

  public refresh = debounce(() => {
    if (typeof window !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }, 100);

  public scrollTo(
    target: string | number | HTMLElement,
    options?: {
      offset?: number;
      immediate?: boolean;
      duration?: number;
      onComplete?: () => void;
    }
  ): void {
    if (this.lenis && !this.isDestroyed) {
      this.lenis.scrollTo(target, options);
    } else if (typeof window !== 'undefined') {
      if (typeof target === 'string') {
        const el = document.querySelector(target);
        el?.scrollIntoView({ behavior: 'smooth' });
      } else if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' });
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  public stop(): void {
    this.lenis?.stop();
  }

  public start(): void {
    this.lenis?.start();
  }

  public destroy(): void {
    this.listenersCount = Math.max(0, this.listenersCount - 1);

    // Only fully destroy if no active React components are holding reference
    if (this.listenersCount > 0) {
      return;
    }

    this.isDestroyed = true;

    if (this.tickerFn) {
      gsap.ticker.remove(this.tickerFn);
      this.tickerFn = null;
    }

    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
    }
  }
}

export const scrollService = ScrollService.getInstance();
