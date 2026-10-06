import { PawPrintIcon } from 'lucide-react';

import { ContactLink, formatFullAddress } from '@/components/shared/ContactLink';
import { SocialIcon } from '@/components/shared/SocialIcon';
import { WEEKDAY_LABELS } from '@/lib/business-hours';
import type { Business, NavItem } from '@/types/content';

export type SiteFooterProps = {
  business: Business;
  navItems: NavItem[];
};

/**
 * Ano fixado no build. Determinístico no servidor e no cliente, então não há
 * divergência de hidratação — e um ano de copyright não precisa ser dinâmico.
 */
const COPYRIGHT_YEAR = new Date().getFullYear();

/** Segunda a sábado primeiro, domingo ao final — ordem de leitura natural. */
function readingOrder(weekday: number): number {
  return weekday === 0 ? 7 : weekday;
}

/** Agrupa dias com o mesmo horário, para o rodapé ficar compacto. */
function summarizeHours(business: Business): string[] {
  const groups: { days: number[]; label: string }[] = [];

  for (const day of business.hours.weekly.toSorted(
    (a, b) => readingOrder(a.weekday) - readingOrder(b.weekday),
  )) {
    const label = day.closed
      ? 'Fechado'
      : day.intervals.map((interval) => `${interval.opensAt} às ${interval.closesAt}`).join(' · ');

    const last = groups.at(-1);
    if (last !== undefined && last.label === label) {
      last.days.push(day.weekday);
    } else {
      groups.push({ days: [day.weekday], label });
    }
  }

  return groups.map((group) => {
    const first = group.days[0];
    const lastDay = group.days.at(-1);
    if (first === undefined || lastDay === undefined) return group.label;

    const range =
      group.days.length === 1
        ? WEEKDAY_LABELS[first]
        : `${WEEKDAY_LABELS[first]} a ${WEEKDAY_LABELS[lastDay]}`;
    return `${range}: ${group.label}`;
  });
}

/**
 * Rodapé (S-9) com os 9 blocos de FR-025.
 *
 * Todo NAP vem de `business` via `ContactLink`, para ficar idêntico ao do
 * restante da página e ao do JSON-LD (AC-017).
 * O espaçamento inferior reservado no `<body>` garante que a barra fixa de
 * contato no mobile nunca cubra este conteúdo (AC-008).
 */
export function SiteFooter({ business, navItems }: SiteFooterProps) {
  return (
    <footer className="bg-surface-inverse text-foreground-inverse">
      <div className="container-content grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Identidade */}
        <div className="flex flex-col gap-3">
          <p className="inline-flex items-center gap-2.5 text-lg font-bold">
            <PawPrintIcon aria-hidden="true" className="size-7 shrink-0 text-brand-300" />
            <span className="font-display">{business.tradeName}</span>
          </p>
          <p className="text-base text-brand-100">
            Banho, tosa, veterinária e loja em {business.address.district}, desde{' '}
            {business.foundedYear}.
          </p>

          {business.socials.length > 0 && (
            <ul className="mt-1 flex items-center gap-2">
              {business.socials.map((social) => (
                <li key={social.platform}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="inline-flex size-(--size-touch-target) items-center justify-center rounded-lg text-brand-100 transition-colors hover:bg-brand-800 hover:text-foreground-inverse"
                  >
                    <SocialIcon platform={social.platform} className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Atalhos */}
        <nav aria-label="Navegação do rodapé" className="flex flex-col gap-3">
          <h2 className="text-base font-bold text-foreground-inverse">Navegue</h2>
          <ul className="flex flex-col">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.anchor}
                  className="inline-flex min-h-(--size-touch-target) items-center rounded-md text-base text-brand-100 transition-colors hover:text-foreground-inverse"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contato e endereço (NAP) */}
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-bold text-foreground-inverse">Contato</h2>
          <ul className="flex flex-col">
            <li>
              <ContactLink kind="whatsapp" business={business} section="footer" tone="inverse" />
            </li>
            <li>
              <ContactLink kind="phone" business={business} section="footer" tone="inverse" />
            </li>
            <li>
              <ContactLink kind="email" business={business} section="footer" tone="inverse" />
            </li>
          </ul>
          <address className="text-base text-brand-100 not-italic">
            {formatFullAddress(business)}
          </address>
        </div>

        {/* Horários */}
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-bold text-foreground-inverse">Horários</h2>
          <ul className="flex flex-col gap-1">
            {summarizeHours(business).map((line) => (
              <li key={line} className="text-base text-brand-100 first-letter:uppercase">
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Razão social, CNPJ, política de privacidade e direitos autorais */}
      <div className="border-t border-brand-800">
        <div className="container-content flex flex-col gap-2 py-6 text-sm text-brand-200 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {business.legalName} · CNPJ {business.taxId}
          </p>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <a
              href={business.privacyPolicyUrl}
              className="underline underline-offset-2 transition-colors hover:text-foreground-inverse"
            >
              Política de privacidade
            </a>
            <span>
              © {COPYRIGHT_YEAR} {business.tradeName}. Todos os direitos reservados.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
