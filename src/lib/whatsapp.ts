import type { ContactRequest } from '@/schemas/contact-request.schema';
import type { Business } from '@/types/content';

/* ============================================================================
   Único lugar do projeto que constrói URL de WhatsApp (FR-008).
   A união discriminada garante que não existe CTA "sem contexto": o tipo
   obriga a declarar a origem, e daí sai a mensagem pré-preenchida.
   ============================================================================ */

export type WhatsAppIntent =
  | { kind: 'general' }
  | { kind: 'service'; serviceId: string; serviceName: string }
  | { kind: 'product'; productId: string; productName: string }
  | { kind: 'question' }
  | { kind: 'form-fallback'; request: ContactRequest; serviceName: string };

function formatPhoneForDisplay(digits: string): string {
  const local = digits.slice(2);
  if (local.length === 11) {
    return `(${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}`;
  }
  return `(${local.slice(0, 2)}) ${local.slice(2, 6)}-${local.slice(6)}`;
}

function buildMessage(intent: WhatsAppIntent): string {
  switch (intent.kind) {
    case 'general':
      return 'Olá! Gostaria de agendar um horário para o meu pet.';
    case 'service':
      return `Olá! Gostaria de agendar o serviço de ${intent.serviceName}.`;
    case 'product':
      return `Olá! Gostaria de saber a disponibilidade e o preço de: ${intent.productName}.`;
    case 'question':
      return 'Olá! Tenho uma dúvida que não encontrei nas perguntas frequentes.';
    case 'form-fallback': {
      const { request, serviceName } = intent;
      const lines = [
        `Olá! Gostaria de agendar: ${serviceName}`,
        `Nome: ${request.name}`,
        `Telefone: ${formatPhoneForDisplay(`55${request.phone}`)}`,
      ];
      if (request.message !== undefined && request.message.length > 0) {
        lines.push(`Observação: ${request.message}`);
      }
      return lines.join('\n');
    }
  }
}

/**
 * Monta a URL de conversa com mensagem pré-preenchida contextual à origem.
 * Nenhum componente concatena essa URL por conta própria.
 */
export function buildWhatsAppUrl(intent: WhatsAppIntent, business: Business): string {
  const phone = business.whatsapp.e164.replace(/\D/g, '');
  return `https://wa.me/${phone}?text=${encodeURIComponent(buildMessage(intent))}`;
}
