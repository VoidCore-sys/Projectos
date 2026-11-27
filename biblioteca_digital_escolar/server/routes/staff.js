'use strict';
/**
 * Rutas para docentes y administradores:
 *  - /api/teacher : seguimiento de alumnos y estadísticas.
 *  - /api/manage  : gestión y publicación de libros.
 *  - /api/admin   : gestión de usuarios (sólo administradores).
 */
const express = require('express');
const { one, all, run } = require('../db');
const { HttpError, validate, parseId, AVATARS } = require('../util');
const { requireRole, hashPassword, passwordProblem, publicUser } = require('../auth');
const { listBooks, getFullBook, validateBookInput, saveBook, getBookRow } = require('../books');
const { userStats, listAchievements } = require('../achievements');
const { USERNAME, DISPLAY } = require('./auth');

/* ------------------------------ Docentes ------------------------------ */
const teacher = express.Router();
teacher.use(requireRole('teacher', 'admin'));

teacher.get('/students', (req, res) => {
  const { grade } = validate(req.query, { grade: { type: 'int', min: 1, max: 7 } });
  const rows = all(`
    SELECT u.id, u.username, u.display_name, u.grade, u.avatar, u.created_at, u.last_login,
      (SELECT COUNT(*) FROM progress p WHERE p.user_id = u.id) AS started,
      (SELECT COUNT(*) FROM progress p WHERE p.user_id = u.id AND p.finished_at IS NOT NULL) AS finished,
      (SELECT COALESCE(SUM(seconds_read), 0) FROM progress p WHERE p.user_id = u.id) AS seconds,
      (SELECT ROUND(AVG(score * 100.0 / total)) FROM quiz_attempts q WHERE q.user_id = u.id) AS quiz_avg,
      (SELECT COUNT(*) FROM achievements a WHERE a.user_id = u.id) AS achievements,
      (SELECT MAX(updated_at) FROM progress p WHERE p.user_id = u.id) AS last_read
    FROM users u WHERE u.role = 'student' ${grade ? 'AND u.grade = ?' : ''}
    ORDER BY u.grade, u.display_name COLLATE NOCASE`, ...(grade ? [grade] : []));
  res.json({
    students: rows.map((r) => ({
      id: r.id, username: r.username, displayName: r.display_name, grade: r.grade, avatar: r.avatar,
      createdAt: r.created_at, lastLogin: r.last_login, lastRead: r.last_read,
      started: r.started, finished: r.finished, minutes: Math.round(r.seconds / 60),
      quizAverage: r.quiz_avg, achievements: r.achievements
    }))
  });
});

teacher.get('/students/:id', (req, res) => {
  const id = parseId(req.params.id);
  const u = one("SELECT * FROM users WHERE id = ? AND role = 'student'", id);
  if (!u) throw new HttpError(404, 'No encontramos a ese alumno.');
  const reading = all(`SELECT p.*, b.title, b.cover, b.genres, (SELECT COUNT(*) FROM chapters c WHERE c.book_id = b.id) AS chapters
                       FROM progress p JOIN books b ON b.id = p.book_id WHERE p.user_id = ? ORDER BY p.updated_at DESC`, id)
    .map((r) => ({
      bookId: r.book_id, title: r.title, cover: JSON.parse(r.cover), genre: JSON.parse(r.genres)[0],
      chapter: r.chapter, chapters: r.chapters, percent: r.percent, minutes: Math.round(r.seconds_read / 60),
      startedAt: r.started_at, updatedAt: r.updated_at, finishedAt: r.finished_at
    }));
  const quizzes = all(`SELECT q.score, q.total, q.created_at, b.title FROM quiz_attempts q JOIN books b ON b.id = q.book_id
                       WHERE q.user_id = ? ORDER BY q.created_at DESC LIMIT 50`, id)
    .map((q) => ({ title: q.title, score: q.score, total: q.total, createdAt: q.created_at }));
  const activity = all(`SELECT day, SUM(seconds) AS s FROM reading_days WHERE user_id = ? AND day >= date('now','-30 days') GROUP BY day ORDER BY day`, id)
    .map((r) => ({ day: r.day, minutes: Math.round(r.s / 60) }));
  res.json({
    student: publicUser(u),
    lastLogin: u.last_login,
    stats: userStats(id),
    achievements: listAchievements(id).filter((a) => a.unlockedAt),
    reading, quizzes, activity
  });
});

