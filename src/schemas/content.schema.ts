import { z } from 'zod';

import { sectionIdSchema } from '@/schemas/section-id.schema';

export { sectionIdSchema };

/* ============================================================================
   Schemas de conteúdo — fonte ÚNICA de verdade.
   Todos os tipos em src/types/content.ts são derivados daqui por z.infer.
   Regras transcritas de specs/001-petshop-home-comercial/data-model.md.
   ============================================================================ */

const CURRENT_YEAR = new Date().getFullYear();
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Converte "HH:MM" em minutos desde a meia-noite, para comparar intervalos. */
function toMinutes(time: string): number {
  const [hours, minutes] = time.split(':');
  return Number(hours) * 60 + Number(minutes);
}

/* -- Blocos reutilizáveis -------------------------------------------------- */

export const imageAssetSchema = z
  .object({
    /** Objeto gerado por vite-imagetools com `as=picture`. */
    source: z.object({
      sources: z.record(z.string(), z.string()),
      img: z.object({ src: z.string(), w: z.number(), h: z.number() }),
    }),
    alt: z.string(),
    decorative: z.boolean().optional(),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    /** Obrigatório em fotos com pessoas ou animais identificáveis (CT-005/LGPD). */
    mediaConsent: z.boolean().optional(),
  })
  .refine((image) => image.decorative === true || image.alt.trim().length > 0, {
    message: 'alt é obrigatório; string vazia só é permitida quando decorative === true (FR-030)',
    path: ['alt'],
  });

export const ctaChannelSchema = z.enum(['whatsapp', 'phone', 'form', 'route', 'anchor']);

export const ctaDefinitionSchema = z
  .object({
    /** No máximo 40 caracteres para não quebrar em telas de 360px (CT-007). */
    label: z.string().min(1).max(40),
    channel: ctaChannelSchema,
    intent: z.string().min(1),
    anchorId: z.string().min(1).optional(),
  })
  .refine((cta) => cta.channel !== 'anchor' || typeof cta.anchorId === 'string', {
    message: 'anchorId é obrigatório quando channel === "anchor"',
    path: ['anchorId'],
  });

export const addressSchema = z.object({
  street: z.string().min(1),
  number: z.string().min(1),
  complement: z.string().min(1).optional(),
  district: z.string().min(1),
  city: z.string().min(1),
  state: z.string().regex(/^[A-Z]{2}$/, 'UF deve ter exatamente 2 letras maiúsculas'),
  postalCode: z.string().regex(/^\d{5}-\d{3}$/, 'CEP deve seguir o formato 00000-000'),
  /** Ponto de referência é exigido por FR-024. */
  landmark: z.string().min(1, 'landmark é obrigatório (FR-024)'),
  coordinates: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
});

export const phoneNumberSchema = z.object({
  /** Usado em tel: e wa.me — nunca exibido. */
  e164: z.string().regex(/^\+55\d{10,11}$/, 'e164 deve seguir o formato +55DDNNNNNNNNN'),
  /** Usado no texto visível — nunca em href. */
  display: z
    .string()
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'display deve seguir o formato (00) 00000-0000'),
});

export const timeIntervalSchema = z
  .object({
    opensAt: z.string().regex(TIME_PATTERN, 'opensAt deve seguir o formato HH:MM'),
    closesAt: z.string().regex(TIME_PATTERN, 'closesAt deve seguir o formato HH:MM'),
  })
  .refine((interval) => toMinutes(interval.closesAt) > toMinutes(interval.opensAt), {
    message: 'closesAt deve ser maior que opensAt',
    path: ['closesAt'],
  });

/** Nenhum intervalo do mesmo dia pode se sobrepor. */
function hasNoOverlap(intervals: readonly { opensAt: string; closesAt: string }[]): boolean {
  const sorted = intervals.toSorted((a, b) => toMinutes(a.opensAt) - toMinutes(b.opensAt));
  return sorted.every((interval, index) => {
    if (index === 0) return true;
    const previous = sorted[index - 1];
    return previous !== undefined && toMinutes(interval.opensAt) >= toMinutes(previous.closesAt);
  });
}

export const dayScheduleSchema = z
  .object({
    weekday: z.number().int().min(0).max(6),
    closed: z.boolean(),
    intervals: z.array(timeIntervalSchema),
  })
  .refine((day) => day.closed || day.intervals.length >= 1, {
    message: 'dias abertos devem declarar ao menos 1 intervalo',
    path: ['intervals'],
  })
  .refine((day) => hasNoOverlap(day.intervals), {
    message: 'intervalos do mesmo dia não podem se sobrepor',
    path: ['intervals'],
  });

export const hoursExceptionSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date deve seguir o formato YYYY-MM-DD'),
  closed: z.boolean(),
  intervals: z.array(timeIntervalSchema),
  note: z.string().min(1).optional(),
});

