/**
 * build-perf.mjs — FNDD Performance Build
 * 1. Converte imagens PNG/JPEG para WebP com qualidade otimizada
 * 2. Concatena todos os CSS em um único bundle minificado
 * 3. Minifica o JS principal
 * Não altera o layout, cores ou funcionalidade do site.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { minify as cssoMinify } from 'csso';
import { minify as terserMinify } from 'terser';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Diretórios
const IMAGES_DIR = join(__dirname, 'assets/images');
const CSS_DIR    = join(__dirname, 'assets/css');
const JS_DIR     = join(__dirname, 'assets/js');

// ── 1. CONVERTER IMAGENS PARA WEBP
console.log('\n📸 Convertendo imagens para WebP...');

const imageJobs = [
  // JPEG de 2,8 MB → WebP qualidade 82, resize proporcional para max 1400px
  {
    input:   join(IMAGES_DIR, 'FNDD SOBRE.jpeg'),
    output:  join(IMAGES_DIR, 'FNDD SOBRE.webp'),
    options: { quality: 82, effort: 6 },
    resize:  { width: 1400, withoutEnlargement: true },
  },
  // Logo do boneco: PNG 624 KB → WebP qualidade 90
  {
    input:   join(IMAGES_DIR, 'Apenas Boneco Logo.png'),
    output:  join(IMAGES_DIR, 'Apenas Boneco Logo.webp'),
    options: { quality: 90, effort: 6, lossless: false },
    resize:  { width: 300, withoutEnlargement: true },
  },
  // Logotipo completo FNDD: PNG 520 KB → WebP qualidade 90
  {
    input:   join(IMAGES_DIR, 'logotipo FNDD png.png'),
    output:  join(IMAGES_DIR, 'logotipo FNDD png.webp'),
    options: { quality: 90, effort: 6, lossless: false },
    resize:  { width: 500, withoutEnlargement: true },
  },
];

for (const job of imageJobs) {
  try {
    const inputSize = readFileSync(job.input).length;
    await sharp(job.input)
      .resize(job.resize)
      .webp(job.options)
      .toFile(job.output);
    const outputSize = readFileSync(job.output).length;
    const saved = ((1 - outputSize / inputSize) * 100).toFixed(1);
    console.log(
      `  ✅ ${job.input.split(/[\\/]/).pop()} → webp  |  ${(inputSize/1024).toFixed(0)} KB → ${(outputSize/1024).toFixed(0)} KB  (−${saved}%)`
    );
  } catch (e) {
    console.error(`  ❌ Erro em ${job.input}: ${e.message}`);
  }
}

// ── 2. CONCATENAR + MINIFICAR TODOS OS CSS EM UM ÚNICO BUNDLE
console.log('\n🎨 Concatenando e minificando CSS...');

// Ordem original do main.css (mantida exata)
const cssFiles = [
  'base/tokens.css',
  'base/reset.css',
  'base/animations.css',
  'components/navbar.css',
  'components/cards.css',
  'sections/hero.css',
  'sections/pillars.css',
  'sections/manifesto.css',
  'sections/directors.css',
  'sections/events.css',
  'sections/faq.css',
  'sections/contact.css',
  'sections/footer-premium.css',
  'base/polish.css',
  'base/responsive.css',
];

let concatenated = '';
for (const file of cssFiles) {
  const fullPath = join(CSS_DIR, file);
  const content = readFileSync(fullPath, 'utf-8');
  concatenated += `/* === ${file} === */\n${content}\n\n`;
}

const minifiedCss = cssoMinify(concatenated, { restructure: false }).css;
const bundlePath = join(CSS_DIR, 'bundle.min.css');
writeFileSync(bundlePath, minifiedCss, 'utf-8');

const origKb  = (concatenated.length / 1024).toFixed(1);
const minKb   = (minifiedCss.length  / 1024).toFixed(1);
const cssSaved = ((1 - minifiedCss.length / concatenated.length) * 100).toFixed(1);
console.log(`  ✅ ${cssFiles.length} arquivos CSS concatenados → bundle.min.css  |  ${origKb} KB → ${minKb} KB  (−${cssSaved}%)`);

// ── 3. MINIFICAR JAVASCRIPT
console.log('\n⚡ Minificando JavaScript...');

const jsInput = join(JS_DIR, 'main.js');
const jsSource = readFileSync(jsInput, 'utf-8');

const result = await terserMinify(jsSource, {
  compress: {
    drop_console: false,
    passes: 2,
  },
  mangle: true,
  format: { comments: false },
});

const jsOutputPath = join(JS_DIR, 'main.min.js');
writeFileSync(jsOutputPath, result.code, 'utf-8');

const origJsKb = (jsSource.length     / 1024).toFixed(1);
const minJsKb  = (result.code.length  / 1024).toFixed(1);
const jsSaved  = ((1 - result.code.length / jsSource.length) * 100).toFixed(1);
console.log(`  ✅ main.js → main.min.js  |  ${origJsKb} KB → ${minJsKb} KB  (−${jsSaved}%)`);

console.log('\n✨ Build de performance concluído com sucesso!\n');
