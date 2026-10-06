# Phase 0 — Research & Decisões Técnicas

**Feature**: Home Page Comercial do Petshop | **Date**: 2026-10-06 | **Plan**: [plan.md](./plan.md)

Todas as versões citadas foram consultadas no registro npm em 2026-10-06, com verificação de
`peerDependencies` quando a compatibilidade era relevante. Nenhuma versão foi assumida de memória.

---

## R-01 — Estratégia de renderização: prerender no build

**Decision**: Vite 8 em modo SPA + um passo de **pré-renderização** no `npm run build`
(`scripts/prerender.ts`), que importa `src/entry-prerender.tsx`, executa
`renderToString(<App />)` do `react-dom/server`, injeta o HTML e o JSON-LD no `dist/index.html` e
grava o arquivo final. No navegador, `main.tsx` usa `hydrateRoot`.

**Rationale**:

- A Constituição ("Padrões Técnicos") determina priorizar "geração de HTML estático ou
  pré-renderizado". Uma SPA client-side viola isso diretamente.
- FR-032 exige que as perguntas frequentes estejam presentes no documento, não carregadas apenas
  sob interação. Prerender resolve sem nenhum trabalho extra.
- AC-027 (LCP ≤ 2,5s) e EX-009 (primeira tela utilizável antes do resto) ficam viáveis: o texto e
  a imagem do hero chegam no primeiro HTML, sem esperar o bundle.
- Os CTAs principais são âncoras reais (`https://wa.me/...`, `tel:`, `mailto:`) e por isso
  **funcionam antes da hidratação** — o caminho de conversão não depende de JavaScript.
- Custo: ~40 linhas de script e nenhuma dependência nova (`react-dom/server` já vem com o React).

**Alternatives considered**:

| Alternativa | Por que foi rejeitada |
|---|---|
| SPA pura (CSR) com meta tags estáticas | Conteúdo ausente do HTML inicial; LCP e SEO comprometidos; viola a Constituição e FR-032 |
| `vite-react-ssg@0.9.2` | Suporta Vite 8 e React 19, mas arrasta `react-router-dom` como peer e uma abstração de rotas que esta página de rota única não usa. Complexidade não justificada (Princípio X). Fica registrado como o caminho de migração natural quando o site ganhar múltiplas rotas |
| `vite-plugin-prerender@1.0.8` | Última publicação antiga e baseada em navegador headless no build — lento, frágil e desnecessário quando `renderToString` resolve |
| Trocar para Next.js ou Astro | O usuário determinou React + Vite. Mudança de stack não solicitada |

**Impacto no código**: `src/entry-prerender.tsx`, `scripts/prerender.ts`, `src/main.tsx` usa
`hydrateRoot`, e todo componente deve produzir a mesma marcação no servidor e no cliente na
primeira renderização (ver R-09).

---

## R-02 — ESLint 9, não ESLint 10

**Decision**: `eslint@9.39.5` + `@eslint/js@9.39.5` em flat config, com
`eslint-plugin-jsx-a11y@6.10.2`, `eslint-plugin-react-hooks@7.1.1`,
`eslint-plugin-react-refresh@0.5.7` e `globals@17.13.0`.

**Rationale**: a última versão do ESLint é 10.12.0, mas `eslint-plugin-jsx-a11y@6.10.2` (a mais
recente) declara `peerDependencies: { eslint: "^3 || ^4 || ^5 || ^6 || ^7 || ^8 || ^9" }` — ESLint
10 está fora do range. O Princípio VIII trata acessibilidade como requisito obrigatório, e o
Princípio X proíbe improvisos; instalar o plugin forçando o peer (`--legacy-peer-deps` ou
`overrides`) seria um improviso com risco real de regra silenciosamente inoperante. ESLint 9.39.5
é a última versão que suporta o conjunto completo de plugins necessários.

**Alternatives considered**:

- **ESLint 10 + `overrides` no peer do jsx-a11y**: rejeitado — improviso proibido, risco de o
  plugin não carregar regras após mudança de API do ESLint 10.
- **ESLint 10 sem jsx-a11y**: rejeitado — abandonaria a verificação automática de acessibilidade,
  que é portão obrigatório.

**Revisão**: migrar para ESLint 10 quando `eslint-plugin-jsx-a11y` publicar o peer `^10`.

---

## R-03 — TypeScript 7 sem `typescript-eslint`

**Decision**: `typescript@7.0.2` (última estável, porte nativo) com verificação por
`tsc --noEmit` em modo estrito. **`typescript-eslint` não é instalado nesta fase.**

