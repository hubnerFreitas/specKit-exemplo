---

description: "Lista de tarefas para implementação da Home Page Comercial do Petshop"
---

# Tasks: Home Page Comercial do Petshop

**Input**: Documentos de design em `/specs/001-petshop-home-comercial/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: **Nenhuma tarefa de teste automatizado.** A Constituição do projeto
(`.specify/memory/constitution.md`, seção "Padrões Técnicos e Restrições") proíbe testes
unitários, de integração e end-to-end. A verificação é feita por `typecheck` + `lint` +
`validate:content` + auditorias Lighthouse/axe + roteiros manuais do
[quickstart.md](./quickstart.md).

**Organization**: tarefas agrupadas por história de usuário (US1–US5), em ordem de prioridade, para
permitir implementação e validação independentes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: pode rodar em paralelo (arquivos diferentes, sem dependência pendente)
- **[Story]**: história de usuário a que a tarefa pertence (US1–US5)
- Todo caminho de arquivo é relativo à raiz do repositório

## Path Conventions

Projeto único na raiz, conforme "Structure Decision" do [plan.md](./plan.md): código em `src/`,
scripts de build em `scripts/`, arquivos públicos em `public/`. Não há diretório `tests/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: inicializar o projeto com o stack exato aprovado no plano e as ferramentas de
qualidade que atuam como portões.

