'use strict';
const express = require('express');
const { one, run } = require('../db');
const { HttpError, validate, AVATARS } = require('../util');
const {
  hashPassword, verifyPassword, passwordProblem, createSession, destroySession, rateLimiter, publicUser
} = require('../auth');

const router = express.Router();
const loginLimiter = rateLimiter({ windowMs: 15 * 60000, max: 8, message: 'Demasiados intentos. Esperá {min} minuto(s) y volvé a probar.' });
const registerLimiter = rateLimiter({ windowMs: 60 * 60000, max: 15, message: 'Se crearon demasiadas cuentas desde este equipo. Probá más tarde.' });

const USERNAME = { type: 'string', label: 'El nombre de usuario', required: true, min: 3, max: 20, pattern: /^[a-zA-Z0-9._-]+$/, patternMsg: 'El usuario sólo puede tener letras sin acentos, números, punto, guion o guion bajo.' };
const DISPLAY = { type: 'string', label: 'El nombre para mostrar', required: true, min: 2, max: 40, pattern: /^[\p{L}\p{N} .'-]+$/u, patternMsg: 'El nombre sólo puede tener letras, números y espacios.' };

router.post('/register', (req, res) => {
  if (process.env.ALLOW_REGISTRATION === 'false') throw new HttpError(403, 'El registro está deshabilitado. Pedile una cuenta a tu docente.');
  const data = validate(req.body, {
    username: USERNAME,
    displayName: DISPLAY,
    password: { type: 'string', label: 'La contraseña', required: true, raw: true },
    grade: { type: 'int', label: 'El grado', required: true, min: 1, max: 7 },
    avatar: { type: 'enum', label: 'El avatar', values: AVATARS, default: 'zorro' },
    schoolCode: { type: 'string', label: 'El código de la escuela' }
  });
  const problem = passwordProblem(data.password, 'student');
  if (problem) throw new HttpError(400, problem, { password: problem });
  if (process.env.SCHOOL_CODE && data.schoolCode !== process.env.SCHOOL_CODE) {
    throw new HttpError(400, 'El código de la escuela no es correcto.', { schoolCode: 'El código de la escuela no es correcto.' });
  }
  registerLimiter(req.ip);
  if (one('SELECT id FROM users WHERE username = ?', data.username)) {
    throw new HttpError(409, 'Ese nombre de usuario ya existe. Elegí otro.', { username: 'Ese nombre de usuario ya existe.' });
  }
  const r = run(`INSERT INTO users (username, password_hash, display_name, role, grade, avatar, last_login)
                 VALUES (?, ?, ?, 'student', ?, ?, datetime('now'))`,
  data.username.toLowerCase(), hashPassword(data.password), data.displayName, data.grade, data.avatar);
  const userId = Number(r.lastInsertRowid);
  createSession(req, res, userId);
  res.status(201).json({ user: publicUser(one('SELECT * FROM users WHERE id = ?', userId)) });
});

router.post('/login', (req, res) => {
  const data = validate(req.body, {
    username: { type: 'string', label: 'El usuario', required: true, max: 40 },
    password: { type: 'string', label: 'La contraseña', required: true, raw: true, max: 200 }
  });
  const clear = loginLimiter(`${req.ip}|${data.username.toLowerCase()}`);
  const user = one('SELECT * FROM users WHERE username = ?', data.username);
  // Se verifica siempre una contraseña para no revelar si el usuario existe.
  const ok = verifyPassword(data.password, user ? user.password_hash : 'scrypt$16384$AAAA$AAAA');
  if (!user || !ok) throw new HttpError(401, 'Usuario o contraseña incorrectos.');
  clear();
  run("UPDATE users SET last_login = datetime('now') WHERE id = ?", user.id);
  createSession(req, res, user.id);
  res.json({ user: publicUser(user) });
});

router.post('/logout', (req, res) => {
  destroySession(req, res);
  res.json({ ok: true });
});

router.get('/me', (req, res) => {
  res.json({
    user: publicUser(req.user) || null,
    registration: process.env.ALLOW_REGISTRATION !== 'false',
    schoolCodeRequired: !!process.env.SCHOOL_CODE,
    demoAccounts: process.env.SHOW_DEMO_ACCOUNTS !== 'false'
  });
});

module.exports = router;
module.exports.USERNAME = USERNAME;
module.exports.DISPLAY = DISPLAY;
