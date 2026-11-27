/**
 * Animaciones de apertura y cierre del libro.
 *
 * Apertura:
 *  1. La portada reacciona al toque.
 *  2. "Viaje de cámara": el fondo oscuro se abre desde el libro elegido y el libro 3D cerrado
 *     vuela desde su tarjeta hasta el centro, acercándose a la pantalla.
 *     (En modo completo, además, la biblioteca se acerca levemente y se desvanece.)
 *  3. La tapa gira hacia la izquierda sobre el lomo y el libro se centra abierto.
 *  4. Se reemplaza sin saltos por el lector real, que ocupa exactamente la misma posición.
 *
 * Rendimiento: sólo se animan `transform` y `opacity`, que el navegador resuelve en la
 * placa de video sin volver a dibujar la página. No se usan desenfoques animados.
 */
import { coverHTML } from '../art.js';
import { reducedMotion } from '../ui.js';
import { perfTier, watchFrames } from '../perf.js';

const EASE_FLY = 'cubic-bezier(.2,.75,.15,1)';
const EASE_OPEN = 'cubic-bezier(.55,.05,.25,1)';
const wait = (anim) => anim.finished.catch(() => {});
const T = () => (perfTier() === 'lite' ? { fly: 760, open: 900, close: 650, back: 650 } : { fly: 1050, open: 1150, close: 800, back: 880 });

function stageNode(section, extraClass = '') {
  const n = document.createElement('div');
  n.className = `opening opening--s${section} ${extraClass}`;
  n.lang = 'es';
  n.innerHTML = '<div class="opening__backdrop"></div>';
  document.body.appendChild(n);
  return n;
}