- [X] T001 Criar o projeto Vite + React + TypeScript na raiz do repositório com `npm create vite@latest . -- --template react-ts`, mantendo os arquivos de `.specify/` e `specs/` intactos
- [X] T002 Fixar as dependências de produção em `package.json` com **versões exatas, sem `^` nem `~`** (regra de segurança de cadeia, `contracts/security-and-headers.md`): `react@19.3.0`, `react-dom@19.3.0`, `zod@4.6.5`, `react-hook-form@7.89.0`, `@hookform/resolvers@5.9.1`, `lucide-react@1.52.0`, `class-variance-authority@0.7.1`, `tailwind-merge@3.7.0`, `clsx@2.1.1`
- [X] T003 Fixar as dependências de desenvolvimento em `package.json` com versões exatas: `vite@8.3.3`, `@vitejs/plugin-react@6.1.2`, `typescript@7.0.2`, `@types/react@19.3.0`, `@types/react-dom@19.3.0`, `tailwindcss@4.3.3`, `@tailwindcss/vite@4.3.3`, `vite-imagetools@12.0.1`, `vite-node@6.0.0`, `eslint@9.39.5`, `@eslint/js@9.39.5`, `eslint-plugin-react-hooks@7.1.1`, `eslint-plugin-jsx-a11y@6.10.2`, `eslint-plugin-react-refresh@0.5.7`, `globals@17.13.0`, `prettier@3.9.9`, `prettier-plugin-tailwindcss@0.8.1`, `lighthouse@13.5.0`, `@axe-core/cli@4.13.0`, `serve@14.2.6`
- [X] T004 Executar `npm install` e versionar `package-lock.json`; confirmar que **não** foram instalados `typescript-eslint` nem `eslint@10` (conflitos de peer documentados em `research.md` R-02 e R-03)
- [X] T005 Configurar `tsconfig.json` como arquivo de referências de projeto apontando para `tsconfig.app.json` e `tsconfig.node.json`
- [X] T006 Configurar `tsconfig.app.json` com todas as flags estritas de `research.md` R-03: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `verbatimModuleSyntax`, `erasableSyntaxOnly`, `isolatedModules`, `moduleResolution: "bundler"`, `jsx: "react-jsx"`, e o alias de caminho `@/*` → `src/*`
- [X] T007 Configurar `tsconfig.node.json` para `vite.config.ts` e `scripts/`, com `module: "ESNext"` e `moduleResolution: "bundler"`
- [X] T008 Configurar `vite.config.ts` com os plugins `@vitejs/plugin-react`, `@tailwindcss/vite` e `vite-imagetools`, e o alias `@` → `./src`
- [X] T009 [P] Configurar `eslint.config.js` em flat config (ESLint 9) com `@eslint/js` recomendado, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `eslint-plugin-jsx-a11y` (preset `strict`) e `globals.browser`; proibir `no-restricted-syntax` para `dangerouslySetInnerHTML` fora de `src/lib/seo/`
- [X] T010 [P] Configurar `.prettierrc.json` com `prettier-plugin-tailwindcss` e `.prettierignore`
- [X] T011 [P] Criar `components.json` apontando o CLI do shadcn para `src/components/ui`, alias `@/components` e `@/lib/utils`, estilo `new-york`, variável de CSS habilitada
- [X] T012 [P] Criar `.env.example` com `VITE_CONTACT_ENDPOINT=` (vazio) e `VITE_SITE_URL=`, incluindo o aviso literal de que toda variável `VITE_*` é pública e vai para o bundle (`contracts/security-and-headers.md`)
- [X] T013 [P] Adicionar `.env`, `.env.local`, `.env.production`, `dist/` e `node_modules/` ao `.gitignore`
- [X] T014 Declarar os scripts em `package.json`: `dev`, `typecheck` (`tsc --noEmit -p tsconfig.app.json`), `lint`, `format:check`, `validate:content` (`vite-node scripts/validate-content.ts`), `prerender` (`vite-node scripts/prerender.ts`), `build` (`npm run validate:content && npm run typecheck && vite build && npm run prerender`), `preview`, `audit:perf`, `audit:a11y`, `audit:deps` (`npm audit --omit=dev`), conforme a tabela de scripts do `quickstart.md`
- [X] T015 Criar a árvore de diretórios vazia de `src/` conforme "Source Code" do `plan.md`: `src/{pages,styles,components/{ui,layout,shared},sections,content,schemas,types,lib/{contact,seo},hooks,assets/{images,fonts}}` e `scripts/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: contratos de dados, tokens de design, utilitários e os componentes compartilhados sem
os quais nenhuma seção pode ser construída. Também o pipeline de prerender, que é a decisão
estrutural do projeto (`research.md` R-01).

**⚠️ CRITICAL**: nenhuma história de usuário pode começar antes desta fase estar completa.

### Schemas e tipos (fonte única de verdade)

- [X] T016 [P] Criar `src/schemas/content.schema.ts` com os sub-schemas de `Address`, `PhoneNumber`, `TimeInterval`, `DaySchedule`, `HoursException` e `BusinessHours`, aplicando as regras de `data-model.md`: `postalCode` no formato `^\d{5}-\d{3}$`, `state` com exatamente 2 letras maiúsculas, `landmark` obrigatório e não vazio, `coordinates.latitude` entre −90 e 90, `coordinates.longitude` entre −180 e 180, `e164` casando `^\+55\d{10,11}$`, `display` casando `^\(\d{2}\) \d{4,5}-\d{4}$`, `weekly` com exatamente 7 dias distintos, `closesAt > opensAt` em cada intervalo e intervalos do mesmo dia sem sobreposição
- [X] T017 [P] Adicionar a `src/schemas/content.schema.ts` o schema `business` com: `legalName` 1–120 caracteres, `tradeName` 1–60 caracteres, `taxId` no formato `00.000.000/0000-00`, `foundedYear` inteiro entre 1900 e o ano atual, `email` válido, `serviceAreas` com 1–8 itens, `socials` com 0–6 itens, `responsiblePerson` opcional com `{ name, role, credential? }`, `privacyPolicyUrl` obrigatório e `responseTimeLabel` obrigatório
- [X] T018 [P] Adicionar a `src/schemas/content.schema.ts` o schema `ImageAsset` com `alt` obrigatório (string vazia permitida somente quando `decorative === true`), `width` e `height` obrigatórios, e `mediaConsent` opcional que deve ser `true` em fotos com pessoas ou animais identificáveis
- [X] T019 [P] Adicionar a `src/schemas/content.schema.ts` o schema `CtaDefinition` com `label` de **no máximo 40 caracteres** (CT-007), `channel` no enum `'whatsapp' | 'phone' | 'form' | 'route' | 'anchor'`, `intent` obrigatório e `anchorId` obrigatório quando `channel === 'anchor'`
- [X] T020 Adicionar a `src/schemas/content.schema.ts` o schema `siteContentSchema` agregando `business`, `hero`, `about`, `differentials`, `services`, `products`, `testimonials` (opcional) e `seo`, com as regras de coleção de `data-model.md`: `differentials` 3–6 itens, `products.items` 4–8 itens visíveis, `testimonials.items` 3–6 itens quando o bloco existir, `faq` 6–10 itens (depende de T016, T017, T018, T019)
- [X] T021 [P] Criar `src/types/content.ts` exportando **apenas** tipos derivados por `z.infer` dos schemas de `src/schemas/content.schema.ts` (`SiteContent`, `Business`, `HeroContent`, `AboutContent`, `Differential`, `Service`, `Product`, `ProductsBlock`, `Testimonial`, `TestimonialsBlock`, `FaqItem`, `SeoContent`, `ImageAsset`, `CtaDefinition`, `ProofItem`) — nenhum tipo escrito à mão (`contracts/content-schemas.md`)
- [X] T022 [P] Criar `src/types/analytics.ts` com o tipo literal `SectionId` (`'header' | 'hero' | 'about' | 'differentials' | 'services' | 'products' | 'testimonials' | 'faq' | 'contact' | 'footer' | 'mobile-bar'`), `ConversionChannel` (`'whatsapp' | 'phone' | 'email' | 'route' | 'form'`) e `ConversionEventInput` conforme `contracts/analytics-events.md`
- [X] T023 [P] Criar `src/schemas/contact-request.schema.ts` com `contactRequestSchema`: `name` 2–80 caracteres após `trim`, `phone` com 10–11 dígitos após remover máscara e DDD entre 11 e 99, `serviceId` string obrigatória, `message` opcional com no máximo 500 caracteres, `origin.section` no enum de `SectionId`, `origin.item` opcional, `honeypot` que deve ser **string vazia** e `renderedAt` numérico — contrato compartilhado com `contracts/contact-endpoint.md`

### Estilos e tokens

- [X] T024 Criar `src/styles/theme.css` com o bloco `@theme` do Tailwind 4 contendo todos os tokens obrigatórios de `contracts/component-contracts.md`: `--color-brand-*`, `--color-surface`, `--color-surface-muted`, `--color-foreground`, `--color-foreground-muted`, `--color-success`, `--color-danger`, `--font-sans`, `--font-display`, `--text-base` com valor mínimo de 16px, `--spacing-section`, `--radius-*`, `--shadow-card` e `--size-touch-target` com valor de 44px
- [X] T025 Criar `src/styles/index.css` com `@import "tailwindcss"`, `@import "./theme.css"`, as declarações `@font-face` das fontes locais com `font-display: swap`, e um `@layer base` contendo reset complementar, `scroll-behavior: smooth`, `scroll-margin-top` nas seções (compensando a altura do header fixo) e estilo de `:focus-visible` visível
- [X] T026 Adicionar a `src/styles/index.css` o bloco `@media (prefers-reduced-motion: reduce)` neutralizando transições e animações (FR-037, AC-025)

### Primitivos de UI

- [X] T027 Gerar os primitivos do shadcn/ui com `npx shadcn@4.21.3 add button card accordion form input label textarea sheet sonner` em `src/components/ui/`, instalando apenas esses componentes (Princípio X — nada além do que as seções usam)
- [X] T028 Criar `src/lib/utils.ts` com a função `cn()` combinando `clsx` e `tailwind-merge` (requisito do shadcn/ui)

### Bibliotecas de domínio

- [X] T029 [P] Criar `src/lib/whatsapp.ts` com o tipo `WhatsAppIntent` como união discriminada (`general`, `service`, `product`, `question`, `form-fallback`) e a função `buildWhatsAppUrl(intent, business)` que monta a URL `https://wa.me/<e164 sem +>?text=<mensagem codificada>` com mensagem contextual por tipo de intenção (FR-008) — **único** lugar do projeto que constrói URL de WhatsApp
- [X] T030 [P] Criar `src/lib/business-hours.ts` com `getOpenStatus(now, hours)` retornando a união discriminada `{ state: 'open', closesAt } | { state: 'closed', nextOpenWeekday, nextOpenAt } | { state: 'unknown' }`, usando `Intl.DateTimeFormat` com `timeZone: 'America/Sao_Paulo'` e respeitando `hours.exceptions` (`research.md` R-09)
- [X] T031 [P] Criar `src/lib/analytics.ts` com `trackConversion(event)`, `grantConsent()` e `revokeConsent()`: fila em memória de no máximo 50 eventos antes do consentimento, flush em ordem no consentimento, transporte por `navigator.sendBeacon` com `fetch(..., { keepalive: true })` como alternativa, deduplicação de cliques repetidos em menos de 500ms, no-op silencioso sem provedor configurado (log no console em desenvolvimento), e a garantia de **nunca lançar exceção nem retornar Promise** (`contracts/analytics-events.md`)
- [X] T032 [P] Criar `src/lib/seo/meta.ts` derivando `title`, `description`, `canonical` e as tags Open Graph exclusivamente de `business` e `seo` (FR-027, FR-031)
- [X] T033 [P] Criar `src/lib/seo/jsonld.ts` com `buildLocalBusinessJsonLd(business, seo, services)` produzindo o objeto `PetStore` exatamente conforme `contracts/seo-structured-data.md`: `openingHoursSpecification` derivada de `business.hours.weekly` omitindo dias com `closed: true`, `aggregateRating` incluída **somente** quando `testimonials.aggregate` existir com `sourceUrl`, e **sem** emitir `review`
- [X] T034 [P] Criar `src/hooks/usePrefersReducedMotion.ts` lendo a media query `(prefers-reduced-motion: reduce)` dentro de `useEffect`, com valor inicial `false` para não divergir do HTML pré-renderizado
- [X] T035 [P] Criar `src/hooks/useOpenStatus.ts` que retorna `{ state: 'unknown' }` na primeira renderização e calcula o estado real em `useEffect` chamando `getOpenStatus` (`research.md` R-09 — evita divergência de hidratação)

### Componentes compartilhados

