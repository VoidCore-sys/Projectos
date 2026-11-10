/* PENALTY LEGENDS — software pixel framebuffer, color helpers and 3x5 pixel font */
(function (G) {
  'use strict';
  const PL = G.PL;
  const U = PL.U;

  // Colors are packed as little-endian ABGR uint32 (matches ImageData byte order RGBA)
  const C = (PL.C = {
    rgb: (r, g, b, a = 255) => (((a & 255) << 24) | ((b & 255) << 16) | ((g & 255) << 8) | (r & 255)) >>> 0,
    hex(s) {
      s = s.replace('#', '');
      if (s.length === 3) s = s.split('').map((c) => c + c).join('');
      const n = parseInt(s, 16);
      return C.rgb((n >> 16) & 255, (n >> 8) & 255, n & 255);
    },
    r: (c) => c & 255, g: (c) => (c >>> 8) & 255, b: (c) => (c >>> 16) & 255, a: (c) => c >>> 24,
    mix(c1, c2, t) {
      return C.rgb(
        (c1 & 255) + ((c2 & 255) - (c1 & 255)) * t,
        ((c1 >>> 8) & 255) + (((c2 >>> 8) & 255) - ((c1 >>> 8) & 255)) * t,
        ((c1 >>> 16) & 255) + (((c2 >>> 16) & 255) - ((c1 >>> 16) & 255)) * t
      );
    },
    shade(c, f) {
      if (f <= 1) return C.rgb((c & 255) * f, ((c >>> 8) & 255) * f, ((c >>> 16) & 255) * f);
      const t = f - 1;
      return C.mix(c, 0xffffffff, U.clamp(t, 0, 1));
    },
    css(c) { return `rgb(${c & 255},${(c >>> 8) & 255},${(c >>> 16) & 255})`; },
    tri(c) { return { base: c, hi: C.shade(c, 1.28), sh: C.shade(c, 0.66) }; },
  });
  C.OUT = C.hex('#140f1c');
  C.WHITE = C.hex('#ffffff');
  C.BLACK = C.hex('#000000');

  // 3x5 pixel font
  const FONT_SRC = {
    '0': '111101101101111', '1': '010110010010111', '2': '111001111100111', '3': '111001111001111', '4': '101101111001001',
    '5': '111100111001111', '6': '111100111101111', '7': '111001001010010', '8': '111101111101111', '9': '111101111001111',
    A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110', E: '111100110100111',
    F: '111100110100100', G: '011100101101011', H: '101101111101101', I: '111010010010111', J: '001001001101010',
    K: '101101110101101', L: '100100100100111', M: '101111111101101', N: '110101101101101', O: '010101101101010',
    P: '110101110100100', Q: '010101101110011', R: '110101110101101', S: '011100010001110', T: '111010010010010',
    U: '101101101101111', V: '101101101101010', W: '101101111111101', X: '101101010101101', Y: '101101010010010',
    Z: '111001010100111', '-': '000000111000000', ':': '000010000010000', '.': '000000000000010', '!': '010010010000010',
    '+': '000010111010000', '/': '001001010100100', "'": '010010000000000', ' ': '000000000000000', '?': '110001010000010',
  };
  const FONT = {};
  for (const k in FONT_SRC) FONT[k] = FONT_SRC[k].split('').map((c) => c === '1');
  const ACC = { 'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U', 'Ñ': 'N', 'Ü': 'U' };

  class PixBuf {
    constructor(w, h) { this.resize(w, h); }
    resize(w, h) {
      this.w = w | 0; this.h = h | 0;
      this.data = new Uint32Array(this.w * this.h);
      this.resetBox();
    }
    resetBox() { this.x0 = 1e9; this.y0 = 1e9; this.x1 = -1e9; this.y1 = -1e9; }
    box(x, y) {
      if (x < this.x0) this.x0 = x; if (x > this.x1) this.x1 = x;
      if (y < this.y0) this.y0 = y; if (y > this.y1) this.y1 = y;
    }
    clear(c = 0) { this.data.fill(c); }
    clearBox() {
      if (this.x1 < this.x0) return;
      const x0 = Math.max(0, this.x0 - 2), x1 = Math.min(this.w - 1, this.x1 + 2);
      const y0 = Math.max(0, this.y0 - 2), y1 = Math.min(this.h - 1, this.y1 + 2);
      for (let y = y0; y <= y1; y++) this.data.fill(0, y * this.w + x0, y * this.w + x1 + 1);
      this.resetBox();
    }
    px(x, y, c) {
      x |= 0; y |= 0;
      if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
      this.data[y * this.w + x] = c;
    }
    get(x, y) {
      x |= 0; y |= 0;
      if (x < 0 || y < 0 || x >= this.w || y >= this.h) return 0;
      return this.data[y * this.w + x];
    }
    blend(x, y, c, a) {
      x |= 0; y |= 0;
      if (x < 0 || y < 0 || x >= this.w || y >= this.h || a <= 0) return;
      const i = y * this.w + x;
      if (a >= 1) { this.data[i] = c; return; }
      const d = this.data[i];
      const r = (d & 255) + ((c & 255) - (d & 255)) * a;
      const g = ((d >>> 8) & 255) + (((c >>> 8) & 255) - ((d >>> 8) & 255)) * a;
      const b = ((d >>> 16) & 255) + (((c >>> 16) & 255) - ((d >>> 16) & 255)) * a;
      this.data[i] = (0xff000000 | ((b & 255) << 16) | ((g & 255) << 8) | (r & 255)) >>> 0;
    }
    add(x, y, r0, g0, b0) {
      x |= 0; y |= 0;
      if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
      const i = y * this.w + x, d = this.data[i];
      const r = Math.min(255, (d & 255) + r0), g = Math.min(255, ((d >>> 8) & 255) + g0), b = Math.min(255, ((d >>> 16) & 255) + b0);
      this.data[i] = (0xff000000 | (b << 16) | (g << 8) | r) >>> 0;
    }
    darken(x, y, f) {
      x |= 0; y |= 0;
      if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
      const i = y * this.w + x, d = this.data[i];
      this.data[i] = (0xff000000 | ((((d >>> 16) & 255) * f) << 16) | ((((d >>> 8) & 255) * f) << 8) | ((d & 255) * f)) >>> 0;
    }
    rect(x, y, w, h, c) {
      const x0 = Math.max(0, x | 0), y0 = Math.max(0, y | 0), x1 = Math.min(this.w, (x + w) | 0), y1 = Math.min(this.h, (y + h) | 0);
      for (let yy = y0; yy < y1; yy++) this.data.fill(c, yy * this.w + x0, yy * this.w + Math.max(x0, x1));
    }
    blendRect(x, y, w, h, c, a) {
      for (let yy = y | 0; yy < (y + h) | 0; yy++) for (let xx = x | 0; xx < (x + w) | 0; xx++) this.blend(xx, yy, c, a);
    }
    line(x0, y0, x1, y1, c, a = 1) {
      x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
      const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
      let err = dx + dy, n = 0;
      while (n++ < 4000) {
        if (a >= 1) this.px(x0, y0, c); else this.blend(x0, y0, c, a);
        if (x0 === x1 && y0 === y1) break;
        const e2 = 2 * err;
        if (e2 >= dy) { err += dy; x0 += sx; }
        if (e2 <= dx) { err += dx; y0 += sy; }
      }
    }
    disc(cx, cy, r, c, a = 1) {
      const r2 = r * r;
      for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++)
        for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) {
          const dx = x + 0.5 - cx, dy = y + 0.5 - cy;
          if (dx * dx + dy * dy <= r2) { if (a >= 1) this.px(x, y, c); else this.blend(x, y, c, a); }
        }
    }
    ellipseShade(cx, cy, rx, ry, f) {
      if (rx < 0.5 || ry < 0.3) return;
      for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
        for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
          const dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry;
          const d = dx * dx + dy * dy;
          if (d <= 1) this.darken(x, y, d < 0.45 ? f : (f + 1) / 2);
        }
    }
    // Shaded capsule: pal = {base,hi,sh}. Light from upper-left. Writes with bbox tracking.
    capsule(ax, ay, bx, by, r, pal, fn) {
      if (r < 0.5) r = 0.5;
      const minx = Math.floor(Math.min(ax, bx) - r), maxx = Math.ceil(Math.max(ax, bx) + r);
      const miny = Math.floor(Math.min(ay, by) - r), maxy = Math.ceil(Math.max(ay, by) + r);
      const abx = bx - ax, aby = by - ay, l2 = abx * abx + aby * aby || 1e-6;
      const r2 = r * r;
      for (let y = Math.max(0, miny); y <= Math.min(this.h - 1, maxy); y++) {
        for (let x = Math.max(0, minx); x <= Math.min(this.w - 1, maxx); x++) {
          const px = x + 0.5, py = y + 0.5;
          let t = ((px - ax) * abx + (py - ay) * aby) / l2;
          t = t < 0 ? 0 : t > 1 ? 1 : t;
          const dx = px - (ax + abx * t), dy = py - (ay + aby * t);
          const d2 = dx * dx + dy * dy;
          if (d2 > r2) continue;
          let c;
          if (fn) { c = fn(x, y, t, dx / r, dy / r); if (!c) continue; }
          else {
            const l = (-0.62 * dx - 0.78 * dy) / r;
            c = l > 0.38 ? pal.hi : l < -0.42 ? pal.sh : pal.base;
          }
          this.data[y * this.w + x] = c;
          this.box(x, y);
        }
      }
    }
    // Convex polygon fill with per-pixel callback fn(x,y) -> color|0
    poly(pts, fn) {
      let miny = 1e9, maxy = -1e9;
      for (const p of pts) { if (p.y < miny) miny = p.y; if (p.y > maxy) maxy = p.y; }
      miny = Math.max(0, Math.floor(miny)); maxy = Math.min(this.h - 1, Math.ceil(maxy));
      const n = pts.length;
      for (let y = miny; y <= maxy; y++) {
        const sy = y + 0.5;
        let xl = 1e9, xr = -1e9;
        for (let i = 0; i < n; i++) {
          const a = pts[i], b = pts[(i + 1) % n];
          if ((a.y <= sy && b.y > sy) || (b.y <= sy && a.y > sy)) {
            const x = a.x + ((sy - a.y) / (b.y - a.y)) * (b.x - a.x);
            if (x < xl) xl = x; if (x > xr) xr = x;
          }
        }
        if (xl > xr) continue;
        for (let x = Math.max(0, Math.round(xl)); x < Math.min(this.w, Math.round(xr)); x++) {
          const c = fn(x, y);
          if (c) { this.data[y * this.w + x] = c; this.box(x, y); }
        }
      }
    }
    // 1px outline around opaque pixels within tracked bbox
    outline(col = C.OUT) {
      if (this.x1 < this.x0) return;
      const w = this.w, d = this.data;
      const x0 = Math.max(1, this.x0 - 1), x1 = Math.min(w - 2, this.x1 + 1);
      const y0 = Math.max(1, this.y0 - 1), y1 = Math.min(this.h - 2, this.y1 + 1);
      const mark = [];
      for (let y = y0; y <= y1; y++)
        for (let x = x0; x <= x1; x++) {
          const i = y * w + x;
          if (d[i]) continue;
          if (d[i - 1] || d[i + 1] || d[i - w] || d[i + w]) mark.push(i);
        }
      for (const i of mark) d[i] = col;
      this.x0 = x0; this.y0 = y0; this.x1 = x1; this.y1 = y1;
    }
    // copy non-transparent pixels of src (same size) within its bbox
    compositeFrom(src) {
      if (src.x1 < src.x0) return;
      const w = this.w, d = this.data, s = src.data;
      const x0 = Math.max(0, src.x0), x1 = Math.min(w - 1, src.x1), y0 = Math.max(0, src.y0), y1 = Math.min(this.h - 1, src.y1);
      for (let y = y0; y <= y1; y++) {
        const row = y * w;
        for (let x = x0; x <= x1; x++) { const c = s[row + x]; if (c) d[row + x] = c; }
      }
    }
    text(str, x, y, c, scale = 1, align = 'left', shadow = 0) {
      str = String(str).toUpperCase();
      const wdt = this.textWidth(str, scale);
      if (align === 'center') x -= wdt / 2; else if (align === 'right') x -= wdt;
      x = Math.round(x); y = Math.round(y);
      for (let pass = shadow ? 0 : 1; pass < 2; pass++) {
        let cx = x;
        for (const ch0 of str) {
          const ch = ACC[ch0] || ch0;
          const g = FONT[ch] || FONT['?'];
          for (let i = 0; i < 15; i++)
            if (g[i]) {
              const gx = cx + (i % 3) * scale, gy = y + Math.floor(i / 3) * scale;
              if (pass === 0) this.rect(gx + scale, gy + scale, scale, scale, shadow);
              else this.rect(gx, gy, scale, scale, c);
            }
          cx += 4 * scale;
        }
      }
    }
    textWidth(str, scale = 1) { return Math.max(0, String(str).length * 4 * scale - scale); }
  }
  PL.PixBuf = PixBuf;
  PL.FONT = FONT;
})(typeof window !== 'undefined' ? window : globalThis);
