import { ClockIcon } from 'lucide-react';

import { useOpenStatus } from '@/hooks/useOpenStatus';
import { WEEKDAY_LABELS } from '@/lib/business-hours';
import { cn } from '@/lib/utils';
import type { BusinessHours } from '@/types/content';

export type OpenStatusBadgeProps = {
  hours: BusinessHours;
  tone?: 'default' | 'inverse';
  className?: string;
};

/**
 * Indicador "aberto agora" / próximo horário (FR-004).
 *
 * Com `state: 'unknown'` NÃO renderiza nada — nem um esqueleto que mude o
 * layout. É o que mantém o HTML pré-renderizado idêntico à primeira
 * renderização do cliente (research.md R-09) e o CLS em zero.
 *
 * O texto traz sempre a informação completa ("Fechado — abre terça às 08:00"),
 * nunca apenas um ponto colorido (FR-036 / AC-023).
 */
export function OpenStatusBadge({ hours, tone = 'default', className }: OpenStatusBadgeProps) {
  const status = useOpenStatus(hours);

  if (status.state === 'unknown') {
    return null;
  }

  const isOpen = status.state === 'open';
  const label = isOpen
    ? `Aberto agora — até ${status.closesAt}`
    : `Fechado agora — abre ${WEEKDAY_LABELS[status.nextOpenWeekday]} às ${status.nextOpenAt}`;

  return (
    <p
      className={cn(
        'inline-flex items-center gap-2 rounded-pill px-3.5 py-1.5 text-sm font-semibold',
        isOpen
          ? tone === 'inverse'
            ? 'bg-success/25 text-foreground-inverse'
            : 'bg-success-soft text-success'
          : tone === 'inverse'
            ? 'bg-brand-800/70 text-brand-100'
            : 'bg-surface-muted text-foreground-muted',
        className,
      )}
    >
      <ClockIcon aria-hidden="true" className="size-4 shrink-0" />
      {label}
    </p>
  );
}