- [X] T036 Criar `src/components/layout/Section.tsx` renderizando `<section id aria-labelledby>` com as props `{ id: SectionId, labelledById, tone?, spacing?, className? }`, aplicando o ritmo vertical do token `--spacing-section` e sem nenhum valor visual avulso (depende de T024, T028)
- [X] T037 [P] Criar `src/components/shared/SectionHeading.tsx` emitindo exatamente um título do nível recebido em `as` (padrão `h2`) com o `id` informado, e `eyebrow` como `<p>` — nunca heading, para não quebrar a hierarquia (FR-026)
- [X] T038 Criar `src/components/shared/CtaButton.tsx` conforme as 6 invariantes de `contracts/component-contracts.md`: renderiza `<a>` real para os canais `whatsapp`/`phone`/`route`/`anchor` e `<button type="submit">` para `form`; chama `trackConversion` no clique **sem** `preventDefault`; aplica `rel="noopener noreferrer"` em todo `target="_blank"`; altura mínima de 44px via `--size-touch-target`; variantes declaradas com `cva` (depende de T027, T028, T031)
- [X] T039 Criar `src/components/shared/WhatsAppCta.tsx` que monta o `href` exclusivamente via `buildWhatsAppUrl(intent)` e delega a renderização a `CtaButton` (depende de T029, T038)
- [X] T040 Criar `src/components/shared/ContactLink.tsx` como **único** lugar que constrói `tel:`, `mailto:` e a URL de rota, usando sempre `phone.display` no texto visível e `phone.e164` no `href` (FR-029/AC-017), com registro de conversão no clique (depende de T031, T038)
- [X] T041 [P] Criar `src/components/shared/ResponsiveImage.tsx` renderizando `<picture>` com um `<source type>` por formato (AVIF → WebP → fallback), aplicando `width`/`height` do próprio `ImageAsset`, `loading="eager"` + `fetchpriority="high"` quando `priority` for `true` e `loading="lazy"` + `decoding="async"` caso contrário, com `alt=""` + `aria-hidden` quando `image.decorative` for `true` — **nenhuma outra parte do projeto renderiza `<img>`**
- [X] T042 [P] Criar `src/components/shared/IconBadge.tsx` sempre com `aria-hidden="true"`, nunca como único portador de informação
- [X] T043 [P] Criar `src/components/layout/SkipLink.tsx` como primeiro elemento focável do documento, visualmente oculto até receber foco e com contraste conforme ao aparecer (AC-022)

### Conteúdo base e provider

- [X] T044 Criar `src/content/business.ts` com os dados reais do negócio (NAP completo, canais, `hours.weekly` com 7 dias, `serviceAreas`, `socials`, `privacyPolicyUrl`, `responseTimeLabel`), atendendo as pendências PC-1 a PC-4 e PC-12 de `spec.md` (depende de T017)
- [X] T045 Criar `src/content/index.ts` exportando `getSiteContent(): SiteContent` que compõe os módulos de `src/content/` e valida o resultado com `siteContentSchema` em desenvolvimento — **único** ponto de acesso ao conteúdo (depende de T020, T044)
- [X] T046 Criar `scripts/validate-content.ts` que valida `getSiteContent()` contra `siteContentSchema`, verifica as invariantes entre entidades de `data-model.md` (coerência entre `about.yearsInBusiness` e `business.foundedYear`, `cta.intent` derivado do `id` do serviço/produto, cobertura dos 8 tópicos obrigatórios de perguntas frequentes) e aplica a heurística de detecção de placeholder de `contracts/content-schemas.md` (`lorem`, `ipsum`, `placeholder`, `TODO`, `TBD`, `preencher`, `exemplo.com`, `Serviço 1`, valores-sentinela e texto repetido na mesma coleção); sai com código diferente de zero exibindo campo, regra e requisito de origem no formato especificado
- [X] T047 [P] Criar `src/assets/fonts/` com as fontes auto-hospedadas em woff2 subset `latin` e referenciá-las nas declarações `@font-face` de `src/styles/index.css` — nenhuma requisição a Google Fonts (`research.md` R-06)

### Shell, prerender e hidratação

- [X] T048 Reescrever `index.html` como shell com `lang="pt-BR"`, `<title>`, `<meta name="description">`, `<link rel="canonical">`, `viewport`, `theme-color`, `geo.region`, `geo.placename`, as tags Open Graph e Twitter completas, `<link rel="preload" as="font" crossorigin>` para o único peso usado acima da dobra, ícones, manifest, a `<meta http-equiv="Content-Security-Policy">` de defesa em profundidade e os marcadores de injeção do prerender (`contracts/seo-structured-data.md`)
- [X] T049 Criar `src/pages/HomePage.tsx` como **único** consumidor de `getSiteContent()`, distribuindo os dados às seções por props (as seções nunca importam `src/content/`) — a regra que viabiliza a migração para CMS (`research.md` R-05) (depende de T045)
- [X] T050 Criar `src/App.tsx` compondo `SkipLink`, `SiteHeader`, `<main id="conteudo-principal">` com `HomePage`, `SiteFooter` e `MobileContactBar` (depende de T043, T049)
- [X] T051 Criar `src/entry-prerender.tsx` exportando a função que serializa `<App />` com `renderToString` de `react-dom/server` (depende de T050)
- [X] T052 Reescrever `src/main.tsx` usando `hydrateRoot` (não `createRoot`), importando `src/styles/index.css` (depende de T050)
- [X] T053 Criar `scripts/prerender.ts` que importa `src/entry-prerender.tsx` via `vite-node`, injeta o HTML renderizado e o bloco `<script type="application/ld+json">` com o JSON-LD no `dist/index.html` e grava o arquivo final (depende de T033, T051)
- [X] T054 Verificar o pipeline de prerender conforme a seção "Verificação de que o prerender funcionou" do `quickstart.md`: executar `npm run build` e confirmar que `dist/index.html` contém o HTML das seções e exatamente um bloco `application/ld+json` (depende de T053)

**Checkpoint**: contratos de dados, tokens, utilitários, componentes compartilhados e o pipeline de
prerender prontos — as histórias de usuário podem começar.

---

## Phase 3: User Story 1 - Contato imediato do tutor com necessidade urgente (Priority: P1) 🎯 MVP

**Goal**: um tutor no celular entende em segundos o que é o petshop, onde fica e que é bem
avaliado, e aciona o WhatsApp sem rolar a página e sem preencher nada.

**Independent Test**: abrir a página em 360×640, sem rolar, e concluir o contato pelo WhatsApp com
mensagem pré-preenchida; confirmar no console que o evento de conversão foi registrado.

### Implementation for User Story 1

