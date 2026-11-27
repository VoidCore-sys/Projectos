'use strict';
/** Perfil personal: datos, biblioteca propia, historial, estadísticas y logros. */
const express = require('express');
const { one, all, run } = require('../db');
const { HttpError, validate, AVATARS } = require('../util');
const { requireAuth, verifyPassword, hashPassword, passwordProblem, publicUser } = require('../auth');
const { listBooks, withUserData } = require('../books');
const { userStats, listAchievements } = require('../achievements');
const { DISPLAY } = require('./auth');

const router = express.Router();
router.use(requireAuth);

router.patch('/', (req, res) => {
  const d = validate(req.body, {
    displayName: DISPLAY,
    avatar: { type: 'enum', label: 'El avatar', values: AVATARS, required: true },
    grade: { type: 'int', label: 'El grado', min: 1, max: 7 }
  });
  const grade = req.user.role === 'student' ? (d.grade ?? req.user.grade) : null;
  run('UPDATE users SET display_name = ?, avatar = ?, grade = ? WHERE id = ?', d.displayName, d.avatar, grade, req.user.id);
  res.json({ user: publicUser(one('SELECT * FROM users WHERE id = ?', req.user.id)) });
});

router.post('/password', (req, res) => {
  const d = validate(req.body, {
    current: { type: 'string', label: 'La contraseña actual', required: true, raw: true },
    next: { type: 'string', label: 'La nueva contraseña', required: true, raw: true }
  });
  const user = one('SELECT * FROM users WHERE id = ?', req.user.id);
  if (!verifyPassword(d.current, user.password_hash)) throw new HttpError(400, 'La contraseña actual no es correcta.', { current: 'La contraseña actual no es correcta.' });
  const problem = passwordProblem(d.next, user.role);
  if (problem) throw new HttpError(400, problem, { next: problem });
  run('UPDATE users SET password_hash = ? WHERE id = ?', hashPassword(d.next), user.id);
  // Cierra las demás sesiones abiertas del usuario.
  run('DELETE FROM sessions WHERE user_id = ? AND token_hash != ?', user.id, req.user.token_hash);
  res.json({ ok: true });
});

router.get('/library', (req, res) => {
  const uid = req.user.id;
  const books = withUserData(listBooks({ includeDrafts: false }), uid);
  const byId = new Map(books.map((b) => [b.id, b]));
  const rows = all(`SELECT book_id, chapter, page, total_pages, percent, seconds_read, started_at, updated_at, finished_at, times_finished
                    FROM progress WHERE user_id = ? ORDER BY updated_at DESC`, uid);
  const history = rows.filter((r) => byId.has(r.book_id)).map((r) => ({
    book: byId.get(r.book_id),
    chapter: r.chapter,
    page: r.page,
    totalPages: r.total_pages,
    percent: r.percent,
    minutes: Math.round(r.seconds_read / 60),
    startedAt: r.started_at,
    updatedAt: r.updated_at,
    finishedAt: r.finished_at,
    timesFinished: r.times_finished
  }));
  const favorites = all('SELECT book_id FROM favorites WHERE user_id = ? ORDER BY created_at DESC', uid)
    .map((r) => byId.get(r.book_id)).filter(Boolean);
  res.json({
    inProgress: history.filter((h) => !h.finishedAt),
    finished: history.filter((h) => h.finishedAt),
    favorites,
    history
  });
});

router.get('/stats', (req, res) => {
  const uid = req.user.id;
  const activity = all(`SELECT day, SUM(seconds) AS seconds FROM reading_days WHERE user_id = ? AND day >= date('now', '-30 days')
                        GROUP BY day ORDER BY day`, uid).map((r) => ({ day: r.day, minutes: Math.round(r.seconds / 60) }));
  const quizzes = all(`SELECT q.book_id, b.title, MAX(q.score) AS score, q.total, COUNT(*) AS attempts, MAX(q.created_at) AS last
                       FROM quiz_attempts q JOIN books b ON b.id = q.book_id WHERE q.user_id = ? GROUP BY q.book_id ORDER BY last DESC`, uid);
  res.json({ stats: userStats(uid), achievements: listAchievements(uid), activity, quizzes });
});

module.exports = router;
