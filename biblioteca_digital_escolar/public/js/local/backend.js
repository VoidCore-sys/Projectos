/**
 * "Servidor" de la versión de un solo archivo: implementa la misma API que el servidor Node
 * (mismas rutas, validaciones, permisos, logros, recomendaciones y estadísticas),
 * pero corre dentro de la página y guarda en el almacenamiento elegido por store.js.
 */
import SEED_BOOKS from '../../../build/books.json';
import { openStore } from './store.js';
import { pbkdf2Sha256 } from './pbkdf2.js';

export class HttpError extends Error {
  constructor(status, message, fields) { super(message); this.status = status; this.fields = fields; }
}

/* ------------------------------ Constantes ------------------------------ */
const GENRES = ['Cuento', 'Fantasía', 'Aventura', 'Valores', 'Naturaleza', 'Ciencia', 'Misterio', 'Policial', 'Ciencia ficción', 'Exploración', 'Historia', 'Terror', 'Suspenso', 'Novela', 'Humor', 'Poesía'];
const SCENES = ['dragon', 'luna', 'huerta', 'tortuga', 'reloj', 'cohete', 'pinguino', 'cabildo', 'casona', 'llave', 'robot', 'faro', 'bosque', 'castillo', 'montanas', 'oceano', 'escuela', 'barco', 'ciudad', 'isla'];
const AVATARS = ['zorro', 'buho', 'gato', 'oso', 'conejo', 'pinguino', 'leon', 'rana'];
const SECTIONS = [
  { id: 1, name: 'El Bosque de los Cuentos', grades: '1.º, 2.º y 3.º grado', tagline: 'Cuentos, fantasía y aventuras para dar los primeros pasos como lectores.' },
  { id: 2, name: 'La Isla de los Aventureros', grades: '4.º y 5.º grado', tagline: 'Misterios, exploraciones, ciencia ficción e historia para mentes curiosas.' },
  { id: 3, name: 'El Observatorio', grades: '6.º y 7.º grado', tagline: 'Suspenso, terror, novelas y tramas complejas para lectores expertos.' }
];
const WPM = { 1: 70, 2: 110, 3: 140 };
const TZ = 'America/Argentina/Buenos_Aires';
const DEMO = [
  { username: 'admin', displayName: 'Dirección', role: 'admin', password: 'Admin2026', avatar: 'buho' },
  { username: 'docente', displayName: 'Seño Laura', role: 'teacher', password: 'Docente2026', avatar: 'oso' },
  { username: 'alumno', displayName: 'Valentín', role: 'student', grade: 4, password: 'alumno1', avatar: 'zorro' }
];
const SESSION_KEY = 'bde.sesion.v1';

const nowSql = () => new Date().toISOString().replace('T', ' ').slice(0, 19);
const today = (offset = 0) => new Date(Date.now() + offset * 86400000).toLocaleDateString('en-CA', { timeZone: TZ });
const sectionForGrade = (g) => (g <= 3 ? 1 : g <= 5 ? 2 : 3);
const countWords = (t) => (String(t).match(/\S+/g) || []).length;
const fold = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const newId = () => Date.now() * 10 + Math.floor(Math.random() * 10);

