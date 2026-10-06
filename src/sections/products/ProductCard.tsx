import { ResponsiveImage } from '@/components/shared/ResponsiveImage';
import { WhatsAppCta } from '@/components/shared/WhatsAppCta';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import type { Business, Product } from '@/types/content';

export type ProductCardProps = {
  product: Product;
  business: Business;
};

function formatPrice(amount: number): string {
  return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/**
 * Card de produto (S-5).
 *
 * Produto sem `price` exibe "Consulte disponibilidade e preço" — nunca um
 * valor desatualizado (edge case de preço da spec). O CTA nomeia o produto na
 * mensagem (FR-008 / FR-020).
 */
export function ProductCard({ product, business }: ProductCardProps) {
  const { name, category, description, image, availability, price } = product;

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-card-hover">
      <ResponsiveImage
        image={image}
        sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 100vw"
        imgClassName="aspect-square"
      />

      <CardContent className="flex flex-col gap-2 pt-5">
        <p className="text-sm font-bold tracking-wide text-brand-600 uppercase">{category}</p>
        <h3 className="text-lg text-foreground">{name}</h3>
        <p className="text-base text-foreground-muted">{description}</p>

        <p className="mt-1 text-base font-bold text-foreground">
          {price !== undefined ? (
            <>
              a partir de {formatPrice(price.amount)}
            </>
          ) : (
            // Sem preço confirmado, a consulta substitui o valor.
            <span className="text-foreground-muted">Consulte disponibilidade e preço</span>
          )}
        </p>

        <p className="text-sm text-foreground-muted">
          {availability === 'in-store' ? 'Disponível na loja' : 'Encomendamos para você'}
        </p>
      </CardContent>

      <CardFooter>
        <WhatsAppCta
          intent={{ kind: 'product', productId: product.id, productName: name }}
          business={business}
          section="products"
          itemId={product.id}
          label={product.cta.label}
          variant="secondary"
          fullWidth
        />
      </CardFooter>
    </Card>
  );
}
