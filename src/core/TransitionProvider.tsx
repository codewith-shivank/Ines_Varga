/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * TransitionProvider — Mode A React transition coordinator matching target structure.
 * Emits transition events (`transition:start`, `transition:complete`), synchronizes
 * page state changes, and coordinates Noise-to-Signal settle physics.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { globalEmitter } from './EventEmitter';

interface TransitionContextType {
  isTransitioning: boolean;
  activeRoute: string;
  navigate: (route: string) => void;
}

const TransitionContext = createContext<TransitionContextType>({
  isTransitioning: false,
  activeRoute: 'home',
  navigate: () => {},
});

export const useTransition = () => useContext(TransitionContext);

export const TransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeRoute, setActiveRoute] = useState('home');

  const navigate = (route: string) => {
    if (route === activeRoute || isTransitioning) return;

    setIsTransitioning(true);
    globalEmitter.emit('transition:start', { from: activeRoute, to: route });

    // Transient Noise elevation during transition
    globalEmitter.emit('noise:level', { noiseFactor: 0.8 });

    setTimeout(() => {
      setActiveRoute(route);
      setIsTransitioning(false);
      globalEmitter.emit('transition:complete', { route });
      globalEmitter.emit('noise:level', { noiseFactor: 0.0 });
    }, 450);
  };

  return (
    <TransitionContext.Provider value={{ isTransitioning, activeRoute, navigate }}>
      {children}
    </TransitionContext.Provider>
  );
};

export default TransitionProvider;
