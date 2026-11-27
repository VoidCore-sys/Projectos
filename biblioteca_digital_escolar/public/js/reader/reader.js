/**
 * Lector de libros.
 *  - Pagina el texto midiendo el espacio real de cada página (se adapta a la pantalla y al tamaño de letra).
 *  - Doble página en pantallas grandes y página simple en celulares, con animación de hoja que gira.
 *  - Índice, información del libro, favoritos, tamaño de letra, temas de lectura y pantalla completa.
 *  - Guarda en la base de datos el capítulo, el párrafo y la página exactos, más el tiempo de lectura.
 */
import { get, put, del } from '../api.js';
import { icon, sceneSVG, coverHTML } from '../art.js';
import { el, esc, toast, modal, showAchievements, errorToast, reducedMotion, gradeLabel, minutesLabel, confirmDialog, $$ } from '../ui.js';
import { prefs, store } from '../store.js';
import { bookCache } from '../components.js';
import { startOpening, playClosing, releaseApp } from './opening.js';
import { perfTier, animSetting, setAnimSetting } from '../perf.js';
import { openQuiz } from './quiz.js';

const FONT_STEPS = [0.86, 1, 1.12, 1.26, 1.42];
const THEMES = { paper: 'Papel', sepia: 'Sepia', night: 'Noche' };
const BAR_H = 60;
const FOOT_H = 66;

let current = null;
export const isReaderOpen = () => !!current;

export async function openReader(bookId, opts) {
  if (current) return;
  const r = new Reader(bookId, opts);
  current = r;
  try {
    await r.open();
  } catch (err) {
    errorToast(err);
    current = null;
    r.destroy(true);
    opts.onRequestClose?.({ failed: true });
  }
}

export async function closeReader() {
  if (!current) return;
  const r = current;
  current = null;
  await r.close();
  return r.id;
}

/* --------------------------- Utilidades de texto --------------------------- */
const tokenize = (text) => text.replace(/\n/g, ' \n ').split(/ +/).filter(Boolean);
const paragraphsOf = (content) => content.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).map(tokenize);
function tokensHTML(tokens, s, e) {
  const t = tokens.slice(s, e);
  while (t[0] === '\n') t.shift();
  while (t[t.length - 1] === '\n') t.pop();
  // Une la raya de diálogo a la palabra vecina para que nunca quede sola al cortar la línea.
  return esc(t.join(' ')).replace(/ ?\n ?/g, '<br>').replace(/(\S)—/g, '$1\u2060—').replace(/—(\S)/g, '—\u2060$1');
}
const isCipher = (tokens) => {
  const txt = tokens.filter((t) => t !== '\n').join(' ');
  return txt.length > 4 && /^[A-ZÑ ]+$/.test(txt) && txt.split(' ').length >= 2;
};

function computeLayout() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const padY = vw < 600 ? 8 : 22;
  const availH = vh - BAR_H - FOOT_H - padY * 2;
  const side = vw < 600 ? 8 : vw < 1000 ? 60 : 92;
  const availW = vw - side * 2;
  let spread = vw >= 880 && vh >= 500;
  let w;
  let h;
  if (spread) {
    h = Math.min(availH, 880);
    w = h * 0.7;
    if (w * 2 > availW) { w = availW / 2; h = Math.min(availH, w / 0.62); }
    if (w < 340) spread = false;
  }
  if (!spread) {
    w = Math.min(availW, 620);
    h = availH;
    if (h > w * 1.75) h = w * 1.75;
    if (w > h * 0.78) w = h * 0.78;
  }
  w = Math.floor(w);
  h = Math.floor(h);
  return { spread, w, h, cx: Math.round(vw / 2), cy: Math.round(BAR_H + padY + availH / 2), fs: Math.max(14.5, Math.min(19.5, w / 27)) };
}

class Reader {
  constructor(id, { source, onRequestClose, app }) {
    this.id = Number(id);
    this.source = source;
    this.onRequestClose = onRequestClose;
    this.app = app;
    this.fontStep = Math.min(FONT_STEPS.length - 1, Math.max(0, prefs.get('fontStep', 1)));
    this.theme = THEMES[prefs.get('theme', 'paper')] ? prefs.get('theme', 'paper') : 'paper';
    this.pos = 0;
    this.pages = [];
    this.seconds = 0;
    this.lastActive = Date.now();
    this.busy = false;
    this.queue = null;
    this.reachedEnd = false;
    this.cleanup = [];
  }

  get themeClass() { return `rd-theme-${this.theme} rd-s${this.book?.section || bookCache.get(this.id)?.section || 1}`; }

  applyVars(target = document.documentElement) {
    const L = this.layout;
    const secMul = this.book?.section === 1 ? 1.1 : this.book?.section === 3 ? 0.97 : 1.03;
    target.style.setProperty('--rd-w', `${L.w}px`);
    target.style.setProperty('--rd-h', `${L.h}px`);
    target.style.setProperty('--rd-fs', `${(L.fs * FONT_STEPS[this.fontStep] * secMul).toFixed(2)}px`);
  }

