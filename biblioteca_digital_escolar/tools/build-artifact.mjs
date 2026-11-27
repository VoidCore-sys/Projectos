/**
 * Genera la versión de un solo archivo (dist/biblioteca-digital-escolar.html):
 * libros + estilos + código empaquetados, con el "servidor" corriendo dentro de la página.
 * Uso: npm run build:html
 */
import { build, transform } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const require = createRequire(import.meta.url);

// 1. Libros originales -> JSON
const dir = path.join(root, 'server/content');
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.js')).sort();
const all = files.flatMap((f) => [].concat(require(path.join(dir, f))));
const books = all.map((b, i) => {
  const created = new Date(Date.parse('2026-11-24T12:00:00Z') - (all.length - i) * 1.5 * 86400000).toISOString().replace('T', ' ').slice(0, 19);
  return {
    id: i + 1, slug: b.slug, title: b.title, author: b.author, synopsis: b.synopsis, genres: b.genres,
    gradeMin: b.gradeMin, gradeMax: b.gradeMax, section: b.gradeMin <= 3 ? 1 : b.gradeMin <= 5 ? 2 : 3,
    cover: b.cover, status: 'published', featured: !!b.featured, license: b.license || 'Obra original creada para la Biblioteca Digital Escolar',
    createdBy: null, createdAt: created, updatedAt: created, chapters: b.chapters, quiz: b.quiz
  };
});
fs.mkdirSync(path.join(root, 'build'), { recursive: true });
fs.writeFileSync(path.join(root, 'build/books.json'), JSON.stringify(books));

// 2. Código: se reemplaza api.js por el backend local
const localApi = {
  name: 'local-api',
  setup(b) {
    b.onResolve({ filter: /\/api\.js$/ }, (args) => {
      const target = path.resolve(args.resolveDir, args.path);
      if (target === path.join(root, 'public/js/api.js')) return { path: path.join(root, 'public/js/local/api-local.js') };
      return null;
    });
  }
};
const js = await build({
  entryPoints: [path.join(root, 'public/js/main.js')], bundle: true, format: 'iife', minify: true,
  target: 'es2020', charset: 'utf8', write: false, plugins: [localApi], legalComments: 'none'
});
let code = js.outputFiles[0].text.replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--');

// 3. Estilos
const css = ['base', 'components', 'views', 'reader'].map((n) => fs.readFileSync(path.join(root, `public/css/${n}.css`), 'utf8')).join('\n');
const cssMin = (await transform(css, { loader: 'css', minify: true, charset: 'utf8' })).code;

// 4. Página
const html = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Biblioteca Digital Escolar</title>
<meta name="description" content="Biblioteca digital para alumnos de 1.º a 7.º grado con progreso de lectura guardado.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600&family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,600;1,7..72,400&family=Nunito:wght@400;700;800&display=swap">
<style>${cssMin}</style>
<div id="app" lang="es"><div class="boot" aria-label="Cargando la biblioteca"><span class="spinner spinner--lg"></span><p>Abriendo la biblioteca…</p></div></div>
<div id="toasts" class="toasts" aria-live="polite"></div>
<noscript><p class="noscript">Para usar la Biblioteca Digital Escolar necesitás activar JavaScript.</p></noscript>
<script>${code}</script>
`;
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
const out = path.join(root, 'dist/biblioteca-digital-escolar.html');
fs.writeFileSync(out, html);
// Copia como documento HTML completo, para abrir directo en el navegador o publicar en GitHub Pages.
const standalone = path.join(root, 'dist/index.html');
fs.writeFileSync(standalone, `<!doctype html>\n<html lang="es">\n${html}</html>\n`);
console.log(`Listo: ${out} (${(html.length / 1024).toFixed(0)} KB) y ${standalone}`);
