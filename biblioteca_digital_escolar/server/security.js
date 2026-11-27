'use strict';
const { HttpError } = require('./util');

/** Cabeceras de seguridad (equivalente reducido a helmet). */
function securityHeaders(req, res, next) {
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'"
  ].join('; '));
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  next();
}

/**
 * Protección CSRF: toda petición que modifica datos debe ser JSON
 * (los formularios de otros sitios no pueden enviarlo sin CORS) y, si el
 * navegador envía Origin, debe coincidir con el host.
 */
function csrfGuard(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const origin = req.headers.origin;
  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.host) return next(new HttpError(403, 'Origen no permitido.'));
    } catch {
      return next(new HttpError(403, 'Origen no permitido.'));
    }
  }
  const type = req.headers['content-type'] || '';
  const hasBody = Number(req.headers['content-length'] || 0) > 0 || req.headers['transfer-encoding'];
  if (hasBody && !type.includes('application/json')) return next(new HttpError(415, 'Formato no admitido.'));
  if (req.headers['x-requested-with'] !== 'biblioteca') return next(new HttpError(403, 'Petición no válida.'));
  next();
}

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  if (err.type === 'entity.parse.failed') err = new HttpError(400, 'Los datos enviados no son válidos.');
  if (err.type === 'entity.too.large') err = new HttpError(413, 'El contenido es demasiado grande.');
  const status = err.status || 500;
  if (status >= 500) console.error('[error]', err);
  res.status(status).json({
    error: status >= 500 ? 'Ocurrió un error inesperado. Probá de nuevo en unos minutos.' : err.message,
    fields: err.fields
  });
}

module.exports = { securityHeaders, csrfGuard, errorHandler };
