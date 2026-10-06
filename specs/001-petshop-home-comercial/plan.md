# Implementation Plan: Home Page Comercial do Petshop

**Branch**: `001-petshop-home-comercial` | **Date**: 2026-10-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-petshop-home-comercial/spec.md`

## Summary

Entregar a home comercial do petshop (seções S-0 a S-10, 39 requisitos funcionais) como uma
aplicação **React 19 + Vite 8 + TypeScript 7 + Tailwind CSS 4 + shadcn/ui**, **pré-renderizada em
HTML estático no build**, com conteúdo vindo de uma camada de dados tipada e validada que pode ser
trocada por um CMS sem reescrever componentes.

A abordagem técnica central tem cinco pilares:

1. **Pré-renderização obrigatória**: `vite build` seguido de um passo de prerender que gera
   `dist/index.html` com todo o HTML das seções já presente no documento. Isso é o que permite
   atender simultaneamente LCP ≤ 2,5s (AC-027), rastreabilidade das perguntas frequentes (FR-032)
   e o requisito constitucional de "HTML estático ou pré-renderizado". Uma SPA puramente
   client-side **não** atenderia esses requisitos e está descartada.
2. **Camada de conteúdo desacoplada**: `src/content/` expõe os dados por um *provider* síncrono;
   as seções recebem dados **por props** e nunca importam arquivos de conteúdo. A migração futura
   para CMS troca apenas o provider.
3. **Quatro níveis de componentização por responsabilidade**: `components/ui` (primitivos
   shadcn/ui), `components/shared` (componentes de domínio reutilizáveis), `components/layout`
   (estrutura e cromo da página) e `sections/` (as 9 seções de conteúdo, cada uma uma pasta).
4. **Tipos derivados de schemas**: Zod 4 é a fonte única de verdade; todos os tipos de conteúdo e
   de formulário vêm de `z.infer`. Sem duplicação entre validação e tipagem.
5. **Qualidade como portão de build**: `typecheck` + `lint` + `prerender` + auditorias
   Lighthouse e axe são comandos executáveis, e a falha de qualquer um bloqueia a entrega
   (Constituição, "Fluxo de Desenvolvimento e Portões de Qualidade").

## Technical Context

**Language/Version**: TypeScript 7.0.2 (porte nativo, `tsc --noEmit` como verificador de tipos) /
ES2023, Node.js 22.22 LTS para build

**Primary Dependencies** (versões verificadas no registro npm em 2026-10-06):

| Pacote | Versão | Papel |
|---|---|---|
| `react` / `react-dom` | 19.3.0 | UI e `react-dom/server` para o prerender |
| `vite` | 8.3.3 | Build (Rolldown + Lightning CSS internos) |
| `@vitejs/plugin-react` | 6.1.2 | Transform React/JSX (peers opcionais não instalados) |
| `typescript` | 7.0.2 | Tipagem |
| `tailwindcss` + `@tailwindcss/vite` | 4.3.3 | Estilos, configuração CSS-first |
| `shadcn` (CLI) | 4.21.3 | Geração dos primitivos de UI em `src/components/ui` |
| `class-variance-authority` 0.7.1, `tailwind-merge` 3.7.0, `clsx` 2.1.1 | — | Variantes e composição de classes (requisito do shadcn/ui) |
| `lucide-react` | 1.52.0 | Ícones |
| `zod` | 4.6.5 | Schemas de conteúdo e de formulário |
| `react-hook-form` 7.89.0 + `@hookform/resolvers` 5.9.1 | — | Formulário de solicitação |
| `vite-imagetools` | 12.0.1 | Derivadas responsivas AVIF/WebP no build (peer `vite >=8`) |

**Dev/qualidade**: `eslint` 9.39.5, `@eslint/js` 9.39.5, `eslint-plugin-react-hooks` 7.1.1,
`eslint-plugin-jsx-a11y` 6.10.2, `eslint-plugin-react-refresh` 0.5.7, `globals` 17.13.0,
`prettier` 3.9.9, `prettier-plugin-tailwindcss` 0.8.1, `lighthouse` 13.5.0, `@axe-core/cli` 4.13.0,
`serve` 14.2.6.

**Storage**: N/A. Conteúdo estático versionado em `src/content/` (TypeScript tipado). Nenhum banco
de dados, nenhum estado de servidor. O único dado que sai da aplicação é a solicitação de contato,
enviada ao endpoint externo definido em `contracts/contact-endpoint.md`.

**Testing**: **Nenhum teste automatizado.** A Constituição do projeto ("Padrões Técnicos e
Restrições") proíbe testes unitários, de integração e end-to-end. A qualidade é garantida por:
`tsc --noEmit` estrito, ESLint (inclui regras de acessibilidade), validação manual em dispositivos,
auditoria Lighthouse mobile e auditoria axe — todos definidos em [quickstart.md](./quickstart.md).

**Target Platform**: Web. Duas últimas versões de Chrome, Safari (incluindo iOS), Firefox, Edge e
Samsung Internet. Largura de referência mínima 360px; validação em 360/390/768/1280/1920px.
Hospedagem de arquivos estáticos com HTTPS obrigatório.

**Project Type**: Aplicação web single-page de página única, pré-renderizada no build (static site
gerado a partir de React). Projeto único na raiz do repositório.

**Performance Goals** (mobile, conexão 4G simulada): LCP ≤ 2,5s, INP ≤ 200ms, CLS ≤ 0,1;
Lighthouse ≥ 90 em Performance, Acessibilidade, Boas Práticas e SEO. Orçamento de recursos:
JavaScript inicial ≤ 150KB comprimido, CSS ≤ 25KB comprimido, imagem do hero ≤ 120KB,
total da primeira visita ≤ 600KB.

**Constraints**:

- A primeira tela (identidade, proposta, prova, localidade, CTA) deve estar no HTML entregue,
  sem depender de JavaScript para ser legível e sem depender de hidratação para que os CTAs
  de WhatsApp/telefone funcionem (são links reais).
- Nenhuma requisição a terceiros no caminho crítico: fontes auto-hospedadas, mapa carregado sob
  interação, script de análise somente após consentimento.
- Zero `any`, zero `!` de non-null assertion, zero `!important` sem justificativa escrita,
  zero valor visual "mágico" fora dos tokens de tema.
- Sem segredos no bundle: todo `import.meta.env.VITE_*` é público por definição.

**Scale/Scope**: 1 página, 11 blocos estruturais (S-0 a S-10), ~9 entidades de conteúdo,
1 formulário com 4 campos, 5 canais de conversão rastreados. Estimativa de 45–60 arquivos-fonte.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Princípio | Portão aplicado a este plano | Pré-Fase 0 | Pós-Fase 1 |
|---|---|---|---|---|
| I | Objetivo de negócio em toda funcionalidade | Cada seção em `src/sections/` corresponde a um ID S-* da spec com objetivo declarado; nenhum componente sem requisito de origem | PASS | PASS |
| II | Confiança com prova visível | Schema de conteúdo exige campo de prova no hero e `source` nos depoimentos; build falha se ausentes | PASS | PASS |
| III | Conversão e CTAs estratégicos | `MobileContactBar` persistente, `CtaButton` com evento de conversão obrigatório, `buildWhatsAppUrl` com mensagem contextual | PASS | PASS |
| IV | Mobile-first e clareza | Tailwind mobile-first (sem prefixo = mobile); tokens de alvo de toque ≥ 44px; checklist de larguras no quickstart | PASS | PASS |
| V | Design profissional e consistente | `@theme` em `src/styles/theme.css` como fonte única; `cva` para variantes; proibição de valores avulsos reforçada por lint | PASS | PASS |
| VI | Conteúdo real e específico | `src/content/` validado por Zod no dev e no prerender; pendências PC-1..PC-12 da spec bloqueiam a publicação | PASS | PASS |
| VII | SEO local e estrutura semântica | Prerender gera HTML completo; `index.html` com `title`/meta/OG; JSON-LD `PetStore` gerado a partir de `business.ts`; `sitemap.xml` e `robots.txt` em `public/` | PASS | PASS |
| VIII | Acessibilidade como requisito | `eslint-plugin-jsx-a11y` no portão de lint; primitivos shadcn/ui (Radix) acessíveis por padrão; auditoria axe obrigatória | PASS | PASS |
| IX | Performance como qualidade | Orçamentos declarados acima; `vite-imagetools` para AVIF/WebP; fontes auto-hospedadas com `font-display: swap`; mapa sob interação | PASS | PASS |
| X | Código limpo e sustentável | 4 níveis de componentização com regra de dependência unidirecional; conteúdo separado da apresentação; sem abstração especulativa | PASS | PASS |

**Portões de padrões técnicos**:

- **Testes automatizados proibidos** → nenhuma dependência de teste no `package.json`; `tasks.md`
  não deve conter tarefas de teste automatizado. **PASS**
- **Priorizar HTML estático/pré-renderizado** → prerender obrigatório no `npm run build`. **PASS**
- **HTTPS, LGPD, antispam, segredos** → tratados em
  [contracts/security-and-headers.md](./contracts/security-and-headers.md) e
  [contracts/contact-endpoint.md](./contracts/contact-endpoint.md). **PASS**
- **Mensuração de conversões** → [contracts/analytics-events.md](./contracts/analytics-events.md). **PASS**

**Resultado**: nenhuma violação. A seção "Complexity Tracking" permanece vazia.

### Decisão de versão que exige registro explícito

O usuário pediu "sempre a última versão disponível". Duas últimas versões não são compatíveis entre
si e a escolha foi feita a favor dos requisitos constitucionais:

- **ESLint 9.39.5 em vez de 10.12.0**: `eslint-plugin-jsx-a11y@6.10.2` (última) declara peer
  `eslint ^3 || … || ^9` e não suporta ESLint 10. Acessibilidade é requisito obrigatório
  (Princípio VIII) e instalar o plugin com peer quebrado seria exatamente o tipo de improviso
  proibido pelo Princípio X. ESLint 9 é a última versão compatível com o conjunto completo de
  plugins.
- **`typescript-eslint` não instalado**: a última versão (8.71.1) declara peer
  `typescript >=4.8.4 <6.1.0` e portanto não suporta TypeScript 7. A verificação de tipos fica com
  `tsc --noEmit` em modo estrito (que é mais forte que as regras type-aware do plugin para o que
  este projeto precisa) e o plugin entra no projeto quando publicar suporte a TS 7.

Detalhamento e alternativas em [research.md](./research.md) (R-02 e R-03).

## Project Structure

### Documentation (this feature)

```text
specs/001-petshop-home-comercial/
├── plan.md                        # Este arquivo
├── spec.md                        # Especificação funcional
├── research.md                    # Fase 0: decisões técnicas
├── data-model.md                  # Fase 1: entidades de conteúdo e schemas
├── quickstart.md                  # Fase 1: guia de execução e validação
├── contracts/                     # Fase 1: contratos de interface
│   ├── content-schemas.md         # Formato dos dados de conteúdo
│   ├── component-contracts.md     # Props públicas dos componentes compartilhados
│   ├── contact-endpoint.md        # Contrato de envio do formulário
│   ├── analytics-events.md        # Contrato dos eventos de conversão
│   ├── seo-structured-data.md     # Contrato do JSON-LD e metadados
│   └── security-and-headers.md    # Cabeçalhos HTTP e regras de segurança
├── checklists/
│   └── requirements.md            # Checklist de qualidade da spec
└── tasks.md                       # Fase 2 (/speckit-tasks — não criado aqui)
```

### Source Code (repository root)

```text
.
├── index.html                      # Shell: meta tags, preloads, placeholders do prerender
├── package.json
├── package-lock.json               # Versionado (Princípio X / segurança de cadeia)
├── vite.config.ts
├── tsconfig.json                   # Referências de projeto
├── tsconfig.app.json               # Código da aplicação (strict)
├── tsconfig.node.json              # vite.config.ts e scripts/
├── eslint.config.js                # Flat config (ESLint 9)
├── .prettierrc.json
├── components.json                 # Configuração do CLI shadcn
├── .env.example                    # Variáveis públicas VITE_* documentadas
├── public/
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── favicon.svg
│   ├── site.webmanifest
│   ├── _headers                    # Cabeçalhos de segurança (ver contrato)
│   └── og/og-default.jpg
├── scripts/
│   ├── prerender.ts                # Gera dist/index.html com HTML completo
│   └── validate-content.ts         # Valida src/content contra os schemas Zod
└── src/
    ├── main.tsx                    # hydrateRoot
    ├── entry-prerender.tsx         # renderToString para o script de prerender
    ├── App.tsx                     # Composição: layout + HomePage
    ├── pages/
    │   └── HomePage.tsx            # Lê o provider de conteúdo e distribui por props
    ├── styles/
    │   ├── index.css               # @import "tailwindcss" + camadas base
    │   └── theme.css               # @theme: cores, tipografia, espaçamento, raios, sombras
    ├── components/
    │   ├── ui/                     # Primitivos shadcn/ui (gerados pelo CLI)
    │   │   ├── accordion.tsx
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   ├── form.tsx
    │   │   ├── input.tsx
    │   │   ├── label.tsx
    │   │   ├── sheet.tsx
    │   │   ├── sonner.tsx
    │   │   └── textarea.tsx
    │   ├── layout/
    │   │   ├── SiteHeader.tsx      # S-0
    │   │   ├── SiteNav.tsx         # Navegação desktop + Sheet no mobile
    │   │   ├── SiteFooter.tsx      # S-9
    │   │   ├── MobileContactBar.tsx# S-10
    │   │   ├── SkipLink.tsx        # Acessibilidade: pular para o conteúdo
    │   │   └── Section.tsx         # <section> com id, aria-labelledby e espaçamento padrão
    │   └── shared/
    │       ├── CtaButton.tsx       # Botão de conversão com rastreamento obrigatório
    │       ├── ContactLink.tsx     # tel:, mailto:, rota — acionáveis e rastreados
    │       ├── WhatsAppCta.tsx     # CTA de WhatsApp com mensagem contextual
    │       ├── SectionHeading.tsx  # Eyebrow + h2 + subtítulo (hierarquia garantida)
    │       ├── ProofBadge.tsx      # Nota, nº de avaliações, anos de atuação
    │       ├── ResponsiveImage.tsx # <picture> com AVIF/WebP, dimensões e lazy
    │       ├── OpenStatusBadge.tsx # "Aberto agora" / próximo horário (pós-hidratação)
    │       └── IconBadge.tsx
    ├── sections/                   # Uma pasta por seção da home (S-1 a S-8)
    │   ├── hero/HeroSection.tsx
    │   ├── about/AboutSection.tsx
    │   ├── differentials/DifferentialsSection.tsx
    │   ├── services/
    │   │   ├── ServicesSection.tsx
    │   │   └── ServiceCard.tsx
    │   ├── products/
    │   │   ├── ProductsSection.tsx
    │   │   └── ProductCard.tsx
    │   ├── testimonials/
    │   │   ├── TestimonialsSection.tsx
    │   │   └── TestimonialCard.tsx
    │   ├── faq/FaqSection.tsx
    │   └── contact/
    │       ├── ContactSection.tsx
    │       ├── ContactForm.tsx
    │       ├── BusinessHoursTable.tsx
    │       └── MapEmbed.tsx        # Carregado sob interação (facade)
    ├── content/                    # Fonte única de conteúdo (substituível por CMS)
    │   ├── index.ts                # getSiteContent(): contrato do provider
    │   ├── business.ts             # NAP, horários, canais, redes
    │   ├── hero.ts
    │   ├── about.ts
    │   ├── differentials.ts
    │   ├── services.ts
    │   ├── products.ts
    │   ├── testimonials.ts
    │   └── faq.ts
    ├── schemas/                    # Zod: fonte única de tipos
    │   ├── content.schema.ts
    │   └── contact-request.schema.ts
    ├── types/
    │   ├── content.ts              # z.infer dos schemas de conteúdo
    │   └── analytics.ts            # União discriminada dos eventos de conversão
    ├── lib/
    │   ├── utils.ts                # cn() (requerido pelo shadcn/ui)
    │   ├── whatsapp.ts             # buildWhatsAppUrl(intent)
    │   ├── business-hours.ts       # getOpenStatus(now, schedule)
    │   ├── analytics.ts            # trackConversion() com fila e consentimento
    │   ├── contact/
    │   │   ├── submit.ts           # Adaptador: endpoint HTTP ou composer WhatsApp
    │   │   └── types.ts
    │   └── seo/
    │       ├── jsonld.ts           # buildLocalBusinessJsonLd(business)
    │       └── meta.ts             # title/description/OG a partir de business.ts
    ├── hooks/
    │   ├── useOpenStatus.ts
    │   ├── useScrollSpy.ts         # Destaque da seção ativa na navegação
    │   └── usePrefersReducedMotion.ts
    └── assets/
        ├── images/                 # Originais importados (hash + derivadas no build)
        └── fonts/                  # Fontes auto-hospedadas (woff2, subset latin)
