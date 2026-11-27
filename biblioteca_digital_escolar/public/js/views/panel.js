/** Panel para docentes y administración: resumen, alumnos, libros y usuarios. */
import { get, post, patch, del } from '../api.js';
import { avatarSVG, coverHTML, icon } from '../art.js';
import { el, esc, modal, toast, confirmDialog, showFieldErrors, setBusy, timeAgo, minutesLabel, gradeLabel, errorToast, SECTION_INFO } from '../ui.js';
import { activityChart, hBars, statTile, progressBar, achievementBadge } from '../components.js';
import { store, isAdmin } from '../store.js';

const TABS = () => [
  ['resumen', 'Resumen', 'chart'],
  ['alumnos', 'Alumnos', 'users'],
  ['libros', 'Libros', 'library'],
  ...(isAdmin() ? [['usuarios', 'Usuarios', 'key']] : [])
];

export async function renderPanel({ tab = 'resumen' } = {}) {
  const tabs = TABS();
  if (!tabs.some(([k]) => k === tab)) tab = 'resumen';
  const node = el(`<div class="page panel">
    <header class="page-head"><h1>${icon('grid', { size: 28 })} ${isAdmin() ? 'Panel de administración' : 'Panel docente'}</h1>
      <p class="muted">Seguimiento de la lectura, gestión de libros${isAdmin() ? ' y de cuentas' : ''}.</p></header>
    <nav class="tabs tabs--pill" aria-label="Secciones del panel">${tabs.map(([k, l, i]) => `<a class="tab ${tab === k ? 'is-active' : ''}" href="#panel-${k}" ${tab === k ? 'aria-current="page"' : ''}>${icon(i, { size: 16 })} ${l}</a>`).join('')}</nav>
    <div class="panel__body"><div class="loader"><span class="spinner"></span></div></div></div>`);
  const body = node.querySelector('.panel__body');
  const renderers = { resumen: renderSummary, alumnos: renderStudents, libros: renderBooks, usuarios: renderUsers };
  const content = await renderers[tab]();
  body.replaceChildren(content);
  return node;
}

/* -------------------------------- Resumen -------------------------------- */
async function renderSummary() {
  const s = await get('/teacher/stats');
  const t = s.totals;
  return el(`<div class="stack">
    <section class="stats-grid">
      ${statTile({ value: t.students, label: 'Alumnos registrados', iconName: 'users', tone: 'violet' })}
      ${statTile({ value: t.active_week, label: 'Leyeron esta semana', iconName: 'flame', tone: 'coral' })}
      ${statTile({ value: t.finished, label: `Libros terminados (de ${t.readings} iniciados)`, iconName: 'book', tone: 'teal' })}
      ${statTile({ value: minutesLabel(t.minutes), label: 'Tiempo total de lectura', iconName: 'clock', tone: 'gold' })}
      ${statTile({ value: t.quiz_avg !== null ? `${t.quiz_avg}%` : '—', label: `Promedio en ${t.quizzes} cuestionarios`, iconName: 'star', tone: 'violet' })}
      ${statTile({ value: t.books, label: 'Libros publicados', iconName: 'library', tone: 'teal' })}
    </section>
    <div class="two-col">
      <section class="card"><h2 class="card__title">${icon('chart', { size: 20 })} Minutos de lectura (últimos 14 días)</h2>${activityChart(s.activity, { days: 14 })}</section>
      <section class="card"><h2 class="card__title">${icon('trending', { size: 20 })} Libros más leídos</h2>
        ${s.topBooks.length ? hBars(s.topBooks.map((b) => ({ label: b.title, value: b.readers, display: `${b.readers} lectores · ${b.finished} terminados`, color: SECTION_INFO[b.section].c2 }))) : '<p class="muted">Todavía no hay lecturas registradas.</p>'}</section>
    </div>
    <div class="two-col">
      <section class="card"><h2 class="card__title">${icon('users', { size: 20 })} Lectura por grado</h2>
        ${s.byGrade.length ? `<table class="table"><thead><tr><th>Grado</th><th>Alumnos</th><th>Libros terminados</th><th>Tiempo</th></tr></thead><tbody>
        ${s.byGrade.map((g) => `<tr><td>${g.grade}.º</td><td>${g.students}</td><td>${g.finished}</td><td>${minutesLabel(g.minutes)}</td></tr>`).join('')}</tbody></table>` : '<p class="muted">Sin alumnos registrados.</p>'}</section>
      <section class="card"><h2 class="card__title">${icon('compass', { size: 20 })} Géneros preferidos</h2>
        ${s.byGenre.length ? hBars(s.byGenre.map((g) => ({ label: g.genre, value: g.readings, display: `${g.readings} lecturas` }))) : '<p class="muted">Sin datos todavía.</p>'}</section>
    </div></div>`);
}

