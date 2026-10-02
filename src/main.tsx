import { ensureWebGLPrecisionPolyfill } from './utils/media';

// Apply WebGL precision polyfill before any Three.js modules instantiate renderers
ensureWebGLPrecisionPolyfill();

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { orchestrator } from './core/AppOrchestrator';

// Initialize core lifecycle and hardware tier detection
orchestrator.init();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
