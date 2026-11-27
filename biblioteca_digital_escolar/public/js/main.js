/** Punto de entrada: sesión, estructura general, navegación y acciones globales. */
import { get, post, put, del, setUnauthorizedHandler } from './api.js';
import { avatarSVG, icon, LOGO } from './art.js';
import { el, esc, toast, errorToast, showAchievements, $ } from './ui.js';
import { store, isStaff, isAdmin } from './store.js';
import { bookCache, progressBar } from './components.js';
import { renderAuth } from './views/auth.js';
import { renderHome } from './views/home.js';
import { renderCatalog } from './views/catalog.js';
import { renderProfile } from './views/profile.js';
import { renderPanel } from './views/panel.js';
import { renderEditor } from './views/editor.js';
import { openReader, closeReader, isReaderOpen } from './reader/reader.js';
import { applyTierClass, whenIdle } from './perf.js';

const app = $('#app');
let viewKey = null;
let lastViewHash = '#inicio';
let pendingSource = null;

/* ------------------------------- Rutas ------------------------------- */
// Rutas con nombres simples en el "#" (compatibles con el visor de artifacts).
const ROUTES = [
  [/^(inicio)?$/, () => ({ name: 'home', render: renderHome })],
  [/^explorar$/, () => ({ name: 'explore', render: renderCatalog })],
  [/^seccion-([1-3])$/, (m) => ({ name: 'section', params: { section: m[1] }, render: renderCatalog })],
  [/^perfil$/, () => ({ name: 'profile', render: renderProfile })],
  [/^favoritos$/, () => ({ name: 'profile', render: renderProfile, query: { tab: 'favoritos' } })],
  [/^libro-(nuevo|\d+)$/, (m) => ({ name: 'editor', params: { id: m[1] }, render: renderEditor, staff: true })],
  [/^panel(?:-(resumen|alumnos|libros|usuarios))?$/, (m) => ({ name: 'panel', params: { tab: m[1] || 'resumen' }, render: renderPanel, staff: true })],
  [/^leer-(\d+)$/, (m) => ({ name: 'reader', params: { id: Number(m[1]) } })],
  [/^(ingresar|registro)$/, (m) => ({ name: 'auth', params: { mode: m[1] === 'registro' ? 'register' : 'login' } })]
];

