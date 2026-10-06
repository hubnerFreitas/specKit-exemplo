import { MapPinIcon } from 'lucide-react';

import { CtaButton } from '@/components/shared/CtaButton';
import { OpenStatusBadge } from '@/components/shared/OpenStatusBadge';
import { ProofBadge } from '@/components/shared/ProofBadge';
import { ResponsiveImage } from '@/components/shared/ResponsiveImage';
import { WhatsAppCta } from '@/components/shared/WhatsAppCta';
import type { Business, HeroContent } from '@/types/content';

export type HeroSectionProps = {
  content: HeroContent;
  business: Business;
};

/**
 * Seção principal (S-1) — o único `<h1>` da página.
 *
 * Em 360×640 devem caber, sem rolagem: identidade (no header), proposta,
 * ao menos um elemento de prova, a localidade atendida e o CTA principal
 * (FR-005 / FR-016 / AC-002).
 */
export function HeroSection({ content, business }: HeroSectionProps) {
  const { headline, subheadline, proofItems, primaryCta, secondaryCta, image } = content;
  const [firstProof, ...otherProofs] = proofItems;

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="bg-surface-inverse text-foreground-inverse"
    >
      <div className="container-content grid gap-8 py-10 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14 lg:py-20">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2.5">
            <p className="inline-flex items-center gap-1.5 rounded-pill bg-brand-800/70 px-3.5 py-1.5 text-sm font-semibold text-brand-100">
              <MapPinIcon aria-hidden="true" className="size-4 shrink-0" />
              {business.address.district}, {business.address.city}
            </p>
            <OpenStatusBadge hours={business.hours} tone="inverse" />
          </div>

          <h1 id="hero-title" className="text-3xl text-foreground-inverse sm:text-4xl lg:text-5xl">
            {headline}
          </h1>

          <p className="max-w-(--container-prose) text-lg text-brand-100">{subheadline}</p>

          {/* Prova acima da dobra: mínimo garantido pelo schema (Princípio II). */}
          {firstProof !== undefined && (
            <div className="flex flex-wrap gap-2.5">
              <ProofBadge item={firstProof} tone="inverse" />
              {otherProofs.map((proof) => (
                <ProofBadge
                  key={proof.kind}
                  item={proof}
                  tone="inverse"
                  size="sm"
                  className="hidden sm:inline-flex"
                />
              ))}
            </div>
          )}

          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
            <WhatsAppCta
              intent={{ kind: 'general' }}
              business={business}
              section="hero"
              label={primaryCta.label}
              variant="accent"
              size="lg"
              fullWidth
              className="sm:w-auto"
            />
            {secondaryCta !== undefined && (
              <CtaButton
                cta={secondaryCta}
                section="hero"
                variant="ghost"
                size="lg"
                fullWidth
                className="text-foreground-inverse hover:bg-brand-800 sm:w-auto"
              />
            )}
          </div>

          <p className="text-sm text-brand-200">{business.responseTimeLabel}</p>
        </div>

        {/* Imagem do hero: `priority` ⇒ eager + fetchpriority=high (LCP). */}
        <ResponsiveImage
          image={image}
          sizes="(min-width: 1024px) 45vw, 100vw"
          priority
          className="overflow-hidden rounded-xl shadow-card-hover"
          imgClassName="aspect-4/3 lg:aspect-square"
        />
      </div>
    </section>
  );
}
