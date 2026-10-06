import { z } from 'zod';

/**
 * Identificadores das seções da página.
 *
 * Mora em módulo próprio, sem nenhuma dependência dos schemas de conteúdo, de
 * propósito: o formulário de contato precisa dele em runtime no navegador,
 * enquanto `content.schema.ts` é usado apenas no build. Manter os dois juntos
 * arrastaria todos os schemas de conteúdo para o bundle do cliente.
 */
export const sectionIdSchema = z.enum([
  'header',
  'hero',
  'about',
  'differentials',
  'services',
  'products',
  'testimonials',
  'faq',
  'contact',
  'footer',
  'mobile-bar',
]);

export type SectionId = z.infer<typeof sectionIdSchema>;
