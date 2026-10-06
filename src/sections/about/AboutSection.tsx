import { BadgeCheckIcon } from 'lucide-react';

import { Section } from '@/components/layout/Section';
import { ResponsiveImage } from '@/components/shared/ResponsiveImage';
import { SectionHeading } from '@/components/shared/SectionHeading';
import type { AboutContent, Business } from '@/types/content';

export type AboutSectionProps = {
  content: AboutContent;
  business: Business;
};

/**
 * Institucional (S-2).
 *
 * Exibe história, tempo de atuação, equipe, fotos reais do espaço e os dados
 * verificáveis — cujo mínimo de 1 item é garantido pelo schema, porque o
 * Princípio II não aceita afirmação sem prova.
 */
export function AboutSection({ content, business }: AboutSectionProps) {
  const { title, paragraphs, verifiableFacts, team, images } = content;
  const [firstImage, ...otherImages] = images;

  return (
    <Section id="about" labelledById="about-title">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-14">
        <div className="flex flex-col gap-5">
          <SectionHeading id="about-title" eyebrow="Sobre nós" title={title} />

          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="text-base text-foreground-muted">
              {paragraph}
            </p>
          ))}

          {/* Dados verificáveis: o que transforma a narrativa em prova. */}
          <dl className="mt-1 grid gap-x-6 gap-y-4 rounded-xl border border-border bg-surface-muted p-5 sm:grid-cols-2">
            {verifiableFacts.map((fact) => (
              <div key={fact.label} className="flex flex-col gap-0.5">
                <dt className="flex items-center gap-1.5 text-sm font-bold tracking-wide text-foreground-muted uppercase">
                  <BadgeCheckIcon aria-hidden="true" className="size-4 shrink-0 text-brand-600" />
                  {fact.label}
                </dt>
                <dd className="text-base text-foreground">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex flex-col gap-6">
          {firstImage !== undefined && (
            <ResponsiveImage
              image={firstImage}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="overflow-hidden rounded-xl shadow-card"
              imgClassName="aspect-4/3"
            />
          )}

          {otherImages.length > 0 && (
            <ul className="grid grid-cols-2 gap-4">
              {otherImages.map((image) => (
                <li key={image.source.img.src}>
                  <ResponsiveImage
                    image={image}
                    sizes="(min-width: 1024px) 22vw, 50vw"
                    className="overflow-hidden rounded-lg shadow-card"
                    imgClassName="aspect-square"
                  />
                </li>
              ))}
            </ul>
          )}

          {team.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-xl text-foreground">Quem vai cuidar do seu pet</h3>
              <ul className="flex flex-col gap-4">
                {team.map((member) => (
                  <li key={member.name} className="flex items-center gap-4">
                    {member.photo !== undefined && (
                      <ResponsiveImage
                        image={member.photo}
                        sizes="72px"
                        className="size-18 shrink-0 overflow-hidden rounded-pill"
                        imgClassName="aspect-square"
                      />
                    )}
                    <div className="flex flex-col">
                      <p className="text-base font-bold text-foreground">{member.name}</p>
                      <p className="text-sm text-foreground-muted">{member.role}</p>
                      {member.credential !== undefined && (
                        <p className="text-sm font-medium text-brand-700">{member.credential}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-sm text-foreground-muted">
            {business.legalName} · CNPJ {business.taxId}
          </p>
        </div>
      </div>
    </Section>
  );
}
