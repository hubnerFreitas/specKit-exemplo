import { cn } from '@/lib/utils';

export type SectionHeadingProps = {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  /** 'h1' é exclusivo do hero — garante um único h1 na página (FR-026). */
  as?: 'h1' | 'h2';
  align?: 'start' | 'center';
  tone?: 'default' | 'inverse';
  className?: string;
};

/**
 * Emite exatamente um título do nível informado, com o `id` que o
 * `aria-labelledby` do `<Section>` referencia.
 * O `eyebrow` é um `<p>`, nunca um heading — é o que impede o salto de
 * hierarquia que quebraria AC-029.
 */
export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  as = 'h2',
  align = 'start',
  tone = 'default',
  className,
}: SectionHeadingProps) {
  const Heading = as;

  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {eyebrow !== undefined && (
        <p
          className={cn(
            'text-sm font-bold tracking-wider uppercase',
            tone === 'inverse' ? 'text-brand-200' : 'text-brand-600',
          )}
        >
          {eyebrow}
        </p>
      )}

      <Heading
        id={id}
        className={cn(
          as === 'h1' ? 'text-3xl sm:text-4xl lg:text-5xl' : 'text-2xl sm:text-3xl lg:text-4xl',
          tone === 'inverse' ? 'text-foreground-inverse' : 'text-foreground',
        )}
      >
        {title}
      </Heading>

      {description !== undefined && (
        <p
          className={cn(
            'max-w-(--container-prose) text-lg',
            align === 'center' && 'mx-auto',
            tone === 'inverse' ? 'text-brand-100' : 'text-foreground-muted',
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
