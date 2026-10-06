import type { ConversionEvent, ConversionEventInput } from '@/types/analytics';

/* ============================================================================
   Mensuração de conversões (FR-015, FR-039).
   Ver specs/001-petshop-home-comercial/contracts/analytics-events.md

   Garantias desta biblioteca:
   - trackConversion NUNCA lança exceção e NUNCA retorna Promise, para poder
     ser chamada no onClick de uma âncora sem risco de impedir a navegação.
   - Nenhuma requisição de rede e nenhum script de terceiro antes do
     consentimento.
   - Nenhum dado pessoal no evento.
   ============================================================================ */

const MAX_QUEUE_SIZE = 50;
const DEDUPE_WINDOW_MS = 500;

const endpoint = import.meta.env['VITE_ANALYTICS_ENDPOINT'] as string | undefined;
const isDevelopment = import.meta.env.DEV;

let consentGranted = false;
let queue: ConversionEvent[] = [];
const lastSeen = new Map<string, number>();

function dedupeKey(event: ConversionEventInput): string {
  return `${event.channel}|${event.section}|${event.itemId ?? ''}|${event.intent}`;
}

function dispatch(event: ConversionEvent): void {
  if (endpoint === undefined || endpoint.length === 0) {
    if (isDevelopment) {
      // Permite a verificação manual de AC-010 sem provedor configurado.
      console.warn('[conversão]', event);
    }
    return;
  }

  const payload = JSON.stringify(event);

  if (typeof navigator.sendBeacon === 'function') {
    // sendBeacon sobrevive à saída da página ao abrir o WhatsApp.
    navigator.sendBeacon(endpoint, new Blob([payload], { type: 'application/json' }));
    return;
  }

  void fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    keepalive: true,
    credentials: 'omit',
  }).catch(() => {
    // Falha de mensuração nunca afeta a experiência (FR-039).
  });
}

/**
 * Registra uma conversão. Segura de chamar em qualquer contexto.
 * Chamada apenas por CtaButton, ContactLink e ContactForm — nenhuma seção
 * chama diretamente, para que nenhum CTA novo nasça sem rastreamento.
 */
export function trackConversion(input: ConversionEventInput): void {
  try {
    const now = Date.now();
    const key = dedupeKey(input);
    const previous = lastSeen.get(key);

    // Duplo toque acidental em mobile não deve inflar a taxa de conversão.
    if (previous !== undefined && now - previous < DEDUPE_WINDOW_MS) {
      return;
    }
    lastSeen.set(key, now);

    const event: ConversionEvent = { ...input, occurredAt: now };

    if (!consentGranted) {
      queue.push(event);
      if (queue.length > MAX_QUEUE_SIZE) {
        queue = queue.slice(-MAX_QUEUE_SIZE);
      }
      if (isDevelopment) {
        console.warn('[conversão enfileirada]', event);
      }
      return;
    }

    dispatch(event);
  } catch {
    // Mensuração nunca pode quebrar a página.
  }
}

/** Libera o envio e despacha a fila em ordem. */
export function grantConsent(): void {
  consentGranted = true;
  const pending = queue;
  queue = [];
  pending.forEach(dispatch);
}

/** Interrompe o envio e descarta o que estava pendente. */
export function revokeConsent(): void {
  consentGranted = false;
  queue = [];
}