/* ------------------------------ Contraseñas ------------------------------ */
const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
// WebCrypto sólo existe en "contextos seguros" (https, localhost, archivos locales en la mayoría
// de los navegadores). Si no está, se usa la implementación propia, que da el mismo resultado.
async function pbkdf2(password, salt, iterations) {
  const subtle = globalThis.crypto?.subtle;
  if (subtle?.importKey) {
    try {
      const key = await subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
      return await subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256);
    } catch { /* se usa el respaldo */ }
  }
  await new Promise((r) => setTimeout(r, 0)); // deja dibujar el indicador de carga antes del cálculo
  return pbkdf2Sha256(new TextEncoder().encode(password), salt, iterations);
}
function randomBytes(n) {
  const out = new Uint8Array(n);
  if (globalThis.crypto?.getRandomValues) return globalThis.crypto.getRandomValues(out);
  for (let i = 0; i < n; i++) out[i] = Math.floor(Math.random() * 256);
  return out;
}
async function hashPassword(password) {
  const salt = randomBytes(16);
  const iterations = 120000;
  return { algo: 'pbkdf2-sha256', iterations, salt: b64(salt), hash: b64(await pbkdf2(password, salt, iterations)) };
}
async function verifyPassword(password, rec) {
  if (!rec?.salt) { await pbkdf2(password, new Uint8Array(16), 120000); return false; }
  const got = new Uint8Array(await pbkdf2(password, unb64(rec.salt), rec.iterations));
  const exp = unb64(rec.hash);
  let diff = got.length ^ exp.length;
  for (let i = 0; i < Math.min(got.length, exp.length); i++) diff |= got[i] ^ exp[i];
  return diff === 0;
}
function passwordProblem(password, role = 'student') {
  const min = role === 'student' ? 6 : 8;
  if (typeof password !== 'string' || password.length < min) return `La contraseña debe tener al menos ${min} caracteres.`;
  if (password.length > 128) return 'La contraseña es demasiado larga.';
  if (!/[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(password) || !/\d/.test(password)) return 'La contraseña debe combinar letras y números.';
  return null;
}

/* ------------------------------ Validación ------------------------------ */
function validate(body, spec) {
  const out = {};
  const fields = {};
  const src = body && typeof body === 'object' ? body : {};
  for (const [key, rule] of Object.entries(spec)) {
    const label = rule.label || key;
    let val = src[key];
    const empty = val === undefined || val === null || (typeof val === 'string' && val.trim() === '');
    if (empty) {
      if (rule.required) fields[key] = `${label} es obligatorio.`;
      else if (rule.default !== undefined) out[key] = rule.default;
      continue;
    }
    switch (rule.type) {
      case 'string':
        if (typeof val !== 'string') { fields[key] = `${label} no es válido.`; break; }
        val = rule.raw ? val : val.trim().replace(/\s+/g, ' ');
        if (rule.min && val.trim().length < rule.min) fields[key] = `${label} debe tener al menos ${rule.min} caracteres.`;
        else if (rule.max && val.length > rule.max) fields[key] = `${label} admite como máximo ${rule.max} caracteres.`;
        else if (rule.pattern && !rule.pattern.test(val)) fields[key] = rule.patternMsg || `${label} no tiene un formato válido.`;
        else out[key] = val;
        break;
      case 'int': {
        const n = Number(val);
        if (!Number.isInteger(n)) fields[key] = `${label} debe ser un número entero.`;
        else if (rule.min !== undefined && n < rule.min) fields[key] = `${label} debe ser como mínimo ${rule.min}.`;
        else if (rule.max !== undefined && n > rule.max) fields[key] = `${label} debe ser como máximo ${rule.max}.`;
        else out[key] = n;
        break;
      }
      case 'number': {
        const n = Number(val);
        if (!Number.isFinite(n)) fields[key] = `${label} debe ser un número.`;
        else out[key] = Math.min(rule.max ?? n, Math.max(rule.min ?? n, n));
        break;
      }
      case 'bool': out[key] = val === true || val === 'true' || val === 1; break;
      case 'enum': if (!rule.values.includes(val)) fields[key] = `${label} no es una opción válida.`; else out[key] = val; break;
      case 'array':
        if (!Array.isArray(val)) fields[key] = `${label} debe ser una lista.`;
        else if (rule.min && val.length < rule.min) fields[key] = `${label} debe tener al menos ${rule.min} elemento(s).`;
        else if (rule.max && val.length > rule.max) fields[key] = `${label} admite como máximo ${rule.max} elementos.`;
        else out[key] = val;
        break;
      default: out[key] = val;
    }
  }
  if (Object.keys(fields).length) throw new HttpError(400, Object.values(fields)[0], fields);
  return out;
}
const USERNAME = { type: 'string', label: 'El nombre de usuario', required: true, min: 3, max: 20, pattern: /^[a-zA-Z0-9._-]+$/, patternMsg: 'El usuario sólo puede tener letras sin acentos, números, punto, guion o guion bajo.' };
const DISPLAY = { type: 'string', label: 'El nombre para mostrar', required: true, min: 2, max: 40, pattern: /^[\p{L}\p{N} .'-]+$/u, patternMsg: 'El nombre sólo puede tener letras, números y espacios.' };
const parseId = (v) => { const n = Number(v); if (!Number.isInteger(n) || n <= 0) throw new HttpError(400, 'Identificador inválido.'); return n; };

function validateBookInput(body) {
  const data = validate(body, {
    title: { type: 'string', label: 'El título', required: true, min: 2, max: 90 },
    author: { type: 'string', label: 'El autor', required: true, min: 2, max: 80 },
    synopsis: { type: 'string', label: 'La sinopsis', required: true, min: 20, max: 700 },
    genres: { type: 'array', label: 'Los géneros', required: true, min: 1, max: 4 },
    gradeMin: { type: 'int', label: 'El grado mínimo', required: true, min: 1, max: 7 },
    gradeMax: { type: 'int', label: 'El grado máximo', required: true, min: 1, max: 7 },
    status: { type: 'enum', label: 'El estado', values: ['published', 'draft'], default: 'published' },
    featured: { type: 'bool', default: false },
    cover: { type: 'object', label: 'La portada', required: true },
    chapters: { type: 'array', label: 'Los capítulos', required: true, min: 1, max: 40 },
    quiz: { type: 'array', label: 'El cuestionario', default: [], max: 15 }
  });
  const fields = {};
  if (data.gradeMax < data.gradeMin) fields.gradeMax = 'El grado máximo no puede ser menor que el mínimo.';
  if (!data.genres.every((g) => GENRES.includes(g))) fields.genres = 'Hay un género no válido.';
  const cover = data.cover && typeof data.cover === 'object' ? data.cover : {};
  const color = /^#[0-9a-f]{6}$/i;
  if (!SCENES.includes(cover.scene) || !color.test(cover.c1 || '') || !color.test(cover.c2 || '')) fields.cover = 'Elegí una ilustración y dos colores válidos para la portada.';
  const chapters = data.chapters.map((c, i) => {
    const title = typeof c?.title === 'string' ? c.title.trim() : '';
    const content = typeof c?.content === 'string' ? c.content.replace(/\r\n/g, '\n').trim() : '';
    if (title.length < 1 || title.length > 100) fields[`chapters.${i}.title`] = `El capítulo ${i + 1} necesita un título (máx. 100 caracteres).`;
    if (content.length < 30) fields[`chapters.${i}.content`] = `El capítulo ${i + 1} es demasiado corto (mínimo 30 caracteres).`;
    if (content.length > 60000) fields[`chapters.${i}.content`] = `El capítulo ${i + 1} es demasiado largo.`;
    return { title, content, illustration: SCENES.includes(c?.illustration) ? c.illustration : null };
  });
  const quiz = data.quiz.map((q, i) => {
    const question = typeof q?.question === 'string' ? q.question.trim() : '';
    const options = Array.isArray(q?.options) ? q.options.map((o) => String(o ?? '').trim()).filter(Boolean) : [];
    const correct = Number(q?.correct);
    if (question.length < 5 || question.length > 300) fields[`quiz.${i}.question`] = `La pregunta ${i + 1} debe tener entre 5 y 300 caracteres.`;
    if (options.length < 2 || options.length > 5) fields[`quiz.${i}.options`] = `La pregunta ${i + 1} necesita entre 2 y 5 opciones.`;
    if (!Number.isInteger(correct) || correct < 0 || correct >= options.length) fields[`quiz.${i}.correct`] = `Marcá la respuesta correcta de la pregunta ${i + 1}.`;
    return { question, options: options.map((o) => o.slice(0, 200)), correct, explanation: typeof q?.explanation === 'string' ? q.explanation.trim().slice(0, 400) : '' };
  });
  if (Object.keys(fields).length) throw new HttpError(400, Object.values(fields)[0], fields);
  return { ...data, cover: { scene: cover.scene, c1: cover.c1, c2: cover.c2 }, chapters, quiz, section: sectionForGrade(data.gradeMin) };
}

/* ------------------------------ Estado ------------------------------ */
let store = null;
let ready = null;
let current = null; // cuenta con sesión iniciada
const attempts = new Map();

function init() {
  ready ||= (async () => {
    store = await openStore();
    if (store.mode === 'local' && !Object.keys(store.data.accounts).length) {
      for (const u of DEMO) {
        await store.saveAccount(newAccount({ ...u, pass: await hashPassword(u.password) }));
      }
    }
    restoreSession();
  })();
  return ready;
}

function newAccount({ username, displayName, role, grade, avatar, pass }) {
  return {
    id: newId(), username: username.toLowerCase(), displayName, role, grade: role === 'student' ? grade : null, avatar: avatar || 'zorro',
    pass, createdAt: nowSql(), lastLogin: null, progress: {}, favorites: {}, days: {}, quizzes: [], achievements: {}
  };
}

const accounts = () => Object.values(store.data.accounts);
const accountById = (id) => accounts().find((a) => a.id === id);
const fingerprint = (a) => a.pass?.hash?.slice(0, 16);

function restoreSession() {
  let s = null;
  try { s = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { s = null; }
  const acc = s && store.data.accounts[s.username];
  // Si la contraseña cambió en otro dispositivo, la sesión deja de valer.
  current = acc && fingerprint(acc) === s.fp && s.expires > Date.now() ? acc.username : null;
}
function setSession(acc) {
  current = acc ? acc.username : null;
  try {
    if (acc) localStorage.setItem(SESSION_KEY, JSON.stringify({ username: acc.username, fp: fingerprint(acc), expires: Date.now() + 14 * 86400000 }));
    else localStorage.removeItem(SESSION_KEY);
  } catch { /* sin almacenamiento: la sesión dura mientras la página esté abierta */ }
}
function me() {
  const acc = current && store.data.accounts[current];
  if (!acc) { current = null; return null; }
  return acc;
}
const publicUser = (a) => a && { id: a.id, username: a.username, displayName: a.displayName, role: a.role, grade: a.grade, avatar: a.avatar, createdAt: a.createdAt };
const save = (acc) => store.saveAccount(acc);

/* ------------------------------ Libros ------------------------------ */
function allBooks() {
  const map = new Map(SEED_BOOKS.map((b) => [b.id, b]));
  for (const b of Object.values(store.data.books)) {
    if (b.deleted) map.delete(b.id); else map.set(b.id, b);
  }
  return [...map.values()];
}
const findBook = (id) => allBooks().find((b) => b.id === id);
const readersOf = (id) => accounts().filter((a) => a.progress[id]).length;

function serialize(b) {
  const words = b.chapters.reduce((n, c) => n + countWords(c.content), 0);
  return {
    id: b.id, slug: b.slug, title: b.title, author: b.author, synopsis: b.synopsis, genres: b.genres, genre: b.genres[0] || 'Cuento',
    gradeMin: b.gradeMin, gradeMax: b.gradeMax, section: b.section, cover: b.cover, wordCount: words,
    readingMinutes: Math.max(3, Math.round(words / WPM[b.section])), chapterCount: b.chapters.length, status: b.status,
    featured: !!b.featured, license: b.license || 'Obra original', createdAt: b.createdAt, updatedAt: b.updatedAt || b.createdAt, readers: readersOf(b.id)
  };
}

function withUser(list, acc) {
  return list.map((b) => {
    const p = acc.progress[b.id];
    return { ...b, favorite: !!acc.favorites[b.id], progress: p ? { percent: p.percent, finished: !!p.finishedAt, chapter: p.chapter, updatedAt: p.updatedAt } : null };
  });
}

function listBooks({ q, genre, grade, section, sort = 'new', includeDrafts = false } = {}) {
  let list = allBooks().filter((b) => includeDrafts || b.status === 'published');
  if (q) { const f = fold(q); list = list.filter((b) => fold(`${b.title} ${b.author} ${b.synopsis} ${b.genres.join(' ')}`).includes(f)); }
  if (genre) list = list.filter((b) => b.genres.includes(genre));
  if (grade) list = list.filter((b) => grade >= b.gradeMin && grade <= b.gradeMax);
  if (section) list = list.filter((b) => b.section === section);
  const out = list.map(serialize);
  const cmp = {
    new: (a, b) => (b.createdAt > a.createdAt ? 1 : b.createdAt < a.createdAt ? -1 : b.id - a.id),
    title: (a, b) => a.title.localeCompare(b.title, 'es'),
    popular: (a, b) => b.readers - a.readers || a.title.localeCompare(b.title, 'es'),
    short: (a, b) => a.wordCount - b.wordCount
  }[sort] || (() => 0);
  return out.sort(cmp);
}

function fullBook(id, { answers = false } = {}) {
  const b = findBook(id);
  if (!b) return null;
  const quiz = (b.quiz || []).map((q) => (answers ? { ...q } : { question: q.question, options: q.options }));
  return { ...serialize(b), chapters: b.chapters.map((c, i) => ({ id: i + 1, ...c })), quiz, quizCount: quiz.length };
}

/* --------------------------- Logros y estadísticas --------------------------- */
const ACHIEVEMENTS = [
  ['primeros-pasos', 'Primeros pasos', 'Empezaste a leer tu primer libro.', 'book', (s) => s.started >= 1],
  ['primer-libro', '¡Primer libro!', 'Terminaste tu primer libro.', 'award', (s) => s.finished >= 1],
  ['lector-entusiasta', 'Lector entusiasta', 'Terminaste 3 libros.', 'trending', (s) => s.finished >= 3],
  ['raton-de-biblioteca', 'Ratón de biblioteca', 'Terminaste 5 libros.', 'library', (s) => s.finished >= 5],
  ['gran-lector', 'Gran lector', 'Terminaste 10 libros.', 'crown', (s) => s.finished >= 10],
  ['explorador-de-generos', 'Explorador de géneros', 'Terminaste libros de 3 géneros distintos.', 'compass', (s) => s.genres >= 3],
  ['viajero-de-secciones', 'Viajero de la biblioteca', 'Leíste libros de las tres secciones.', 'map', (s) => s.sections >= 3],
  ['corazon-lector', 'Corazón lector', 'Guardaste tu primer libro favorito.', 'heart', (s) => s.favorites >= 1],
  ['mente-brillante', 'Mente brillante', 'Respondiste un cuestionario sin errores.', 'star', (s) => s.perfectQuizzes >= 1],
  ['detective-de-palabras', 'Detective de palabras', 'Completaste cuestionarios de 3 libros.', 'search', (s) => s.quizBooks >= 3],
  ['racha-3', 'Racha de 3 días', 'Leíste 3 días seguidos.', 'flame', (s) => s.bestStreak >= 3],
  ['racha-7', 'Semana lectora', 'Leíste 7 días seguidos.', 'flame', (s) => s.bestStreak >= 7],
  ['hora-de-lectura', 'Una hora de magia', 'Sumaste 60 minutos de lectura.', 'clock', (s) => s.minutes >= 60],
  ['maratonista', 'Maratonista', 'Sumaste 5 horas de lectura.', 'zap', (s) => s.minutes >= 300]
].map(([code, title, description, icon, test]) => ({ code, title, description, icon, test }));

function daySeconds(acc, day) { return Object.values(acc.days[day] || {}).reduce((n, s) => n + s, 0); }

function streaks(acc) {
  const days = Object.keys(acc.days).filter((d) => daySeconds(acc, d) > 0).sort();
  const set = new Set(days);
  let current = 0;
  const offset = set.has(today()) ? 0 : set.has(today(-1)) ? -1 : null;
  if (offset !== null) while (set.has(today(offset - current))) current++;
  let best = 0; let run = 0; let prev = null;
  for (const d of days) {
    const t = Date.parse(d + 'T12:00:00Z');
    run = prev !== null && Math.round((t - prev) / 86400000) === 1 ? run + 1 : 1;
    best = Math.max(best, run); prev = t;
  }
  return { current, best, daysRead: days.length };
}

function userStats(acc) {
  const prog = Object.entries(acc.progress);
  const fin = prog.filter(([, p]) => p.finishedAt);
  const finBooks = fin.map(([id]) => findBook(Number(id))).filter(Boolean);
  const q = acc.quizzes;
  const st = streaks(acc);
  return {
    started: prog.length,
    finished: fin.length,
    minutes: Math.round(prog.reduce((n, [, p]) => n + (p.secondsRead || 0), 0) / 60),
    genres: new Set(finBooks.map((b) => b.genres[0])).size,
    sections: new Set(finBooks.map((b) => b.section)).size,
    favorites: Object.keys(acc.favorites).length,
    quizAttempts: q.length,
    quizBooks: new Set(q.map((x) => x.bookId)).size,
    perfectQuizzes: q.filter((x) => x.score === x.total).length,
    quizAverage: q.length ? Math.round(q.reduce((n, x) => n + x.score * 100 / x.total, 0) / q.length) : null,
    streak: st.current, bestStreak: st.best, daysRead: st.daysRead
  };
}

function evaluate(acc) {
  const s = userStats(acc);
  const unlocked = [];
  for (const a of ACHIEVEMENTS) {
    if (!acc.achievements[a.code] && a.test(s)) {
      acc.achievements[a.code] = nowSql();
      unlocked.push({ code: a.code, title: a.title, description: a.description, icon: a.icon, unlockedAt: null });
    }
  }
  return unlocked;
}
const listAchievements = (acc) => ACHIEVEMENTS.map((a) => ({ code: a.code, title: a.title, description: a.description, icon: a.icon, unlockedAt: acc.achievements[a.code] || null }));

function activity(accs, days) {
  const since = today(-(days));
  const map = new Map();
  for (const a of accs) {
    for (const [d, books] of Object.entries(a.days)) {
      if (d < since) continue;
      const e = map.get(d) || { s: 0, readers: new Set() };
      const secs = Object.values(books).reduce((n, x) => n + x, 0);
      e.s += secs; if (secs) e.readers.add(a.id);
      map.set(d, e);
    }
  }
  return [...map.entries()].sort().map(([day, e]) => ({ day, minutes: Math.round(e.s / 60), readers: e.readers.size }));
}

function recommend(acc, limit = 10) {
  const books = listBooks({ sort: 'popular' });
  const affinity = new Map();
  const add = (genres, w) => genres.forEach((g, i) => affinity.set(g, (affinity.get(g) || 0) + (i === 0 ? w : w / 2)));
  for (const [id, p] of Object.entries(acc.progress)) { const b = findBook(Number(id)); if (b) add(b.genres, p.finishedAt ? 2 : 1); }
  for (const id of Object.keys(acc.favorites)) { const b = findBook(Number(id)); if (b) add(b.genres, 3); }
  const top = [...affinity.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  const maxR = Math.max(1, ...books.map((b) => b.readers));
  return books.filter((b) => !acc.progress[b.id]).map((b) => {
    let score = 0;
    let reason = 'Elegido por la biblioteca';
    if (acc.grade) {
      if (acc.grade >= b.gradeMin && acc.grade <= b.gradeMax) { score += 6; reason = `Ideal para ${acc.grade}.º grado`; }
      else if (acc.grade === b.gradeMin - 1) { score += 2; reason = '¡Un desafío para crecer como lector!'; }
      else if (acc.grade > b.gradeMax) score += 0.5;
      else score -= 6;
    }
    const aff = b.genres.reduce((n, g) => n + (affinity.get(g) || 0), 0);
    if (aff > 0) {
      score += Math.min(6, aff * 1.2);
      const m = b.genres.find((g) => g === top) || b.genres.find((g) => affinity.has(g));
      if (m) reason = `Porque te gusta: ${m}`;
    }
    score += b.readers / maxR * 2 + (b.featured ? 1 : 0);
    return { ...b, reason, score };
  }).sort((a, b) => b.score - a.score).slice(0, limit).map(({ score, ...b }) => b);
}

/* ------------------------------- Rutas ------------------------------- */
const requireUser = () => { const a = me(); if (!a) throw new HttpError(401, 'Tenés que iniciar sesión.'); return a; };
const requireRole = (...roles) => { const a = requireUser(); if (!roles.includes(a.role)) throw new HttpError(403, 'No tenés permiso para realizar esta acción.'); return a; };
const isStaff = (a) => a.role === 'teacher' || a.role === 'admin';
function limiter(key, max, windowMs, msg) {
  const now = Date.now();
  let e = attempts.get(key);
  if (!e || e.reset < now) { e = { n: 0, reset: now + windowMs }; attempts.set(key, e); }
  if (++e.n > max) throw new HttpError(429, msg.replace('{min}', Math.ceil((e.reset - now) / 60000)));
  return () => attempts.delete(key);
}

const routes = [];
const on = (method, pattern, fn) => routes.push({ method, re: new RegExp('^' + pattern.replace(/:(\w+)/g, '(?<$1>[^/]+)') + '$'), fn });

on('GET', '/auth/me', () => ({ user: publicUser(me()), registration: true, schoolCodeRequired: false, demoAccounts: true, storage: store.mode }));

on('POST', '/auth/register', async ({ body }) => {
  const d = validate(body, {
    username: USERNAME, displayName: DISPLAY,
    password: { type: 'string', label: 'La contraseña', required: true, raw: true },
    grade: { type: 'int', label: 'El grado', required: true, min: 1, max: 7 },
    avatar: { type: 'enum', label: 'El avatar', values: AVATARS, default: 'zorro' }
  });
  const problem = passwordProblem(d.password, 'student');
  if (problem) throw new HttpError(400, problem, { password: problem });
  limiter('register', 15, 3600000, 'Se crearon demasiadas cuentas desde este equipo. Probá más tarde.');
  if (store.data.accounts[d.username.toLowerCase()]) throw new HttpError(409, 'Ese nombre de usuario ya existe. Elegí otro.', { username: 'Ese nombre de usuario ya existe.' });
  const acc = newAccount({ ...d, role: 'student', pass: await hashPassword(d.password) });
  acc.lastLogin = nowSql();
  await save(acc);
  setSession(acc);
  return { user: publicUser(acc) };
});

on('POST', '/auth/login', async ({ body }) => {
  const d = validate(body, {
    username: { type: 'string', label: 'El usuario', required: true, max: 40 },
    password: { type: 'string', label: 'La contraseña', required: true, raw: true, max: 200 }
  });
  const clear = limiter('login|' + d.username.toLowerCase(), 8, 15 * 60000, 'Demasiados intentos. Esperá {min} minuto(s) y volvé a probar.');
  const acc = store.data.accounts[d.username.toLowerCase()];
  const ok = await verifyPassword(d.password, acc?.pass);
  if (!acc || !ok) throw new HttpError(401, 'Usuario o contraseña incorrectos.');
  clear();
  acc.lastLogin = nowSql();
  setSession(acc);
  save(acc).catch(() => {});
  return { user: publicUser(acc) };
});

on('POST', '/auth/logout', () => { setSession(null); return { ok: true }; });

on('GET', '/meta', () => { requireUser(); return { genres: GENRES, scenes: SCENES, avatars: AVATARS, sections: SECTIONS }; });

on('GET', '/books', ({ query }) => {
  const acc = requireUser();
  const f = validate(query, {
    q: { type: 'string', max: 80 }, genre: { type: 'enum', values: GENRES }, grade: { type: 'int', min: 1, max: 7 },
    section: { type: 'int', min: 1, max: 3 }, sort: { type: 'enum', values: ['new', 'title', 'popular', 'short'], default: 'new' }
  });
  return { books: withUser(listBooks(f), acc) };
});

on('GET', '/home', () => {
  const acc = requireUser();
  const list = withUser(listBooks({ sort: 'new' }), acc);
  const cont = Object.entries(acc.progress).filter(([, p]) => !p.finishedAt).sort((a, b) => (b[1].updatedAt > a[1].updatedAt ? 1 : -1))
    .map(([id]) => list.find((b) => b.id === Number(id))).filter(Boolean).slice(0, 8);
  const featured = list.filter((b) => b.featured);
  return {
    continueReading: cont, newest: list.slice(0, 10), featured: featured.length ? featured : list.slice(0, 3),
    recommended: withUser(recommend(acc), acc), sections: SECTIONS.map((s) => ({ ...s, count: list.filter((b) => b.section === s.id).length }))
  };
});

on('GET', '/books/:id', ({ params }) => {
  const acc = requireUser();
  const id = parseId(params.id);
  const book = fullBook(id);
  if (!book || (book.status !== 'published' && !isStaff(acc))) throw new HttpError(404, 'No encontramos ese libro.');
  const p = acc.progress[id];
  const mine = acc.quizzes.filter((q) => q.bookId === id);
  const best = mine.length ? mine.reduce((a, b) => (b.score > a.score ? b : a)) : null;
  return {
    book: {
      ...book, favorite: !!acc.favorites[id],
      progress: p ? { chapter: p.chapter, paragraph: p.paragraph, page: p.page, totalPages: p.totalPages, percent: p.percent, finished: !!p.finishedAt, secondsRead: p.secondsRead, updatedAt: p.updatedAt } : null,
      bestQuiz: best ? { score: best.score, total: best.total } : null
    }
  };
});

on('PUT', '/progress/:id', async ({ params, body }) => {
  const acc = requireUser();
  const id = parseId(params.id);
  const book = findBook(id);
  if (!book) throw new HttpError(404, 'No encontramos ese libro.');
  const d = validate(body, {
    chapter: { type: 'int', required: true, min: 0, max: Math.max(0, book.chapters.length - 1) },
    paragraph: { type: 'int', required: true, min: 0, max: 100000 },
    page: { type: 'int', required: true, min: 0, max: 100000 },
    totalPages: { type: 'int', required: true, min: 1, max: 100000 },
    percent: { type: 'number', required: true, min: 0, max: 100 },
    seconds: { type: 'int', default: 0, min: 0, max: 100000 },
    finished: { type: 'bool', default: false }
  });
  const seconds = Math.min(d.seconds, 600);
  const prev = acc.progress[id];
  const justFinished = d.finished && !prev?.finishedAt;
  const now = nowSql();
  acc.progress[id] = {
    chapter: d.chapter, paragraph: d.paragraph, page: d.page, totalPages: d.totalPages,
    percent: prev?.finishedAt ? Math.max(prev.percent, d.percent) : d.percent,
    secondsRead: (prev?.secondsRead || 0) + seconds,
    timesFinished: (prev?.timesFinished || 0) + (justFinished ? 1 : 0),
    startedAt: prev?.startedAt || now, updatedAt: now,
    finishedAt: prev?.finishedAt || (d.finished ? now : null)
  };
  if (seconds > 0) {
    const day = today();
    acc.days[day] ||= {};
    acc.days[day][id] = (acc.days[day][id] || 0) + seconds;
    const keys = Object.keys(acc.days).sort();
    while (keys.length > 400) delete acc.days[keys.shift()];
  }
  const unlocked = evaluate(acc);
  await save(acc);
  return { ok: true, finished: justFinished, achievements: unlocked };
});

on('DELETE', '/progress/:id', async ({ params }) => {
  const acc = requireUser();
  const p = acc.progress[parseId(params.id)];
  if (p) { Object.assign(p, { chapter: 0, paragraph: 0, page: 0, percent: p.finishedAt ? p.percent : 0, updatedAt: nowSql() }); await save(acc); }
  return { ok: true };
});

on('PUT', '/favorites/:id', async ({ params }) => {
  const acc = requireUser();
  const id = parseId(params.id);
  if (!findBook(id)) throw new HttpError(404, 'No encontramos ese libro.');
  acc.favorites[id] ||= nowSql();
  const unlocked = evaluate(acc);
  await save(acc);
  return { favorite: true, achievements: unlocked };
});
on('DELETE', '/favorites/:id', async ({ params }) => {
  const acc = requireUser();
  delete acc.favorites[parseId(params.id)];
  await save(acc);
  return { favorite: false };
});

on('POST', '/books/:id/quiz', async ({ params, body }) => {
  const acc = requireUser();
  const id = parseId(params.id);
  const qs = findBook(id)?.quiz || [];
  if (!qs.length) throw new HttpError(404, 'Este libro todavía no tiene cuestionario.');
  const { answers } = validate(body, { answers: { type: 'array', label: 'Las respuestas', required: true, min: qs.length, max: qs.length } });
  const results = qs.map((q, i) => { const given = Number.isInteger(answers[i]) ? answers[i] : -1; return { correct: q.correct, given, ok: given === q.correct, explanation: q.explanation || '' }; });
  const score = results.filter((r) => r.ok).length;
  acc.quizzes.push({ bookId: id, score, total: qs.length, answers: results.map((r) => r.given), createdAt: nowSql() });
  if (acc.quizzes.length > 300) acc.quizzes.splice(0, acc.quizzes.length - 300);
  const unlocked = evaluate(acc);
  await save(acc);
  return { score, total: qs.length, results, achievements: unlocked };
});

/* ---------------------------- Perfil ---------------------------- */
on('PATCH', '/me', async ({ body }) => {
  const acc = requireUser();
  const d = validate(body, { displayName: DISPLAY, avatar: { type: 'enum', label: 'El avatar', values: AVATARS, required: true }, grade: { type: 'int', label: 'El grado', min: 1, max: 7 } });
  acc.displayName = d.displayName; acc.avatar = d.avatar;
  if (acc.role === 'student' && d.grade) acc.grade = d.grade;
  await save(acc);
  return { user: publicUser(acc) };
});

on('POST', '/me/password', async ({ body }) => {
  const acc = requireUser();
  const d = validate(body, { current: { type: 'string', label: 'La contraseña actual', required: true, raw: true }, next: { type: 'string', label: 'La nueva contraseña', required: true, raw: true } });
  if (!(await verifyPassword(d.current, acc.pass))) throw new HttpError(400, 'La contraseña actual no es correcta.', { current: 'La contraseña actual no es correcta.' });
  const problem = passwordProblem(d.next, acc.role);
  if (problem) throw new HttpError(400, problem, { next: problem });
  acc.pass = await hashPassword(d.next);
  await save(acc);
  setSession(acc);
  return { ok: true };
});

on('GET', '/me/library', () => {
  const acc = requireUser();
  const books = new Map(withUser(listBooks(), acc).map((b) => [b.id, b]));
  const history = Object.entries(acc.progress).filter(([id]) => books.has(Number(id))).sort((a, b) => (b[1].updatedAt > a[1].updatedAt ? 1 : -1))
    .map(([id, p]) => ({ book: books.get(Number(id)), chapter: p.chapter, page: p.page, totalPages: p.totalPages, percent: p.percent, minutes: Math.round((p.secondsRead || 0) / 60), startedAt: p.startedAt, updatedAt: p.updatedAt, finishedAt: p.finishedAt, timesFinished: p.timesFinished }));
  const favorites = Object.entries(acc.favorites).sort((a, b) => (b[1] > a[1] ? 1 : -1)).map(([id]) => books.get(Number(id))).filter(Boolean);
  return { inProgress: history.filter((h) => !h.finishedAt), finished: history.filter((h) => h.finishedAt), favorites, history };
});

on('GET', '/me/stats', () => {
  const acc = requireUser();
  const byBook = new Map();
  for (const q of acc.quizzes) {
    const e = byBook.get(q.bookId) || { book_id: q.bookId, title: findBook(q.bookId)?.title || 'Libro eliminado', score: 0, total: q.total, attempts: 0, last: '' };
    e.score = Math.max(e.score, q.score); e.attempts++; if (q.createdAt > e.last) e.last = q.createdAt;
    byBook.set(q.bookId, e);
  }
  return { stats: userStats(acc), achievements: listAchievements(acc), activity: activity([acc], 30), quizzes: [...byBook.values()].sort((a, b) => (b.last > a.last ? 1 : -1)) };
});

/* ---------------------------- Docentes ---------------------------- */
const students = () => accounts().filter((a) => a.role === 'student');
const lastRead = (a) => Object.values(a.progress).reduce((m, p) => (p.updatedAt > m ? p.updatedAt : m), '') || null;

on('GET', '/teacher/students', ({ query }) => {
  requireRole('teacher', 'admin');
  const { grade } = validate(query, { grade: { type: 'int', min: 1, max: 7 } });
  const list = students().filter((s) => !grade || s.grade === grade).sort((a, b) => a.grade - b.grade || a.displayName.localeCompare(b.displayName, 'es'));
  return {
    students: list.map((s) => {
      const st = userStats(s);
      return { id: s.id, username: s.username, displayName: s.displayName, grade: s.grade, avatar: s.avatar, createdAt: s.createdAt, lastLogin: s.lastLogin, lastRead: lastRead(s), started: st.started, finished: st.finished, minutes: st.minutes, quizAverage: st.quizAverage, achievements: Object.keys(s.achievements).length };
    })
  };
});

on('GET', '/teacher/students/:id', ({ params }) => {
  requireRole('teacher', 'admin');
  const s = accountById(parseId(params.id));
  if (!s || s.role !== 'student') throw new HttpError(404, 'No encontramos a ese alumno.');
  const reading = Object.entries(s.progress).sort((a, b) => (b[1].updatedAt > a[1].updatedAt ? 1 : -1)).map(([id, p]) => {
    const b = findBook(Number(id));
    return b && { bookId: b.id, title: b.title, cover: b.cover, genre: b.genres[0], chapter: p.chapter, chapters: b.chapters.length, percent: p.percent, minutes: Math.round((p.secondsRead || 0) / 60), startedAt: p.startedAt, updatedAt: p.updatedAt, finishedAt: p.finishedAt };
  }).filter(Boolean);
  const quizzes = [...s.quizzes].reverse().slice(0, 50).map((q) => ({ title: findBook(q.bookId)?.title || 'Libro eliminado', score: q.score, total: q.total, createdAt: q.createdAt }));
  return { student: publicUser(s), lastLogin: s.lastLogin, stats: userStats(s), achievements: listAchievements(s).filter((a) => a.unlockedAt), reading, quizzes, activity: activity([s], 30) };
});

on('POST', '/teacher/students/:id/password', async ({ params, body }) => {
  requireRole('teacher', 'admin');
  const s = accountById(parseId(params.id));
  if (!s || s.role !== 'student') throw new HttpError(404, 'No encontramos a ese alumno.');
  const { password } = validate(body, { password: { type: 'string', label: 'La contraseña', required: true, raw: true } });
  const problem = passwordProblem(password, 'student');
  if (problem) throw new HttpError(400, problem, { password: problem });
  s.pass = await hashPassword(password);
  await save(s);
  return { ok: true };
});

on('GET', '/teacher/stats', () => {
  requireRole('teacher', 'admin');
  const all = accounts();
  const studs = students();
  const progs = all.flatMap((a) => Object.entries(a.progress).map(([id, p]) => ({ a, id: Number(id), p })));
  const quizzes = all.flatMap((a) => a.quizzes);
  const books = listBooks();
  const seconds = progs.reduce((n, x) => n + (x.p.secondsRead || 0), 0);
  const weekAgo = today(-7);
  const topBooks = allBooks().map((b) => {
    const r = progs.filter((x) => x.id === b.id);
    return { id: b.id, title: b.title, section: b.section, cover: b.cover, readers: r.length, finished: r.filter((x) => x.p.finishedAt).length };
  }).filter((b) => b.readers).sort((a, b) => b.readers - a.readers || b.finished - a.finished).slice(0, 8);
  const grades = [...new Set(studs.map((s) => s.grade))].sort((a, b) => a - b);
  const byGrade = grades.map((g) => {
    const ss = studs.filter((s) => s.grade === g);
    const ps = ss.flatMap((s) => Object.values(s.progress));
    return { grade: g, students: ss.length, finished: ps.filter((p) => p.finishedAt).length, minutes: Math.round(ps.reduce((n, p) => n + (p.secondsRead || 0), 0) / 60) };
  });
  const genreCount = new Map();
  for (const x of progs) { const b = findBook(x.id); if (b) genreCount.set(b.genres[0], (genreCount.get(b.genres[0]) || 0) + 1); }
  return {
    totals: {
      students: studs.length, books: books.length, readings: progs.length, finished: progs.filter((x) => x.p.finishedAt).length, seconds,
      quizzes: quizzes.length, quiz_avg: quizzes.length ? Math.round(quizzes.reduce((n, q) => n + q.score * 100 / q.total, 0) / quizzes.length) : null,
      active_week: all.filter((a) => Object.keys(a.days).some((d) => d >= weekAgo && daySeconds(a, d) > 0)).length,
      minutes: Math.round(seconds / 60)
    },
    topBooks, byGrade,
    byGenre: [...genreCount.entries()].sort((a, b) => b[1] - a[1]).map(([genre, readings]) => ({ genre, readings })),
    activity: activity(all, 13)
  };
});

/* ---------------------------- Gestión de libros ---------------------------- */
function canEdit(acc, b) { return acc.role === 'admin' || b.createdBy === acc.id; }

on('GET', '/manage/books', () => {
  const acc = requireRole('teacher', 'admin');
  const names = new Map(accounts().map((a) => [a.id, a.displayName]));
  const raw = new Map(allBooks().map((b) => [b.id, b]));
  return { books: listBooks({ includeDrafts: true }).map((b) => ({ ...b, owner: names.get(raw.get(b.id).createdBy) || 'Biblioteca', canEdit: canEdit(acc, raw.get(b.id)) })) };
});

on('GET', '/manage/books/:id', ({ params }) => {
  const acc = requireRole('teacher', 'admin');
  const b = findBook(parseId(params.id));
  if (!b) throw new HttpError(404, 'No encontramos ese libro.');
  if (!canEdit(acc, b)) throw new HttpError(403, 'Sólo podés editar los libros que publicaste vos.');
  return { book: fullBook(b.id, { answers: true }) };
});

on('POST', '/manage/books', async ({ body }) => {
  const acc = requireRole('teacher', 'admin');
  const d = validateBookInput(body);
  const id = newId();
  const now = nowSql();
  const book = { id, slug: fold(d.title).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'libro', title: d.title, author: d.author, synopsis: d.synopsis, genres: d.genres, gradeMin: d.gradeMin, gradeMax: d.gradeMax, section: d.section, cover: d.cover, status: d.status, featured: acc.role === 'admin' && d.featured, license: 'Obra original', createdBy: acc.id, createdAt: now, updatedAt: now, chapters: d.chapters, quiz: d.quiz };
  await store.saveBook(book);
  return { id };
});

on('PUT', '/manage/books/:id', async ({ params, body }) => {
  const acc = requireRole('teacher', 'admin');
  const old = findBook(parseId(params.id));
  if (!old) throw new HttpError(404, 'No encontramos ese libro.');
  if (!canEdit(acc, old)) throw new HttpError(403, 'Sólo podés editar los libros que publicaste vos.');
  const d = validateBookInput(body);
  const book = { ...old, title: d.title, author: d.author, synopsis: d.synopsis, genres: d.genres, gradeMin: d.gradeMin, gradeMax: d.gradeMax, section: d.section, cover: d.cover, status: d.status, featured: acc.role === 'admin' ? d.featured : !!old.featured, chapters: d.chapters, quiz: d.quiz, updatedAt: nowSql() };
  await store.saveBook(book);
  return { id: book.id };
});

on('DELETE', '/manage/books/:id', async ({ params }) => {
  const acc = requireRole('teacher', 'admin');
  const b = findBook(parseId(params.id));
  if (!b) throw new HttpError(404, 'No encontramos ese libro.');
  if (!canEdit(acc, b)) throw new HttpError(403, 'Sólo podés editar los libros que publicaste vos.');
  await store.saveBook({ id: b.id, deleted: true });
  for (const a of accounts()) {
    if (a.progress[b.id] || a.favorites[b.id]) { delete a.progress[b.id]; delete a.favorites[b.id]; if (a.username === current) await save(a); }
  }
  return { ok: true };
});

/* ---------------------------- Usuarios (admin) ---------------------------- */
const ROLE_ORDER = { admin: 0, teacher: 1, student: 2 };
on('GET', '/admin/users', () => {
  requireRole('admin');
  const list = accounts().sort((a, b) => ROLE_ORDER[a.role] - ROLE_ORDER[b.role] || (a.grade || 0) - (b.grade || 0) || a.displayName.localeCompare(b.displayName, 'es'));
  return { users: list.map((u) => ({ ...publicUser(u), lastLogin: u.lastLogin, readings: Object.keys(u.progress).length })) };
});

on('POST', '/admin/users', async ({ body }) => {
  requireRole('admin');
  const d = validate(body, {
    username: USERNAME, displayName: DISPLAY, password: { type: 'string', label: 'La contraseña', required: true, raw: true },
    role: { type: 'enum', label: 'El rol', values: ['student', 'teacher', 'admin'], required: true },
    grade: { type: 'int', label: 'El grado', min: 1, max: 7 }, avatar: { type: 'enum', values: AVATARS, default: 'buho' }
  });
  if (d.role === 'student' && !d.grade) throw new HttpError(400, 'Indicá el grado del alumno.', { grade: 'Indicá el grado del alumno.' });
  const problem = passwordProblem(d.password, d.role);
  if (problem) throw new HttpError(400, problem, { password: problem });
  if (store.data.accounts[d.username.toLowerCase()]) throw new HttpError(409, 'Ese nombre de usuario ya existe.', { username: 'Ese nombre de usuario ya existe.' });
  const acc = newAccount({ ...d, pass: await hashPassword(d.password) });
  await save(acc);
  return { user: publicUser(acc) };
});

on('PATCH', '/admin/users/:id', async ({ params, body }) => {
  const admin = requireRole('admin');
  const u = accountById(parseId(params.id));
  if (!u) throw new HttpError(404, 'No encontramos a ese usuario.');
  const d = validate(body, {
    displayName: DISPLAY, role: { type: 'enum', label: 'El rol', values: ['student', 'teacher', 'admin'], required: true },
    grade: { type: 'int', label: 'El grado', min: 1, max: 7 }, password: { type: 'string', label: 'La contraseña', raw: true }
  });
  if (u.id === admin.id && d.role !== 'admin') throw new HttpError(400, 'No podés quitarte tu propio rol de administrador.');
  if (d.role === 'student' && !d.grade) throw new HttpError(400, 'Indicá el grado del alumno.', { grade: 'Indicá el grado del alumno.' });
  if (d.password) {
    const problem = passwordProblem(d.password, d.role);
    if (problem) throw new HttpError(400, problem, { password: problem });
    u.pass = await hashPassword(d.password);
  }
  Object.assign(u, { displayName: d.displayName, role: d.role, grade: d.role === 'student' ? d.grade : null });
  await save(u);
  if (u.id === admin.id) setSession(u);
  return { user: publicUser(u) };
});

on('DELETE', '/admin/users/:id', async ({ params }) => {
  const admin = requireRole('admin');
  const u = accountById(parseId(params.id));
  if (!u) throw new HttpError(404, 'No encontramos a ese usuario.');
  if (u.id === admin.id) throw new HttpError(400, 'No podés eliminar tu propia cuenta.');
  await store.deleteAccount(u.username);
  return { ok: true };
});

/** Punto de entrada: atiende una petición como lo haría el servidor. */
export async function handle(method, path, body) {
  await init();
  const [p, qs = ''] = path.split('?');
  const query = Object.fromEntries(new URLSearchParams(qs));
  for (const r of routes) {
    if (r.method !== method) continue;
    const m = p.match(r.re);
    if (m) return r.fn({ params: m.groups || {}, query, body });
  }
  throw new HttpError(404, 'Recurso no encontrado.');
}

export const storageMode = async () => { await init(); return store.mode; };
export const onStoreChange = async (fn) => { await init(); store.onChange(fn); };
