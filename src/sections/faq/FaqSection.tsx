import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { WhatsAppCta } from '@/components/shared/WhatsAppCta';
import { Disclosure } from '@/components/ui/disclosure';
import type { Business, FaqItem } from '@/types/content';

export type FaqSectionProps = {
  items: FaqItem[];
  business: Business;
};

/**
 * Perguntas frequentes (S-7).
 *
 * Usa `<details>/<summary>` nativos (ver src/components/ui/disclosure.tsx):
 * - todas as respostas estão no HTML pré-renderizado E continuam abríveis sem
 *   JavaScript, o que atende FR-032 de forma mais forte que qualquer solução
 *   em JS;
 * - o título de cada pergunta é um `<h3>` CONTENDO o `<summary>`, nunca o
 *   inverso: mantém a hierarquia h1 → h2 → h3 sem saltos (AC-029).
 */
export function FaqSection({ items, business }: FaqSectionProps) {
  const ordered = items.toSorted((a, b) => a.order - b.order);

  return (
    <Section id="faq" labelledById="faq-title" tone="muted">
      <div className="mx-auto flex max-w-(--container-prose) flex-col">
        <SectionHeading
          id="faq-title"
          eyebrow="Dúvidas"
          title="Perguntas que todo tutor faz"
          align="center"
        />

        <div className="mt-8">
          {ordered.map((item) => (
            <Disclosure key={item.id} question={item.question}>
              {item.answer}
            </Disclosure>
          ))}
        </div>

        {/* CTA para a dúvida que não está listada (FR-022). */}
        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <p className="text-lg font-bold text-foreground">Sua dúvida não está aqui?</p>
          <p className="text-base text-foreground-muted">
            Manda a pergunta no WhatsApp. Respondemos mesmo que você ainda não vá agendar.
          </p>
          <WhatsAppCta
            intent={{ kind: 'question' }}
            business={business}
            section="faq"
            label="Perguntar no WhatsApp"
            size="lg"
          />
        </div>
      </div>
    </Section>
  );
}
