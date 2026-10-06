import heroPicture from '@/assets/images/hero-banho-tosa.jpg?w=480;768;1200;1600&format=avif;webp;jpg&as=picture';
import type { HeroContent } from '@/types/content';

/* ============================================================================
   Seção principal (S-1).
   `proofItems` tem mínimo de 1 item por schema: o Princípio II exige prova
   visível acima da dobra.

   PENDÊNCIAS: PC-5 (tempo de atuação confirmado), PC-8 (nota e contagem reais
   do Perfil da Empresa no Google), PC-11 (fotografia real).
   ============================================================================ */

export const hero: HeroContent = {
  headline: 'Banho e tosa na Vila Mariana com quem trata seu pet pelo nome',
  subheadline:
    'Atendimento sem gaiola de secagem, com acompanhamento individual do banho à entrega. Cães e gatos, de todos os portes.',

  proofItems: [
    {
      kind: 'rating',
      value: 4.9,
      reviewCount: 487,
      sourceUrl: 'https://www.google.com/maps/place/?q=place_id:ChIJexemploPatasFelizes',
    },
    { kind: 'experience', years: 11 },
    { kind: 'volume', label: 'pets atendidos por mês', value: '600+' },
  ],

  primaryCta: {
    label: 'Agendar pelo WhatsApp',
    channel: 'whatsapp',
    intent: 'general',
  },

  secondaryCta: {
    label: 'Ver serviços e preços',
    channel: 'anchor',
    intent: 'view-services',
    anchorId: 'services',
  },

  image: {
    source: heroPicture,
    alt: 'Profissional do Patas Felizes secando um cão de pelo longo com secador de mão, sobre bancada de atendimento',
    width: 1600,
    height: 1200,
    mediaConsent: true,
  },
};
