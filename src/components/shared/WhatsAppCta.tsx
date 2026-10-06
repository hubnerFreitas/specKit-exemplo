import { MessageCircleIcon } from 'lucide-react';

import { CtaButton } from '@/components/shared/CtaButton';
import type { ButtonProps } from '@/components/ui/button';
import { buildWhatsAppUrl, type WhatsAppIntent } from '@/lib/whatsapp';
import type { SectionId } from '@/types/analytics';
import type { Business } from '@/types/content';

export type WhatsAppCtaProps = {
  intent: WhatsAppIntent;
  business: Business;
  section: SectionId;
  itemId?: string;
  label: string;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  fullWidth?: boolean;
  showIcon?: boolean;
  className?: string;
};

function intentKey(intent: WhatsAppIntent): string {
  switch (intent.kind) {
    case 'service':
      return `service:${intent.serviceId}`;
    case 'product':
      return `product:${intent.productId}`;
    case 'form-fallback':
      return `form:${intent.request.serviceId}`;
    default:
      return intent.kind;
  }
}

/**
 * CTA de WhatsApp com mensagem pré-preenchida contextual (FR-008).
 * O `href` vem exclusivamente de `buildWhatsAppUrl` — este componente nunca
 * concatena URL por conta própria.
 */
export function WhatsAppCta({
  intent,
  business,
  section,
  itemId,
  label,
  variant = 'primary',
  size = 'default',
  fullWidth = false,
  showIcon = true,
  className,
}: WhatsAppCtaProps) {
  return (
    <CtaButton
      cta={{ label, channel: 'whatsapp', intent: intentKey(intent) }}
      section={section}
      href={buildWhatsAppUrl(intent, business)}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      {...(className !== undefined ? { className } : {})}
      {...(itemId !== undefined ? { itemId } : {})}
      {...(showIcon
        ? { icon: <MessageCircleIcon aria-hidden="true" className="size-5 shrink-0" /> }
        : {})}
    />
  );
}
