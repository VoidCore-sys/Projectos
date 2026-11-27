'use strict';
/**
 * Recomendaciones personalizadas. Puntaje por libro según:
 *  - adecuación al grado del alumno,
 *  - afinidad con los géneros de sus favoritos y lecturas,
 *  - popularidad entre los demás lectores y si está destacado.
 * Cada recomendación incluye un motivo legible para el alumno.
 */
const { all } = require('./db');
const { listBooks } = require('./books');

function recommend(user, limit = 10) {
  const books = listBooks({ sort: 'popular' });
  const read = all(`SELECT p.book_id, p.finished_at, b.genres FROM progress p JOIN books b ON b.id = p.book_id WHERE p.user_id = ?`, user.id);
  const favs = all(`SELECT b.genres FROM favorites f JOIN books b ON b.id = f.book_id WHERE f.user_id = ?`, user.id);
  const seen = new Set(read.map((r) => r.book_id));

  const affinity = new Map();
  const add = (genres, w) => JSON.parse(genres).forEach((g, i) => affinity.set(g, (affinity.get(g) || 0) + (i === 0 ? w : w / 2)));
  read.forEach((r) => add(r.genres, r.finished_at ? 2 : 1));
  favs.forEach((f) => add(f.genres, 3));
  const topGenre = [...affinity.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  const maxReaders = Math.max(1, ...books.map((b) => b.readers || 0));

  const scored = books.filter((b) => !seen.has(b.id)).map((b) => {
    let score = 0;
    let reason = 'Elegido por la biblioteca';
    if (user.grade) {
      if (user.grade >= b.gradeMin && user.grade <= b.gradeMax) { score += 6; reason = `Ideal para ${user.grade}.º grado`; }
      else if (user.grade === b.gradeMin - 1) { score += 2; reason = '¡Un desafío para crecer como lector!'; }
      else if (user.grade > b.gradeMax) score += 0.5;
      else score -= 6;
    }
    const aff = b.genres.reduce((n, g) => n + (affinity.get(g) || 0), 0);
    if (aff > 0) {
      score += Math.min(6, aff * 1.2);
      const match = b.genres.find((g) => g === topGenre) || b.genres.find((g) => affinity.has(g));
      if (match) reason = `Porque te gusta: ${match}`;
    }
    score += (b.readers || 0) / maxReaders * 2 + (b.featured ? 1 : 0);
    return { ...b, reason, score };
  });
  return scored.sort((a, b) => b.score - a.score).slice(0, limit).map(({ score, ...b }) => b);
}

module.exports = { recommend };