function closedBook(book, rect, { leftHTML = '', rightHTML = '' } = {}) {
  const ob = document.createElement('div');
  ob.className = 'ob';
  Object.assign(ob.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` });
  ob.innerHTML = `
    <div class="ob__shadow"></div>
    <div class="ob__block"></div>
    <div class="ob__pages">${rightHTML}</div>
    <div class="ob__edge"></div>
    <div class="ob__cover">
      <div class="ob__front">${coverHTML(book, { size: 'xl' })}</div>
      <div class="ob__back">${leftHTML}</div>
    </div>`;
  return ob;
}

const flip = (from, to) => ({
  s: from.width / to.width,
  dx: from.left + from.width / 2 - (to.left + to.width / 2),
  dy: from.top + from.height / 2 - (to.top + to.height / 2)
});
const isVisible = (r) => r && r.width > 0 && r.bottom > 0 && r.top < innerHeight;

/** Fondo de la biblioteca: sólo en modo completo, y sólo con transform/opacity. */
function animateApp(app, origin, show) {
  if (!app || perfTier() === 'lite') return null;
  app.style.transformOrigin = origin;
  app.style.willChange = 'transform, opacity';
  const frames = [{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(1.18)', opacity: 0 }];
  return app.animate(show ? frames.reverse() : frames, { duration: show ? 760 : 820, easing: 'cubic-bezier(.5,0,.3,1)', fill: show ? 'none' : 'forwards' });
}
export function releaseApp(app) {
  if (!app) return;
  app.getAnimations().forEach((a) => a.cancel());
  app.style.willChange = '';
  app.style.transformOrigin = '';
}

export function startOpening({ book, source, target, app, className = '' }) {
  const rm = reducedMotion();
  const t = T();
  const stage = stageNode(book.section, className);
  const ob = closedBook(book, target);
  stage.appendChild(ob);
  const backdrop = stage.querySelector('.opening__backdrop');

  if (rm) {
    stage.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, fill: 'forwards' });
    return { ready: Promise.resolve(), open: (o) => openPhase({ stage, ob, ...o, rm }), abort: () => stage.remove() };
  }

  const srcRect = source?.getBoundingClientRect();
  const visible = isVisible(srcRect);
  const cx = visible ? srcRect.left + srcRect.width / 2 : innerWidth / 2;
  const cy = visible ? srcRect.top + srcRect.height / 2 : innerHeight / 2;

  // 1. La portada reacciona (sólo transform: barato).
  if (visible) {
    source.animate([{ transform: 'scale(1)' }, { transform: 'scale(.93)', offset: .4 }, { transform: 'scale(1.02)' }], { duration: 220, easing: 'ease-out' });
    setTimeout(() => { source.style.visibility = 'hidden'; }, 120);
    setTimeout(() => { source.style.visibility = ''; }, t.fly + 400);
  }

  // 2. Viaje de cámara: el fondo se abre como un círculo desde el libro.
  backdrop.style.transformOrigin = `${cx}px ${cy}px`;
  backdrop.animate([{ opacity: 0, transform: 'scale(.2)' }, { opacity: 1, transform: 'scale(1)' }],
    { duration: t.fly * 0.75, delay: 60, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'both' });
  if (app) {
    const appRect = app.getBoundingClientRect();
    animateApp(app, `${cx - appRect.left}px ${cy - appRect.top}px`, false);
  }

  const { s, dx, dy } = visible ? flip(srcRect, target) : { s: .35, dx: 0, dy: innerHeight * .25 };
  const fly = ob.animate([
    { transform: `translate(${dx}px, ${dy}px) scale(${s})`, opacity: visible ? 1 : 0 },
    { transform: `translate(${dx * .35}px, ${dy * .35 - 24}px) scale(${(s + 1) / 2}) rotateY(-24deg) rotateX(10deg)`, opacity: 1, offset: .5 },
    { transform: 'translate(0, 0) scale(1) rotateY(-8deg) rotateX(4deg)', opacity: 1 }
  ], { duration: t.fly, delay: 80, easing: EASE_FLY, fill: 'both' });
  watchFrames(t.fly);

  return {
    ready: wait(fly),
    open: (o) => openPhase({ stage, ob, ...o, rm: false }),
    abort: () => { stage.remove(); releaseApp(app); }
  };
}

async function openPhase({ stage, ob, leftHTML, rightHTML, spread, rm }) {
  ob.querySelector('.ob__back').innerHTML = leftHTML;
  ob.querySelector('.ob__pages').innerHTML = rightHTML;
  const cover = ob.querySelector('.ob__cover');
  const w = ob.offsetWidth;
  const t = T();

  if (rm) {
    ob.style.transform = spread ? `translateX(${w / 2}px)` : '';
    cover.style.transform = 'rotateY(-180deg)';
    if (!spread) cover.style.opacity = '0';
    return finish(stage);
  }
  const settle = ob.animate([
    { transform: 'rotateY(-8deg) rotateX(4deg)' },
    { transform: `translateX(${spread ? w / 2 : 0}px)` }
  ], { duration: t.open, easing: EASE_OPEN, fill: 'forwards' });
  const coverAnim = cover.animate(spread
    ? [{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(-180deg)' }]
    : [{ transform: 'rotateY(0deg)', opacity: 1 }, { transform: 'rotateY(-95deg)', opacity: 1, offset: .55 }, { transform: 'rotateY(-160deg)', opacity: 0 }],
  { duration: t.open, easing: EASE_OPEN, fill: 'forwards' });
  const fade = [{ opacity: 1 }, { opacity: 0 }];
  ob.querySelector('.ob__edge').animate(fade, { duration: 400, delay: t.open * .4, fill: 'forwards' });
  ob.querySelector('.ob__block').animate(fade, { duration: 400, delay: t.open * .4, fill: 'forwards' });
  await Promise.all([wait(settle), wait(coverAnim)]);
  return finish(stage);
}

function finish(stage) {
  return {
    reveal() {
      stage.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: 'ease-out', fill: 'forwards' }).finished.then(() => stage.remove());
    }
  };
}

/** Cierre: el libro se cierra y vuelve volando a su tarjeta (o se aleja si no está a la vista). */
export async function playClosing({ book, pageRect, spread, leftHTML, rightHTML, target, app, readerEl, className = '' }) {
  if (app) app.style.visibility = '';
  if (reducedMotion()) {
    await wait(readerEl.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' }));
    releaseApp(app);
    return;
  }
  const t = T();
  const stage = stageNode(book.section, className);
  const ob = closedBook(book, pageRect, { leftHTML, rightHTML });
  stage.appendChild(ob);
  const cover = ob.querySelector('.ob__cover');
  const w = pageRect.width;
  const shiftX = spread ? -w / 2 : 0;
  readerEl.style.visibility = 'hidden';

  const close1 = ob.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${shiftX}px) rotateY(-10deg) rotateX(4deg)` }],
    { duration: t.close, easing: EASE_OPEN, fill: 'forwards' });
  const c1 = cover.animate(spread ? [{ transform: 'rotateY(-180deg)' }, { transform: 'rotateY(0deg)' }]
    : [{ transform: 'rotateY(-160deg)', opacity: 0 }, { transform: 'rotateY(-95deg)', opacity: 1, offset: .45 }, { transform: 'rotateY(0deg)', opacity: 1 }],
  { duration: t.close, easing: EASE_OPEN, fill: 'forwards' });
  const appear = [{ opacity: 0 }, { opacity: 1 }];
  ob.querySelector('.ob__edge').animate(appear, { duration: 300, delay: t.close / 2, fill: 'both' });
  ob.querySelector('.ob__block').animate(appear, { duration: 300, delay: t.close / 2, fill: 'both' });
  await Promise.all([wait(close1), wait(c1)]);

  const tr = target?.getBoundingClientRect();
  const visible = isVisible(tr);
  const centered = { left: pageRect.left + shiftX, top: pageRect.top, width: pageRect.width, height: pageRect.height };
  const { s, dx, dy } = visible ? flip(tr, centered) : { s: .3, dx: 0, dy: innerHeight * .3 };
  if (visible) target.style.visibility = 'hidden';
  releaseApp(app);
  if (app) {
    const appRect = app.getBoundingClientRect();
    animateApp(app, visible ? `${tr.left + tr.width / 2 - appRect.left}px ${tr.top + tr.height / 2 - appRect.top}px` : 'center', true);
  }
  const fly = ob.animate([
    { transform: `translateX(${shiftX}px) rotateY(-10deg) rotateX(4deg)`, opacity: 1 },
    { transform: `translate(${shiftX + dx * .5}px, ${dy * .5 - 20}px) scale(${(1 + s) / 2}) rotateY(-20deg) rotateX(8deg)`, opacity: 1, offset: .5 },
    { transform: `translate(${shiftX + dx}px, ${dy}px) scale(${s})`, opacity: visible ? 1 : 0 }
  ], { duration: t.back, easing: 'cubic-bezier(.5,0,.2,1)', fill: 'forwards' });
  const bd = stage.querySelector('.opening__backdrop');
  bd.style.transformOrigin = visible ? `${tr.left + tr.width / 2}px ${tr.top + tr.height / 2}px` : 'center';
  bd.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(1.05)' }], { duration: t.back * .8, delay: t.back * .15, fill: 'forwards' });
  await wait(fly);
  if (visible) target.style.visibility = '';
  if (app) await Promise.all(app.getAnimations().map(wait));
  releaseApp(app);
  stage.remove();
}
