/** Editor para publicar y modificar libros (docentes y administración). */
import { get, post, put } from '../api.js';
import { coverHTML, icon, SCENE_NAMES, sceneSVG } from '../art.js';
import { el, esc, toast, showFieldErrors, setBusy, confirmDialog } from '../ui.js';
import { store, isAdmin } from '../store.js';

const blank = () => ({
  title: '', author: store.user.displayName, synopsis: '', genres: [], gradeMin: 1, gradeMax: 3, status: 'draft', featured: false,
  cover: { scene: 'bosque', c1: '#9be15d', c2: '#1f9d6b' },
  chapters: [{ title: 'Capítulo 1', illustration: 'bosque', content: '' }],
  quiz: []
});

export async function renderEditor({ id }) {
  const isNew = id === 'nuevo';
  const book = isNew ? blank() : (await get(`/manage/books/${id}`)).book;
  const { genres } = store.meta;
  let dirty = false;

  const node = el(`<div class="page editor">
    <header class="page-head page-head--row">
      <div><a class="back-link" href="#panel-libros">${icon('back', { size: 16 })} Volver a los libros</a>
      <h1>${isNew ? 'Publicar un libro nuevo' : `Editar «${esc(book.title)}»`}</h1></div>
    </header>
    <form class="form editor__form" novalidate>
      <div class="editor__grid">
        <section class="card stack">
          <h2 class="card__title">${icon('info', { size: 20 })} Datos del libro</h2>
          <div class="field"><label for="ed-title">Título</label><input id="ed-title" name="title" required maxlength="90"></div>
          <div class="field"><label for="ed-author">Autor o autora</label><input id="ed-author" name="author" required maxlength="80"></div>
          <div class="field"><label for="ed-syn">Sinopsis</label><textarea id="ed-syn" name="synopsis" rows="4" maxlength="700" required></textarea><p class="muted small"><span data-count="synopsis">0</span>/700 caracteres (mínimo 20)</p></div>
          <fieldset class="field"><legend>Géneros (hasta 4; el primero es el principal)</legend>
            <input type="hidden" name="genres"><div class="chips chips--filter" data-genres>${genres.map((g) => `<button type="button" class="chip-btn" data-g="${esc(g)}">${esc(g)}</button>`).join('')}</div></fieldset>
          <div class="form-row">
            <div class="field"><label for="ed-gmin">Desde grado</label><select id="ed-gmin" name="gradeMin">${[1, 2, 3, 4, 5, 6, 7].map((g) => `<option value="${g}">${g}.º</option>`).join('')}</select></div>
            <div class="field"><label for="ed-gmax">Hasta grado</label><select id="ed-gmax" name="gradeMax">${[1, 2, 3, 4, 5, 6, 7].map((g) => `<option value="${g}">${g}.º</option>`).join('')}</select></div>
            <div class="field"><label for="ed-status">Estado</label><select id="ed-status" name="status"><option value="published">Publicado</option><option value="draft">Borrador (oculto)</option></select></div>
          </div>
          ${isAdmin() ? '<label class="check"><input type="checkbox" name="featured"> Mostrar en "Destacados"</label>' : ''}
          <p class="muted small" data-section-hint></p>
        </section>
        <section class="card stack">
          <h2 class="card__title">${icon('star', { size: 20 })} Portada</h2>
          <div class="cover-editor">
            <div class="cover-editor__preview" data-preview></div>
            <div class="stack">
              <div class="form-row"><div class="field"><label for="ed-c1">Color superior</label><input id="ed-c1" type="color" name="c1"></div>
              <div class="field"><label for="ed-c2">Color inferior</label><input id="ed-c2" type="color" name="c2"></div></div>
              <input type="hidden" name="cover">
              <div class="scene-pick" role="radiogroup" aria-label="Ilustración">${Object.entries(SCENE_NAMES).map(([k, n]) => `<button type="button" class="scene-opt" data-scene="${k}" role="radio" title="${esc(n)}" aria-label="${esc(n)}">${sceneSVG(k, '#c9bfff', '#7b6cff', { crop: true })}</button>`).join('')}</div>
            </div>
          </div>
        </section>
      </div>

      <section class="card stack">
        <div class="card__title-row"><h2 class="card__title">${icon('book', { size: 20 })} Capítulos</h2><button type="button" class="btn btn--ghost btn--sm" data-add-chapter>${icon('plus', { size: 16 })} Agregar capítulo</button></div>
        <p class="muted small">Separá los párrafos con una línea en blanco. Para los diálogos usá la raya (—).</p>
        <input type="hidden" name="chapters"><div class="chapters" data-chapters></div>
      </section>

      <section class="card stack">
        <div class="card__title-row"><h2 class="card__title">${icon('help', { size: 20 })} Cuestionario de comprensión</h2><button type="button" class="btn btn--ghost btn--sm" data-add-q>${icon('plus', { size: 16 })} Agregar pregunta</button></div>
        <p class="muted small">Opcional. Los alumnos lo responden al terminar el libro. Marcá la opción correcta.</p>
        <input type="hidden" name="quiz"><div class="questions" data-questions></div>
      </section>

      <p class="form-error" role="alert" hidden></p>
      <div class="editor__bar"><a class="btn btn--ghost" href="#panel-libros">Cancelar</a><button class="btn btn--primary btn--lg" type="submit">${icon('check', { size: 18 })} ${isNew ? 'Guardar libro' : 'Guardar cambios'}</button></div>
    </form></div>`);

  const f = node.querySelector('form');
  const $f = (n) => f.querySelector(`[name="${n}"]`);
  $f('title').value = book.title; $f('author').value = book.author; $f('synopsis').value = book.synopsis;
  $f('gradeMin').value = book.gradeMin; $f('gradeMax').value = book.gradeMax; $f('status').value = book.status;
  if ($f('featured')) $f('featured').checked = book.featured;
  $f('c1').value = book.cover.c1; $f('c2').value = book.cover.c2;

  const state = { genres: [...book.genres], scene: book.cover.scene, chapters: book.chapters.map((c) => ({ ...c })), quiz: book.quiz.map((q) => ({ ...q, options: [...q.options] })) };

  const sectionHint = () => {
    const g = Number($f('gradeMin').value);
    const s = g <= 3 ? 'El Bosque de los Cuentos' : g <= 5 ? 'La Isla de los Aventureros' : 'El Observatorio';
    node.querySelector('[data-section-hint]').innerHTML = `${icon('map', { size: 14 })} Se publicará en la sección <strong>${s}</strong>.`;
  };
  const preview = () => {
    const g = Number($f('gradeMin').value);
    node.querySelector('[data-preview]').innerHTML = coverHTML({ title: $f('title').value || 'Título del libro', author: $f('author').value || 'Autor', section: g <= 3 ? 1 : g <= 5 ? 2 : 3, cover: { scene: state.scene, c1: $f('c1').value, c2: $f('c2').value } }, { size: 'lg' });
    node.querySelectorAll('[data-scene]').forEach((b) => { b.classList.toggle('is-on', b.dataset.scene === state.scene); b.setAttribute('aria-checked', b.dataset.scene === state.scene); });
  };
  const drawGenres = () => node.querySelectorAll('[data-g]').forEach((b) => {
    const i = state.genres.indexOf(b.dataset.g);
    b.classList.toggle('is-on', i >= 0);
    b.dataset.order = i >= 0 ? i + 1 : '';
  });

  const chaptersEl = node.querySelector('[data-chapters]');
  const sceneOptions = (sel) => Object.entries(SCENE_NAMES).map(([k, n]) => `<option value="${k}" ${sel === k ? 'selected' : ''}>${esc(n)}</option>`).join('');
  const drawChapters = () => {
    chaptersEl.innerHTML = state.chapters.map((c, i) => `<div class="chapter-edit" data-i="${i}">
      <div class="chapter-edit__head"><span class="chapter-edit__num">${i + 1}</span>
        <div class="field grow"><label class="sr-only" for="ch-t-${i}">Título del capítulo ${i + 1}</label><input id="ch-t-${i}" name="chapters.${i}.title" data-k="title" value="${esc(c.title)}" maxlength="100" placeholder="Título del capítulo"></div>
        <div class="field"><label class="sr-only" for="ch-il-${i}">Ilustración</label><select id="ch-il-${i}" data-k="illustration"><option value="">Sin ilustración</option>${sceneOptions(c.illustration)}</select></div>
        <div class="chapter-edit__tools">
          <button type="button" class="icon-btn" data-move="-1" aria-label="Subir capítulo" ${i === 0 ? 'disabled' : ''}>${icon('up', { size: 18 })}</button>
          <button type="button" class="icon-btn" data-move="1" aria-label="Bajar capítulo" ${i === state.chapters.length - 1 ? 'disabled' : ''}>${icon('down', { size: 18 })}</button>
          <button type="button" class="icon-btn icon-btn--danger" data-remove aria-label="Eliminar capítulo" ${state.chapters.length === 1 ? 'disabled' : ''}>${icon('trash', { size: 18 })}</button></div></div>
      <div class="field"><label class="sr-only" for="ch-c-${i}">Texto del capítulo ${i + 1}</label><textarea id="ch-c-${i}" name="chapters.${i}.content" data-k="content" rows="9" placeholder="Escribí aquí el texto del capítulo…">${esc(c.content)}</textarea>
      <p class="muted small">${(c.content.match(/\S+/g) || []).length} palabras</p></div></div>`).join('');
  };
  chaptersEl.addEventListener('input', (e) => {
    const box = e.target.closest('[data-i]'); if (!box || !e.target.dataset.k) return;
    state.chapters[Number(box.dataset.i)][e.target.dataset.k] = e.target.value || (e.target.dataset.k === 'illustration' ? null : '');
    if (e.target.dataset.k === 'content') box.querySelector('.small').textContent = `${(e.target.value.match(/\S+/g) || []).length} palabras`;
  });
  chaptersEl.addEventListener('change', (e) => { if (e.target.dataset.k === 'illustration') state.chapters[Number(e.target.closest('[data-i]').dataset.i)].illustration = e.target.value || null; });
  chaptersEl.addEventListener('click', async (e) => {
    const box = e.target.closest('[data-i]'); if (!box) return;
    const i = Number(box.dataset.i);
    const mv = e.target.closest('[data-move]');
    if (mv) { const j = i + Number(mv.dataset.move); [state.chapters[i], state.chapters[j]] = [state.chapters[j], state.chapters[i]]; drawChapters(); }
    if (e.target.closest('[data-remove]') && await confirmDialog({ title: 'Eliminar capítulo', message: `¿Eliminar el capítulo ${i + 1}?`, confirmText: 'Eliminar', danger: true })) { state.chapters.splice(i, 1); drawChapters(); }
  });
  node.querySelector('[data-add-chapter]').onclick = () => {
    state.chapters.push({ title: `Capítulo ${state.chapters.length + 1}`, illustration: state.scene, content: '' });
    drawChapters();
    chaptersEl.lastElementChild.querySelector('textarea').focus();
  };

  const qEl = node.querySelector('[data-questions]');
  const drawQuiz = () => {
    qEl.innerHTML = state.quiz.length ? state.quiz.map((q, i) => `<div class="question-edit" data-i="${i}">
      <div class="chapter-edit__head"><span class="chapter-edit__num">${i + 1}</span>
        <div class="field grow"><label class="sr-only" for="q-${i}">Pregunta ${i + 1}</label><input id="q-${i}" name="quiz.${i}.question" data-k="question" value="${esc(q.question)}" maxlength="300" placeholder="Escribí la pregunta"></div>
        <button type="button" class="icon-btn icon-btn--danger" data-remove aria-label="Eliminar pregunta">${icon('trash', { size: 18 })}</button></div>
      <div class="options" role="radiogroup" aria-label="Opciones de la pregunta ${i + 1}">${q.options.map((o, j) => `<div class="option-edit">
        <input type="radio" name="quiz.${i}.correct" value="${j}" ${q.correct === j ? 'checked' : ''} aria-label="Marcar opción ${j + 1} como correcta">
        <input name="quiz.${i}.options" data-opt="${j}" value="${esc(o)}" maxlength="200" placeholder="Opción ${j + 1}">
        ${q.options.length > 2 ? `<button type="button" class="icon-btn" data-del-opt="${j}" aria-label="Quitar opción">${icon('x', { size: 16 })}</button>` : ''}</div>`).join('')}
        ${q.options.length < 5 ? `<button type="button" class="btn btn--ghost btn--sm" data-add-opt>${icon('plus', { size: 14 })} Opción</button>` : ''}</div>
      <div class="field"><label class="sr-only" for="qx-${i}">Explicación</label><input id="qx-${i}" data-k="explanation" value="${esc(q.explanation || '')}" maxlength="400" placeholder="Explicación de la respuesta (opcional)"></div></div>`).join('')
      : '<p class="muted">Este libro todavía no tiene preguntas.</p>';
  };
  qEl.addEventListener('input', (e) => {
    const box = e.target.closest('[data-i]'); if (!box) return;
    const q = state.quiz[Number(box.dataset.i)];
    if (e.target.dataset.k) q[e.target.dataset.k] = e.target.value;
    if (e.target.dataset.opt !== undefined) q.options[Number(e.target.dataset.opt)] = e.target.value;
  });
  qEl.addEventListener('change', (e) => { if (e.target.type === 'radio') state.quiz[Number(e.target.closest('[data-i]').dataset.i)].correct = Number(e.target.value); });
  qEl.addEventListener('click', (e) => {
    const box = e.target.closest('[data-i]'); if (!box) return;
    const q = state.quiz[Number(box.dataset.i)];
    if (e.target.closest('[data-remove]')) state.quiz.splice(Number(box.dataset.i), 1);
    else if (e.target.closest('[data-add-opt]')) q.options.push('');
    else if (e.target.closest('[data-del-opt]')) { const j = Number(e.target.closest('[data-del-opt]').dataset.delOpt); q.options.splice(j, 1); if (q.correct >= q.options.length) q.correct = 0; }
    else return;
    drawQuiz();
  });
  node.querySelector('[data-add-q]').onclick = () => { state.quiz.push({ question: '', options: ['', '', ''], correct: 0, explanation: '' }); drawQuiz(); qEl.lastElementChild.querySelector('input').focus(); };

  node.querySelectorAll('[data-g]').forEach((b) => (b.onclick = () => {
    const g = b.dataset.g; const i = state.genres.indexOf(g);
    if (i >= 0) state.genres.splice(i, 1); else if (state.genres.length < 4) state.genres.push(g); else toast('Podés elegir hasta 4 géneros.', { type: 'info' });
    drawGenres();
  }));
  node.querySelectorAll('[data-scene]').forEach((b) => (b.onclick = () => { state.scene = b.dataset.scene; preview(); }));
  ['title', 'author', 'c1', 'c2'].forEach((n) => $f(n).addEventListener('input', preview));
  $f('gradeMin').onchange = () => { if (Number($f('gradeMax').value) < Number($f('gradeMin').value)) $f('gradeMax').value = $f('gradeMin').value; sectionHint(); preview(); };
  const syn = $f('synopsis');
  const synCount = () => { node.querySelector('[data-count=synopsis]').textContent = syn.value.length; };
  syn.addEventListener('input', synCount);
  f.addEventListener('input', () => { dirty = true; });

  f.onsubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: $f('title').value, author: $f('author').value, synopsis: syn.value, genres: state.genres,
      gradeMin: Number($f('gradeMin').value), gradeMax: Number($f('gradeMax').value), status: $f('status').value,
      featured: $f('featured')?.checked || false,
      cover: { scene: state.scene, c1: $f('c1').value, c2: $f('c2').value },
      chapters: state.chapters, quiz: state.quiz
    };
    const btn = f.querySelector('[type=submit]');
    setBusy(btn, true, 'Guardando…');
    try {
      if (isNew) await post('/manage/books', payload); else await put(`/manage/books/${id}`, payload);
      dirty = false;
      toast(payload.status === 'published' ? 'El libro ya está publicado en la biblioteca.' : 'Borrador guardado.', { type: 'success', title: '¡Listo!' });
      location.hash = '#panel-libros';
    } catch (err) {
      setBusy(btn, false);
      showFieldErrors(f, err);
      if (err.fields && Object.keys(err.fields).some((k) => !f.querySelector(`[name="${CSS.escape(k)}"]`) || ['genres', 'cover', 'chapters', 'quiz'].includes(k))) {
        const ge = f.querySelector('.form-error'); ge.textContent = err.message; ge.hidden = false;
      }
      toast(err.message, { type: 'error' });
    }
  };

  window.addEventListener('beforeunload', (e) => { if (dirty && document.body.contains(node)) { e.preventDefault(); e.returnValue = ''; } });
  drawGenres(); drawChapters(); drawQuiz(); preview(); sectionHint(); synCount();
  return node;
}
