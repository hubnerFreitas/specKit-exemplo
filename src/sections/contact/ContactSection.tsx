import { CarFrontIcon, MapPinIcon } from 'lucide-react';

import { Section } from '@/components/layout/Section';
import { ContactLink, formatFullAddress } from '@/components/shared/ContactLink';
import { OpenStatusBadge } from '@/components/shared/OpenStatusBadge';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { BusinessHoursTable } from '@/sections/contact/BusinessHoursTable';
import { ContactForm } from '@/sections/contact/ContactForm';
import { MapEmbed } from '@/sections/contact/MapEmbed';
import type { Business, Service } from '@/types/content';

export type ContactSectionProps = {
  business: Business;
  services: Service[];
};

/**
 * Contato e localização (S-8).
 *
 * Todos os dados são texto selecionável e acionável (FR-024): o endereço nunca
 * é apenas imagem, e o link de rota fica sempre visível, independente de o
 * mapa ser carregado (R-12).
 */
export function ContactSection({ business, services }: ContactSectionProps) {
  return (
    <Section id="contact" labelledById="contact-title">
      <SectionHeading
        id="contact-title"
        eyebrow="Contato"
        title="Vamos marcar o horário do seu pet"
        description="Responda pelo canal que preferir. No WhatsApp a resposta costuma ser mais rápida."
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Dados visíveis */}
        <div className="flex flex-col gap-7">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl text-foreground">Fale com a gente</h3>
            <ul className="mt-1 flex flex-col">
              <li>
                <ContactLink kind="whatsapp" business={business} section="contact" />
              </li>
              <li>
                <ContactLink kind="phone" business={business} section="contact" />
              </li>
              <li>
                <ContactLink kind="email" business={business} section="contact" />
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-xl text-foreground">Onde estamos</h3>
            {/* Endereço como texto selecionável, nunca só imagem (FR-024). */}
            <address className="flex items-start gap-2.5 text-base text-foreground not-italic">
              <MapPinIcon aria-hidden="true" className="mt-1 size-5 shrink-0 text-brand-600" />
              <span>{formatFullAddress(business)}</span>
            </address>
            <p className="flex items-start gap-2.5 text-base text-foreground-muted">
              <CarFrontIcon aria-hidden="true" className="mt-1 size-5 shrink-0 text-brand-600" />
              {business.address.landmark}
            </p>
            {/* Link de rota sempre disponível, independente do mapa. */}
            <ContactLink
              kind="address"
              business={business}
              section="contact"
              showIcon={false}
              className="self-start font-semibold text-brand-700 underline underline-offset-4"
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xl text-foreground">Horário de atendimento</h3>
              <OpenStatusBadge hours={business.hours} />
            </div>
            <BusinessHoursTable hours={business.hours} />
          </div>

          <MapEmbed business={business} />
        </div>

        {/* Formulário */}
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface-muted p-6 lg:p-8">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl text-foreground">Solicitar agendamento</h3>
            <p className="text-base text-foreground-muted">
              Quatro campos, sem cadastro. A gente retorna com o horário e o valor.
            </p>
          </div>
          <ContactForm services={services} business={business} />
        </div>
      </div>
    </Section>
  );
}