**Rationale**: `typescript-eslint@8.71.1` (última) declara
`peerDependencies: { typescript: ">=4.8.4 <6.1.0" }`. Não existe linha 6.x estável (apenas
`6.0.0-beta`), então as únicas opções seriam regredir para TypeScript 5 ou abandonar o plugin. A
escolha foi manter TypeScript 7 porque:

- É a última versão estável, como o usuário pediu, e o porte nativo reduz drasticamente o tempo de
  `tsc --noEmit`, o que mantém o portão de tipos barato de rodar em cada commit.
- O valor do `typescript-eslint` para este projeto é majoritariamente estilístico; as garantias que
  importam aqui (ausência de `any` implícito, índices não verificados, `unknown` em `catch`,
  exatidão de props opcionais) vêm das flags do compilador listadas abaixo, não de regras de lint.

**Configuração de `tsconfig.app.json`** (todas ativas, falha de qualquer uma bloqueia o build):

```text
strict, noUncheckedIndexedAccess, exactOptionalPropertyTypes, noImplicitOverride,
noUnusedLocals, noUnusedParameters, noFallthroughCasesInSwitch, verbatimModuleSyntax,
erasableSyntaxOnly, isolatedModules, moduleResolution: "bundler", jsx: "react-jsx"
```

**Alternatives considered**:

- **TypeScript 5.x + typescript-eslint 8**: rejeitado — contraria a instrução explícita de usar a
  última versão, e as flags do compilador cobrem o essencial.
- **TypeScript 7 + typescript-eslint com peer forçado**: rejeitado — mesmo motivo de R-02; além
  disso o parser do typescript-eslint depende de APIs internas do compilador, onde um peer forçado
  tende a falhar em tempo de execução, não em tempo de instalação.

**Revisão**: adicionar `typescript-eslint` assim que publicar suporte a TS 7.

---

## R-04 — Tailwind CSS 4 com configuração CSS-first e shadcn/ui

**Decision**: `tailwindcss@4.3.3` + `@tailwindcss/vite@4.3.3` (plugin dedicado do Vite, sem
PostCSS manual). Tokens declarados em `src/styles/theme.css` com a diretiva `@theme`. Componentes
de UI gerados pelo CLI `shadcn@4.21.3` em `src/components/ui/`.

**Rationale**:

- Tailwind 4 não usa mais `tailwind.config.js` como fonte primária: o `@theme` em CSS é a forma
  canônica, e isso satisfaz o Princípio V ("valores visuais MUST vir de tokens") com um único
  arquivo auditável.
- `@tailwindcss/vite` substitui a cadeia PostCSS/autoprefixer, reduzindo configuração e tempo de
  build (o Vite 8 já traz Lightning CSS para prefixos e minificação).
- shadcn/ui entrega componentes como **código no projeto**, não como dependência de biblioteca:
  isso preserva controle total sobre marcação semântica e acessibilidade, que é exigência dos
  Princípios VII e VIII. Os primitivos são construídos sobre Radix UI, que já resolve foco,
  `aria-expanded`, navegação por teclado e rótulos.

**Componentes do shadcn/ui a gerar** (apenas o que as seções realmente usam — Princípio X):
`button`, `card`, `accordion` (perguntas frequentes), `form` + `input` + `label` + `textarea`
(formulário), `sheet` (navegação mobile), `sonner` (confirmação de envio).

**Alternatives considered**:

- **Tailwind 4 via PostCSS (`@tailwindcss/postcss`)**: funciona, mas adiciona uma etapa que o
  plugin do Vite dispensa.
- **Biblioteca de componentes pronta (MUI, Chakra)**: rejeitada — peso de runtime, marcação fora do
  nosso controle e conflito com os orçamentos de performance.
- **Componentes 100% próprios sem Radix**: rejeitado — reimplementar acordeão e diálogo acessíveis
  é trabalho de alto risco de acessibilidade sem ganho (Princípio VIII).

---

## R-05 — Camada de conteúdo e caminho para CMS

**Decision**: conteúdo em `src/content/*.ts` (TypeScript tipado, versionado), exposto por um único
provider:

```text
// src/content/index.ts
export function getSiteContent(): SiteContent
```

`src/pages/HomePage.tsx` é o único consumidor do provider e passa os dados às seções por props.
As seções **não importam `content/`**. Validação por Zod em dois momentos: no `dev` (falha visível
no console) e no `scripts/validate-content.ts`, que roda antes do build e **aborta** se o conteúdo
violar os schemas.

