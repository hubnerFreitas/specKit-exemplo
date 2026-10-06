import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';

import { App } from '@/App';
import { getSiteContent } from '@/content/index';
import { buildLocalBusinessJsonLd, serializeJsonLd } from '@/lib/seo/jsonld';
import { buildMetaTagsHtml } from '@/lib/seo/meta';

/**
 * Ponto de entrada da pré-renderização.
 *
 * Compilado por `vite build --ssr` para `dist-ssr/entry-prerender.js` e
 * executado por `scripts/prerender.mjs`. Passar pelo build SSR (e não pelo
 * transform de desenvolvimento) é o que garante que os imports de imagem
 * resolvam para os assets com hash do build do cliente.
 */
export function renderPage(): { html: string; jsonLd: string; meta: string } {
  const { business, seo, services, testimonials } = getSiteContent();

  return {
    html: renderToString(
      <StrictMode>
        <App />
      </StrictMode>,
    ),
    jsonLd: serializeJsonLd(buildLocalBusinessJsonLd(business, seo, services, testimonials)),
    meta: buildMetaTagsHtml(business, seo),
  };
}
