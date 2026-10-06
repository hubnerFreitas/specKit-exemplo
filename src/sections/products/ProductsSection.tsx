import { StoreIcon } from 'lucide-react';

import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { ProductCard } from '@/sections/products/ProductCard';
import type { Business, ProductsBlock } from '@/types/content';

export type ProductsSectionProps = {
  block: ProductsBlock;
  business: Business;
};

/**
 * Produtos em destaque (S-5).
 *
 * É vitrine, não e-commerce (premissa de escopo da spec), então a seção
 * declara em texto visível se existe venda on-line — exigência explícita de
 * FR-020, para o visitante não procurar um carrinho que não existe.
 *
 * Itens com `availability === 'unavailable'` são filtrados na renderização.
 */
export function ProductsSection({ block, business }: ProductsSectionProps) {
  const visibleItems = block.items.filter((product) => product.availability !== 'unavailable');

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <Section id="products" labelledById="products-title">
      <SectionHeading
        id="products-title"
        eyebrow="Produtos"
        title="Também temos a loja completa"
        description="Ração, higiene, saúde e acessórios selecionados — as mesmas marcas que usamos no atendimento."
      />

      {/* FR-020: declaração explícita sobre venda on-line. */}
      <p className="mt-5 inline-flex items-start gap-2.5 rounded-lg bg-surface-muted p-4 text-base text-foreground">
        <StoreIcon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-brand-600" />
        {block.onlineSalesAvailable ? (
          <span>
            Você pode comprar pela loja on-line ou retirar presencialmente na Vila Mariana.
          </span>
        ) : (
          <span>
            <strong className="font-bold">Não temos loja on-line.</strong> A venda é presencial, na
            Vila Mariana — mas você pode consultar preço e reservar pelo WhatsApp antes de vir.
          </span>
        )}
      </p>

      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {visibleItems.map((product) => (
          <li key={product.id} className="flex">
            <ProductCard product={product} business={business} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
