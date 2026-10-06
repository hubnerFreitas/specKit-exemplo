import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/lib/utils';

/**
 * Alturas derivadas de --size-touch-target (44px) para atender FR-034/AC-019.
 * Cores vindas exclusivamente dos tokens de theme.css (Princípio V).
 */
const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-lg text-base font-semibold whitespace-nowrap transition-colors outline-none disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-brand-600 text-foreground-inverse shadow-card hover:bg-brand-700 active:bg-brand-800',
        secondary:
          'border-2 border-brand-600 bg-surface text-brand-700 hover:bg-brand-50 active:bg-brand-100',
        ghost: 'text-brand-700 hover:bg-brand-50 active:bg-brand-100',
        accent:
          'bg-accent-500 text-foreground shadow-card hover:bg-accent-700 hover:text-foreground-inverse',
        danger: 'bg-danger text-foreground-inverse hover:opacity-90',
      },
      size: {
        default: 'min-h-(--size-touch-target) px-5 py-2.5',
        lg: 'min-h-13 px-7 py-3 text-lg',
        compact: 'min-h-(--size-touch-target) px-3 py-2 text-sm',
        icon: 'size-(--size-touch-target) p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
