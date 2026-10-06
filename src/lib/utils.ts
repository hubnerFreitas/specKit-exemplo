import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina classes condicionais e resolve conflitos de utilitários Tailwind.
 * Única dependência permitida em `src/components/ui/`
 * (ver contracts/component-contracts.md).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
