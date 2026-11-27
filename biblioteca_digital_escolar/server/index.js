'use strict';
const express = require('express');
const path = require('path');
const { securityHeaders, csrfGuard, errorHandler } = require('./security');
const { loadUser } = require('./auth');
const { HttpError } = require('./util');
const staff = require('./routes/staff');

require('./seed').run();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const ROOT = path.join(__dirname, '..');

app.disable('x-powered-by');
if (process.env.TRUST_PROXY) app.set('trust proxy', Number(process.env.TRUST_PROXY) || 1);
app.use(securityHeaders);

/* ---------- API ---------- */
app.use('/api', express.json({ limit: '2mb' }), csrfGuard, loadUser, (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});
app.use('/api/auth', require('./routes/auth'));
app.use('/api/me', require('./routes/me'));
app.use('/api/teacher', staff.teacher);
app.use('/api/manage', staff.manage);
app.use('/api/admin', staff.admin);
app.use('/api', require('./routes/library'));
app.use('/api', (req, res, next) => next(new HttpError(404, 'Recurso no encontrado.')));

/* ---------- Archivos estáticos ---------- */
for (const font of ['fredoka', 'nunito', 'literata']) {
  app.use(`/vendor/${font}`, express.static(path.join(ROOT, 'node_modules', '@fontsource', font), { maxAge: '30d', immutable: true }));
}
app.use(express.static(path.join(ROOT, 'public'), { maxAge: process.env.NODE_ENV === 'production' ? '1h' : 0 }));
// Aplicación de una sola página: cualquier otra ruta GET devuelve index.html.
app.use((req, res, next) => {
  if (req.method !== 'GET' || path.extname(req.path)) return next();
  res.sendFile(path.join(ROOT, 'public', 'index.html'));
});
app.use((req, res, next) => next(new HttpError(404, 'No encontrado.')));
app.use(errorHandler);

app.listen(PORT, () => console.log(`Biblioteca Digital Escolar lista en http://localhost:${PORT}`));
