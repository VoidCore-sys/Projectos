/** Estado global mínimo: usuario actual y metadatos del catálogo. */
const listeners = new Set();
export const store = {
  user: null,
  meta: null,
  config: { registration: true, schoolCodeRequired: false },
  set(patch) {
    Object.assign(this, patch);
    listeners.forEach((fn) => fn(this));
  },
  subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
};

export const isStaff = () => ['teacher', 'admin'].includes(store.user?.role);
export const isAdmin = () => store.user?.role === 'admin';

/** Preferencias locales del lector (comodidad por dispositivo, no datos importantes). */
export const prefs = {
  get(key, fallback) {
    try { const v = localStorage.getItem(`bd.${key}`); return v === null ? fallback : JSON.parse(v); } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(`bd.${key}`, JSON.stringify(value)); } catch { /* almacenamiento no disponible */ }
  }
};