/* -------------------------------- Alumnos -------------------------------- */
async function renderStudents() {
  const node = el(`<div class="stack">
    <div class="toolbar">
      <label class="search search--sm">${icon('search', { size: 18 })}<input type="search" placeholder="Buscar alumno…" aria-label="Buscar alumno"></label>
      <label class="select"><span class="sr-only">Grado</span><select><option value="">Todos los grados</option>${[1, 2, 3, 4, 5, 6, 7].map((g) => `<option value="${g}">${g}.º grado</option>`).join('')}</select></label>
    </div>
    <div class="card card--flush"><div class="table-wrap"></div></div></div>`);
  const wrap = node.querySelector('.table-wrap');
  const search = node.querySelector('input');
  const grade = node.querySelector('select');
  let list = [];
  const draw = () => {
    const q = search.value.trim().toLowerCase();
    const rows = list.filter((s) => !q || s.displayName.toLowerCase().includes(q) || s.username.includes(q));
    wrap.innerHTML = rows.length ? `<table class="table table--hover"><thead><tr><th>Alumno</th><th>Grado</th><th>Leyendo</th><th>Terminados</th><th>Tiempo</th><th>Cuestionarios</th><th>Última lectura</th></tr></thead><tbody>
      ${rows.map((s) => `<tr tabindex="0" data-student="${s.id}"><td><div class="who">${avatarSVG(s.avatar, 32)}<div><strong>${esc(s.displayName)}</strong><span class="muted small">@${esc(s.username)}</span></div></div></td>
      <td>${s.grade}.º</td><td>${s.started - s.finished}</td><td>${s.finished}</td><td>${minutesLabel(s.minutes)}</td>
      <td>${s.quizAverage !== null ? `<span class="score">${s.quizAverage}%</span>` : '—'}</td><td>${timeAgo(s.lastRead)}</td></tr>`).join('')}</tbody></table>`
      : '<p class="muted pad">No hay alumnos que coincidan.</p>';
    wrap.querySelectorAll('[data-student]').forEach((r) => {
      const open = () => studentDetail(Number(r.dataset.student));
      r.onclick = open;
      r.onkeydown = (e) => { if (e.key === 'Enter') open(); };
    });
  };
  const load = async () => {
    wrap.innerHTML = '<div class="loader"><span class="spinner"></span></div>';
    try { list = (await get(`/teacher/students${grade.value ? `?grade=${grade.value}` : ''}`)).students; draw(); } catch (e) { errorToast(e); }
  };
  search.oninput = draw;
  grade.onchange = load;
  await load();
  return node;
}