export const businessHoursSchema = z.object({
  weekly: z
    .array(dayScheduleSchema)
    .length(7, 'weekly deve conter exatamente 7 dias')
    .refine((days) => new Set(days.map((day) => day.weekday)).size === 7, {
      message: 'weekly deve conter os 7 dias da semana sem repetição',
    }),
  exceptions: z.array(hoursExceptionSchema),
});

export const socialLinkSchema = z.object({
  platform: z.enum(['instagram', 'facebook', 'youtube', 'tiktok', 'linkedin']),
  url: z.string().url().startsWith('https://', 'redes sociais devem usar HTTPS'),
  label: z.string().min(1),
});

export const verifiableFactSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  kind: z.enum(['address', 'taxId', 'credential', 'tenure', 'certification']),
});

/* -- Business -------------------------------------------------------------- */

export const businessSchema = z.object({
  legalName: z.string().min(1).max(120),
  tradeName: z.string().min(1).max(60),
  taxId: z
    .string()
    .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ deve seguir o formato 00.000.000/0000-00'),
  foundedYear: z.number().int().min(1900).max(CURRENT_YEAR),
  address: addressSchema,
  phone: phoneNumberSchema,
  whatsapp: phoneNumberSchema,
  email: z.string().email(),
  hours: businessHoursSchema,
  serviceAreas: z.array(z.string().min(1)).min(1).max(8),
  socials: z.array(socialLinkSchema).max(6),
  responsiblePerson: z
    .object({
      name: z.string().min(1),
      role: z.string().min(1),
      credential: z.string().min(1).optional(),
    })
    .optional(),
  privacyPolicyUrl: z.string().min(1),
  responseTimeLabel: z.string().min(1),
});

/* -- Hero (S-1) ------------------------------------------------------------ */

export const proofItemSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('rating'),
    value: z.number().min(0).max(5),
    /** Nota sem contagem de avaliações é proibida por CT-004. */
    reviewCount: z.number().int().min(1),
    sourceUrl: z.string().url().optional(),
  }),
  z.object({ kind: z.literal('experience'), years: z.number().int().min(1) }),
  z.object({ kind: z.literal('volume'), label: z.string().min(1), value: z.string().min(1) }),
]);

export const heroContentSchema = z.object({
  headline: z.string().min(20).max(90),
  subheadline: z.string().min(40).max(180),
  /** Mínimo 1: Princípio II exige prova visível acima da dobra. */
  proofItems: z.array(proofItemSchema).min(1).max(3),
  primaryCta: ctaDefinitionSchema.refine((cta) => cta.channel === 'whatsapp', {
    message: 'o CTA principal deve usar o canal whatsapp (FR-005)',
  }),
  secondaryCta: ctaDefinitionSchema.optional(),
  image: imageAssetSchema,
});

/* -- About (S-2) ----------------------------------------------------------- */

export const teamMemberSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  credential: z.string().min(1).optional(),
  photo: imageAssetSchema.optional(),
});

export const aboutContentSchema = z.object({
  title: z.string().min(10).max(80),
  paragraphs: z.array(z.string().min(80).max(600)).min(1).max(4),
  yearsInBusiness: z.number().int().min(1),
  /** Mínimo 1: Princípio II — afirmação sem dado verificável não vai ao ar. */
  verifiableFacts: z.array(verifiableFactSchema).min(1),
  team: z.array(teamMemberSchema).max(8),
  images: z.array(imageAssetSchema).min(1),
});

/* -- Differentials (S-3) --------------------------------------------------- */

export const differentialSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(3).max(40),
  description: z.string().min(40).max(220),
  /** Obrigatório: é o que impede o diferencial genérico (FR-018/CT-003). */
  evidence: z.string().min(10).max(160),
  icon: z.string().min(1),
});

/* -- Services (S-4) -------------------------------------------------------- */

export const speciesSchema = z.enum(['dog', 'cat', 'other']);
export const petSizeSchema = z.enum(['small', 'medium', 'large', 'giant']);

export const serviceSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(3).max(60),
    summary: z.string().min(40).max(200),
    species: z.array(speciesSchema).min(1, 'declare ao menos 1 espécie atendida (AC-015)'),
    sizes: z.array(petSizeSchema),
    includes: z
      .array(z.string().min(3).max(80))
      .min(2, 'declare ao menos 2 itens inclusos (FR-019)'),
    durationMinutes: z
      .object({ min: z.number().int().positive(), max: z.number().int().positive() })
      .refine((duration) => duration.max >= duration.min, {
        message: 'durationMinutes.max deve ser maior ou igual a min',
      })
      .optional(),
    priceRange: z
      .object({
        min: z.number().positive(),
        max: z.number().positive(),
        currency: z.literal('BRL'),
      })
      .refine((price) => price.max >= price.min, {
        message: 'priceRange.max deve ser maior ou igual a min',
      })
      .optional(),
    restrictions: z.array(z.string().min(1)).max(4),
    cta: ctaDefinitionSchema,
    image: imageAssetSchema.optional(),
  })
  .refine((service) => !service.species.includes('dog') || service.sizes.length >= 1, {
    message: 'serviços que atendem cães devem declarar os portes atendidos (AC-015)',
    path: ['sizes'],
  });