function parseHash() {
  return resolve(decodeURIComponent(location.hash.replace(/^#/, '')).split('?')[0]);
}

function resolve(path, query = {}) {
  for (const [re, make] of ROUTES) {
    const m = path.match(re);
    if (m) { const r = make(m); return { query, ...r, path, key: path }; }
  }
  return { name: 'notfound', path, query, key: path };
}

async function router() {
  const r = parseHash();
  if (!store.user) {
    viewKey = null;
    return showAuth(r.name === 'auth' ? r.params.mode : 'login');
  }
  if (r.name === 'auth') return location.replace('#inicio');

  if (r.name === 'reader') {
    if (!viewKey) await renderView(resolve(''));
    if (!isReaderOpen()) {
      const source = pendingSource;
      pendingSource = null;
      openReader(r.params.id, { source, app, onRequestClose: requestReaderClose });
    }
    return;
  }
  if (isReaderOpen()) {
    const closedId = await closeReader();
    if (viewKey !== r.key) { await renderView(r); return; }
    // Se actualizan sólo las tarjetas del libro cerrado, y cuando el equipo queda libre.
    lastViewHash = location.hash || '#inicio';
    whenIdle(() => refreshBookCards(closedId));
    return;
  }
  lastViewHash = location.hash || '#inicio';
  await renderView(r);
}

function requestReaderClose() {
  location.replace(lastViewHash || '#inicio');
}

/** Actualiza progreso y favorito de un libro en las tarjetas visibles, sin redibujar la vista entera. */
async function refreshBookCards(id) {
  if (!id || isReaderOpen()) return;
  let book;
  try { ({ book } = await get(`/books/${id}`)); } catch { return; }
  const p = book.progress;
  document.querySelectorAll(`#view [data-book-id="${id}"]`).forEach((card) => {
    card.querySelectorAll('[data-fav]').forEach((b) => {
      b.classList.toggle('is-on', book.favorite);
      b.setAttribute('aria-pressed', String(book.favorite));
    });
    const status = card.querySelector('.book-card__status');
    const html = p?.finished ? `<div class="book-card__status is-done">${icon('check', { size: 14 })} Terminado</div>`
      : p ? `<div class="book-card__status">${progressBar(p.percent)}</div>` : '';
    if (status) status.outerHTML = html || '';
    else if (html && card.querySelector('.book-card__body')) card.querySelector('.book-card__body').insertAdjacentHTML('beforeend', html);
    const cont = card.querySelector('.continue__progress');
    if (cont && p) cont.innerHTML = progressBar(p.percent);
  });
}

let renderSeq = 0;
async function renderView(r, { keepScroll = false } = {}) {
  const seq = ++renderSeq;
  const main = $('#view');
  if (r.staff && !isStaff()) return renderError({ title: 'Acceso restringido', text: 'Esta sección es sólo para docentes y administración.' });
  if (r.name === 'notfound') return renderError({ title: 'Página no encontrada', text: 'La página que buscás no existe o se mudó de estante.' });
  const scroll = window.scrollY;
  if (!keepScroll) main.setAttribute('aria-busy', 'true');
  try {
    const node = await r.render(r.params || {}, r.query || {});
    if (seq !== renderSeq) return;
    main.replaceChildren(node);
    viewKey = r.key;
    lastViewHash = `#${r.path || 'inicio'}`;
    highlightNav(r);
    document.title = `${titleFor(r)} · Biblioteca Digital Escolar`;
    window.scrollTo(0, keepScroll ? scroll : 0);
    if (!keepScroll) node.classList.add('page--enter');
  } catch (err) {
    if (seq !== renderSeq) return;
    if (err.status === 401) return;
    renderError({ title: 'No pudimos cargar esta página', text: err.message, retry: true });
  } finally {
    main.removeAttribute('aria-busy');
  }
}

function renderError({ title, text, retry }) {
  viewKey = null;
  $('#view').replaceChildren(el(`<div class="page center-page"><div class="empty"><h2>${esc(title)}</h2><p class="muted">${esc(text)}</p>
    <div class="form-actions form-actions--center">${retry ? '<button class="btn btn--primary" data-retry>Reintentar</button>' : ''}<a class="btn btn--ghost" href="#inicio">Ir al inicio</a></div></div></div>`));
  $('#view [data-retry]')?.addEventListener('click', router);
}

const titleFor = (r) => ({ home: 'Inicio', explore: 'Explorar', section: 'Sección', profile: 'Mi perfil', panel: 'Panel', editor: 'Editor de libros' }[r.name] || 'Biblioteca');

/* ------------------------------- Estructura ------------------------------- */
function renderShell() {
  const u = store.user;
  const staffLink = isStaff() ? [{ href: '#panel', name: 'panel', label: isAdmin() ? 'Administración' : 'Panel docente', iconName: 'grid' }] : [];
  const links = [
    { href: '#inicio', name: 'home', label: 'Inicio', iconName: 'home' },
    { href: '#explorar', name: 'explore', label: 'Explorar', iconName: 'compass' },
    { href: '#perfil', name: 'profile', label: 'Mi perfil', iconName: 'user' },
    ...staffLink
  ];
  app.innerHTML = `
    <a class="skip-link" href="#view">Saltar al contenido</a>
    <header class="topbar">
      <a class="brand" href="#inicio" aria-label="Biblioteca Digital Escolar, inicio">${LOGO}<span>Biblioteca<b>Digital Escolar</b></span></a>
      <nav class="topnav" aria-label="Principal">${links.map((l) => `<a href="${l.href}" data-nav="${l.name}">${icon(l.iconName, { size: 18 })}<span>${l.label}</span></a>`).join('')}</nav>
      <div class="topbar__right">
        <a class="icon-btn" href="#explorar" aria-label="Buscar libros" title="Buscar">${icon('search')}</a>
        <div class="usermenu">
          <button class="usermenu__btn" aria-haspopup="menu" aria-expanded="false">${avatarSVG(u.avatar, 36)}<span class="usermenu__name">${esc(u.displayName)}</span>${icon('down', { size: 16 })}</button>
          <div class="usermenu__menu" role="menu" hidden>
            <div class="usermenu__head">${avatarSVG(u.avatar, 44)}<div><strong>${esc(u.displayName)}</strong><span class="muted small">@${esc(u.username)}</span></div></div>
            <a role="menuitem" href="#perfil">${icon('user', { size: 18 })} Mi perfil</a>
            <a role="menuitem" href="#favoritos">${icon('heart', { size: 18 })} Mis favoritos</a>
            ${staffLink.map((l) => `<a role="menuitem" href="${l.href}">${icon('grid', { size: 18 })} ${l.label}</a>`).join('')}
            <button role="menuitem" data-logout>${icon('logout', { size: 18 })} Cerrar sesión</button>
          </div>
        </div>
      </div>
    </header>
    <main id="view" tabindex="-1"></main>
    <footer class="sitefoot"><p>${LOGO} Biblioteca Digital Escolar · Proyecto educativo para escuela primaria · Todas las historias son obras originales.</p></footer>
    <nav class="tabbar" aria-label="Navegación inferior">${links.map((l) => `<a href="${l.href}" data-nav="${l.name}">${icon(l.iconName, { size: 22 })}<span>${l.label.replace('Panel docente', 'Panel').replace('Administración', 'Admin')}</span></a>`).join('')}</nav>`;

  const btn = $('.usermenu__btn');
  const menu = $('.usermenu__menu');
  const toggle = (open) => { menu.hidden = !open; btn.setAttribute('aria-expanded', String(open)); };
  btn.onclick = (e) => { e.stopPropagation(); toggle(menu.hidden); };
  document.addEventListener('click', (e) => { if (!e.target.closest('.usermenu')) toggle(false); });
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) toggle(false); });
  $('[data-logout]').onclick = logout;
}