async function studentDetail(id) {
  let d;
  try { d = await get(`/teacher/students/${id}`); } catch (e) { return errorToast(e); }
  const s = d.stats;
  const m = modal({
    title: `Lectura de ${d.student.displayName}`, size: 'lg',
    content: `<div class="stack">
      <div class="who who--lg">${avatarSVG(d.student.avatar, 56)}<div><strong>${esc(d.student.displayName)}</strong><span class="muted">@${esc(d.student.username)} · ${d.student.grade}.º grado · último ingreso ${timeAgo(d.lastLogin)}</span></div></div>
      <div class="stats-grid stats-grid--sm">
        ${statTile({ value: s.finished, label: 'Terminados', iconName: 'book' })}${statTile({ value: minutesLabel(s.minutes), label: 'Tiempo', iconName: 'clock', tone: 'teal' })}
        ${statTile({ value: `${s.streak} d`, label: 'Racha', iconName: 'flame', tone: 'coral' })}${statTile({ value: s.quizAverage !== null ? `${s.quizAverage}%` : '—', label: 'Cuestionarios', iconName: 'star', tone: 'gold' })}
      </div>
      <h3>Libros</h3>
      ${d.reading.length ? `<table class="table"><thead><tr><th>Libro</th><th>Avance</th><th>Capítulo</th><th>Tiempo</th><th>Actualizado</th></tr></thead><tbody>
        ${d.reading.map((r) => `<tr><td>${esc(r.title)}</td><td class="nowrap">${r.finishedAt ? `<span class="tag tag--ok">${icon('check', { size: 12 })} Terminado</span>` : progressBar(r.percent)}</td><td>${r.chapter + 1} / ${r.chapters}</td><td>${minutesLabel(r.minutes)}</td><td>${timeAgo(r.updatedAt)}</td></tr>`).join('')}</tbody></table>` : '<p class="muted">Todavía no empezó ningún libro.</p>'}
      <h3>Cuestionarios</h3>
      ${d.quizzes.length ? `<table class="table"><thead><tr><th>Libro</th><th>Puntaje</th><th>Fecha</th></tr></thead><tbody>${d.quizzes.map((q) => `<tr><td>${esc(q.title)}</td><td><span class="score ${q.score === q.total ? 'is-perfect' : ''}">${q.score}/${q.total}</span></td><td>${timeAgo(q.createdAt)}</td></tr>`).join('')}</tbody></table>` : '<p class="muted">Sin cuestionarios respondidos.</p>'}
      <h3>Actividad</h3>${activityChart(d.activity, { days: 14 })}
      ${d.achievements.length ? `<h3>Logros</h3><div class="badges badges--compact">${d.achievements.map(achievementBadge).join('')}</div>` : ''}
      <div class="form-actions"><button class="btn btn--ghost" data-reset>${icon('key', { size: 16 })} Restablecer contraseña</button></div></div>`
  });
  m.node.querySelector('[data-reset]').onclick = () => resetPassword(d.student, `/teacher/students/${id}/password`);
}

function resetPassword(user, url) {
  const m = modal({
    title: `Nueva contraseña para ${user.displayName}`, size: 'sm',
    content: `<form class="form" novalidate><div class="field"><label for="rp">Nueva contraseña</label><input id="rp" name="password" type="text" autocomplete="off" required>
      <p class="muted small">Comunicásela al alumno en persona. Se cerrarán sus sesiones abiertas.</p></div>
      <p class="form-error" hidden></p><div class="form-actions"><button class="btn btn--primary">Guardar</button></div></form>`
  });
  const f = m.node.querySelector('form');
  f.onsubmit = async (e) => {
    e.preventDefault();
    const btn = f.querySelector('button');
    setBusy(btn, true);
    try {
      const body = Object.fromEntries(new FormData(f));
      if (url.startsWith('/admin')) await patch(url, { displayName: user.displayName, role: user.role, grade: user.grade, password: body.password });
      else await post(url, body);
      m.close();
      toast('Contraseña restablecida.', { type: 'success' });
    } catch (err) { setBusy(btn, false); showFieldErrors(f, err); }
  };
}

