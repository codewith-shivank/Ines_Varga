/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * TextReveal component — Editorial masked-line text reveal with Noise-to-Signal "sharpen" effect.
 * Uses GSAP SplitText, gsap.matchMedia, and strict accessibility preservation.
 */

import React, { useRef, useId } from 'react';
import gsap from 'gsap';
import { useGSAP } from '../core/useGSAP';
import { SplitText } from 'gsap/SplitText';
import { MOTION_CONFIG, orchestrator } from '../core/AppOrchestrator';
import { globalEmitter } from '../core/EventEmitter';

export interface TextRevealProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  className?: string;
  type?: 'lines' | 'words' | 'chars';
  delay?: number;
  stagger?: number;
  triggerOnScroll?: boolean;
  scrollTriggerStart?: string;
  sharpen?: boolean;
  once?: boolean;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  children,
  as: Component = 'div',
  className = '',
  type = 'lines',
  delay = 0,
  stagger,
  triggerOnScroll = true,
  scrollTriggerStart = 'top 88%',
  sharpen = true,
  once = true,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const id = useId();

  // Extract plain text for screen-reader accessibility
  const accessibleText = typeof children === 'string' ? children : undefined;

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const el = containerRef.current;
      const mm = gsap.matchMedia();

      // Only run motion when user has not requested reduced motion
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        let split: SplitText | null = null;

        const executeAnimation = () => {
          try {
            split = new SplitText(el, {
              type: type === 'chars' ? 'chars,words' : type === 'words' ? 'words' : 'lines',
              linesClass: 'masked-line-child',
              mask: type === 'lines' ? 'lines' : undefined,
              autoSplit: true,
            });

            const targets =
              type === 'chars'
                ? split.chars
                : type === 'words'
                ? split.words
                : split.lines;

            const staggerTime =
              stagger !== undefined
                ? stagger
                : type === 'chars'
                ? 0.02
                : type === 'words'
                ? 0.05
                : MOTION_CONFIG.stagger.base;

            // Initial state set via JS (Progressive enhancement: without JS, stays default visible)
            gsap.set(targets, {
              yPercent: 110,
              opacity: 0,
              filter: sharpen ? 'blur(8px)' : 'none',
              willChange: 'transform, opacity, filter',
            });

            const animProps: gsap.TweenVars = {
              yPercent: 0,
              opacity: 1,
              filter: 'blur(0px)',
              duration: MOTION_CONFIG.duration.base,
              ease: MOTION_CONFIG.ease.editorial,
              stagger: staggerTime,
              delay,
              clearProps: 'willChange',
            };

            if (triggerOnScroll) {
              gsap.to(targets, {
                ...animProps,
                scrollTrigger: {
                  trigger: el,
                  start: scrollTriggerStart,
                  once,
                  toggleActions: once ? 'play none none none' : 'play none none reverse',
                },
              });
            } else {
              // Direct entrance: if orchestrator already signaled ready, animate immediately
              if (orchestrator.isReady) {
                gsap.to(targets, animProps);
              } else {
                const unsubscribe = globalEmitter.once('app:ready', () => {
                  gsap.to(targets, animProps);
                });
                return () => unsubscribe();
              }
            }
          } catch (err) {
            console.warn('TextReveal SplitText fallback:', err);
            gsap.set(el, { opacity: 1, y: 0, filter: 'none', clearProps: 'all' });
          }
        };

        // If fonts are already loaded, split immediately, otherwise wait
        if (document.fonts && document.fonts.status === 'loaded') {
          executeAnimation();
        } else if (document.fonts) {
          document.fonts.ready.then(executeAnimation);
        } else {
          executeAnimation();
        }

        return () => {
          split?.revert();
        };
      });

      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [children, type, delay, stagger, triggerOnScroll] }
  );

  return (
    <Component
      ref={containerRef as React.Ref<never>}
      className={`reveal-on-scroll ${className}`}
      aria-label={accessibleText}
      key={id}
    >
      {children}
    </Component>
  );
};

export default TextReveal;
