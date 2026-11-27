/**
 * Calidad de animación adaptable.
 *  - "full": efecto de cámara (la biblioteca se acerca) y animaciones completas.
 *  - "lite": misma secuencia del libro, pero sin animar la página de fondo, con duraciones
 *            más cortas y sin efectos costosos (desenfoques, sombras animadas, flotación).
 * En "auto" se elige según el equipo, y si una animación va lenta se pasa a "lite" sola.
 */
import { prefs } from './store.js';

let autoLite = false;

export function detectLite() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  const mem = navigator.deviceMemory || 8;
  const cores = navigator.hardwareConcurrency || 8;
  const touch = window.matchMedia('(pointer: coarse)').matches;
  return mem <= 4 || cores <= 4 || touch;
}

export const animSetting = () => prefs.get('animTier', 'auto');

export function perfTier() {
  const s = animSetting();
  if (s === 'full' || s === 'lite') return s;
  return autoLite || detectLite() ? 'lite' : 'full';
}

export function setAnimSetting(value) {
  prefs.set('animTier', value);
  applyTierClass();
}

export function applyTierClass() {
  document.documentElement.classList.toggle('lite', perfTier() === 'lite');
}

/**
 * Mide los cuadros por segundo reales durante una animación.
 * Si el equipo no llega a ~40 fps, las próximas animaciones usan el modo liviano.
 */
export function watchFrames(ms) {
  if (animSetting() !== 'auto' || perfTier() === 'lite') return;
  let frames = 0;
  const start = performance.now();
  const step = (t) => {
    frames++;
    if (t - start < ms) requestAnimationFrame(step);
    else if (frames / ((t - start) / 1000) < 40) { autoLite = true; applyTierClass(); }
  };
  requestAnimationFrame(step);
}

/** Ejecuta una tarea cuando el navegador está libre (después de las animaciones). */
export const whenIdle = (fn) => ('requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 600 }) : setTimeout(fn, 120));
