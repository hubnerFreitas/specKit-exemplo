/**
 * Valida o conteúdo de src/content/ contra os schemas Zod e as invariantes
 * entre entidades, e aborta o build em qualquer violação.
 *
 * É este script que torna os Princípios II (prova visível) e VI (conteúdo
 * real) EXECUTÁVEIS em vez de intenções: um depoimento sem autor, um hero sem
 * elemento de prova ou um FAQ sem os 8 tópicos obrigatórios quebram o build.
 *
 * Ver specs/001-petshop-home-comercial/contracts/content-schemas.md
 */
import { getSiteContent } from '@/content/index';
import { REQUIRED_FAQ_TOPICS, siteContentSchema } from '@/schemas/content.schema';
import type { SiteContent } from '@/types/content';

type Violation = {
  path: string;
  message: string;
  requirement: string;
  file: string;
};

const violations: Violation[] = [];

function report(path: string, message: string, requirement: string, file: string): void {
  violations.push({ path, message, requirement, file });
}

/* -- 1. Schema ------------------------------------------------------------- */

const content = getSiteContent();
const parsed = siteContentSchema.safeParse(content);

if (!parsed.success) {
  for (const issue of parsed.error.issues) {
    const path = issue.path.join('.') || '(raiz)';
    report(path, issue.message, 'schema de conteúdo', guessFile(path));
  }
}

function guessFile(path: string): string {
  const root = path.split('.')[0] ?? '';
  const map: Record<string, string> = {
    business: 'src/content/business.ts',
    nav: 'src/content/business.ts',
    seo: 'src/content/business.ts',
    hero: 'src/content/hero.ts',
    about: 'src/content/about.ts',
    differentials: 'src/content/differentials.ts',
    services: 'src/content/services.ts',
    products: 'src/content/products.ts',
    testimonials: 'src/content/testimonials.ts',
    faq: 'src/content/faq.ts',
  };
  return map[root] ?? 'src/content/';
}

/* -- 2. Invariantes entre entidades (data-model.md) ------------------------ */

function validateInvariants(site: SiteContent): void {
  // 2.1 — about.yearsInBusiness coerente com business.foundedYear (FR-017).
  const expectedYears = new Date().getFullYear() - site.business.foundedYear;
  if (Math.abs(site.about.yearsInBusiness - expectedYears) > 1) {
    report(
      'about.yearsInBusiness',
      `${site.about.yearsInBusiness} não é coerente com business.foundedYear (${site.business.foundedYear} ⇒ ~${expectedYears} anos)`,
      'FR-017 (dados do negócio não podem se contradizer na página)',
      'src/content/about.ts',
    );
  }

  // 2.2 — cta.intent derivado do id (FR-008).
  site.services.forEach((service, index) => {
    const expected = `service:${service.id}`;
    if (service.cta.intent !== expected) {
      report(
        `services[${index}].cta.intent`,
        `esperado "${expected}", recebido "${service.cta.intent}"`,
        'FR-008 (mensagem de WhatsApp contextual à origem)',
        'src/content/services.ts',
      );
    }
  });

  site.products.items.forEach((product, index) => {
    const expected = `product:${product.id}`;
    if (product.cta.intent !== expected) {
      report(
        `products.items[${index}].cta.intent`,
        `esperado "${expected}", recebido "${product.cta.intent}"`,
        'FR-008 (mensagem de WhatsApp contextual à origem)',
        'src/content/products.ts',
      );
    }
  });

  // 2.3 — ids únicos.
  const uniqueChecks: { label: string; ids: string[]; file: string }[] = [
    {
      label: 'differentials',
      ids: site.differentials.map((item) => item.id),
      file: 'src/content/differentials.ts',
    },
    { label: 'services', ids: site.services.map((item) => item.id), file: 'src/content/services.ts' },
    {
      label: 'products.items',
      ids: site.products.items.map((item) => item.id),
      file: 'src/content/products.ts',
    },
    { label: 'faq', ids: site.faq.map((item) => item.id), file: 'src/content/faq.ts' },
    {
      label: 'testimonials.items',
      ids: site.testimonials?.items.map((item) => item.id) ?? [],
      file: 'src/content/testimonials.ts',
    },
  ];

  for (const check of uniqueChecks) {
    const duplicates = check.ids.filter((id, index) => check.ids.indexOf(id) !== index);
    if (duplicates.length > 0) {
      report(
        `${check.label}[].id`,
        `ids duplicados: ${[...new Set(duplicates)].join(', ')}`,
        'data-model.md (id único por coleção)',
        check.file,
      );
    }
  }

  // 2.4 — faq.order único (FR-022).
  const orders = site.faq.map((item) => item.order);
  if (new Set(orders).size !== orders.length) {
    report(
      'faq[].order',
      'valores de order duplicados — a ordenação fica ambígua',
      'FR-022',
      'src/content/faq.ts',
    );
  }

  // 2.5 — Os 8 tópicos obrigatórios de FAQ (AC-016). É a verificação mais
  // valiosa do projeto: transforma um item de revisão manual em condição de
  // build.
  const coveredTopics = new Set(site.faq.map((item) => item.topic));
  const missingTopics = REQUIRED_FAQ_TOPICS.filter((topic) => !coveredTopics.has(topic));
  if (missingTopics.length > 0) {
    report(
      'faq[].topic',
      `tópicos obrigatórios não cobertos: ${missingTopics.join(', ')}`,
      'AC-016 / FR-022 (as perguntas frequentes cobrem as 8 objeções mínimas)',
      'src/content/faq.ts',
    );
  }

  // 2.6 — Atendimento a gatos esclarecido (FR-022).
  const hasCatService = site.services.some((service) => service.species.includes('cat'));
  if (!hasCatService && !coveredTopics.has('cats')) {
    report(
      'services[].species',
      'nenhum serviço atende gatos e não há pergunta frequente sobre atendimento felino',
      'FR-022 (o atendimento a gatos deve estar esclarecido)',
      'src/content/services.ts',
    );
  }

  // 2.7 — Produtos visíveis entre 4 e 8 (FR-020). O schema não pode fazer essa
  // contagem porque ela exclui os indisponíveis.
  const visibleProducts = site.products.items.filter(
    (product) => product.availability !== 'unavailable',
  );
  if (visibleProducts.length < 4 || visibleProducts.length > 8) {
    report(
      'products.items',
      `${visibleProducts.length} produtos visíveis; esperado entre 4 e 8`,
      'FR-020',
      'src/content/products.ts',
    );
  }

  // 2.8 — Toda âncora de navegação aponta para uma seção existente.
  const validAnchors = new Set([
    'about',
    'differentials',
    'services',
    'products',
    'testimonials',
    'faq',
    'contact',
  ]);
  site.nav.forEach((item, index) => {
    if (!validAnchors.has(item.anchor.replace('#', ''))) {
      report(
        `nav[${index}].anchor`,
        `"${item.anchor}" não corresponde a nenhuma seção renderizada`,
        'FR-002 / FR-003',
        'src/content/business.ts',
      );
    }
  });

  // 2.9 — CTA com âncora aponta para seção existente.
  if (site.hero.secondaryCta?.channel === 'anchor') {
    const anchorId = site.hero.secondaryCta.anchorId ?? '';
    if (!validAnchors.has(anchorId)) {
      report(
        'hero.secondaryCta.anchorId',
        `"${anchorId}" não corresponde a nenhuma seção renderizada`,
        'FR-003',
        'src/content/hero.ts',
      );
    }
  }
}

/* -- 3. Heurística de placeholder (CT-001) --------------------------------- */

const PLACEHOLDER_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /lorem\s+ipsum/i, label: 'texto "lorem ipsum"' },
  { pattern: /\bplaceholder\b/i, label: 'a palavra "placeholder"' },
  { pattern: /\bTODO\b|\bTBD\b|\bFIXME\b/, label: 'marcador de pendência (TODO/TBD/FIXME)' },
  { pattern: /\bpreencher\b/i, label: 'a palavra "preencher"' },
  { pattern: /\bexemplo\.com\b/i, label: 'domínio exemplo.com' },
  { pattern: /\b(serviço|produto|cliente|item|seção)\s+\d+\b/i, label: 'rótulo numerado genérico' },
  { pattern: /\bNome\s+Sobrenome\b/i, label: 'nome genérico "Nome Sobrenome"' },
  { pattern: /\bxxx+\b/i, label: 'sequência "xxx"' },
  { pattern: /00\.000\.000\/0000-00/, label: 'CNPJ-sentinela' },
  { pattern: /\+?55?0{8,}/, label: 'telefone-sentinela' },
  { pattern: /\b(aaa+|bbb+|teste\s+teste)\b/i, label: 'texto de teste' },
];

/** Percorre todo o conteúdo coletando pares (caminho, texto). */
function collectStrings(value: unknown, path: string, out: [string, string][]): void {
  if (typeof value === 'string') {
    out.push([path, value]);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectStrings(item, `${path}[${index}]`, out));
    return;
  }
  if (value !== null && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      // `source` é o objeto do vite-imagetools (caminhos de build, não conteúdo).
      if (key === 'source') continue;
      collectStrings(child, path === '' ? key : `${path}.${key}`, out);
    }
  }
}

function validatePlaceholders(site: SiteContent): void {
  const strings: [string, string][] = [];
  collectStrings(site, '', strings);

  for (const [path, text] of strings) {
    for (const { pattern, label } of PLACEHOLDER_PATTERNS) {
      if (pattern.test(text)) {
        report(
          path,
          `conteúdo com aparência de placeholder — ${label}`,
          'CT-001 (nenhum conteúdo com cara de placeholder vai a produção)',
          guessFile(path),
        );
      }
    }
  }

  // Texto repetido idêntico na mesma coleção indica preenchimento apressado.
  const collections: { label: string; texts: string[]; file: string }[] = [
    {
      label: 'differentials[].description',
      texts: site.differentials.map((item) => item.description),
      file: 'src/content/differentials.ts',
    },
    {
      label: 'services[].summary',
      texts: site.services.map((item) => item.summary),
      file: 'src/content/services.ts',
    },
    {
      label: 'products.items[].description',
      texts: site.products.items.map((item) => item.description),
      file: 'src/content/products.ts',
    },
    {
      label: 'faq[].answer',
      texts: site.faq.map((item) => item.answer),
      file: 'src/content/faq.ts',
    },
    {
      label: 'testimonials.items[].quote',
      texts: site.testimonials?.items.map((item) => item.quote) ?? [],
      file: 'src/content/testimonials.ts',
    },
  ];

  for (const collection of collections) {
    const duplicates = collection.texts.filter(
      (text, index) => collection.texts.indexOf(text) !== index,
    );
    if (duplicates.length > 0) {
      report(
        collection.label,
        'texto idêntico repetido em dois itens da mesma coleção',
        'CT-001',
        collection.file,
      );
    }
  }
}

/* -- 4. Pendências de conteúdo real (PC-11) -------------------------------- */

function reportOpenPendencies(): void {
  // As imagens em src/assets/images/ são composições abstratas geradas por
  // scripts/generate-placeholder-art.mjs, não fotografias reais do
  // estabelecimento. O Princípio VI exige que a pendência seja registrada.
  console.warn(
    '\n⚠ PENDÊNCIA PC-11 (spec.md): as imagens em src/assets/images/ são\n' +
      '  composições abstratas de apoio, NÃO fotografias reais do espaço, da\n' +
      '  equipe e dos animais. Substitua-as antes de publicar (CT-005), com\n' +
      '  autorização de uso de imagem quando houver pessoas ou animais\n' +
      '  identificáveis.\n',
  );
}

/* -- Execução -------------------------------------------------------------- */

if (parsed.success) {
  validateInvariants(parsed.data);
  validatePlaceholders(parsed.data);
}

if (violations.length > 0) {
  console.error(`\n${violations.length} violação(ões) de conteúdo:\n`);
  for (const violation of violations) {
    console.error(`✖ ${violation.path} — ${violation.message}`);
    console.error(`  Requisito: ${violation.requirement}`);
    console.error(`  Arquivo: ${violation.file}\n`);
  }
  process.exit(1);
}

console.log('✔ Conteúdo válido: schemas, invariantes e heurística de placeholder.');
reportOpenPendencies();
