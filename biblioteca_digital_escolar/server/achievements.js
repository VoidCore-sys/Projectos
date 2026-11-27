'use strict';
/** Estadísticas personales, rachas y logros de lectura. */
const { one, all, run } = require('./db');
const { today } = require('./util');

const ACHIEVEMENTS = [
  { code: 'primeros-pasos', title: 'Primeros pasos', description: 'Empezaste a leer tu primer libro.', icon: 'book', test: (s) => s.started >= 1 },
  { code: 'primer-libro', title: '¡Primer libro!', description: 'Terminaste tu primer libro.', icon: 'award', test: (s) => s.finished >= 1 },
  { code: 'lector-entusiasta', title: 'Lector entusiasta', description: 'Terminaste 3 libros.', icon: 'trending', test: (s) => s.finished >= 3 },
  { code: 'raton-de-biblioteca', title: 'Ratón de biblioteca', description: 'Terminaste 5 libros.', icon: 'library', test: (s) => s.finished >= 5 },
  { code: 'gran-lector', title: 'Gran lector', description: 'Terminaste 10 libros.', icon: 'crown', test: (s) => s.finished >= 10 },
  { code: 'explorador-de-generos', title: 'Explorador de géneros', description: 'Terminaste libros de 3 géneros distintos.', icon: 'compass', test: (s) => s.genres >= 3 },
  { code: 'viajero-de-secciones', title: 'Viajero de la biblioteca', description: 'Leíste libros de las tres secciones.', icon: 'map', test: (s) => s.sections >= 3 },
  { code: 'corazon-lector', title: 'Corazón lector', description: 'Guardaste tu primer libro favorito.', icon: 'heart', test: (s) => s.favorites >= 1 },
  { code: 'mente-brillante', title: 'Mente brillante', description: 'Respondiste un cuestionario sin errores.', icon: 'star', test: (s) => s.perfectQuizzes >= 1 },
  { code: 'detective-de-palabras', title: 'Detective de palabras', description: 'Completaste cuestionarios de 3 libros.', icon: 'search', test: (s) => s.quizBooks >= 3 },
  { code: 'racha-3', title: 'Racha de 3 días', description: 'Leíste 3 días seguidos.', icon: 'flame', test: (s) => s.bestStreak >= 3 },
  { code: 'racha-7', title: 'Semana lectora', description: 'Leíste 7 días seguidos.', icon: 'flame', test: (s) => s.bestStreak >= 7 },
  { code: 'hora-de-lectura', title: 'Una hora de magia', description: 'Sumaste 60 minutos de lectura.', icon: 'clock', test: (s) => s.minutes >= 60 },
  { code: 'maratonista', title: 'Maratonista', description: 'Sumaste 5 horas de lectura.', icon: 'zap', test: (s) => s.minutes >= 300 }
];

function streaks(userId) {
  const days = all('SELECT DISTINCT day FROM reading_days WHERE user_id = ? AND seconds > 0 ORDER BY day DESC', userId).map((r) => r.day);
  const set = new Set(days);
  let current = 0;
  // La racha actual cuenta si se leyó hoy o ayer.
  let offset = set.has(today()) ? 0 : set.has(today(-1)) ? -1 : null;
  if (offset !== null) while (set.has(today(offset - current))) current++;
  let best = 0;
  let run = 0;
  let prev = null;
  for (const d of [...days].reverse()) {
    const t = Date.parse(d + 'T12:00:00Z');
    run = prev !== null && Math.round((t - prev) / 86400000) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = t;
  }
  return { current, best, daysRead: days.length };
}

function userStats(userId) {
  const p = one(`SELECT COUNT(*) AS started, COUNT(finished_at) AS finished, COALESCE(SUM(seconds_read),0) AS seconds
                 FROM progress WHERE user_id = ?`, userId);
  const g = one(`SELECT COUNT(DISTINCT json_extract(b.genres, '$[0]')) AS genres, COUNT(DISTINCT b.section) AS sections
                 FROM progress p JOIN books b ON b.id = p.book_id WHERE p.user_id = ? AND p.finished_at IS NOT NULL`, userId);
  const q = one(`SELECT COUNT(*) AS attempts, COUNT(DISTINCT book_id) AS books,
                 SUM(CASE WHEN score = total THEN 1 ELSE 0 END) AS perfect,
                 ROUND(AVG(score * 100.0 / total)) AS avg FROM quiz_attempts WHERE user_id = ?`, userId);
  const favorites = one('SELECT COUNT(*) AS n FROM favorites WHERE user_id = ?', userId).n;
  const st = streaks(userId);
  return {
    started: p.started,
    finished: p.finished,
    minutes: Math.round(p.seconds / 60),
    genres: g.genres,
    sections: g.sections,
    favorites,
    quizAttempts: q.attempts,
    quizBooks: q.books,
    perfectQuizzes: q.perfect || 0,
    quizAverage: q.avg ?? null,
    streak: st.current,
    bestStreak: st.best,
    daysRead: st.daysRead
  };
}

/** Evalúa los logros y devuelve los recién desbloqueados. */
function evaluateAchievements(userId) {
  const stats = userStats(userId);
  const have = new Set(all('SELECT code FROM achievements WHERE user_id = ?', userId).map((r) => r.code));
  const unlocked = [];
  for (const a of ACHIEVEMENTS) {
    if (!have.has(a.code) && a.test(stats)) {
      run('INSERT OR IGNORE INTO achievements (user_id, code) VALUES (?, ?)', userId, a.code);
      unlocked.push(publicAchievement(a));
    }
  }
  return unlocked;
}

const publicAchievement = (a, unlockedAt) => ({ code: a.code, title: a.title, description: a.description, icon: a.icon, unlockedAt: unlockedAt || null });

function listAchievements(userId) {
  const have = new Map(all('SELECT code, unlocked_at FROM achievements WHERE user_id = ?', userId).map((r) => [r.code, r.unlocked_at]));
  return ACHIEVEMENTS.map((a) => publicAchievement(a, have.get(a.code)));
}

module.exports = { userStats, evaluateAchievements, listAchievements, ACHIEVEMENTS };
