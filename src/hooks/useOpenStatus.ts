import { useEffect, useState } from 'react';

import { getOpenStatus, type OpenStatus } from '@/lib/business-hours';
import type { BusinessHours } from '@/types/content';

/** Reavalia a cada minuto, para que o selo não fique obsoleto na aba aberta. */
const REFRESH_INTERVAL_MS = 60_000;

/**
 * Estado de funcionamento calculado APENAS no cliente.
 *
 * Retorna `{ state: 'unknown' }` na primeira renderização de propósito: o
 * horário do build não é o horário do visitante, e renderizar o estado no
 * servidor produziria divergência de hidratação e informação errada em cache
 * de CDN (research.md R-09).
 */
export function useOpenStatus(hours: BusinessHours): OpenStatus {
  const [status, setStatus] = useState<OpenStatus>({ state: 'unknown' });

  useEffect(() => {
    const update = (): void => setStatus(getOpenStatus(new Date(), hours));
    update();

    const interval = window.setInterval(update, REFRESH_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [hours]);

  return status;
}
