import { CircleCheckBigIcon } from 'lucide-react';

import { Section } from '@/components/layout/Section';
import { IconBadge } from '@/components/shared/IconBadge';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { resolveContentIcon } from '@/lib/icons';
import type { Differential } from '@/types/content';

export type DifferentialsSectionProps = {
  items: Differential[];
};

/**
 * Diferenciais (S-3).
 *
 * Cada item exibe título, benefício para o tutor e a `evidence` que o
 * sustenta. O campo `evidence` é obrigatório no schema: é o que impede o
 * diferencial genérico de existir (FR-018 / CT-003).
 */
export function DifferentialsSection({ items }: DifferentialsSectionProps) {
  return (
    <Section id="differentials" labelledById="differentials-title" tone="muted">
      <SectionHeading
        id="differentials-title"
        eyebrow="Por que aqui"
        title="O que nos diferencia, na prática"
        description="Cada item abaixo pode ser conferido na sua primeira visita."
      />

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const Icon = resolveContentIcon(item.icon);
          return (
            <li
              key={item.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-6"
            >
              <IconBadge icon={Icon} size="lg" />
              <h3 className="text-xl text-foreground">{item.title}</h3>
              <p className="text-base text-foreground-muted">{item.description}</p>
              {/* A evidência é o que diferencia prova de elogio. */}
              <p className="mt-auto flex items-start gap-2 border-t border-border pt-3 text-sm font-medium text-brand-700">
                <CircleCheckBigIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                {item.evidence}
              </p>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
