'use strict';
/** Catálogo, lectura, progreso, favoritos y cuestionarios (usuarios autenticados). */
const express = require('express');
const { one, all, run, tx } = require('../db');
const { HttpError, validate, parseId, today, GENRES, SCENES, AVATARS } = require('../util');
const { requireAuth } = require('../auth');
const { listBooks, getFullBook, withUserData } = require('../books');
const { recommend } = require('../recommend');
const { evaluateAchievements } = require('../achievements');

const router = express.Router();
router.use(requireAuth);

const SECTIONS = [
  { id: 1, name: 'El Bosque de los Cuentos', grades: '1.º, 2.º y 3.º grado', gradeList: [1, 2, 3], tagline: 'Cuentos, fantasía y aventuras para dar los primeros pasos como lectores.' },
  { id: 2, name: 'La Isla de los Aventureros', grades: '4.º y 5.º grado', gradeList: [4, 5], tagline: 'Misterios, exploraciones, ciencia ficción e historia para mentes curiosas.' },
  { id: 3, name: 'El Observatorio', grades: '6.º y 7.º grado', gradeList: [6, 7], tagline: 'Suspenso, terror, novelas y tramas complejas para lectores expertos.' }
];

const isStaff = (u) => u.role === 'teacher' || u.role === 'admin';

router.get('/meta', (req, res) => {
  res.json({ genres: GENRES, scenes: SCENES, avatars: AVATARS, sections: SECTIONS });
});

router.get('/books', (req, res) => {
  const f = validate(req.query, {
    q: { type: 'string', max: 80 },
    genre: { type: 'enum', values: GENRES },
    grade: { type: 'int', min: 1, max: 7 },
    section: { type: 'int', min: 1, max: 3 },
    sort: { type: 'enum', values: ['new', 'title', 'popular', 'short'], default: 'new' }
  });
  res.json({ books: withUserData(listBooks(f), req.user.id) });
});

router.get('/home', (req, res) => {
  const uid = req.user.id;
  const all_ = withUserData(listBooks({ sort: 'new' }), uid);
  const continueReading = all(`SELECT book_id FROM progress WHERE user_id = ? AND finished_at IS NULL ORDER BY updated_at DESC LIMIT 8`, uid)
    .map((r) => all_.find((b) => b.id === r.book_id)).filter(Boolean);
  const featured = all_.filter((b) => b.featured);
  const recs = withUserData(recommend(req.user, 10), uid);
  const counts = SECTIONS.map((s) => ({ ...s, count: all_.filter((b) => b.section === s.id).length }));
  res.json({
    continueReading,
    newest: all_.slice(0, 10),
    featured: featured.length ? featured : all_.slice(0, 3),
    recommended: recs,
    sections: counts
  });
});

router.get('/books/:id', (req, res) => {
  const id = parseId(req.params.id);
  const book = getFullBook(id);
  if (!book || (book.status !== 'published' && !isStaff(req.user))) throw new HttpError(404, 'No encontramos ese libro.');
  const p = one('SELECT * FROM progress WHERE user_id = ? AND book_id = ?', req.user.id, id);
  const fav = !!one('SELECT 1 AS x FROM favorites WHERE user_id = ? AND book_id = ?', req.user.id, id);
  const best = one('SELECT MAX(score) AS score, total FROM quiz_attempts WHERE user_id = ? AND book_id = ?', req.user.id, id);
  res.json({
    book: {
      ...book,
      favorite: fav,
      progress: p ? {
        chapter: p.chapter, paragraph: p.paragraph, page: p.page, totalPages: p.total_pages,
        percent: p.percent, finished: !!p.finished_at, secondsRead: p.seconds_read, updatedAt: p.updated_at
      } : null,
      bestQuiz: best && best.score !== null ? { score: best.score, total: best.total } : null
    }
  });
});

