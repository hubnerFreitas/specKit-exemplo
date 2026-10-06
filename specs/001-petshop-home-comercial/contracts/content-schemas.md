# Contrato — Schemas de Conteúdo

**Feature**: Home Page Comercial do Petshop | **Plan**: [../plan.md](../plan.md) | **Entidades**: [../data-model.md](../data-model.md)

Este é o contrato entre a **fonte de conteúdo** (hoje arquivos TypeScript; amanhã um CMS) e a
**apresentação**. Enquanto o `SiteContent` retornado satisfizer os schemas, nenhum componente
precisa mudar — é o que sustenta a promessa de "crescimento sem refatoração caótica".

---

## Interface do provider

```text
// src/content/index.ts
import type { SiteContent } from '@/types/content'

export function getSiteContent(): SiteContent
```

**Hoje**: compõe os módulos de `src/content/*.ts` e retorna o objeto, já validado pelo schema em
desenvolvimento.

**Com CMS** (R-05): a assinatura passa a `Promise<SiteContent>`, a busca acontece no
`scripts/prerender.ts` (que roda em Node, no build) e o resultado é passado como prop para
`<App content={...} />`. Os schemas continuam sendo o ponto de validação. `HomePage.tsx` e o
provider são os únicos arquivos afetados.

---

## Localização dos schemas

| Arquivo | Conteúdo |
|---|---|
| `src/schemas/content.schema.ts` | `siteContentSchema` e todos os sub-schemas |
| `src/schemas/contact-request.schema.ts` | `contactRequestSchema` (compartilhado com o endpoint) |
| `src/types/content.ts` | `export type SiteContent = z.infer<typeof siteContentSchema>` e derivados |

**Regra**: nenhum tipo de conteúdo é escrito à mão. Todos vêm de `z.infer`. Divergência entre
schema e tipo passa a ser impossível, em vez de improvável.

---

## Regras de validação por entidade

Tabela normativa — é a tradução dos requisitos da especificação em condições de build. A coluna
"Falha quando" é o que `npm run validate:content` reporta.

### `business`

| Regra | Falha quando |
|---|---|
| `taxId` no formato `00.000.000/0000-00` | CNPJ ausente ou malformado |
| `phone.e164` e `whatsapp.e164` casam `^\+55\d{10,11}$` | número não normalizado |
| `phone.display` casa `^\(\d{2}\) \d{4,5}-\d{4}$` | máscara fora do padrão brasileiro |
| `address.landmark` não vazio | ponto de referência ausente (FR-024) |
| `address.coordinates` dentro dos limites válidos | coordenada ausente ou impossível (FR-028) |
| `hours.weekly` com exatamente 7 dias distintos | dia faltando ou repetido |
| Em cada intervalo, `closesAt > opensAt`; intervalos do mesmo dia sem sobreposição | horário incoerente |
| `serviceAreas` com 1 a 8 itens | área de atendimento não declarada (FR-016, FR-028) |
| `privacyPolicyUrl` presente | FR-038 não atendido |
| `responseTimeLabel` presente | FR-012 sem prazo de retorno declarado |

### `hero`

| Regra | Falha quando |
|---|---|
| `headline` 20–90 caracteres | título vago ou longo demais para 360px |
| `subheadline` 40–180 caracteres | fora da faixa |
| `proofItems` com 1 a 3 itens | **nenhum elemento de prova** (Princípio II, FR-016) |
| `proofItems[].kind === 'rating'` exige `reviewCount ≥ 1` | nota sem contagem de avaliações (CT-004) |
| `primaryCta.channel === 'whatsapp'` | CTA principal não é o canal principal (FR-005) |
| `image` presente com `alt` não vazio | imagem ausente ou sem texto alternativo |

### `about`

| Regra | Falha quando |
|---|---|
| `paragraphs` 1–4 itens, cada um 80–600 caracteres | texto ausente ou parágrafo-monólito |
| `verifiableFacts` com ≥ 1 item | **nenhum dado verificável** (FR-017, Princípio II) |
| `yearsInBusiness` coerente com `business.foundedYear` (±1) | números se contradizem na página |
| `images` com ≥ 1 item | sem foto real do espaço (CT-005) |

### `differentials`

| Regra | Falha quando |
|---|---|
| 3 a 6 itens | fora da faixa de FR-018 |
| `id` único | duplicidade |
| `evidence` não vazio, 10–160 caracteres | **diferencial sem evidência** (FR-018, CT-003) |
| `title` 3–40, `description` 40–220 | fora da faixa |
| `icon` corresponde a um ícone existente em `lucide-react` | nome de ícone inválido |