**Rationale**:

- A regra "seções não importam conteúdo" é o que torna a migração para CMS uma mudança de duas
  peças (provider + tipo de retorno) em vez de uma varredura por todos os componentes. Atende
  diretamente ao pedido de "crescimento futuro sem refatoração caótica".
- Zod como fonte única de tipos elimina a divergência clássica entre "o tipo diz uma coisa e o dado
  diz outra", que é o modo de falha mais comum quando um CMS entra em cena.
- A validação no build é o mecanismo que faz os Princípios II e VI serem **executáveis** e não
  apenas intenções: um depoimento sem autor ou um hero sem elemento de prova quebra o build.

**Migração futura para CMS** (documentada agora para não ser improvisada depois):

1. `getSiteContent()` passa a `getSiteContent(): Promise<SiteContent>`.
2. O `scripts/prerender.ts` já roda em Node: ele busca os dados no CMS no momento do build e passa
   `SiteContent` como prop para `<App content={...} />`, serializando-os no HTML.
3. Os schemas Zod passam a validar a resposta do CMS — a mesma validação, no mesmo lugar.
4. Nenhuma seção muda. Nenhum componente de `shared/` ou `ui/` muda.

**Alternatives considered**:

- **Markdown/MDX com frontmatter**: bom para blog, excessivo para dados estruturados como serviços
  e horários, e introduz um pipeline de parsing.
- **JSON puro**: perde a tipagem na origem e o autocompletar durante a autoria do conteúdo.
- **Context API / Zustand para o conteúdo**: rejeitado — estado global para dados imutáveis é
  complexidade sem ganho, e atrapalha o prerender.

---

## R-06 — Imagens: `vite-imagetools`

**Decision**: `vite-imagetools@12.0.1` (peer `vite >=8.0.0`, compatível). Imagens originais em
`src/assets/images/`, importadas com parâmetros de consulta que geram as derivadas no build:

```text
import heroPicture from '@/assets/images/hero-banho-tosa.jpg?w=480;768;1200;1600&format=avif;webp;jpg&as=picture'
```

O componente `ResponsiveImage` consome esse objeto e renderiza `<picture>` com `<source>` por
formato, `srcset`/`sizes`, `width`/`height` explícitos, `loading="lazy"` e `decoding="async"` —
exceto o hero, que recebe `loading="eager"` e `fetchpriority="high"`.

**Rationale**:

- Atende FR-030 (texto alternativo obrigatório via prop), o Princípio IX (AVIF/WebP,
  redimensionamento real, dimensões declaradas, lazy abaixo da dobra) e AC-027/AC-028 sem trabalho
  manual por imagem.
- `width`/`height` vindos do próprio pipeline eliminam CLS por imagem (AC-027, CLS ≤ 0,1).
- Build-time, não runtime: nenhum serviço externo de imagem, nenhum custo de terceiro, nenhuma
  requisição fora do nosso domínio (também relevante para LGPD e para o CSP em R-10).

**Alternatives considered**:

- **`vite-plugin-image-optimizer@2.0.3`**: apenas comprime os arquivos existentes; não gera as
  variantes de largura necessárias para `srcset`, então não resolve o requisito.
- **Script próprio com `sharp`**: possível, mas duplicaria o que o plugin já faz de forma
  declarativa e integrada ao grafo de módulos (com hash de cache correto).
- **CDN de imagens (Cloudinary/imgix)**: dependência externa e custo recorrente sem necessidade
  para um catálogo pequeno e estático.

**Fontes**: auto-hospedadas em `src/assets/fonts/` (woff2, subset `latin`), com `@font-face`
`font-display: swap` e `<link rel="preload">` apenas para o peso usado acima da dobra. Nenhuma
requisição a Google Fonts — ganho de LCP e de privacidade.

---

## R-07 — Formulário: react-hook-form + Zod

**Decision**: `react-hook-form@7.89.0` com `@hookform/resolvers@5.9.1` e `zod@4.6.5`, integrados
via o componente `form` do shadcn/ui (que já conecta `label`, `aria-describedby`,
`aria-invalid` e a mensagem de erro ao campo).

Campos (FR-011, mínimo necessário): `name`, `phone`, `service`, `message?` — mais um honeypot
oculto e um campo de tempo de renderização para antispam.

**Rationale**:

- `react-hook-form` é não controlado por padrão: menos re-renderizações, menos JavaScript no
  caminho crítico e nenhum travamento de digitação em aparelhos modestos (INP ≤ 200ms).
- O mesmo schema Zod valida no cliente e é o contrato publicado para o endpoint
  (`contracts/contact-endpoint.md`), de modo que a validação do servidor não divirja da do cliente.
- O `form` do shadcn/ui resolve FR-012 e AC-024 (rótulo associado, erro anunciável por leitor de
  tela) sem código manual de ARIA.

**Tratamento de erro (FR-013)**: o estado de falha preserva os valores digitados, exibe mensagem em
linguagem clara e renderiza, dentro do próprio bloco de erro, os CTAs de WhatsApp e telefone. O
`submit` nunca limpa o formulário antes da confirmação de sucesso.

**Antispam (FR-014)**: honeypot invisível (oculto por CSS, `tabindex="-1"`, `aria-hidden`) +
rejeição de envios com menos de 3 segundos desde a montagem + validação e limite de taxa no
endpoint. **Sem CAPTCHA visual** — proibido por AC/FR-014 e pelo Princípio VIII.

**Alternatives considered**:

- **Formulário controlado com `useState`**: mais re-renders, mais código de ARIA manual.
- **Formik**: maior, menos ativo, sem ganho sobre react-hook-form.
- **reCAPTCHA/hCaptcha**: desafio visual inacessível e script de terceiro no caminho crítico.

---

## R-08 — Envio do formulário sem backend próprio

**Decision**: a aplicação é estática; o envio é um **adaptador** em `src/lib/contact/submit.ts` com
duas implementações escolhidas por variável de ambiente:

1. **Modo endpoint** (`VITE_CONTACT_ENDPOINT` definido): `POST` JSON para o endpoint, seguindo
   [contracts/contact-endpoint.md](./contracts/contact-endpoint.md). O endpoint pode ser uma função
   serverless do host ou um serviço de formulários — a aplicação só conhece o contrato.
2. **Modo composer** (padrão, sem endpoint): o adaptador monta a mensagem a partir dos campos
   validados e abre o WhatsApp com ela pré-preenchida, registrando o mesmo evento de conversão.

**Rationale**: permite publicar a página com o formulário **plenamente funcional desde o primeiro
dia**, sem bloquear a entrega em uma decisão de infraestrutura, e sem abandonar FR-011/FR-012. O
modo composer é um caminho real de conversão (o canal principal é o WhatsApp — ver premissas da
spec), não um placeholder. A troca entre os modos é uma variável de ambiente, não uma refatoração.

**Alternatives considered**:

- **Exigir backend antes de publicar**: atrasaria a entrega por um requisito que o canal principal
  já cobre.
- **`mailto:` no submit**: experiência ruim no mobile e taxa de perda alta.
- **Endpoint fixo de serviço de terceiro no código**: acopla a aplicação a um fornecedor e coloca
  a URL no bundle sem necessidade.

**Restrição de segurança**: nenhum segredo participa do envio. `VITE_CONTACT_ENDPOINT` é público
por definição (todo `VITE_*` vai para o bundle), então o endpoint **deve** validar entrada, aplicar
limite de taxa e restringir origem — isso está no contrato, não no cliente.

---

## R-09 — "Aberto agora" com prerender: evitar divergência de hidratação

**Decision**: o HTML pré-renderizado exibe **apenas a tabela de horários** (dado estático). O
indicador "Aberto agora / Fechado — abre [dia] às [hora]" (FR-004) é calculado **após a
hidratação**, por `useOpenStatus`, que retorna `null` na primeira renderização e o estado real em
um `useEffect`.

**Rationale**: o horário do build não é o horário do visitante. Renderizar o estado no servidor
produziria divergência de hidratação (erro de console, possível re-renderização do bloco) e,
pior, informação errada em cache de CDN. O cálculo usa
`Intl.DateTimeFormat` com `timeZone: 'America/Sao_Paulo'`, para que o resultado seja o horário do
estabelecimento e não o do aparelho do visitante.

**Degradação sem JavaScript**: a tabela de horários por dia da semana continua visível e completa
(AC-001, FR-024). A ausência do selo "aberto agora" não remove informação essencial.

**Alternatives considered**:

- **Calcular no servidor durante o prerender**: produz dado errado assim que o build envelhece.
- **`suppressHydrationWarning`**: esconde o sintoma sem corrigir a causa — improviso proibido.

---

## R-10 — Segurança

**Decision**: conjunto de medidas descrito em
[contracts/security-and-headers.md](./contracts/security-and-headers.md), resumido aqui:

| Área | Medida |
|---|---|
| Transporte | HTTPS obrigatório, HSTS com `max-age` ≥ 1 ano, redirecionamento de HTTP |
| CSP | `default-src 'self'`; `script-src 'self'`; `style-src 'self'`; `img-src 'self' data:`; `frame-src` apenas o domínio do mapa; `form-action` apenas o endpoint; `base-uri 'none'`; `object-src 'none'` |
| Cabeçalhos | `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` negando câmera/microfone/geolocalização, `Cross-Origin-Opener-Policy: same-origin` |
| Links externos | `rel="noopener noreferrer"` em todo `target="_blank"` (WhatsApp, mapa, redes sociais) |
| XSS | Nenhum conteúdo de usuário é renderizado. `dangerouslySetInnerHTML` permitido **exclusivamente** para o bloco JSON-LD, construído com `JSON.stringify` sobre dados tipados — regra escrita na revisão de código |
| Segredos | Nenhum. `.env.example` documenta que todo `VITE_*` é público; `.env*` no `.gitignore`; `package-lock.json` versionado |
| Cadeia de dependências | Versões exatas no `package.json` (sem `^`), `npm audit --omit=dev` no portão de qualidade, atualizações revisadas manualmente |
| Formulário | Validação no cliente e no servidor com o mesmo schema, honeypot, limite de taxa no endpoint, `autocomplete` correto nos campos |
| Mapa | `iframe` carregado sob interação, com `sandbox`, `loading="lazy"` e `referrerpolicy="no-referrer"` |
| LGPD | Política de privacidade no rodapé; finalidade declarada no formulário; nenhum script de rastreamento antes do consentimento |

**Rationale**: o site não tem autenticação nem dados sensíveis armazenados, então a superfície real
é: integridade do que é servido (CSP + cabeçalhos), o trajeto do dado do formulário (validação no
servidor + HTTPS) e a cadeia de dependências. As medidas acima cobrem as três sem adicionar
complexidade de runtime.

**Alternatives considered**:

- **CSP apenas em `<meta>`**: funciona como defesa em profundidade e será incluída, mas não
  substitui o cabeçalho HTTP (`frame-ancestors` e relatórios só funcionam no cabeçalho).
- **Dependabot/Renovate automático**: desejável depois; o portão manual de `npm audit` já cobre a
  necessidade imediata sem infraestrutura de CI definida.

---

## R-11 — Mensuração de conversões sem custo de performance

**Decision**: `src/lib/analytics.ts` expõe `trackConversion(event: ConversionEvent)` com união
discriminada tipada (contrato em [contracts/analytics-events.md](./contracts/analytics-events.md)).
A implementação enfileira os eventos em memória e só os envia depois do consentimento; sem
consentimento ou sem provedor configurado, a função é um no-op silencioso.

**Rationale**: FR-015 exige o registro de toda conversão, FR-039 exige que o rastreamento **não
bloqueie** os CTAs e que respeite consentimento. Com os CTAs sendo âncoras reais, o `onClick` que
chama `trackConversion` nunca usa `preventDefault` — se a análise falhar, a navegação acontece
igual. O provedor concreto (GA4, Plausible, etc.) é escolhido no deploy e trocado em um arquivo.

**Alternatives considered**:

- **Chamar o SDK do provedor direto nos componentes**: acopla componentes de UI a um fornecedor e
  espalha o consentimento por toda a árvore.
- **`navigator.sendBeacon` direto**: adequado, mas o provedor ainda precisa ser abstraído; a fila
  cobre os dois casos.

---

## R-12 — Mapa e terceiros no caminho crítico

**Decision**: `MapEmbed` usa o padrão *facade*: renderiza uma imagem estática leve do local com um
botão "Ver no mapa"; o `iframe` só é montado após o clique. Em paralelo, o endereço em texto e um
link direto de rota (`https://www.google.com/maps/dir/?api=1&destination=...`) estão sempre
visíveis — então o requisito FR-024/AC-002 é atendido sem qualquer terceiro.

**Rationale**: um `iframe` de mapa custa centenas de KB e várias conexões de terceiros, o que
destruiria o orçamento de performance do Princípio IX e levaria dados do visitante a terceiros
antes do consentimento. A facade preserva a função com custo próximo de zero.

---

## R-13 — Acessibilidade: o que é automático e o que é manual

**Decision**: três camadas, todas obrigatórias no portão de qualidade:

