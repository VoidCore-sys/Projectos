/** Utilidades de interfaz: escape de HTML, notificaciones, diálogos y formatos. */
import { icon } from './art.js';

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/** Crea un elemento a partir de HTML. */
export function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------ Notificaciones ------------------------------ */
export function toast(message, { type = 'info', title, timeout = 4200, iconName } = {}) {
  const root = $('#toasts');
  const ic = iconName || { success: 'check', error: 'x', achievement: 'award', info: 'info' }[type];
  const node = el(`<div class="toast toast--${type}" role="${type === 'error' ? 'alert' : 'status'}">
    <span class="toast__icon">${icon(ic, { size: 20 })}</span>
    <div class="toast__body">${title ? `<strong>${esc(title)}</strong>` : ''}<span>${esc(message)}</span></div>
    <button class="toast__close" aria-label="Cerrar">${icon('x', { size: 16 })}</button></div>`);
  root.appendChild(node);
  const close = () => { node.classList.add('is-leaving'); setTimeout(() => node.remove(), 300); };
  node.querySelector('.toast__close').onclick = close;
  setTimeout(close, timeout);
}

export function showAchievements(list = []) {
  list.forEach((a, i) => setTimeout(() => toast(a.description, { type: 'achievement', title: `¡Logro desbloqueado: ${a.title}!`, timeout: 6000, iconName: a.icon }), i * 700));
}

export function errorToast(err) {
  toast(err?.message || 'Ocurrió un error inesperado.', { type: 'error' });
}

/* --------------------------------- Diálogos --------------------------------- */
let openModals = 0;
/**
 * Abre un diálogo modal accesible. content puede ser HTML o un nodo.
 * Devuelve { node, close }. onClose se llama al cerrar.
 */
export function modal({ title, content, size = 'md', onClose, className = '' }) {
  const lastFocus = document.activeElement;
  const node = el(`<div class="modal ${className}" role="dialog" aria-modal="true" aria-label="${esc(title)}">
    <div class="modal__backdrop"></div>
    <div class="modal__panel modal__panel--${size}">
      <header class="modal__head"><h2>${esc(title)}</h2><button class="icon-btn modal__close" aria-label="Cerrar">${icon('x')}</button></header>
      <div class="modal__body"></div>
    </div></div>`);
  const body = node.querySelector('.modal__body');
  if (typeof content === 'string') body.innerHTML = content; else if (content) body.appendChild(content);
  document.body.appendChild(node);
  openModals++;
  document.body.classList.add('has-modal');
  requestAnimationFrame(() => node.classList.add('is-open'));
  const onKey = (e) => {
    if (e.key === 'Escape') { e.stopPropagation(); close(); }
    if (e.key === 'Tab') trapFocus(e, node);
  };
  node.addEventListener('keydown', onKey);
  let closed = false;
  function close(result) {
    if (closed) return;
    closed = true;
    node.classList.remove('is-open');
    setTimeout(() => node.remove(), 250);
    if (--openModals <= 0) { openModals = 0; document.body.classList.remove('has-modal'); }
    lastFocus?.focus?.();
    onClose?.(result);
  }
  node.querySelector('.modal__close').onclick = () => close();
  node.querySelector('.modal__backdrop').onclick = () => close();
  setTimeout(() => (node.querySelector('[autofocus], input, select, textarea, button:not(.modal__close)') || node.querySelector('.modal__close')).focus(), 60);
  return { node, body, close };
}

function trapFocus(e, root) {
  const f = $$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', root).filter((x) => !x.disabled && x.offsetParent !== null);
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

export function confirmDialog({ title = '¿Estás seguro?', message, confirmText = 'Confirmar', danger = false }) {
  return new Promise((resolve) => {
    const m = modal({
      title,
      size: 'sm',
      content: `<p class="muted">${esc(message)}</p>
        <div class="form-actions"><button class="btn btn--ghost" data-act="no">Cancelar</button>
        <button class="btn ${danger ? 'btn--danger' : 'btn--primary'}" data-act="yes">${esc(confirmText)}</button></div>`,
      onClose: (r) => resolve(r === true)
    });
    m.node.querySelector('[data-act="no"]').onclick = () => m.close(false);
    m.node.querySelector('[data-act="yes"]').onclick = () => m.close(true);
  });
}

/* --------------------------------- Formularios --------------------------------- */
/** Muestra los errores por campo que devuelve la API. */
export function showFieldErrors(form, err) {
  $$('.field-error', form).forEach((n) => n.remove());
  $$('.is-invalid', form).forEach((n) => n.classList.remove('is-invalid'));
  const fields = err?.fields || {};
  let first = null;
  for (const [name, msg] of Object.entries(fields)) {
    const input = form.querySelector(`[name="${CSS.escape(name)}"]`);
    if (!input) continue;
    input.classList.add('is-invalid');
    input.setAttribute('aria-invalid', 'true');
    const wrap = input.closest('.field') || input.parentElement;
    wrap.appendChild(el(`<p class="field-error">${esc(msg)}</p>`));
    first ||= input;
  }
  if (first) first.focus();
  const general = form.querySelector('.form-error');
  if (general) {
    general.textContent = Object.keys(fields).length ? '' : (err?.message || '');
    general.hidden = !general.textContent;
  }
}

export function clearFieldErrors(form) { showFieldErrors(form, { fields: {} }); }

export function setBusy(button, busy, text) {
  if (!button) return;
  if (busy) {
    button.dataset.label = button.innerHTML;
    button.disabled = true;
    button.innerHTML = `<span class="spinner"></span>${text ? ` ${esc(text)}` : ''}`;
  } else {
    button.disabled = false;
    if (button.dataset.label) button.innerHTML = button.dataset.label;
  }
}

/* --------------------------------- Formatos --------------------------------- */
const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });
export function timeAgo(sqlDate) {
  if (!sqlDate) return 'nunca';
  const d = new Date(sqlDate.replace(' ', 'T') + 'Z');
  const diff = (d - Date.now()) / 1000;
  const abs = Math.abs(diff);
  if (abs < 60) return 'hace un momento';
  if (abs < 3600) return rtf.format(Math.round(diff / 60), 'minute');
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
  if (abs < 86400 * 30) return rtf.format(Math.round(diff / 86400), 'day');
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
}
export const fmtDate = (sqlDate) => sqlDate ? new Date(sqlDate.replace(' ', 'T') + 'Z').toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';
export const minutesLabel = (m) => m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${m % 60 ? `${m % 60} min` : ''}`.trim();
export const gradeLabel = (min, max) => min === max ? `${min}.º grado` : `${min}.º a ${max}.º grado`;
export const debounce = (fn, ms = 300) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

export const SECTION_INFO = {
  1: { name: 'El Bosque de los Cuentos', short: 'Bosque', grades: '1.º a 3.º', scene: 'bosque', c1: '#9be15d', c2: '#1f9d6b' },
  2: { name: 'La Isla de los Aventureros', short: 'Isla', grades: '4.º y 5.º', scene: 'isla', c1: '#ffcf71', c2: '#ff7b54' },
  3: { name: 'El Observatorio', short: 'Observatorio', grades: '6.º y 7.º', scene: 'ciudad', c1: '#6c5ce7', c2: '#1d1b4c' }
};
