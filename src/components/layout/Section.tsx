import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import type { SectionId } from '@/types/analytics';

export type SectionProps = {
  id: SectionId;
  labelledById: string;
  children: ReactNode;
  tone?: 'default' | 'muted' | 'brand';
  spacing?: 'default' | 'tight';
  className?: string;
};

const toneClasses = {
  default: 'bg-surface text-foreground',
  muted: 'bg-surface-muted text-foreground',
  brand: 'bg-surface-inverse text-foreground-inverse',
} as const;

/**
 * Envelope estrutural de toda seção.
 * Existe para que semântica (FR-026) e ritmo vertical (Princípio V) sejam
 * decisões tomadas uma única vez, e não repetidas em cada seção.
 */
export function Section({
  id,
  labelledById,
  children,
  tone = 'default',
  spacing = 'default',
  className,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledById}
      className={cn(
        toneClasses[tone],
        spacing === 'default'
          ? 'py-(--spacing-section) lg:py-(--spacing-section-lg)'
          : 'py-10 lg:py-14',
        className,
      )}
    >
      <div className="container-content">{children}</div>
    </section>
  );
}