/* --------------------------------- Libros --------------------------------- */
async function renderBooks() {
  const { books } = await get('/manage/books');
  const node = el(`<div class="stack">
    <div class="toolbar"><p class="muted">${books.length} libros en la biblioteca. ${isAdmin() ? 'Podés editar cualquiera.' : 'Podés editar los libros que publicaste.'}</p>
      <a class="btn btn--primary" href="#libro-nuevo">${icon('plus', { size: 18 })} Publicar un libro</a></div>
    <div class="card card--flush"><div class="table-wrap"><table class="table"><thead><tr><th>Libro</th><th>Sección</th><th>Género</th><th>Capítulos</th><th>Lectores</th><th>Estado</th><th><span class="sr-only">Acciones</span></th></tr></thead><tbody>
    ${books.map((b) => `<tr data-id="${b.id}"><td><div class="who">${coverHTML(b, { size: 'xs' })}<div><strong>${esc(b.title)}</strong><span class="muted small">${esc(b.author)} · publicado por ${esc(b.owner)}</span></div></div></td>
      <td><span class="chip chip--s${b.section}">${gradeLabel(b.gradeMin, b.gradeMax)}</span></td><td>${esc(b.genre)}</td><td>${b.chapterCount}</td><td>${b.readers}</td>
      <td>${b.status === 'published' ? '<span class="tag tag--ok">Publicado</span>' : '<span class="tag">Borrador</span>'}${b.featured ? ' <span class="tag tag--gold">Destacado</span>' : ''}</td>
      <td class="actions">${b.canEdit ? `<a class="icon-btn" href="#libro-${b.id}" aria-label="Editar ${esc(b.title)}" title="Editar">${icon('edit', { size: 18 })}</a>
        <button class="icon-btn icon-btn--danger" data-del="${b.id}" aria-label="Eliminar ${esc(b.title)}" title="Eliminar">${icon('trash', { size: 18 })}</button>` : ''}</td></tr>`).join('')}
    </tbody></table></div></div></div>`);
  node.querySelectorAll('[data-del]').forEach((b) => (b.onclick = async () => {
    const book = books.find((x) => x.id === Number(b.dataset.del));
    if (!(await confirmDialog({ title: 'Eliminar libro', message: `Se eliminará «${book.title}» junto con el progreso de lectura de los alumnos. Esta acción no se puede deshacer.`, confirmText: 'Eliminar', danger: true }))) return;
    try {
      await del(`/manage/books/${book.id}`);
      b.closest('tr').remove();
      toast('Libro eliminado.', { type: 'success' });
    } catch (e) { errorToast(e); }
  }));
  return node;
}

/* -------------------------------- Usuarios -------------------------------- */
const ROLE = { student: 'Alumno', teacher: 'Docente', admin: 'Administración' };

async function renderUsers() {
  const { users } = await get('/admin/users');
  const node = el(`<div class="stack">
    <div class="toolbar"><p class="muted">${users.length} cuentas. Las cuentas de docentes las crea la administración.</p>
      <button class="btn btn--primary" data-new>${icon('plus', { size: 18 })} Nueva cuenta</button></div>
    <div class="card card--flush"><div class="table-wrap"><table class="table"><thead><tr><th>Usuario</th><th>Rol</th><th>Grado</th><th>Lecturas</th><th>Último ingreso</th><th><span class="sr-only">Acciones</span></th></tr></thead><tbody>
    ${users.map((u) => `<tr><td><div class="who">${avatarSVG(u.avatar, 32)}<div><strong>${esc(u.displayName)}</strong><span class="muted small">@${esc(u.username)}</span></div></div></td>
      <td><span class="tag ${u.role !== 'student' ? 'tag--gold' : ''}">${ROLE[u.role]}</span></td><td>${u.grade ? `${u.grade}.º` : '—'}</td><td>${u.readings}</td><td>${timeAgo(u.lastLogin)}</td>
      <td class="actions"><button class="icon-btn" data-edit="${u.id}" aria-label="Editar ${esc(u.displayName)}" title="Editar">${icon('edit', { size: 18 })}</button>
      ${u.id !== store.user.id ? `<button class="icon-btn icon-btn--danger" data-del="${u.id}" aria-label="Eliminar ${esc(u.displayName)}" title="Eliminar">${icon('trash', { size: 18 })}</button>` : ''}</td></tr>`).join('')}
    </tbody></table></div></div></div>`);
  const reload = () => window.dispatchEvent(new Event('hashchange'));
  node.querySelector('[data-new]').onclick = () => userForm(null, reload);
  node.querySelectorAll('[data-edit]').forEach((b) => (b.onclick = () => userForm(users.find((u) => u.id === Number(b.dataset.edit)), reload)));
  node.querySelectorAll('[data-del]').forEach((b) => (b.onclick = async () => {
    const u = users.find((x) => x.id === Number(b.dataset.del));
    if (!(await confirmDialog({ title: 'Eliminar cuenta', message: `Se eliminará la cuenta de ${u.displayName} y todo su progreso de lectura. No se puede deshacer.`, confirmText: 'Eliminar', danger: true }))) return;
    try { await del(`/admin/users/${u.id}`); toast('Cuenta eliminada.', { type: 'success' }); reload(); } catch (e) { errorToast(e); }
  }));
  return node;
}

