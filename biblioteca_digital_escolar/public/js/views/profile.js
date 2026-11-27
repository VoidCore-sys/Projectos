/** Perfil personal: estadísticas, logros, biblioteca propia, historial y ajustes de cuenta. */
import { get, patch, post } from '../api.js';
import { avatarSVG, AVATAR_NAMES, coverHTML, icon } from '../art.js';
import { el, esc, modal, toast, showFieldErrors, setBusy, timeAgo, fmtDate, minutesLabel } from '../ui.js';
import { achievementBadge, activityChart, bookGrid, emptyState, progressBar, statTile } from '../components.js';
import { store } from '../store.js';

const ROLE = { student: 'Alumno', teacher: 'Docente', admin: 'Administración' };

export async function renderProfile(params, query) {
  const [lib, me] = await Promise.all([get('/me/library'), get('/me/stats')]);
  const u = store.user;
  const s = me.stats;
  const unlocked = me.achievements.filter((a) => a.unlockedAt);
  const tab = query.tab || 'leyendo';

  const node = el(`<div class="page profile">
    <section class="profile-card">
      <div class="profile-card__avatar">${avatarSVG(u.avatar, 96)}</div>
      <div class="profile-card__info">
        <h1>${esc(u.displayName)}</h1>
        <p class="muted">@${esc(u.username)} · ${ROLE[u.role]}${u.grade ? ` · ${u.grade}.º grado` : ''} · Lector desde ${fmtDate(u.createdAt)}</p>
        <div class="profile-card__actions">
          <button class="btn btn--ghost btn--sm" data-edit>${icon('edit', { size: 16 })} Editar perfil</button>
          <button class="btn btn--ghost btn--sm" data-pass>${icon('lock', { size: 16 })} Cambiar contraseña</button>
        </div>
      </div>
    </section>

    <section class="stats-grid">
      ${statTile({ value: s.finished, label: s.finished === 1 ? 'Libro terminado' : 'Libros terminados', iconName: 'book', tone: 'violet' })}
      ${statTile({ value: minutesLabel(s.minutes), label: 'Tiempo de lectura', iconName: 'clock', tone: 'teal' })}
      ${statTile({ value: `${s.streak} ${s.streak === 1 ? 'día' : 'días'}`, label: `Racha actual (récord: ${s.bestStreak})`, iconName: 'flame', tone: 'coral' })}
      ${statTile({ value: s.quizAverage !== null ? `${s.quizAverage}%` : '—', label: `Cuestionarios (${s.quizAttempts})`, iconName: 'star', tone: 'gold' })}
    </section>

    <div class="two-col">
      <section class="card">
        <h2 class="card__title">${icon('chart', { size: 20 })} Mi actividad</h2>
        ${activityChart(me.activity, { days: 14 })}
      </section>
      <section class="card">
        <h2 class="card__title">${icon('award', { size: 20 })} Logros <span class="muted small">${unlocked.length} de ${me.achievements.length}</span></h2>
        <div class="badges">${me.achievements.map(achievementBadge).join('')}</div>
      </section>
    </div>

    <section class="card">
      <div class="tabs tabs--pill" role="tablist">
        ${[['leyendo', 'Leyendo', lib.inProgress.length], ['terminados', 'Terminados', lib.finished.length], ['favoritos', 'Favoritos', lib.favorites.length], ['historial', 'Historial', lib.history.length], ['cuestionarios', 'Cuestionarios', me.quizzes.length]]
    .map(([k, label, n]) => `<button role="tab" class="tab ${tab === k ? 'is-active' : ''}" data-tab="${k}" aria-selected="${tab === k}">${label} <span class="count">${n}</span></button>`).join('')}
      </div>
      <div class="tab-panel"></div>
    </section>
  </div>`);

  const panel = node.querySelector('.tab-panel');
  const renderTab = (k) => {
    node.querySelectorAll('[data-tab]').forEach((t) => { t.classList.toggle('is-active', t.dataset.tab === k); t.setAttribute('aria-selected', t.dataset.tab === k); });
    if (k === 'leyendo') panel.innerHTML = lib.inProgress.length ? bookGrid(lib.inProgress.map((h) => h.book)) : emptyState({ title: 'No estás leyendo nada ahora', text: 'Elegí un libro y empezá una nueva aventura.', scene: 'barco', action: '<a class="btn btn--primary" href="#explorar">Explorar libros</a>' });
    if (k === 'terminados') panel.innerHTML = lib.finished.length ? bookGrid(lib.finished.map((h) => h.book)) : emptyState({ title: 'Todavía no terminaste ningún libro', text: 'Cuando termines uno, va a aparecer acá con su medalla.', scene: 'montanas' });
    if (k === 'favoritos') panel.innerHTML = lib.favorites.length ? bookGrid(lib.favorites) : emptyState({ title: 'No tenés favoritos', text: 'Tocá el corazón de un libro para guardarlo acá.', scene: 'huerta' });
    if (k === 'historial') panel.innerHTML = lib.history.length ? `<ol class="timeline">${lib.history.map((h) => `<li class="timeline__item" data-book-id="${h.book.id}">
        <button class="timeline__cover" data-open-book="${h.book.id}" aria-label="Abrir ${esc(h.book.title)}">${coverHTML(h.book, { size: 'xs' })}</button>
        <div class="timeline__body"><strong>${esc(h.book.title)}</strong>
          <span class="muted small">${h.finishedAt ? `${icon('check', { size: 13 })} Terminado el ${fmtDate(h.finishedAt)}` : `Capítulo ${h.chapter + 1} · página ${h.page + 1} de ${h.totalPages}`} · ${minutesLabel(h.minutes)} de lectura</span>
          ${progressBar(h.percent)}</div>
        <span class="timeline__when muted small">${timeAgo(h.updatedAt)}</span></li>`).join('')}</ol>`
      : emptyState({ title: 'Tu historial está vacío', text: 'Acá vas a ver todos los libros que leíste.', scene: 'luna' });
    if (k === 'cuestionarios') panel.innerHTML = me.quizzes.length ? `<table class="table"><thead><tr><th>Libro</th><th>Mejor puntaje</th><th>Intentos</th><th>Último</th></tr></thead><tbody>
      ${me.quizzes.map((q) => `<tr><td>${esc(q.title)}</td><td><span class="score ${q.score === q.total ? 'is-perfect' : ''}">${q.score}/${q.total}</span></td><td>${q.attempts}</td><td>${timeAgo(q.last)}</td></tr>`).join('')}</tbody></table>`
      : emptyState({ title: 'Sin cuestionarios todavía', text: 'Al terminar un libro, podés responder preguntas sobre la historia.', scene: 'llave' });
  };
  node.querySelectorAll('[data-tab]').forEach((t) => (t.onclick = () => renderTab(t.dataset.tab)));
  renderTab(['leyendo', 'terminados', 'favoritos', 'historial', 'cuestionarios'].includes(tab) ? tab : 'leyendo');

  node.querySelector('[data-edit]').onclick = () => editProfile();
  node.querySelector('[data-pass]').onclick = () => changePassword();
  return node;
}

