/* PENALTY LEGENDS — core: namespace, math utils, RNG, event bus */
(function (G) {
  'use strict';
  const PL = (G.PL = G.PL || {});
  PL.VERSION = '1.0.0';

  const U = (PL.U = {
    clamp: (v, a, b) => (v < a ? a : v > b ? b : v),
    lerp: (a, b, t) => a + (b - a) * t,
    invLerp: (a, b, v) => (v - a) / (b - a),
    smooth: (t) => t * t * (3 - 2 * t),
    easeOut: (t) => 1 - (1 - t) * (1 - t) * (1 - t),
    easeIn: (t) => t * t * t,
    easeInOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    rand: (a = 0, b = 1) => a + Math.random() * (b - a),
    randi: (a, b) => Math.floor(a + Math.random() * (b - a + 1)),
    choice: (arr) => arr[Math.floor(Math.random() * arr.length)],
    chance: (p) => Math.random() < p,
    sign: (v) => (v < 0 ? -1 : 1),
    approach(cur, target, d) {
      return cur < target ? Math.min(cur + d, target) : Math.max(cur - d, target);
    },
    gauss() {
      let u = 0, v = 0;
      while (u === 0) u = Math.random();
      while (v === 0) v = Math.random();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    },
    hash(str) {
      let h = 2166136261;
      for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
      return h >>> 0;
    },
    // deterministic integer hash noise
    h2(x, y, s = 0) {
      let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0;
      h = Math.imul(h ^ (h >>> 13), 1274126177);
      return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
    },
    rng(seed) {
      let a = seed >>> 0;
      return function () {
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    },
    shuffle(arr, r = Math.random) {
      for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
      return arr;
    },
    fmt: (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
    pct: (a, b) => (b > 0 ? Math.round((a / b) * 100) : 0),
    deepClone: (o) => JSON.parse(JSON.stringify(o)),
    esc: (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])),
  });

  // 3D vector helpers (plain objects)
  const V = (PL.V = {
    v: (x = 0, y = 0, z = 0) => ({ x, y, z }),
    add: (a, b) => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z }),
    sub: (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z }),
    mul: (a, s) => ({ x: a.x * s, y: a.y * s, z: a.z * s }),
    dot: (a, b) => a.x * b.x + a.y * b.y + a.z * b.z,
    cross: (a, b) => ({ x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x }),
    len: (a) => Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z),
    norm(a) { const l = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z) || 1; return { x: a.x / l, y: a.y / l, z: a.z / l }; },
    lerp: (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: a.z + (b.z - a.z) * t }),
    // rotate vector v around unit axis k by angle (Rodrigues)
    rot(v, k, ang) {
      const c = Math.cos(ang), s = Math.sin(ang), d = (k.x * v.x + k.y * v.y + k.z * v.z) * (1 - c);
      return {
        x: v.x * c + (k.y * v.z - k.z * v.y) * s + k.x * d,
        y: v.y * c + (k.z * v.x - k.x * v.z) * s + k.y * d,
        z: v.z * c + (k.x * v.y - k.y * v.x) * s + k.z * d,
      };
    },
    // closest point on segment ab to p, returns t
    segT(p, a, b) {
      const abx = b.x - a.x, aby = b.y - a.y, abz = b.z - a.z;
      const l2 = abx * abx + aby * aby + abz * abz;
      if (l2 < 1e-9) return 0;
      return U.clamp(((p.x - a.x) * abx + (p.y - a.y) * aby + (p.z - a.z) * abz) / l2, 0, 1);
    },
  });

  // Simple event bus
  PL.Bus = {
    _h: {},
    on(ev, fn) { (this._h[ev] = this._h[ev] || []).push(fn); return fn; },
    off(ev, fn) { const a = this._h[ev]; if (a) { const i = a.indexOf(fn); if (i >= 0) a.splice(i, 1); } },
    emit(ev, data) { const a = this._h[ev]; if (a) a.slice().forEach((f) => { try { f(data); } catch (e) { console.error(e); } }); },
  };

  // World constants (meters). Penalty spot at origin, goal line at z = 11.
  PL.W = {
    GOAL_Z: 11, GOAL_HW: 3.66, GOAL_H: 2.44, POST_R: 0.06, BALL_R: 0.11,
    NET_DEPTH: 2.0, NET_BACK_H: 1.9, BOARD_Z: 16.5, GRAV: 9.81,
  };
})(typeof window !== 'undefined' ? window : globalThis);