function highlightNav(r) {
  const name = r.name === 'section' ? 'explore' : r.name === 'editor' ? 'panel' : r.name;
  document.querySelectorAll('[data-nav]').forEach((a) => {
    const on = a.dataset.nav === name;
    a.classList.toggle('is-active', on);
    if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
}

function showAuth(mode) {
  document.body.classList.add('is-auth');
  app.replaceChildren(renderAuth(mode, async (user, isNew) => {
    store.set({ user });
    document.body.classList.remove('is-auth');
    await loadMeta();
    renderShell();
    if (['#ingresar', '#registro', ''].includes(location.hash)) location.replace('#inicio');
    await router();
    toast(isNew ? '¡Tu cuenta está lista! Ya podés empezar a leer.' : `¡Qué bueno verte, ${user.displayName}!`, { type: 'success', title: isNew ? '¡Bienvenido/a!' : undefined });
  }));
  document.title = 'Ingresar · Biblioteca Digital Escolar';
}

async function logout() {
  try { await closeReader(); await post('/auth/logout'); } catch { /* se cierra igual */ }
  store.set({ user: null });
  viewKey = null;
  location.replace('#ingresar');
  toast('Cerraste sesión. ¡Hasta pronto!', { type: 'info' });
}

async function loadMeta() {
  store.set({ meta: await get('/meta') });
}

/* --------------------------- Acciones globales --------------------------- */
document.addEventListener('click', async (e) => {
  const open = e.target.closest('[data-open-book]');
  if (open) {
    e.preventDefault();
    const card = open.closest('[data-book-id]');
    const src = open.dataset.source ? card?.querySelector(open.dataset.source) : open;
    pendingSource = src?.querySelector('.cover') || src;
    location.replace(`#leer-${open.dataset.openBook}`);
    return;
  }
  const fav = e.target.closest('[data-fav]');
  if (fav) {
    e.preventDefault();
    const id = Number(fav.dataset.fav);
    const on = !fav.classList.contains('is-on');
    fav.disabled = true;
    try {
      const r = on ? await put(`/favorites/${id}`) : await del(`/favorites/${id}`);
      document.querySelectorAll(`[data-fav="${id}"]`).forEach((b) => {
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', String(on));
        b.setAttribute('aria-label', on ? 'Quitar de favoritos' : 'Agregar a favoritos');
      });
      const cached = bookCache.get(id); if (cached) cached.favorite = on;
      if (on) fav.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.4)' }, { transform: 'scale(1)' }], { duration: 360 });
      toast(on ? 'Guardado en tus favoritos.' : 'Quitado de tus favoritos.', { type: 'success', iconName: 'heart', timeout: 2500 });
      showAchievements(r.achievements);
    } catch (err) { errorToast(err); } finally { fav.disabled = false; }
    return;
  }
  const sc = e.target.closest('[data-scroll]');
  if (sc) {
    const track = sc.closest('.shelf').querySelector('.shelf__track');
    track.scrollBy({ left: Number(sc.dataset.scroll) * track.clientWidth * 0.85, behavior: 'smooth' });
  }
});

setUnauthorizedHandler(() => {
  if (!store.user) return;
  store.set({ user: null });
  closeReader();
  toast('Tu sesión terminó. Volvé a ingresar para seguir leyendo.', { type: 'info' });
  location.replace('#ingresar');
  router();
});

window.addEventListener('hashchange', router);

/* -------------------------------- Inicio -------------------------------- */
(async function boot() {
  applyTierClass();
  try {
    const me = await get('/auth/me');
    store.set({ user: me.user, config: { registration: me.registration, schoolCodeRequired: me.schoolCodeRequired, demoAccounts: me.demoAccounts, storage: me.storage } });
    if (me.user) { await loadMeta(); renderShell(); }
  } catch (err) {
    app.innerHTML = `<div class="page center-page"><div class="empty"><h2>No pudimos conectar con la biblioteca</h2><p class="muted">${esc(err.message)}</p><button class="btn btn--primary" data-reload>Reintentar</button></div></div>`;
    app.querySelector('[data-reload]').onclick = () => location.reload();
    return;
  } finally {
    document.body.classList.remove('is-loading');
  }
  router();
})();