### `services`

| Regra | Falha quando |
|---|---|
| ≥ 1 item; `id` único | catálogo vazio ou duplicado |
| `species` com ≥ 1 valor | espécie atendida não declarada (AC-015) |
| `sizes` com ≥ 1 valor quando `species` inclui `dog` | porte não declarado para cães (AC-015) |
| `includes` com ≥ 2 itens | escopo do serviço vago (FR-019) |
| `durationMinutes.max ≥ min`; `priceRange.max ≥ min` | faixa invertida |
| `cta.intent === 'service:' + id` | mensagem de WhatsApp não contextual (FR-008) |
| Existe serviço com `'cat'` **ou** pergunta frequente de tópico `cats` | atendimento a gatos não esclarecido (FR-022) |

### `products`

| Regra | Falha quando |
|---|---|
| 4 a 8 itens **visíveis** (`availability !== 'unavailable'`) | fora da faixa de FR-020 |
| `onlineSalesAvailable` presente (boolean) | a seção não declara se há venda on-line (FR-020) |
| `image` presente com `alt` | produto sem imagem real (CT-005) |
| `price` ausente ⇒ card usa texto de consulta | preço potencialmente desatualizado |
| `cta.intent === 'product:' + id` | mensagem não contextual (FR-008) |

### `testimonials`

| Regra | Falha quando |
|---|---|
| Bloco ausente **ou** com 3 a 6 itens | 1–2 depoimentos (prova social fraca) ou mais de 6 |
| `authorName` presente em todos | **depoimento anônimo** (FR-021, CT-004) |
| `aggregate` presente exige `sourceUrl` | nota agregada sem fonte pública (CT-004) |
| `aggregate.reviewCount ≥ 1` | contagem inválida |
| `date` não futura | data inconsistente |
| `photo` presente exige `mediaConsent === true` | foto sem autorização (CT-005, LGPD) |

**Bloco ausente é válido e intencional**: é o tratamento do edge case "prova social insuficiente".
O que o schema **não** aceita é depoimento meio preenchido.

### `faq`

| Regra | Falha quando |
|---|---|
| 6 a 10 itens | fora da faixa de FR-022 |
| `question` termina com `?`, 10–140 caracteres | pergunta malformada |
| `answer` 40–800 caracteres | resposta vaga ou longa demais |
| `order` único | ordenação ambígua |
| **Os 8 tópicos obrigatórios cobertos** | AC-016 não atendido — ver abaixo |

Tópicos cuja ausência quebra o build: `pricing`, `duration`, `scheduling`, `cats`,
`special-pets`, `vaccination`, `payment`, `cancellation`.

### `seo`

| Regra | Falha quando |
|---|---|
| `title` 30–60 caracteres | truncaria no resultado de busca (FR-027) |
| `description` 120–158 caracteres | fora da faixa útil (FR-027) |
| `canonicalUrl` absoluta em `https://` | canonical inválida |
| `ogImage` com ≥ 1200×630 e `alt` | prévia de compartilhamento ruim (FR-031) |

---

## Detecção de conteúdo placeholder

`validate-content.ts` roda uma verificação heurística adicional e **falha** ao encontrar, em
qualquer campo de texto, as marcas de conteúdo provisório (CT-001):

- `lorem`, `ipsum`, `placeholder`, `TODO`, `TBD`, `xxx`, `preencher`, `exemplo.com`
- `Serviço 1`, `Produto 1`, `Cliente 1`, `Nome Sobrenome` e variações numeradas
- Texto repetido idêntico em dois itens diferentes da mesma coleção
- `tel:+550000000000`, `00.000.000/0000-00` e outros valores-sentinela

Isso transforma CT-001 ("nenhum conteúdo com cara de placeholder") de item de revisão visual em
condição mecânica. Heurística não substitui a revisão humana de qualidade do texto — ela elimina a
classe de erro mais comum e mais embaraçosa.

---

## Comandos

| Comando | Efeito |
|---|---|
| `npm run validate:content` | Executa `scripts/validate-content.ts`; sai com código ≠ 0 ao encontrar qualquer violação, listando campo, regra e requisito de origem |
| `npm run build` | Executa `validate:content` → `typecheck` → `vite build` → `prerender`. Qualquer etapa falha aborta o build |

**Formato da mensagem de erro** (para que a correção seja óbvia, incluindo para quem edita conteúdo
e não código):

```text
✖ services[2].includes — esperado ao menos 2 itens, recebido 1
  Requisito: FR-019 (cada serviço declara o que está incluso)
  Arquivo: src/content/services.ts
```