  /* ------------------------------- Apertura ------------------------------- */
  async open() {
    // Evita que el efecto de cámara (escala de la página de fondo) agrande el área desplazable en celulares.
    document.documentElement.classList.add('is-reading');
    this.layout = computeLayout();
    const L = this.layout;
    const dataP = get(`/books/${this.id}`);
    let stub = bookCache.get(this.id);
    if (!stub) stub = (await dataP).book;
    this.book = stub;
    this.applyVars();
    const target = { left: L.cx - L.w / 2, top: L.cy - L.h / 2, width: L.w, height: L.h };
    const opening = startOpening({ book: stub, source: this.source, target, app: this.app, className: this.themeClass });
    // La paginación se hace mientras el libro vuela (la animación corre en la placa de video),
    // así no hay una pausa entre el vuelo y la apertura.
    try {
      const [data] = await Promise.all([dataP, document.fonts?.ready]);
      this.book = data.book;
      this.applyVars();
      this.build();
      await Promise.all(['Literata', 'Fredoka', 'Nunito'].map((f) => document.fonts?.load(`16px ${f}`).catch(() => {})));
      await this.paginate();
      this.savedPos = this.positionFromProgress(this.book.progress);
      this.pos = 0;
      this.render();
      await opening.ready;
    } catch (err) {
      opening.abort();
      throw err;
    }

    const fin = await opening.open({
      spread: L.spread,
      leftHTML: L.spread ? this.pageHTML(0, 'left') : '',
      rightHTML: L.spread ? this.pageHTML(1, 'right') : this.pageHTML(0, 'single')
    });
    this.el.classList.add('is-ready');
    this.el.style.visibility = '';
    fin.reveal();
    // Mientras se lee, la página de la biblioteca no se dibuja: ahorra trabajo en cada paso de página.
    if (this.app) { this.app.style.visibility = 'hidden'; releaseApp(this.app); }
    this.startTracking();

    const p = this.book.progress;
    if (p && !p.finished && this.savedPos > 1) {
      setTimeout(() => {
        toast(`Capítulo ${p.chapter + 1}: «${this.book.chapters[p.chapter].title}»`, { title: 'Seguís donde lo dejaste', iconName: 'bookmark' });
        this.goTo(this.savedPos);
      }, 500);
    } else if (!p) {
      this.save();
    }
  }

  build() {
    const b = this.book;
    this.el = el(`<div class="reader ${this.themeClass}" lang="es" role="dialog" aria-modal="true" aria-label="Lector: ${esc(b.title)}" style="visibility:hidden">
      <div class="reader__backdrop"></div>
      <header class="reader__bar">
        <button class="rbtn rbtn--back" data-act="close" aria-label="Volver a la biblioteca">${icon('back', { size: 20 })}<span>Biblioteca</span></button>
        <div class="reader__title"><strong>${esc(b.title)}</strong><span data-chapter-label></span></div>
        <div class="reader__tools">
          <button class="rbtn" data-act="toc" aria-label="Índice" title="Índice">${icon('list')}</button>
          <button class="rbtn" data-act="info" aria-label="Información del libro" title="Información del libro">${icon('info')}</button>
          <button class="rbtn" data-act="settings" aria-label="Letra y tema" title="Letra y tema" aria-expanded="false">${icon('type')}</button>
          <button class="rbtn rbtn--fav ${b.favorite ? 'is-on' : ''}" data-act="fav" aria-pressed="${b.favorite}" aria-label="Favorito" title="Favorito">${icon('heart')}</button>
          <button class="rbtn hide-sm" data-act="fullscreen" aria-label="Pantalla completa" title="Pantalla completa">${icon('maximize')}</button>
        </div>
      </header>
      <div class="reader__stage">
        <button class="reader__side reader__side--prev" data-act="prev" aria-label="Página anterior">${icon('left', { size: 28 })}</button>
        <div class="book" data-book>
          <div class="book__slot book__slot--left" data-slot="left"></div>
          <div class="book__slot book__slot--right" data-slot="right"></div>
          <div class="book__gutter"></div>
        </div>
        <button class="reader__side reader__side--next" data-act="next" aria-label="Página siguiente">${icon('right', { size: 28 })}</button>
        <div class="page page--measure" aria-hidden="true"><div class="page__paper"><div class="page__run"></div><div class="page__content"></div><div class="page__folio">0</div></div></div>
      </div>
      <footer class="reader__foot">
        <button class="rbtn" data-act="prev" aria-label="Página anterior">${icon('left')}</button>
        <div class="reader__progress">
          <input type="range" min="0" max="1" value="0" step="1" aria-label="Ir a la página" data-slider>
          <span class="reader__pageinfo" data-pageinfo aria-live="polite"></span>
        </div>
        <button class="rbtn" data-act="next" aria-label="Página siguiente">${icon('right')}</button>
      </footer>
      <aside class="drawer" data-drawer aria-hidden="true"><div class="drawer__panel" role="navigation" aria-label="Índice del libro">
        <header><h2>${icon('list', { size: 20 })} Índice</h2><button class="rbtn" data-act="toc" aria-label="Cerrar índice">${icon('x')}</button></header>
        <ol class="drawer__list" data-toc-list></ol></div><div class="drawer__scrim" data-act="toc"></div></aside>
      <div class="popover" data-popover hidden>
        <p class="popover__label">Tamaño de letra</p>
        <div class="popover__row"><button class="rbtn" data-act="font-" aria-label="Achicar letra">A−</button><span data-font-label></span><button class="rbtn" data-act="font+" aria-label="Agrandar letra">A+</button></div>
        <p class="popover__label">Tema de lectura</p>
        <div class="popover__row">${Object.entries(THEMES).map(([k, v]) => `<button class="theme-swatch theme-swatch--${k}" data-theme="${k}" aria-pressed="${this.theme === k}">${v}</button>`).join('')}</div>
        <p class="popover__label">Animaciones</p>
        <div class="popover__row">${[['auto', 'Automáticas'], ['full', 'Completas'], ['lite', 'Livianas']].map(([k, v]) => `<button class="theme-swatch anim-opt" data-anim="${k}" aria-pressed="${animSetting() === k}">${v}</button>`).join('')}</div>
        <p class="popover__hint">Livianas: ideal para computadoras o celulares lentos.</p>
      </div>
    </div>`);
    document.body.appendChild(this.el);
    document.body.classList.add('reading');
    this.bookEl = this.el.querySelector('[data-book]');
    this.left = this.el.querySelector('[data-slot=left]');
    this.right = this.el.querySelector('[data-slot=right]');
    this.measure = this.el.querySelector('.page--measure');
    this.layoutDOM();
    this.bind();
  }

