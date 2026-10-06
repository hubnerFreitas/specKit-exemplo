import { CalendarCheckIcon, PawPrintIcon, StarIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import type { ProofItem } from '@/types/content';

export type ProofBadgeProps = {
  item: ProofItem;
  size?: 'sm' | 'md';
  tone?: 'default' | 'inverse';
  className?: string;
};

/**
 * Elemento de prova verificável (Princípio II).
 *
 * Invariantes:
 * - `kind: 'rating'` exibe nota E contagem de avaliações: número isolado é
 *   proibido por CT-004;
 * - com `sourceUrl`, envolve em link para a fonte pública;
 * - a informação nunca depende só de cor nem só das estrelas — há sempre texto
 *   equivalente (FR-036 / AC-023).
 */
export function ProofBadge({ item, size = 'md', tone = 'default', className }: ProofBadgeProps) {
  const content = renderContent(item, size, tone);

  const wrapper = cn(
    'inline-flex items-center gap-2 rounded-pill border px-3.5 py-2',
    tone === 'inverse'
      ? 'border-brand-700 bg-brand-800/60 text-foreground-inverse'
      : 'border-border bg-surface text-foreground',
    size === 'sm' ? 'text-sm' : 'text-base',
    className,
  );

  if (item.kind === 'rating' && item.sourceUrl !== undefined) {
    return (
      <a
        href={item.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(wrapper, 'min-h-(--size-touch-target) transition-colors', {
          'hover:border-brand-600': tone === 'default',
          'hover:border-brand-400': tone === 'inverse',
        })}
      >
        {content}
      </a>
    );
  }

  return <span className={wrapper}>{content}</span>;
}

function renderContent(
  item: ProofItem,
  size: 'sm' | 'md',
  tone: 'default' | 'inverse',
): ReactNode {
  const iconClass = cn(
    size === 'sm' ? 'size-4' : 'size-5',
    'shrink-0',
    tone === 'inverse' ? 'text-accent-300' : 'text-accent-700',
  );

  switch (item.kind) {
    case 'rating':
      return (
        <>
          <StarIcon aria-hidden="true" className={cn(iconClass, 'fill-current')} />
          <span>
            <strong className="font-bold">{item.value.toFixed(1)}</strong>
            {/* Contagem junto da nota: CT-004 proíbe número isolado. */}
            <span className={tone === 'inverse' ? 'text-brand-100' : 'text-foreground-muted'}>
              {' '}
              de 5 em {item.reviewCount} avaliações
            </span>
          </span>
        </>
      );
    case 'experience':
      return (
        <>
          <CalendarCheckIcon aria-hidden="true" className={iconClass} />
          <span>
            <strong className="font-bold">{item.years} anos</strong>
            <span className={tone === 'inverse' ? 'text-brand-100' : 'text-foreground-muted'}>
              {' '}
              no mesmo endereço
            </span>
          </span>
        </>
      );
    case 'volume':
      return (
        <>
          <PawPrintIcon aria-hidden="true" className={iconClass} />
          <span>
            <strong className="font-bold">{item.value}</strong>
            <span className={tone === 'inverse' ? 'text-brand-100' : 'text-foreground-muted'}>
              {' '}
              {item.label}
            </span>
          </span>
        </>
      );
  }
}
