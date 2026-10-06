import { cn } from '@/lib/utils';
import type { ImageAsset } from '@/types/content';

export type ResponsiveImageProps = {
  image: ImageAsset;
  /** Obrigatório: sem `sizes` o navegador escolhe a derivada errada. */
  sizes: string;
  /** `true` apenas no hero — tudo mais carrega sob demanda. */
  priority?: boolean;
  className?: string;
  imgClassName?: string;
};

/**
 * Único componente do projeto que renderiza imagem.
 *
 * Invariantes:
 * - `<picture>` com um `<source type>` por formato (AVIF → WebP → fallback);
 * - `width`/`height` vindos do próprio ImageAsset, o que elimina CLS (AC-027);
 * - `priority` ⇒ eager + fetchpriority=high; ausente ⇒ lazy + decoding=async;
 * - `decorative` ⇒ alt="" + aria-hidden (FR-030 / AC-026).
 */
export function ResponsiveImage({
  image,
  sizes,
  priority = false,
  className,
  imgClassName,
}: ResponsiveImageProps) {
  const { source, alt, decorative, width, height } = image;

  return (
    <picture className={cn('block', className)}>
      {Object.entries(source.sources).map(([format, srcSet]) => (
        <source key={format} type={`image/${format}`} srcSet={srcSet} sizes={sizes} />
      ))}
      <img
        src={source.img.src}
        alt={decorative === true ? '' : alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        {...(priority ? { fetchPriority: 'high' as const } : {})}
        {...(decorative === true ? { 'aria-hidden': true } : {})}
        className={cn('h-auto w-full object-cover', imgClassName)}
      />
    </picture>
  );
}