```

**Structure Decision**: projeto único na raiz (não há backend neste escopo — ver
`contracts/contact-endpoint.md`). A organização responde diretamente ao pedido de "separação clara
entre layout, seções da página, componentes reutilizáveis e elementos compartilhados de interface"
através de uma **regra de dependência unidirecional**, que é o que impede a degradação da estrutura
com o tempo:

```text
pages/  →  sections/  →  components/shared/  →  components/ui/
   ↓           ↓                ↓
          components/layout/    lib/ · hooks/ · types/
   ↓
content/  →  schemas/
```

Regras que acompanham o diagrama e devem ser verificadas na revisão de código:

1. **`components/ui/` não importa nada do projeto** além de `lib/utils`. São primitivos gerados
   pelo shadcn CLI; alterações neles são pontuais e documentadas.
2. **`components/shared/` não conhece seções nem conteúdo.** Recebe tudo por props. É o nível onde
   vivem as decisões de domínio reutilizáveis (um CTA sempre rastreia; uma imagem sempre tem
   dimensões declaradas).
3. **`sections/` não importa `content/`.** Cada seção é uma função pura dos seus props. Essa é a
   regra que viabiliza o CMS futuro sem refatoração.
4. **`pages/HomePage.tsx` é o único lugar que lê o provider de conteúdo** e distribui os dados.
   Trocar `content/` por uma fonte remota altera este arquivo e o provider — mais nada.
5. **`lib/` é livre de React** (exceto hooks, que ficam em `hooks/`). Funções puras e testáveis
   manualmente no console.
6. **Uma seção por pasta**; subcomponentes usados por apenas uma seção moram na pasta dela e não
   em `shared/`. Promoção para `shared/` só quando houver o segundo uso real (YAGNI).

## Complexity Tracking

> Não aplicável: a verificação da Constituição não apontou violações.