  layoutDOM() {
    const L = this.layout;
    this.el.dataset.mode = L.spread ? 'spread' : 'single';
    Object.assign(this.bookEl.style, {
      width: `${L.spread ? L.w * 2 : L.w}px`, height: `${L.h}px`,
      left: `${L.cx - (L.spread ? L.w : L.w / 2)}px`, top: `${L.cy - L.h / 2 - BAR_H}px`
    });
    Object.assign(this.measure.style, { width: `${L.w}px`, height: `${L.h}px` });
  }

  /* ------------------------------ Paginación ------------------------------ */
  /**
   * Divide el libro en páginas midiendo el espacio real. Trabaja en tramos de ~8 ms y cede el
   * turno al navegador entre tramos, para que las animaciones nunca se traben en equipos lentos.
   */
  async paginate() {
    const content = this.measure.querySelector('.page__content');
    const fits = () => content.scrollHeight <= content.clientHeight + 1;
    let slice = performance.now();
    const breathe = async () => {
      if (performance.now() - slice < 8) return;
      await new Promise((r) => setTimeout(r, 0));
      slice = performance.now();
    };
    const pages = [{ type: 'title' }, { type: 'toc' }];
    const chapterStart = [];
    for (let ci = 0; ci < this.book.chapters.length; ci++) {
      const ch = this.book.chapters[ci];
      const paras = paragraphsOf(ch.content);
      chapterStart[ci] = pages.length;
      let page = { type: 'content', chapter: ci, head: true, blocks: [], startPara: 0 };
      content.innerHTML = this.chapterHeadHTML(ch, ci);
      const newPage = (pi) => {
        pages.push(page);
        page = { type: 'content', chapter: ci, head: false, blocks: [], startPara: pi };
        content.innerHTML = '';
      };
      for (let pi = 0; pi < paras.length; pi++) {
        await breathe();
        const tokens = paras[pi];
        let start = 0;
        let guard = 0;
        while (start < tokens.length && guard++ < 500) {
          const block = { pi, s: start, e: tokens.length, cont: start > 0, first: pi === 0 && start === 0, cipher: isCipher(tokens) };
          const p = document.createElement('p');
          p.className = this.paraClass(block);
          p.innerHTML = tokensHTML(tokens, start, tokens.length);
          content.appendChild(p);
          if (fits()) { page.blocks.push(block); break; }
          let lo = start + 1;
          let hi = tokens.length - 1;
          let best = start;
          while (lo <= hi) {
            const mid = (lo + hi) >> 1;
            p.innerHTML = tokensHTML(tokens, start, mid);
            if (fits()) { best = mid; lo = mid + 1; } else hi = mid - 1;
          }
          const hasContent = page.blocks.length > 0 || page.head;
          if (block.cipher || best - start < 5) {
            // Evita líneas sueltas: el párrafo pasa completo a la página siguiente.
            if (hasContent) { content.removeChild(p); newPage(pi); continue; }
            if (best === start) best = Math.min(tokens.length, start + 8);
          }
          block.e = best;
          p.innerHTML = tokensHTML(tokens, start, best);
          page.blocks.push(block);
          start = best;
          newPage(pi);
        }
      }
      pages.push(page);
    }
    content.innerHTML = '';
    pages.push({ type: 'end' });
    if (this.layout.spread && pages.length % 2) pages.splice(pages.length - 1, 0, { type: 'blank' });
    let n = 0;
    pages.forEach((pg) => { if (pg.type === 'content') pg.num = ++n; });
    this.chapterStart = chapterStart;
    this.contentCount = n;
    this.pages = pages;
    this.paraTokens = this.book.chapters.map((c) => paragraphsOf(c.content));
    const slider = this.el.querySelector('[data-slider]');
    slider.max = String(pages.length - 1);
    slider.step = this.layout.spread ? '2' : '1';
    this.renderTOC();
  }

  paraClass(b) {
    return [b.cont && 'cont', b.first && 'first', b.cipher && 'cipher'].filter(Boolean).join(' ');
  }

