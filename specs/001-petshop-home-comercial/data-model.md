# Phase 1 — Modelo de Dados

**Feature**: Home Page Comercial do Petshop | **Date**: 2026-10-06 | **Plan**: [plan.md](./plan.md)

Não há banco de dados. O "modelo de dados" deste projeto é a **camada de conteúdo**: estruturas
tipadas, validadas por Zod no build, que alimentam as seções por props. Os schemas em
`src/schemas/content.schema.ts` são a fonte única de verdade; os tipos em `src/types/content.ts`
são derivados por `z.infer`.

As regras de validação abaixo não são decorativas: elas são o mecanismo que torna os Princípios II
(prova visível) e VI (conteúdo real) **executáveis** — o build falha quando violadas.

---

## Agregado raiz: `SiteContent`

```text
SiteContent
├── business      : Business          (NAP, canais, horários, redes)
├── hero          : HeroContent       (S-1)
├── about         : AboutContent      (S-2)
├── differentials : Differential[]    (S-3)
├── services      : Service[]         (S-4)
├── products      : Product[]         (S-5)
├── testimonials  : TestimonialsBlock (S-6)
├── faq           : FaqItem[]         (S-7)
└── seo           : SeoContent        (metadados)
```

Obtido por `getSiteContent(): SiteContent` em `src/content/index.ts`. `HomePage.tsx` é o único
consumidor.

---

## `Business` — dados do negócio (entidade central)

Fonte única do NAP. **Todas** as exibições de nome, endereço e telefone na página derivam daqui,
e o JSON-LD também — é assim que FR-029/AC-017 (NAP idêntico em toda a página) deixa de depender de
disciplina humana.

| Campo | Tipo | Regra de validação | Requisito |
|---|---|---|---|
| `legalName` | string | 1–120 caracteres | FR-025 |
| `tradeName` | string | 1–60 caracteres | FR-016, FR-025 |
| `taxId` | string | formato CNPJ `00.000.000/0000-00` | FR-017, FR-025 |
| `foundedYear` | number | inteiro, 1900 ≤ ano ≤ ano atual | FR-017 |
| `address` | `Address` | ver abaixo | FR-024, FR-028 |
| `phone` | `PhoneNumber` | ver abaixo | FR-009, FR-024 |
| `whatsapp` | `PhoneNumber` | ver abaixo | FR-008 |
| `email` | string | e-mail válido | FR-024 |
| `hours` | `BusinessHours` | ver abaixo | FR-004, FR-024 |
| `serviceAreas` | string[] | 1–8 itens, bairros/cidades atendidos | FR-016, FR-028 |
| `socials` | `SocialLink[]` | 0–6 itens | FR-025 |
| `responsiblePerson` | `{ name, role, credential? }` opcional | `credential` para CRMV quando houver veterinário | FR-017 |
| `privacyPolicyUrl` | string | URL ou caminho interno | FR-025, FR-038 |
| `responseTimeLabel` | string | ex.: "Respondemos em até 1 hora no horário comercial" | FR-012, FR-024 |

### `Address`

| Campo | Tipo | Regra |
|---|---|---|
| `street`, `number` | string | obrigatórios |
| `complement` | string opcional | — |
| `district`, `city` | string | obrigatórios |
| `state` | string | 2 letras maiúsculas (UF) |
| `postalCode` | string | formato `00000-000` |
| `landmark` | string | obrigatório — ponto de referência exigido por FR-024 |
| `coordinates` | `{ latitude, longitude }` | latitude −90..90, longitude −180..180 — exigido por FR-028 |

### `PhoneNumber`

| Campo | Tipo | Regra |
|---|---|---|
| `e164` | string | `^\+55\d{10,11}$` — usado em `tel:` e `wa.me` |
| `display` | string | `(00) 00000-0000` — usado no texto visível |

Dois campos em vez de um porque a forma de discagem e a forma de leitura são diferentes, e derivar
uma da outra em tempo de renderização é fonte recorrente de erro.

### `BusinessHours`

```text
BusinessHours = { weekly: DaySchedule[7], exceptions: HoursException[] }

DaySchedule = { weekday: 0..6, closed: boolean, intervals: TimeInterval[] }
TimeInterval = { opensAt: "HH:MM", closesAt: "HH:MM" }
HoursException = { date: "YYYY-MM-DD", closed: boolean, intervals: TimeInterval[], note?: string }
```

**Regras**: exatamente 7 entradas em `weekly`, uma por dia, sem repetição de `weekday`; se
`closed === false`, `intervals` tem ao menos 1 item; em cada intervalo `closesAt > opensAt`;
intervalos do mesmo dia não se sobrepõem. Fuso fixo `America/Sao_Paulo` (R-09).

**Estado derivado** (`getOpenStatus(now, hours)` em `src/lib/business-hours.ts`, calculado só no
cliente):

```text
OpenStatus =
  | { state: 'open';   closesAt: "HH:MM" }
  | { state: 'closed'; nextOpenWeekday: 0..6; nextOpenAt: "HH:MM" }
  | { state: 'unknown' }                      // primeira renderização / antes da hidratação
```

`'unknown'` existe para que o HTML pré-renderizado e a primeira renderização do cliente sejam
idênticos (R-09).

---

## `HeroContent` (S-1)

| Campo | Tipo | Regra | Requisito |
|---|---|---|---|
| `headline` | string | 20–90 caracteres | FR-016 |
| `subheadline` | string | 40–180 caracteres | FR-016 |
| `proofItems` | `ProofItem[]` | **mínimo 1**, máximo 3 | FR-016, Princípio II |
| `primaryCta` | `CtaDefinition` | obrigatório, canal `whatsapp` | FR-005 |
| `secondaryCta` | `CtaDefinition` opcional | — | FR-016 |
| `image` | `ImageAsset` | obrigatória | FR-016 |

`proofItems` com mínimo 1 é a tradução direta do Princípio II em regra de build.

### `ProofItem`

```text
ProofItem =
  | { kind: 'rating';      value: 0..5; reviewCount: number ≥ 1; sourceUrl?: string }
  | { kind: 'experience';  years: number ≥ 1 }
  | { kind: 'volume';      label: string; value: string }
```

União discriminada para que cada tipo de prova carregue só os campos que fazem sentido — um
`rating` sem `reviewCount` não compila.

### `CtaDefinition`

```text
CtaDefinition = {
  label: string            // ≤ 40 caracteres (CT-007)
  channel: 'whatsapp' | 'phone' | 'form' | 'route' | 'anchor'
  intent: string           // chave da mensagem/contexto; ver contracts/analytics-events.md
  anchorId?: string        // obrigatório quando channel === 'anchor'
}
```

**Regra**: `label` ≤ 40 caracteres é CT-007 verificado no build, não na revisão visual.

---

## `AboutContent` (S-2)

| Campo | Tipo | Regra | Requisito |
|---|---|---|---|
| `title` | string | 10–80 caracteres | FR-017 |
| `paragraphs` | string[] | 1–4 itens, cada um 80–600 caracteres | FR-017 |
| `yearsInBusiness` | number | inteiro ≥ 1, coerente com `business.foundedYear` | FR-017 |
| `verifiableFacts` | `VerifiableFact[]` | **mínimo 1** | FR-017, Princípio II |
| `team` | `TeamMember[]` | 0–8 itens | FR-017 |
| `images` | `ImageAsset[]` | **mínimo 1** foto real do espaço | FR-017, CT-005 |

```text
VerifiableFact = { label: string; value: string; kind: 'address' | 'taxId' | 'credential' | 'tenure' | 'certification' }
TeamMember     = { name: string; role: string; credential?: string; photo?: ImageAsset }
```

---

## `Differential` (S-3)

| Campo | Tipo | Regra | Requisito |
|---|---|---|---|
| `id` | string | slug único | — |
| `title` | string | 3–40 caracteres | FR-018 |
| `description` | string | 40–220 caracteres | FR-018 |
| `evidence` | string | **obrigatório**, 10–160 caracteres | FR-018, CT-003 |
| `icon` | string | nome de ícone `lucide-react` | FR-018 |

**Regra de coleção**: 3 ≤ `differentials.length` ≤ 6 (FR-018).

`evidence` obrigatório é o que impede o diferencial genérico: não existe diferencial sem a
evidência que o sustenta.

---

## `Service` (S-4)

| Campo | Tipo | Regra | Requisito |
|---|---|---|---|
| `id` | string | slug único | — |
| `name` | string | 3–60 caracteres | FR-019 |
| `summary` | string | 40–200 caracteres | FR-019 |
| `species` | `('dog' \| 'cat' \| 'other')[]` | **mínimo 1** | FR-019, AC-015 |
| `sizes` | `('small' \| 'medium' \| 'large' \| 'giant')[]` | mínimo 1 quando `species` inclui `dog` | FR-019, AC-015 |
| `includes` | string[] | **mínimo 2** itens, cada um 3–80 caracteres | FR-019 |
| `durationMinutes` | `{ min, max }` opcional | `max ≥ min`, ambos > 0 | FR-019 |
| `priceRange` | `{ min, max, currency: 'BRL' }` opcional | `max ≥ min` | FR-019 |
| `restrictions` | string[] | 0–4 itens | FR-019, edge case de serviço incompatível |
| `cta` | `CtaDefinition` | obrigatório, `intent` deriva de `id` | FR-019, FR-008 |
| `image` | `ImageAsset` opcional | — | — |

**Regra de coleção**: `services.length ≥ 1`; `id` único; ao menos um serviço com `species`
contendo `'cat'` **ou** uma pergunta frequente explícita sobre atendimento a gatos (FR-022) —
coerência verificada por `validate-content.ts`.

**Regra `priceRange` / `durationMinutes` ambos ausentes**: permitido, mas então `summary` deve
mencionar como o orçamento é feito — verificação manual registrada no checklist de conteúdo.

---

## `Product` (S-5)

| Campo | Tipo | Regra | Requisito |
|---|---|---|---|
| `id` | string | slug único | — |
| `name` | string | 3–80 caracteres | FR-020 |
| `category` | string | 3–40 caracteres | FR-020 |
| `description` | string | 20–160 caracteres | FR-020 |
| `image` | `ImageAsset` | obrigatória | FR-020, CT-005 |
| `availability` | `'in-store' \| 'on-request' \| 'unavailable'` | obrigatório | edge case de estoque |
| `price` | `{ amount, currency: 'BRL' }` opcional | ausente quando não confirmado | edge case de preço |
| `cta` | `CtaDefinition` | obrigatório | FR-020 |

**Regra de coleção**: 4 ≤ `products.length` ≤ 8 (FR-020). Produtos com
`availability === 'unavailable'` são filtrados na renderização, e a contagem mínima considera
apenas os visíveis.

**Regra de negócio**: `price` ausente ⇒ o card exibe "Consulte disponibilidade e preço" em vez de
um valor — nunca um preço desatualizado (edge case da spec).

### `ProductsBlock` (metadados da seção)

| Campo | Tipo | Regra | Requisito |
|---|---|---|---|
| `onlineSalesAvailable` | boolean | obrigatório | FR-020 — a seção deve declarar explicitamente se há venda on-line |
| `items` | `Product[]` | regra de coleção acima | FR-020 |

---

## `TestimonialsBlock` (S-6)

| Campo | Tipo | Regra | Requisito |
|---|---|---|---|
| `aggregate` | `{ rating: 0..5, reviewCount: number ≥ 1, sourceUrl: string }` opcional | se presente, `sourceUrl` é obrigatório | FR-021 |
| `items` | `Testimonial[]` | 3–6 itens | FR-021 |

### `Testimonial`

| Campo | Tipo | Regra | Requisito |
|---|---|---|---|
| `id` | string | único | — |
| `authorName` | string | **obrigatório**, 2–60 caracteres | FR-021, CT-004 |
| `petName` | string opcional | — | — |
| `quote` | string | 40–400 caracteres | FR-021 |
| `rating` | 1..5 opcional | inteiro | FR-021 |
| `date` | string | `YYYY-MM-DD`, não futura | FR-021 |
| `sourceUrl` | string opcional | URL da avaliação pública | FR-021 |
| `photo` | `ImageAsset` opcional | exige `mediaConsent === true` | CT-005 |

**Regras que materializam o Princípio II**:

- `authorName` obrigatório — depoimento anônimo não é prova verificável.
- `aggregate.sourceUrl` obrigatório quando há nota agregada — número sem fonte é proibido por CT-004.
- `photo` presente exige `mediaConsent: true` — autorização de uso de imagem (CT-005, LGPD).
- **Bloco ausente é estado válido**: se não houver depoimentos reais, `testimonials` é `undefined`
  e a seção não é renderizada (edge case "prova social insuficiente"). O build **não** aceita
  depoimento preenchido parcialmente.

---

## `FaqItem` (S-7)

| Campo | Tipo | Regra | Requisito |
|---|---|---|---|
| `id` | string | slug único | — |
| `question` | string | 10–140 caracteres, termina com `?` | FR-022 |
| `answer` | string | 40–800 caracteres | FR-022 |
| `topic` | `FaqTopic` | obrigatório | FR-022 |
| `order` | number | inteiro ≥ 0, único | FR-022 |

```text
FaqTopic = 'pricing' | 'duration' | 'scheduling' | 'cats' | 'special-pets'
         | 'vaccination' | 'payment' | 'cancellation' | 'other'
```

**Regra de cobertura obrigatória** — `validate-content.ts` falha se qualquer um dos 8 tópicos
mínimos de FR-022/AC-016 não tiver pelo menos uma pergunta: `pricing`, `duration`, `scheduling`,
`cats`, `special-pets`, `vaccination`, `payment`, `cancellation`.

**Regra de coleção**: 6 ≤ `faq.length` ≤ 10 (FR-022).

Esta é a verificação de conteúdo mais valiosa do projeto: transforma "as perguntas frequentes
cobrem as 8 objeções" (AC-016) de item de revisão manual em condição de build.

---

## `SeoContent`

| Campo | Tipo | Regra | Requisito |
|---|---|---|---|
| `title` | string | 30–60 caracteres, contém serviço e cidade/bairro | FR-027 |
| `description` | string | 120–158 caracteres | FR-027 |
| `canonicalUrl` | string | URL absoluta HTTPS | FR-027 |
| `ogImage` | `ImageAsset` | ≥ 1200×630 | FR-031 |
| `locale` | string | fixo `pt-BR` | — |

Os limites de caracteres existem para que um `title` truncado no resultado de busca seja detectado
no build, e não três meses depois.

---

## `ImageAsset` (tipo compartilhado)

| Campo | Tipo | Regra | Requisito |
|---|---|---|---|
| `source` | objeto de `vite-imagetools` (`as=picture`) | importado, nunca string solta | R-06 |
| `alt` | string | **obrigatório**; vazio só com `decorative: true` | FR-030, AC-026 |
| `decorative` | boolean opcional | `true` ⇒ `alt=""` e `aria-hidden` | FR-030 |
| `width`, `height` | number | vindos do pipeline; obrigatórios | AC-027 (CLS) |
| `mediaConsent` | boolean opcional | obrigatório `true` em fotos com pessoas/pets identificáveis | CT-005, LGPD |

`alt` como campo obrigatório do tipo, e não como prop opcional do componente, é o que impede a
imagem sem texto alternativo de chegar ao build.

---

## `ContactRequest` — único dado que sai da aplicação

Definido em `src/schemas/contact-request.schema.ts`; é também o contrato do endpoint
([contracts/contact-endpoint.md](./contracts/contact-endpoint.md)).

| Campo | Tipo | Regra de validação | Requisito |
|---|---|---|---|
| `name` | string | 2–80 caracteres, após `trim` | FR-011, FR-012 |
| `phone` | string | 10–11 dígitos após remover máscara; DDD válido (11–99) | FR-011, FR-012 |
| `serviceId` | string | deve existir em `services[].id` | FR-011 |
| `message` | string opcional | ≤ 500 caracteres | FR-011 |
| `origin` | `{ section: SectionId; item?: string }` | preenchido pela aplicação | FR-015 |
| `honeypot` | string | deve ser **vazio** | FR-014 |
| `renderedAt` | number | timestamp; `now - renderedAt ≥ 3000`ms | FR-014 |

