/** Componentes reutilizables: tarjetas de libro, estantes, grillas y estados vacíos. */
import { coverHTML, icon, sceneSVG } from './art.js';
import { esc, gradeLabel } from './ui.js';

export function progressBar(percent, { label = true, className = '' } = {}) {
  const p = Math.max(0, Math.min(100, Math.round(percent || 0)));
  return `<div class="progress ${className}" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100" aria-label="Progreso de lectura">
    <div class="progress__bar" style="width:${p}%"></div></div>${label ? `<span class="progress__label">${p}%</span>` : ''}`;
}

export function favButton(book) {
  const on = !!book.favorite;
  return `<button class="fav-btn ${on ? 'is-on' : ''}" data-fav="${book.id}" aria-pressed="${on}" aria-label="${on ? 'Quitar de favoritos' : 'Agregar a favoritos'}" title="${on ? 'Quitar de favoritos' : 'Agregar a favoritos'}">${icon('heart', { size: 18 })}</button>`;
}

/** Datos mínimos de cada libro mostrado, para animar la portada antes de cargar el contenido. */
export const bookCache = new Map();

export function bookCard(book, { reason, size = 'md' } = {}) {
  bookCache.set(book.id, book);
  const p = book.progress;
  let status = '';
  if (p?.finished) status = `<div class="book-card__status is-done">${icon('check', { size: 14 })} Terminado</div>`;
  else if (p) status = `<div class="book-card__status">${progressBar(p.percent)}</div>`;
  return `<article class="book-card book-card--s${book.section}" data-book-id="${book.id}">
    <div class="book-card__cover-wrap">
      <button class="book-card__cover" data-open-book="${book.id}" aria-label="Abrir «${esc(book.title)}»">${coverHTML(book, { size })}</button>
    </div>
    <div class="book-card__body">
      <div class="book-card__head"><h3 class="book-card__title">${esc(book.title)}</h3>${favButton(book)}</div>
      <p class="book-card__author">${esc(book.author)}</p>
      <div class="chips">${isNew(book) ? '<span class="chip chip--new">Nuevo</span>' : ''}<span class="chip chip--s${book.section}">${gradeLabel(book.gradeMin, book.gradeMax)}</span><span class="chip">${esc(book.genre)}</span></div>
      ${reason ? `<p class="book-card__reason">${icon('sparkle', { size: 13 })} ${esc(reason)}</p>` : ''}
      ${status}
    </div>
  </article>`;
}

const isNew = (b) => b.createdAt && (Date.now() - new Date(b.createdAt.replace(' ', 'T') + 'Z')) < 14 * 86400000;

export function shelf({ title, subtitle, books, iconName = 'book', withReason = false, empty = '' }) {
  if (!books?.length && !empty) return '';
  return `<section class="shelf">
    <header class="shelf__head">
      <div><h2 class="shelf__title">${icon(iconName, { size: 22 })} ${esc(title)}</h2>${subtitle ? `<p class="shelf__sub">${esc(subtitle)}</p>` : ''}</div>
      ${books?.length > 3 ? `<div class="shelf__nav"><button class="icon-btn" data-scroll="-1" aria-label="Anterior">${icon('left')}</button><button class="icon-btn" data-scroll="1" aria-label="Siguiente">${icon('right')}</button></div>` : ''}
    </header>
    ${books?.length ? `<div class="shelf__track" tabindex="0" aria-label="${esc(title)}">${books.map((b) => bookCard(b, { reason: withReason ? b.reason : null })).join('')}</div>` : `<div class="empty empty--inline">${empty}</div>`}
  </section>`;
}

export function bookGrid(books) {
  return `<div class="book-grid">${books.map((b) => bookCard(b)).join('')}</div>`;
}

export function emptyState({ title, text, scene = 'bosque', action = '' }) {
  return `<div class="empty">
    <div class="empty__art">${sceneSVG(scene, '#e9e4ff', '#c9bfff', { crop: true })}</div>
    <h3>${esc(title)}</h3><p class="muted">${esc(text)}</p>${action}</div>`;
}

export function statTile({ value, label, iconName, tone = 'violet' }) {
  return `<div class="stat stat--${tone}"><span class="stat__icon">${icon(iconName, { size: 22 })}</span>
    <div><strong class="stat__value">${esc(value)}</strong><span class="stat__label">${esc(label)}</span></div></div>`;
}

export function achievementBadge(a) {
  const on = !!a.unlockedAt;
  return `<div class="badge ${on ? 'is-on' : ''}" title="${esc(a.description)}">
    <span class="badge__medal">${icon(on ? a.icon : 'lock', { size: 24 })}</span>
    <strong>${esc(a.title)}</strong><span>${esc(a.description)}</span></div>`;
}

/** Gráfico de barras simple y accesible (minutos por día). */
export function activityChart(data, { days = 14, valueKey = 'minutes', unit = 'min' } = {}) {
  const map = new Map(data.map((d) => [d.day, d[valueKey]]));
  const today = new Date();
  const rows = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400000);
    const key = d.toLocaleDateString('en-CA');
    rows.push({ key, label: d.toLocaleDateString('es-AR', { weekday: 'narrow' }), full: d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'short' }), v: map.get(key) || 0 });
  }
  const max = Math.max(5, ...rows.map((r) => r.v));
  const total = rows.reduce((n, r) => n + r.v, 0);
  return `<figure class="chart" aria-label="Actividad de los últimos ${days} días: ${total} ${unit} en total">
    <div class="chart__bars">${rows.map((r) => `<div class="chart__col" title="${esc(r.full)}: ${r.v} ${unit}">
      <span class="chart__value">${r.v || ''}</span>
      <div class="chart__bar ${r.v ? '' : 'is-zero'}" style="height:${Math.max(3, (r.v / max) * 100)}%"></div>
      <span class="chart__label">${esc(r.label)}</span></div>`).join('')}</div>
    <figcaption class="muted">Total: <strong>${total} ${unit}</strong> en los últimos ${days} días</figcaption></figure>`;
}

/** Barras horizontales con etiqueta (rankings). */
export function hBars(items, { max } = {}) {
  const m = max || Math.max(1, ...items.map((i) => i.value));
  return `<ul class="hbars">${items.map((i) => `<li><span class="hbars__label">${esc(i.label)}</span>
    <span class="hbars__track"><span class="hbars__fill" style="width:${(i.value / m) * 100}%;${i.color ? `background:${i.color}` : ''}"></span></span>
    <span class="hbars__value">${esc(i.display ?? i.value)}</span></li>`).join('')}</ul>`;
}

export const skeletonGrid = (n = 8) => `<div class="book-grid">${Array.from({ length: n }, () => '<div class="skeleton skeleton--card"></div>').join('')}</div>`;