  chapterHeadHTML(ch, ci) {
    return `<header class="chapter-head">
      ${ch.illustration ? `<div class="chapter-head__art">${sceneSVG(ch.illustration, this.book.cover.c1, this.book.cover.c2, { crop: true })}</div>` : ''}
      <span class="chapter-head__num">Capítulo ${ci + 1}</span><h2 class="chapter-head__title">${esc(ch.title)}</h2>
      <span class="chapter-head__orn" aria-hidden="true">✦ ✦ ✦</span></header>`;
  }

  pageHTML(i, side) {
    const p = this.pages[i];
    const b = this.book;
    const wrap = (inner, type, extra = '') => `<div class="page page--${side} page--${type}" ${extra}><div class="page__paper">${inner}</div></div>`;
    if (!p) return wrap('', 'blank');
    if (p.type === 'title') {
      return wrap(`<div class="title-page">
        <div class="title-page__art">${sceneSVG(b.cover.scene, b.cover.c1, b.cover.c2, { crop: true })}</div>
        <p class="title-page__eyebrow">Biblioteca Digital Escolar</p>
        <h1 class="title-page__title">${esc(b.title)}</h1>
        <p class="title-page__author">${esc(b.author)}</p>
        <span class="chapter-head__orn" aria-hidden="true">✦ ✦ ✦</span>
        <p class="title-page__meta">${esc(b.genres.join(' · '))}<br>${gradeLabel(b.gradeMin, b.gradeMax)}</p>
        <div class="exlibris"><span>Ex libris</span><strong>${esc(store.user?.displayName || '')}</strong></div></div>`, 'title');
    }
    if (p.type === 'toc') {
      const sp = this.savedPos > 1 && !b.progress?.finished ? this.savedPos : null;
      return wrap(`<div class="toc-page"><h2>Índice</h2><ol class="toc">
        ${b.chapters.map((c, ci) => `<li><button data-go="${this.chapterStart[ci]}"><span class="toc__num">${ci + 1}</span><span class="toc__title">${esc(c.title)}</span><span class="toc__dots"></span><span class="toc__page">${this.pages[this.chapterStart[ci]].num}</span></button></li>`).join('')}
        </ol>
        <div class="toc-page__actions">
          ${sp ? `<button class="btn btn--primary" data-go="${sp}">${icon('bookmark', { size: 16 })} Continuar en el capítulo ${b.progress.chapter + 1}</button>` : ''}
          <button class="btn ${sp ? 'btn--ghost' : 'btn--primary'}" data-go="${this.chapterStart[0]}">${icon('book', { size: 16 })} ${sp ? 'Desde el principio' : 'Comenzar a leer'}</button>
        </div>
        <p class="toc-page__hint">${icon('info', { size: 14 })} Usá las flechas, deslizá con el dedo o tocá los bordes para pasar de página.</p></div>`, 'toc');
    }
    if (p.type === 'end') {
      return wrap(`<div class="end-page">
        <span class="end-page__orn" aria-hidden="true">❦</span><h2>Fin</h2>
        <p>¡Terminaste <em>${esc(b.title)}</em>!</p>
        ${b.quizCount ? `<div class="end-page__quiz"><strong>${icon('help', { size: 18 })} ¿Cuánto recordás?</strong><span>Respondé ${b.quizCount} preguntas sobre la historia.</span>
          <button class="btn btn--primary" data-act="quiz">${b.bestQuiz ? `Mejorar mi puntaje (${b.bestQuiz.score}/${b.bestQuiz.total})` : 'Hacer el cuestionario'}</button></div>` : ''}
        <div class="end-page__actions"><button class="btn btn--ghost" data-go="0">${icon('restart', { size: 16 })} Volver al inicio</button>
        <button class="btn btn--ghost" data-act="close">${icon('library', { size: 16 })} Elegir otro libro</button></div></div>`, 'end');
    }
    if (p.type === 'blank') return wrap('<span class="blank-orn" aria-hidden="true">✦</span>', 'blank');
    const ch = b.chapters[p.chapter];
    const tokensFor = this.paraTokens[p.chapter];
    const body = p.blocks.map((bl) => `<p class="${this.paraClass(bl)}">${tokensHTML(tokensFor[bl.pi], bl.s, bl.e)}</p>`).join('');
    const run = side === 'left' ? esc(b.title) : esc(ch.title);
    return wrap(`<div class="page__run">${p.head ? '' : run}</div><div class="page__content">${p.head ? this.chapterHeadHTML(ch, p.chapter) : ''}${body}</div><div class="page__folio">${p.num}</div>`, 'content');
  }

  renderTOC() {
    const list = this.el.querySelector('[data-toc-list]');
    list.innerHTML = this.book.chapters.map((c, ci) => `<li><button data-go="${this.chapterStart[ci]}" data-ci="${ci}"><span class="toc__num">${ci + 1}</span><span class="toc__title">${esc(c.title)}</span><span class="toc__page">pág. ${this.pages[this.chapterStart[ci]].num}</span></button></li>`).join('');
  }

  /* -------------------------------- Posición -------------------------------- */
  visible() { return this.layout.spread ? [this.pos, this.pos + 1] : [this.pos]; }

