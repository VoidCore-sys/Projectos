/* PENALTY LEGENDS — stadium renderer: ray-cast pixel-art backgrounds, animated crowd, boards, scoreboard, weather */
(function (G) {
  'use strict';
  const PL = G.PL, U = PL.U, C = PL.C, V = PL.V;

  // value noise
  function vnoise(x, y, s) {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    const a = U.h2(xi, yi, s), b = U.h2(xi + 1, yi, s), c = U.h2(xi, yi + 1, s), d = U.h2(xi + 1, yi + 1, s);
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }
  function fbm(x, y, s, o = 4) { let t = 0, a = 0.5, f = 1; for (let i = 0; i < o; i++) { t += vnoise(x * f, y * f, s + i) * a; a *= 0.5; f *= 2; } return t; }
  PL.fbm = fbm;

  // Stadium geometry per kind
  function layout(st) {
    const L = { slopes: [], walls: [], roof: null, fence: null, trees: false, side: true };
    switch (st.kind) {
      case 'school':
        L.slopes.push({ z0: 21, y0: 0.4, z1: 24.5, y1: 2.6, x0: -16, x1: -3, rows: 5, mat: 'bench' });
        L.slopes.push({ z0: 21, y0: 0.4, z1: 24.5, y1: 2.6, x0: 3.5, x1: 15, rows: 5, mat: 'bench' });
        L.fence = { z: 18.8, h: 3.6 };
        L.trees = true; L.side = false;
        break;
      case 'big': case 'temple':
        L.walls.push({ z: 18, y0: 0, y1: 1.4, mat: 'wall' });
        L.slopes.push({ z0: 18, y0: 1.4, z1: 31, y1: 9.2, x0: -70, x1: 70, rows: 16, mat: 'seats' });
        L.walls.push({ z: 30.5, y0: 9.2, y1: 11.8, mat: 'fascia' });
        L.slopes.push({ z0: 30.5, y0: 11.8, z1: 50, y1: 25, x0: -80, x1: 80, rows: 22, mat: 'seats2' });
        L.roof = { y: 28.5, z0: 38, z1: 80 };
        break;
      case 'night':
        L.walls.push({ z: 18, y0: 0, y1: 1.4, mat: 'wall' });
        L.slopes.push({ z0: 18, y0: 1.4, z1: 31, y1: 9.2, x0: -70, x1: 70, rows: 16, mat: 'seats' });
        L.walls.push({ z: 30.5, y0: 9.2, y1: 11.2, mat: 'fascia' });
        L.slopes.push({ z0: 30.5, y0: 11.2, z1: 44, y1: 20, x0: -80, x1: 80, rows: 15, mat: 'seats2' });
        break;
      default: // pro / storm
        L.walls.push({ z: 18, y0: 0, y1: 1.5, mat: 'wall' });
        L.slopes.push({ z0: 18, y0: 1.5, z1: 38, y1: 13, x0: -70, x1: 70, rows: 22, mat: 'seats' });
        if (st.kind === 'storm') L.roof = { y: 16, z0: 33, z1: 60 };
    }
    return L;
  }

  // Crowd sprite templates: size -> pose -> [{dx,dy,t}] ; t: 1 skin 2 shirt 3 shirtShade 4 hair 5 dark
  const fanTpl = new Map();
  function fanTemplate(hgt, pose) {
    const key = hgt * 10 + pose;
    if (fanTpl.has(key)) return fanTpl.get(key);
    const w = Math.max(3, Math.round(hgt * 0.62)), H = hgt + 4;
    const b = new PL.PixBuf(w + 6, H + 2);
    const S = 1, SH = 2, SD = 3, HR = 4;
    const cx = (w + 6) / 2, top = 2;
    const hr = Math.max(0.8, hgt * 0.13);
    const hy = top + hr + (pose === 1 ? hgt * 0.05 : 0);
    const bodyTop = hy + hr * 0.9, bodyBot = H;
    const bw = Math.max(1.5, w * 0.36);
    // body
    b.capsule(cx, bodyTop + bw * 0.6, cx, bodyBot, bw, { base: SH, hi: SH, sh: SD });
    // head
    b.disc(cx, hy, hr, S);
    if (hgt >= 7) for (let x = Math.floor(cx - hr); x <= cx + hr; x++) b.px(x, Math.floor(hy - hr + 0.3), HR);
    const aw = Math.max(0.6, bw * 0.38);
    const sh = bodyTop + bw * 0.5;
    if (pose === 1) { // arms up
      b.capsule(cx - bw * 0.8, sh, cx - bw * 1.3, hy - hr * 1.6, aw, { base: SH, hi: SH, sh: SH });
      b.capsule(cx + bw * 0.8, sh, cx + bw * 1.3, hy - hr * 1.6, aw, { base: SH, hi: SH, sh: SH });
      b.px(cx - bw * 1.3, hy - hr * 1.6, S); b.px(cx + bw * 1.3, hy - hr * 1.6, S);
    } else if (pose === 2) { // hands on head
      b.capsule(cx - bw * 0.8, sh, cx - hr * 1.4, hy - hr * 0.4, aw, { base: SH, hi: SH, sh: SH });
      b.capsule(cx + bw * 0.8, sh, cx + hr * 1.4, hy - hr * 0.4, aw, { base: SH, hi: SH, sh: SH });
    } else if (pose === 3) { // clapping in front
      b.capsule(cx - bw * 0.8, sh, cx, sh + bw * 0.9, aw, { base: SD, hi: SD, sh: SD });
      b.capsule(cx + bw * 0.8, sh, cx, sh + bw * 0.9, aw, { base: SD, hi: SD, sh: SD });
      b.px(cx, sh + bw * 0.9, S);
    } else if (pose === 4) { // scarf / one arm up
      b.capsule(cx + bw * 0.8, sh, cx + bw * 1.4, hy - hr * 1.8, aw, { base: SH, hi: SH, sh: SH });
      b.capsule(cx + bw * 1.4, hy - hr * 1.8, cx + bw * 2.4, hy - hr * 1.2, aw * 1.2, { base: 6, hi: 6, sh: 6 });
    }
    const list = [];
    for (let y = 0; y < b.h; y++) for (let x = 0; x < b.w; x++) { const c = b.data[y * b.w + x]; if (c) list.push(x - Math.round(cx), y - H, c); }
    const tpl = new Int16Array(list);
    fanTpl.set(key, tpl);
    return tpl;
  }

  class Stadium {
    constructor(st) {
      this.st = st;
      this.L = layout(st);
      this.cache = new Map();
      this.grade = null;
      if (st.grade) {
        const g = st.grade;
        this.lut = [new Uint8Array(256), new Uint8Array(256), new Uint8Array(256)];
        for (let i = 0; i < 256; i++) {
          this.lut[0][i] = U.clamp(i * g.r + g.add[0], 0, 255);
          this.lut[1][i] = U.clamp(i * g.g + g.add[1], 0, 255);
          this.lut[2][i] = U.clamp(i * g.b + g.add[2], 0, 255);
        }
      }
      this.skyTop = C.hex(st.sky[0]); this.skyBot = C.hex(st.sky[1]);
      this.grassA = C.hex(st.grass[0]); this.grassB = C.hex(st.grass[1]);
      this.seat = C.hex(st.seats); this.standC = C.hex(st.stand);
      this.night = st.time === 'night';
      this.storm = st.time === 'storm';
      this.sunset = st.time === 'sunset';
    }
    key(cam) { return cam.W + 'x' + cam.H + ':' + cam.pos.x.toFixed(2) + ',' + cam.pos.y.toFixed(2) + ',' + cam.pos.z.toFixed(2) + ':' + cam.pitch.toFixed(3) + ':' + cam.yaw.toFixed(3) + ':' + cam.F.toFixed(1); }
    layer(cam) {
      const k = this.key(cam);
      let L = this.cache.get(k);
      if (!L) {
        if (this.cache.size > 3) this.cache.clear();
        L = this.prerender(cam);
        this.cache.set(k, L);
      }
      return L;
    }
    sky(x, y, W, H, horizonY) {
      const t = U.clamp(y / Math.max(1, horizonY), 0, 1);
      let c = C.mix(this.skyTop, this.skyBot, Math.pow(t, 1.4));
      const st = this.st;
      if (this.night) {
        if (U.h2(x, y, 7) > 0.995) c = C.mix(c, C.hex('#ffffff'), U.h2(x, y, 9) * 0.8 + 0.2);
        const mx = W * 0.8, my = H * 0.1, md = Math.hypot(x - mx, y - my);
        if (md < 7) c = md < 5.5 && !(Math.hypot(x - mx - 2, y - my + 1) < 4.5) ? C.hex('#f4f0d8') : c;
        else if (md < 16) c = C.mix(c, C.hex('#3a4a80'), (16 - md) / 30);
        return c;
      }
      const cl = fbm(x / 70, y / 26, 3, 4);
      const thr = this.storm ? 0.32 : st.kind === 'school' ? 0.55 : 0.58;
      if (cl > thr) {
        const a = U.clamp((cl - thr) * 5, 0, 1);
        let cc = this.storm ? C.mix(C.hex('#5a626e'), C.hex('#2c323a'), fbm(x / 30, y / 12, 11, 2)) : this.sunset ? C.mix(C.hex('#ffd6a0'), C.hex('#ff8a6a'), fbm(x / 40, y / 10, 5, 2)) : C.mix(C.hex('#ffffff'), C.hex('#c9d8e6'), fbm(x / 30, y / 12, 11, 2));
        const dith = (x + y) & 1 ? 0.04 : -0.04;
        c = C.mix(c, cc, U.clamp(a + dith, 0, 1));
      }
      if (this.sunset) {
        const sx = W * 0.22, sy = horizonY * 0.62, d = Math.hypot(x - sx, (y - sy) * 1.2);
        if (d < 9) c = C.hex('#fff2c0'); else if (d < 40) c = C.mix(c, C.hex('#ffe08a'), (40 - d) / 60);
      }
      return c;
    }
    prerender(cam) {
      const W = cam.W, H = cam.H, st = this.st, L = this.L;
      const bg = new Uint32Array(W * H), depth = new Float32Array(W * H);
      const O = cam.pos;
      const horizon = cam.project({ x: 0, y: 0, z: 2000 }).y;
      const white = C.hex('#f2f4ee');
      const dirt = C.hex('#8a6a42');
      const concrete = C.hex('#8d8f94'), concreteD = C.hex('#5a5c62');
      const fasciaC = this.night ? C.hex('#151a2c') : C.hex('#262b36');
      const seat2 = C.shade(this.seat, 0.82);
      const rowsMat = { seats: this.seat, seats2: seat2, bench: C.hex('#9aa5b0') };
      const school = st.kind === 'school';
      for (let sy = 0; sy < H; sy++) {
        for (let sx = 0; sx < W; sx++) {
          const d = cam.ray(sx + 0.5, sy + 0.5);
          const dl = Math.hypot(d.x, d.y, d.z);
          let best = 1e9, col = 0;
          // ground
          if (d.y < 0) {
            const t = -O.y / d.y;
            if (t < best) {
              const x = O.x + d.x * t, z = O.z + d.z * t;
              const dist = t * dl;
              if (z < (school ? 18.8 : 18)) { best = t; col = this.groundColor(x, z, dist, cam.F, Math.abs(d.y) / dl, white, dirt); }
              else { best = t; col = school ? C.mix(C.hex('#5e8a3a'), C.hex('#6a9a44'), fbm(x / 3, z / 3, 4, 2)) : C.shade(concreteD, 0.9); }
            }
          }
          // advertising board volume (front face) — drawn dynamically, but needs depth/occlusion
          if (!school && d.z > 0) {
            const t = (PL.W.BOARD_Z - O.z) / d.z;
            const y = O.y + d.y * t;
            if (t < best && y >= 0 && y <= 0.9) { best = t; col = C.hex('#101018'); }
          }
          // walls (vertical planes facing camera)
          for (const w of L.walls) {
            if (d.z <= 0) break;
            const t = (w.z - O.z) / d.z;
            if (t >= best) continue;
            const y = O.y + d.y * t, x = O.x + d.x * t;
            if (y < w.y0 || y > w.y1) continue;
            best = t;
            if (w.mat === 'fascia') {
              const v = (y - w.y0) / (w.y1 - w.y0);
              col = v > 0.25 && v < 0.75 ? C.mix(fasciaC, C.hex(st.seats), 0.25 + 0.1 * Math.sin(x * 0.5)) : fasciaC;
              if (v > 0.32 && v < 0.68 && Math.floor(x / 0.35) % 2 === 0 && (this.night || st.kind === 'temple')) col = C.mix(col, C.hex('#ffe9a0'), 0.25);
            } else col = Math.floor(x / 4) % 2 ? concrete : C.shade(concrete, 0.92);
          }
          // seat slopes
          for (const s of L.slopes) {
            const dz = s.z1 - s.z0, dy = s.y1 - s.y0;
            const den = d.z * dy - d.y * dz;
            if (Math.abs(den) < 1e-6) continue;
            const t = ((O.y - s.y0) * dz - (O.z - s.z0) * dy) / den;
            if (t <= 0 || t >= best) continue;
            const z = O.z + d.z * t, x = O.x + d.x * t;
            const u = (z - s.z0) / dz;
            if (u < 0 || u > 1 || x < s.x0 || x > s.x1) continue;
            best = t;
            const rf = u * s.rows, fr = rf - Math.floor(rf);
            const aisle = Math.abs(((x + 200) % 14) - 7) < 0.6;
            if (s.mat === 'bench') col = fr < 0.35 ? C.hex('#4a5058') : fr < 0.55 ? C.hex('#c9d2da') : C.hex('#6a737c');
            else if (aisle) col = fr < 0.5 ? concrete : concreteD;
            else {
              const sc = rowsMat[s.mat];
              const seatEdge = ((x + 200) % 0.55) < 0.08;
              col = fr < 0.28 ? concreteD : seatEdge ? C.shade(sc, 0.6) : fr < 0.5 ? C.shade(sc, 1.15) : sc;
              // stadium mosaic band
              if (s.mat === 'seats' && Math.floor(rf) % 7 === 3 && fr >= 0.28) col = C.mix(col, C.hex('#ffffff'), 0.25);
            }
            const fog = U.clamp((t * dl - 25) / 90, 0, 0.35);
            if (fog > 0) col = C.mix(col, this.skyBot, fog);
            if (this.night) col = C.shade(col, U.clamp(1.1 - (z - 18) / 40, 0.5, 1));
          }
          // roof underside
          if (L.roof && d.y > 0) {
            const t = (L.roof.y - O.y) / d.y;
            const z = O.z + d.z * t;
            if (t < best && z >= L.roof.z0 && z <= L.roof.z1) {
              best = t;
              const x = O.x + d.x * t;
              col = Math.floor(z / 3) % 2 ? C.hex('#30343e') : C.hex('#3a3f4a');
              if (Math.abs((x % 9 + 9) % 9 - 4.5) < 0.25) col = C.hex('#20232a');
              if (z < L.roof.z0 + 0.8) col = C.hex('#c8ccd4');
            }
          }
          // side stands (wide shots)
          if (L.side) for (const sgn of [-1, 1]) {
            if (d.x * sgn <= 0) continue;
            const x0 = 40 * sgn;
            // slope rising outward from x=40,y=1.4 to x=58,y=14
            const ax = 18 * sgn, ay = 12.6;
            const den = d.x * ay - d.y * ax;
            if (Math.abs(den) < 1e-6) continue;
            const t = ((O.y - 1.4) * ax - (O.x - x0) * ay) / den;
            if (t <= 0 || t >= best) continue;
            const x = O.x + d.x * t, z = O.z + d.z * t;
            const u = (x - x0) / ax;
            if (u < 0 || u > 1 || z > 18 || z < -70) continue;
            best = t;
            const rf = u * 18, fr = rf - Math.floor(rf);
            col = fr < 0.3 ? concreteD : C.mix(this.seat, this.crowdTint || this.seat, 0.3);
            if (U.h2(Math.floor(z / 0.6), Math.floor(rf), 3) < st.fill * 0.9 && fr >= 0.3) col = C.hex(['#d8d0c0', '#3a3030', '#c43a3a', '#2c5fd6', '#f5d100'][Math.floor(U.h2(Math.floor(z / 0.6), Math.floor(rf), 5) * 5)]);
          }
          // school: fence, trees, hills
          if (school) {
            if (d.z > 0) {
              const tf = (L.fence.z - O.z) / d.z;
              if (tf < best) {
                const y = O.y + d.y * tf, x = O.x + d.x * tf;
                if (y >= 0 && y <= L.fence.h) {
                  const a = ((x + y) / 0.16) % 1, b2 = ((x - y + 100) / 0.16) % 1;
                  const post = ((x + 100) % 4) < 0.08 || y > L.fence.h - 0.06;
                  if (post) { best = tf; col = C.hex('#2f4a36'); }
                  else if (a < 0.13 || b2 < 0.13) {
                    const px = tf * dl / cam.F;
                    if (px < 0.05 || ((sx + sy) & 1)) { best = tf; col = C.hex('#a8b0b4'); }
                  }
                }
              }
              const tt = (34 - O.z) / d.z;
              if (tt < best) {
                const y = O.y + d.y * tt, x = O.x + d.x * tt;
                // individual round tree crowns
                const cell = Math.floor((x + 300) / 4.2), cx0 = cell * 4.2 - 300 + 2.1 + (U.h2(cell, 1, 4) - 0.5) * 1.2;
                const crR = 1.9 + U.h2(cell, 2, 4) * 1.3, crY = 3.6 + U.h2(cell, 3, 4) * 2.2;
                const dxT = x - cx0, dyT = y - crY;
                const lump = crR + Math.sin(Math.atan2(dyT, dxT) * 5 + cell) * 0.25;
                const inCrown = dxT * dxT + dyT * dyT < lump * lump;
                const trunk = Math.abs(dxT) < 0.22 && y < crY && y >= 0;
                if (y >= 0 && (inCrown || trunk)) {
                  best = tt;
                  if (inCrown) {
                    const n = fbm(x / 0.9, y / 0.9, 8, 2);
                    const lit = (-dxT * 0.5 + dyT) / lump;
                    col = lit > 0.35 + n * 0.3 ? C.hex('#79b04c') : lit < -0.35 + n * 0.3 ? C.hex('#2a5226') : C.hex('#4c8a36');
                    if (dxT * dxT + dyT * dyT > (lump - 0.12) * (lump - 0.12)) col = C.hex('#1f3d1c');
                  } else col = C.hex('#4a3420');
                }
              }
              const th2 = (160 - O.z) / d.z;
              if (th2 < best) {
                const y = O.y + d.y * th2, x = O.x + d.x * th2;
                if (y >= 0 && y < 8 + fbm(x / 40, 0, 31, 3) * 22) { best = th2; col = C.mix(C.hex('#6f9a7a'), this.skyBot, 0.45); }
              }
            }
          }
          if (best >= 1e9) { col = this.sky(sx, sy, W, H, horizon); depth[sy * W + sx] = 1e5; }
          else depth[sy * W + sx] = best * dl;
          bg[sy * W + sx] = col;
        }
      }
      const layer = { bg, depth, W, H, cam, fans: [], lights: [], horizon };
      this.addLights(layer, cam);
      this.buildFans(layer, cam);
      this.buildBoards(layer, cam);
      this.buildScreen(layer, cam);
      return layer;
    }
    groundColor(x, z, dist, F, sinG, white, dirt) {
      const st = this.st;
      const stripe = Math.floor((z + 110) / 5.5) % 2;
      let c = stripe ? this.grassA : this.grassB;
      if (st.kind === 'big' || st.kind === 'temple') if (Math.floor((x + 120) / 6) % 2) c = C.shade(c, 1.04);
      const n = U.h2(Math.floor(x / 0.12), Math.floor(z / 0.12), 1);
      c = C.shade(c, 0.95 + n * 0.1);
      // worn areas
      const wear = st.kind === 'school' ? 0.75 : 0.35;
      const dSpot = Math.hypot(x, z * 1.4), dMouth = Math.hypot(x * 0.55, (z - 10.6) * 1.6);
      const wn = fbm(x / 0.8, z / 0.8, 2, 3);
      if ((dSpot < 1.4 || dMouth < 1.6) && wn < wear * (1 - Math.min(dSpot, dMouth) / 1.8) + 0.1) c = C.mix(c, dirt, 0.55);
      if (st.kind === 'school' && fbm(x / 4, z / 4, 9, 3) > 0.66) c = C.mix(c, dirt, 0.35);
      // lines with footprint-aware width
      const fx = dist / F, fz = fx / Math.max(0.05, sinG);
      const lw = 0.06;
      let line = 0;
      const ln = (dv, f) => { const hw = Math.max(lw, f * 0.5); if (Math.abs(dv) < hw) line = Math.max(line, U.clamp(lw * 2 / Math.max(lw * 2, f), 0.35, 1)); };
      if (Math.abs(x) <= 34) ln(z - 11, fz);
      if (Math.abs(x) <= 9.16 && z <= 11) ln(z - 5.5, fz);
      if (z >= 5.5 && z <= 11) { ln(Math.abs(x) - 9.16, fx); }
      if (Math.abs(x) <= 20.16 && z <= 11) ln(z + 5.5, fz);
      if (z >= -40 && z <= 11) { ln(Math.abs(x) - 20.16, fx); ln(Math.abs(x) - 34, fx); }
      if (z < -5.5) { const r = Math.hypot(x, z); ln(r - 9.15, Math.max(fx, fz * Math.abs(z) / Math.max(r, 0.01))); }
      { const r = Math.hypot(Math.abs(x) - 34, z - 11); if (r < 1.2) ln(r - 1, Math.max(fx, fz)); }
      if (Math.hypot(x, z) < 0.12 + fz * 0.3) line = 1;
      if (line) c = C.mix(c, white, line * (st.kind === 'school' ? 0.75 : 0.95));
      // shadows from stands
      if (st.time === 'afternoon' && z > 9 + x * 0.25) c = C.shade(c, 0.72);
      if (st.time === 'sunset' && z > 4 - x * 0.35) c = C.shade(c, 0.7);
      if (st.time === 'storm') {
        const pud = fbm(x / 1.5, z / 1.5, 13, 3);
        if (pud > 0.6) c = C.mix(c, C.hex('#9aa6b2'), U.clamp((pud - 0.6) * 3, 0, 0.55));
        else c = C.shade(c, 1.03);
      }
      if (this.night) {
        let lit = 0.55;
        for (const [lx, lz] of [[-30, 30], [30, 30], [-30, -20], [30, -20]]) lit += 0.35 / (1 + (Math.hypot(x - lx * 0.4, z - lz * 0.4) / 18) ** 2);
        c = C.shade(c, U.clamp(lit, 0.5, 1.05));
      }
      const fog = U.clamp((dist - 30) / 160, 0, 0.3);
      return fog > 0 ? C.mix(c, this.skyBot, fog) : c;
    }
    addLights(layer, cam) {
      const st = this.st;
      const pos = [];
      if (st.lights || st.kind === 'pro' || st.kind === 'big') {
        if (st.kind === 'big' || st.kind === 'temple') pos.push({ x: -26, y: 31, z: 40, ring: true }, { x: 26, y: 31, z: 40, ring: true }, { x: -9, y: 31, z: 40, ring: true }, { x: 9, y: 31, z: 40, ring: true });
        else pos.push({ x: -34, y: 30, z: 42 }, { x: 34, y: 30, z: 42 });
      }
      for (const l of pos) {
        const p = cam.project(l);
        if (p.z <= 0) continue;
        layer.lights.push({ x: p.x, y: p.y, s: p.s, ring: l.ring });
        const b = { w: layer.W, h: layer.H };
        const put = (x, y, c) => { x |= 0; y |= 0; if (x >= 0 && y >= 0 && x < b.w && y < b.h && layer.depth[y * b.w + x] > p.z * 0.95) layer.bg[y * b.w + x] = c; };
        if (!l.ring) { // tower pole
          const base = cam.project({ x: l.x, y: 0, z: l.z });
          for (let y = Math.floor(p.y); y < base.y; y++) for (let k = -1; k <= 1; k++) put(base.x + k + (p.x - base.x) * (base.y - y) / Math.max(1, base.y - p.y), y, k ? C.hex('#4a4e58') : C.hex('#6a6e78'));
        }
        const pw = Math.max(3, 4.5 * p.s), ph = Math.max(2, 2.6 * p.s);
        for (let y = -ph; y <= ph; y++) for (let x = -pw; x <= pw; x++) {
          const on = (Math.floor(x + 50) % 2 === 0 && Math.floor(y + 50) % 2 === 0);
          put(p.x + x, p.y + y, on ? (this.night || this.storm ? C.hex('#ffffff') : C.hex('#e8eef4')) : C.hex('#3a3e48'));
        }
      }
    }
    buildFans(layer, cam) {
      const st = this.st, L = this.L;
      const fans = [];
      const rng = U.rng(U.hash(st.id));
      const add = (x, y, z, standing) => {
        const p = cam.project({ x, y, z });
        if (p.z <= 0 || p.x < -10 || p.x > layer.W + 10 || p.y < -20 || p.y > layer.H + 20) return;
        const hp = Math.round((standing ? 1.6 : 1.0) * p.s);
        if (hp < 3) return;
        const ix = Math.round(p.x), iy = Math.round(p.y);
        const di = U.clamp(iy - 2, 0, layer.H - 1) * layer.W + U.clamp(ix, 0, layer.W - 1);
        if (layer.depth[di] < p.z - 1.2) return; // occluded
        fans.push({ x: ix, y: iy, h: Math.min(hp, 40), r: rng(), team: rng(), skin: Math.floor(rng() * 6), hair: Math.floor(rng() * 4), z: p.z, pose: 0, jump: 0 });
      };
      for (const s of L.slopes) {
        const fill = s.mat === 'bench' ? 0.45 : st.fill;
        for (let r = 0; r < s.rows; r++) {
          const u = (r + 0.62) / s.rows;
          const z = U.lerp(s.z0, s.z1, u), y = U.lerp(s.y0, s.y1, u);
          for (let x = s.x0 + 0.3; x < s.x1; x += s.mat === 'bench' ? 0.7 : 0.55) {
            if (Math.abs(((x + 200) % 14) - 7) < 0.7 && s.mat !== 'bench') continue;
            if (rng() > fill) continue;
            add(x + (rng() - 0.5) * 0.1, y, z, false);
          }
        }
      }
      if (st.kind === 'school') for (let x = -16; x < 16; x += 0.9) if (rng() < 0.45) add(x + rng() * 0.3, 0, 19.3 + rng() * 0.6, true);
      fans.sort((a, b) => b.z - a.z);
      layer.fans = fans;
    }
    buildBoards(layer, cam) {
      if (this.st.kind === 'school') { layer.boards = null; return; }
      const top = cam.project({ x: 0, y: 0.9, z: PL.W.BOARD_Z }), bot = cam.project({ x: 0, y: 0.0, z: PL.W.BOARD_Z });
      layer.boards = { y0: Math.round(top.y), y1: Math.round(bot.y), s: top.s, z: top.z };
    }
    buildScreen(layer, cam) {
      const st = this.st;
      let rect;
      if (st.kind === 'school') rect = { x0: -10.2, x1: -5.6, y0: 2.3, y1: 4.0, z: 18.6, small: true };
      else if (st.kind === 'big' || st.kind === 'temple' || st.kind === 'night') rect = { x0: -21, x1: -10.5, y0: 8.4, y1: 12.6, z: 30 };
      else rect = { x0: -21, x1: -10.5, y0: 8.3, y1: 12.4, z: 28.5 };
      const a = cam.project({ x: rect.x0, y: rect.y1, z: rect.z }), b = cam.project({ x: rect.x1, y: rect.y0, z: rect.z });
      if (a.z <= 0) { layer.screen = null; return; }
      layer.screen = { x0: Math.round(a.x), y0: Math.round(a.y), x1: Math.round(b.x), y1: Math.round(b.y), small: rect.small };
      // supports
      if (!rect.small) {
        const sp = cam.project({ x: (rect.x0 + rect.x1) / 2, y: rect.y0 - 3, z: rect.z });
        for (let y = layer.screen.y1; y < sp.y; y++) for (let k = -1; k <= 1; k++) {
          const x = Math.round(sp.x) + k;
          if (x >= 0 && x < layer.W && y >= 0 && y < layer.H) layer.bg[y * layer.W + x] = C.hex('#2a2d34');
        }
      }
    }
    /* per-frame dynamic layers */
    drawCrowd(buf, layer, crowd, time, teams) {
      const fans = layer.fans;
      const shirtA = teams ? C.hex(teams[0]) : C.hex('#1e5bd8');
      const shirtB = teams ? C.hex(teams[1]) : C.hex('#d8262e');
      const others = [C.hex('#f2f2f2'), C.hex('#2a2a30'), C.hex('#f5d100'), C.hex('#36a05a')];
      const skins = PL.Data.SKIN.map((s) => C.hex(s));
      const hairs = [C.hex('#1b1410'), C.hex('#3a2414'), C.hex('#a8743a'), C.hex('#d8d0c0')];
      const mood = crowd.mood, mt = crowd.t;
      const dim = this.night ? 0.75 : this.storm ? 0.82 : 1;
      const w = buf.w, h = buf.h, d = buf.data;
      for (let i = 0; i < fans.length; i++) {
        const f = fans[i];
        const isA = f.team < 0.58, isB = !isA && f.team < 0.85;
        let shirt = isA ? shirtA : isB ? shirtB : others[(f.r * 4) | 0];
        if (f.r > 0.93 && !isA) shirt = shirtA;
        const mine = crowd.side === 'A' ? isA : crowd.side === 'B' ? isB : false;
        let pose = f.r < 0.06 ? 4 : 0, jump = 0;
        const ph = f.r * 6.28;
        if (mood === 'cheer') {
          if (mine) { pose = 1; jump = Math.abs(Math.sin(time * 9 + ph)) * f.h * 0.22; }
          else pose = f.r < 0.5 ? 2 : 0;
        } else if (mood === 'groan') {
          pose = mine ? 2 : (f.r < 0.4 ? 1 : 0);
          if (!mine && f.r < 0.4) jump = Math.abs(Math.sin(time * 8 + ph)) * f.h * 0.15;
        } else if (mood === 'tense') {
          pose = f.r < 0.12 ? 3 : 0;
        } else if (mood === 'wave') {
          const wv = Math.sin(f.x * 0.06 - time * 4);
          if (wv > 0.6) { pose = 1; jump = (wv - 0.6) * f.h * 0.5; }
        } else {
          if (f.r < 0.2) { pose = 3; }
          jump = Math.max(0, Math.sin(time * 2 + ph * 3)) * (f.r < 0.3 ? 1 : 0);
        }
        if (mood !== 'idle' && mt > 3.2) { pose = f.r < 0.15 ? 3 : 0; jump = 0; }
        const tpl = fanTemplate(f.h, pose === 3 && ((time * 6 + ph) | 0) % 2 ? 0 : pose);
        const sh = C.shade(shirt, dim), shd = C.shade(shirt, dim * 0.7), sk = C.shade(skins[f.skin], dim), hr = hairs[f.hair];
        const scarf = isA ? C.shade(C.hex('#ffffff'), dim) : shd;
        const ox = f.x, oy = f.y - Math.round(jump);
        for (let k = 0; k < tpl.length; k += 3) {
          const x = ox + tpl[k], y = oy + tpl[k + 1];
          if (x < 0 || y < 0 || x >= w || y >= h) continue;
          const t = tpl[k + 2];
          d[y * w + x] = t === 1 ? sk : t === 2 ? sh : t === 3 ? shd : t === 4 ? hr : t === 6 ? scarf : C.OUT;
        }
        // night photo flashes
        if (this.night && crowd.mood === 'cheer' && mine && U.chance(0.004)) { buf.disc(ox, oy - f.h * 0.7, 1.5, C.WHITE); }
        if (this.night && U.chance(0.0006)) buf.px(ox, oy - f.h * 0.7, C.WHITE);
      }
    }
    drawBoards(buf, layer, time, msg) {
      const B = layer.boards;
      if (!B) return;
      const cam = layer.cam, st = this.st;
      const bh = B.y1 - B.y0;
      if (bh < 2) return;
      const brands = st.boards;
      const panelW = 9;
      const colors = ['#0f2a6b', '#b8121c', '#111111', '#1f8a4c', '#5a2ca0', '#d36a00'];
      const scroll = msg ? time * 6 : time * 0.6;
      for (let i = -9; i <= 9; i++) {
        const wx0 = i * panelW - (scroll % panelW), wx1 = wx0 + panelW - 0.15;
        const a = cam.project({ x: wx0, y: 0.9, z: PL.W.BOARD_Z }), b = cam.project({ x: wx1, y: 0, z: PL.W.BOARD_Z });
        if (b.x < 0 || a.x > buf.w) continue;
        const idx = ((i + 100 + Math.floor(scroll / panelW)) % brands.length);
        let bgc = C.hex(colors[(idx * 7 + (msg ? Math.floor(time * 4) : 0)) % colors.length]);
        if (this.night) bgc = C.shade(bgc, 1.15);
        const x0 = Math.max(0, Math.round(a.x)), x1 = Math.min(buf.w, Math.round(b.x));
        for (let y = B.y0; y < B.y1; y++) {
          if (y < 0 || y >= buf.h) continue;
          for (let x = x0; x < x1; x++) {
            const di = y * buf.w + x;
            if (layer.depth[di] < B.z - 0.5) continue;
            buf.data[di] = y === B.y0 ? C.shade(bgc, 1.3) : bgc;
          }
        }
        const text = msg || brands[idx];
        const sc = Math.max(1, Math.floor(bh / 6));
        if (bh >= 5) buf.text(text, (a.x + b.x) / 2, B.y0 + (bh - 5 * sc) / 2, msg ? C.hex('#ffe14d') : C.hex('#ffffff'), sc, 'center');
      }
      // glow line in night
      if (this.night) for (let x = 0; x < buf.w; x++) buf.blend(x, B.y1, C.hex('#9fe8ff'), 0.25);
    }
    drawScreen(buf, layer, info, time) {
      const S = layer.screen;
      if (!S) return;
      const w = S.x1 - S.x0, h = S.y1 - S.y0;
      if (w < 8 || h < 4) return;
      const frame = C.hex('#1b1e26');
      const scr = S.small ? C.hex('#f2f2ea') : C.hex('#05070c');
      buf.rect(S.x0 - 1, S.y0 - 1, w + 2, h + 2, frame);
      buf.rect(S.x0, S.y0, w, h, scr);
      if (!S.small) for (let y = S.y0; y < S.y1; y += 2) for (let x = S.x0; x < S.x1; x++) buf.blend(x, y, C.hex('#ffffff'), 0.03);
      if (!info) return;
      const sc = Math.max(1, Math.floor(Math.min(h / 14, w / 34)));
      const tc = S.small ? C.hex('#1b1e26') : C.hex('#ffffff');
      const cy = S.y0 + Math.max(1, Math.floor(h * 0.15));
      if (info.flash && Math.floor(time * 4) % 2 === 0) {
        buf.text(info.flash, (S.x0 + S.x1) / 2, S.y0 + h / 2 - 2.5 * sc * 1.5, C.hex('#ffe14d'), Math.max(1, Math.round(sc * 1.5)), 'center');
        return;
      }
      buf.text(info.a, S.x0 + w * 0.22, cy, tc, sc, 'center');
      buf.text(info.b, S.x0 + w * 0.78, cy, tc, sc, 'center');
      buf.text(info.sa + '-' + info.sb, (S.x0 + S.x1) / 2, cy + 7 * sc, S.small ? C.hex('#b8121c') : C.hex('#ffe14d'), sc + (h > 30 ? 1 : 0), 'center');
      if (h > 24 && info.line) buf.text(info.line, (S.x0 + S.x1) / 2, S.y1 - 6 * sc, C.hex('#9fe8ff'), Math.max(1, sc - 1), 'center');
    }
    drawLightsGlow(buf, layer, time) {
      if (!(this.night || this.storm || this.st.kind === 'temple')) return;
      const k = this.night ? 1 : 0.5;
      for (const l of layer.lights) {
        const R = Math.max(10, 14 * l.s) * k;
        for (let y = Math.floor(l.y - R); y < l.y + R; y++) for (let x = Math.floor(l.x - R); x < l.x + R; x++) {
          const dd = Math.hypot(x - l.x, y - l.y) / R;
          if (dd >= 1) continue;
          const a = (1 - dd) ** 2 * 60 * k;
          buf.add(x, y, a, a, a * 0.9);
        }
      }
    }
    applyGrade(buf) {
      if (!this.lut) return;
      const d = buf.data, [lr, lg, lb] = this.lut;
      for (let i = 0; i < d.length; i++) {
        const c = d[i];
        d[i] = (0xff000000 | (lb[(c >>> 16) & 255] << 16) | (lg[(c >>> 8) & 255] << 8) | lr[c & 255]) >>> 0;
      }
    }
  }
  PL.Stadium = Stadium;
})(typeof window !== 'undefined' ? window : globalThis);
