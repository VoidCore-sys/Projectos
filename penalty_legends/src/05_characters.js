/* PENALTY LEGENDS — skeletal pixel-art characters: forward kinematics, poses and per-pixel renderer */
(function (G) {
  'use strict';
  const PL = G.PL, U = PL.U, V = PL.V, C = PL.C;
  const X = { x: 1, y: 0, z: 0 }, Y = { x: 0, y: 1, z: 0 }, Z = { x: 0, y: 0, z: 1 };
  const DOWN = { x: 0, y: -1, z: 0 };

  const POSE_KEYS = ['x', 'y', 'z', 'yaw', 'roll', 'lean', 'side', 'hpL', 'haL', 'kL', 'hpR', 'haR', 'kR', 'spL', 'saL', 'eL', 'spR', 'saR', 'eR', 'head', 'twist'];
  const Pose = (PL.Pose = {
    make(o) {
      const p = { x: 0, y: 0.95, z: 0, yaw: 0, roll: 0, lean: 0, side: 0, hpL: 0, haL: 0.06, kL: 0.05, hpR: 0, haR: 0.06, kR: 0.05,
        spL: 0.05, saL: 0.14, eL: 0.25, spR: 0.05, saR: 0.14, eR: 0.25, head: 0, twist: 0, ground: true, mood: 'normal', ball: null };
      return Object.assign(p, o || {});
    },
    blend(a, b, t) {
      const o = Object.assign({}, b);
      for (const k of POSE_KEYS) o[k] = a[k] + (b[k] - a[k]) * t;
      o.ground = t < 0.5 ? a.ground : b.ground;
      return o;
    },
    copy: (p) => Object.assign({}, p),
  });

  // Forward kinematics -> world joint positions
  function fk(P, h) {
    h = h || 1;
    const L = { hipW: 0.1 * h, thigh: 0.45 * h, shin: 0.45 * h, foot: 0.13 * h, spine: 0.5 * h, shW: 0.19 * h, ua: 0.29 * h, fa: 0.27 * h, neck: 0.07 * h, headR: 0.118 * h };
    const j = {};
    j.pelvis = { x: 0, y: 0, z: 0 };
    j.hipL = { x: -L.hipW, y: 0, z: 0 };
    j.hipR = { x: L.hipW, y: 0, z: 0 };
    const leg = (hip, hp, ha, kn, side) => {
      let d = V.rot(DOWN, Z, side * ha);
      d = V.rot(d, X, -hp);
      const knee = V.add(hip, V.mul(d, L.thigh));
      const sd = V.rot(d, X, kn);
      const foot = V.add(knee, V.mul(sd, L.shin));
      const fd = V.rot(sd, X, -Math.PI / 2 - 0.15);
      const toe = V.add(foot, V.mul(fd, L.foot));
      return [knee, foot, toe];
    };
    [j.kneeL, j.footL, j.toeL] = leg(j.hipL, P.hpL, P.haL, P.kL, -1);
    [j.kneeR, j.footR, j.toeR] = leg(j.hipR, P.hpR, P.haR, P.kR, 1);
    // upper body
    let up = V.rot(Y, X, -P.lean);
    up = V.rot(up, Z, -P.side);
    let right = V.rot(X, Z, -P.side);
    if (P.twist) { right = V.rot(right, up, P.twist); }
    const fwdU = V.cross(right, up);
    j.chest = V.mul(up, L.spine);
    j.neck = V.add(j.chest, V.mul(up, L.neck));
    j.head = V.add(V.add(j.neck, V.mul(up, L.headR * 1.05)), V.mul(fwdU, Math.sin(P.head) * L.headR * 0.5));
    const shBase = V.add(j.chest, V.mul(up, -0.04 * h));
    j.shL = V.add(shBase, V.mul(right, -L.shW));
    j.shR = V.add(shBase, V.mul(right, L.shW));
    const arm = (sh, sp, sa, el, side) => {
      // arm frame follows the torso frame
      let d = V.rot(V.mul(up, -1), fwdU, side * sa);
      d = V.rot(d, right, -sp);
      const elb = V.add(sh, V.mul(d, L.ua));
      const fd = V.rot(d, right, -el);
      const hand = V.add(elb, V.mul(fd, L.fa));
      return [elb, hand];
    };
    [j.elL, j.handL] = arm(j.shL, P.spL, P.saL, P.eL, -1);
    [j.elR, j.handR] = arm(j.shR, P.spR, P.saR, P.eR, 1);
    j._up = up; j._right = right; j._fwd = fwdU;
    // whole body roll (around forward) then yaw (around world up)
    const cy = P.yaw, rl = P.roll;
    const tf = (v) => V.rot(V.rot(v, Z, rl), Y, cy);
    let minY = 1e9;
    const out = {};
    for (const k in j) {
      if (k[0] === '_') continue;
      const w = tf(j[k]);
      out[k] = w;
      if (w.y < minY) minY = w.y;
    }
    out.upW = tf(up); out.rightW = tf(right); out.fwdW = tf(fwdU);
    const yRoot = P.ground ? -minY + 0.0 : P.y;
    for (const k in out) {
      if (k === 'upW' || k === 'rightW' || k === 'fwdW') continue;
      out[k] = { x: out[k].x + P.x, y: out[k].y + yRoot, z: out[k].z + P.z };
    }
    out.L = L; out.h = h;
    return out;
  }
  PL.fk = fk;

  // Appearance palette cache
  const palCache = new Map();
  function pal(hex) {
    let p = palCache.get(hex);
    if (!p) { p = C.tri(C.hex(hex)); palCache.set(hex, p); }
    return p;
  }
  PL.pal = pal;

  const PAT = {
    solid: () => 0,
    stripes: (u) => (Math.floor(u * 7) % 2 ? 1 : 0),
    hoops: (u, v) => (Math.floor(v * 6) % 2 ? 1 : 0),
    halves: (u) => (u > 0.5 ? 1 : 0),
    sash: (u, v) => (Math.abs(u - v) < 0.17 ? 1 : 0),
    chevron: (u, v) => (Math.abs(v - 0.32 - Math.abs(u - 0.5) * 0.7) < 0.08 ? 1 : 0),
    pinstripe: (u) => (Math.floor(u * 15) % 3 === 0 ? 1 : 0),
  };

  // Render one character into buffer `b` (a scratch PixBuf). Caller outlines + composites.
  function renderChar(b, cam, P, app) {
    const J = fk(P, app.height || 1);
    const h = J.h;
    const pr = {};
    for (const k in J) if (J[k] && J[k].x !== undefined && k !== 'upW' && k !== 'rightW' && k !== 'fwdW') pr[k] = cam.project(J[k]);
    if (pr.pelvis.z <= 0) return J;
    const s = pr.pelvis.s;
    const toCam = V.norm(V.sub(cam.pos, J.chest));
    const facing = V.dot(J.fwdW, toCam);
    const kit = app.kit;
    const skin = pal(app.skin);
    const jersey = pal(kit.p), jersey2 = pal(kit.s);
    const shorts = pal(kit.shorts || kit.s), socks = pal(kit.socks || kit.p);
    const boot = pal(app.boots ? app.boots.color : '#202028');
    const glove = app.gloves ? pal(app.gloves.color) : null;
    const parts = [];
    const add = (depth, fn) => parts.push({ d: depth, fn });
    const R = (m) => Math.max(0.6, m * h * s);
    const seg = (a, b2, r, p, f) => add((pr[a].z + pr[b2].z) / 2, () => b.capsule(pr[a].x, pr[a].y, pr[b2].x, pr[b2].y, R(r), p, f));
    const mid = (a, b2, t) => { const A = J[a], B = J[b2]; return cam.project(V.lerp(A, B, t)); };
    const segP = (pa, pb, r, p) => add((pa.z + pb.z) / 2, () => b.capsule(pa.x, pa.y, pb.x, pb.y, R(r), p));

    // legs
    for (const sd of ['L', 'R']) {
      const hip = 'hip' + sd, knee = 'knee' + sd, foot = 'foot' + sd, toe = 'toe' + sd;
      const m = mid(hip, knee, 0.5);
      segP(pr[hip], m, 0.085, shorts);
      segP(m, pr[knee], 0.062, skin);
      const ank = mid(knee, foot, 0.85);
      segP(pr[knee], ank, 0.056, socks);
      segP(ank, pr[foot], 0.05, socks);
      seg(foot, toe, 0.05, boot);
    }
    // pelvis / shorts
    seg('hipL', 'hipR', 0.11, shorts);
    // torso volume
    seg('pelvis', 'chest', 0.15, jersey);
    // torso panel with kit pattern
    const torsoDepth = (pr.shL.z + pr.shR.z + pr.hipL.z + pr.hipR.z) / 4 - 0.01;
    add(torsoDepth, () => {
      const wR = V.mul(J.rightW, 0.05 * h);
      const pts3 = [V.sub(J.shL, wR), V.add(J.shR, wR), V.add(J.hipR, V.mul(wR, 0.6)), V.sub(J.hipL, V.mul(wR, 0.6))];
      const pts = pts3.map((p) => cam.project(p));
      const o = pts[0], ax = { x: pts[1].x - o.x, y: pts[1].y - o.y };
      const bm = { x: (pts[2].x + pts[3].x) / 2 - (pts[0].x + pts[1].x) / 2, y: (pts[2].y + pts[3].y) / 2 - (pts[0].y + pts[1].y) / 2 };
      const det = ax.x * bm.y - ax.y * bm.x;
      if (Math.abs(det) < 0.5) return;
      const pf = PAT[kit.pattern] || PAT.solid;
      const back = facing < 0;
      b.poly(pts, (x, y) => {
        const px = x + 0.5 - o.x, py = y + 0.5 - o.y;
        let u = (px * bm.y - py * bm.x) / det, v = (ax.x * py - ax.y * px) / det;
        u = U.clamp(u, 0, 1); v = U.clamp(v, 0, 1);
        const uu = back ? 1 - u : u;
        let pp = pf(uu, v) ? jersey2 : jersey;
        if (!back && v < 0.1 && Math.abs(u - 0.5) < 0.13) pp = jersey2; // collar
        if (back && v < 0.06 && Math.abs(u - 0.5) < 0.18) pp = jersey2;
        return u < 0.1 ? pp.hi : u > 0.88 || v > 0.93 ? pp.sh : pp.base;
      });
      // number / crest
      const th = Math.hypot(bm.x, bm.y);
      if (back && th >= 13 && app.number !== undefined) {
        const sc = Math.max(1, Math.floor((th * 0.36) / 5));
        const cx = o.x + ax.x * 0.5 + bm.x * 0.46, cy = o.y + ax.y * 0.5 + bm.y * 0.46;
        const numC = kit.pattern === 'solid' || kit.pattern === 'chevron' ? jersey2.base : (C.r(jersey.base) + C.g(jersey.base) > 300 ? C.hex('#16161c') : C.WHITE);
        b.text(String(app.number), cx, cy - (5 * sc) / 2, numC, sc, 'center');
        if (th >= 36 && app.label) b.text(app.label, cx, cy - (5 * sc) / 2 - 7, numC, 1, 'center');
        b.box(Math.round(cx), Math.round(cy));
      } else if (!back && th >= 16) {
        const cx = o.x + ax.x * 0.72 + bm.x * 0.25, cy = o.y + ax.y * 0.72 + bm.y * 0.25;
        b.px(cx, cy, jersey2.hi); b.px(cx + 1, cy, jersey2.base); b.px(cx, cy + 1, jersey2.sh); b.px(cx + 1, cy + 1, jersey2.base);
      }
    });
    // arms
    const longSleeves = !!app.longSleeves;
    for (const sd of ['L', 'R']) {
      const sh = 'sh' + sd, el = 'el' + sd, hand = 'hand' + sd;
      const m = mid(sh, el, longSleeves ? 1 : 0.55);
      segP(pr[sh], m, 0.058, jersey);
      if (!longSleeves) segP(m, pr[el], 0.048, skin);
      seg(el, hand, 0.045, longSleeves ? jersey : skin);
      const hp = pr[hand];
      if (glove) add(hp.z - 0.02, () => { b.capsule(hp.x, hp.y, hp.x, hp.y, R(0.075), glove); b.px(hp.x, hp.y, pal(app.gloves.accent).base); });
      else add(hp.z, () => b.capsule(hp.x, hp.y, hp.x, hp.y, R(0.045), skin));
    }
    // neck + head
    seg('chest', 'neck', 0.05, skin);
    const hp = pr.head;
    add(hp.z - 0.03, () => drawHead(b, cam, J, hp, app, skin, h, P.mood));
    parts.sort((a, b2) => b2.d - a.d);
    for (const p of parts) p.fn();
    return J;
  }

  function drawHead(b, cam, J, hp, app, skin, h, mood) {
    const hr = Math.max(1.2, 0.118 * h * hp.s);
    const hair = app.hair || 'short';
    const hc = pal(app.hairC || '#1b1410');
    const upW = J.upW, fwW = J.fwdW, rtW = J.rightW;
    const toCamDir = V.norm(V.sub(cam.pos, J.head));
    const facing = V.dot(fwW, toCamDir);
    // hair volumes behind/around the head
    const hairBlob = (p3, r) => { const q = cam.project(p3); b.capsule(q.x, q.y, q.x, q.y, Math.max(1, r * h * q.s), hc); };
    const backHair = () => {
      if (hair === 'afro') hairBlob(V.add(J.head, V.mul(upW, 0.03 * h)), 0.165);
      if (hair === 'long') {
        const a = cam.project(V.add(J.head, V.mul(fwW, -0.05 * h)));
        const c = cam.project(V.add(V.add(J.head, V.mul(upW, -0.2 * h)), V.mul(fwW, -0.07 * h)));
        b.capsule(a.x, a.y, c.x, c.y, Math.max(1, 0.1 * h * a.s), hc);
      }
      if (hair === 'ponytail') {
        const a = cam.project(V.add(V.add(J.head, V.mul(fwW, -0.11 * h)), V.mul(upW, 0.02 * h)));
        const c = cam.project(V.add(V.add(J.head, V.mul(upW, -0.17 * h)), V.mul(fwW, -0.16 * h)));
        b.capsule(a.x, a.y, c.x, c.y, Math.max(0.8, 0.035 * h * a.s), hc);
      }
      if (hair === 'bun') hairBlob(V.add(V.add(J.head, V.mul(upW, 0.1 * h)), V.mul(fwW, -0.06 * h)), 0.05);
    };
    if (facing >= 0) backHair();
    const L = V.norm({ x: -0.45, y: 0.75, z: -0.5 });
    const cr = cam.r, cu = cam.u, cf = cam.f;
    const x0 = Math.floor(hp.x - hr - 1), x1 = Math.ceil(hp.x + hr + 1), y0 = Math.floor(hp.y - hr - 1), y1 = Math.ceil(hp.y + hr + 1);
    const band = app.band ? pal(app.band) : null;
    for (let y = Math.max(0, y0); y <= Math.min(b.h - 1, y1); y++) {
      for (let x = Math.max(0, x0); x <= Math.min(b.w - 1, x1); x++) {
        const nx = (x + 0.5 - hp.x) / hr, ny = (y + 0.5 - hp.y) / hr;
        const d2 = nx * nx + ny * ny;
        if (d2 > 1) continue;
        const nz = Math.sqrt(1 - d2);
        const N = { x: cr.x * nx - cu.x * ny - cf.x * nz, y: cr.y * nx - cu.y * ny - cf.y * nz, z: cr.z * nx - cu.z * ny - cf.z * nz };
        const hy = V.dot(N, upW), hf = V.dot(N, fwW), hs = V.dot(N, rtW);
        let isHair = false;
        switch (hair) {
          case 'short': isHair = hy > 0.3 || (hf < -0.25 && hy > -0.45) || (hy > -0.05 && hf < 0.15 && Math.abs(hs) > 0.8); break;
          case 'buzz': isHair = (hy > 0.35 || (hf < -0.3 && hy > -0.4)) && ((x + y) & 1); break;
          case 'curly': isHair = hy > 0.15 || (hf < -0.15 && hy > -0.5) || (Math.abs(hs) > 0.7 && hf < 0.3); break;
          case 'long': isHair = hy > 0.22 || hf < -0.05 || (Math.abs(hs) > 0.68 && hf < 0.5); break;
          case 'afro': isHair = hy > 0.05 || hf < 0.0 || Math.abs(hs) > 0.62; break;
          case 'mohawk': isHair = (hy > 0.25 && Math.abs(hs) < 0.3) || (hf < -0.4 && Math.abs(hs) < 0.25 && hy > -0.2); break;
          case 'ponytail': case 'bun': isHair = hy > 0.28 || (hf < -0.2 && hy > -0.35) || (hy > 0 && Math.abs(hs) > 0.78 && hf < 0.2); break;
          default: isHair = false;
        }
        if (!isHair && app.beard && hf > 0.25 && hy < -0.3 && ((x ^ y) & 1)) isHair = true;
        let c;
        const l = V.dot(N, L);
        if (band && Math.abs(hy - 0.32) < 0.11 && !(hair === 'afro' && hy > 0.4)) c = l > 0.3 ? band.hi : band.base;
        else if (isHair) c = hair === 'curly' && ((x + y * 2) % 3 === 0) ? hc.sh : l > 0.45 ? hc.hi : l < -0.2 ? hc.sh : hc.base;
        else c = l > 0.42 ? skin.hi : l < -0.25 ? skin.sh : skin.base;
        b.data[y * b.w + x] = c; b.box(x, y);
      }
    }
    if (hair === 'mohawk') hairBlob(V.add(V.add(J.head, V.mul(upW, 0.12 * h)), V.mul(fwW, -0.01 * h)), 0.035);
    if (facing < 0) backHair();
    // face features
    if (facing > 0.15 && hr >= 2.5) {
      const ink = C.hex('#1a1220');
      const ep = (sx, sy) => cam.project(V.add(V.add(V.add(J.head, V.mul(fwW, 0.1 * h)), V.mul(rtW, sx * h)), V.mul(upW, sy * h)));
      const eL = ep(-0.042, 0.012), eR = ep(0.042, 0.012);
      b.px(eL.x, eL.y, ink); b.px(eR.x, eR.y, ink);
      if (hr >= 6) {
        const bL = ep(-0.045, 0.045), bR = ep(0.045, 0.045);
        b.px(bL.x, bL.y, hc.sh); b.px(bL.x + 1, bL.y, hc.sh); b.px(bR.x, bR.y, hc.sh); b.px(bR.x - 1, bR.y, hc.sh);
      }
      if (hr >= 4) {
        const m = ep(0, -0.055);
        if (mood === 'happy') { b.px(m.x, m.y, ink); b.px(m.x, m.y + 1, C.hex('#7a1f2a')); if (hr >= 6) { b.px(m.x - 1, m.y, ink); b.px(m.x + 1, m.y, ink); } }
        else if (mood === 'sad') { b.px(m.x - 1, m.y + 1, skin.sh); b.px(m.x, m.y, skin.sh); b.px(m.x + 1, m.y + 1, skin.sh); }
        else { b.px(m.x, m.y, skin.sh); if (hr >= 6) b.px(m.x + 1, m.y, skin.sh); }
      }
    }
  }

  PL.renderChar = renderChar;

  // Portrait to dataURL (for menus), cached
  const portraitCache = new Map();
  PL.portrait = function (key, app, size = 64, pose) {
    if (portraitCache.has(key)) return portraitCache.get(key);
    if (typeof document === 'undefined') return '';
    const W = 48, H = 48;
    const buf = new PL.PixBuf(W, H);
    const cam = new PL.Camera(W, H).set(W, H, { x: 0, y: 1.5 * (app.height || 1), z: -2.6 }, 0.06, 1.0);
    cam.F = 150;
    const P = pose || Pose.make({ yaw: Math.PI + 0.35, saL: 0.2, saR: 0.2, mood: 'happy' });
    renderChar(buf, cam, P, app);
    buf.outline();
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d');
    ctx.putImageData(new ImageData(new Uint8ClampedArray(buf.data.buffer), W, H), 0, 0);
    const out = document.createElement('canvas'); out.width = size; out.height = size;
    const o = out.getContext('2d'); o.imageSmoothingEnabled = false; o.drawImage(cv, 0, 0, size, size);
    const url = out.toDataURL();
    portraitCache.set(key, url);
    return url;
  };
})(typeof window !== 'undefined' ? window : globalThis);
