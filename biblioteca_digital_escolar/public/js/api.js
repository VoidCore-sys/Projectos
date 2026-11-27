/** Cliente HTTP de la API. Maneja errores y sesión vencida de forma uniforme. */
export class ApiError extends Error {
  constructor(status, message, fields) {
    super(message);
    this.status = status;
    this.fields = fields || {};
  }
}

let onUnauthorized = () => {};
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn; };

export async function api(path, { method = 'GET', body, keepalive = false, silent401 = false } = {}) {
  let res;
  try {
    res = await fetch(`/api${path}`, {
      method,
      credentials: 'same-origin',
      keepalive,
      headers: {
        'X-Requested-With': 'biblioteca',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {})
      },
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
  } catch {
    throw new ApiError(0, 'No hay conexión con el servidor. Revisá tu internet y probá de nuevo.');
  }
  let data = null;
  try { data = await res.json(); } catch { /* respuesta sin cuerpo */ }
  if (!res.ok) {
    if (res.status === 401 && !silent401) onUnauthorized();
    throw new ApiError(res.status, data?.error || 'Ocurrió un error inesperado.', data?.fields);
  }
  return data;
}

export const get = (p, o) => api(p, o);
export const post = (p, body, o) => api(p, { ...o, method: 'POST', body: body ?? {} });
export const put = (p, body, o) => api(p, { ...o, method: 'PUT', body: body ?? {} });
export const patch = (p, body, o) => api(p, { ...o, method: 'PATCH', body: body ?? {} });
export const del = (p, o) => api(p, { ...o, method: 'DELETE' });