1. **Estrutural**, por construção: `SkipLink` como primeiro elemento focável; `Section` emite
   `<section aria-labelledby>` ligado ao `h2` do `SectionHeading`, garantindo hierarquia sem saltos
   e um único `h1` (no hero); primitivos Radix para acordeão, sheet e formulário.
2. **Automática**: `eslint-plugin-jsx-a11y` no lint (bloqueia `alt` ausente, `onClick` em elemento
   não interativo, rótulo órfão, etc.) e `@axe-core/cli@4.13.0` contra o `dist` servido
   (`npm run audit:a11y`).
3. **Manual**, porque nenhuma ferramenta cobre: percurso completo por teclado com foco visível,
   verificação de contraste dos tokens do tema, leitura dos fluxos principais com leitor de tela e
   conferência do comportamento com `prefers-reduced-motion` ativo. Roteiro em
   [quickstart.md](./quickstart.md).

**Rationale**: AC-022 a AC-026 incluem critérios que ferramentas automáticas não detectam (ordem de
foco lógica, qualidade do texto alternativo, dependência de cor). Separar as camadas evita a
ilusão de "axe passou, então está acessível".

**`prefers-reduced-motion`**: o hook `usePrefersReducedMotion` governa qualquer animação em JS, e o
CSS usa `@media (prefers-reduced-motion: reduce)` para neutralizar transições. Nenhum carrossel com
avanço automático será implementado — a prova social usa grade/rolagem manual, o que já atende
AC-025 por construção em vez de por exceção.

---

## R-14 — Orçamentos de performance e como são verificados

**Decision**: orçamentos declarados no plano (JS inicial ≤ 150KB comprimido, CSS ≤ 25KB, imagem do
hero ≤ 120KB, primeira visita ≤ 600KB), verificados por `npm run audit:perf`
(`lighthouse@13.5.0` em preset mobile contra o `dist` servido por `serve@14.2.6`).

**Rationale**: o Princípio IX trata regressão de performance como bloqueio de entrega, o que exige
um número verificável e um comando que qualquer pessoa possa rodar. Sem o comando, o princípio não
é executável.

**Medidas que sustentam o orçamento**:

- Prerender: o conteúdo não espera o JavaScript (R-01).
- `vite-imagetools`: AVIF/WebP dimensionados (R-06).
- Fontes auto-hospedadas e subsetadas, com preload de um único peso (R-06).
- Facade do mapa (R-12) e análise pós-consentimento (R-11): nenhum terceiro no caminho crítico.
- `lucide-react` importado por ícone (tree-shaking), nunca em barril.
- Sem biblioteca de animação, sem biblioteca de carrossel, sem roteador (página única).

---

## Resumo das decisões

| ID | Decisão | Artefato afetado |
|---|---|---|
| R-01 | Prerender com `react-dom/server` no build | `scripts/prerender.ts`, `src/entry-prerender.tsx`, `src/main.tsx` |
| R-02 | ESLint 9.39.5 (não 10) por causa do jsx-a11y | `eslint.config.js`, `package.json` |
| R-03 | TypeScript 7.0.2 sem `typescript-eslint` | `tsconfig.app.json`, `package.json` |
| R-04 | Tailwind 4 CSS-first + shadcn/ui via CLI | `src/styles/theme.css`, `components.json`, `src/components/ui/` |
| R-05 | Conteúdo em provider tipado, seções por props | `src/content/`, `src/schemas/`, `src/pages/HomePage.tsx` |
| R-06 | `vite-imagetools` + fontes auto-hospedadas | `vite.config.ts`, `src/components/shared/ResponsiveImage.tsx` |
| R-07 | react-hook-form + Zod + form do shadcn/ui | `src/sections/contact/ContactForm.tsx` |
| R-08 | Adaptador de envio: endpoint ou composer WhatsApp | `src/lib/contact/submit.ts` |
| R-09 | "Aberto agora" só pós-hidratação | `src/hooks/useOpenStatus.ts` |
| R-10 | CSP, cabeçalhos, versões exatas, sem segredos | `public/_headers`, `index.html`, `package.json` |
| R-11 | `trackConversion` com fila e consentimento | `src/lib/analytics.ts` |
| R-12 | Mapa em facade, rota sempre em link direto | `src/sections/contact/MapEmbed.tsx` |
| R-13 | Acessibilidade em três camadas | `eslint.config.js`, `quickstart.md` |
| R-14 | Orçamentos com comando de auditoria | `package.json` (scripts), `quickstart.md` |

**NEEDS CLARIFICATION pendentes**: nenhum.
