import type * as React from 'react';

import { cn } from '@/lib/utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'field-sizing-content flex min-h-24 w-full rounded-lg border border-border-strong bg-surface px-3.5 py-2.5 text-base text-foreground transition-colors outline-none',
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

export { Textarea };
