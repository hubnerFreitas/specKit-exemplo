import type { SubmitMode, SubmitResult } from '@/lib/contact/types';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { MIN_FILL_TIME_MS, type ContactRequest } from '@/schemas/contact-request.schema';
import type { Business } from '@/types/content';

/* ============================================================================
   Adaptador de envio da solicitação de contato (research.md R-08).

   Dois modos, escolhidos por variável de ambiente:
   - 'endpoint'  → POST para VITE_CONTACT_ENDPOINT (contrato em
                   contracts/contact-endpoint.md);
   - 'composer'  → padrão: monta a mensagem e abre o WhatsApp.

   O modo composer não é placeholder: o WhatsApp é o canal principal declarado
   na especificação e a mensagem chega estruturada e qualificada. A troca entre
   os modos é uma variável de ambiente, não uma refatoração.
   ============================================================================ */

const REQUEST_TIMEOUT_MS = 10_000;

const endpoint = import.meta.env['VITE_CONTACT_ENDPOINT'] as string | undefined;

export function getSubmitMode(): SubmitMode {
  return endpoint !== undefined && endpoint.length > 0 ? 'endpoint' : 'composer';
}

/** Validação antispam feita no cliente; o servidor repete (FR-014). */
function failsAntiSpam(request: ContactRequest): boolean {
  if (request.honeypot.length > 0) return true;
  return Date.now() - request.renderedAt < MIN_FILL_TIME_MS;
}

type EndpointErrorBody = {
  error?: string;
  fields?: Record<string, string>;
  retryAfterSeconds?: number;
};

async function submitToEndpoint(request: ContactRequest, url: string): Promise<SubmitResult> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      // Nenhum cookie é enviado — o endpoint não precisa identificar sessão.
      credentials: 'omit',
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    if (response.ok) {
      return { status: 'success' };
    }

    const body = (await response.json().catch(() => ({}))) as EndpointErrorBody;

    if (response.status === 400 && body.fields !== undefined) {
      return { status: 'field-errors', fields: body.fields };
    }

    if (response.status === 429) {
      return {
        status: 'error',
        ...(body.retryAfterSeconds !== undefined
          ? { retryAfterSeconds: body.retryAfterSeconds }
          : {}),
      };
    }

    // 422 (classificado como spam) é tratado como erro genérico de propósito:
    // não revelamos a classificação ao visitante.
    return { status: 'error' };
  } catch {
    // Nenhuma nova tentativa automática: evita duplicar a solicitação.
    return { status: 'error' };
  } finally {
    window.clearTimeout(timeout);
  }
}

function submitViaComposer(
  request: ContactRequest,
  business: Business,
  serviceName: string,
): SubmitResult {
  const url = buildWhatsAppUrl({ kind: 'form-fallback', request, serviceName }, business);
  window.open(url, '_blank', 'noopener,noreferrer');
  return { status: 'success' };
}

/**
 * Envia a solicitação pelo modo configurado.
 * Nunca lança: todo caminho de falha vira um `SubmitResult`, para que o
 * formulário sempre possa preservar os dados e oferecer os canais
 * alternativos (FR-013).
 */
export async function submitContactRequest(
  request: ContactRequest,
  business: Business,
  serviceName: string,
): Promise<SubmitResult> {
  if (failsAntiSpam(request)) {
    return { status: 'error' };
  }

  if (endpoint !== undefined && endpoint.length > 0) {
    return submitToEndpoint(request, endpoint);
  }

  return submitViaComposer(request, business, serviceName);
}
