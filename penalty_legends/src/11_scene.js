/* PENALTY LEGENDS — scene: composes stadium, goal & net, characters, ball, effects and weather into the pixel framebuffer */
(function (G) {
  'use strict';
  const PL = G.PL, U = PL.U, V = PL.V, C = PL.C, W = PL.W, Pose = PL.Pose;

  // Icosahedron vertices for the ball's panel pattern
  const ICO = (() => {
    const t = (1 + Math.sqrt(5)) / 2, v = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]];
    return v.map(([x, y, z]) => { const l = Math.hypot(x, y, z); return { x: x / l, y: y / l, z: z / l }; });
  })();

  class NetMesh {
    constructor() {
      this.nodes = []; this.lines = [];
      const PX = PL.Physics.PX, BAR = PL.Physics.BAR_Y, NZ = PL.Physics.NET_Z, BH = W.NET_BACK_H;
      const grid = (nu, nv, f) => {
        const base = this.nodes.length;
        for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) {
          const r = f(i / nu, j / nv);
          this.nodes.push({ r, o: { x: 0, y: 0, z: 0 }, v: { x: 0, y: 0, z: 0 }, fixed: r.fixed });
        }
        for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) {
          const k = base + j * (nu + 1) + i;
          if (i < nu) this.lines.push([k, k + 1]);
          if (j < nv) this.lines.push([k, k + nu + 1]);
        }
      };
      grid(26, 8, (u, v) => ({ x: U.lerp(-PX, PX, u), y: v * BH, z: NZ, fixed: v === 1 || u === 0 || u === 1 || v === 0 }));
      grid(26, 6, (u, v) => ({ x: U.lerp(-PX, PX, u), y: U.lerp(BAR, BH, v), z: U.lerp(W.GOAL_Z + 0.02, NZ, v), fixed: v === 0 || u === 0 || u === 1 || v === 1 }));
      for (const s of [-1, 1]) grid(6, 8, (u, v) => { const z = U.lerp(W.GOAL_Z + 0.02, NZ, u); return { x: s * PX, y: v * U.lerp(BAR, BH, u), z, fixed: u === 0 || u === 1 || v === 0 || v === 1 }; });
    }
    update(dt, ball) {
      const bp = ball && ball.inPlay && ball.p.z > W.GOAL_Z - 0.2 ? ball.p : null;
      const bv = ball ? ball.v : null;
      for (const n of this.nodes) {
        if (n.fixed) continue;
        if (bp) {
          const dx = n.r.x + n.o.x - bp.x, dy = n.r.y + n.o.y - bp.y, dz = n.r.z + n.o.z - bp.z;
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (d < 0.55) {
            const f = (0.55 - d) / 0.55;
            n.v.x += (bv.x * 0.6 + dx * 8) * f * dt * 8; n.v.y += (bv.y * 0.6 + dy * 8) * f * dt * 8; n.v.z += (bv.z * 0.6 + dz * 8) * f * dt * 8;
          }
        }
        n.v.x += (-n.o.x * 70 - n.v.x * 7) * dt; n.v.y += (-n.o.y * 70 - n.v.y * 7) * dt; n.v.z += (-n.o.z * 70 - n.v.z * 7) * dt;
        n.o.x += n.v.x * dt; n.o.y += n.v.y * dt; n.o.z += n.v.z * dt;
        const m = Math.hypot(n.o.x, n.o.y, n.o.z);
        if (m > 0.7) { n.o.x *= 0.7 / m; n.o.y *= 0.7 / m; n.o.z *= 0.7 / m; }
      }
    }
    draw(buf, cam, col, alpha) {
      const pr = this.nodes.map((n) => cam.project({ x: n.r.x + n.o.x, y: Math.max(0, n.r.y + n.o.y), z: n.r.z + n.o.z }));
      for (const [a, b] of this.lines) {
        const A = pr[a], B = pr[b];
        if (A.z <= 0 || B.z <= 0) continue;
        buf.line(A.x, A.y, B.x, B.y, col, alpha);
      }
    }
  }

  class Scene {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas ? canvas.getContext('2d') : null;
      this.cam = new PL.Camera(480, 270);
      this.time = 0;
      this.particles = [];
      this.sparks = [];
      this.fireworks = [];
      this.rain = [];
      this.crowd = { mood: 'idle', t: 0, side: null };
      this.net = new NetMesh();
      this.ball = new PL.Ball();
      this.shooter = null; this.keeper = null; this.extras = [];
      this.overlay = { aim: null, ring: null, guide: null, keeperMark: null, tell: null };
      this.shake = 0; this.flash = 0; this.lightning = 0;
      this.screenInfo = null; this.boardMsg = null;
      this.teamColors = ['#1e5bd8', '#d8262e'];
      this.camPreset = 'penalty';
      this.crowdTimer = 0;
      this.ballSkin = PL.Data.BALLS[0];
      this.effect = PL.Data.EFFECTS[0];
      this.referee = { P: Pose.make({ x: 5.0, z: 6.8, yaw: -2.2 }), app: { skin: PL.Data.SKIN[2], hair: 'bald', hairC: '#1b1410', beard: false, kit: { p: '#1c1c22', s: '#e8ff4d', pattern: 'solid', shorts: '#1c1c22', socks: '#1c1c22' }, boots: { color: '#111', accent: '#fff' }, height: 1.0 } };
      this.assistant = { P: Pose.make({ x: -6.6, z: 11.2, yaw: Math.PI / 2 + 0.5, spR: 0.5, saR: 0.4, eR: 0.3 }), app: { skin: PL.Data.SKIN[0], hair: 'short', hairC: '#6b4423', kit: { p: '#1c1c22', s: '#e8ff4d', pattern: 'solid', shorts: '#1c1c22', socks: '#1c1c22' }, boots: { color: '#111', accent: '#fff' }, height: 0.98 } };
      this.whistleT = -10;
      this.resize(480, 270);
    }
    resize(W0, H0) {
      this.W = W0; this.H = H0;
      if (this.canvas) { this.canvas.width = W0; this.canvas.height = H0; }
      this.frame = new PL.PixBuf(W0, H0);
      this.scratch = new PL.PixBuf(W0, H0);
      this.crowdLayer = new Uint32Array(W0 * H0);
      this.crowdTimer = 0;
      this.imageData = this.ctx ? new ImageData(new Uint8ClampedArray(this.frame.data.buffer), W0, H0) : null;
      this.setCamera(this.camPreset);
      this.rain = [];
    }
    setStadium(def) {
      if (!this.stadium || this.stadium.st.id !== def.id) this.stadium = new PL.Stadium(def);
      this.crowdTimer = 0; this.rain = [];
    }
    setTeams(a, b) { this.teamColors = [a, b]; this.crowdTimer = 0; }
    setCamera(name) {
      this.camPreset = name;
      const c = PL.CAM[name] || PL.CAM.penalty;
      this.cam.set(this.W, this.H, c.pos, c.pitch, c.zoom, c.yaw || 0);
      this.crowdTimer = 0;
    }
    crowdReact(mood, side) { this.crowd = { mood, t: 0, side }; this.crowdTimer = 0; }
    whistle() { this.whistleT = this.time; }
    addShake(a) { if (PL.Save.data.settings.shake) this.shake = Math.max(this.shake, a); }

    /* ---------------- particles ---------------- */
    burst(type, p, n, opts = {}) {
      for (let i = 0; i < n; i++) {
        const sp = opts.speed || 3;
        const v = { x: U.rand(-1, 1) * sp + (opts.dir ? opts.dir.x : 0), y: U.rand(0.3, 1.2) * sp + (opts.dir ? opts.dir.y : 0), z: U.rand(-1, 1) * sp + (opts.dir ? opts.dir.z : 0) };
        let col;
        if (type === 'grass') col = C.hex(U.choice(['#3f8f34', '#5aa944', '#7a5a32', '#2f6f2a']));
        else if (type === 'spark') col = C.hex(U.choice(opts.colors || ['#ffffff', '#fff27a', '#ffd23a']));
        else if (type === 'confetti') col = C.hex(U.choice(opts.colors || ['#ff3b3b', '#ffe14d', '#3fa7ff', '#36e07a', '#ffffff', '#ff5fa2']));
        else if (type === 'splash') col = C.hex('#cfe0ee');
        else col = C.hex('#e8e8e0');
        this.particles.push({ type, p: { x: p.x, y: p.y, z: p.z }, v, life: opts.life || U.rand(0.4, 0.9), age: 0, col, size: opts.size || 1, ph: Math.random() * 6 });
      }
    }
    confetti(n = 160) {
      for (let i = 0; i < n; i++) this.burst('confetti', { x: U.rand(-8, 8), y: U.rand(5, 9), z: U.rand(2, 14) }, 1, { speed: 0.6, life: U.rand(3, 5), colors: [this.teamColors[0], '#ffffff', '#ffe14d', this.teamColors[0]] });
    }
    firework() {
      const x = U.rand(this.W * 0.1, this.W * 0.9), y = U.rand(8, this.H * 0.3);
      const cols = U.choice([['#ffe14d', '#ffffff'], ['#ff5fa2', '#ffd6f0'], ['#3fa7ff', '#c9f0ff'], ['#36e07a', '#e8ffe8'], ['#ff7a1a', '#fff0c0']]);
      for (let i = 0; i < 46; i++) {
        const a = (i / 46) * Math.PI * 2, s = U.rand(18, 34);
        this.fireworks.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: U.rand(0.9, 1.5), age: 0, col: C.hex(U.choice(cols)) });
      }
      if (PL.Audio) PL.Audio.sfx('firework');
    }

    update(dt) {
      this.time += dt;
      this.crowd.t += dt;
      this.net.update(dt, this.ball);
      for (const p of this.particles) {
        p.age += dt;
        if (p.type === 'confetti') { p.v.y = -1.2; p.p.x += Math.sin(this.time * 3 + p.ph) * dt * 0.8; }
        else p.v.y -= 9.8 * dt;
        p.p.x += p.v.x * dt; p.p.y += p.v.y * dt; p.p.z += p.v.z * dt;
        if (p.p.y < 0) { p.p.y = 0; p.v.y *= -0.3; p.v.x *= 0.5; p.v.z *= 0.5; }
      }
      this.particles = this.particles.filter((p) => p.age < p.life);
      for (const f of this.fireworks) { f.age += dt; f.vy += 20 * dt; f.vx *= 0.97; f.vy *= 0.97; f.x += f.vx * dt; f.y += f.vy * dt; }
      this.fireworks = this.fireworks.filter((f) => f.age < f.life);
      this.shake = Math.max(0, this.shake - dt * 2.5);
      this.flash = Math.max(0, this.flash - dt * 3);
      if (this.stadium && this.stadium.storm) {
        if (this.lightning > 0) this.lightning -= dt;
        else if (Math.random() < dt * 0.05) { this.lightning = 0.25; if (PL.Audio) setTimeout(() => PL.Audio.sfx('thunder'), 600 + Math.random() * 900); }
      }
      // referee whistle pose
      const wt = this.time - this.whistleT;
      const rp = this.referee.P;
      if (wt < 0.9) { rp.spR = 2.3; rp.saR = 0.35; rp.eR = 2.4; rp.spL = 2.9 * (wt < 0.9 ? 1 : 0); rp.saL = 0.3; rp.eL = 0.1; }
      else { rp.spR = 0.1; rp.saR = 0.15; rp.eR = 0.3; rp.spL = 0.1; rp.saL = 0.15; rp.eL = 0.3; }
    }

    /* ---------------- drawing helpers ---------------- */
    drawCharacter(P, app) {
      const s = this.scratch;
      s.clearBox();
      const J = PL.renderChar(s, this.cam, P, app);
      s.outline();
      this.frame.compositeFrom(s);
      return J;
    }
    shadowAt(x, z, size, strength = 0.6) {
      const p = this.cam.project({ x, y: 0, z });
      if (p.z <= 0) return;
      this.frame.ellipseShade(p.x, p.y, size * p.s, size * p.s * 0.28, strength);
    }
    drawGoalFrame() {
      const cam = this.cam, f = this.frame;
      const white = PL.pal('#f4f4f0');
      const PX = PL.Physics.PX, BAR = PL.Physics.BAR_Y, Z = W.GOAL_Z;
      const seg = (a, b, r) => {
        const A = cam.project(a), B = cam.project(b);
        if (A.z <= 0 || B.z <= 0) return;
        const rr = Math.max(0.7, r * A.s);
        f.capsule(A.x, A.y, B.x, B.y, rr + 0.9, { base: C.hex('#2a2a30'), hi: C.hex('#2a2a30'), sh: C.hex('#2a2a30') });
        f.capsule(A.x, A.y, B.x, B.y, rr, white);
      };
      // back stanchions
      const gr = C.hex('#9aa0a8');
      for (const s of [-1, 1]) {
        const a = cam.project({ x: s * PX, y: BAR, z: Z }), b = cam.project({ x: s * PX, y: W.NET_BACK_H, z: PL.Physics.NET_Z }), c = cam.project({ x: s * PX, y: 0, z: PL.Physics.NET_Z });
        f.line(a.x, a.y, b.x, b.y, gr); f.line(b.x, b.y, c.x, c.y, gr);
      }
      seg({ x: -PX, y: 0, z: Z }, { x: -PX, y: BAR, z: Z }, W.POST_R);
      seg({ x: PX, y: 0, z: Z }, { x: PX, y: BAR, z: Z }, W.POST_R);
      seg({ x: -PX, y: BAR, z: Z }, { x: PX, y: BAR, z: Z }, W.POST_R);
    }
    drawBall(ball) {
      const cam = this.cam, f = this.frame;
      const p = cam.project(ball.p);
      if (p.z <= 0) return;
      const r = Math.max(1.2, W.BALL_R * p.s);
      const base = PL.pal(this.ballSkin.base), patch = PL.pal(this.ballSkin.patch);
      const O = ball.ori, cr = cam.r, cu = cam.u, cf = cam.f;
      const L = { x: -0.4, y: 0.8, z: -0.45 };
      if (r >= 2) f.disc(p.x, p.y, r + 1, C.OUT);
      for (let y = Math.floor(p.y - r); y <= Math.ceil(p.y + r); y++) for (let x = Math.floor(p.x - r); x <= Math.ceil(p.x + r); x++) {
        const nx = (x + 0.5 - p.x) / r, ny = (y + 0.5 - p.y) / r, d2 = nx * nx + ny * ny;
        if (d2 > 1) continue;
        const nz = Math.sqrt(1 - d2);
        const N = { x: cr.x * nx - cu.x * ny - cf.x * nz, y: cr.y * nx - cu.y * ny - cf.y * nz, z: cr.z * nx - cu.z * ny - cf.z * nz };
        const lx = V.dot(N, O[0]), ly = V.dot(N, O[1]), lz = V.dot(N, O[2]);
        let mx = -1;
        for (const v of ICO) { const dd = lx * v.x + ly * v.y + lz * v.z; if (dd > mx) mx = dd; }
        const pp = mx > 0.9 ? patch : base;
        const l = V.dot(N, L);
        f.px(x, y, l > 0.55 ? pp.hi : l < -0.1 ? pp.sh : pp.base);
      }
    }
    drawTrail(ball) {
      const fx = this.effect;
      if (!fx || !fx.colors.length || !ball.inPlay || ball.speed() < 7 || ball.held) return;
      const tr = ball.trail, n = tr.length;
      for (let i = 0; i < n - 1; i++) {
        const a = this.cam.project(tr[i]), b = this.cam.project(tr[i + 1]);
        if (a.z <= 0) continue;
        const k = i / n;
        const ci = Math.min(fx.colors.length - 1, Math.floor((1 - k) * fx.colors.length));
        let col = C.hex(fx.colors[fx.cycle ? (i + Math.floor(this.time * 20)) % fx.colors.length : ci]);
        const rr = Math.max(0.6, W.BALL_R * a.s * (0.25 + k * 0.75));
        if (fx.jitter) { const jx = U.rand(-2, 2), jy = U.rand(-2, 2); this.frame.line(a.x + jx, a.y + jy, b.x, b.y, col); }
        else this.frame.capsule(a.x, a.y, b.x, b.y, rr, { base: col, hi: col, sh: col });
        if (fx.sparkle && Math.random() < 0.4) this.frame.px(a.x + U.rand(-4, 4), a.y + U.rand(-4, 4), C.WHITE);
      }
    }
    drawOverlays() {
      const f = this.frame, cam = this.cam, o = this.overlay;
      if (o.guide && o.guide.length) {
        for (let i = 0; i < o.guide.length; i += 1) {
          const p = cam.project(o.guide[i]);
          if (p.z > 0 && i % 2 === 0) f.blend(p.x, p.y, C.hex('#ffffff'), 0.55 - i / o.guide.length * 0.4);
        }
      }
      if (o.aim) {
        const p = cam.project({ x: o.aim.x, y: o.aim.y, z: W.GOAL_Z });
        const c = C.hex(o.aim.color || '#ffe14d'), k = C.OUT;
        const R = Math.max(4, 0.32 * p.s);
        for (let a = 0; a < 24; a++) { const ang = (a / 24) * Math.PI * 2 + this.time; if (a % 3 === 2) continue; f.px(p.x + Math.cos(ang) * R, p.y + Math.sin(ang) * R, c); }
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) for (let i = 2; i < 5; i++) { f.px(p.x + dx * (R + i - 2), p.y + dy * (R + i - 2), c); f.px(p.x + dx * (R + i - 2) + dy, p.y + dy * (R + i - 2) + dx, k); }
        f.px(p.x, p.y, c);
      }
      if (o.keeperMark) {
        const p = cam.project({ x: o.keeperMark.x, y: o.keeperMark.y, z: W.GOAL_Z - 0.2 });
        const c = C.hex('#36e07a');
        for (let i = -3; i <= 3; i++) { f.px(p.x + i, p.y - 3, c); f.px(p.x + i, p.y + 3, c); f.px(p.x - 3, p.y + i, c); f.px(p.x + 3, p.y + i, c); }
      }
      if (o.ring) {
        const p = cam.project(this.ball.p);
        const R = W.BALL_R * p.s * (1 + o.ring.k * 5);
        const col = C.hex(o.ring.k < 0.12 ? '#36e07a' : o.ring.k < 0.3 ? '#ffe14d' : '#ffffff');
        const tgt = W.BALL_R * p.s * 1.6;
        for (let a = 0; a < 48; a++) { const ang = (a / 48) * Math.PI * 2; f.px(p.x + Math.cos(ang) * R, p.y + Math.sin(ang) * R * 0.55, col); }
        for (let a = 0; a < 32; a++) { const ang = (a / 32) * Math.PI * 2; if (a % 2) f.blend(p.x + Math.cos(ang) * tgt, p.y + Math.sin(ang) * tgt * 0.55, C.hex('#36e07a'), 0.8); }
      }
      if (o.tell !== null && o.tell !== undefined && this.keeper) {
        const k = cam.project({ x: this.keeper.x + o.tell * 0.9, y: 2.25, z: W.GOAL_Z - 0.3 });
        const c = C.hex('#ffe14d');
        for (let i = 0; i < 5; i++) { f.px(k.x + o.tell * i, k.y, c); if (i < 3) { f.px(k.x + o.tell * (4 - i), k.y - i, c); f.px(k.x + o.tell * (4 - i), k.y + i, c); } }
      }
    }
    drawParticles() {
      const f = this.frame;
      for (const p of this.particles) {
        const q = this.cam.project(p.p);
        if (q.z <= 0) continue;
        const sz = Math.max(1, Math.round(0.04 * q.s * p.size));
        if (p.type === 'confetti') { const fl = Math.sin(this.time * 10 + p.ph) > 0; f.rect(q.x, q.y, fl ? 2 : 1, fl ? 1 : 2, p.col); }
        else f.rect(q.x, q.y, sz, sz, p.col);
      }
      for (const fw of this.fireworks) { const a = 1 - fw.age / fw.life; f.blend(fw.x, fw.y, fw.col, a); f.blend(fw.x + 1, fw.y, fw.col, a * 0.5); }
    }
    drawWeather(dt) {
      const st = this.stadium;
      if (!st || !st.st.rain) return;
      const f = this.frame;
      if (this.rain.length < 260) for (let i = this.rain.length; i < 260; i++) this.rain.push({ x: Math.random() * this.W, y: Math.random() * this.H, l: U.rand(3, 8), s: U.rand(260, 420), a: U.rand(0.25, 0.55) });
      const c = C.hex('#c8d4e2');
      for (const r of this.rain) {
        r.y += r.s * dt; r.x -= r.s * 0.18 * dt;
        if (r.y > this.H) { r.y = -10; r.x = Math.random() * (this.W + 60); if (Math.random() < 0.5) this.splashes = (this.splashes || 0) + 1; }
        f.line(r.x, r.y, r.x - r.l * 0.18, r.y + r.l, c, r.a);
      }
      for (let i = 0; i < 6; i++) {
        const x = Math.random() * this.W, y = this.H * U.rand(0.62, 1);
        f.blend(x, y, c, 0.7); f.blend(x - 1, y - 1, c, 0.4); f.blend(x + 1, y - 1, c, 0.4);
      }
      if (this.lightning > 0) {
        const a = this.lightning > 0.15 ? 0.55 : 0.2;
        for (let i = 0; i < f.data.length; i++) { const d = f.data[i]; f.data[i] = C.mix(d, 0xffffffff, a); }
      }
    }

    render(dt = 0) {
      if (!this.stadium) return;
      const f = this.frame, cam = this.cam, st = this.stadium;
      const layer = st.layer(cam);
      // crowd animated at ~15 fps
      this.crowdTimer -= dt;
      if (this.crowdTimer <= 0) {
        this.crowdTimer = 1 / 15;
        f.data.set(layer.bg);
        st.drawCrowd(f, layer, this.crowd, this.time, this.teamColors);
        this.crowdLayer.set(f.data);
      } else f.data.set(this.crowdLayer);
      st.drawLightsGlow(f, layer, this.time);
      st.drawScreen(f, layer, this.screenInfo, this.time);
      st.drawBoards(f, layer, this.time, this.boardMsg);
      // corner flags (visible in wide shots)
      for (const s of [-1, 1]) {
        const a = cam.project({ x: s * 34, y: 0, z: 11 }), b = cam.project({ x: s * 34, y: 1.5, z: 11 });
        if (a.z > 0 && a.x > -5 && a.x < this.W + 5) {
          f.line(a.x, a.y, b.x, b.y, C.hex('#f2f2f2'));
          const fl = Math.max(2, 0.35 * b.s);
          for (let y = 0; y < fl; y++) for (let x = 0; x < fl * 1.4; x++) f.px(b.x + x + 1 + Math.sin(this.time * 8 + x) * 0.6, b.y + y, (x + y) % 2 ? C.hex('#ff3b3b') : C.hex('#ffe14d'));
        }
      }
      // shadows
      const ball = this.ball;
      if (this.keeper) this.shadowAt(this.keeper.x, PL.Keeper.KZ, 0.55, 0.65);
      if (this.shooter) this.shadowAt(this.shooter.pos.x, this.shooter.pos.z, 0.5, 0.65);
      this.shadowAt(this.referee.P.x, this.referee.P.z, 0.45, 0.7);
      this.shadowAt(this.assistant.P.x, this.assistant.P.z, 0.45, 0.7);
      for (const e of this.extras) if (e.shadow) this.shadowAt(e.P.x, e.P.z, 0.45, 0.7);
      if (ball.inPlay || ball.visible !== false) this.shadowAt(ball.p.x, ball.p.z, W.BALL_R * 1.3 * U.clamp(1 - ball.p.y / 6, 0.4, 1), U.clamp(0.5 + ball.p.y * 0.1, 0.5, 0.85));
      // goal: back net, ball inside, frame
      const inNet = ball.p.z > W.GOAL_Z;
      const netCol = C.hex('#f0f2f4');
      if (inNet) { this.drawTrail(ball); this.drawBall(ball); }
      this.net.draw(f, cam, netCol, this.stadium.night ? 0.75 : 0.6);
      this.drawGoalFrame();
      // extras (targets etc. drawn in goal plane)
      for (const e of this.extras) if (e.drawFlat) e.drawFlat(f, cam, this.time);
      // characters sorted by depth (far first)
      const items = [];
      if (this.keeper) items.push({ z: PL.Keeper.KZ, fn: () => this.drawCharacter(this.keeper.P, this.keeper.app) });
      items.push({ z: this.assistant.P.z, fn: () => { const J = this.drawCharacter(this.assistant.P, this.assistant.app); this.drawFlagAt(J.handR); } });
      items.push({ z: this.referee.P.z, fn: () => this.drawCharacter(this.referee.P, this.referee.app) });
      for (const e of this.extras) if (e.P) items.push({ z: e.P.z, fn: () => this.drawCharacter(e.P, e.app) });
      if (this.shooter) items.push({ z: this.shooter.pos.z, fn: () => this.drawCharacter(this.shooter.P, this.shooter.app) });
      if (!inNet) items.push({ z: ball.p.z + 0.05, fn: () => { this.drawTrail(ball); this.drawBall(ball); } });
      items.sort((a, b) => b.z - a.z);
      for (const it of items) it.fn();
      this.drawParticles();
      this.drawOverlays();
      this.drawWeather(dt);
      st.applyGrade(f);
      if (this.flash > 0) { const a = this.flash * 0.5; for (let i = 0; i < f.data.length; i += 1) f.data[i] = C.mix(f.data[i], 0xffffffff, a); }
      this.present();
    }
    drawFlagAt(hand) {
      const p = this.cam.project(hand);
      if (p.z <= 0) return;
      const s = Math.max(2, 0.3 * p.s);
      this.frame.line(p.x, p.y, p.x, p.y - s * 1.6, C.hex('#222'));
      for (let y = 0; y < s * 0.8; y++) for (let x = 0; x < s; x++) this.frame.px(p.x + 1 + x, p.y - s * 1.6 + y, ((x / 2 | 0) + (y / 2 | 0)) % 2 ? C.hex('#ff3b3b') : C.hex('#ffe14d'));
    }
    present() {
      if (!this.ctx) return;
      this.ctx.putImageData(this.imageData, 0, 0);
      if (this.canvas) {
        const s = this.shake;
        this.canvas.style.transform = s > 0.01 ? `translate(${U.rand(-1, 1) * s * 8}px,${U.rand(-1, 1) * s * 8}px)` : '';
      }
    }
  }
  PL.Scene = Scene;
})(typeof window !== 'undefined' ? window : globalThis);
