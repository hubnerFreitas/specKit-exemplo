import { ChevronDownIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export type DisclosureProps = {
  /** Conteúdo do gatilho. Fica dentro do <summary>. */
  question: ReactNode;
  children: ReactNode;
  /** Envolve o gatilho no nível de título correto (hierarquia sem saltos). */
  headingLevel?: 'h3' | 'h4';
  defaultOpen?: boolean;
  className?: string;
};

/**
 * Bloco expansível sobre `<details>/<summary>` nativos.
 *
 * Por que nativo em vez do Accordion do Radix:
 * 1. O Radix injeta custom properties como `style` inline para animar altura —
 *    recurso que não usamos — e isso viola `style-src 'self'` da nossa CSP
 *    (contracts/security-and-headers.md). Trocar a CSP por 'unsafe-inline'
 *    seria enfraquecer a política por um detalhe de implementação.
 * 2. `<details>` funciona COM JAVASCRIPT DESABILITADO, o que fortalece FR-032:
 *    as respostas não só estão no HTML como continuam abríveis sem o bundle.
 * 3. `<summary>` já é focável, operável por Enter e Espaço, e tem o estado
 *    expandido/recolhido anunciado nativamente por leitores de tela (FR-023 /
 *    AC-022), sem nenhum ARIA manual.
 */
export function Disclosure({
  question,
  children,
  headingLevel: Heading = 'h3',
  defaultOpen = false,
  className,
}: DisclosureProps) {
  return (
    <details
      open={defaultOpen}
      className={cn('group border-b border-border last:border-b-0', className)}
    >
      <Heading className="text-lg">
        <summary
          className={cn(
            'flex min-h-(--size-touch-target) cursor-pointer list-none items-start justify-between gap-4',
            'rounded-md py-4 text-left text-lg font-semibold text-foreground transition-colors',
            'hover:text-brand-700',
            // Remove o marcador padrão em todos os navegadores.
            '[&::-webkit-details-marker]:hidden',
          )}
        >
          {question}
          <ChevronDownIcon
            aria-hidden="true"
            className="mt-1 size-5 shrink-0 text-brand-600 transition-transform duration-200 group-open:rotate-180"
          />
        </summary>
      </Heading>
      <div className="pb-5 text-base text-foreground-muted">{children}</div>
    </details>
  );
}
