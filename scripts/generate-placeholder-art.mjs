/**
 * Gera as composições visuais de apoio em src/assets/images/.
 *
 * ATENÇÃO — PENDÊNCIA PC-11:
 * Estes arquivos NÃO são fotografias reais do estabelecimento. São composições
 * abstratas, consistentes com a paleta da marca, para que o pipeline de imagem
 * (vite-imagetools → AVIF/WebP/srcset) possa ser construído e auditado.
 *
 * O Princípio VI da Constituição proíbe conteúdo provisório em produção: antes
 * de publicar, cada arquivo aqui DEVE ser substituído pela fotografia real
 * correspondente (mesmo nome, mesma proporção), com autorização de uso de
 * imagem quando houver pessoas ou animais identificáveis (CT-005 / LGPD).
 *
 * Uso: node scripts/generate-placeholder-art.mjs
 */
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const outputDir = join(here, '..', 'src', 'assets', 'images');
mkdirSync(outputDir, { recursive: true });

// Paleta alinhada a src/styles/theme.css
const BRAND = { deep: '#1d4b4a', mid: '#2f6f6c', light: '#5aa8a3', pale: '#d9eceb' };
const ACCENT = { warm: '#e0a152', soft: '#f6e3c6' };

/** Composição em camadas: gradiente + formas orgânicas + grão sutil. */
function composition({ width, height, from, to, shapes, seed }) {
  const blobs = shapes
    .map(
      (shape, index) =>
        `<ellipse cx="${shape.cx}%" cy="${shape.cy}%" rx="${shape.rx}%" ry="${shape.ry}%"
            fill="${shape.fill}" opacity="${shape.opacity}"
            transform="rotate(${(seed * (index + 3)) % 60 - 30} ${width / 2} ${height / 2})" />`,
    )
    .join('\n');

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}" />
      <stop offset="100%" stop-color="${to}" />
    </linearGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="${Math.round(width / 28)}" /></filter>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)" />
  <g filter="url(#soft)">${blobs}</g>
