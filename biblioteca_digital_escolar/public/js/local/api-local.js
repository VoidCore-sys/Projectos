/** Misma interfaz que api.js, pero atendida por el backend que corre dentro de la página. */
import { handle, HttpError } from './backend.js';

export class ApiError extends Error {
  constructor(status, message, fields) { super(message); this.status = status; this.fields = fields || {}; }
}
let onUnauthorized = () => {};
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn; };

export async function api(path, { method = 'GET', body, silent401 = false } = {}) {
  try {
    const out = await handle(method, path, body === undefined ? undefined : JSON.parse(JSON.stringify(body)));
    return out === undefined ? null : JSON.parse(JSON.stringify(out));
  } catch (err) {
    if (err instanceof HttpError) {
      if (err.status === 401 && !silent401) onUnauthorized();
      throw new ApiError(err.status, err.message, err.fields);
    }
    console.error(err);
    throw new ApiError(500, err?.message || 'Ocurrió un error inesperado.');
  }
}
export const get = (p, o) => api(p, o);
export const post = (p, body, o) => api(p, { ...o, method: 'POST', body: body ?? {} });
export const put = (p, body, o) => api(p, { ...o, method: 'PUT', body: body ?? {} });
export const patch = (p, body, o) => api(p, { ...o, method: 'PATCH', body: body ?? {} });
export const del = (p, o) => api(p, { ...o, method: 'DELETE' });