teacher.post('/students/:id/password', (req, res) => {
  const id = parseId(req.params.id);
  const u = one("SELECT id FROM users WHERE id = ? AND role = 'student'", id);
  if (!u) throw new HttpError(404, 'No encontramos a ese alumno.');
  const { password } = validate(req.body, { password: { type: 'string', label: 'La contraseña', required: true, raw: true } });
  const problem = passwordProblem(password, 'student');
  if (problem) throw new HttpError(400, problem, { password: problem });
  run('UPDATE users SET password_hash = ? WHERE id = ?', hashPassword(password), id);
  run('DELETE FROM sessions WHERE user_id = ?', id);
  res.json({ ok: true });
});

/** Estadísticas generales de lectura de la escuela. */
teacher.get('/stats', (req, res) => {
  const totals = one(`SELECT
      (SELECT COUNT(*) FROM users WHERE role = 'student') AS students,
      (SELECT COUNT(*) FROM books WHERE status = 'published') AS books,
      (SELECT COUNT(*) FROM progress) AS readings,
      (SELECT COUNT(*) FROM progress WHERE finished_at IS NOT NULL) AS finished,
      (SELECT COALESCE(SUM(seconds_read), 0) FROM progress) AS seconds,
      (SELECT COUNT(*) FROM quiz_attempts) AS quizzes,
      (SELECT ROUND(AVG(score * 100.0 / total)) FROM quiz_attempts) AS quiz_avg,
      (SELECT COUNT(DISTINCT user_id) FROM reading_days WHERE day >= date('now', '-7 days')) AS active_week`);
  const topBooks = all(`SELECT b.id, b.title, b.section, b.cover, COUNT(p.user_id) AS readers, COUNT(p.finished_at) AS finished
                        FROM books b JOIN progress p ON p.book_id = b.id GROUP BY b.id ORDER BY readers DESC, finished DESC LIMIT 8`)
    .map((b) => ({ ...b, cover: JSON.parse(b.cover) }));
  const byGrade = all(`SELECT u.grade, COUNT(DISTINCT u.id) AS students, COUNT(p.finished_at) AS finished, COALESCE(SUM(p.seconds_read), 0) AS seconds
                       FROM users u LEFT JOIN progress p ON p.user_id = u.id WHERE u.role = 'student' GROUP BY u.grade ORDER BY u.grade`)
    .map((g) => ({ grade: g.grade, students: g.students, finished: g.finished, minutes: Math.round(g.seconds / 60) }));
  const byGenre = all(`SELECT json_extract(b.genres, '$[0]') AS genre, COUNT(*) AS readings
                       FROM progress p JOIN books b ON b.id = p.book_id GROUP BY genre ORDER BY readings DESC`);
  const activity = all(`SELECT day, SUM(seconds) AS s, COUNT(DISTINCT user_id) AS readers FROM reading_days
                        WHERE day >= date('now', '-13 days') GROUP BY day ORDER BY day`)
    .map((r) => ({ day: r.day, minutes: Math.round(r.s / 60), readers: r.readers }));
  res.json({
    totals: { ...totals, minutes: Math.round(totals.seconds / 60) },
    topBooks, byGrade, byGenre, activity
  });
});

/* --------------------------- Gestión de libros --------------------------- */
const manage = express.Router();
manage.use(requireRole('teacher', 'admin'));

function assertCanEdit(user, id) {
  const row = getBookRow(id);
  if (!row) throw new HttpError(404, 'No encontramos ese libro.');
  if (user.role !== 'admin' && row.created_by !== user.id) throw new HttpError(403, 'Sólo podés editar los libros que publicaste vos.');
  return row;
}

manage.get('/books', (req, res) => {
  const books = listBooks({ includeDrafts: true, sort: 'new' });
  const owners = new Map(all('SELECT id, display_name FROM users').map((u) => [u.id, u.display_name]));
  const rows = all('SELECT id, created_by FROM books');
  const createdBy = new Map(rows.map((r) => [r.id, r.created_by]));
  res.json({
    books: books.map((b) => ({
      ...b,
      owner: owners.get(createdBy.get(b.id)) || 'Biblioteca',
      canEdit: req.user.role === 'admin' || createdBy.get(b.id) === req.user.id
    }))
  });
});

manage.get('/books/:id', (req, res) => {
  const id = parseId(req.params.id);
  assertCanEdit(req.user, id);
  res.json({ book: getFullBook(id, { includeAnswers: true }) });
});

manage.post('/books', (req, res) => {
  const data = validateBookInput(req.body);
  if (req.user.role !== 'admin') data.featured = false;
  const id = saveBook(data, { userId: req.user.id });
  res.status(201).json({ id });
});

