/**
 * PBKDF2-HMAC-SHA256 en JavaScript puro.
 * Se usa sólo cuando el navegador no ofrece crypto.subtle (páginas abiertas fuera de un
 * "contexto seguro": algunos visores de archivos del celular, vistas web dentro de apps
 * o direcciones http:// con IP). Produce exactamente el mismo resultado que WebCrypto.
 */
const K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
]);
const IV = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
const W = new Uint32Array(64);

/** Procesa un bloque de 16 palabras sobre el estado h (in place). */
function compress(h, block) {
  for (let i = 0; i < 16; i++) W[i] = block[i];
  for (let i = 16; i < 64; i++) {
    const a = W[i - 15];
    const b = W[i - 2];
    const s0 = ((a >>> 7) | (a << 25)) ^ ((a >>> 18) | (a << 14)) ^ (a >>> 3);
    const s1 = ((b >>> 17) | (b << 15)) ^ ((b >>> 19) | (b << 13)) ^ (b >>> 10);
    W[i] = (W[i - 16] + s0 + W[i - 7] + s1) | 0;
  }
  let [a, b, c, d, e, f, g, hh] = h;
  for (let i = 0; i < 64; i++) {
    const S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
    const t1 = (hh + S1 + ((e & f) ^ (~e & g)) + K[i] + W[i]) | 0;
    const S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
    const t2 = (S0 + ((a & b) ^ (a & c) ^ (b & c))) | 0;
    hh = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
  }
  h[0] = (h[0] + a) | 0; h[1] = (h[1] + b) | 0; h[2] = (h[2] + c) | 0; h[3] = (h[3] + d) | 0;
  h[4] = (h[4] + e) | 0; h[5] = (h[5] + f) | 0; h[6] = (h[6] + g) | 0; h[7] = (h[7] + hh) | 0;
}

const toWords = (bytes) => {
  const out = new Uint32Array(bytes.length >> 2);
  for (let i = 0; i < out.length; i++) out[i] = (bytes[i * 4] << 24) | (bytes[i * 4 + 1] << 16) | (bytes[i * 4 + 2] << 8) | bytes[i * 4 + 3];
  return out;
};

/** SHA-256 de un mensaje completo (bytes), partiendo de un estado inicial dado. */
function sha256(bytes, state = IV, prefixLen = 0) {
  const total = bytes.length + prefixLen;
  const padded = new Uint8Array(((bytes.length + 9 + 63) >> 6) << 6);
  padded.set(bytes);
  padded[bytes.length] = 0x80;
  const bits = total * 8;
  const dv = new DataView(padded.buffer);
  dv.setUint32(padded.length - 8, Math.floor(bits / 2 ** 32));
  dv.setUint32(padded.length - 4, bits >>> 0);
  const h = Int32Array.from(state);
  const words = toWords(padded);
  for (let i = 0; i < words.length; i += 16) compress(h, words.subarray(i, i + 16));
  return h;
}

const wordsToBytes = (h) => {
  const out = new Uint8Array(h.length * 4);
  for (let i = 0; i < h.length; i++) { out[i * 4] = h[i] >>> 24; out[i * 4 + 1] = h[i] >>> 16; out[i * 4 + 2] = h[i] >>> 8; out[i * 4 + 3] = h[i]; }
  return out;
};

/** Deriva 32 bytes con PBKDF2-HMAC-SHA256 (un solo bloque, como usa la biblioteca). */
export function pbkdf2Sha256(passwordBytes, salt, iterations) {
  let key = passwordBytes;
  if (key.length > 64) key = wordsToBytes(sha256(key));
  const ipad = new Uint8Array(64).fill(0x36);
  const opad = new Uint8Array(64).fill(0x5c);
  for (let i = 0; i < key.length; i++) { ipad[i] ^= key[i]; opad[i] ^= key[i]; }
  // Estados precalculados de HMAC tras procesar las claves internas y externas.
  const inner = Int32Array.from(IV); compress(inner, toWords(ipad));
  const outer = Int32Array.from(IV); compress(outer, toWords(opad));
  const hmac = (msg) => sha256(wordsToBytes(sha256(msg, inner, 64)), outer, 64);

  // Bloque de 32 bytes con relleno fijo: reutilizado en cada iteración para no crear memoria.
  const block = new Uint32Array(16);
  block[8] = 0x80000000;
  block[15] = (64 + 32) * 8;
  const roundHmac = (u) => {
    const s1 = Int32Array.from(inner);
    for (let i = 0; i < 8; i++) block[i] = u[i];
    compress(s1, block);
    const s2 = Int32Array.from(outer);
    for (let i = 0; i < 8; i++) block[i] = s1[i];
    compress(s2, block);
    return s2;
  };

  const first = new Uint8Array(salt.length + 4);
  first.set(salt);
  first[salt.length + 3] = 1;
  let u = hmac(first);
  const t = Int32Array.from(u);
  for (let i = 1; i < iterations; i++) {
    u = roundHmac(u);
    for (let j = 0; j < 8; j++) t[j] ^= u[j];
  }
  return wordsToBytes(t).buffer;
}
