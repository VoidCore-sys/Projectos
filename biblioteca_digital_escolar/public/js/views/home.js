/** Inicio: saludo, continuar leyendo, secciones y estantes de libros. */
import { get } from '../api.js';
import { avatarSVG, coverHTML, icon, sceneSVG } from '../art.js';
import { el, esc, SECTION_INFO } from '../ui.js';
import { shelf, progressBar } from '../components.js';
import { store } from '../store.js';

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? '¡Buen día' : h < 20 ? '¡Buenas tardes' : '¡Buenas noches';
};

export async function renderHome() {
  const [home, me] = await Promise.all([get('/home'), get('/me/stats')]);
  const u = store.user;
  const s = me.stats;
  const cont = home.continueReading[0];
  const mySection = u.grade ? (u.grade <= 3 ? 1 : u.grade <= 5 ? 2 : 3) : null;
  const unlocked = me.achievements.filter((a) => a.unlockedAt).length;

  const node = el(`<div class="page home">
    <section class="hero">
      <div class="hero__text">
        <div class="hero__hello">${avatarSVG(u.avatar, 64)}<div>
          <p class="eyebrow">${new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          <h1>${greeting()}, ${esc(u.displayName)}!</h1></div></div>
        <p class="hero__lead">${cont ? 'Tu historia te está esperando. ¿Seguimos?' : '¿Qué aventura vas a elegir hoy? Explorá la biblioteca y empezá un libro nuevo.'}</p>
        <div class="hero__stats">
          <span class="pill pill--flame">${icon('flame', { size: 16 })} ${s.streak} ${s.streak === 1 ? 'día' : 'días'} de racha</span>
          <span class="pill">${icon('book', { size: 16 })} ${s.finished} ${s.finished === 1 ? 'libro terminado' : 'libros terminados'}</span>
          <span class="pill">${icon('award', { size: 16 })} ${unlocked} logros</span>
        </div>
      </div>
      ${cont ? `<article class="continue" data-book-id="${cont.id}">
        <button class="continue__cover" data-open-book="${cont.id}" aria-label="Continuar «${esc(cont.title)}»">${coverHTML(cont, { size: 'md' })}</button>
        <div class="continue__info">
          <p class="eyebrow">${icon('bookmark', { size: 14 })} Seguí leyendo</p>
          <h2>${esc(cont.title)}</h2>
          <p class="muted">Capítulo ${cont.progress.chapter + 1} de ${cont.chapterCount}</p>
          <div class="continue__progress">${progressBar(cont.progress.percent)}</div>
          <button class="btn btn--primary" data-open-book="${cont.id}" data-source=".continue__cover">${icon('book', { size: 18 })} Continuar leyendo</button>
        </div>
      </article>` : `<div class="hero__fan" aria-hidden="true">${(home.recommended.length >= 3 ? home.recommended : home.newest).slice(0, 3).map((b, i) => `<div class="hero__fan-book hero__fan-book--${i}">${coverHTML(b, { size: 'md' })}</div>`).join('')}</div>`}
    </section>

    <section class="sections">
      <h2 class="section-title">${icon('map', { size: 22 })} Las secciones de la biblioteca</h2>
      <div class="sections__grid">
        ${home.sections.map((sec) => `<a class="section-card section-card--s${sec.id} ${mySection === sec.id ? 'is-mine' : ''}" href="#seccion-${sec.id}">
          <div class="section-card__art">${sceneSVG(SECTION_INFO[sec.id].scene, SECTION_INFO[sec.id].c1, SECTION_INFO[sec.id].c2, { crop: true })}</div>
          <div class="section-card__body">
            ${mySection === sec.id ? '<span class="tag">Tu sección</span>' : ''}
            <h3>${esc(sec.name)}</h3><p>${esc(sec.grades)}</p>
            <span class="section-card__count">${sec.count} libros ${icon('right', { size: 16 })}</span>
          </div></a>`).join('')}
      </div>
    </section>

    ${home.continueReading.length > 1 ? shelf({ title: 'Libros que estás leyendo', books: home.continueReading, iconName: 'bookmark' }) : ''}
    ${shelf({ title: 'Recomendados para vos', subtitle: 'Elegidos según tu grado y lo que te gusta leer', books: home.recommended, iconName: 'sparkle', withReason: true,
    empty: '¡Increíble! Ya empezaste todos los libros de la biblioteca.' })}
    ${shelf({ title: 'Novedades', subtitle: 'Los últimos libros que llegaron a la biblioteca', books: home.newest, iconName: 'star' })}
    ${shelf({ title: 'Destacados de la biblioteca', books: home.featured, iconName: 'award' })}
  </div>`);
  return node;
}
