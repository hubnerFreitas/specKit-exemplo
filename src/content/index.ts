import { about } from '@/content/about';
import { business, navItems, seo } from '@/content/business';
import { differentials } from '@/content/differentials';
import { faq } from '@/content/faq';
import { hero } from '@/content/hero';
import { products } from '@/content/products';
import { testimonials } from '@/content/testimonials';
import { services } from '@/content/services';
import type { SiteContent } from '@/types/content';

/* ============================================================================
   Provider de conteúdo — ÚNICO ponto de acesso aos dados.

   `src/pages/HomePage.tsx` é o único consumidor; as seções recebem tudo por
   props e nunca importam esta pasta. É essa regra que torna a migração para um
   CMS uma mudança de duas peças (este arquivo + o tipo de retorno) em vez de
   uma varredura por todos os componentes (research.md R-05).

   Migração futura: a assinatura passa a `Promise<SiteContent>`, a busca
   acontece em scripts/prerender.ts (que roda em Node, no build) e os schemas
   continuam sendo o ponto de validação.
   ============================================================================ */

const content: SiteContent = {
  business,
  nav: navItems,
  hero,
  about,
  differentials,
  services,
  products,
  testimonials,
  faq,
  seo,
};

/**
 * Retorna o conteúdo do site.
 *
 * NÃO valida aqui de propósito: importar `siteContentSchema` neste módulo
 * arrastaria todos os schemas de conteúdo para o bundle do navegador, embora
 * eles sejam necessários apenas no build. A validação acontece em
 * `scripts/validate-content.ts`, que roda antes do `vite build` e aborta em
 * qualquer violação (contracts/content-schemas.md).
 */
export function getSiteContent(): SiteContent {
  return content;
}
