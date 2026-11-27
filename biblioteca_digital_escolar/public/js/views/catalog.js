/** Explorar y páginas de sección: buscador con filtros por género, grado y orden. */
import { get } from '../api.js';
import { icon, sceneSVG } from '../art.js';
import { el, esc, debounce, SECTION_INFO } from '../ui.js';
import { bookGrid, emptyState, skeletonGrid } from '../components.js';
import { store } from '../store.js';

const SECTION_COPY = {
  1: { title: 'El Bosque de los Cuentos', lead: 'Dragones que soplan burbujas, lunas que juegan a las escondidas y semillas impacientes. Historias para empezar a volar con la imaginación.' },
  2: { title: 'La Isla de los Aventureros', lead: 'Detectives, estaciones espaciales, viajes en el tiempo y expediciones a la Antártida. ¿Te animás a explorar?' },
  3: { title: 'El Observatorio', lead: 'Terror para leer con la luz encendida, enigmas cifrados, inteligencias artificiales y naufragios. Para lectores que buscan tramas complejas.' }
};

export async function renderCatalog({ section } = {}, query = {}) {
  const sec = section ? Number(section) : null;
  const { genres } = store.meta;
  const state = { q: query.q || '', genre: query.genre || '', grade: query.grade || '', sort: query.sort || 'new' };

  const head = sec ? `<header class="section-hero section-hero--s${sec}">
      <div class="section-hero__art" aria-hidden="true">${sceneSVG(SECTION_INFO[sec].scene, SECTION_INFO[sec].c1, SECTION_INFO[sec].c2, { crop: true })}</div>
      <div class="section-hero__text"><p class="eyebrow">Sección ${sec} · ${SECTION_INFO[sec].grades} grado</p>
      <h1>${esc(SECTION_COPY[sec].title)}</h1><p>${esc(SECTION_COPY[sec].lead)}</p></div></header>`
    : `<header class="page-head"><h1>${icon('compass', { size: 30 })} Explorar la biblioteca</h1><p class="muted">Buscá por título, autor o tema, y usá los filtros para encontrar tu próxima lectura.</p></header>`;

  const node = el(`<div class="page catalog ${sec ? `theme-s${sec}` : ''}">
    ${head}
    <div class="filters" role="search">
      <label class="search"><span class="sr-only">Buscar libros</span>${icon('search')}
        <input type="search" name="q" placeholder="Buscar por título, autor o tema…" value="${esc(state.q)}" maxlength="80" autocomplete="off"></label>
      <div class="filters__row">
        ${sec ? '' : `<label class="select"><span class="sr-only">Grado</span><select name="grade"><option value="">Todos los grados</option>${[1, 2, 3, 4, 5, 6, 7].map((g) => `<option value="${g}" ${String(g) === state.grade ? 'selected' : ''}>${g}.º grado</option>`).join('')}</select></label>`}
        <label class="select"><span class="sr-only">Ordenar</span><select name="sort">
          <option value="new">Más nuevos</option><option value="popular">Más leídos</option><option value="title">Por título (A-Z)</option><option value="short">Más cortos primero</option></select></label>
      </div>
      <div class="chips chips--filter" role="group" aria-label="Filtrar por género">
        <button class="chip-btn ${state.genre ? '' : 'is-on'}" data-genre="">Todos</button>
        ${genres.map((g) => `<button class="chip-btn ${state.genre === g ? 'is-on' : ''}" data-genre="${esc(g)}">${esc(g)}</button>`).join('')}
      </div>
    </div>
    <p class="results-count muted" aria-live="polite"></p>
    <div class="results">${skeletonGrid(8)}</div>
  </div>`);

  node.querySelector('[name=sort]').value = state.sort;
  const results = node.querySelector('.results');
  const count = node.querySelector('.results-count');
  let req = 0;

  async function load() {
    const id = ++req;
    const params = new URLSearchParams();
    if (state.q) params.set('q', state.q);
    if (state.genre) params.set('genre', state.genre);
    if (state.grade) params.set('grade', state.grade);
    if (sec) params.set('section', sec);
    params.set('sort', state.sort);
    try {
      const { books } = await get(`/books?${params}`);
      if (id !== req) return;
      count.textContent = books.length ? `${books.length} ${books.length === 1 ? 'libro encontrado' : 'libros encontrados'}` : '';
      results.innerHTML = books.length ? bookGrid(books) : emptyState({
        title: 'No encontramos libros', text: 'Probá con otra palabra o quitá algún filtro.', scene: 'llave',
        action: '<button class="btn btn--ghost" data-clear>Quitar filtros</button>'
      });
      results.querySelector('[data-clear]')?.addEventListener('click', () => {
        Object.assign(state, { q: '', genre: '', grade: '' });
        node.querySelector('[name=q]').value = '';
        const g = node.querySelector('[name=grade]'); if (g) g.value = '';
        node.querySelectorAll('[data-genre]').forEach((b) => b.classList.toggle('is-on', b.dataset.genre === ''));
        sync();
      });
    } catch (err) {
      if (id === req) results.innerHTML = `<p class="form-error">${esc(err.message)}</p>`;
    }
  }
  function sync() {
    load();
  }

  node.querySelector('[name=q]').addEventListener('input', debounce((e) => { state.q = e.target.value.trim(); sync(); }, 280));
  node.querySelector('[name=sort]').onchange = (e) => { state.sort = e.target.value; sync(); };
  const gradeSel = node.querySelector('[name=grade]');
  if (gradeSel) gradeSel.onchange = (e) => { state.grade = e.target.value; sync(); };
  node.querySelectorAll('[data-genre]').forEach((b) => (b.onclick = () => {
    state.genre = b.dataset.genre;
    node.querySelectorAll('[data-genre]').forEach((x) => x.classList.toggle('is-on', x === b));
    sync();
  }));
  load();
  return node;
}
