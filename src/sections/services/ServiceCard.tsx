import { AlertCircleIcon, CheckIcon, ClockIcon, TagIcon } from 'lucide-react';

import { ResponsiveImage } from '@/components/shared/ResponsiveImage';
import { WhatsAppCta } from '@/components/shared/WhatsAppCta';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import type { Business, PetSize, Service, Species } from '@/types/content';

export type ServiceCardProps = {
  service: Service;
  business: Business;
};

const SPECIES_LABELS: Record<Species, string> = {
  dog: 'Cães',
  cat: 'Gatos',
  other: 'Outros animais',
};

const SIZE_LABELS: Record<PetSize, string> = {
  small: 'pequeno',
  medium: 'médio',
  large: 'grande',
  giant: 'gigante',
};

function formatPrice(amount: number): string {
  return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

/**
 * Card de serviço (S-4).
 *
 * Exibe obrigatoriamente espécie e porte atendidos, inclusões e duração e/ou
 * faixa de preço quando houver (FR-019 / AC-015). O CTA nomeia o serviço na
 * mensagem de WhatsApp (FR-008).
 */
export function ServiceCard({ service, business }: ServiceCardProps) {
  const { name, summary, species, sizes, includes, durationMinutes, priceRange, restrictions, image } =
    service;

  const audience = [
    species.map((item) => SPECIES_LABELS[item]).join(' e '),
    sizes.length > 0 ? `porte ${sizes.map((item) => SIZE_LABELS[item]).join(', ')}` : null,
  ]
    .filter((part): part is string => part !== null)
    .join(' · ');

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-card-hover">
      {image !== undefined && (
        <ResponsiveImage
          image={image}
          sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
          imgClassName="aspect-4/3"
        />
      )}

      <CardContent className="flex flex-col gap-4 pt-5">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-xl text-foreground">{name}</h3>
          {/* Espécie e porte atendidos — exigência de AC-015. */}
          <p className="text-sm font-semibold text-brand-700">{audience}</p>
        </div>

        <p className="text-base text-foreground-muted">{summary}</p>

        <dl className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {durationMinutes !== undefined && (
            <div className="flex items-center gap-1.5">
              <ClockIcon aria-hidden="true" className="size-4 shrink-0 text-brand-600" />
              <dt className="sr-only">Duração estimada</dt>
              <dd className="font-medium text-foreground">
                {durationMinutes.min === durationMinutes.max
                  ? `${durationMinutes.min} min`
                  : `${durationMinutes.min} a ${durationMinutes.max} min`}
              </dd>
            </div>
          )}

          {priceRange !== undefined && (
            <div className="flex items-center gap-1.5">
              <TagIcon aria-hidden="true" className="size-4 shrink-0 text-brand-600" />
              <dt className="sr-only">Faixa de preço</dt>
              <dd className="font-medium text-foreground">
                {priceRange.min === priceRange.max
                  ? formatPrice(priceRange.min)
                  : `${formatPrice(priceRange.min)} a ${formatPrice(priceRange.max)}`}
              </dd>
            </div>
          )}
        </dl>

        <div>
          <h4 className="mb-2 text-sm font-bold tracking-wide text-foreground uppercase">
            O que está incluso
          </h4>
          <ul className="flex flex-col gap-1.5">
            {includes.map((item) => (
              <li key={item} className="flex items-start gap-2 text-base text-foreground-muted">
                <CheckIcon
                  aria-hidden="true"
                  className="mt-1 size-4 shrink-0 text-success"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Restrições declaradas no próprio serviço evitam contato frustrado. */}
        {restrictions.length > 0 && (
          <div className="rounded-lg bg-surface-muted p-3.5">
            <h4 className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-foreground">
              <AlertCircleIcon aria-hidden="true" className="size-4 shrink-0 text-accent-700" />
              Importante saber
            </h4>
            <ul className="flex flex-col gap-1">
              {restrictions.map((item) => (
                <li key={item} className="text-sm text-foreground-muted">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <WhatsAppCta
          intent={{ kind: 'service', serviceId: service.id, serviceName: name }}
          business={business}
          section="services"
          itemId={service.id}
          label={service.cta.label}
          fullWidth
        />
      </CardFooter>
    </Card>
  );
}
