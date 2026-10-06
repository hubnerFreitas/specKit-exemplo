import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';

import { App } from '@/App';
import '@/styles/index.css';

const container = document.getElementById('root');

if (container === null) {
  throw new Error('Elemento #root não encontrado no documento.');
}

// hydrateRoot, não createRoot: o HTML já vem pré-renderizado do build
// (research.md R-01).
hydrateRoot(
  container,
  <StrictMode>
    <App />
  </StrictMode>,
);
