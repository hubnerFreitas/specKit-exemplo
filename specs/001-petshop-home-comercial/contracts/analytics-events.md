# Contrato — Eventos de Conversão

**Feature**: Home Page Comercial do Petshop | **Plan**: [../plan.md](../plan.md) | **Requisitos**: FR-015, FR-039, SC-003, SC-006

FR-015 exige que **toda** conversão seja rastreável, e SC-003/SC-004/SC-006 só são mensuráveis se
cada evento souber o canal, a seção e o item de origem. Este contrato define o formato, para que a
escolha do provedor de análise seja uma decisão de deploy e não uma reescrita de componentes.

---

## Interface pública

```text
// src/lib/analytics.ts
export function trackConversion(event: ConversionEventInput): void
export function grantConsent(): void
export function revokeConsent(): void
```

`trackConversion` é **sempre segura de chamar**: nunca lança exceção, nunca retorna Promise, nunca
bloqueia. Essa garantia é o que permite chamá-la no `onClick` de uma âncora sem risco de impedir a
navegação (FR-039).

```text
ConversionEventInput = {
  channel: ConversionChannel
  section: SectionId
  itemId?: string
  intent: string
}

ConversionChannel = 'whatsapp' | 'phone' | 'email' | 'route' | 'form'

SectionId = 'header' | 'hero' | 'about' | 'differentials' | 'services'
          | 'products' | 'testimonials' | 'faq' | 'contact' | 'footer' | 'mobile-bar'
```

A biblioteca adiciona `occurredAt: number` ao despachar. O chamador não informa o horário.

---

## Catálogo de eventos obrigatórios

Todo ponto de conversão da página deve emitir exatamente um evento. A tabela é a lista de
verificação de FR-015 e AC-010:

| Origem | `channel` | `section` | `itemId` | `intent` |
|---|---|---|---|---|
| CTA de WhatsApp no header | `whatsapp` | `header` | — | `general` |
| CTA primário do hero | `whatsapp` | `hero` | — | `general` |
| CTA secundário do hero (telefone) | `phone` | `hero` | — | `general` |
| CTA de um serviço | `whatsapp` | `services` | `<service.id>` | `service:<id>` |
| CTA ao final de serviços | `whatsapp` | `services` | — | `general` |
| CTA de um produto | `whatsapp` | `products` | `<product.id>` | `product:<id>` |
| CTA após prova social | `whatsapp` | `testimonials` | — | `general` |
| CTA de dúvida não listada | `whatsapp` | `faq` | — | `question` |
| Telefone na seção de contato | `phone` | `contact` | — | `general` |
| WhatsApp na seção de contato | `whatsapp` | `contact` | — | `general` |
| E-mail na seção de contato | `email` | `contact` | — | `general` |
| Link de rota / mapa | `route` | `contact` | — | `general` |
| Envio bem-sucedido do formulário | `form` | `contact` | `<serviceId>` | `form:<serviceId>` |
| Telefone no rodapé | `phone` | `footer` | — | `general` |
| WhatsApp no rodapé | `whatsapp` | `footer` | — | `general` |
| Barra fixa mobile | `whatsapp` ou `phone` | `mobile-bar` | — | `general` |

**Eventos que NÃO devem existir**: visualização de seção, rolagem, tempo na página, movimento de
mouse, abertura de pergunta frequente. O Princípio I exige objetivo de negócio por funcionalidade;
telemetria de comportamento não pedida é peso e exposição de dados sem contrapartida.

---

## Regras de implementação

1. **Chamada não bloqueante**: nenhum `preventDefault`, nenhum `await`, nenhuma navegação
   programática após o rastreamento. O CTA é uma âncora real e navega por conta própria (FR-039).
2. **Fila com consentimento**: antes de `grantConsent()`, os eventos vão para um array em memória
   (máximo 50, descartando os mais antigos). Nenhuma requisição de rede e nenhum script de terceiro
   é carregado até o consentimento.
3. **Flush no consentimento**: `grantConsent()` carrega o provedor (se houver) e envia a fila em
   ordem. `revokeConsent()` limpa a fila e para de despachar.
4. **Sem provedor configurado**: `trackConversion` é um no-op silencioso em produção. Em
   desenvolvimento, registra no console para permitir a verificação manual de AC-010.
5. **Transporte**: `navigator.sendBeacon` quando disponível (sobrevive à saída da página ao abrir o
   WhatsApp), com `fetch(..., { keepalive: true })` como alternativa.
6. **Sem dado pessoal**: o evento **nunca** carrega nome, telefone, mensagem, e-mail ou
   identificador persistente de visitante. Apenas canal, seção, item e intenção.
7. **Idempotência de clique**: cliques repetidos no mesmo CTA em menos de 500ms contam uma vez
   (duplo toque acidental em mobile não deve inflar a taxa de conversão de SC-003).
8. **Ponto único de chamada**: somente `CtaButton`, `ContactLink` e `ContactForm` chamam
   `trackConversion`. Nenhuma seção chama diretamente — é o que garante que nenhum CTA novo nasça
   sem rastreamento.

---

## Métricas derivadas

Os critérios de sucesso da especificação são calculados a partir destes eventos:

| Critério | Cálculo |
|---|---|
| SC-003 (≥ 8% de visitas com contato) | sessões com ≥ 1 `ConversionEvent` ÷ sessões totais |
| SC-004 (≥ 60% dos contatos qualificados) | eventos com `itemId` definido ÷ eventos totais |
| SC-006 (≥ 85% nos pontos de decisão) | eventos com `section` em {`hero`, `services`, `testimonials`, `faq`, `contact`, `mobile-bar`} ÷ eventos totais |
| Canal preferido (decisão operacional) | distribuição de `channel` |
| Serviço mais procurado (decisão de conteúdo) | distribuição de `itemId` onde `section = 'services'` |

SC-005 (conclusão do formulário) exige um par de eventos de início/conclusão que **não** está neste
catálogo; é medido no painel do endpoint (ou no WhatsApp Business, em modo composer), para manter a
regra 6 — nenhum dado pessoal na camada de análise do site.

---

## Consentimento e LGPD

- Nenhum script de terceiro, nenhum cookie e nenhum `localStorage` antes do consentimento.
- O aviso de consentimento, quando o provedor exigir, oferece aceitar e recusar com o **mesmo**
  destaque visual, e não cobre o CTA principal nem a barra fixa de contato.
- Recusar mantém a página plenamente funcional: todos os CTAs continuam operando; apenas a
  mensuração é suspensa.
- Os eventos não contêm dado pessoal (regra 6), o que mantém o escopo de consentimento mínimo.
