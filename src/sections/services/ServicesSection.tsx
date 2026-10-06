import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { WhatsAppCta } from '@/components/shared/WhatsAppCta';
import { ServiceCard } from '@/sections/services/ServiceCard';
import type { Business, Service } from '@/types/content';

export type ServicesSectionProps = {
  items: Service[];
  business: Business;
};

/**
 * Serviços (S-4).
 *
 * Mobile-first: coluna única por padrão, colunas a partir de `sm:`/`lg:`.
 * O CTA ao final é o ponto de decisão da seção (FR-006) e usa variante
 * diferente dos CTAs dos cards para não competir com eles (FR-010).
 */
export function ServicesSection({ items, business }: ServicesSectionProps) {
  return (
    <Section id="services" labelledById="services-title" tone="muted">
      <SectionHeading
        id="services-title"
        eyebrow="Serviços"
        title="O que fazemos pelo seu pet"
        description="Cada serviço abaixo informa para quem é, o que está incluso e quanto tempo leva. Se o caso do seu animal não estiver aqui, chame no WhatsApp que a gente avalia."
      />

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((service) => (
          <li key={service.id} className="flex">
            <ServiceCard service={service} business={business} />
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-col items-start gap-3 rounded-xl border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-bold text-foreground">
            Não sabe qual serviço o seu pet precisa?
          </p>
          <p className="text-base text-foreground-muted">
            Conte a raça, o porte e como está o pelo. A gente indica e já passa o valor.
          </p>
        </div>
        <WhatsAppCta
          intent={{ kind: 'general' }}
          business={business}
          section="services"
          label="Perguntar no WhatsApp"
          size="lg"
          fullWidth
          className="sm:w-auto sm:shrink-0"
        />
      </div>
    </Section>
  );
}
