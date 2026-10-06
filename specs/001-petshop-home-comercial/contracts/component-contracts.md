# Contrato — Interfaces de Componentes

**Feature**: Home Page Comercial do Petshop | **Plan**: [../plan.md](../plan.md)

Este é o contrato de UI do projeto: as props públicas dos componentes de `layout/`, `shared/` e
`sections/`, e as **invariantes** que cada um garante. A regra de dependência unidirecional do
plano é o que mantém esse contrato estável; estas assinaturas são o que a implementação deve
respeitar.

Notação: `?` = opcional. Tipos de conteúdo vêm de [../data-model.md](../data-model.md).

---

## Estratégia de componentes reutilizáveis

Quatro níveis, com critério de admissão explícito para evitar que `shared/` se torne um depósito:

| Nível | Pasta | Critério de admissão | Pode importar |
|---|---|---|---|
| **Primitivo** | `components/ui/` | Gerado pelo CLI do shadcn/ui. Sem lógica de domínio. | `lib/utils` |
| **Compartilhado** | `components/shared/` | Usado por **duas ou mais** seções **e** carrega uma decisão de domínio (ex.: "um CTA sempre registra conversão") | `ui/`, `lib/`, `hooks/`, `types/` |
| **Layout** | `components/layout/` | Cromo da página: existe fora do conteúdo das seções | `ui/`, `shared/`, `lib/`, `hooks/` |
| **Seção** | `sections/<nome>/` | Corresponde a um ID S-* da spec | `ui/`, `shared/`, `layout/Section`, `lib/`, `hooks/` |

**Regra de promoção (YAGNI, Princípio X)**: um subcomponente nasce dentro da pasta da seção que o
usa. Só é movido para `shared/` quando existe o **segundo uso real** — nunca por antecipação.

**Regra de variantes**: toda variação visual de um componente compartilhado é declarada com
`class-variance-authority` (`cva`) no próprio arquivo. Proibido: prop booleana solta por variação
(`isBig`, `isDark`), classe passada de fora para alterar aparência estrutural, e `style` inline.
`className` é aceito apenas para espaçamento/posicionamento no contexto de uso, mesclado com `cn()`.

---

## `components/shared/`

### `CtaButton`

O componente mais importante do projeto: encapsula o requisito de que **toda conversão é
rastreada** (FR-015). Nenhuma seção renderiza um botão de contato sem passar por aqui.

```text
CtaButtonProps = {
  cta: CtaDefinition
  section: SectionId
  itemId?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'default' | 'lg'
  fullWidth?: boolean
  className?: string
}
```

**Invariantes garantidas**:

1. Renderiza um `<a>` real quando `channel` é `whatsapp`, `phone`, `route` ou `anchor`, e um
   `<button type="submit">` quando é `form`. Nunca um `<div>` com `onClick`.
2. Chama `trackConversion({ channel, section, itemId, intent })` no clique e **nunca** chama
   `preventDefault` — a navegação acontece mesmo se o rastreamento falhar (FR-039).
3. `target="_blank"` sempre acompanhado de `rel="noopener noreferrer"` (segurança, R-10).
4. Altura mínima de 44px em qualquer `size`, vinda do token de alvo de toque (FR-034).
5. `cta.label` é o texto accessible name; se um ícone acompanhar, ele recebe `aria-hidden`.
6. Nunca renderiza dois `variant="primary"` irmãos — garantido pelo uso, verificado na revisão
   (FR-010).

### `WhatsAppCta`

```text
WhatsAppCtaProps = {
  intent: WhatsAppIntent
  section: SectionId
  itemId?: string
  label: string
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'default' | 'lg'
  fullWidth?: boolean
}
```

**Invariantes**: monta o `href` exclusivamente via `buildWhatsAppUrl(intent)` (nunca concatena URL
no componente); o `intent` carrega o contexto que produz a mensagem pré-preenchida (FR-008);
delega o resto a `CtaButton`.

```text
WhatsAppIntent =
  | { kind: 'general' }
  | { kind: 'service';  serviceId: string; serviceName: string }
  | { kind: 'product';  productId: string; productName: string }
  | { kind: 'question' }
  | { kind: 'form-fallback'; request: ContactRequest }
```

A união discriminada é o que garante que não existe CTA de WhatsApp "sem contexto": o tipo obriga a
declarar a origem, e `buildWhatsAppUrl` produz a mensagem correspondente.

### `ContactLink`

```text
ContactLinkProps = {
  kind: 'phone' | 'whatsapp' | 'email' | 'address'
  business: Business
  section: SectionId
  showIcon?: boolean
  className?: string
}
```

**Invariantes**: é o **único** lugar que constrói `tel:`, `mailto:` e URL de rota (FR-009); o texto
visível usa sempre `phone.display` e o `href` sempre `phone.e164` (FR-029/AC-017); registra
conversão no clique; o endereço é texto selecionável, nunca imagem (FR-024).

### `SectionHeading`

```text
SectionHeadingProps = {
  id: string            // usado pelo aria-labelledby do <Section>
  eyebrow?: string
  title: string
  description?: string
  as?: 'h1' | 'h2'      // padrão 'h2'; 'h1' exclusivo do hero
  align?: 'start' | 'center'
}
```

**Invariantes**: emite exatamente um título do nível informado, com o `id` recebido; `eyebrow` é
`<p>`, nunca um heading — é o que impede o salto de hierarquia que quebraria FR-026/AC-029.

### `ResponsiveImage`

```text
ResponsiveImageProps = {
  image: ImageAsset
  sizes: string              // obrigatório: media query de larguras
  priority?: boolean         // true só no hero
  className?: string
  imgClassName?: string
}
```

**Invariantes**: renderiza `<picture>` com um `<source type>` por formato (AVIF → WebP → fallback);
aplica `width`/`height` do próprio `ImageAsset` (CLS, AC-027); `priority: true` ⇒
`loading="eager"` + `fetchpriority="high"`; `priority` ausente ⇒ `loading="lazy"` +
`decoding="async"`; `alt` vem de `image.alt`, e `image.decorative` ⇒ `alt=""` + `aria-hidden`
(FR-030/AC-026). **Nenhuma imagem da página é renderizada fora deste componente.**

### `ProofBadge`

```text
ProofBadgeProps = { item: ProofItem; size?: 'sm' | 'md' }
```

**Invariantes**: `kind: 'rating'` exibe nota **e** contagem de avaliações (número isolado é
proibido por CT-004) e, com `sourceUrl`, envolve em link para a fonte pública; a informação nunca
depende só de cor ou só de estrelas — há texto equivalente (AC-023, FR-036).

### `OpenStatusBadge`

```text
OpenStatusBadgeProps = { hours: BusinessHours; className?: string }
```

**Invariantes**: usa `useOpenStatus`; com `state: 'unknown'` **não renderiza nada** (nem
*skeleton* que mude o layout) — é o que mantém o HTML pré-renderizado idêntico à primeira
renderização do cliente (R-09) e evita CLS; o texto sempre traz a informação completa
("Fechado — abre terça às 08:00"), nunca apenas um ponto colorido (FR-036).

### `IconBadge`

```text
IconBadgeProps = { icon: LucideIcon; tone?: 'brand' | 'neutral'; size?: 'sm' | 'md' | 'lg' }
```

**Invariante**: puramente decorativo — sempre `aria-hidden="true"`. Nunca é o único portador de
informação.

---

## `components/layout/`

### `Section`

Envelope estrutural de toda seção. Existe para que semântica e espaçamento sejam decisões tomadas
uma vez (FR-026, Princípio V).

```text
SectionProps = {
  id: SectionId
  labelledById: string
  children: ReactNode
  tone?: 'default' | 'muted' | 'brand'
  spacing?: 'default' | 'tight'
  className?: string
}
```

**Invariantes**: renderiza `<section id aria-labelledby>`; aplica o ritmo vertical dos tokens
(nenhum valor avulso); `id` serve de âncora para a navegação e para o `scroll-margin-top` que
compensa o header fixo (FR-003).

### `SiteHeader` (S-0)

```text
SiteHeaderProps = { business: Business; navItems: NavItem[] }
NavItem = { id: SectionId; label: string }
```

**Invariantes**: `<header>` com `<nav aria-label>`; no mobile usa `Sheet` do shadcn/ui (foco preso,
`Esc` fecha, retorno de foco ao gatilho — herdado do Radix); o CTA de contato permanece visível
**fora** do menu recolhido, no mobile (FR-002); usa `useScrollSpy` para marcar a seção ativa com
`aria-current="location"`; a marcação do item ativo não depende só de cor (FR-036).