function userForm(user, done) {
  const isNew = !user;
  const m = modal({
    title: isNew ? 'Nueva cuenta' : `Editar a ${user.displayName}`,
    content: `<form class="form" novalidate>
      <div class="form-row">
        <div class="field"><label for="uf-name">Nombre para mostrar</label><input id="uf-name" name="displayName" value="${esc(user?.displayName || '')}" required maxlength="40"></div>
        <div class="field"><label for="uf-user">Usuario</label><input id="uf-user" name="username" value="${esc(user?.username || '')}" ${isNew ? '' : 'disabled'} required maxlength="20" autocapitalize="none"></div>
      </div>
      <div class="form-row">
        <div class="field"><label for="uf-role">Rol</label><select id="uf-role" name="role">${Object.entries(ROLE).map(([k, v]) => `<option value="${k}" ${(user?.role || 'teacher') === k ? 'selected' : ''}>${v}</option>`).join('')}</select></div>
        <div class="field" data-grade><label for="uf-grade">Grado</label><select id="uf-grade" name="grade"><option value="">—</option>${[1, 2, 3, 4, 5, 6, 7].map((g) => `<option value="${g}" ${user?.grade === g ? 'selected' : ''}>${g}.º grado</option>`).join('')}</select></div>
      </div>
      <div class="field"><label for="uf-pass">${isNew ? 'Contraseña' : 'Nueva contraseña (opcional)'}</label><input id="uf-pass" name="password" type="text" autocomplete="off" ${isNew ? 'required' : ''}>
        <p class="muted small">Docentes y administración: al menos 8 caracteres con letras y números.</p></div>
      <p class="form-error" hidden></p>
      <div class="form-actions"><button type="button" class="btn btn--ghost" data-cancel>Cancelar</button><button class="btn btn--primary">${isNew ? 'Crear cuenta' : 'Guardar'}</button></div></form>`
  });
  const f = m.node.querySelector('form');
  const role = f.querySelector('[name=role]');
  const syncGrade = () => { f.querySelector('[data-grade]').hidden = role.value !== 'student'; };
  role.onchange = syncGrade; syncGrade();
  f.querySelector('[data-cancel]').onclick = () => m.close();
  f.onsubmit = async (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(f));
    d.grade = d.grade ? Number(d.grade) : undefined;
    if (!d.password) delete d.password;
    const btn = f.querySelector('.btn--primary');
    setBusy(btn, true);
    try {
      if (isNew) await post('/admin/users', d); else await patch(`/admin/users/${user.id}`, d);
      m.close();
      toast(isNew ? 'Cuenta creada.' : 'Cambios guardados.', { type: 'success' });
      done();
    } catch (err) { setBusy(btn, false); showFieldErrors(f, err); }
  };
}
