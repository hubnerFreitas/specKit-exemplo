import { Section } from '@/components/layout/Section';
import { ProofBadge } from '@/components/shared/ProofBadge';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { WhatsAppCta } from '@/components/shared/WhatsAppCta';
import { TestimonialCard } from '@/sections/testimonials/TestimonialCard';
import type { Business, TestimonialsBlock } from '@/types/content';

export type TestimonialsSectionProps = {
  block: TestimonialsBlock | undefined;
  business: Business;
};

/**
 * Prova social (S-6).
 *
 * Retorna `null` quando não há depoimentos: é o tratamento do edge case
 * "prova social insuficiente" da spec. Melhor não exibir a seção do que
 * exibi-la com número inventado (CT-004).
 *
 * `aggregate` só é exibido com `sourceUrl` — garantido pelo schema.
 */
export function TestimonialsSection({ block, business }: TestimonialsSectionProps) {
  if (block === undefined || block.items.length === 0) {
    return null;
  }

  const { aggregate, items } = block;

  return (
    <Section id="testimonials" labelledById="testimonials-title">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          id="testimonials-title"
          eyebrow="Depoimentos"
          title="O que os tutores dizem"
          description="Avaliações públicas de clientes reais. Clique para conferir na fonte."
        />
        {aggregate !== undefined && (
          <ProofBadge
            item={{
              kind: 'rating',
              value: aggregate.rating,
              reviewCount: aggregate.reviewCount,
              sourceUrl: aggregate.sourceUrl,
            }}
            className="shrink-0"
          />
        )}
      </div>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((testimonial) => (
          <li key={testimonial.id} className="flex">
            <TestimonialCard testimonial={testimonial} />
          </li>
        ))}
      </ul>

      {/* CTA no ponto de decisão, logo após a prova (FR-006). */}
      <div className="mt-10 flex flex-col items-center gap-3 text-center">
        <p className="text-lg font-bold text-foreground">
          Quer que o próximo depoimento seja o seu?
        </p>
        <WhatsAppCta
          intent={{ kind: 'general' }}
          business={business}
          section="testimonials"
          label="Agendar pelo WhatsApp"
          size="lg"
        />
      </div>
    </Section>
  );
}
