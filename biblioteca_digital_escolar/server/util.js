'use strict';

class HttpError extends Error {
  constructor(status, message, fields) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

const TZ = process.env.APP_TZ || 'America/Argentina/Buenos_Aires';

/** Fecha local 'YYYY-MM-DD' (zona horaria de la escuela). */
function today(offsetDays = 0) {
  const d = new Date(Date.now() + offsetDays * 86400000);
  return d.toLocaleDateString('en-CA', { timeZone: TZ });
}

const GENRES = [
  'Cuento', 'Fantasía', 'Aventura', 'Valores', 'Naturaleza', 'Ciencia',
  'Misterio', 'Policial', 'Ciencia ficción', 'Exploración', 'Historia',
  'Terror', 'Suspenso', 'Novela', 'Humor', 'Poesía'
];

const SCENES = [
  'dragon', 'luna', 'huerta', 'tortuga', 'reloj', 'cohete', 'pinguino', 'cabildo',
  'casona', 'llave', 'robot', 'faro', 'bosque', 'castillo', 'montanas', 'oceano',
  'escuela', 'barco', 'ciudad', 'isla'
];

const AVATARS = ['zorro', 'buho', 'gato', 'oso', 'conejo', 'pinguino', 'leon', 'rana'];

const sectionForGrade = (g) => (g <= 3 ? 1 : g <= 5 ? 2 : 3);

/**
 * Validación declarativa de formularios.
 * spec: { campo: { type, label, required, min, max, pattern, values, patternMsg } }
 * Devuelve un objeto limpio o lanza HttpError 400 con los errores por campo.
 */
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
      case 'string': {
        if (typeof val !== 'string') { fields[key] = `${label} no es válido.`; break; }
        val = rule.raw ? val.replace(/\r\n/g, '\n') : val.trim().replace(/\s+/g, ' ');
        if (rule.min && val.trim().length < rule.min) fields[key] = `${label} debe tener al menos ${rule.min} caracteres.`;
        else if (rule.max && val.length > rule.max) fields[key] = `${label} admite como máximo ${rule.max} caracteres.`;
        else if (rule.pattern && !rule.pattern.test(val)) fields[key] = rule.patternMsg || `${label} no tiene un formato válido.`;
        else out[key] = val;
        break;
      }
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
      case 'bool':
        out[key] = val === true || val === 'true' || val === 1;
        break;
      case 'enum':
        if (!rule.values.includes(val)) fields[key] = `${label} no es una opción válida.`;
        else out[key] = val;
        break;
      case 'array':
        if (!Array.isArray(val)) fields[key] = `${label} debe ser una lista.`;
        else if (rule.min && val.length < rule.min) fields[key] = `${label} debe tener al menos ${rule.min} elemento(s).`;
        else if (rule.max && val.length > rule.max) fields[key] = `${label} admite como máximo ${rule.max} elementos.`;
        else out[key] = val;
        break;
      default:
        out[key] = val;
    }
  }
  if (Object.keys(fields).length) {
    throw new HttpError(400, Object.values(fields)[0], fields);
  }
  return out;
}

const parseId = (v) => {
  const n = Number(v);
  if (!Number.isInteger(n) || n <= 0) throw new HttpError(400, 'Identificador inválido.');
  return n;
};

function slugify(text) {
  return String(text)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'libro';
}

const countWords = (text) => (String(text).match(/\S+/g) || []).length;

module.exports = { HttpError, validate, parseId, slugify, countWords, today, GENRES, SCENES, AVATARS, sectionForGrade, TZ };