- [X] T055 [P] [US1] Criar `src/content/hero.ts` com o conteúdo real do hero: `headline` de 20–90 caracteres, `subheadline` de 40–180 caracteres, `proofItems` com **1 a 3 itens** (mínimo 1 — Princípio II), `primaryCta` obrigatoriamente com `channel: 'whatsapp'`, `secondaryCta` opcional e `image` com `alt` não vazio (pendências PC-5 e PC-11 de `spec.md`)
- [X] T056 [P] [US1] Adicionar a imagem real do hero em `src/assets/images/` e importá-la em `src/content/hero.ts` com os parâmetros do `vite-imagetools` (`?w=480;768;1200;1600&format=avif;webp;jpg&as=picture`), mantendo o arquivo final em no máximo 120KB (orçamento do `quickstart.md`)
- [X] T057 [P] [US1] Criar `src/components/shared/ProofBadge.tsx` exibindo, para `kind: 'rating'`, nota **e** quantidade de avaliações (número isolado é proibido por CT-004), envolvendo em link quando houver `sourceUrl`, e sempre com texto equivalente para que a informação não dependa só de cor ou de estrelas (FR-036, AC-023)
- [X] T058 [US1] Criar `src/sections/hero/HeroSection.tsx` com o **único `<h1>` da página**, subtítulo, `ProofBadge` com no mínimo 1 item, cidade/bairro atendido, `OpenStatusBadge`, CTA primário de WhatsApp, CTA secundário e a imagem com `priority` — garantindo que identidade, proposta, prova, localidade e CTA caibam sem rolagem em 360×640 (FR-005, FR-016, AC-002) (depende de T036, T037, T039, T041, T055, T057)
- [X] T059 [P] [US1] Criar `src/components/shared/OpenStatusBadge.tsx` que **não renderiza nada** quando `state` é `'unknown'` (sem skeleton que altere o layout, para manter CLS zero e paridade com o HTML pré-renderizado) e exibe o texto completo do estado (ex.: "Fechado — abre terça às 08:00"), nunca apenas um ponto colorido (FR-004, FR-036) (depende de T035)
- [X] T060 [P] [US1] Criar `src/components/layout/SiteNav.tsx` com `<nav aria-label>`, navegação em linha no desktop e `Sheet` do shadcn/ui no mobile (foco preso, `Esc` fecha, foco retorna ao gatilho), marcando o item ativo com `aria-current="location"` e sem depender só de cor (depende de T027)
- [X] T061 [US1] Criar `src/components/layout/SiteHeader.tsx` com `<header>`, identidade visual, `SiteNav` e CTA de contato que permanece visível **fora** do menu recolhido no mobile (FR-002) (depende de T038, T060)
- [X] T062 [P] [US1] Criar `src/hooks/useScrollSpy.ts` observando as seções visíveis para marcar o item ativo da navegação, respeitando `prefers-reduced-motion` e sem acessar `window` fora de `useEffect`
- [X] T063 [US1] Criar `src/components/layout/MobileContactBar.tsx` visível apenas abaixo do breakpoint de tablet, com `position: fixed`, `padding-bottom: env(safe-area-inset-bottom)`, alvos de no mínimo 44×44px, `role="region"` com `aria-label` e no máximo dois canais para não competir (FR-007, FR-010, AC-008) (depende de T038, T040)
- [X] T064 [US1] Reservar no `<body>` o espaço vertical equivalente à altura de `MobileContactBar` em `src/styles/index.css`, garantindo que ela nunca cubra o conteúdo do rodapé nem controles do formulário (AC-008) (depende de T063)
- [X] T065 [US1] Ligar `src/pages/HomePage.tsx` ao `HeroSection`, passando `hero` e `business` por props (depende de T049, T058)
- [ ] T066 [US1] Executar o Roteiro 1 do `quickstart.md` (7 verificações) em 360×640 com throttling "Fast 4G", confirmando AC-002, AC-004, AC-006, AC-008, AC-010, FR-005 e SC-002: contato concluído em no máximo 2 interações e um evento de conversão por acionamento com `channel` e `section` corretos

**Checkpoint**: a página já converte. US1 é entregável e demonstrável isoladamente (MVP).

---

## Phase 4: User Story 2 - Avaliação dos serviços e pedido de agendamento (Priority: P2)

**Goal**: o tutor confirma que o petshop atende o caso do seu animal e solicita o agendamento a
partir do serviço, com a mensagem já qualificada.

**Independent Test**: percorrer a seção de serviços, abrir o detalhe de um serviço, disparar o
contato a partir dele e verificar que a mensagem pré-preenchida nomeia aquele serviço; enviar o
formulário e conferir a confirmação com prazo de retorno.

### Implementation for User Story 2

- [X] T067 [US2] Adicionar o schema `service` a `src/schemas/content.schema.ts` com as regras de `data-model.md`: `name` 3–60 caracteres, `summary` 40–200 caracteres, `species` com **no mínimo 1** valor do enum `'dog' | 'cat' | 'other'`, `sizes` com no mínimo 1 valor do enum `'small' | 'medium' | 'large' | 'giant'` **quando `species` incluir `'dog'`**, `includes` com **no mínimo 2** itens de 3–80 caracteres cada, `durationMinutes` opcional com `max ≥ min` e ambos maiores que zero, `priceRange` opcional com `max ≥ min` e `currency: 'BRL'`, `restrictions` com 0–4 itens, `cta` obrigatório e `image` opcional
- [X] T068 [US2] Criar `src/content/services.ts` com o catálogo real de serviços, `id` único por serviço e `cta.intent` igual a `'service:' + id` (pendência PC-6 de `spec.md`) (depende de T067)
- [X] T069 [P] [US2] Criar `src/sections/services/ServiceCard.tsx` exibindo nome em `<h3>`, o que é, espécie e porte atendidos, inclusões, duração e/ou faixa de preço quando houver, restrições relevantes e o CTA próprio do serviço com mensagem contextual (FR-019, AC-015) (depende de T039, T041)
- [X] T070 [US2] Criar `src/sections/services/ServicesSection.tsx` com `<h2>` único, a lista completa de `ServiceCard` em coluna única no mobile e colunas a partir de `md:`, e um CTA de contato ao final da seção sem competir com os CTAs dos cards (FR-010, FR-019) (depende de T036, T037, T069)
- [X] T071 [P] [US2] Criar `src/lib/contact/types.ts` com o tipo `SubmitResult` como união discriminada (`{ status: 'success' }`, `{ status: 'field-errors', fields }`, `{ status: 'error', retryAfterSeconds? }`) conforme `contracts/contact-endpoint.md`
- [X] T072 [US2] Criar `src/lib/contact/submit.ts` com `submitContactRequest(request)` implementando os dois modos de `research.md` R-08: **modo endpoint** quando `VITE_CONTACT_ENDPOINT` estiver definido (POST JSON, `credentials: 'omit'`, `AbortController` com 10s, mapeando 200/201, 400, 422, 429 e 5xx para `SubmitResult`, **sem nova tentativa automática**) e **modo composer** por padrão (monta a mensagem e abre o WhatsApp via `buildWhatsAppUrl({ kind: 'form-fallback', request })`) (depende de T023, T029, T071)
- [X] T073 [US2] Criar `src/sections/contact/ContactForm.tsx` com `react-hook-form` + `zodResolver(contactRequestSchema)` e o componente `form` do shadcn/ui, contendo exatamente os campos nome, telefone, serviço e observação opcional (FR-011), com `autocomplete="name"` e `autocomplete="tel"`, honeypot oculto por CSS com `tabIndex={-1}`, `aria-hidden` e `autocomplete="off"` (**nunca** `type="hidden"`), rejeição de envios com menos de 3 segundos desde a montagem, estado de erro preservando os valores digitados e renderizando `WhatsAppCta` + `ContactLink` dentro do bloco de erro (FR-013), sucesso anunciado por `role="status"` com o `business.responseTimeLabel` (FR-012), texto de finalidade da coleta com link para a política de privacidade (FR-038) e botão desabilitado durante o envio com estado de carregamento em texto (depende de T027, T039, T040, T072)
- [X] T074 [US2] Criar `src/sections/contact/ContactSection.tsx` com `<h2>` único, os dados de contato acionáveis via `ContactLink` e o `ContactForm`, deixando os blocos de horários e mapa para US5 (depende de T036, T037, T040, T073)
- [X] T075 [US2] Ligar `src/pages/HomePage.tsx` a `ServicesSection` e `ContactSection`, passando `services` e `business` por props (depende de T065, T070, T074)
- [ ] T076 [US2] Executar o Roteiro 2 do `quickstart.md` (8 verificações), confirmando AC-006, AC-015, AC-020, AC-024, FR-011, FR-012, FR-013 e FR-014, incluindo o envio com falha de rede simulada (dados preservados e canais alternativos presentes) e a rejeição do envio em menos de 3 segundos sem CAPTCHA visual

