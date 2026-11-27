/** Pantalla de bienvenida: inicio de sesión y registro de alumnos. */
import { post } from '../api.js';
import { avatarSVG, AVATAR_NAMES, coverHTML, LOGO, icon } from '../art.js';
import { el, esc, showFieldErrors, setBusy } from '../ui.js';
import { store } from '../store.js';

const SHOWCASE = [
  { title: 'Pipo y las burbujas de colores', author: 'Clara Montiel', section: 1, cover: { scene: 'dragon', c1: '#ffb36b', c2: '#ff6f91' } },
  { title: 'El caso del reloj detenido', author: 'Federico Lanús', section: 2, cover: { scene: 'reloj', c1: '#f4a259', c2: '#5b8e7d' } },
  { title: 'Cuando ARIA despertó', author: 'Tomás Insaurralde', section: 3, cover: { scene: 'robot', c1: '#0f2f3d', c2: '#16a3a8' } }
];

export function renderAuth(mode = 'login', onDone) {
  const cfg = store.config;
  const node = el(`<div class="auth">
    <section class="auth__hero">
      <a class="brand brand--light" href="#inicio">${LOGO}<span>Biblioteca<br><b>Digital Escolar</b></span></a>
      <h1>Un universo de historias<br><span>te está esperando.</span></h1>
      <p>Cuentos, aventuras, misterios y ciencia ficción para lectores de 1.º a 7.º grado. Tu progreso se guarda siempre: volvé cuando quieras y seguí exactamente donde lo dejaste.</p>
      <div class="auth__books" aria-hidden="true">${SHOWCASE.map((b, i) => `<div class="auth__book auth__book--${i}">${coverHTML(b, { size: 'sm' })}</div>`).join('')}</div>
      <ul class="auth__features">
        <li>${icon('book')} 3 secciones según tu grado</li>
        <li>${icon('award')} Logros y cuestionarios</li>
        <li>${icon('shield')} Datos protegidos</li>
      </ul>
    </section>
    <section class="auth__panel">
      <div class="auth__card">
        <div class="tabs" role="tablist">
          <button role="tab" class="tab" data-mode="login">Ingresar</button>
          ${cfg.registration ? '<button role="tab" class="tab" data-mode="register">Crear cuenta</button>' : ''}
        </div>
        <div class="auth__forms"></div>
      </div>
      ${cfg.storage === 'local' ? `<p class="storage-note">${icon('info', { size: 16 })} Estás usando la biblioteca como archivo suelto: las cuentas y el progreso se guardan en este navegador. Publicada como artifact, se guardan en la base de datos compartida.</p>` : ''}
      ${cfg.demoAccounts ? `<details class="demo-box"><summary>${icon('key', { size: 16 })} Cuentas de demostración</summary>
        <table><tr><th>Rol</th><th>Usuario</th><th>Contraseña</th></tr>
        <tr><td>Alumno (4.º)</td><td><code>alumno</code></td><td><code>alumno1</code></td></tr>
        <tr><td>Docente</td><td><code>docente</code></td><td><code>Docente2026</code></td></tr>
        <tr><td>Administrador</td><td><code>admin</code></td><td><code>Admin2026</code></td></tr></table></details>` : ''}
    </section></div>`);

  const forms = node.querySelector('.auth__forms');
  const show = (m) => {
    node.querySelectorAll('.tab').forEach((t) => { t.classList.toggle('is-active', t.dataset.mode === m); t.setAttribute('aria-selected', t.dataset.mode === m); });
    forms.innerHTML = '';
    forms.appendChild(m === 'register' ? registerForm(onDone) : loginForm(onDone));
    history.replaceState(null, '', m === 'register' ? '#registro' : '#ingresar');
  };
  node.querySelectorAll('.tab').forEach((t) => (t.onclick = () => show(t.dataset.mode)));
  show(mode === 'register' && cfg.registration ? 'register' : 'login');
  return node;
}

function loginForm(onDone) {
  const f = el(`<form class="form" novalidate>
    <h2>¡Hola de nuevo!</h2><p class="muted">Ingresá con tu usuario para seguir leyendo.</p>
    <div class="field"><label for="lg-user">Usuario</label><input id="lg-user" name="username" autocomplete="username" required maxlength="40" autocapitalize="none" spellcheck="false"></div>
    <div class="field"><label for="lg-pass">Contraseña</label>
      <div class="input-group"><input id="lg-pass" name="password" type="password" autocomplete="current-password" required maxlength="200">
      <button type="button" class="icon-btn" data-toggle-pass aria-label="Mostrar contraseña">${icon('eye', { size: 18 })}</button></div></div>
    <p class="form-error" role="alert" hidden></p>
    <button class="btn btn--primary btn--block btn--lg" type="submit">Ingresar ${icon('right', { size: 18 })}</button>
    <p class="muted small center">¿Olvidaste tu contraseña? Pedile a tu docente que la restablezca.</p>
  </form>`);
  bindPassToggle(f);
  f.onsubmit = async (e) => {
    e.preventDefault();
    const btn = f.querySelector('[type=submit]');
    const data = Object.fromEntries(new FormData(f));
    if (!data.username || !data.password) return showFieldErrors(f, { fields: { ...(!data.username && { username: 'Escribí tu usuario.' }), ...(!data.password && { password: 'Escribí tu contraseña.' }) } });
    setBusy(btn, true, 'Ingresando…');
    try {
      const { user } = await post('/auth/login', data, { silent401: true });
      onDone(user);
    } catch (err) {
      setBusy(btn, false);
      showFieldErrors(f, err);
    }
  };
  return f;
}

