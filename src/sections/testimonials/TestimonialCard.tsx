import { ExternalLinkIcon, StarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { Testimonial } from '@/types/content';

export type TestimonialCardProps = {
  testimonial: Testimonial;
};

function formatDate(isoDate: string): string {
  const [year, month] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(year ?? 1970, (month ?? 1) - 1, 1));
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' });
}

/**
 * Depoimento individual (S-6).
 *
 * `authorName` é obrigatório no schema: depoimento anônimo não é prova
 * verificável (FR-021 / CT-004). A nota tem texto equivalente para não
 * depender só das estrelas (FR-036).
 */
export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const { authorName, petName, quote, rating, date, sourceUrl } = testimonial;

  return (
    <figure className="flex h-full flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-card">
      {rating !== undefined && (
        <p className="flex items-center gap-1">
          {/* `aria-label` é proibido em <p> (role genérico): o nome acessível
              vem de texto visualmente oculto, que funciona em qualquer
              leitor de tela. */}
          <span className="sr-only">Nota {rating} de 5</span>
          {Array.from({ length: 5 }, (_, index) => (
            <StarIcon
              key={index}
              aria-hidden="true"
              className={cn(
                'size-4.5',
                index < rating ? 'fill-accent-500 text-accent-500' : 'text-border-strong',
              )}
            />
          ))}
        </p>
      )}

      <blockquote className="text-base text-foreground">
        <p>“{quote}”</p>
      </blockquote>

      <figcaption className="mt-auto flex flex-col gap-0.5 border-t border-border pt-4">
        <p className="text-base font-bold text-foreground">
          {authorName}
          {petName !== undefined && (
            <span className="font-normal text-foreground-muted"> · tutor de {petName}</span>
          )}
        </p>
        <p className="text-sm text-foreground-muted">
          <time dateTime={date}>{formatDate(date)}</time>
          {sourceUrl !== undefined && (
            <>
              {' · '}
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-brand-700 underline underline-offset-2"
              >
                ver no Google
                <ExternalLinkIcon aria-hidden="true" className="size-3.5" />
              </a>
            </>
          )}
        </p>
      </figcaption>
    </figure>
  );
}