function editProfile() {
  const u = store.user;
  const m = modal({
    title: 'Editar perfil',
    content: `<form class="form" novalidate>
      <div class="field"><label for="ep-name">Nombre para mostrar</label><input id="ep-name" name="displayName" value="${esc(u.displayName)}" maxlength="40" required></div>
      ${u.role === 'student' ? `<div class="field"><label for="ep-grade">Grado</label><select id="ep-grade" name="grade">${[1, 2, 3, 4, 5, 6, 7].map((g) => `<option value="${g}" ${u.grade === g ? 'selected' : ''}>${g}.º grado</option>`).join('')}</select></div>` : ''}
      <fieldset class="field"><legend>Avatar</legend><div class="avatar-pick">${Object.keys(AVATAR_NAMES).map((a) => `<label class="avatar-opt"><input type="radio" name="avatar" value="${a}" ${u.avatar === a ? 'checked' : ''}><span>${avatarSVG(a, 48)}</span><small>${AVATAR_NAMES[a]}</small></label>`).join('')}</div></fieldset>
      <p class="form-error" hidden></p>
      <div class="form-actions"><button type="button" class="btn btn--ghost" data-cancel>Cancelar</button><button class="btn btn--primary">Guardar cambios</button></div></form>`
  });
  const f = m.node.querySelector('form');
  f.querySelector('[data-cancel]').onclick = () => m.close();
  f.onsubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(f));
    if (data.grade) data.grade = Number(data.grade);
    const btn = f.querySelector('.btn--primary');
    setBusy(btn, true);
    try {
      const { user } = await patch('/me', data);
      store.set({ user });
      m.close();
      toast('Tu perfil se actualizó.', { type: 'success' });
      window.dispatchEvent(new Event('hashchange'));
    } catch (err) { setBusy(btn, false); showFieldErrors(f, err); }
  };
}

function changePassword() {
  const m = modal({
    title: 'Cambiar contraseña', size: 'sm',
    content: `<form class="form" novalidate>
      <div class="field"><label for="cp-cur">Contraseña actual</label><input id="cp-cur" type="password" name="current" autocomplete="current-password" required></div>
      <div class="field"><label for="cp-new">Nueva contraseña</label><input id="cp-new" type="password" name="next" autocomplete="new-password" required>
      <p class="muted small">${store.user.role === 'student' ? 'Al menos 6' : 'Al menos 8'} caracteres, con letras y números.</p></div>
      <div class="field"><label for="cp-rep">Repetir nueva contraseña</label><input id="cp-rep" type="password" name="repeat" autocomplete="new-password" required></div>
      <p class="form-error" hidden></p>
      <div class="form-actions"><button type="button" class="btn btn--ghost" data-cancel>Cancelar</button><button class="btn btn--primary">Cambiar</button></div></form>`
  });
  const f = m.node.querySelector('form');
  f.querySelector('[data-cancel]').onclick = () => m.close();
  f.onsubmit = async (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(f));
    if (d.next !== d.repeat) return showFieldErrors(f, { fields: { repeat: 'Las contraseñas no coinciden.' } });
    const btn = f.querySelector('.btn--primary');
    setBusy(btn, true);
    try {
      await post('/me/password', { current: d.current, next: d.next });
      m.close();
      toast('Contraseña actualizada. Se cerraron tus otras sesiones.', { type: 'success' });
    } catch (err) { setBusy(btn, false); showFieldErrors(f, err); }
  };
}
