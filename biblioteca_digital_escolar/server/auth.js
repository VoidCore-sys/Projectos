'use strict';
/**
 * Autenticación: contraseñas con scrypt + sal aleatoria, sesiones del lado
 * del servidor (el navegador sólo guarda un token aleatorio en una cookie
 * httpOnly; la base guarda su hash SHA-256).
 */
const crypto = require('crypto');
const { one, run } = require('./db');
const { HttpError } = require('./util');

const COOKIE = 'bd_session';
const SESSION_DAYS = 14;
const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 64 };

function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, SCRYPT.keylen, { N: SCRYPT.N, r: SCRYPT.r, p: SCRYPT.p });
  return `scrypt$${SCRYPT.N}$${salt.toString('base64')}$${hash.toString('base64')}`;
}

function verifyPassword(password, stored) {
  try {
    const [algo, N, saltB64, hashB64] = String(stored).split('$');
    if (algo !== 'scrypt') return false;
    const expected = Buffer.from(hashB64, 'base64');
    const actual = crypto.scryptSync(password, Buffer.from(saltB64, 'base64'), expected.length, { N: Number(N), r: SCRYPT.r, p: SCRYPT.p });
    return crypto.timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

/** Reglas de contraseña: alumnos ≥ 6 caracteres; docentes y admin ≥ 8. Siempre letras y números. */
function passwordProblem(password, role = 'student') {
  const min = role === 'student' ? 6 : 8;
  if (typeof password !== 'string' || password.length < min) return `La contraseña debe tener al menos ${min} caracteres.`;
  if (password.length > 128) return 'La contraseña es demasiado larga.';
  if (!/[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(password) || !/\d/.test(password)) return 'La contraseña debe combinar letras y números.';
  return null;
}

const sha256 = (t) => crypto.createHash('sha256').update(t).digest('hex');

function parseCookies(header = '') {
  const out = {};
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

function cookieAttrs(req, maxAgeSec) {
  const secure = req.secure || process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSec}${secure}`;
}

function createSession(req, res, userId) {
  const token = crypto.randomBytes(32).toString('base64url');
  const expires = Date.now() + SESSION_DAYS * 86400000;
  run('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)', sha256(token), userId, expires);
  run('DELETE FROM sessions WHERE expires_at < ?', Date.now());
  res.setHeader('Set-Cookie', `${COOKIE}=${token}${cookieAttrs(req, SESSION_DAYS * 86400)}`);
}

function destroySession(req, res) {
  const token = parseCookies(req.headers.cookie)[COOKIE];
  if (token) run('DELETE FROM sessions WHERE token_hash = ?', sha256(token));
  res.setHeader('Set-Cookie', `${COOKIE}=${cookieAttrs(req, 0)}`);
}

/** Middleware: si hay una sesión válida, deja el usuario en req.user. */
function loadUser(req, res, next) {
  const token = parseCookies(req.headers.cookie)[COOKIE];
  if (token) {
    const row = one(`SELECT u.id, u.username, u.display_name, u.role, u.grade, u.avatar, u.created_at, s.expires_at, s.token_hash
                     FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ?`, sha256(token));
    if (row && row.expires_at > Date.now()) {
      req.user = row;
      // Renovación deslizante: si quedan menos de 7 días, se extiende.
      if (row.expires_at - Date.now() < 7 * 86400000) {
        run('UPDATE sessions SET expires_at = ? WHERE token_hash = ?', Date.now() + SESSION_DAYS * 86400000, row.token_hash);
      }
    } else if (row) {
      run('DELETE FROM sessions WHERE token_hash = ?', row.token_hash);
    }
  }
  next();
}

function requireAuth(req, res, next) {
  if (!req.user) return next(new HttpError(401, 'Tenés que iniciar sesión.'));
  next();
}

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return next(new HttpError(401, 'Tenés que iniciar sesión.'));
  if (!roles.includes(req.user.role)) return next(new HttpError(403, 'No tenés permiso para realizar esta acción.'));
  next();
};

/** Limitador de intentos en memoria (por IP + clave). */
function rateLimiter({ windowMs, max, message }) {
  const hits = new Map();
  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
  }, windowMs).unref();
  return (key) => {
    const now = Date.now();
    let entry = hits.get(key);
    if (!entry || entry.reset < now) { entry = { count: 0, reset: now + windowMs }; hits.set(key, entry); }
    entry.count++;
    if (entry.count > max) {
      const mins = Math.ceil((entry.reset - now) / 60000);
      throw new HttpError(429, message.replace('{min}', mins));
    }
    return () => hits.delete(key); // permite limpiar tras un inicio correcto
  };
}

const publicUser = (u) => u && ({
  id: u.id, username: u.username, displayName: u.display_name, role: u.role,
  grade: u.grade, avatar: u.avatar, createdAt: u.created_at
});

module.exports = {
  hashPassword, verifyPassword, passwordProblem, createSession, destroySession,
  loadUser, requireAuth, requireRole, rateLimiter, publicUser
};
