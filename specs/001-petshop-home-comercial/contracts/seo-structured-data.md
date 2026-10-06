# Contrato — SEO, Metadados e Dados Estruturados

**Feature**: Home Page Comercial do Petshop | **Plan**: [../plan.md](../plan.md) | **Requisitos**: FR-026 a FR-032, AC-029, AC-030

Tudo neste contrato deriva de `business` e `seo` ([../data-model.md](../data-model.md)). Essa
derivação única é o que faz FR-029/AC-017 (NAP idêntico em toda a página) ser estrutural em vez de
depender de revisão manual.

---

## Estrutura semântica do documento

Hierarquia obrigatória, verificada em AC-029:

```text
<html lang="pt-BR">
  <body>
    <a class="skip-link">              ← primeiro elemento focável
    <header>
      <nav aria-label="Navegação principal">
    <main id="conteudo-principal">
      <section id="hero"          aria-labelledby="hero-title">        <h1>
      <section id="about"         aria-labelledby="about-title">       <h2>
      <section id="differentials" aria-labelledby="differentials-title"><h2>
      <section id="services"      aria-labelledby="services-title">    <h2> → <h3> por serviço
      <section id="products"      aria-labelledby="products-title">    <h2> → <h3> por produto
      <section id="testimonials"  aria-labelledby="testimonials-title"><h2>
      <section id="faq"           aria-labelledby="faq-title">         <h2> → <h3> por pergunta
      <section id="contact"       aria-labelledby="contact-title">     <h2>
    <footer>
    <div role="region" aria-label="Contato rápido">   ← MobileContactBar
```

**Regras**:

1. Exatamente **um** `<h1>`, no hero (FR-026).
2. Nenhum salto de nível: `h1 → h2 → h3`. Um card de serviço nunca usa `h4` nem `h2`.
3. O `id` de cada `<section>` é o `SectionId` compartilhado com a navegação e com os eventos de
   conversão — âncora, atalho e métrica usam a mesma chave.
4. `scroll-margin-top` nas seções compensa a altura do header fixo, para que a âncora não deixe o
   título escondido (FR-003).
5. `<main>` ocorre uma vez e contém todas as seções de conteúdo.
6. Os títulos dos acordeões de perguntas frequentes são `<h3>` contendo o `<button>` do Radix —
   nunca `<button>` contendo heading.

---

## Metadados no `index.html`

Estáticos no shell (não injetados por JavaScript), porque precisam existir antes de qualquer
execução de script:

| Tag | Valor | Requisito |
|---|---|---|
| `<html lang>` | `pt-BR` | AC-029 |
| `<title>` | `seo.title` (30–60 caracteres, com serviço + cidade/bairro) | FR-027 |
| `<meta name="description">` | `seo.description` (120–158 caracteres) | FR-027 |
| `<link rel="canonical">` | `seo.canonicalUrl` | FR-027 |
| `<meta name="viewport">` | `width=device-width, initial-scale=1` | FR-033 |
| `<meta name="theme-color">` | token de cor da marca | — |
| `<meta name="geo.region">` / `geo.placename` | UF e cidade | FR-028 |
| `og:type` | `website` | FR-031 |
| `og:title` / `og:description` / `og:url` | de `seo` | FR-031 |
| `og:image` | URL absoluta, ≥ 1200×630 | FR-031 |
| `og:image:alt` | descritivo | FR-031, AC-026 |
| `og:locale` | `pt_BR` | FR-031 |
| `twitter:card` | `summary_large_image` | FR-031 |
| `<link rel="preload" as="font">` | apenas o peso usado acima da dobra, `crossorigin` | R-06 |
| `<link rel="icon">` / `apple-touch-icon` / `manifest` | de `public/` | — |

**Proibido**: alterar `title` ou `meta description` em runtime. A página é única; mudar metadados
por JavaScript não traz benefício e cria divergência entre o HTML servido e o renderizado.

---

## JSON-LD — `PetStore`

Gerado por `buildLocalBusinessJsonLd(business)` em `src/lib/seo/jsonld.ts`, injetado pelo
`scripts/prerender.ts` no `<head>` como
`<script type="application/ld+json">`. O conteúdo é produzido com `JSON.stringify` sobre dados
tipados — essa é a **única** permissão de `dangerouslySetInnerHTML`/injeção de string no projeto
(R-10).

