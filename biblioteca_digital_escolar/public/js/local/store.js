/**
 * Almacenamiento persistente para la versión de un solo archivo.
 *  - Dentro del artifact de claude.ai: base de datos compartida del artifact (capacidad `db`),
 *    con un documento por cuenta y uno por libro publicado o modificado.
 *  - Abierto como archivo .html suelto: almacenamiento del navegador (localStorage).
 * En ambos casos se mantiene una copia en memoria y cada cambio se guarda enseguida.
 */
const LOCAL_KEY = 'bde.datos.v1';

const clone = (o) => JSON.parse(JSON.stringify(o));

class LocalStore {
  constructor() { this.mode = 'local'; }
  async load() {
    let data = null;
    try { data = JSON.parse(localStorage.getItem(LOCAL_KEY) || 'null'); } catch { data = null; }
    this.data = data && typeof data === 'object' ? data : { accounts: {}, books: {} };
    this.data.accounts ||= {};
    this.data.books ||= {};
    return this.data;
  }
  flush() {
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(this.data)); return Promise.resolve(); }
    catch { return Promise.reject(new Error('No hay espacio para guardar en este navegador.')); }
  }
  saveAccount(acc) { this.data.accounts[acc.username] = acc; return this.flush(); }
  deleteAccount(username) { delete this.data.accounts[username]; return this.flush(); }
  saveBook(book) { this.data.books['b' + book.id] = book; return this.flush(); }
  onChange() {}
}

class DbStore {
  constructor(db) {
    this.db = db;
    this.mode = 'db';
    this.data = { accounts: {}, books: {} };
    this.queue = new Map();
    this.listeners = new Set();
  }

  /** Carga inicial y suscripción en vivo (otros alumnos y docentes ven los cambios). */
  load() {
    return new Promise((resolve, reject) => {
      let gotA = false;
      let gotB = false;
      const timer = setTimeout(() => reject(new Error('No pudimos conectar con la base de datos de la biblioteca. Revisá la conexión y volvé a abrir la página.')), 12000);
      const done = () => { if (gotA && gotB) { clearTimeout(timer); resolve(this.data); } };
      const fail = (e) => { clearTimeout(timer); reject(new Error(e?.message || 'No pudimos leer la base de datos.')); };
      this.db.collection('accounts').onSnapshot((snap) => {
        for (const ch of snap.docChanges()) {
          const id = ch.doc.id;
          if (ch.type === 'removed') delete this.data.accounts[id];
          else if (!this.queue.has('accounts/' + id)) this.data.accounts[id] = clone(ch.doc.data());
        }
        gotA = true; done(); this.emit();
      }, fail);
      this.db.collection('books').onSnapshot((snap) => {
        for (const ch of snap.docChanges()) {
          const id = ch.doc.id;
          if (ch.type === 'removed') delete this.data.books[id];
          else if (!this.queue.has('books/' + id)) this.data.books[id] = clone(ch.doc.data());
        }
        gotB = true; done(); this.emit();
      }, fail);
    });
  }

  emit() { this.listeners.forEach((fn) => fn()); }
  onChange(fn) { this.listeners.add(fn); }

  /** Una escritura a la vez por documento; si llegan varias seguidas, se guarda la última. */
  write(path, body) {
    const entry = this.queue.get(path);
    if (entry) { entry.next = body; return entry.promise; }
    const e = { next: null };
    e.promise = (async () => {
      let current = body;
      try {
        while (current) {
          const ref = this.db.doc(path);
          if (current === '__delete__') await ref.delete(); else await ref.set(clone(current));
          current = e.next;
          e.next = null;
        }
      } finally {
        this.queue.delete(path);
      }
    })();
    this.queue.set(path, e);
    return e.promise.catch((err) => {
      throw new Error(err?.code === 'invalid_argument'
        ? 'Tu cuenta de claude.ai no tiene permiso para guardar en esta biblioteca. Pedile a quien la publicó acceso de "Colaborador".'
        : err?.code === 'quota_exceeded' ? 'La base de datos de la biblioteca está llena.' : 'No pudimos guardar los cambios. Probá de nuevo.');
    });
  }

  saveAccount(acc) { this.data.accounts[acc.username] = acc; return this.write('accounts/' + acc.username, acc); }
  deleteAccount(username) { delete this.data.accounts[username]; return this.write('accounts/' + username, '__delete__'); }
  saveBook(book) { this.data.books['b' + book.id] = book; return this.write('books/b' + book.id, book); }
}

export async function openStore() {
  let db = null;
  if (window.claude?.use) {
    try { db = await window.claude.use('db'); } catch { db = null; }
  }
  const store = db ? new DbStore(db) : new LocalStore();
  await store.load();
  return store;
}
