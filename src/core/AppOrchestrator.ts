/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * App Orchestrator — coordinates application lifecycle, motion design tokens,
 * hardware tiers, and the global app:ready signal.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { globalEmitter } from './EventEmitter';
import { getHardwareTier, HardwareTier, prefersReducedMotion } from '../utils/media';

// Register GSAP plugins centrally once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * Authoritative Motion Tokens for the entire application.
 * Fast 0.4s | Base 0.8s | Slow 1.2s
 */
export const MOTION_CONFIG = {
  duration: {
    fast: 0.4,
    base: 0.8,
    slow: 1.2,
  },
  ease: {
    editorial: 'power3.out',
    settle: 'expo.out',
    fluid: 'power2.inOut',
  },
  stagger: {
    tight: 0.04,
    base: 0.08,
    wide: 0.12,
  },
  distance: {
    short: 16,
    base: 32,
    long: 64,
  },
} as const;

export class AppOrchestrator {
  private static instance: AppOrchestrator | null = null;
  public hardwareTier: HardwareTier = 'medium';
  public isReady: boolean = false;
  private isInitialized: boolean = false;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.hardwareTier = getHardwareTier();
    }
  }

  public static getInstance(): AppOrchestrator {
    if (!AppOrchestrator.instance) {
      AppOrchestrator.instance = new AppOrchestrator();
    }
    return AppOrchestrator.instance;
  }

  public init(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Apply js-enabled class to document element for progressive enhancement
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('no-js');
      document.documentElement.classList.add('js-enabled');
      if (prefersReducedMotion()) {
        document.documentElement.classList.add('reduced-motion');
      }
    }

    // If preloader was already seen or user prefers reduced motion, trigger immediately
    if (typeof window !== 'undefined') {
      const alreadySeen = sessionStorage.getItem('sm_preloader_seen') === 'true';
      if (prefersReducedMotion() || alreadySeen) {
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(() => this.markReady());
        } else {
          setTimeout(() => this.markReady(), 50);
        }
      }

      // Safety fallback: ensure app:ready fires after at most 3.5s regardless
      setTimeout(() => {
        this.markReady();
      }, 3500);
    }
  }

  public markReady(): void {
    if (this.isReady) return;
    this.isReady = true;
    globalEmitter.emit('app:ready', {
      tier: this.hardwareTier,
      timestamp: performance.now(),
    });
  }
}

export const orchestrator = AppOrchestrator.getInstance();
