import type { Business, SeoContent, Service, TestimonialsBlock } from '@/types/content';

/* ============================================================================
   Dados estruturados de negócio local (FR-028).
   Ver contracts/seo-structured-data.md

   Integridade: name, telephone e address vêm LITERALMENTE de `business` — os
   mesmos valores exibidos na página e no Perfil da Empresa no Google (FR-029).
   ============================================================================ */

const SCHEMA_WEEKDAYS = [
  'https://schema.org/Sunday',
  'https://schema.org/Monday',
  'https://schema.org/Tuesday',
  'https://schema.org/Wednesday',
  'https://schema.org/Thursday',
  'https://schema.org/Friday',
  'https://schema.org/Saturday',
] as const;

function absoluteUrl(canonicalUrl: string, path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return new URL(path, canonicalUrl).toString();
}

function buildStreetAddress(business: Business): string {
  const { street, number, complement } = business.address;
  return complement !== undefined ? `${street}, ${number}, ${complement}` : `${street}, ${number}`;
}

function buildPriceRange(services: readonly Service[]): string | undefined {
  const prices = services.flatMap((service) =>
    service.priceRange !== undefined ? [service.priceRange.min, service.priceRange.max] : [],
  );
  if (prices.length === 0) return undefined;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return `R$${min.toFixed(0)}-R$${max.toFixed(0)}`;
}

export function buildLocalBusinessJsonLd(
  business: Business,
  seo: SeoContent,
  services: readonly Service[],
  testimonials?: TestimonialsBlock,
): Record<string, unknown> {
  const priceRange = buildPriceRange(services);

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'PetStore',
    '@id': `${seo.canonicalUrl}#petshop`,
    name: business.tradeName,
    legalName: business.legalName,
    taxID: business.taxId,
    foundingDate: String(business.foundedYear),
    url: seo.canonicalUrl,
    image: absoluteUrl(seo.canonicalUrl, seo.ogImage.url),
    telephone: business.phone.e164,
    email: business.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: buildStreetAddress(business),
      addressLocality: business.address.city,
      addressRegion: business.address.state,
      postalCode: business.address.postalCode,
      addressCountry: 'BR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: business.address.coordinates.latitude,
      longitude: business.address.coordinates.longitude,
    },
    areaServed: business.serviceAreas.map((area) => ({ '@type': 'City', name: area })),
    // Dias fechados são OMITIDOS, nunca declarados com horário zero.
    openingHoursSpecification: business.hours.weekly
      .filter((day) => !day.closed)
      .flatMap((day) =>
        day.intervals.map((interval) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: SCHEMA_WEEKDAYS[day.weekday],
          opens: interval.opensAt,
          closes: interval.closesAt,
        })),
      ),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Serviços',
      itemListElement: services.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.name,
          description: service.summary,
        },
      })),
    },
  };

  if (business.socials.length > 0) {
    jsonLd['sameAs'] = business.socials.map((social) => social.url);
  }

  if (priceRange !== undefined) {
    jsonLd['priceRange'] = priceRange;
  }

  // Nota agregada só entra com fonte pública. Número sem fonte é dado
  // inventado — proibido por CT-004 e sujeito a penalidade de busca.
  // `review` NÃO é emitido: depoimentos coletados pelo próprio negócio não
  // qualificam como avaliações de terceiros.
  if (testimonials?.aggregate !== undefined) {
    jsonLd['aggregateRating'] = {
      '@type': 'AggregateRating',
      ratingValue: testimonials.aggregate.rating,
      reviewCount: testimonials.aggregate.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return jsonLd;
}

/**
 * Serializa o JSON-LD para injeção no `<head>`.
 * `</` é escapado para que o conteúdo não possa fechar a tag `<script>`
 * prematuramente — única injeção de string autorizada no projeto
 * (contracts/security-and-headers.md).
 */
export function serializeJsonLd(jsonLd: Record<string, unknown>): string {
  return JSON.stringify(jsonLd).replace(/</g, '\\u003c');
}
