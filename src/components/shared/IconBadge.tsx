import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export type IconBadgeProps = {
  icon: LucideIcon;
  tone?: 'brand' | 'neutral' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const toneClasses = {
  brand: 'bg-brand-50 text-brand-700',
  neutral: 'bg-surface-muted text-foreground-muted',
  accent: 'bg-accent-100 text-accent-700',
} as const;

const sizeClasses = {
  sm: 'size-9 [&>svg]:size-4',
  md: 'size-11 [&>svg]:size-5',
  lg: 'size-14 [&>svg]:size-7',
} as const;

/**
 * Selo puramente decorativo: sempre `aria-hidden`.
 * Nunca é o único portador de informação (FR-036).
 */
export function IconBadge({ icon: Icon, tone = 'brand', size = 'md', className }: IconBadgeProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-lg',
        toneClasses[tone],
        sizeClasses[size],
        className,
      )}
    >
      <Icon />
    </span>
  );
}