/* -- Products (S-5) -------------------------------------------------------- */

export const productSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(3).max(80),
  category: z.string().min(3).max(40),
  description: z.string().min(20).max(160),
  image: imageAssetSchema,
  availability: z.enum(['in-store', 'on-request', 'unavailable']),
  /** Ausente quando o valor não está confirmado — nunca um preço desatualizado. */
  price: z.object({ amount: z.number().positive(), currency: z.literal('BRL') }).optional(),
  cta: ctaDefinitionSchema,
});

export const productsBlockSchema = z.object({
  /** A seção deve declarar explicitamente se existe venda on-line (FR-020). */
  onlineSalesAvailable: z.boolean(),
  items: z.array(productSchema),
});

/* -- Testimonials (S-6) ---------------------------------------------------- */

export const testimonialSchema = z
  .object({
    id: z.string().min(1),
    /** Obrigatório: depoimento anônimo não é prova verificável (FR-021/CT-004). */
    authorName: z.string().min(2).max(60),
    petName: z.string().min(1).optional(),
    quote: z.string().min(40).max(400),
    rating: z.number().int().min(1).max(5).optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date deve seguir o formato YYYY-MM-DD'),
    sourceUrl: z.string().url().optional(),
    photo: imageAssetSchema.optional(),
  })
  .refine((testimonial) => new Date(testimonial.date) <= new Date(), {
    message: 'date não pode ser futura',
    path: ['date'],
  })
  .refine((testimonial) => !testimonial.photo || testimonial.photo.mediaConsent === true, {
    message: 'fotos de depoimento exigem mediaConsent === true (CT-005/LGPD)',
    path: ['photo'],
  });

export const testimonialsBlockSchema = z.object({
  aggregate: z
    .object({
      rating: z.number().min(0).max(5),
      reviewCount: z.number().int().min(1),
      /** Obrigatório: número sem fonte pública é proibido por CT-004. */
      sourceUrl: z.string().url(),
    })
    .optional(),
  items: z.array(testimonialSchema).min(3).max(6),
});

/* -- FAQ (S-7) ------------------------------------------------------------- */

export const faqTopicSchema = z.enum([
  'pricing',
  'duration',
  'scheduling',
  'cats',
  'special-pets',
  'vaccination',
  'payment',
  'cancellation',
  'other',
]);

/** Tópicos cuja ausência quebra o build (FR-022 / AC-016). */
export const REQUIRED_FAQ_TOPICS = [
  'pricing',
  'duration',
  'scheduling',
  'cats',
  'special-pets',
  'vaccination',
  'payment',
  'cancellation',
] as const;

export const faqItemSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(10).max(140).endsWith('?', 'a pergunta deve terminar com "?"'),
  answer: z.string().min(40).max(800),
  topic: faqTopicSchema,
  order: z.number().int().min(0),
});

/* -- SEO ------------------------------------------------------------------- */

export const seoContentSchema = z.object({
  /** 30–60 caracteres para não truncar no resultado de busca (FR-027). */
  title: z.string().min(30).max(60),
  description: z.string().min(120).max(158),
  canonicalUrl: z.string().url().startsWith('https://', 'canonicalUrl deve usar HTTPS'),
  ogImage: z.object({
    url: z.string().min(1),
    alt: z.string().min(1),
    width: z.number().int().min(1200),
    height: z.number().int().min(630),
  }),
  locale: z.literal('pt-BR'),
});

/* -- Navegação ------------------------------------------------------------- */

export const navItemSchema = z.object({
  id: sectionIdSchema,
  label: z.string().min(1),
  anchor: z.string().startsWith('#'),
});

/* -- Agregado raiz --------------------------------------------------------- */

export const siteContentSchema = z.object({
  business: businessSchema,
  nav: z.array(navItemSchema).min(1),
  hero: heroContentSchema,
  about: aboutContentSchema,
  differentials: z
    .array(differentialSchema)
    .min(3, 'declare de 3 a 6 diferenciais (FR-018)')
    .max(6, 'declare de 3 a 6 diferenciais (FR-018)'),
  services: z.array(serviceSchema).min(1),
  products: productsBlockSchema,
  /** Bloco ausente é estado válido: edge case "prova social insuficiente". */
  testimonials: testimonialsBlockSchema.optional(),
  faq: z
    .array(faqItemSchema)
    .min(6, 'declare de 6 a 10 perguntas frequentes (FR-022)')
    .max(10, 'declare de 6 a 10 perguntas frequentes (FR-022)'),
  seo: seoContentSchema,
});
