# Quickstart — Execução e Validação

**Feature**: Home Page Comercial do Petshop | **Plan**: [plan.md](./plan.md) | **Date**: 2026-10-06

Guia para subir o projeto e **validar** que a entrega atende aos critérios de aceitação. A
Constituição do projeto proíbe testes automatizados, então os roteiros manuais e as auditorias
abaixo **são** o mecanismo de qualidade — não um complemento opcional.

---

## Pré-requisitos

| Requisito | Versão | Verificação |
|---|---|---|
| Node.js | ≥ 22.12 (LTS 22.22 recomendado) | `node -v` — exigido pelo peer do Vite 8 (`^20.19.0 \|\| >=22.12.0`) |
| npm | ≥ 10 | `npm -v` |
| Navegador | Chrome/Edge atual | Necessário para Lighthouse e axe |
| Leitor de tela | NVDA (Windows) ou VoiceOver (macOS) | Portão 5 da Constituição |

---

## Instalação e execução

```bash
npm ci                 # usa o lockfile estritamente (nunca npm install em CI/produção)
npm run dev            # servidor de desenvolvimento
npm run build          # validate:content → typecheck → vite build → prerender
npm run preview        # serve o dist/ como em produção
```

### Scripts do projeto

| Script | O que faz | Bloqueia a entrega? |
|---|---|---|
| `dev` | Vite em modo desenvolvimento | — |
| `typecheck` | `tsc --noEmit` com as flags estritas de R-03 | **Sim** |
| `lint` | ESLint 9 flat config (inclui `jsx-a11y`) | **Sim** |
| `format:check` | Prettier com `prettier-plugin-tailwindcss` | **Sim** |
| `validate:content` | Valida `src/content/` contra os schemas Zod | **Sim** |
| `build` | Cadeia completa; qualquer etapa falha aborta | **Sim** |
| `preview` | Serve o `dist/` | — |
| `audit:perf` | `lighthouse` em preset mobile contra o `dist` servido | **Sim** |
| `audit:a11y` | `@axe-core/cli` contra o `dist` servido | **Sim** |
| `audit:deps` | `npm audit --omit=dev` | **Sim** (alta/crítica) |

---

## Verificação de que o prerender funcionou

É a validação mais importante do projeto: sem ela, os requisitos de SEO e de LCP não se sustentam
(R-01, FR-032).

```bash
npm run build
grep -c "Perguntas frequentes" dist/index.html     # deve ser ≥ 1
grep -c "application/ld+json" dist/index.html      # deve ser 1
```

**Verificação definitiva** (o inspetor do navegador mostra o DOM hidratado e esconde o problema —
use o código-fonte):

1. `npm run preview` e abra a página.
2. DevTools → Command Palette → **Disable JavaScript**.
3. Recarregue.

**Esperado com JavaScript desabilitado**:

- [ ] Todas as 9 seções visíveis e legíveis
- [ ] Todas as respostas das perguntas frequentes presentes no HTML (podem estar visualmente
      recolhidas, mas devem existir no código-fonte) — FR-032
- [ ] CTAs de WhatsApp, telefone, e-mail e rota **funcionando** (são âncoras reais) — R-01
- [ ] Tabela de horários completa — FR-024
- [ ] Ausente, corretamente: o selo "Aberto agora" e o envio do formulário (dependem de JS — R-09)

---

## Roteiro 1 — Fluxo de conversão (User Story 1, P1)

**Dispositivo**: DevTools em 360×640, modo mobile, throttling "Fast 4G".

