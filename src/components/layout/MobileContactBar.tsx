import { MessageCircleIcon, PhoneIcon } from 'lucide-react';

import { trackConversion } from '@/lib/analytics';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import type { Business } from '@/types/content';

export type MobileContactBarProps = {
  business: Business;
};

/**
 * Acesso persistente ao contato no mobile (S-10 / FR-007).
 *
 * Invariantes:
 * - visível apenas abaixo do breakpoint de tablet;
 * - `padding-bottom: env(safe-area-inset-bottom)` para não ficar sob o gesto
 *   de navegação do iOS;
 * - alvos de 44×44px no mínimo (FR-034);
 * - NÃO cobre o rodapé: o `body` reserva `--size-mobile-bar` de espaço em
 *   src/styles/index.css (AC-008);
 * - no máximo dois canais, para não competirem entre si (FR-010).
 */
export function MobileContactBar({ business }: MobileContactBarProps) {
  return (
    <section
      aria-label="Contato rápido"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] shadow-bar md:hidden"
    >
      <div className="flex h-(--size-mobile-bar) items-center gap-2 px-3">
        <a
          href={buildWhatsAppUrl({ kind: 'general' }, business)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackConversion({ channel: 'whatsapp', section: 'mobile-bar', intent: 'general' })
          }
          className="inline-flex min-h-(--size-touch-target) flex-1 items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 text-base font-semibold text-foreground-inverse transition-colors active:bg-brand-800"
        >
          <MessageCircleIcon aria-hidden="true" className="size-5 shrink-0" />
          Agendar no WhatsApp
        </a>

        <a
          href={`tel:${business.phone.e164}`}
          onClick={() =>
            trackConversion({ channel: 'phone', section: 'mobile-bar', intent: 'general' })
          }
          aria-label={`Ligar para ${business.phone.display}`}
          className="inline-flex size-(--size-touch-target) shrink-0 items-center justify-center rounded-lg border-2 border-brand-600 text-brand-700 transition-colors active:bg-brand-100"
        >
          <PhoneIcon aria-hidden="true" className="size-5" />
        </a>
      </div>
    </section>
  );
}
