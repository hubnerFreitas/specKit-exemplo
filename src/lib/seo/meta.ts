import type { Business, SeoContent } from '@/types/content';

/* ============================================================================
   Metadados derivados exclusivamente de `business` e `seo`.
   É essa derivação única que faz o NAP ser idêntico em toda a página
   (FR-029 / AC-017) sem depender de disciplina humana.
   ============================================================================ */

export type MetaTag = { name?: string; property?: string; content: string };

function absoluteUrl(canonicalUrl: string, path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return new URL(path, canonicalUrl).toString();
}

export function buildMetaTags(business: Business, seo: SeoContent): MetaTag[] {
  const ogImageUrl = absoluteUrl(seo.canonicalUrl, seo.ogImage.url);

  return [
    { name: 'description', content: seo.description },
    { name: 'geo.region', content: `BR-${business.address.state}` },
    { name: 'geo.placename', content: business.address.city },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: business.tradeName },
    { property: 'og:title', content: seo.title },
    { property: 'og:description', content: seo.description },
    { property: 'og:url', content: seo.canonicalUrl },
    { property: 'og:image', content: ogImageUrl },
    { property: 'og:image:alt', content: seo.ogImage.alt },
    { property: 'og:image:width', content: String(seo.ogImage.width) },
    { property: 'og:image:height', content: String(seo.ogImage.height) },
    { property: 'og:locale', content: 'pt_BR' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: seo.title },
    { name: 'twitter:description', content: seo.description },
    { name: 'twitter:image', content: ogImageUrl },
  ];
}

export function buildMetaTagsHtml(business: Business, seo: SeoContent): string {
  return buildMetaTags(business, seo)
    .map((tag) => {
      const attribute = tag.name !== undefined ? `name="${tag.name}"` : `property="${tag.property}"`;
      return `    <meta ${attribute} content="${escapeAttribute(tag.content)}" />`;
    })
    .join('\n');
}

export function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