### `SiteFooter` (S-9)

```text
SiteFooterProps = { business: Business; navItems: NavItem[] }
```

**Invariantes**: `<footer>` com os 9 blocos de FR-025 (identidade, NAP completo, horários, canais,
atalhos, redes, razão social + CNPJ, política de privacidade, direitos autorais); todo NAP vem de
`business` via `ContactLink`; links externos com `rel="noopener noreferrer"`; respeita o
espaçamento reservado para `MobileContactBar` para que esta nunca cubra o rodapé (FR-007/AC-008).

### `MobileContactBar` (S-10)

```text
MobileContactBarProps = { business: Business }
```

**Invariantes**: visível apenas abaixo do breakpoint de tablet; `position: fixed` no rodapé da
viewport com `padding-bottom: env(safe-area-inset-bottom)`; alvos ≥ 44×44px; `role="region"` com
`aria-label`; **não** aparece sobre o `SiteFooter` (o body reserva o espaço equivalente) nem sobre
controles do formulário (FR-007/AC-008); no máximo dois canais, para não competir (FR-010).

### `SkipLink`

```text
SkipLinkProps = { targetId?: string }   // padrão 'conteudo-principal'
```

**Invariante**: primeiro elemento focável do documento; visualmente oculto até receber foco, e
então plenamente visível com contraste conforme (AC-022).

---

## `sections/` — assinaturas

Toda seção é uma **função pura dos seus props**. Nenhuma importa `src/content/`. Nenhuma lê estado
global. Esta é a regra que viabiliza a migração para CMS (R-05).

```text
HeroSection           ({ content: HeroContent; business: Business })
AboutSection          ({ content: AboutContent; business: Business })
DifferentialsSection  ({ items: Differential[] })
ServicesSection       ({ items: Service[] })
ProductsSection       ({ block: ProductsBlock })
TestimonialsSection   ({ block: TestimonialsBlock })          // não renderiza se items vazio
FaqSection            ({ items: FaqItem[]; business: Business })
ContactSection        ({ business: Business; services: Service[] })
```

**Invariantes comuns a todas**:

1. Envolvidas por `<Section>` com `id` igual ao `SectionId` da spec e `aria-labelledby` ligado ao
   `SectionHeading`.
2. Exatamente um `<h2>` por seção (o `<h1>` é exclusivo do `HeroSection`) — FR-026.
3. Mobile-first: o layout base é de coluna única; colunas aparecem a partir de `md:`.
4. Nenhuma faz requisição de rede, nenhuma lê `window` fora de `useEffect` (exigência do
   prerender — R-01).
5. Toda renderização de imagem passa por `ResponsiveImage`; todo CTA passa por `CtaButton` ou
   `WhatsAppCta`.

### Particularidades contratuais

| Seção | Invariante específica | Requisito |
|---|---|---|
| `HeroSection` | Único `<h1>` da página; `ProofBadge` com ≥ 1 item; CTA primário acima da dobra em 360×640; imagem com `priority` | FR-005, FR-016 |
| `ServicesSection` | Cada `ServiceCard` exibe espécie/porte, inclusões e duração/faixa de preço quando houver; CTA ao final da seção | FR-019, AC-015 |
| `ProductsSection` | Declara `onlineSalesAvailable` em texto visível; produto sem `price` exibe "Consulte disponibilidade e preço" | FR-020 |
| `TestimonialsSection` | Retorna `null` quando `items` está vazio (edge case de prova social insuficiente); `aggregate` só é exibido com `sourceUrl` | FR-021, CT-004 |
| `FaqSection` | Usa `Accordion` do shadcn/ui com `type="single"` e **`collapsible`**; todas as respostas presentes no HTML pré-renderizado (FR-032); CTA final para dúvida não listada | FR-022, FR-023, FR-032 |
| `ContactSection` | Endereço, telefone, e-mail e horários como texto; `MapEmbed` em facade; link de rota sempre visível independente do mapa | FR-024, R-12 |

---

## `ContactForm` — contrato de formulário

```text
ContactFormProps = {
  services: Service[]
  business: Business
  defaultServiceId?: string
}
```

**Invariantes**:

1. Cada campo tem `<Label htmlFor>` associado, `aria-invalid` no erro e `aria-describedby`
   apontando para a mensagem — herdado do `form` do shadcn/ui (AC-024).