manage.put('/books/:id', (req, res) => {
  const id = parseId(req.params.id);
  const row = assertCanEdit(req.user, id);
  const data = validateBookInput(req.body);
  if (req.user.role !== 'admin') data.featured = !!row.featured;
  saveBook(data, { id });
  res.json({ id });
});

manage.delete('/books/:id', (req, res) => {
  const id = parseId(req.params.id);
  assertCanEdit(req.user, id);
  run('DELETE FROM books WHERE id = ?', id);
  res.json({ ok: true });
});

/* -------------------------- Usuarios (admin) -------------------------- */
const admin = express.Router();
admin.use(requireRole('admin'));

admin.get('/users', (req, res) => {
  const users = all(`SELECT u.*, (SELECT COUNT(*) FROM progress p WHERE p.user_id = u.id) AS readings
                     FROM users u ORDER BY CASE role WHEN 'admin' THEN 0 WHEN 'teacher' THEN 1 ELSE 2 END, grade, display_name COLLATE NOCASE`);
  res.json({ users: users.map((u) => ({ ...publicUser(u), lastLogin: u.last_login, readings: u.readings })) });
});

admin.post('/users', (req, res) => {
  const d = validate(req.body, {
    username: USERNAME,
    displayName: DISPLAY,
    password: { type: 'string', label: 'La contraseña', required: true, raw: true },
    role: { type: 'enum', label: 'El rol', values: ['student', 'teacher', 'admin'], required: true },
    grade: { type: 'int', label: 'El grado', min: 1, max: 7 },
    avatar: { type: 'enum', values: AVATARS, default: 'buho' }
  });
  if (d.role === 'student' && !d.grade) throw new HttpError(400, 'Indicá el grado del alumno.', { grade: 'Indicá el grado del alumno.' });
  const problem = passwordProblem(d.password, d.role);
  if (problem) throw new HttpError(400, problem, { password: problem });
  if (one('SELECT id FROM users WHERE username = ?', d.username)) throw new HttpError(409, 'Ese nombre de usuario ya existe.', { username: 'Ese nombre de usuario ya existe.' });
  const r = run('INSERT INTO users (username, password_hash, display_name, role, grade, avatar) VALUES (?, ?, ?, ?, ?, ?)',
    d.username.toLowerCase(), hashPassword(d.password), d.displayName, d.role, d.role === 'student' ? d.grade : null, d.avatar);
  res.status(201).json({ user: publicUser(one('SELECT * FROM users WHERE id = ?', Number(r.lastInsertRowid))) });
});

admin.patch('/users/:id', (req, res) => {
  const id = parseId(req.params.id);
  const u = one('SELECT * FROM users WHERE id = ?', id);
  if (!u) throw new HttpError(404, 'No encontramos a ese usuario.');
  const d = validate(req.body, {
    displayName: DISPLAY,
    role: { type: 'enum', label: 'El rol', values: ['student', 'teacher', 'admin'], required: true },
    grade: { type: 'int', label: 'El grado', min: 1, max: 7 },
    password: { type: 'string', label: 'La contraseña', raw: true }
  });
  if (id === req.user.id && d.role !== 'admin') throw new HttpError(400, 'No podés quitarte tu propio rol de administrador.');
  if (d.role === 'student' && !d.grade) throw new HttpError(400, 'Indicá el grado del alumno.', { grade: 'Indicá el grado del alumno.' });
  if (d.password) {
    const problem = passwordProblem(d.password, d.role);
    if (problem) throw new HttpError(400, problem, { password: problem });
    run('UPDATE users SET password_hash = ? WHERE id = ?', hashPassword(d.password), id);
    if (id !== req.user.id) run('DELETE FROM sessions WHERE user_id = ?', id);
  }
  run('UPDATE users SET display_name = ?, role = ?, grade = ? WHERE id = ?', d.displayName, d.role, d.role === 'student' ? d.grade : null, id);
  if (d.role !== u.role && id !== req.user.id) run('DELETE FROM sessions WHERE user_id = ?', id);
  res.json({ user: publicUser(one('SELECT * FROM users WHERE id = ?', id)) });
});

admin.delete('/users/:id', (req, res) => {
  const id = parseId(req.params.id);
  if (id === req.user.id) throw new HttpError(400, 'No podés eliminar tu propia cuenta.');
  const r = run('DELETE FROM users WHERE id = ?', id);
  if (!r.changes) throw new HttpError(404, 'No encontramos a ese usuario.');
  res.json({ ok: true });
});

module.exports = { teacher, manage, admin };