```json
{
  "@context": "https://schema.org",
  "@type": "PetStore",
  "@id": "https://exemplo.com.br/#petshop",
  "name": "<business.tradeName>",
  "legalName": "<business.legalName>",
  "taxID": "<business.taxId>",
  "foundingDate": "<business.foundedYear>",
  "url": "<seo.canonicalUrl>",
  "image": "<url absoluta de seo.ogImage>",
  "telephone": "<business.phone.e164>",
  "email": "<business.email>",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "<street>, <number><, complement>",
    "addressLocality": "<city>",
    "addressRegion": "<state>",
    "postalCode": "<postalCode>",
    "addressCountry": "BR"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 0, "longitude": 0 },
  "areaServed": [{ "@type": "City", "name": "<serviceAreas[n]>" }],
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "https://schema.org/Monday",
      "opens": "08:00",
      "closes": "18:00"
    }
  ],
  "sameAs": ["<business.socials[n].url>"],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Serviços",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": { "@type": "Service", "name": "<service.name>", "description": "<service.summary>" }
      }
    ]
  }
}
```

**Regras de integridade**:

1. `name`, `telephone` e `address` vêm **literalmente** de `business` — os mesmos valores exibidos
   na página e no Perfil da Empresa no Google (FR-029/AC-017).
2. `openingHoursSpecification` é derivada de `business.hours.weekly`; dias com `closed: true` são
   omitidos (não declarados com horário zero).
3. `aggregateRating` só é incluída quando `testimonials.aggregate` existe **com** `sourceUrl`. Nota
   agregada sem avaliações reais é dado inventado — proibido por CT-004 e sujeito a penalidade de
   busca.
4. `review` **não** é emitido: depoimentos coletados pelo próprio negócio não qualificam como
   avaliações de terceiros nas diretrizes de dados estruturados.
5. `priceRange` usa a faixa real do catálogo quando houver preços; omitido quando não houver.
6. Um único bloco JSON-LD. Blocos adicionais (`FAQPage`) **não** serão emitidos nesta entrega: o
   conteúdo das perguntas já está no HTML e marcação de FAQ sem elegibilidade não traz ganho.
7. Validação obrigatória no portão de SEO: Rich Results Test + Schema Markup Validator sem erros
   (AC-030).

---

## `robots.txt` e `sitemap.xml`

Arquivos estáticos em `public/`, não gerados em runtime (FR-027, AC-030).

`public/robots.txt`:

```text
User-agent: *
Allow: /
Sitemap: https://exemplo.com.br/sitemap.xml
```

`public/sitemap.xml`: uma entrada (`/`) com `lastmod`. Com uma única URL, um gerador seria
complexidade sem retorno (Princípio X); a entrada é atualizada manualmente e a revisão de SEO
confere `lastmod` antes de publicar. Quando o site ganhar rotas, a geração entra junto com o
roteador.

---

## URLs e âncoras

- Âncoras em português, legíveis e estáveis: `#servicos`, `#produtos`, `#sobre`,
  `#depoimentos`, `#perguntas-frequentes`, `#contato`.
- O `SectionId` interno (em inglês, usado no código e nos eventos) é mapeado para a âncora pública
  em um único lugar (`navItems`) — o código fica consistente e a URL fica legível para o usuário.
- Nenhuma âncora é alterada após a publicação sem redirecionamento, porque links compartilhados e
  anúncios apontam para elas.

---

## Portão de verificação de SEO

Itens obrigatórios da revisão (Constituição, portão 6):

- [ ] Um único `h1`; hierarquia sem saltos (verificar com a árvore de acessibilidade do navegador)
- [ ] `title` entre 30 e 60 caracteres, com serviço e cidade/bairro
- [ ] `meta description` entre 120 e 158 caracteres
- [ ] `canonical` presente e absoluta em HTTPS
- [ ] Open Graph completo; prévia conferida em um validador de compartilhamento
- [ ] JSON-LD sem erros no Rich Results Test e no Schema Markup Validator
- [ ] NAP idêntico na página, no JSON-LD e no Perfil da Empresa no Google
- [ ] `robots.txt` acessível e apontando o sitemap correto
- [ ] `sitemap.xml` acessível, com `lastmod` atualizado
- [ ] Toda imagem com `alt` descritivo e nome de arquivo significativo
- [ ] Conteúdo das perguntas frequentes presente no HTML servido (verificar com JavaScript
      desabilitado ou com "ver código-fonte", não com o inspetor)
- [ ] `lang="pt-BR"` no `<html>`