</svg>`);
}

const assets = [
  {
    file: 'hero-banho-tosa.jpg',
    width: 1600,
    height: 1200,
    quality: 72,
    svg: {
      from: BRAND.mid,
      to: BRAND.deep,
      seed: 7,
      shapes: [
        { cx: 24, cy: 30, rx: 30, ry: 26, fill: BRAND.light, opacity: 0.5 },
        { cx: 76, cy: 66, rx: 34, ry: 30, fill: ACCENT.warm, opacity: 0.32 },
        { cx: 56, cy: 18, rx: 22, ry: 18, fill: BRAND.pale, opacity: 0.22 },
      ],
    },
  },
  {
    file: 'espaco-recepcao.jpg',
    width: 1400,
    height: 1050,
    quality: 70,
    svg: {
      from: BRAND.pale,
      to: BRAND.light,
      seed: 11,
      shapes: [
        { cx: 32, cy: 58, rx: 32, ry: 28, fill: BRAND.mid, opacity: 0.38 },
        { cx: 72, cy: 32, rx: 26, ry: 24, fill: ACCENT.soft, opacity: 0.55 },
      ],
    },
  },
  {
    file: 'espaco-banho.jpg',
    width: 1400,
    height: 1050,
    quality: 70,
    svg: {
      from: BRAND.light,
      to: BRAND.deep,
      seed: 17,
      shapes: [
        { cx: 62, cy: 44, rx: 34, ry: 30, fill: BRAND.pale, opacity: 0.34 },
        { cx: 22, cy: 70, rx: 24, ry: 22, fill: ACCENT.warm, opacity: 0.26 },
      ],
    },
  },
  {
    file: 'equipe-tosa.jpg',
    width: 900,
    height: 900,
    quality: 72,
    svg: {
      from: BRAND.mid,
      to: BRAND.light,
      seed: 23,
      shapes: [{ cx: 50, cy: 42, rx: 32, ry: 30, fill: ACCENT.soft, opacity: 0.42 }],
    },
  },
  {
    file: 'equipe-veterinaria.jpg',
    width: 900,
    height: 900,
    quality: 72,
    svg: {
      from: BRAND.deep,
      to: BRAND.mid,
      seed: 29,
      shapes: [{ cx: 46, cy: 50, rx: 30, ry: 28, fill: BRAND.pale, opacity: 0.38 }],
    },
  },
  // Serviços
  ...[
    ['servico-banho-tosa.jpg', 31, BRAND.mid, BRAND.deep],
    ['servico-tosa-higienica.jpg', 37, BRAND.light, BRAND.mid],
    ['servico-hidratacao.jpg', 41, BRAND.pale, BRAND.light],
    ['servico-consulta.jpg', 43, BRAND.deep, BRAND.mid],
    ['servico-vacinacao.jpg', 47, BRAND.mid, BRAND.light],
    ['servico-leva-traz.jpg', 53, BRAND.light, BRAND.deep],
  ].map(([file, seed, from, to]) => ({
    file,
    width: 1000,
    height: 750,
    quality: 70,
    svg: {
      from,
      to,
      seed,
      shapes: [
        { cx: 38, cy: 46, rx: 30, ry: 28, fill: ACCENT.soft, opacity: 0.3 },
        { cx: 74, cy: 64, rx: 24, ry: 22, fill: BRAND.pale, opacity: 0.28 },
      ],
    },
  })),
  // Produtos
  ...[
    ['produto-racao-premium.jpg', 59],
    ['produto-racao-gatos.jpg', 61],
    ['produto-shampoo.jpg', 67],
    ['produto-brinquedos.jpg', 71],
    ['produto-coleiras.jpg', 73],
    ['produto-antipulgas.jpg', 79],
    ['produto-petiscos.jpg', 83],
    ['produto-caixa-transporte.jpg', 89],
  ].map(([file, seed]) => ({
    file,
    width: 800,
    height: 800,
    quality: 70,
    svg: {
      from: BRAND.pale,
      to: '#ffffff',
      seed,
      shapes: [
        { cx: 50, cy: 52, rx: 30, ry: 28, fill: BRAND.light, opacity: 0.34 },
        { cx: 66, cy: 34, rx: 18, ry: 16, fill: ACCENT.warm, opacity: 0.24 },
      ],
    },
  })),
  // Imagem de compartilhamento (Open Graph, mínimo 1200x630)
  {
    file: 'og-default.jpg',
    width: 1200,
    height: 630,
    quality: 78,
    svg: {
      from: BRAND.deep,
      to: BRAND.mid,
      seed: 97,
      shapes: [
        { cx: 78, cy: 52, rx: 30, ry: 44, fill: BRAND.light, opacity: 0.44 },
        { cx: 20, cy: 40, rx: 22, ry: 34, fill: ACCENT.warm, opacity: 0.28 },
      ],
    },
  },
  // Fachada estática do mapa (facade, research.md R-12)
  {
    file: 'mapa-fachada.jpg',
    width: 1200,
    height: 675,
    quality: 68,
    svg: {
      from: '#e8f0ef',
      to: BRAND.pale,
      seed: 101,
      shapes: [
        { cx: 50, cy: 50, rx: 40, ry: 36, fill: BRAND.light, opacity: 0.24 },
        { cx: 50, cy: 50, rx: 8, ry: 8, fill: BRAND.deep, opacity: 0.6 },
      ],
    },
  },
];

// Sequencial de propósito: o sharp é intensivo em CPU e processar os 21
// arquivos em paralelo degradaria a máquina sem ganho real de tempo.
for (const asset of assets) {
  const svg = composition({ width: asset.width, height: asset.height, ...asset.svg });
  await sharp(svg)
    .jpeg({ quality: asset.quality, progressive: true, mozjpeg: true })
    .toFile(join(outputDir, asset.file));
  console.log(`gerado  ${asset.file}  ${asset.width}x${asset.height}`);
}

console.log(`\n${assets.length} composições geradas em src/assets/images/`);
console.log('PENDÊNCIA PC-11: substituir por fotografias reais antes de publicar.');