  anchor() {
    const vis = this.visible().map((i) => this.pages[i]).filter(Boolean);
    const c = vis.find((p) => p.type === 'content');
    if (c) return { chapter: c.chapter, paragraph: c.blocks[0]?.pi ?? c.startPara };
    if (vis.some((p) => p.type === 'end' || p.type === 'blank')) return { chapter: this.book.chapters.length - 1, paragraph: 0, end: true };
    return { chapter: 0, paragraph: 0, start: true };
  }

  indexForAnchor({ chapter, paragraph }) {
    let found = this.chapterStart[chapter] ?? 0;
    for (let i = this.chapterStart[chapter]; i < this.pages.length; i++) {
      const p = this.pages[i];
      if (p.type !== 'content' || p.chapter !== chapter) break;
      if ((p.blocks[0]?.pi ?? p.startPara) <= paragraph) found = i; else break;
    }
    return found;
  }

  positionFromProgress(p) {
    if (!p) return 0;
    if (p.finished && p.percent >= 100) return 0;
    if (p.chapter === 0 && p.paragraph === 0 && p.page <= 1) return 0;
    return this.indexForAnchor(p);
  }

  norm(i) {
    const max = this.pages.length - 1;
    i = Math.max(0, Math.min(max, i));
    return this.layout.spread ? i - (i % 2) : i;
  }

  /* -------------------------------- Dibujo -------------------------------- */
  render() {
    if (this.layout.spread) {
      this.left.innerHTML = this.pageHTML(this.pos, 'left');
      this.right.innerHTML = this.pageHTML(this.pos + 1, 'right');
    } else {
      this.left.innerHTML = '';
      this.right.innerHTML = this.pageHTML(this.pos, 'single');
    }
    this.updateChrome();
  }

  updateChrome() {
    const vis = this.visible().map((i) => this.pages[i]).filter(Boolean);
    const content = vis.filter((p) => p.type === 'content');
    const label = this.el.querySelector('[data-chapter-label]');
    const info = this.el.querySelector('[data-pageinfo]');
    if (content.length) {
      const ch = content[0].chapter;
      label.textContent = `Capítulo ${ch + 1} · ${this.book.chapters[ch].title}`;
      const nums = content.map((p) => p.num);
      info.textContent = `Página ${nums.join('-')} de ${this.contentCount}`;
    } else if (vis.some((p) => p.type === 'end')) {
      label.textContent = 'Fin'; info.textContent = '¡Libro terminado!';
    } else {
      label.textContent = 'Portada e índice'; info.textContent = `${this.book.chapters.length} capítulos · ${this.contentCount} páginas`;
    }
    const slider = this.el.querySelector('[data-slider]');
    slider.value = String(this.pos);
    slider.style.setProperty('--fill', `${(this.pos / Math.max(1, this.pages.length - 1)) * 100}%`);
    const last = this.norm(this.pages.length - 1);
    $$('[data-act=prev]', this.el).forEach((b) => (b.disabled = this.pos === 0));
    $$('[data-act=next]', this.el).forEach((b) => (b.disabled = this.pos >= last));
    const curCh = content[0]?.chapter;
    $$('[data-ci]', this.el).forEach((b) => b.classList.toggle('is-current', Number(b.dataset.ci) === curCh));
    if (this.pos >= last) this.markFinished();
  }

  /* ------------------------------ Paso de página ------------------------------ */
  next() { this.goTo(this.pos + (this.layout.spread ? 2 : 1)); }
  prev() { this.goTo(this.pos - (this.layout.spread ? 2 : 1)); }

  async goTo(target, { animate = true } = {}) {
    target = this.norm(target);
    if (target === this.pos) return;
    if (this.busy) { this.queue = target; return; }
    this.busy = true;
    this.touch();
    const from = this.pos;
    try {
      if (!animate || reducedMotion()) {
        this.pos = target;
        this.render();
        this.bookEl.animate([{ opacity: 0.4 }, { opacity: 1 }], { duration: 180 });
      } else {
        await this.flip(from, target);
      }
    } finally {
      this.busy = false;
    }
    this.scheduleSave();
    if (this.queue !== null) { const q = this.queue; this.queue = null; this.goTo(q); }
  }

