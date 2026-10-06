/**
 * Pré-renderização (research.md R-01).
 *
 * Gera `dist/index.html` com todo o HTML das seções já presente no documento.
 * É isso que permite atender simultaneamente:
 * - LCP ≤ 2,5s (AC-027): o texto e a imagem do hero não esperam o bundle;
 * - FR-032: as respostas das perguntas frequentes ficam no HTML servido;
 * - o requisito constitucional de "HTML estático ou pré-renderizado".
 *
 * IMPORTANTE — por que um build SSR e não `vite-node`:
 * executar o app pelo transform de desenvolvimento faz o `vite-imagetools`
 * emitir URLs de dev (`/@imagetools/<hash>`), que não existem em produção — o
 * HTML sairia com todas as imagens quebradas, justamente anulando o ganho de
 * LCP. O build SSR usa o mesmo grafo de assets do build do cliente, então as
 * URLs são as definitivas com hash.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(projectRoot, 'dist');
const distIndex = join(distDir, 'index.html');
const ssrEntry = join(projectRoot, 'dist-ssr', 'entry-prerender.js');

const { renderPage } = await import(pathToFileURL(ssrEntry).href);

const assetFiles = readdirSync(join(distDir, 'assets'));

/** Resolve o nome com hash de um asset a partir do seu prefixo. */
function findAsset(prefix, extension) {
  const match = assetFiles.find(
    (file) => file.startsWith(prefix) && file.endsWith(extension),
  );
  if (match === undefined) {
    throw new Error(`Asset não encontrado no build: ${prefix}*${extension}`);
  }
  return `/assets/${match}`;
}

/**
 * Preloads do caminho crítico.
 *
 * O `index.html` não pode declarar estes caminhos: eles só existem com hash
 * depois do build, e um `<link rel="preload">` apontando para `/src/assets/...`
 * é descartado pelo Vite — foi exatamente isso que deixou a página sem nenhum
 * preload de fonte e empurrou o LCP para 2,9 s.
 */
function buildPreloads(html) {
  const links = [
    // Único peso usado acima da dobra (research.md R-06).
    `<link rel="preload" href="${findAsset('inter-latin-600-', '.woff2')}" as="font" type="font/woff2" crossorigin />`,
    // A fonte de display desenha o <h1>, que é o candidato a LCP.
    `<link rel="preload" href="${findAsset('fraunces-latin-700-', '.woff2')}" as="font" type="font/woff2" crossorigin />`,
  ];

  // Preload da imagem do hero, usando o mesmo srcset/sizes que o <picture>
  // declara — assim o navegador baixa exatamente a derivada que vai exibir.
  const heroSource = html.match(
    /<source type="image\/avif" srcSet="([^"]+)" sizes="([^"]+)"/i,
  );
  if (heroSource !== null) {
    links.push(
      `<link rel="preload" as="image" type="image/avif" imagesrcset="${heroSource[1]}" imagesizes="${heroSource[2]}" fetchpriority="high" />`,
    );
  }

  return links.map((link) => `    ${link}`).join('\n');
}

const template = readFileSync(distIndex, 'utf8');
const { html, jsonLd, meta } = renderPage();

const output = template
  .replace('<!--app-html-->', html)
  .replace('<!--app-meta-->', meta)
  .replace('<!--app-preload-->', buildPreloads(html))
  .replace('<!--app-jsonld-->', `<script type="application/ld+json">${jsonLd}</script>`);

if (output === template) {
  throw new Error(
    'Nenhum marcador de injeção foi substituído em dist/index.html. ' +
      'Causa provável: o arquivo já foi pré-renderizado. Rode `npm run build:client` ' +
      'para regerá-lo a partir do template antes de `npm run prerender` ' +
      '(ou simplesmente `npm run build`).',
  );
}

// Guarda contra o bug que motivou o build SSR: URLs de desenvolvimento nunca
// podem chegar ao HTML publicado.
// Checa apenas atributos (src=/href=), para não disparar com texto de comentário.
const devPathPattern = /(?:src|href)="\/(?:@imagetools\/|@fs\/|src\/)/;
if (devPathPattern.test(output)) {
  throw new Error(
    'O HTML pré-renderizado contém caminhos de desenvolvimento (/@imagetools/, ' +
      '/@fs/ ou /src/). O prerender deve rodar sobre o build SSR.',
  );
}

const unexpectedSources = (output.match(/src="(?!\/assets\/|https?:|data:)[^"]*"/g) ?? []).filter(
  (match) => !match.includes('/og/'),
);
if (unexpectedSources.length > 0) {
  throw new Error(`Caminhos inesperados no HTML: ${unexpectedSources.join(', ')}`);
}

writeFileSync(distIndex, output, 'utf8');

const kb = (text) => (Buffer.byteLength(text, 'utf8') / 1024).toFixed(1);
console.log(`✔ Prerender concluído: dist/index.html (${kb(output)} KB)`);
console.log(`  HTML das seções: ${kb(html)} KB`);
console.log(`  JSON-LD: ${kb(jsonLd)} KB`);
console.log(`  Preloads injetados: fontes críticas + imagem do hero`);
