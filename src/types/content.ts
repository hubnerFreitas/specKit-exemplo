import type { z } from 'zod';

import type {
  aboutContentSchema,
  addressSchema,
  businessHoursSchema,
  businessSchema,
  ctaDefinitionSchema,
  dayScheduleSchema,
  differentialSchema,
  faqItemSchema,
  faqTopicSchema,
  heroContentSchema,
  imageAssetSchema,
  navItemSchema,
  petSizeSchema,
  phoneNumberSchema,
  productSchema,
  productsBlockSchema,
  proofItemSchema,
  seoContentSchema,
  serviceSchema,
  siteContentSchema,
  socialLinkSchema,
  speciesSchema,
  teamMemberSchema,
  testimonialSchema,
  testimonialsBlockSchema,
  verifiableFactSchema,
} from '@/schemas/content.schema';

/* ============================================================================
   Tipos de conteúdo — TODOS derivados por z.infer.
   Nenhum tipo é escrito à mão, para que schema e tipo não possam divergir
   (contracts/content-schemas.md).
   ============================================================================ */

export type SiteContent = z.infer<typeof siteContentSchema>;

export type Business = z.infer<typeof businessSchema>;
export type Address = z.infer<typeof addressSchema>;
export type PhoneNumber = z.infer<typeof phoneNumberSchema>;
export type BusinessHours = z.infer<typeof businessHoursSchema>;
export type DaySchedule = z.infer<typeof dayScheduleSchema>;
export type SocialLink = z.infer<typeof socialLinkSchema>;
export type VerifiableFact = z.infer<typeof verifiableFactSchema>;

export type ImageAsset = z.infer<typeof imageAssetSchema>;
export type CtaDefinition = z.infer<typeof ctaDefinitionSchema>;
export type NavItem = z.infer<typeof navItemSchema>;

export type HeroContent = z.infer<typeof heroContentSchema>;
export type ProofItem = z.infer<typeof proofItemSchema>;

export type AboutContent = z.infer<typeof aboutContentSchema>;
export type TeamMember = z.infer<typeof teamMemberSchema>;

export type Differential = z.infer<typeof differentialSchema>;

export type Service = z.infer<typeof serviceSchema>;
export type Species = z.infer<typeof speciesSchema>;
export type PetSize = z.infer<typeof petSizeSchema>;

export type Product = z.infer<typeof productSchema>;
export type ProductsBlock = z.infer<typeof productsBlockSchema>;

export type Testimonial = z.infer<typeof testimonialSchema>;
export type TestimonialsBlock = z.infer<typeof testimonialsBlockSchema>;

export type FaqItem = z.infer<typeof faqItemSchema>;
export type FaqTopic = z.infer<typeof faqTopicSchema>;

export type SeoContent = z.infer<typeof seoContentSchema>;