/** Guarda la posición exacta de lectura. Se llama al pasar de página y al salir. */
router.put('/progress/:bookId', (req, res) => {
  const bookId = parseId(req.params.bookId);
  const book = one('SELECT id, (SELECT COUNT(*) FROM chapters WHERE book_id = books.id) AS chapters FROM books WHERE id = ?', bookId);
  if (!book) throw new HttpError(404, 'No encontramos ese libro.');
  const d = validate(req.body, {
    chapter: { type: 'int', required: true, min: 0, max: Math.max(0, book.chapters - 1) },
    paragraph: { type: 'int', required: true, min: 0, max: 100000 },
    page: { type: 'int', required: true, min: 0, max: 100000 },
    totalPages: { type: 'int', required: true, min: 1, max: 100000 },
    percent: { type: 'number', required: true, min: 0, max: 100 },
    seconds: { type: 'int', default: 0, min: 0, max: 100000 },
    finished: { type: 'bool', default: false }
  });
  // Se acota el tiempo informado para evitar sumas irreales.
  const seconds = Math.min(d.seconds, 600);
  const uid = req.user.id;
  let justFinished = false;
  tx(() => {
    const prev = one('SELECT finished_at FROM progress WHERE user_id = ? AND book_id = ?', uid, bookId);
    justFinished = d.finished && !prev?.finished_at;
    run(`INSERT INTO progress (user_id, book_id, chapter, paragraph, page, total_pages, percent, seconds_read, finished_at, times_finished)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, CASE WHEN ? THEN datetime('now') END, ?)
         ON CONFLICT (user_id, book_id) DO UPDATE SET
           chapter = excluded.chapter, paragraph = excluded.paragraph, page = excluded.page,
           total_pages = excluded.total_pages,
           percent = CASE WHEN progress.finished_at IS NOT NULL THEN MAX(progress.percent, excluded.percent) ELSE excluded.percent END,
           seconds_read = progress.seconds_read + excluded.seconds_read,
           finished_at = COALESCE(progress.finished_at, excluded.finished_at),
           times_finished = progress.times_finished + ?,
           updated_at = datetime('now')`,
    uid, bookId, d.chapter, d.paragraph, d.page, d.totalPages, d.percent, seconds, d.finished ? 1 : 0, justFinished ? 1 : 0, justFinished ? 1 : 0);
    if (seconds > 0) {
      run(`INSERT INTO reading_days (user_id, book_id, day, seconds) VALUES (?, ?, ?, ?)
           ON CONFLICT (user_id, book_id, day) DO UPDATE SET seconds = seconds + excluded.seconds`, uid, bookId, today(), seconds);
    }
  });
  res.json({ ok: true, finished: justFinished, achievements: evaluateAchievements(uid) });
});

/** "Empezar de nuevo": borra la posición (el historial de tiempo se conserva). */
router.delete('/progress/:bookId', (req, res) => {
  const bookId = parseId(req.params.bookId);
  run(`UPDATE progress SET chapter = 0, paragraph = 0, page = 0, percent = CASE WHEN finished_at IS NULL THEN 0 ELSE percent END,
       updated_at = datetime('now') WHERE user_id = ? AND book_id = ?`, req.user.id, bookId);
  res.json({ ok: true });
});

router.put('/favorites/:bookId', (req, res) => {
  const bookId = parseId(req.params.bookId);
  if (!one('SELECT id FROM books WHERE id = ?', bookId)) throw new HttpError(404, 'No encontramos ese libro.');
  run('INSERT OR IGNORE INTO favorites (user_id, book_id) VALUES (?, ?)', req.user.id, bookId);
  res.json({ favorite: true, achievements: evaluateAchievements(req.user.id) });
});

router.delete('/favorites/:bookId', (req, res) => {
  run('DELETE FROM favorites WHERE user_id = ? AND book_id = ?', req.user.id, parseId(req.params.bookId));
  res.json({ favorite: false });
});

/** Corrige el cuestionario en el servidor (las respuestas nunca se envían al navegador antes). */
router.post('/books/:id/quiz', (req, res) => {
  const bookId = parseId(req.params.id);
  const questions = all('SELECT question, options, correct, explanation FROM quiz_questions WHERE book_id = ? ORDER BY position', bookId);
  if (!questions.length) throw new HttpError(404, 'Este libro todavía no tiene cuestionario.');
  const { answers } = validate(req.body, { answers: { type: 'array', label: 'Las respuestas', required: true, min: questions.length, max: questions.length } });
  const results = questions.map((q, i) => {
    const given = Number.isInteger(answers[i]) ? answers[i] : -1;
    return { correct: q.correct, given, ok: given === q.correct, explanation: q.explanation || '' };
  });
  const score = results.filter((r) => r.ok).length;
  run('INSERT INTO quiz_attempts (user_id, book_id, score, total, answers) VALUES (?, ?, ?, ?, ?)',
    req.user.id, bookId, score, questions.length, JSON.stringify(results.map((r) => r.given)));
  res.json({ score, total: questions.length, results, achievements: evaluateAchievements(req.user.id) });
});

module.exports = router;
module.exports.SECTIONS = SECTIONS;