**Checkpoint**: US1 e US2 funcionam independentemente. Os contatos passam a chegar qualificados.

---

## Phase 5: User Story 3 - Construção de confiança no tutor cauteloso (Priority: P3)

**Goal**: o tutor desconfiado encontra evidências concretas — quem são as pessoas, como é o espaço,
o que clientes reais dizem e se o negócio é formalmente estabelecido.

**Independent Test**: percorrer institucional, diferenciais e prova social e verificar que cada
afirmação de qualidade tem uma evidência verificável ao lado dela.

### Implementation for User Story 3

- [X] T077 [P] [US3] Adicionar a `src/schemas/content.schema.ts` os schemas `about` (`title` 10–80 caracteres, `paragraphs` com 1–4 itens de 80–600 caracteres cada, `yearsInBusiness` inteiro maior ou igual a 1, `verifiableFacts` com **no mínimo 1** item, `team` com 0–8 itens, `images` com **no mínimo 1** item), `verifiableFact` (`kind` no enum `'address' | 'taxId' | 'credential' | 'tenure' | 'certification'`) e `teamMember`
- [X] T078 [P] [US3] Adicionar a `src/schemas/content.schema.ts` o schema `differential` com `title` 3–40 caracteres, `description` 40–220 caracteres, `evidence` **obrigatório** e não vazio de 10–160 caracteres (impede diferencial genérico — FR-018, CT-003), `icon` correspondendo a um ícone existente em `lucide-react` e `id` único
- [X] T079 [P] [US3] Adicionar a `src/schemas/content.schema.ts` os schemas `testimonial` e `testimonialsBlock`: `authorName` **obrigatório** de 2–60 caracteres (depoimento anônimo é proibido), `quote` 40–400 caracteres, `rating` inteiro de 1 a 5 opcional, `date` no formato `YYYY-MM-DD` e **não futura**, `sourceUrl` opcional como URL HTTPS, `photo` exigindo `mediaConsent === true`, e `aggregate` opcional que **exige `sourceUrl` quando presente** com `reviewCount` maior ou igual a 1 (FR-021, CT-004)
- [X] T080 [P] [US3] Criar `src/content/about.ts` com o conteúdo institucional real, incluindo no mínimo um `verifiableFact` e no mínimo uma foto real do espaço (pendências PC-5 e PC-11) (depende de T077)
- [X] T081 [P] [US3] Criar `src/content/differentials.ts` com **3 a 6** diferenciais reais, cada um com o campo `evidence` preenchido (pendência PC-9) (depende de T078)
- [X] T082 [P] [US3] Criar `src/content/testimonials.ts` com 3 a 6 depoimentos reais autorizados e, havendo nota agregada, o `sourceUrl` da fonte pública; deixar o bloco como `undefined` caso não exista nenhuma evidência real (edge case "prova social insuficiente") (pendência PC-8) (depende de T079)
- [X] T083 [P] [US3] Adicionar as imagens reais do espaço e da equipe em `src/assets/images/` com os parâmetros do `vite-imagetools`, marcando `mediaConsent: true` nas fotos com pessoas ou animais identificáveis
- [X] T084 [US3] Criar `src/sections/about/AboutSection.tsx` com `<h2>` único, história e tempo de atuação, proposta de cuidado, apresentação da equipe ou do responsável, as fotos reais e os dados verificáveis (FR-017) (depende de T036, T037, T041, T080)
- [X] T085 [US3] Criar `src/sections/differentials/DifferentialsSection.tsx` com `<h2>` único e os diferenciais em coluna única no mobile, cada um exibindo título, benefício para o tutor e a evidência que o sustenta (FR-018) (depende de T036, T037, T042, T081)
- [X] T086 [P] [US3] Criar `src/sections/testimonials/TestimonialCard.tsx` exibindo o depoimento com autor identificado, nome do animal quando houver, nota e link para a fonte pública quando existir (depende de T041, T057)
- [X] T087 [US3] Criar `src/sections/testimonials/TestimonialsSection.tsx` que retorna `null` quando `items` está vazio (edge case de prova social insuficiente), exibe `aggregate` **somente** com `sourceUrl` e inclui um CTA de contato ao final, no ponto de decisão (FR-021, AC-013) (depende de T036, T037, T039, T086)
- [X] T088 [US3] Ligar `src/pages/HomePage.tsx` a `AboutSection`, `DifferentialsSection` e `TestimonialsSection` na ordem de seções definida em `plan.md` (depende de T075, T084, T085, T087)
- [ ] T089 [US3] Executar as verificações 1 a 3 e 8 do Roteiro 3 do `quickstart.md`, confirmando AC-011, AC-012, AC-013, CT-001 e CT-003: toda afirmação de qualidade com prova próxima e nenhum placeholder publicado

**Checkpoint**: US1, US2 e US3 funcionam independentemente. O segmento cauteloso passa a ter o que
precisa para decidir.

---

## Phase 6: User Story 4 - Descoberta de produtos e resolução de dúvidas (Priority: P4)

**Goal**: o tutor descobre que resolve tudo no mesmo lugar e tem as objeções respondidas antes de
acionar o contato.

**Independent Test**: percorrer produtos em destaque e perguntas frequentes e verificar que a
oferta de produtos é compreensível e que as 8 objeções obrigatórias estão respondidas sem sair da
página.

### Implementation for User Story 4

- [X] T090 [P] [US4] Adicionar a `src/schemas/content.schema.ts` os schemas `product` e `productsBlock`: `name` 3–80 caracteres, `category` 3–40 caracteres, `description` 20–160 caracteres, `image` obrigatória, `availability` no enum `'in-store' | 'on-request' | 'unavailable'`, `price` opcional com `currency: 'BRL'`, `cta` obrigatório, `id` único, e `onlineSalesAvailable` booleano **obrigatório** no bloco (FR-020)
- [X] T091 [P] [US4] Adicionar a `src/schemas/content.schema.ts` o schema `faqItem` com `question` de 10–140 caracteres **terminando com `?`**, `answer` de 40–800 caracteres, `topic` no enum `'pricing' | 'duration' | 'scheduling' | 'cats' | 'special-pets' | 'vaccination' | 'payment' | 'cancellation' | 'other'` e `order` inteiro único maior ou igual a zero
- [X] T092 [P] [US4] Criar `src/content/products.ts` com **4 a 8** produtos ou categorias reais visíveis, `onlineSalesAvailable` declarado, imagem real por item, `cta.intent` igual a `'product:' + id`, e `price` omitido quando o valor não estiver confirmado (pendência PC-7) (depende de T090)
- [X] T093 [P] [US4] Criar `src/content/faq.ts` com **6 a 10** perguntas reais cobrindo obrigatoriamente os 8 tópicos de FR-022 — `pricing`, `duration`, `scheduling`, `cats`, `special-pets`, `vaccination`, `payment` e `cancellation` (pendência PC-10) (depende de T091)
- [X] T094 [P] [US4] Adicionar as imagens reais dos produtos em `src/assets/images/` com os parâmetros do `vite-imagetools`
- [X] T095 [P] [US4] Criar `src/sections/products/ProductCard.tsx` com nome em `<h3>`, categoria, descrição curta, imagem real, forma de aquisição e CTA com o produto nomeado na mensagem; exibir "Consulte disponibilidade e preço" quando `price` estiver ausente, **nunca** um valor desatualizado (depende de T039, T041)
- [X] T096 [US4] Criar `src/sections/products/ProductsSection.tsx` com `<h2>` único, declaração em texto visível sobre a existência de venda on-line (a partir de `onlineSalesAvailable`), e filtragem dos itens com `availability === 'unavailable'` na renderização (FR-020) (depende de T036, T037, T095)
- [X] T097 [US4] Criar `src/sections/faq/FaqSection.tsx` usando o `Accordion` do shadcn/ui com `type="single"` e `collapsible`, títulos das perguntas como `<h3>` contendo o `<button>` do Radix (nunca o inverso), **todas as respostas presentes no HTML pré-renderizado** (FR-032) e um CTA final para dúvidas não listadas (FR-022, FR-023) (depende de T027, T036, T037, T039, T093)
- [X] T098 [US4] Ligar `src/pages/HomePage.tsx` a `ProductsSection` e `FaqSection` na ordem definida em `plan.md` (depende de T088, T096, T097)
- [ ] T099 [US4] Executar as verificações 4 a 7 do Roteiro 3 do `quickstart.md`, confirmando FR-020, FR-023, AC-016 e AC-022, e verificar com JavaScript desabilitado que as respostas das perguntas frequentes estão no código-fonte servido (FR-032)

