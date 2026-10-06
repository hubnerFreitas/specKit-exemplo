import { PawPrintIcon } from 'lucide-react';

import { SiteNav } from '@/components/layout/SiteNav';
import { WhatsAppCta } from '@/components/shared/WhatsAppCta';
import type { Business, NavItem } from '@/types/content';

export type SiteHeaderProps = {
  business: Business;
  navItems: NavItem[];
};

/**
 * Cabeçalho (S-0).
 *
 * O CTA de contato fica visível FORA do menu recolhido no mobile: é o que
 * mantém o contato a um toque de distância em qualquer ponto (FR-002).
 */
export function SiteHeader({ business, navItems }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur-sm">
      <div className="container-content flex h-(--size-header) items-center justify-between gap-3 lg:h-(--size-header-lg)">
        <a
          href="#hero"
          className="inline-flex min-h-(--size-touch-target) shrink-0 items-center gap-2.5 rounded-md py-1 text-lg font-bold text-foreground transition-colors hover:text-brand-700"
        >
          <PawPrintIcon aria-hidden="true" className="size-7 shrink-0 text-brand-600" />
          <span className="font-display">{business.tradeName}</span>
        </a>

        <div className="flex items-center gap-2">
          <SiteNav navItems={navItems} business={business} />

          {/* Visível no desktop; no mobile o contato fica na barra fixa. */}
          <WhatsAppCta
            intent={{ kind: 'general' }}
            business={business}
            section="header"
            label="Agendar"
            size="compact"
            className="hidden sm:inline-flex"
          />
        </div>
      </div>
    </header>
  );
}
