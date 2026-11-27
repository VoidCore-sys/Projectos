'use strict';
/**
 * Capa de acceso a datos. Usa el módulo SQLite nativo de Node (node:sqlite),
 * por lo que no requiere dependencias nativas ni servidores externos.
 * La base se guarda en data/biblioteca.db (configurable con DB_PATH).
 */
const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'biblioteca.db');
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  username      TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  display_name  TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student','teacher','admin')),
  grade         INTEGER CHECK (grade IS NULL OR grade BETWEEN 1 AND 7),
  avatar        TEXT NOT NULL DEFAULT 'zorro',
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  last_login    TEXT
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

CREATE TABLE IF NOT EXISTS books (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT NOT NULL UNIQUE,
  title       TEXT NOT NULL,
  author      TEXT NOT NULL,
  synopsis    TEXT NOT NULL,
  genres      TEXT NOT NULL DEFAULT '[]',
  grade_min   INTEGER NOT NULL CHECK (grade_min BETWEEN 1 AND 7),
  grade_max   INTEGER NOT NULL CHECK (grade_max BETWEEN 1 AND 7),
  section     INTEGER NOT NULL CHECK (section BETWEEN 1 AND 3),
  cover       TEXT NOT NULL DEFAULT '{}',
  word_count  INTEGER NOT NULL DEFAULT 0,
  status      TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published','draft')),
  featured    INTEGER NOT NULL DEFAULT 0,
  license     TEXT NOT NULL DEFAULT 'Obra original',
  created_by  INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS chapters (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  book_id      INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  position     INTEGER NOT NULL,
  title        TEXT NOT NULL,
  illustration TEXT,
  content      TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_chapters_book ON chapters(book_id, position);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  book_id     INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  position    INTEGER NOT NULL,
  question    TEXT NOT NULL,
  options     TEXT NOT NULL,
  correct     INTEGER NOT NULL,
  explanation TEXT
);
CREATE INDEX IF NOT EXISTS idx_quiz_book ON quiz_questions(book_id, position);

CREATE TABLE IF NOT EXISTS progress (
  user_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  book_id        INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  chapter        INTEGER NOT NULL DEFAULT 0,
  paragraph      INTEGER NOT NULL DEFAULT 0,
  page           INTEGER NOT NULL DEFAULT 0,
  total_pages    INTEGER NOT NULL DEFAULT 0,
  percent        REAL NOT NULL DEFAULT 0,
  seconds_read   INTEGER NOT NULL DEFAULT 0,
  times_finished INTEGER NOT NULL DEFAULT 0,
  started_at     TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT NOT NULL DEFAULT (datetime('now')),
  finished_at    TEXT,
  PRIMARY KEY (user_id, book_id)
);

CREATE TABLE IF NOT EXISTS favorites (
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  book_id    INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, book_id)
);

CREATE TABLE IF NOT EXISTS reading_days (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  day     TEXT NOT NULL,
  seconds INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, book_id, day)
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  book_id    INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  score      INTEGER NOT NULL,
  total      INTEGER NOT NULL,
  answers    TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_attempts_user ON quiz_attempts(user_id);

CREATE TABLE IF NOT EXISTS achievements (
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code        TEXT NOT NULL,
  unlocked_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, code)
);
`);

/** Ejecuta fn dentro de una transacción. */
function tx(fn) {
  db.exec('BEGIN');
  try {
    const result = fn();
    db.exec('COMMIT');
    return result;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

const one = (sql, ...params) => db.prepare(sql).get(...params);
const all = (sql, ...params) => db.prepare(sql).all(...params);
const run = (sql, ...params) => db.prepare(sql).run(...params);

module.exports = { db, tx, one, all, run, DB_PATH };
