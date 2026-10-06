import type * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // min-h de 44px e texto de 16px: FR-034 / AC-019.
        // 16px também evita o zoom automático do Safari no iOS ao focar.
        'min-h-(--size-touch-target) w-full min-w-0 rounded-lg border border-border-strong bg-surface px-3.5 py-2.5 text-base text-foreground transition-colors outline-none',
        'placeholder:text-foreground-muted',
        'focus-visible:border-brand-600',
        'aria-invalid:border-danger aria-invalid:bg-danger-soft',
        'disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