2. Validação pelo `contactRequestSchema` (Zod), o **mesmo** schema publicado em
   [contact-endpoint.md](./contact-endpoint.md).
3. `autocomplete`: `name` e `tel` nos campos correspondentes.
4. Honeypot oculto por CSS com `tabIndex={-1}`, `aria-hidden` e `autocomplete="off"` — nunca
   `type="hidden"` (bots preenchem campos ocultos; leitores de tela devem ignorá-lo) — FR-014.
5. Estado de erro preserva os valores digitados e renderiza `WhatsAppCta` + `ContactLink` dentro do
   bloco de erro (FR-013).
6. Sucesso exibe confirmação com o `business.responseTimeLabel`, anunciada por
   `role="status"`/`aria-live="polite"` (FR-012).
7. Texto de finalidade da coleta visível junto ao envio, com link para a política de privacidade
   (FR-038).
8. O botão de envio é desabilitado durante `submitting` e exibe estado de carregamento com texto
   (não apenas um spinner).

---

## Contrato de estilos

**Organização** (dois arquivos, nenhuma exceção):

| Arquivo | Conteúdo |
|---|---|
| `src/styles/theme.css` | Bloco `@theme` do Tailwind 4: cores de marca e semânticas, famílias e escala tipográfica, escala de espaçamento, raios, sombras, breakpoints, token de alvo de toque. **Única** fonte de valores visuais. |
| `src/styles/index.css` | `@import "tailwindcss"`, `@import "./theme.css"`, `@font-face` das fontes locais, `@layer base` (reset complementar, `scroll-behavior`, `scroll-margin-top` das âncoras, estilo de `:focus-visible`), e o bloco `@media (prefers-reduced-motion: reduce)`. |

**Regras**:

1. Estilos moram nas classes utilitárias dos componentes. Não há arquivo CSS por componente, nem
   CSS Modules, nem styled-components (Princípio X: uma forma só de fazer).
2. Valores arbitrários do Tailwind (`w-[473px]`, `text-[#ff0000]`) são **proibidos**, salvo
   comentário com justificativa na linha. Cor, espaçamento, raio e sombra vêm de token (Princípio V).
3. Mobile-first literal: classe sem prefixo é mobile; `sm:`/`md:`/`lg:` apenas ampliam.
4. `!important` proibido sem justificativa escrita.
5. Modo escuro **fora de escopo** nesta entrega; os tokens já são declarados por papel semântico
   (`surface`, `surface-muted`, `foreground`, `brand`), de modo que a adição futura seja um bloco
   de redefinição de tokens, não uma varredura por componentes.
6. Ordenação de classes padronizada por `prettier-plugin-tailwindcss` — sem discussão manual em
   revisão.

**Tokens mínimos obrigatórios em `@theme`**:

```text
--color-brand-*            escala da marca
--color-surface / -muted   fundos
--color-foreground / -muted texto (contraste ≥ 4.5:1 verificado manualmente)
--color-success / -danger  estados do formulário
--font-sans / --font-display famílias auto-hospedadas
--text-base                ≥ 16px (FR-034)
--spacing-section          ritmo vertical das seções
--radius-*                 raios de card/botão
--shadow-card              elevação única e consistente
--size-touch-target        44px (FR-034)
```

---

## Contrato de tipagem

| Regra | Motivo |
|---|---|
| Tipos de conteúdo **sempre** derivados por `z.infer` dos schemas | Elimina divergência schema/tipo (R-05) |
| `type` para formas de dados; `interface` apenas para props de componente | Convenção única, sem debate em revisão |
| Props exportadas como `export type XProps` ao lado do componente | Descoberta e reuso |
| Proibidos: `any`, `as` para contornar erro, `!` de non-null, `@ts-ignore` | Princípio X; `@ts-expect-description` com justificativa escrita é a única exceção |
| União discriminada para toda variação de comportamento (`ProofItem`, `WhatsAppIntent`, `OpenStatus`, `ConversionEvent`) | Torna estado inválido inexprimível, em vez de validado em runtime |
| `SectionId` é tipo literal compartilhado por seções, navegação e eventos | Impede âncora e evento divergirem |
| Imports de tipo com `import type` (exigido por `verbatimModuleSyntax`) | Remoção garantida no bundle |
| Sem tipo genérico "só por reuso"; concretude primeiro | YAGNI |