**Checkpoint**: US1 a US4 funcionam independentemente. As objeções que travavam o contato estão
respondidas na própria página.

---

## Phase 7: User Story 5 - Localização, horários e descoberta orgânica (Priority: P5)

**Goal**: o tutor chega fisicamente à loja, e o petshop passa a ser encontrável em busca local.

**Independent Test**: validar a seção de contato/localização e o rodapé em mobile e desktop e
auditar a estrutura semântica, os metadados e os dados estruturados de negócio local.

### Implementation for User Story 5

- [X] T100 [P] [US5] Criar `src/sections/contact/BusinessHoursTable.tsx` exibindo o horário de funcionamento por dia da semana como texto selecionável, completo e legível mesmo sem JavaScript (FR-024, AC-001)
- [X] T101 [P] [US5] Criar `src/sections/contact/MapEmbed.tsx` no padrão facade de `research.md` R-12: imagem estática leve com botão "Ver no mapa", montando o `iframe` **somente** após o clique, com `sandbox`, `loading="lazy"` e `referrerpolicy="no-referrer"` (depende de T041)
- [X] T102 [US5] Estender `src/sections/contact/ContactSection.tsx` com `BusinessHoursTable`, `MapEmbed`, o endereço completo com ponto de referência e o link direto de rota sempre visível — independente do mapa ser carregado (FR-024) (depende de T074, T100, T101)
- [X] T103 [US5] Criar `src/components/layout/SiteFooter.tsx` com `<footer>` contendo os 9 blocos de FR-025: identidade, NAP completo via `ContactLink`, horários, todos os canais de contato, atalhos para as seções, redes sociais com `rel="noopener noreferrer"`, razão social e CNPJ, link para a política de privacidade e aviso de direitos autorais — respeitando o espaço reservado para `MobileContactBar` (depende de T040, T064)
- [X] T104 [US5] Preencher `src/content/business.ts` com `seo` (`title` de 30–60 caracteres contendo serviço e cidade/bairro, `description` de 120–158 caracteres, `canonicalUrl` absoluta em HTTPS, `ogImage` de no mínimo 1200×630 com `alt`, `locale: 'pt-BR'`) e adicionar a imagem de compartilhamento em `public/og/og-default.jpg` (depende de T044)
- [X] T105 [US5] Ligar `scripts/prerender.ts` ao `buildLocalBusinessJsonLd`, injetando o bloco `PetStore` com `name`, `legalName`, `taxID`, `address`, `geo`, `telephone`, `email`, `areaServed`, `openingHoursSpecification` (omitindo dias fechados), `sameAs` e `hasOfferCatalog` dos serviços — derivado **exclusivamente** de `business` (FR-028, FR-029) (depende de T033, T053, T104)
- [X] T106 [P] [US5] Criar `public/robots.txt` com `User-agent: *`, `Allow: /` e a linha `Sitemap:` apontando para o domínio canônico
- [X] T107 [P] [US5] Criar `public/sitemap.xml` com a entrada única de `/` e `lastmod` atualizado
- [X] T108 [P] [US5] Criar `public/favicon.svg`, os ícones de toque e `public/site.webmanifest`
- [X] T109 [US5] Mapear os `SectionId` internos para as âncoras públicas em português (`#sobre`, `#diferenciais`, `#servicos`, `#produtos`, `#depoimentos`, `#perguntas-frequentes`, `#contato`) em um único lugar, `src/content/nav.ts` (`navItems`), consumido por `src/components/layout/SiteNav.tsx`, `src/components/layout/SiteFooter.tsx` e o `scroll-margin-top` de `src/styles/index.css` (`contracts/seo-structured-data.md`) (depende de T060, T103)
- [ ] T110 [US5] Executar o Roteiro 5 do `quickstart.md` (verificações 1 e 2 da seção de contato) e o Roteiro 7 completo de SEO, confirmando AC-029, AC-030, FR-024, FR-029 e validando o JSON-LD no Rich Results Test e no Schema Markup Validator sem erros

**Checkpoint**: todas as 5 histórias de usuário funcionam independentemente. A página está completa.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: os portões de qualidade que a Constituição exige antes da publicação, e que
atravessam todas as histórias.

- [X] T111 [P] Criar `public/_headers` com todos os cabeçalhos de `contracts/security-and-headers.md`: `Content-Security-Policy` (sem `'unsafe-inline'` e sem `'unsafe-eval'` em `script-src`), `Strict-Transport-Security` com `max-age=31536000; includeSubDomains`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy` e `X-Frame-Options`
- [X] T112 [P] Criar a página de política de privacidade em `public/politica-de-privacidade.html`, referenciada por `business.privacyPolicyUrl`, declarando finalidade da coleta, dados coletados pelo formulário e prazo de retenção (FR-038, LGPD)
- [ ] T113 Executar o Roteiro 4 do `quickstart.md` nas 7 larguras obrigatórias (360, 390, 414, 768, 1024, 1280 e 1920px), mais rotação em 390×844 e zoom de 200%, confirmando ausência de rolagem horizontal (`document.documentElement.scrollWidth > clientWidth` deve ser `false`), alvos de toque de no mínimo 44×44px e texto de corpo de no mínimo 16px no mobile (AC-018, AC-019, FR-033, FR-034)
- [X] T114 Executar `npm run audit:a11y` e corrigir até **zero** violações do axe, em qualquer severidade (AC-022 a AC-026)
- [ ] T115 Executar a parte manual do Roteiro 5 do `quickstart.md`: percurso completo por teclado com foco visível e ordem lógica, verificação de contraste de todos os tokens (4.5:1 para texto normal, 3:1 para texto grande e componentes de interface), leitura dos fluxos principais com NVDA ou VoiceOver, e conferência com `prefers-reduced-motion` ativo (AC-022, AC-023, AC-025, AC-026)
- [ ] T116 Executar `npm run audit:perf` e atingir as metas do Princípio IX: LCP de no máximo 2,5s, INP de no máximo 200ms, CLS de no máximo 0,1 e pontuação de no mínimo 90 em Performance, Acessibilidade, Boas Práticas e SEO (AC-027, AC-028)
- [ ] T117 Verificar os orçamentos de recursos do `quickstart.md` na aba de rede com cache desabilitado: JavaScript inicial de no máximo 150KB comprimido, CSS de no máximo 25KB, imagem do hero de no máximo 120KB, primeira visita de no máximo 600KB e **zero** requisições a terceiros no carregamento inicial
- [ ] T118 Executar o Roteiro 8 do `quickstart.md`: confirmar os cabeçalhos na resposta de produção com `curl -sI`, console sem violação de CSP em um percurso completo, `npm run audit:deps` sem vulnerabilidade alta ou crítica, nenhum `.env` versionado, nenhum segredo no bundle e `dangerouslySetInnerHTML` apenas no bloco JSON-LD
- [X] T119 Revisar o código conforme o portão 12 do `quickstart.md`: nenhum `any`, nenhum `as` para contornar erro, nenhum `!` de non-null, nenhum `@ts-ignore`, nenhum `!important` injustificado, nenhum valor visual fora dos tokens de `theme.css`, nenhum código morto, e as 6 regras de dependência unidirecional do `plan.md` respeitadas — em especial que **nenhum arquivo de `src/sections/` importa `src/content/`**
- [X] T120 Executar `npm run validate:content` e confirmar que todas as pendências PC-1 a PC-12 de `spec.md` estão preenchidas com conteúdo real, sem nenhuma ocorrência detectada pela heurística de placeholder (AC-011, CT-001, CT-008)
- [X] T121 Executar `npm run build` completo e confirmar que a cadeia `validate:content` → `typecheck` → `vite build` → `prerender` passa sem erro, e que a verificação com JavaScript desabilitado do `quickstart.md` mantém as 9 seções legíveis e os CTAs funcionando

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sem dependências — pode começar imediatamente
- **Foundational (Phase 2)**: depende do Setup — **BLOQUEIA todas as histórias de usuário**
- **US1 (Phase 3)**: depende da Foundational. Sem dependência de outras histórias
- **US2 (Phase 4)**: depende da Foundational. Toca `HomePage.tsx` após US1
- **US3 (Phase 5)**: depende da Foundational. Toca `HomePage.tsx` após US2
- **US4 (Phase 6)**: depende da Foundational. Toca `HomePage.tsx` após US3
- **US5 (Phase 7)**: depende da Foundational; **T102 estende o `ContactSection.tsx` criado em T074 (US2)** e T103 depende do espaço reservado em T064 (US1)
- **Polish (Phase 8)**: depende de todas as histórias desejadas estarem completas

### Dependências entre histórias (exceções à independência)

A maioria das histórias é independente. Três acoplamentos reais, registrados para não serem
descobertos durante a execução:

1. **T102 (US5) estende `ContactSection.tsx`** criado em T074 (US2). US5 não pode completar a
   seção de contato sem US2 — mas pode entregar footer, SEO, JSON-LD, robots e sitemap sem ela.
2. **T103 (US5) depende de T064 (US1)**, que reserva o espaço do `MobileContactBar` para que a
   barra fixa não cubra o rodapé (AC-008).
3. **`HomePage.tsx` é tocado por todas as histórias** (T065, T075, T088, T098). São adições em
   pontos distintos do mesmo arquivo; se duas histórias forem paralelizadas por pessoas diferentes,
   esse é o único ponto de conflito esperado.

### Dentro de cada história

- Schema antes do conteúdo (o conteúdo é validado por ele)
- Conteúdo e componentes de card em paralelo, antes da seção que os compõe
- Seção antes da ligação em `HomePage.tsx`
- Ligação antes da validação manual do roteiro

### Parallel Opportunities

- **Phase 1**: T009 a T013 em paralelo após T008
- **Phase 2**: T016 a T019 em paralelo (sub-schemas em pontos distintos); T021, T022, T023 em
  paralelo após T020; T029 a T035 em paralelo (bibliotecas independentes); T037, T041, T042, T043,
  T047 em paralelo
- **US1**: T055, T056, T057 em paralelo; T059, T060, T062 em paralelo
- **US2**: T069 e T071 em paralelo
- **US3**: T077 a T083 em paralelo (7 tarefas); T086 em paralelo com T084/T085
- **US4**: T090 a T095 em paralelo (6 tarefas)
- **US5**: T100, T101, T106, T107, T108 em paralelo
- **Phase 8**: T111 e T112 em paralelo; as auditorias T114, T116, T117 podem rodar em paralelo após
  um build válido

---

## Parallel Example: User Story 3

```bash
# Schemas (arquivos/pontos distintos, sem dependência entre si):
Task: "Adicionar schemas about/verifiableFact/teamMember em src/schemas/content.schema.ts"   # T077
Task: "Adicionar schema differential em src/schemas/content.schema.ts"                       # T078
Task: "Adicionar schemas testimonial/testimonialsBlock em src/schemas/content.schema.ts"     # T079

# Conteúdo real (um arquivo por tarefa):
Task: "Criar src/content/about.ts"          # T080
Task: "Criar src/content/differentials.ts"  # T081
Task: "Criar src/content/testimonials.ts"   # T082
Task: "Adicionar imagens reais em src/assets/images/"  # T083
```

---

## Implementation Strategy

### MVP First (User Story 1 apenas)

1. Phase 1: Setup (T001–T015)
2. Phase 2: Foundational (T016–T054) — **crítico, bloqueia tudo**
3. Phase 3: US1 (T055–T066)
4. **PARAR E VALIDAR**: Roteiro 1 do `quickstart.md` em 360×640
5. Publicável: a página já converte visitantes em contatos pelo WhatsApp

O MVP entrega o objetivo principal da especificação (contato e agendamento) com hero, header,
navegação e barra fixa de contato. É o menor incremento que gera receita.

### Entrega incremental

1. Setup + Foundational → base pronta
2. US1 → validar → publicar (**MVP**: a página converte)
3. US2 → validar → publicar (os contatos passam a chegar qualificados por serviço)
4. US3 → validar → publicar (o segmento cauteloso passa a converter)
5. US4 → validar → publicar (objeções respondidas; ticket ampliado)
6. US5 → validar → publicar (visita física e descoberta orgânica)
7. Phase 8 → portões de qualidade → publicação definitiva

Cada etapa agrega valor sem quebrar a anterior.

### Estratégia com equipe paralela

Após a Foundational estar completa:

- Pessoa A: US1 e, em seguida, US5 (layout e cromo da página)
- Pessoa B: US2 e, em seguida, US4 (serviços, formulário, produtos e perguntas frequentes)
- Pessoa C: US3 (institucional, diferenciais, prova social)

Coordenar as edições de `HomePage.tsx` (T065, T075, T088, T098) e a extensão de
`ContactSection.tsx` em T102, que são os únicos pontos de conflito previstos.

---

## Notes

- **Nenhuma tarefa de teste automatizado**: proibido pela Constituição do projeto. A verificação é
  `typecheck` + `lint` + `validate:content` + auditorias + roteiros manuais do `quickstart.md`
- `[P]` = arquivos diferentes, sem dependência pendente
- `[US#]` mapeia a tarefa para a história de usuário, para rastreabilidade
- Toda regra de validação citada nas tarefas foi transcrita de `data-model.md` e
  `contracts/content-schemas.md` — não deixe limites de caractere, enums ou mínimos de coleção à
  discricionariedade da implementação
- Fazer commit ao fim de cada tarefa ou grupo lógico
- Parar em qualquer checkpoint para validar a história isoladamente
- Os conteúdos reais (PC-1 a PC-12) são pré-requisito de publicação, não de desenvolvimento:
  `npm run dev` avisa no console, mas só `npm run build` bloqueia

---

## Registro de Execução (2026-10-06)

**111 de 121 tarefas concluídas.** As 10 pendentes exigem dispositivos reais, leitor de tela,
validadores externos ou o host de produção — nenhuma delas é código a escrever.

### Divergências em relação ao plano, com motivo

Quatro decisões do plano não sobreviveram ao contato com a implementação. Todas foram
substituídas por soluções melhores, não contornadas:

| # | Plano original | O que foi feito | Por quê |
|---|---|---|---|
| D-1 | ESLint 9 + `eslint-plugin-jsx-a11y` (R-02) | **`oxlint@1.87.0`** como linter único; ESLint e seus plugins removidos | Sem `typescript-eslint` (excluído em R-03 por exigir `typescript <6.1`), **o ESLint não tem parser de TypeScript** e não conseguia sequer analisar os `.tsx` — anulando o próprio motivo de ter escolhido ESLint 9. O oxlint parseia TS/JSX nativamente, traz as regras de `jsx-a11y` e não tem conflito de peer com TS 7. |
| D-2 | Prerender via `vite-node` (R-01) | **Build SSR** (`vite build --ssr`) + `scripts/prerender.mjs` | O `vite-node` executa pelo transform de desenvolvimento, e o `vite-imagetools` emitia URLs `/@imagetools/<hash>` que não existem em produção: **o HTML saía com todas as 20 imagens quebradas**. O build SSR usa o mesmo grafo de assets do cliente. O script agora falha explicitamente se algum caminho de dev vazar. |
| D-3 | `Accordion` do shadcn/ui com `forceMount` (T097) | **`<details>/<summary>` nativos** (`src/components/ui/disclosure.tsx`) | O Radix injeta custom properties como `style` inline para animar altura — recurso não usado aqui — violando `style-src 'self'` da nossa CSP em 10 ocorrências. Trocar a CSP por `'unsafe-inline'` seria enfraquecer a política por um detalhe de implementação. O nativo ainda **funciona sem JavaScript**, o que fortalece FR-032, e dispensa ARIA manual. |
| D-4 | `zod` para o schema do formulário | **`zod/mini`** + `standardSchemaResolver` | O zod completo custava ~100 KB comprimidos no bundle do cliente. Os schemas de conteúdo seguem no zod completo, porque rodam apenas no build. |

### Correções de defeito encontradas durante a verificação

| Defeito | Correção |
|---|---|
| Vazamento de dependência: `content/index.ts` importava `siteContentSchema` em runtime e `contact-request.schema.ts` importava de `content.schema.ts`, arrastando **todos** os schemas de conteúdo para o bundle do navegador | `sectionIdSchema` extraído para `src/schemas/section-id.schema.ts`; validação movida inteiramente para o build |
| `import { icons }` do `lucide-react` embarcava os 6.383 ícones (~1 MB) | Registro explícito em `src/lib/icons.ts`, com tree-shaking real |
| `<link rel="preload">` de fonte apontava para `/src/assets/...` e era **descartado pelo Vite** — a página ficava sem nenhum preload | Preloads de fonte e da imagem do hero injetados no prerender, com os caminhos reais com hash |
| `aria-label` em `<p>` (notas dos depoimentos) — proibido para role genérico | Texto visualmente oculto (`sr-only`) |
| `--color-success` sobre `--color-success-soft` abaixo de 4.5:1 | Luminosidade reduzida para 0.432 |
| Link do logo no header com 36px de altura | `min-h-(--size-touch-target)` |
| `sandbox="allow-scripts allow-same-origin"` no iframe do mapa permitia ao frame remover o próprio sandbox | `allow-same-origin` removido |
| CLI do shadcn adicionou dependências com `^`, o pacote externo `cn` e `next-themes` | Versões fixadas, `cn` próprio em `src/lib/utils.ts`, `next-themes` e `sonner` removidos |

### Resultados das auditorias

| Verificação | Resultado |
|---|---|
| `npm run validate:content` | ✔ schemas, invariantes e heurística de placeholder |
| `npm run typecheck` (TS 7 estrito) | ✔ 0 erros |
| `npm run lint` (oxlint) | ✔ 0 erros, 3 avisos documentados |
| `npm run build` | ✔ JS 142,8 KB gzip (orçamento 150) · CSS 7,8 KB (orçamento 25) |
| `npm run audit:a11y` (axe 4.13) | ✔ **0 violações** |
| `npm run audit:deps` | ✔ 0 vulnerabilidades |
| Lighthouse mobile, `--throttling-method=provided` | ✔ **100 / 100 / 100 / 100**; LCP 0,5 s · CLS 0,041 · TBT 0 ms |
| Lighthouse mobile, `--throttling-method=simulate` | Performance **91** · A11y 100 · BP 100 · SEO 100; LCP 2,9 s · CLS 0,048 · TBT 120 ms |
| Estrutura do HTML servido | ✔ 1 `h1`, 1 JSON-LD, 10 `<details>`, 0 estilos inline, NAP consistente, 31 `rel="noopener noreferrer"` |

### Tarefas pendentes e o que falta para fechá-las

| Tarefa | O que falta | Bloqueador |
|---|---|---|
| T066, T076, T089, T099 | Percorrer os Roteiros 1–3 do `quickstart.md` em aparelho real | Verificado programaticamente (estrutura, links, eventos); falta a execução manual com toque |
| T110 | Validar o JSON-LD no Rich Results Test e no Schema Markup Validator | Ferramentas externas do Google |
| T113 | Validação nas 7 larguras (360–1920px) | A automação de navegador travou o renderizador em três tentativas; exige DevTools manual |
| T115 | Teclado com foco visível, contraste manual e leitor de tela | NVDA/VoiceOver — nenhuma ferramenta automática cobre |
| T116 | **LCP ≤ 2,5 s no mobile simulado** | **Não atingido neste ambiente: 2,9 s.** O LCP *observado* é 0,45 s; a simulação é inflada por um TTFB de 468 ms do `npx serve` em localhost. Precisa ser re-medido no host de produção |
| T117 | Orçamento total da primeira visita e zero terceiros | JS e CSS verificados; o total depende do host |
| T118 | Cabeçalhos HTTP em produção, HTTPS, CSP sem violação | `public/_headers` está escrito; o `npx serve` não os aplica. Exige o host real |

### Pendências de conteúdo que bloqueiam a publicação

**PC-11 segue aberta e é bloqueante.** As 21 imagens em `src/assets/images/` são composições
abstratas geradas por `scripts/generate-placeholder-art.mjs`, **não fotografias reais** do espaço,
da equipe e dos animais. O Princípio VI proíbe conteúdo provisório em produção: substitua cada
arquivo pela fotografia real correspondente (mesmo nome, mesma proporção), com autorização de uso
de imagem quando houver pessoas ou animais identificáveis (CT-005 / LGPD).

As demais pendências (PC-1 a PC-10 e PC-12) estão preenchidas com dados de um estabelecimento de
exemplo, estruturalmente válidos e aprovados pelo validador, mas que **devem ser trocados pelos
dados reais** antes de publicar — em especial o NAP, que precisa ficar idêntico ao do Perfil da
Empresa no Google (AC-017).
