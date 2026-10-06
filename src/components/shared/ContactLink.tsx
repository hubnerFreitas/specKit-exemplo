import { MailIcon, MapPinIcon, MessageCircleIcon, PhoneIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { trackConversion } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import type { ConversionChannel, SectionId } from '@/types/analytics';
import type { Business } from '@/types/content';

export type ContactLinkKind = 'phone' | 'whatsapp' | 'email' | 'address';

export type ContactLinkProps = {
  kind: ContactLinkKind;
  business: Business;
  section: SectionId;
  showIcon?: boolean;
  tone?: 'default' | 'inverse';
  className?: string;
};

/** Monta o endereço completo em uma linha, para texto e para rota. */
export function formatFullAddress(business: Business): string {
  const { street, number, complement, district, city, state, postalCode } = business.address;
  const streetLine = complement !== undefined ? `${street}, ${number} — ${complement}` : `${street}, ${number}`;
  return `${streetLine}, ${district}, ${city} — ${state}, ${postalCode}`;
}

function buildRouteUrl(business: Business): string {
  const destination = encodeURIComponent(formatFullAddress(business));
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
}

/**
 * Único lugar do projeto que constrói `tel:`, `mailto:` e URL de rota (FR-009).
 *
 * O texto visível usa SEMPRE `phone.display` e o `href` SEMPRE `phone.e164`:
 * é o que garante que o NAP exibido seja idêntico em toda a página
 * (FR-029 / AC-017) sem depender de quem escreveu o componente.
 */
export function ContactLink({
  kind,
  business,
  section,
  showIcon = true,
  tone = 'default',
  className,
}: ContactLinkProps) {
  const config: Record<
    ContactLinkKind,
    { href: string; text: string; icon: ReactNode; channel: ConversionChannel; external: boolean }
  > = {
    phone: {
      href: `tel:${business.phone.e164}`,
      text: business.phone.display,
      icon: <PhoneIcon aria-hidden="true" className="size-5 shrink-0" />,
      channel: 'phone',
      external: false,
    },
    whatsapp: {
      href: buildWhatsAppUrl({ kind: 'general' }, business),
      text: business.whatsapp.display,
      icon: <MessageCircleIcon aria-hidden="true" className="size-5 shrink-0" />,
      channel: 'whatsapp',
      external: true,
    },
    email: {
      href: `mailto:${business.email}`,
      text: business.email,
      icon: <MailIcon aria-hidden="true" className="size-5 shrink-0" />,
      channel: 'email',
      external: false,
    },
    address: {
      href: buildRouteUrl(business),
      text: formatFullAddress(business),
      icon: <MapPinIcon aria-hidden="true" className="size-5 shrink-0" />,
      channel: 'route',
      external: true,
    },
  };

  const { href, text, icon, channel, external } = config[kind];

  return (
    <a
      href={href}
      onClick={() => trackConversion({ channel, section, intent: 'general' })}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={cn(
        'inline-flex items-center gap-2.5 rounded-md py-1.5 text-base transition-colors',
        'min-h-(--size-touch-target)',
        tone === 'inverse'
          ? 'text-foreground-inverse hover:text-brand-200'
          : 'text-foreground hover:text-brand-700',
        className,
      )}
    >
      {showIcon && <span className={tone === 'inverse' ? 'text-brand-200' : 'text-brand-600'}>{icon}</span>}
      <span>{text}</span>
    </a>
  );
}