function registerForm(onDone) {
  const avatars = Object.keys(AVATAR_NAMES);
  const f = el(`<form class="form" novalidate>
    <h2>Creá tu cuenta</h2><p class="muted">Sólo te pedimos lo necesario. No hace falta email.</p>
    <div class="field"><label for="rg-name">¿Cómo te llamás?</label><input id="rg-name" name="displayName" required maxlength="40" placeholder="Tu nombre (sin apellido)" autocomplete="given-name"></div>
    <div class="form-row">
      <div class="field"><label for="rg-user">Nombre de usuario</label><input id="rg-user" name="username" required minlength="3" maxlength="20" pattern="[a-zA-Z0-9._\\-]+" autocapitalize="none" spellcheck="false" placeholder="ej: sol.lectora" autocomplete="username"></div>
      <div class="field"><label for="rg-grade">Grado</label><select id="rg-grade" name="grade" required><option value="">Elegí…</option>${[1, 2, 3, 4, 5, 6, 7].map((g) => `<option value="${g}">${g}.º grado</option>`).join('')}</select></div>
    </div>
    <div class="field"><label for="rg-pass">Contraseña</label>
      <div class="input-group"><input id="rg-pass" name="password" type="password" required minlength="6" maxlength="128" autocomplete="new-password" aria-describedby="rg-pass-help">
      <button type="button" class="icon-btn" data-toggle-pass aria-label="Mostrar contraseña">${icon('eye', { size: 18 })}</button></div>
      <ul class="pass-rules" id="rg-pass-help"><li data-rule="len">Al menos 6 caracteres</li><li data-rule="mix">Letras y números</li></ul></div>
    <fieldset class="field"><legend>Elegí tu avatar</legend><div class="avatar-pick">
      ${avatars.map((a, i) => `<label class="avatar-opt"><input type="radio" name="avatar" value="${a}" ${i === 0 ? 'checked' : ''}><span>${avatarSVG(a, 48)}</span><small>${AVATAR_NAMES[a]}</small></label>`).join('')}
    </div></fieldset>
    ${store.config.schoolCodeRequired ? '<div class="field"><label for="rg-code">Código de la escuela</label><input id="rg-code" name="schoolCode" required maxlength="40" placeholder="Te lo da tu docente"></div>' : ''}
    <p class="privacy">${icon('shield', { size: 16 })} Tus datos se guardan de forma segura. Sólo tus docentes pueden ver tu progreso de lectura.</p>
    <p class="form-error" role="alert" hidden></p>
    <button class="btn btn--primary btn--block btn--lg" type="submit">Crear mi cuenta ${icon('sparkle', { size: 18 })}</button>
  </form>`);
  bindPassToggle(f);
  const pass = f.querySelector('#rg-pass');
  pass.addEventListener('input', () => {
    const v = pass.value;
    f.querySelector('[data-rule=len]').classList.toggle('ok', v.length >= 6);
    f.querySelector('[data-rule=mix]').classList.toggle('ok', /[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(v) && /\d/.test(v));
  });
  f.onsubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(f));
    const errors = {};
    if (!data.displayName || data.displayName.trim().length < 2) errors.displayName = 'Escribí tu nombre (al menos 2 letras).';
    if (!/^[a-zA-Z0-9._-]{3,20}$/.test(data.username || '')) errors.username = 'Entre 3 y 20 caracteres: letras sin acentos, números, punto o guion.';
    if (!data.grade) errors.grade = 'Elegí tu grado.';
    if ((data.password || '').length < 6 || !/\d/.test(data.password) || !/[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(data.password)) errors.password = 'Usá al menos 6 caracteres, con letras y números.';
    if (Object.keys(errors).length) return showFieldErrors(f, { fields: errors });
    const btn = f.querySelector('[type=submit]');
    setBusy(btn, true, 'Creando cuenta…');
    try {
      const { user } = await post('/auth/register', { ...data, grade: Number(data.grade) }, { silent401: true });
      onDone(user, true);
    } catch (err) {
      setBusy(btn, false);
      showFieldErrors(f, err);
    }
  };
  return f;
}

function bindPassToggle(form) {
  form.querySelectorAll('[data-toggle-pass]').forEach((b) => {
    b.onclick = () => {
      const input = b.parentElement.querySelector('input');
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      b.setAttribute('aria-label', show ? 'Ocultar contraseña' : 'Mostrar contraseña');
    };
  });
}

export const authEsc = esc;