  async flip(from, to) {
    const forward = to > from;
    const spread = this.layout.spread;
    const lite = perfTier() === 'lite';
    const dur = Math.abs(to - from) > (spread ? 2 : 1) ? (lite ? 600 : 820) : (lite ? 520 : 720);
    let front;
    let back;
    let side;
    if (spread) {
      side = forward ? 'right' : 'left';
      front = forward ? this.pageHTML(from + 1, 'right') : this.pageHTML(from, 'left');
      back = forward ? this.pageHTML(to, 'left') : this.pageHTML(to + 1, 'right');
      if (forward) this.right.innerHTML = this.pageHTML(to + 1, 'right');
      else this.left.innerHTML = this.pageHTML(to, 'left');
    } else {
      side = 'single';
      front = forward ? this.pageHTML(from, 'single') : this.pageHTML(to, 'single');
      back = '<div class="page page--single page--back"><div class="page__paper"></div></div>';
      if (forward) this.right.innerHTML = this.pageHTML(to, 'single');
    }
    const leaf = el(`<div class="leaf leaf--${side}"><div class="leaf__face leaf__front">${front}<div class="leaf__shade"></div></div><div class="leaf__face leaf__back">${back}<div class="leaf__shade"></div></div></div>`);
    this.bookEl.appendChild(leaf);
    const easing = 'cubic-bezier(.42,.06,.24,1)';
    let frames;
    if (spread) frames = forward ? [{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(-90deg) translateZ(0)', offset: .5 }, { transform: 'rotateY(-180deg)' }]
      : [{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(90deg)', offset: .5 }, { transform: 'rotateY(180deg)' }];
    else frames = forward ? [{ transform: 'rotateY(0deg)', opacity: 1 }, { transform: 'rotateY(-80deg)', opacity: 1, offset: .55 }, { transform: 'rotateY(-150deg)', opacity: 0 }]
      : [{ transform: 'rotateY(-150deg)', opacity: 0 }, { transform: 'rotateY(-80deg)', opacity: 1, offset: .45 }, { transform: 'rotateY(0deg)', opacity: 1 }];
    const a = leaf.animate(frames, { duration: dur, easing, fill: 'forwards' });
    const [fs, bs] = leaf.querySelectorAll('.leaf__shade');
    fs.animate([{ opacity: 0 }, { opacity: 0.45 }], { duration: dur / 2, easing: 'ease-in', fill: 'forwards' });
    bs.animate([{ opacity: 0.45 }, { opacity: 0 }], { duration: dur / 2, delay: dur / 2, easing: 'ease-out', fill: 'both' });
    this.bookEl.classList.add('is-flipping', `is-flipping--${forward ? 'fwd' : 'back'}`);
    await a.finished.catch(() => {});
    this.pos = to;
    this.render();
    leaf.remove();
    this.bookEl.classList.remove('is-flipping', 'is-flipping--fwd', 'is-flipping--back');
  }

  /* ------------------------------ Interacción ------------------------------ */
  bind() {
    const on = (target, ev, fn, opt) => { target.addEventListener(ev, fn, opt); this.cleanup.push(() => target.removeEventListener(ev, fn, opt)); };
    on(this.el, 'click', (e) => {
      const go = e.target.closest('[data-go]');
      if (go) { this.closePanels(); return this.goTo(Number(go.dataset.go)); }
      const th = e.target.closest('[data-theme]');
      if (th) return this.setTheme(th.dataset.theme);
      const an = e.target.closest('[data-anim]');
      if (an) {
        setAnimSetting(an.dataset.anim);
        $$('[data-anim]', this.el).forEach((b) => b.setAttribute('aria-pressed', String(b === an)));
        return;
      }
      const act = e.target.closest('[data-act]')?.dataset.act;
      if (act) return this.action(act, e);
      if (this.swiped) { this.swiped = false; return; }
      // Tocar los bordes de las páginas también pasa de página.
      const page = e.target.closest('.book');
      if (page && !e.target.closest('button, a, input')) {
        const r = this.bookEl.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        if (this.layout.spread ? x > 0.5 : x > 0.6) this.next();
        else if (this.layout.spread ? x < 0.5 : x < 0.3) this.prev();
      }
      if (!e.target.closest('[data-popover], [data-act=settings]')) this.el.querySelector('[data-popover]').hidden = true;
    });
    const slider = this.el.querySelector('[data-slider]');
    on(slider, 'input', () => {
      const i = this.norm(Number(slider.value));
      const p = this.pages[i];
      this.el.querySelector('[data-pageinfo]').textContent = p?.type === 'content' ? `Ir a la página ${p.num} · Capítulo ${p.chapter + 1}` : p?.type === 'end' ? 'Ir al final' : 'Ir al índice';
    });
    on(slider, 'change', () => this.goTo(Number(slider.value)));
    on(document, 'keydown', (e) => {
      if (document.body.classList.contains('has-modal') || e.target.matches('input, textarea, select')) return;
      if (['ArrowRight', 'PageDown'].includes(e.key) || (e.key === ' ' && !e.target.closest('button'))) { e.preventDefault(); this.next(); }
      else if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); this.prev(); }
      else if (e.key === 'Home') this.goTo(0);
      else if (e.key === 'End') this.goTo(this.pages.length - 1);
      else if (e.key === 'Escape') {
        if (!this.el.querySelector('[data-drawer]').classList.contains('is-open') && this.el.querySelector('[data-popover]').hidden) this.requestClose();
        this.closePanels();
      }
    });
    let sx = 0;
    let sy = 0;
    on(this.bookEl, 'pointerdown', (e) => { sx = e.clientX; sy = e.clientY; });
    on(this.bookEl, 'pointerup', (e) => {
      const dx = e.clientX - sx;
      const dy = e.clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) { this.swiped = true; dx < 0 ? this.next() : this.prev(); }
    });
    on(window, 'resize', this.onResize = debounce(() => this.relayout(), 220));
    const vis = () => { if (document.visibilityState === 'hidden') this.save({ final: true }); };
    on(document, 'visibilitychange', vis);
    on(window, 'pagehide', () => this.save({ final: true }));
    ['pointermove', 'keydown', 'wheel', 'touchstart'].forEach((ev) => on(window, ev, () => this.touch(), { passive: true }));
  }

  async action(act) {
    switch (act) {
      case 'close': return this.requestClose();
      case 'next': return this.next();
      case 'prev': return this.prev();
      case 'toc': {
        const d = this.el.querySelector('[data-drawer]');
        const open = !d.classList.contains('is-open');
        d.classList.toggle('is-open', open);
        d.setAttribute('aria-hidden', String(!open));
        if (open) d.querySelector('.is-current, [data-go]')?.focus();
        return;
      }
      case 'info': return this.showInfo();
      case 'settings': {
        const p = this.el.querySelector('[data-popover]');
        p.hidden = !p.hidden;
        this.el.querySelector('[data-act=settings]').setAttribute('aria-expanded', String(!p.hidden));
        this.updateFontLabel();
        return;
      }
      case 'font+': case 'font-': {
        const n = this.fontStep + (act === 'font+' ? 1 : -1);
        if (n < 0 || n >= FONT_STEPS.length) return;
        this.fontStep = n;
        prefs.set('fontStep', n);
        this.updateFontLabel();
        return this.relayout(true);
      }
      case 'fav': return this.toggleFav();
      case 'fullscreen':
        if (document.fullscreenElement) document.exitFullscreen?.(); else document.documentElement.requestFullscreen?.().catch(() => toast('Tu navegador no permite pantalla completa.', { type: 'info' }));
        return;
      case 'quiz': return this.startQuiz();
      default:
    }
  }

  closePanels() {
    const d = this.el.querySelector('[data-drawer]');
    d.classList.remove('is-open');
    d.setAttribute('aria-hidden', 'true');
    this.el.querySelector('[data-popover]').hidden = true;
  }

  updateFontLabel() {
    this.el.querySelector('[data-font-label]').textContent = `${Math.round(FONT_STEPS[this.fontStep] * 100)}%`;
  }

  setTheme(t) {
    this.el.classList.remove(`rd-theme-${this.theme}`);
    this.theme = t;
    prefs.set('theme', t);
    this.el.classList.add(`rd-theme-${t}`);
    $$('[data-theme]', this.el).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.theme === t)));
  }

  /** Recalcula el tamaño y vuelve a paginar sin perder el lugar de lectura. */
  async relayout(keepFont = false) {
    if (!this.el || this.busy) return;
    const a = this.anchor();
    const prevSpread = this.layout.spread;
    this.layout = computeLayout();
    if (!keepFont && prevSpread === this.layout.spread && this.lastSize === `${this.layout.w}x${this.layout.h}`) return;
    this.lastSize = `${this.layout.w}x${this.layout.h}`;
    this.busy = true;
    this.el.classList.add('is-paginating');
    try {
      this.applyVars();
      this.layoutDOM();
      await this.paginate();
      this.pos = this.norm(a.end ? this.pages.length - 1 : a.start ? 0 : this.indexForAnchor(a));
      this.render();
    } finally {
      this.busy = false;
      this.el.classList.remove('is-paginating');
    }
  }

  async toggleFav() {
    const btn = this.el.querySelector('[data-act=fav]');
    const on = !this.book.favorite;
    try {
      const r = on ? await put(`/favorites/${this.id}`) : await del(`/favorites/${this.id}`);
      this.book.favorite = on;
      btn.classList.toggle('is-on', on);
      btn.setAttribute('aria-pressed', String(on));
      if (on) btn.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.35)' }, { transform: 'scale(1)' }], { duration: 380 });
      toast(on ? 'Guardado en tus favoritos.' : 'Quitado de tus favoritos.', { type: 'success', iconName: 'heart' });
      showAchievements(r.achievements);
    } catch (err) { errorToast(err); }
  }

  showInfo() {
    const b = this.book;
    const p = b.progress;
    const m = modal({
      title: 'Información del libro', size: 'lg',
      content: `<div class="book-info">
        <div class="book-info__cover">${coverHTML(b, { size: 'lg' })}</div>
        <div class="book-info__text">
          <h3>${esc(b.title)}</h3><p class="muted">${esc(b.author)}</p>
          <div class="chips"><span class="chip chip--s${b.section}">${gradeLabel(b.gradeMin, b.gradeMax)}</span>${b.genres.map((g) => `<span class="chip">${esc(g)}</span>`).join('')}</div>
          <p>${esc(b.synopsis)}</p>
          <dl class="facts">
            <div><dt>Capítulos</dt><dd>${b.chapters.length}</dd></div>
            <div><dt>Páginas</dt><dd>${this.contentCount}</dd></div>
            <div><dt>Lectura estimada</dt><dd>${minutesLabel(b.readingMinutes)}</dd></div>
            <div><dt>Palabras</dt><dd>${b.wordCount.toLocaleString('es-AR')}</dd></div>
            <div><dt>Tu avance</dt><dd>${p ? `${Math.round(p.percent)}%${p.finished ? ' · terminado' : ''}` : 'Recién empezás'}</dd></div>
            <div><dt>Tu tiempo</dt><dd>${minutesLabel(Math.round(((p?.secondsRead || 0) + this.seconds) / 60))}</dd></div>
          </dl>
          <p class="muted small">${icon('shield', { size: 14 })} ${esc(b.license)}.</p>
          <div class="form-actions form-actions--start">
            ${b.quizCount ? `<button class="btn btn--primary" data-i="quiz">${icon('help', { size: 16 })} Cuestionario</button>` : ''}
            <button class="btn btn--ghost" data-i="restart">${icon('restart', { size: 16 })} Empezar de nuevo</button>
          </div></div></div>`
    });
    m.node.querySelector('[data-i=quiz]')?.addEventListener('click', () => { m.close(); this.startQuiz(); });
    m.node.querySelector('[data-i=restart]').onclick = async () => {
      if (!(await confirmDialog({ title: 'Empezar de nuevo', message: 'Vas a volver a la primera página. Tu tiempo de lectura y tus logros se conservan.', confirmText: 'Empezar de nuevo' }))) return;
      try {
        await del(`/progress/${this.id}`);
        m.close();
        this.goTo(this.chapterStart[0]);
      } catch (err) { errorToast(err); }
    };
  }

  startQuiz() {
    openQuiz(this.book, { onResult: (r) => { this.book.bestQuiz = { score: Math.max(r.score, this.book.bestQuiz?.score || 0), total: r.total }; this.render(); } });
  }

  markFinished() {
    if (this.reachedEnd) return;
    this.reachedEnd = true;
    this.save();
  }

  /* ------------------------------ Guardado ------------------------------ */
  touch() { this.lastActive = Date.now(); }

  startTracking() {
    // Cuenta tiempo real de lectura: pestaña visible y actividad en los últimos 2 minutos.
    this.tick = setInterval(() => {
      if (document.visibilityState === 'visible' && Date.now() - this.lastActive < 120000) this.seconds += 5;
      if (this.seconds >= 60) this.save();
    }, 5000);
  }

  scheduleSave() {
    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => this.save(), 1200);
  }

  save({ final = false } = {}) {
    if (!this.pages.length) return Promise.resolve();
    clearTimeout(this.saveTimer);
    const a = this.anchor();
    const lastVisible = Math.min(this.pages.length - 1, this.visible().slice(-1)[0]);
    const end = this.norm(this.pages.length - 1);
    const finished = this.reachedEnd || this.pos >= end;
    const percent = finished && this.pos >= end ? 100 : Math.min(99, Math.round((lastVisible / (this.pages.length - 1)) * 100));
    const seconds = this.seconds;
    this.seconds = 0;
    const firstFinish = finished && !this.book.progress?.finished;
    const body = { chapter: a.chapter, paragraph: a.paragraph, page: this.pos, totalPages: this.pages.length, percent, seconds, finished };
    return put(`/progress/${this.id}`, body, { keepalive: final }).then((r) => {
      this.book.progress = { ...(this.book.progress || {}), chapter: a.chapter, paragraph: a.paragraph, page: this.pos, percent: Math.max(percent, this.book.progress?.percent || 0), finished: finished || !!this.book.progress?.finished, secondsRead: (this.book.progress?.secondsRead || 0) + seconds };
      if (r.finished && firstFinish && !final) this.celebrate();
      if (!final) showAchievements(r.achievements);
    }).catch((err) => {
      this.seconds += seconds;
      if (!final && err.status !== 401) toast('No pudimos guardar tu progreso. Lo intentaremos de nuevo.', { type: 'error' });
    });
  }

  celebrate() {
    toast('¡Felicitaciones! Terminaste el libro.', { type: 'achievement', title: '¡Libro terminado!', iconName: 'award' });
    if (reducedMotion()) return;
    const box = el('<div class="confetti" aria-hidden="true"></div>');
    const colors = ['#ff6f91', '#ffc93c', '#6c5ce7', '#2bb673', '#38b6ff', '#ff8c42'];
    for (let i = 0, n = perfTier() === 'lite' ? 24 : 60; i < n; i++) {
      const s = document.createElement('span');
      s.style.cssText = `left:${Math.random() * 100}%;background:${colors[i % colors.length]};animation-delay:${Math.random() * 0.6}s;animation-duration:${2 + Math.random() * 1.6}s;transform:rotate(${Math.random() * 360}deg)`;
      box.appendChild(s);
    }
    this.el.appendChild(box);
    setTimeout(() => box.remove(), 4200);
  }

  /* ------------------------------- Cierre ------------------------------- */
  requestClose() { this.onRequestClose?.(); }

  async close() {
    clearInterval(this.tick);
    this.save({ final: false }).catch(() => {});
    this.cleanup.forEach((fn) => fn());
    this.closePanels();
    const L = this.layout;
    const pageRect = L.spread
      ? { left: L.cx, top: L.cy - L.h / 2, width: L.w, height: L.h }
      : { left: L.cx - L.w / 2, top: L.cy - L.h / 2, width: L.w, height: L.h };
    const target = document.querySelector(`#app [data-book-id="${this.id}"] .cover`);
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    this.el.classList.add('is-closing');
    await playClosing({
      book: this.book, pageRect, spread: L.spread,
      leftHTML: L.spread ? this.pageHTML(this.pos, 'left') : '',
      rightHTML: L.spread ? this.pageHTML(this.pos + 1, 'right') : this.pageHTML(this.pos, 'single'),
      target, app: this.app, readerEl: this.el, className: this.themeClass
    });
    this.destroy();
  }

  destroy(failed = false) {
    clearInterval(this.tick);
    clearTimeout(this.saveTimer);
    this.cleanup.forEach((fn) => fn());
    this.cleanup = [];
    this.el?.remove();
    document.body.classList.remove('reading');
    document.documentElement.classList.remove('is-reading');
    if (this.app) this.app.style.visibility = '';
    if (failed) releaseApp(this.app);
  }
}

function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }
