import * as z from 'zod/mini';

/* ============================================================================
   Schema da solicitação de contato.
   É também o contrato publicado do endpoint — a MESMA definição valida no
   cliente e deve validar no servidor, para que as duas não divirjam.
   Ver specs/001-petshop-home-comercial/contracts/contact-endpoint.md

   Usa `zod/mini` em vez de `zod`: é a variante com tree-shaking real, e este é
   o ÚNICO schema que roda no navegador. A variante padrão custaria ~100 KB
   comprimidos no bundle, estourando o orçamento do Princípio IX. Os schemas de
   conteúdo (content.schema.ts) usam o zod completo porque rodam apenas no
   build.
   ============================================================================ */

/** Tempo mínimo entre a montagem do formulário e o envio (antispam, FR-014). */
export const MIN_FILL_TIME_MS = 3000;

/** Remove máscara do telefone, deixando apenas dígitos. */
export function stripPhoneMask(value: string): string {
  return value.replace(/\D/g, '');
}

const SECTION_IDS = [
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
] as const;

const phoneField = z.pipe(
  z.pipe(
    z.string().check(z.minLength(1, 'Informe seu telefone ou WhatsApp.')),
    z.transform(stripPhoneMask),
  ),
  z.string().check(
    z.refine((digits) => digits.length === 10 || digits.length === 11, {
      message: 'O telefone deve ter 10 ou 11 dígitos, com DDD.',
    }),
    z.refine(
      (digits) => {
        const areaCode = Number(digits.slice(0, 2));
        return areaCode >= 11 && areaCode <= 99;
      },
      { message: 'DDD inválido.' },
    ),
  ),
);

/** Campos preenchidos pela pessoa. É o que o formulário valida. */
export const contactFormSchema = z.object({
  name: z.pipe(
    z.pipe(z.string(), z.transform((value) => value.trim())),
    z
      .string()
      .check(
        z.minLength(2, 'Informe seu nome completo.'),
        z.maxLength(80, 'O nome deve ter no máximo 80 caracteres.'),
      ),
  ),
  phone: phoneField,
  serviceId: z.string().check(z.minLength(1, 'Escolha o serviço desejado.')),
  message: z.optional(
    z.pipe(
      z.pipe(z.string(), z.transform((value) => value.trim())),
      z.string().check(z.maxLength(500, 'A observação deve ter no máximo 500 caracteres.')),
    ),
  ),
  /** Honeypot: bots preenchem, pessoas não (FR-014). */
  honeypot: z.string().check(z.maxLength(0, 'Envio bloqueado.')),
});

/** Payload completo enviado ao endpoint, com os metadados da aplicação. */
export const contactRequestSchema = z.extend(contactFormSchema, {
  origin: z.object({
    section: z.enum(SECTION_IDS),
    item: z.optional(z.string().check(z.minLength(1))),
  }),
  renderedAt: z.number().check(z.int(), z.positive()),
});

export type ContactFormValues = z.input<typeof contactFormSchema>;
export type ContactFormOutput = z.output<typeof contactFormSchema>;
export type ContactRequest = z.infer<typeof contactRequestSchema>;