| # | Ação | Resultado esperado | Critério |
|---|---|---|---|
| 1 | Carregar a página sem rolar | Identidade, proposta em uma frase, ≥ 1 elemento de prova, cidade/bairro e CTA principal visíveis | AC-002, FR-005 |
| 2 | Cronometrar a leitura da primeira tela | Compreensão do que é e onde fica em ≤ 5s | SC-001 |
| 3 | Tocar no CTA principal | WhatsApp abre com mensagem pré-preenchida contextual | AC-006, FR-008 |
| 4 | Voltar e rolar até o meio da página | Barra fixa de contato visível, sem cobrir texto nem controles | AC-008, FR-007 |
| 5 | Rolar até o rodapé | Barra fixa **não** cobre o conteúdo do rodapé | AC-008 |
| 6 | Contar interações até a conversão | ≤ 2 (carregar + acionar) | AC-004, SC-002 |
| 7 | Console em modo dev | Um evento de conversão por acionamento, com `channel` e `section` corretos | AC-010, FR-015 |

---

## Roteiro 2 — Serviços e formulário (User Story 2, P2)

| # | Ação | Resultado esperado | Critério |
|---|---|---|---|
| 1 | Abrir a seção de serviços pela navegação | Chega em ≤ 2 toques, com o título da seção visível (não escondido pelo header) | AC-020, FR-003 |
| 2 | Ler um card de serviço | Nome, o que é, espécie/porte, inclusões e duração ou faixa de preço | AC-015, FR-019 |
| 3 | Acionar o CTA do serviço | Mensagem do WhatsApp cita o nome daquele serviço | AC-006, FR-008 |
| 4 | Enviar o formulário com dados válidos | Confirmação explícita com o prazo de retorno | FR-012 |
| 5 | Enviar com telefone inválido | Erro específico no campo, com `aria-invalid` e `aria-describedby` | AC-024, FR-012 |
| 6 | Simular falha de rede (DevTools offline) e enviar | Erro claro, **dados preservados**, CTAs de WhatsApp e telefone dentro do bloco de erro | FR-013 |
| 7 | Enviar em menos de 3s após abrir | Rejeitado pelo antispam, sem CAPTCHA visual | FR-014 |
| 8 | Conferir os campos pedidos | Exatamente nome, telefone, serviço e observação opcional | FR-011 |

---

## Roteiro 3 — Confiança, produtos e dúvidas (User Stories 3 e 4)

| # | Ação | Resultado esperado | Critério |
|---|---|---|---|
| 1 | Percorrer institucional e diferenciais | Cada afirmação de qualidade tem prova verificável próxima | AC-012, CT-003 |
| 2 | Conferir cada diferencial | Específico e verificável, não elogio genérico | FR-018 |
| 3 | Conferir a prova social | Depoimentos identificados; nota agregada com link para a fonte | AC-013, FR-021 |
| 4 | Conferir produtos | 4–8 itens com imagem, descrição e forma de aquisição; declaração sobre venda on-line | FR-020 |
| 5 | Acionar o CTA de um produto | Mensagem cita o produto | FR-020 |
| 6 | Conferir as perguntas frequentes | Os 8 tópicos obrigatórios presentes | AC-016, FR-022 |
| 7 | Expandir/recolher por teclado (`Tab` + `Enter`/`Espaço`) | Funciona; `aria-expanded` muda | AC-022, FR-023 |
| 8 | Buscar placeholders em toda a página | Nenhum texto genérico, nenhuma imagem de banco genérica | AC-011, CT-001 |

---

## Roteiro 4 — Responsividade (AC-018, AC-019, FR-033)

Larguras obrigatórias: **360, 390, 414, 768, 1024, 1280, 1920**.

Em **cada** largura:

- [ ] Nenhuma rolagem horizontal (verificar com
      `document.documentElement.scrollWidth > document.documentElement.clientWidth` no console —
      deve ser `false`)
- [ ] Nenhum rótulo de CTA, título ou card estourando o contêiner
- [ ] Imagens sem distorção, com proporção preservada
- [ ] Barra fixa de contato visível apenas no mobile e sem sobrepor controles
- [ ] Alvos de toque ≥ 44×44px (medir no inspetor, não estimar)
- [ ] Texto de corpo ≥ 16px no mobile
- [ ] Hierarquia visual preservada: proposta → prova → CTA