**Campos deliberadamente ausentes**: e-mail, endereço, CPF, nome do animal, raça. FR-011 manda
pedir apenas o estritamente necessário, e a LGPD reforça a minimização. Qualquer campo adicional
exige justificativa escrita na revisão.

**Estados do envio** (máquina de estados do formulário):

```text
idle ──submit──▶ submitting ──┬──▶ success   (confirmação + prazo de retorno; FR-012)
                              └──▶ error     (mensagem clara + dados preservados
                                              + CTAs WhatsApp/telefone; FR-013)
error ──submit──▶ submitting
success ─────────▶ idle       (apenas se o usuário iniciar novo envio)
```

Transição proibida: `submitting → idle` sem passar por `success` ou `error` (perderia o feedback).

---

## `ConversionEvent` — evento de mensuração

Tipado em `src/types/analytics.ts`, contrato completo em
[contracts/analytics-events.md](./contracts/analytics-events.md).

```text
ConversionEvent = {
  channel: 'whatsapp' | 'phone' | 'email' | 'route' | 'form'
  section: SectionId        // 'header' | 'hero' | ... | 'footer' | 'mobile-bar'
  itemId?: string           // id do serviço ou produto de origem
  intent: string
  occurredAt: number
}

SectionId = 'header' | 'hero' | 'about' | 'differentials' | 'services'
          | 'products' | 'testimonials' | 'faq' | 'contact' | 'footer' | 'mobile-bar'
```

`section` é obrigatório porque SC-006 ("85% dos acionamentos ocorrem na primeira tela ou nos pontos
de decisão definidos") só é mensurável se cada conversão souber de onde veio.

---

## Relacionamentos e invariantes entre entidades

| Invariante | Verificado por | Requisito |
|---|---|---|
| `ContactRequest.serviceId` ∈ `services[].id` | Zod com enum derivado do conteúdo | FR-011 |
| `CtaDefinition.intent` de um serviço deriva do `id` do serviço | `validate-content.ts` | FR-008 |
| `about.yearsInBusiness` coerente com `business.foundedYear` | `validate-content.ts` | FR-017 |
| Todo `ConversionEvent.itemId` referencia um `Service.id` ou `Product.id` existente | revisão de código | FR-015 |
| JSON-LD deriva **somente** de `business` | `src/lib/seo/jsonld.ts` (única fonte) | FR-028, FR-029 |
| Todo texto visível de telefone usa `phone.display`; todo `href` usa `phone.e164` | `ContactLink` encapsula os dois | FR-029 |
| Os 8 tópicos obrigatórios de perguntas frequentes estão cobertos | `validate-content.ts` | AC-016 |
| Nenhum `ImageAsset` sem `alt` (salvo `decorative`) | tipo + `jsx-a11y` | AC-026 |
| Todo `CtaDefinition.label` ≤ 40 caracteres | Zod | CT-007 |

---

## Pendências de conteúdo

As pendências PC-1 a PC-12 da [spec](./spec.md#pendências-de-conteúdo-real) correspondem
diretamente aos campos obrigatórios acima. Enquanto não forem preenchidas com dados reais,
`npm run validate:content` falha — que é o comportamento desejado: o Princípio VI proíbe conteúdo
provisório em produção, e aqui essa proibição é mecânica, não uma lembrança.

| Pendência | Campos bloqueados |
|---|---|
| PC-1 | `business.legalName`, `tradeName`, `taxId` |
| PC-2 | `business.address.*` (inclui `landmark` e `coordinates`) |
| PC-3 | `business.phone`, `whatsapp`, `email` |
| PC-4 | `business.hours.weekly`, `exceptions` |
| PC-5 | `business.foundedYear`, `about.*`, `business.responsiblePerson` |
| PC-6 | `services[]` |
| PC-7 | `products.items[]`, `products.onlineSalesAvailable` |
| PC-8 | `testimonials.items[]`, `testimonials.aggregate` |
| PC-9 | `differentials[]` (em especial `evidence`) |
| PC-10 | `faq[]` (8 tópicos obrigatórios) |
| PC-11 | `hero.image`, `about.images`, `products.items[].image`, `seo.ogImage` |
| PC-12 | `business.socials`, `business.privacyPolicyUrl` |
