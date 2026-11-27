'use strict';
/** Repositorio de libros: lectura, serialización y guardado. */
const { one, all, run, tx } = require('./db');
const { HttpError, validate, slugify, countWords, GENRES, SCENES, sectionForGrade } = require('./util');

const WORDS_PER_MINUTE = { 1: 70, 2: 110, 3: 140 };

function serializeBook(row, extra = {}) {
  const genres = JSON.parse(row.genres || '[]');
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    author: row.author,
    synopsis: row.synopsis,
    genres,
    genre: genres[0] || 'Cuento',
    gradeMin: row.grade_min,
    gradeMax: row.grade_max,
    section: row.section,
    cover: JSON.parse(row.cover || '{}'),
    wordCount: row.word_count,
    readingMinutes: Math.max(3, Math.round(row.word_count / WORDS_PER_MINUTE[row.section])),
    chapterCount: row.chapter_count ?? undefined,
    status: row.status,
    featured: !!row.featured,
    license: row.license,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    readers: row.readers ?? undefined,
    ...extra
  };
}

const BASE_SELECT = `
  SELECT b.*,
    (SELECT COUNT(*) FROM chapters c WHERE c.book_id = b.id) AS chapter_count,
    (SELECT COUNT(*) FROM progress p WHERE p.book_id = b.id) AS readers
  FROM books b`;

/** Agrega datos personales (favorito / progreso) a una lista de libros. */
function withUserData(books, userId) {
  if (!userId || !books.length) return books;
  const favs = new Set(all('SELECT book_id FROM favorites WHERE user_id = ?', userId).map((r) => r.book_id));
  const prog = new Map(all('SELECT book_id, percent, finished_at, chapter, updated_at FROM progress WHERE user_id = ?', userId)
    .map((r) => [r.book_id, r]));
  return books.map((b) => {
    const p = prog.get(b.id);
    return {
      ...b,
      favorite: favs.has(b.id),
      progress: p ? { percent: p.percent, finished: !!p.finished_at, chapter: p.chapter, updatedAt: p.updated_at } : null
    };
  });
}

function listBooks({ q, genre, grade, section, sort = 'new', includeDrafts = false, createdBy } = {}) {
  const where = [];
  const params = [];
  if (!includeDrafts) where.push("b.status = 'published'");
  if (createdBy) { where.push('b.created_by = ?'); params.push(createdBy); }
  if (q) {
    where.push(`(b.title LIKE ? ESCAPE '\\' OR b.author LIKE ? ESCAPE '\\' OR b.synopsis LIKE ? ESCAPE '\\' OR b.genres LIKE ? ESCAPE '\\')`);
    const like = `%${q.replace(/[\\%_]/g, (m) => '\\' + m)}%`;
    params.push(like, like, like, like);
  }
  if (genre) { where.push('EXISTS (SELECT 1 FROM json_each(b.genres) g WHERE g.value = ?)'); params.push(genre); }
  if (grade) { where.push('? BETWEEN b.grade_min AND b.grade_max'); params.push(grade); }
  if (section) { where.push('b.section = ?'); params.push(section); }
  const order = {
    new: 'b.created_at DESC, b.id DESC',
    title: 'b.title COLLATE NOCASE ASC',
    popular: 'readers DESC, b.title COLLATE NOCASE',
    short: 'b.word_count ASC'
  }[sort] || 'b.created_at DESC, b.id DESC';
  const sql = `${BASE_SELECT} ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY ${order}`;
  return all(sql, ...params).map((r) => serializeBook(r));
}

function getBookRow(id) {
  return one(`${BASE_SELECT} WHERE b.id = ?`, id);
}

/** Libro completo con capítulos (para el lector). */
function getFullBook(id, { includeAnswers = false } = {}) {
  const row = getBookRow(id);
  if (!row) return null;
  const chapters = all('SELECT id, position, title, illustration, content FROM chapters WHERE book_id = ? ORDER BY position', id)
    .map((c) => ({ id: c.id, title: c.title, illustration: c.illustration, content: c.content }));
  const quiz = all('SELECT question, options, correct, explanation FROM quiz_questions WHERE book_id = ? ORDER BY position', id)
    .map((q) => includeAnswers
      ? { question: q.question, options: JSON.parse(q.options), correct: q.correct, explanation: q.explanation || '' }
      : { question: q.question, options: JSON.parse(q.options) });
  return serializeBook(row, { chapters, quiz, quizCount: quiz.length });
}

/** Valida y normaliza los datos de un libro enviados desde el editor. */
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
  if (!SCENES.includes(cover.scene) || !color.test(cover.c1 || '') || !color.test(cover.c2 || '')) {
    fields.cover = 'Elegí una ilustración y dos colores válidos para la portada.';
  }
  const chapters = data.chapters.map((c, i) => {
    const title = typeof c?.title === 'string' ? c.title.trim() : '';
    const content = typeof c?.content === 'string' ? c.content.replace(/\r\n/g, '\n').trim() : '';
    if (title.length < 1 || title.length > 100) fields[`chapters.${i}.title`] = `El capítulo ${i + 1} necesita un título (máx. 100 caracteres).`;
    if (content.length < 30) fields[`chapters.${i}.content`] = `El capítulo ${i + 1} es demasiado corto (mínimo 30 caracteres).`;
    if (content.length > 60000) fields[`chapters.${i}.content`] = `El capítulo ${i + 1} es demasiado largo.`;
    const illustration = SCENES.includes(c?.illustration) ? c.illustration : null;
    return { title, content, illustration };
  });
  const quiz = data.quiz.map((q, i) => {
    const question = typeof q?.question === 'string' ? q.question.trim() : '';
    const options = Array.isArray(q?.options) ? q.options.map((o) => String(o ?? '').trim()).filter(Boolean) : [];
    const correct = Number(q?.correct);
    if (question.length < 5 || question.length > 300) fields[`quiz.${i}.question`] = `La pregunta ${i + 1} debe tener entre 5 y 300 caracteres.`;
    if (options.length < 2 || options.length > 5) fields[`quiz.${i}.options`] = `La pregunta ${i + 1} necesita entre 2 y 5 opciones.`;
    if (!Number.isInteger(correct) || correct < 0 || correct >= options.length) fields[`quiz.${i}.correct`] = `Marcá la respuesta correcta de la pregunta ${i + 1}.`;
    const explanation = typeof q?.explanation === 'string' ? q.explanation.trim().slice(0, 400) : '';
    return { question, options: options.map((o) => o.slice(0, 200)), correct, explanation };
  });
  if (Object.keys(fields).length) throw new HttpError(400, Object.values(fields)[0], fields);
  return {
    ...data,
    cover: { scene: cover.scene, c1: cover.c1, c2: cover.c2 },
    chapters,
    quiz,
    section: sectionForGrade(data.gradeMin)
  };
}

function uniqueSlug(title, ignoreId) {
  const base = slugify(title);
  let slug = base;
  for (let i = 2; one('SELECT id FROM books WHERE slug = ? AND id IS NOT ?', slug, ignoreId ?? null); i++) slug = `${base}-${i}`;
  return slug;
}

/** Crea o actualiza un libro con sus capítulos y preguntas (transacción). */
function saveBook(data, { id = null, userId = null, license, slug, createdAt } = {}) {
  const words = data.chapters.reduce((n, c) => n + countWords(c.content), 0);
  return tx(() => {
    let bookId = id;
    const common = [data.title, data.author, data.synopsis, JSON.stringify(data.genres), data.gradeMin, data.gradeMax,
      data.section, JSON.stringify(data.cover), words, data.status, data.featured ? 1 : 0];
    if (id) {
      run(`UPDATE books SET title=?, author=?, synopsis=?, genres=?, grade_min=?, grade_max=?, section=?, cover=?,
           word_count=?, status=?, featured=?, updated_at=datetime('now') WHERE id = ?`, ...common, id);
      run('DELETE FROM chapters WHERE book_id = ?', id);
      run('DELETE FROM quiz_questions WHERE book_id = ?', id);
    } else {
      const r = run(`INSERT INTO books (title, author, synopsis, genres, grade_min, grade_max, section, cover, word_count,
           status, featured, slug, license, created_by, created_at)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?, COALESCE(?, datetime('now')))`,
      ...common, slug || uniqueSlug(data.title), license || 'Obra original', userId, createdAt || null);
      bookId = Number(r.lastInsertRowid);
    }
    data.chapters.forEach((c, i) => run('INSERT INTO chapters (book_id, position, title, illustration, content) VALUES (?,?,?,?,?)',
      bookId, i, c.title, c.illustration, c.content));
    data.quiz.forEach((q, i) => run('INSERT INTO quiz_questions (book_id, position, question, options, correct, explanation) VALUES (?,?,?,?,?,?)',
      bookId, i, q.question, JSON.stringify(q.options), q.correct, q.explanation || ''));
    return bookId;
  });
}

module.exports = { listBooks, getBookRow, getFullBook, serializeBook, withUserData, validateBookInput, saveBook, BASE_SELECT };