Testes adicionais:

- [ ] Rotação retrato/paisagem em 390×844 sem quebra
- [ ] Zoom do navegador em 200% sem perda de conteúdo nem rolagem horizontal
- [ ] Tablet em retrato (768×1024) com CTAs visíveis

---

## Roteiro 5 — Acessibilidade (AC-022 a AC-026)

### Automático

```bash
npm run build
npm run audit:a11y     # @axe-core/cli contra o dist servido
```

Esperado: **zero** violações. Violação de qualquer severidade bloqueia a entrega.

### Manual (o que nenhuma ferramenta detecta)

**Teclado** — percorrer a página inteira apenas com `Tab`/`Shift+Tab`:

- [ ] O primeiro `Tab` revela o link "Pular para o conteúdo", visível e com contraste conforme
- [ ] Foco visível em **todos** os elementos interativos
- [ ] Ordem de foco segue a ordem visual, sem saltos
- [ ] Menu mobile (`Sheet`): foco preso dentro, `Esc` fecha, foco retorna ao botão que abriu
- [ ] Acordeão operável por `Enter` e `Espaço`
- [ ] Formulário completável e enviável sem mouse
- [ ] Nenhuma armadilha de foco

**Contraste** — com o verificador do DevTools:

- [ ] Texto normal ≥ 4.5:1 sobre cada fundo em que aparece
- [ ] Texto grande e componentes de interface ≥ 3:1
- [ ] Estado de foco e estado de erro também conformes
- [ ] Nenhuma informação transmitida só por cor (checar seção ativa na navegação, selo de horário,
      estado de erro do formulário)

**Leitor de tela** — NVDA ou VoiceOver nos fluxos principais:

- [ ] Títulos anunciados na hierarquia correta (`h1` → `h2` → `h3`), um único `h1`
- [ ] Seções anunciadas com nome (via `aria-labelledby`)
- [ ] Texto alternativo das imagens informativo; decorativas ignoradas
- [ ] Erros do formulário anunciados ao ocorrerem
- [ ] Confirmação de envio anunciada (`role="status"`)
- [ ] Estado expandido/recolhido das perguntas frequentes anunciado

**Movimento reduzido**:

- [ ] Ativar `prefers-reduced-motion` no sistema (ou DevTools → Rendering → Emulate CSS media)
- [ ] Nenhuma animação automática ocorre
- [ ] Nenhum conteúdo fica inacessível por isso

---

## Roteiro 6 — Performance (AC-027, AC-028)

```bash
npm run build
npm run audit:perf     # lighthouse, preset mobile, contra o dist servido
```

Metas obrigatórias (Princípio IX):

| Métrica | Meta |
|---|---|
| LCP | ≤ 2,5s |
| INP | ≤ 200ms |
| CLS | ≤ 0,1 |
| Performance | ≥ 90 |
| Acessibilidade | ≥ 90 |
| Boas Práticas | ≥ 90 |
| SEO | ≥ 90 |

Orçamento de recursos (conferir na aba de rede, com cache desabilitado):

| Recurso | Limite |
|---|---|
| JavaScript inicial | ≤ 150KB comprimido |
| CSS | ≤ 25KB comprimido |
| Imagem do hero | ≤ 120KB |
| Primeira visita (total) | ≤ 600KB |
| Requisições a terceiros no carregamento | **0** |

Verificações pontuais:

- [ ] Imagens servidas em AVIF ou WebP, com largura próxima da exibida
- [ ] `width`/`height` presentes em toda `<img>` (origem do CLS zero)
- [ ] Imagem do hero com `fetchpriority="high"`; as demais com `loading="lazy"`
- [ ] Fontes do próprio domínio, com `font-display: swap`
- [ ] `iframe` do mapa ausente no carregamento inicial (só após clique)

---

## Roteiro 7 — SEO (AC-029, AC-030)

