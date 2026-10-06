import type { ReactNode } from 'react';

import { Button, type ButtonProps } from '@/components/ui/button';
import { trackConversion } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import type { ConversionChannel, SectionId } from '@/types/analytics';
import type { CtaDefinition } from '@/types/content';

export type CtaButtonProps = {
  cta: CtaDefinition;
  section: SectionId;
  itemId?: string;
  /** URL já construída para os canais de link (whatsapp, phone, email, route). */
  href?: string;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  fullWidth?: boolean;
  icon?: ReactNode;
  className?: string;
};

/** O canal 'anchor' é navegação interna, não conversão. */
const CONVERSION_CHANNELS: Record<CtaDefinition['channel'], ConversionChannel | null> = {
  whatsapp: 'whatsapp',
  phone: 'phone',
  form: 'form',
  route: 'route',
  anchor: null,
};

/**
 * Encapsula o requisito de que TODA conversão é rastreada (FR-015).
 * Nenhuma seção renderiza um botão de contato sem passar por aqui.
 *
 * Invariantes garantidas:
 * 1. `<a>` real para whatsapp/phone/route/anchor; `<button type="submit">`
 *    para form. Nunca um `<div>` com onClick.
 * 2. `trackConversion` no clique, SEM `preventDefault` — a navegação acontece
 *    mesmo se o rastreamento falhar (FR-039).
 * 3. `target="_blank"` sempre com `rel="noopener noreferrer"`.
 * 4. Altura mínima de 44px em qualquer tamanho (FR-034).
 */
export function CtaButton({
  cta,
  section,
  itemId,
  href,
  variant = 'primary',
  size = 'default',
  fullWidth = false,
  icon,
  className,
}: CtaButtonProps) {
  const channel = CONVERSION_CHANNELS[cta.channel];

  const handleClick = (): void => {
    if (channel === null) return;
    trackConversion({
      channel,
      section,
      intent: cta.intent,
      ...(itemId !== undefined ? { itemId } : {}),
    });
  };

  const classes = cn(fullWidth && 'w-full', className);

  if (cta.channel === 'form') {
    return (
      <Button type="submit" variant={variant} size={size} className={classes} onClick={handleClick}>
        {icon}
        {cta.label}
      </Button>
    );
  }

  const resolvedHref = cta.channel === 'anchor' ? `#${cta.anchorId ?? ''}` : (href ?? '#');
  // Canais externos abrem em nova aba; âncoras internas, na mesma.
  const isExternal = cta.channel === 'whatsapp' || cta.channel === 'route';

  return (
    <Button asChild variant={variant} size={size} className={classes}>
      <a
        href={resolvedHref}
        onClick={handleClick}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {icon}
        {cta.label}
      </a>
    </Button>
  );
}
