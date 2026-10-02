import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import CustomCursor from './components/CustomCursor';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <CustomCursor />
  </StrictMode>,
);