Checklist completo em [contracts/seo-structured-data.md](./contracts/seo-structured-data.md). Itens
mínimos:

- [ ] Um único `h1`; hierarquia sem saltos (árvore de acessibilidade do DevTools)
- [ ] `title` 30–60 caracteres, com serviço e cidade/bairro
- [ ] `meta description` 120–158 caracteres
- [ ] `canonical` absoluta em HTTPS
- [ ] Open Graph completo; prévia conferida em validador de compartilhamento
- [ ] JSON-LD sem erros no Rich Results Test e no Schema Markup Validator
- [ ] NAP idêntico na página, no JSON-LD e no Perfil da Empresa no Google
- [ ] `robots.txt` e `sitemap.xml` acessíveis
- [ ] Conteúdo das perguntas frequentes no HTML servido

---

## Roteiro 8 — Segurança (R-10)

Checklist completo em [contracts/security-and-headers.md](./contracts/security-and-headers.md).
Itens mínimos no ambiente publicado:

```bash
curl -sI https://<dominio> | grep -iE "content-security-policy|strict-transport|x-content-type|referrer-policy|permissions-policy"
npm run audit:deps
```

- [ ] Todos os cabeçalhos obrigatórios presentes
- [ ] HTTP redireciona para HTTPS
- [ ] Console sem violação de CSP em um percurso completo
- [ ] `npm audit --omit=dev` sem vulnerabilidade alta ou crítica
- [ ] Nenhum `.env` versionado; nenhum segredo no bundle
      (`grep -ri "api_key\|secret\|token" dist/assets/*.js` sem resultado relevante)
- [ ] `dangerouslySetInnerHTML` apenas no bloco JSON-LD
- [ ] Nenhuma requisição a terceiros no carregamento inicial

---

## Critérios técnicos de qualidade (portão final)

A entrega só é considerada concluída quando **todos** os itens abaixo passam. Corresponde aos sete
portões do "Fluxo de Desenvolvimento e Portões de Qualidade" da Constituição.

| # | Portão | Comando / método | Bloqueia |
|---|---|---|---|
| 1 | Especificação atendida | Rastreabilidade FR/AC → componente | Sim |
| 2 | Conteúdo real, sem placeholder | `npm run validate:content` + revisão humana | Sim |
| 3 | Tipos | `npm run typecheck` sem erro | Sim |
| 4 | Lint e formatação | `npm run lint` e `npm run format:check` sem erro | Sim |
| 5 | Prerender | HTML completo no `dist/index.html` (seção acima) | Sim |
| 6 | Responsividade | Roteiro 4 em 7 larguras | Sim |
| 7 | Acessibilidade | Roteiro 5 (axe + manual) | Sim |
| 8 | Performance | Roteiro 6 (metas e orçamentos) | Sim |
| 9 | SEO | Roteiro 7 | Sim |
| 10 | Segurança | Roteiro 8 | Sim |
| 11 | Fluxos de conversão | Roteiros 1, 2 e 3 de ponta a ponta | Sim |
| 12 | Revisão de código | Sem `any`, sem `!`, sem `!important` injustificado, sem valor visual fora de token, sem código morto; regras de dependência do plano respeitadas | Sim |

**Nenhum teste automatizado** faz parte destes portões — é proibido pela Constituição do projeto
("Padrões Técnicos e Restrições"). A verificação é a cadeia `typecheck` + `lint` +
`validate:content` + auditorias + roteiros manuais acima.

---

## Pendências que bloqueiam a publicação

`npm run validate:content` falhará enquanto as pendências PC-1 a PC-12 da
[spec](./spec.md#pendências-de-conteúdo-real) não estiverem preenchidas com dados reais. Isso é
intencional: o Princípio VI proíbe conteúdo provisório em produção, e aqui a proibição é mecânica.

Para desenvolver antes de ter o conteúdo real, use `npm run dev` — que avisa no console mas não
aborta. Apenas `npm run build` bloqueia.
