import type { z } from 'zod';

import type { sectionIdSchema } from '@/schemas/section-id.schema';

/* ============================================================================
   Contrato dos eventos de conversão.
   Ver specs/001-petshop-home-comercial/contracts/analytics-events.md
   ============================================================================ */

export type SectionId = z.infer<typeof sectionIdSchema>;

export type ConversionChannel = 'whatsapp' | 'phone' | 'email' | 'route' | 'form';

export type ConversionEventInput = {
  channel: ConversionChannel;
  section: SectionId;
  /** id do serviço ou produto de origem — o que torna SC-004 mensurável. */
  itemId?: string;
  intent: string;
};

export type ConversionEvent = ConversionEventInput & {
  occurredAt: number;
};
