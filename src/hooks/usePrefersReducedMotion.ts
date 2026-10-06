import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onStoreChange: () => void): () => void {
  const mediaQuery = window.matchMedia(QUERY);
  mediaQuery.addEventListener('change', onStoreChange);
  return () => mediaQuery.removeEventListener('change', onStoreChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

/** No servidor não há preferência conhecida: `false` mantém a paridade. */
function getServerSnapshot(): boolean {
  return false;
}

/**
 * Preferência de movimento reduzido (FR-037 / AC-025).
 *
 * Usa `useSyncExternalStore` em vez de `useState` + `useEffect`: é a API
 * própria do React para ler de uma fonte externa, evita a renderização em
 * cascata que um `setState` dentro de efeito provoca, e tem um snapshot de
 * servidor explícito — o que garante a paridade com o HTML pré-renderizado
 * (research.md R-01).
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
