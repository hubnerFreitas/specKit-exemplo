import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { AlertTriangleIcon, CheckCircle2Icon, Loader2Icon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { ContactLink } from '@/components/shared/ContactLink';
import { WhatsAppCta } from '@/components/shared/WhatsAppCta';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { trackConversion } from '@/lib/analytics';
import { getSubmitMode, submitContactRequest } from '@/lib/contact/submit';
import { contactFormSchema, type ContactFormValues } from '@/schemas/contact-request.schema';
import { parse } from 'zod/mini';
import type { Business, Service } from '@/types/content';

export type ContactFormProps = {
  services: Service[];
  business: Business;
  defaultServiceId?: string;
};

type FormState = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Formulário de solicitação de agendamento (S-8).
 *
 * Campos: exatamente nome, telefone, serviço e observação opcional (FR-011).
 * Nenhum cadastro, nenhum login.
 *
 * Acessibilidade: o componente `form` do shadcn/ui liga `label`,
 * `aria-describedby` e `aria-invalid` a cada campo, e `FormMessage` usa
 * `role="alert"` (AC-024).
 *
 * Erro: preserva os valores digitados e oferece WhatsApp e telefone dentro do
 * próprio bloco de erro (FR-013).
 */
export function ContactForm({ services, business, defaultServiceId }: ContactFormProps) {
  const [state, setState] = useState<FormState>('idle');
  const [retryAfter, setRetryAfter] = useState<number | null>(null);
  // Antispam: tempo mínimo entre a montagem e o envio (FR-014).
  // Inicializado em 0 e preenchido no efeito para não chamar Date.now()
  // durante a renderização (que é impura e divergiria no prerender).
  const renderedAt = useRef(0);
  useEffect(() => {
    renderedAt.current = Date.now();
  }, []);
  const mode = getSubmitMode();

  const form = useForm<ContactFormValues>({
    resolver: standardSchemaResolver(contactFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      serviceId: defaultServiceId ?? services[0]?.id ?? '',
      message: '',
      honeypot: '',
    },
  });

  const onSubmit = async (values: ContactFormValues): Promise<void> => {
    setState('submitting');
    setRetryAfter(null);

    const parsed = parse(contactFormSchema, values);
    const serviceName =
      services.find((service) => service.id === parsed.serviceId)?.name ?? 'serviço';

    const result = await submitContactRequest(
      {
        ...parsed,
        origin: { section: 'contact', item: parsed.serviceId },
        renderedAt: renderedAt.current,
      },
      business,
      serviceName,
    );

    if (result.status === 'success') {
      trackConversion({
        channel: 'form',
        section: 'contact',
        itemId: parsed.serviceId,
        intent: `form:${parsed.serviceId}`,
      });
      setState('success');
      form.reset();
      renderedAt.current = Date.now();
      return;
    }

    if (result.status === 'field-errors') {
      for (const [field, message] of Object.entries(result.fields)) {
        if (field === 'name' || field === 'phone' || field === 'serviceId' || field === 'message') {
          form.setError(field, { message });
        }
      }
      setState('idle');
      return;
    }

    // Os dados digitados NÃO são limpos aqui (FR-013).
    setRetryAfter(result.retryAfterSeconds ?? null);
    setState('error');
  };

  if (state === 'success') {
    return (
      <output
        aria-live="polite"
        className="flex flex-col gap-3 rounded-xl border border-success bg-success-soft p-6"
      >
        <p className="flex items-center gap-2 text-lg font-bold text-foreground">
          <CheckCircle2Icon aria-hidden="true" className="size-6 shrink-0 text-success" />
          Solicitação enviada!
        </p>
        <p className="text-base text-foreground-muted">{business.responseTimeLabel}</p>
        <Button variant="secondary" onClick={() => setState('idle')} className="self-start">
          Enviar outra solicitação
        </Button>
      </output>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          void form.handleSubmit(onSubmit)(event);
        }}
        noValidate
        className="flex flex-col gap-5"
      >
        {state === 'error' && (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-xl border border-danger bg-danger-soft p-5"
          >
            <p className="flex items-center gap-2 font-bold text-foreground">
              <AlertTriangleIcon aria-hidden="true" className="size-5 shrink-0 text-danger" />
              Não conseguimos enviar sua solicitação
            </p>
            <p className="text-base text-foreground-muted">
              {retryAfter !== null
                ? `Tente novamente em alguns instantes. Seus dados foram mantidos no formulário.`
                : 'Seus dados foram mantidos no formulário. Você pode tentar de novo ou falar com a gente agora pelos canais abaixo.'}
            </p>
            {/* FR-013: canais alternativos no próprio bloco de erro. */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <WhatsAppCta
                intent={{ kind: 'general' }}
                business={business}
                section="contact"
                label="Falar no WhatsApp"
                fullWidth
                className="sm:w-auto"
              />
              <ContactLink kind="phone" business={business} section="contact" />
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seu nome</FormLabel>
              <FormControl>
                <Input {...field} autoComplete="name" placeholder="Como podemos te chamar?" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone ou WhatsApp</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="(11) 90000-0000"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="serviceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Serviço desejado</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="min-h-(--size-touch-target) w-full rounded-lg border border-border-strong bg-surface px-3.5 py-2.5 text-base text-foreground outline-none focus-visible:border-brand-600 aria-invalid:border-danger"
                >
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Observação <span className="font-normal text-foreground-muted">(opcional)</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={3}
                  maxLength={500}
                  placeholder="Raça, porte, idade, se o pet é ansioso, o dia que prefere..."
                />
              </FormControl>
              <FormDescription>
                Quanto mais detalhes, mais preciso o orçamento que a gente passa.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Honeypot: oculto por CSS, fora da ordem de foco e ignorado por
            leitores de tela. Nunca `type="hidden"` — bots preenchem campos
            ocultos, e é justamente isso que queremos detectar (FR-014). */}
        <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="contact-company">Empresa</label>
          <input
            id="contact-company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...form.register('honeypot')}
          />
        </div>

        <Button type="submit" size="lg" disabled={state === 'submitting'} className="w-full">
          {state === 'submitting' ? (
            <>
              <Loader2Icon aria-hidden="true" className="size-5 animate-spin" />
              Enviando...
            </>
          ) : mode === 'composer' ? (
            'Enviar pelo WhatsApp'
          ) : (
            'Solicitar agendamento'
          )}
        </Button>

        {/* FR-038: finalidade da coleta declarada, com link para a política. */}
        <p className="text-sm text-foreground-muted">
          Usamos seus dados apenas para responder a esta solicitação de agendamento.
          {mode === 'composer' && ' Ao enviar, a mensagem é aberta no WhatsApp.'}{' '}
          <a
            href={business.privacyPolicyUrl}
            className="font-medium text-brand-700 underline underline-offset-2"
          >
            Política de privacidade
          </a>
          .
        </p>
      </form>
    </Form>
  );
}
