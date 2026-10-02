/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ESM useGSAP hook for React 19 ensuring zero duplicate React copies across UMD bundles.
 */

import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export interface UseGSAPConfig {
  scope?: React.RefObject<Element | null> | HTMLElement | null;
  dependencies?: unknown[];
  revertOnUpdate?: boolean;
}

export const useGSAP = (
  callback?: ((context: gsap.Context, contextSafe?: (func: (...args: unknown[]) => unknown) => (...args: unknown[]) => unknown) => void) | UseGSAPConfig,
  dependencies: unknown[] | UseGSAPConfig = []
) => {
  let config: UseGSAPConfig = {};
  const cb = typeof callback === 'function' ? callback : undefined;

  if (callback && typeof callback === 'object') {
    config = callback;
  } else if (dependencies && typeof dependencies === 'object' && !Array.isArray(dependencies)) {
    config = dependencies;
  }

  const deps = Array.isArray(dependencies) ? dependencies : config.dependencies || [];
  const scope = config.scope;
  const revertOnUpdate = config.revertOnUpdate;

  const mounted = useRef(false);
  const context = useRef<gsap.Context>(
    gsap.context(
      () => {},
      typeof scope === 'object' && scope && 'current' in scope
        ? scope.current || undefined
        : (scope as Element | undefined)
    )
  );
  const contextSafe = useRef(<T extends (...args: unknown[]) => unknown>(func: T): T => {
    return context.current.add(func) as unknown as T;
  });
  const deferCleanup = deps.length > 0 && !revertOnUpdate;

  useIsomorphicLayoutEffect(() => {
    mounted.current = true;
    return () => context.current.revert();
  }, []);

  useIsomorphicLayoutEffect(() => {
    const scopeEl =
      typeof scope === 'object' && scope && 'current' in scope
        ? scope.current || undefined
        : (scope as Element | undefined);
    if (cb) {
      context.current.add(() => {
        cb(context.current, contextSafe.current);
      }, scopeEl);
    }
    if (!deferCleanup || !mounted.current) {
      return () => context.current.revert();
    }
  }, deps);

  return { context: context.current, contextSafe: contextSafe.current };
};

export default useGSAP;
