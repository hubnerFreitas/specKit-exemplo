export type SkipLinkProps = {
  targetId?: string;
};

/**
 * Primeiro elemento focável do documento (AC-022).
 * Visualmente oculto até receber foco, e então plenamente visível com
 * contraste conforme.
 */
export function SkipLink({ targetId = 'conteudo-principal' }: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-[100] focus-visible:inline-flex focus-visible:min-h-(--size-touch-target) focus-visible:items-center focus-visible:rounded-lg focus-visible:bg-brand-700 focus-visible:px-5 focus-visible:text-base focus-visible:font-semibold focus-visible:text-foreground-inverse"
    >
      Pular para o conteúdo principal
    </a>
  );
}
