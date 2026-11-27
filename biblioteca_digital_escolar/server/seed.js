'use strict';
/**
 * Carga inicial: libros originales de server/content y cuentas de demostración.
 * Sólo se ejecuta si la base está vacía, por lo que nunca pisa datos reales.
 */
const fs = require('fs');
const path = require('path');
const { one, run } = require('./db');
const { hashPassword } = require('./auth');
const { validateBookInput, saveBook } = require('./books');

const DEMO_USERS = [
  { username: 'admin', displayName: 'Dirección', role: 'admin', password: process.env.ADMIN_PASSWORD || 'Admin2026', avatar: 'buho' },
  { username: 'docente', displayName: 'Seño Laura', role: 'teacher', password: process.env.TEACHER_PASSWORD || 'Docente2026', avatar: 'oso' },
  { username: 'alumno', displayName: 'Valentín', role: 'student', grade: 4, password: process.env.STUDENT_PASSWORD || 'alumno1', avatar: 'zorro' }
];

function loadContent() {
  const dir = path.join(__dirname, 'content');
  // Cada archivo puede exportar un libro o una lista de libros.
  return fs.readdirSync(dir).filter((f) => f.endsWith('.js')).sort().flatMap((f) => [].concat(require(path.join(dir, f))));
}

function run_() {
  if (!one('SELECT id FROM users LIMIT 1') && process.env.SEED_DEMO_USERS !== 'false') {
    for (const u of DEMO_USERS) {
      run('INSERT INTO users (username, password_hash, display_name, role, grade, avatar) VALUES (?, ?, ?, ?, ?, ?)',
        u.username, hashPassword(u.password), u.displayName, u.role, u.grade ?? null, u.avatar);
    }
    console.log('Cuentas de demostración creadas: admin / docente / alumno (ver README).');
  }
  // Agrega los libros de la colección que todavía no estén (también en bases ya existentes).
  const books = loadContent();
  const adminId = one("SELECT id FROM users WHERE role = 'admin' ORDER BY id LIMIT 1")?.id ?? null;
  let added = 0;
  books.forEach((b, i) => {
    if (one('SELECT id FROM books WHERE slug = ?', b.slug)) return;
    const data = validateBookInput({ ...b, status: 'published' });
    const date = new Date(Date.now() - (books.length - i) * 1.5 * 86400000).toISOString().replace('T', ' ').slice(0, 19);
    saveBook(data, { userId: adminId, slug: b.slug, license: b.license, createdAt: date });
    added++;
  });
  if (added) console.log(`Se cargaron ${added} libros en la biblioteca.`);
}

module.exports = { run: run_ };
