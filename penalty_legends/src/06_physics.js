/* PENALTY LEGENDS — ball physics: gravity, drag, Magnus effect, wind, bounces, woodwork, net, keeper contacts, shot solver */
(function (G) {
  'use strict';
  const PL = G.PL, U = PL.U, V = PL.V, W = PL.W;

  const DRAG = 0.0125;     // quadratic drag coefficient (1/m)
  const MAGNUS = 0.0095;   // lift coefficient on (spin x vel)
  const SPIN_DECAY = 0.35; // 1/s
  const R = W.BALL_R;
  const PX = W.GOAL_HW + W.POST_R; // post center x
  const BAR_Y = W.GOAL_H + W.POST_R;
  const LINE_Z = W.GOAL_Z + W.POST_R; // back edge of goal line
  const NET_Z = W.GOAL_Z + W.NET_DEPTH;

  const WOOD = [
    { a: { x: -PX, y: 0, z: W.GOAL_Z }, b: { x: -PX, y: BAR_Y, z: W.GOAL_Z }, r: W.POST_R, kind: 'post' },
    { a: { x: PX, y: 0, z: W.GOAL_Z }, b: { x: PX, y: BAR_Y, z: W.GOAL_Z }, r: W.POST_R, kind: 'post' },
    { a: { x: -PX, y: BAR_Y, z: W.GOAL_Z }, b: { x: PX, y: BAR_Y, z: W.GOAL_Z }, r: W.POST_R, kind: 'bar' },
  ];
  PL.WOOD = WOOD;

  class Ball {
    constructor() { this.reset(); }
    reset(p) {
      this.p = p ? V.lerp(p, p, 0) : { x: 0, y: R, z: 0 };
      this.v = { x: 0, y: 0, z: 0 };
      this.w = { x: 0, y: 0, z: 0 };
      this.knuckle = 0;
      this.ori = [{ x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }, { x: 0, y: 0, z: 1 }];
      this.held = null;
      this.inPlay = false;
      this.t = 0;
      this.trail = [];
      this.crossed = false;
      this.events = [];
      this.maxSpeed = 0;
      this.touchedKeeper = false;
      this.hitWood = false;
      this.inGoal = false;
      this.stopped = false;
    }
    speed() { return V.len(this.v); }
  }
  PL.Ball = Ball;

  function rotOri(ori, axis, ang) {
    for (let i = 0; i < 3; i++) ori[i] = V.rot(ori[i], axis, ang);
  }

  function accel(p, v, w, cond, knuckle, t) {
    const wind = cond && cond.wind ? cond.wind : null;
    const rv = wind ? { x: v.x - wind.x, y: v.y, z: v.z - wind.z } : v;
    const sp = Math.sqrt(rv.x * rv.x + rv.y * rv.y + rv.z * rv.z);
    const drag = DRAG * (cond && cond.rain ? 1.06 : 1);
    const a = { x: -drag * sp * rv.x, y: -W.GRAV - drag * sp * rv.y, z: -drag * sp * rv.z };
    const m = V.cross(w, rv);
    a.x += MAGNUS * m.x; a.y += MAGNUS * m.y; a.z += MAGNUS * m.z;
    if (knuckle) { // low-spin power shot: unstable wobble
      a.x += Math.sin(t * 23 + knuckle * 7) * knuckle * 2.4;
      a.y += Math.cos(t * 19 + knuckle * 3) * knuckle * 1.6;
    }
    return a;
  }

  // collision of sphere with capsule; returns normal & contact if overlapping
  function sphereCapsule(p, r, a, b, cr) {
    const t = V.segT(p, a, b);
    const c = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: a.z + (b.z - a.z) * t };
    const d = V.sub(p, c);
    const dist = V.len(d);
    if (dist >= r + cr) return null;
    const n = dist > 1e-6 ? V.mul(d, 1 / dist) : { x: 0, y: 0, z: -1 };
    return { n, c, depth: r + cr - dist, t };
  }
  PL.sphereCapsule = sphereCapsule;

  function emit(ball, type, extra) {
    const e = Object.assign({ type, t: ball.t, p: { x: ball.p.x, y: ball.p.y, z: ball.p.z }, speed: ball.speed() }, extra || {});
    ball.events.push(e);
    if (ball.onEvent) ball.onEvent(e);
  }

  function netCollide(ball, cond) {
    const p = ball.p, v = ball.v;
    let hit = false;
    const soft = (n, depth) => {
      p.x += n.x * depth; p.y += n.y * depth; p.z += n.z * depth;
      const vn = V.dot(v, n);
      if (vn < 0) {
        v.x -= vn * n.x * 1.12; v.y -= vn * n.y * 1.12; v.z -= vn * n.z * 1.12;
        v.x *= 0.62; v.y *= 0.75; v.z *= 0.62;
        hit = Math.abs(vn) > 1.2 || hit;
      }
    };
    const inX = Math.abs(p.x) < PX, zIn = p.z > W.GOAL_Z && p.z < NET_Z + 0.3;
    const roofY = U.lerp(BAR_Y, W.NET_BACK_H, U.clamp((p.z - W.GOAL_Z) / W.NET_DEPTH, 0, 1));
    // back net
    if (inX && p.y < W.NET_BACK_H + 0.1 && p.z > NET_Z - R && p.z < NET_Z + R) {
      if (p.z < NET_Z) soft({ x: 0, y: 0, z: -1 }, p.z - (NET_Z - R));
      else soft({ x: 0, y: 0, z: 1 }, NET_Z + R - p.z);
    }
    // side nets (two-sided)
    if (zIn && p.y < roofY + 0.05) {
      for (const sx of [-1, 1]) {
        const dx = p.x - sx * PX;
        if (Math.abs(dx) < R) {
          const inside = sx * p.x < PX;
          soft({ x: inside ? -sx : sx, y: 0, z: 0 }, R - Math.abs(dx));
        }
      }
    }
    // roof net (two-sided)
    if (inX && p.z > W.GOAL_Z + 0.05 && p.z < NET_Z) {
      const dy = p.y - roofY;
      if (Math.abs(dy) < R) soft({ x: 0, y: dy < 0 ? -1 : 1, z: 0 }, R - Math.abs(dy));
    }
    if (hit && !ball._netHit) { ball._netHit = true; emit(ball, 'net'); }
  }

  /** Advance ball by dt (internally sub-stepped). world: {cond, keeper} */
  function step(ball, dt, world) {
    if (!ball.inPlay) return;
    const cond = world.cond || {};
    const N = Math.max(1, Math.ceil(dt / (1 / 360)));
    const h = dt / N;
    for (let s = 0; s < N; s++) {
      ball.t += h;
      if (ball.held) {
        const hp = ball.held.pos();
        ball.v = V.mul(V.sub(hp, ball.p), 1 / h);
        ball.p = hp;
        continue;
      }
      const p = ball.p, v = ball.v;
      const a = accel(p, v, ball.w, cond, ball.knuckle, ball.t);
      v.x += a.x * h; v.y += a.y * h; v.z += a.z * h;
      const prevZ = p.z;
      p.x += v.x * h; p.y += v.y * h; p.z += v.z * h;
      const decay = Math.exp(-SPIN_DECAY * h);
      ball.w.x *= decay; ball.w.y *= decay; ball.w.z *= decay;
      if (ball.knuckle) ball.knuckle *= Math.exp(-1.2 * h);
      // visual rotation: spin + rolling
      const sp = V.len(ball.w);
      if (sp > 0.01) rotOri(ball.ori, V.mul(ball.w, 1 / sp), sp * h);
      // ground
      if (p.y < R) {
        p.y = R;
        if (v.y < -0.6) {
          const e = cond.rain ? 0.45 : 0.58;
          if (-v.y > 3) emit(ball, 'bounce');
          v.y = -v.y * e;
          const f = cond.rain ? 0.93 : 0.82;
          v.x *= f; v.z *= f;
          ball.w = V.mul(ball.w, 0.6);
        } else {
          v.y = 0;
          const roll = Math.exp(-(cond.rain ? 0.35 : 0.75) * h);
          v.x *= roll; v.z *= roll;
          const hs = Math.hypot(v.x, v.z);
          if (hs > 0.05) rotOri(ball.ori, V.norm({ x: v.z, y: 0, z: -v.x }), (hs / R) * h);
        }
      }
      // woodwork
      for (const wd of WOOD) {
        const c = sphereCapsule(p, R, wd.a, wd.b, wd.r);
        if (!c) continue;
        p.x += c.n.x * c.depth; p.y += c.n.y * c.depth; p.z += c.n.z * c.depth;
        const vn = V.dot(v, c.n);
        if (vn < 0) {
          const e = 0.62;
          v.x -= (1 + e) * vn * c.n.x; v.y -= (1 + e) * vn * c.n.y; v.z -= (1 + e) * vn * c.n.z;
          v.x *= 0.92; v.y *= 0.92; v.z *= 0.92;
          ball.w = V.mul(ball.w, 0.4);
          if (-vn > 1.5) { ball.hitWood = true; emit(ball, wd.kind, { impact: -vn }); }
        }
      }
      // keeper
      const kp = world.keeper;
      if (kp && !ball.held && kp.capsules) {
        for (const cp of kp.capsules) {
          const c = sphereCapsule(p, R, cp.a, cp.b, cp.r);
          if (!c) continue;
          const kv = cp.vel || { x: 0, y: 0, z: 0 };
          const rel = V.sub(v, kv);
          const vn = V.dot(rel, c.n);
          p.x += c.n.x * c.depth; p.y += c.n.y * c.depth; p.z += c.n.z * c.depth;
          if (vn >= 0) continue;
          const speed = V.len(v);
          const res = kp.onContact ? kp.onContact(ball, cp, c, speed) : { type: 'parry', e: 0.4 };
          ball.touchedKeeper = true;
          if (res.type === 'catch') {
            ball.held = { pos: res.holdPos };
            ball.w = { x: 0, y: 0, z: 0 };
            emit(ball, 'catch', { part: cp.part, speed });
            break;
          }
          const e = res.e, fr = res.friction === undefined ? 0.85 : res.friction;
          // split relative velocity into normal & tangential parts
          const vnx = vn * c.n.x, vny = vn * c.n.y, vnz = vn * c.n.z;
          const tx = (rel.x - vnx) * fr, ty = (rel.y - vny) * fr, tz = (rel.z - vnz) * fr;
          v.x = kv.x * 0.3 + tx - e * vnx; v.y = kv.y * 0.3 + ty - e * vny; v.z = kv.z * 0.3 + tz - e * vnz;
          if (res.push) { v.x += res.push.x; v.y += res.push.y; v.z += res.push.z; }
          if (res.minVz !== undefined && v.z > res.minVz) v.z = res.minVz;
          if (res.deflect) {
            const sp = Math.hypot(v.x, v.y, v.z);
            let dv = V.rot(v, { x: 0, y: 1, z: 0 }, res.deflect.yaw);
            if (res.deflect.pitch) dv = V.rot(dv, { x: 1, y: 0, z: 0 }, -res.deflect.pitch);
            v.x = dv.x; v.y = dv.y; v.z = dv.z;
            if (sp > 0) { const s2 = Math.hypot(v.x, v.y, v.z); v.x *= sp / s2; v.y *= sp / s2; v.z *= sp / s2; }
          }
          ball.w = V.mul(ball.w, 0.3);
          ball.knuckle = 0;
          emit(ball, 'parry', { part: cp.part, speed });
          break;
        }
      }
      netCollide(ball, cond);
      // advertising boards / stand wall
      if (p.z > W.BOARD_Z - R && p.y < 1.0 && v.z > 0) { p.z = W.BOARD_Z - R; v.z *= -0.3; v.x *= 0.6; emit(ball, 'board'); }
      if (p.z > 24) { v.x = v.y = v.z = 0; }
      // goal line crossing
      if (!ball.crossed && prevZ < LINE_Z + R && p.z >= LINE_Z + R) {
        ball.crossed = true;
        const inside = Math.abs(p.x) < W.GOAL_HW && p.y < W.GOAL_H;
        if (inside) { ball.inGoal = true; emit(ball, 'goal'); }
        else emit(ball, 'out', { wide: Math.abs(p.x) >= W.GOAL_HW, over: p.y >= W.GOAL_H });
      }
      const spd = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
      if (spd > ball.maxSpeed) ball.maxSpeed = spd;
    }
    ball.trail.push({ x: ball.p.x, y: ball.p.y, z: ball.p.z });
    if (ball.trail.length > 18) ball.trail.shift();
    if (!ball.held && ball.speed() < 0.15 && ball.p.y <= R + 0.001) ball.stopped = true;
  }

  // Fast ballistic simulation (no collisions) to plane z = tz
  function simToZ(p0, v0, w0, cond, tz, knuckle) {
    let p = { x: p0.x, y: p0.y, z: p0.z }, v = { x: v0.x, y: v0.y, z: v0.z }, w = { x: w0.x, y: w0.y, z: w0.z };
    const h = 1 / 240;
    let t = 0;
    while (t < 3) {
      const a = accel(p, v, w, cond, 0, t);
      v.x += a.x * h; v.y += a.y * h; v.z += a.z * h;
      const pz = p.z;
      p.x += v.x * h; p.y += v.y * h; p.z += v.z * h;
      const d = Math.exp(-SPIN_DECAY * h); w.x *= d; w.y *= d; w.z *= d;
      t += h;
      if (p.z >= tz) {
        const f = (tz - pz) / (p.z - pz || 1);
        return { x: p.x - v.x * h * (1 - f), y: p.y - v.y * h * (1 - f), t, ok: true };
      }
      if (p.y < 0 && v.y < 0) { // bounced before goal: approximate continue with bounce
        p.y = 0.001; v.y = -v.y * 0.55; v.x *= 0.85; v.z *= 0.85;
      }
      if (v.z <= 0.01) break;
    }
    return { x: p.x, y: p.y, t, ok: false };
  }
  PL.simToZ = simToZ;

  /** Solve initial velocity so the ball reaches target on plane z = target.z.
   * mode 'speed': fixed speed, solve elevation+azimuth. mode 'angle': fixed elevation, solve speed+azimuth. */
  function solve(p0, target, opts, cond) {
    const spin = opts.spin || { x: 0, y: 0, z: 0 };
    const dx = target.x - p0.x, dz = target.z - p0.z, dist = Math.hypot(dx, dz);
    let az = Math.atan2(dx, dz);
    let speed = opts.speed || 20;
    let el;
    if (opts.mode === 'angle') el = opts.el;
    else {
      const tt = dist / speed;
      el = Math.atan2(target.y - p0.y + 0.5 * W.GRAV * tt * tt, dist);
    }
    const vel = (s, e, a) => ({ x: s * Math.sin(a) * Math.cos(e), y: s * Math.sin(e), z: s * Math.cos(a) * Math.cos(e) });
    let last = null;
    for (let i = 0; i < 14; i++) {
      const r = simToZ(p0, vel(speed, el, az), spin, cond, target.z);
      last = r;
      const ex = target.x - r.x, ey = target.y - r.y;
      if (r.ok && Math.abs(ex) < 0.004 && Math.abs(ey) < 0.004) break;
      az += U.clamp(ex / dist, -0.2, 0.2) * 0.95;
      // numeric derivative of arrival height
      if (opts.mode === 'angle') {
        const ds = 0.25;
        const r2 = simToZ(p0, vel(speed + ds, el, az), spin, cond, target.z);
        let g = (r2.y - r.y) / ds;
        if (!r.ok || !r2.ok) { speed *= 1.08; continue; }
        if (Math.abs(g) < 0.02) g = 0.02 * U.sign(g);
        speed = U.clamp(speed + U.clamp(ey / g, -3, 3), 6, 40);
      } else {
        const de = 0.004;
        const r2 = simToZ(p0, vel(speed, el + de, az), spin, cond, target.z);
        let g = (r2.y - r.y) / de;
        if (!r.ok || !r2.ok) { el += 0.05; continue; }
        if (Math.abs(g) < 0.5) g = 0.5 * U.sign(g);
        el = U.clamp(el + U.clamp(ey / g, -0.12, 0.12), -0.2, 1.2);
      }
    }
    return { v: vel(speed, el, az), speed, el, az, arrival: last };
  }
  PL.solveShot = solve;
  PL.Physics = { step, accel, LINE_Z, PX, BAR_Y, NET_Z };
})(typeof window !== 'undefined' ? window : globalThis);
