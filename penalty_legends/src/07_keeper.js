/* PENALTY LEGENDS — goalkeeper entity: AI decision making (no pre-knowledge of the shot), dives, saves, animations, hitboxes */
(function (G) {
  'use strict';
  const PL = G.PL, U = PL.U, V = PL.V, W = PL.W, Pose = PL.Pose, D = PL.Data;
  const KZ = 10.82; // keeper pelvis plane (feet on the goal line)

  class Keeper {
    constructor(profile, opts = {}) {
      this.profile = profile;
      this.human = !!opts.human;
      this.bonus = opts.bonus || {};
      this.cond = opts.cond || {};
      const st = Object.assign({}, profile.stats);
      for (const k in this.bonus) st[k] = U.clamp((st[k] || 50) + this.bonus[k], 1, 99);
      this.st = st;
      this.style = D.STYLES[profile.style] || D.STYLES.balanced;
      this.h = profile.look.height || 1;
      this.app = Object.assign({}, profile.look, {
        kit: { p: profile.kit.p, s: profile.kit.s, pattern: 'solid', shorts: profile.kit.s, socks: profile.kit.p },
        gloves: opts.gloves || { color: '#f2f2f2', accent: profile.kit.p }, boots: { color: '#202028', accent: '#fff' },
        longSleeves: true, number: 1, height: this.h,
      });
      this.reset();
    }
    get reactDelay() { return 0.42 - this.st.ref * 0.0026; }
    get diveTravel() { return 0.9 + this.st.reach * 0.0068; }
    get jumpH() { return 0.5 + this.st.agi * 0.004; }
    reset() {
      this.x = 0; this.mode = 'ready'; this.t = 0; this.modeT = 0;
      this.dive = null; this.plan = null; this.kickT = null; this.committed = false; this.commitAt = null;
      this.capsules = []; this.prevMid = null; this.armAdj = 0; this.lean = 0; this.saved = false;
      this.humanCmd = null; this.mood = 'normal'; this.hold = false;
      this.P = Pose.make({ yaw: Math.PI, z: KZ });
      this.J = null;
      this.update(0, null);
    }
    setMode(m) { this.mode = m; this.modeT = 0; }

    /* ---------- AI ---------- */
    // ctx: { history:[zones], foot:'R'|'L', feint:0..1, chipper:bool, pressure }
    preKick(ctx) {
      this.plan = null;
      if (this.human) return;
      const st = this.st, sty = this.style;
      let pGuess = sty.guessP + (ctx.feint || 0) * 0.35 - (st.com - 50) * 0.002;
      if (ctx.chipper) pGuess += 0.15;
      pGuess = U.clamp(pGuess, 0.05, 0.9);
      if (!U.chance(pGuess)) { this.plan = { type: 'react' }; return; }
      // choose a guess from what the keeper can actually know: the shooter's history & footedness
      let side = 0, high = U.chance(0.35);
      const hist = ctx.history || [];
      const follow = U.chance(U.clamp(sty.readW * (st.ant / 100) * Math.min(1, hist.length / 3), 0, 0.85));
      if (follow && hist.length) {
        const cnt = { '-1': 0, '0': 0, '1': 0 }, hi = { '-1': 0, '0': 0, '1': 0 };
        hist.forEach((z) => { cnt[z.side]++; if (z.high) hi[z.side]++; });
        // a smart keeper expects repetition, a very smart one expects the switch after repeated sides
        const last2 = hist.slice(-2);
        if (st.ant > 80 && last2.length === 2 && last2[0].side === last2[1].side && last2[0].side !== 0 && U.chance(0.5)) side = -last2[0].side;
        else side = +Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0];
        high = hi[side] > cnt[side] / 2;
      } else {
        const natural = ctx.foot === 'L' ? -1 : 1; // right-footers favour keeper's right (world -x is shooter's left)
        const r = Math.random();
        side = r < sty.center ? 0 : r < sty.center + (1 - sty.center) * 0.56 ? -natural : natural;
      }
      const early = U.clamp(sty.early + (ctx.feint || 0) * 0.4 - (st.com - 50) * 0.004, 0, 1);
      const offset = U.chance(early) ? U.rand(-0.16, -0.03) : U.rand(-0.02, 0.06);
      this.plan = {
        type: 'guess', side, offset,
        target: side === 0 ? { x: U.rand(-0.3, 0.3), y: high ? 2.0 : 0.6 } : { x: side * U.rand(1.9, 3.3), y: high ? U.rand(1.5, 2.2) : U.rand(0.25, 0.9) },
      };
      this.lean = side * 0.06;
    }
    onKick(t) { this.kickT = t; }
    commandDive(tx, ty) { // human input (or forced)
      if (this.committed) return false;
      this.humanCmd = { x: tx, y: ty };
      return true;
    }
    predict(ball, aware, noise) {
      const w = V.mul(ball.w, aware);
      const r = PL.simToZ(ball.p, ball.v, w, this.cond, KZ, 0);
      return { x: r.x + U.gauss() * noise, y: U.clamp(r.y + U.gauss() * noise * 0.7, 0.1, 2.6), t: r.t, ok: r.ok };
    }
    startAction(tx, ty, arrival) {
      this.committed = true;
      this.commitAt = this.t;
      const dx = tx - this.x;
      if (Math.abs(dx) < 0.75 && ty < 1.65) { this.setMode(ty < 0.55 ? 'blockLow' : 'block'); this.blockY = ty; this.blockX = tx; return; }
      if (Math.abs(dx) < 0.9 && ty >= 1.65) { this.setMode('jump'); this.jumpX = dx; return; }
      // dive
      const s = U.sign(dx);
      const ad = Math.abs(dx);
      const theta = U.clamp(Math.atan2(ad, ty - 0.75 + 0.35), 0.45, 1.62);
      const agi = this.st.agi / 100;
      const d = { s, x0: this.x, y0: 0.9 * this.h, ex: tx - s * Math.sin(theta) * 1.05, ey: ty - Math.cos(theta) * 1.05, theta, T: 0, t0: this.t, tx, ty };
      // calibrate pelvis end-point with forward kinematics so the gloves end exactly on the target
      for (let i = 0; i < 3; i++) {
        const P = this.divePose(d, 1, d.ey, 0);
        const J = PL.fk(P, this.h);
        const hm = V.lerp(J.handL, J.handR, 0.5);
        d.ex += tx - hm.x; d.ey += ty - hm.y;
      }
      const travel = U.clamp(Math.abs(d.ex - this.x), 0, this.diveTravel);
      d.ex = this.x + s * travel;
      d.ey = U.clamp(d.ey, 0.2, 0.95 * this.h + this.jumpH);
      const Tmin = (0.28 + 0.2 * (travel / 2.2)) * (1.22 - agi * 0.42);
      // time the dive so the gloves arrive with the ball (a keeper who reads early can wait)
      const arr = arrival === undefined ? Tmin : arrival - 0.03;
      d.T = U.clamp(arr, Tmin, Tmin * 1.5);
      d.t0 = this.t + Math.max(0, Math.min(0.25, arr - d.T));
      d.ty0 = ty; d.tyStart0 = () => d.ty0;
      this.dive = d;
      this.setMode('dive');
    }
    divePose(d, p, ey, armAdj) {
      const e = U.smooth(p) * 0.6 + U.easeOut(p) * 0.4;
      const x = U.lerp(d.x0, d.ex + (d.exAdj || 0), e);
      const y = U.lerp(d.y0, ey, e) + Math.sin(p * Math.PI) * 0.1;
      const th = d.theta * U.easeOut(Math.min(1, p * 1.25));
      return Pose.make({
        yaw: Math.PI, z: KZ, x, y, ground: false, roll: d.s * th, lean: 0.06, hpL: 0.25, hpR: 0.1, kL: 0.5, kR: 0.25, haL: 0.15, haR: 0.25,
        spL: 2.95, spR: 2.95, saL: -0.28, saR: -0.28, eL: 0.08, eR: 0.08,
      });
    }
    onContact(ball, cp, c, speed) {
      const st = this.st;
      const part = cp.part;
      const frontal = -c.n.z; // 1 = ball hits the front of the keeper squarely
      let p = (st.han / 100) * U.clamp(1.05 - speed / 32, 0, 1);
      p *= part === 'torso' ? 1.4 : part.startsWith('hand') ? 1.0 : 0.25;
      p *= U.clamp(frontal * 1.3, 0, 1);
      if (this.mode === 'dive' && this.dive && this.dive.theta > 1.1) p *= 0.6;
      if (this.cond.rain) p *= 0.55;
      this.saved = true;
      if (U.chance(p)) {
        this.hold = true;
        const self = this;
        return { type: 'catch', holdPos: () => self.handMid() };
      }
      const out = U.sign(ball.p.x || (this.dive ? this.dive.s : 1));
      const strong = 0.6 + st.han / 100 * 0.4;
      if (frontal > 0.45) // square block: ball comes back out
        return { type: 'parry', e: 0.3 + Math.min(0.25, speed * 0.008), friction: 0.5, minVz: -U.rand(1.5, 4) * strong, push: { x: out * U.rand(1, 3) * strong, y: U.rand(0.5, 2.5), z: 0 } };
      // glancing touch: fingertips steer the ball wide / over the bar
      const high = ball.p.y > 1.95;
      return { type: 'parry', e: 0.25, friction: 0.62, deflect: { yaw: out * U.rand(0.3, 0.6) * strong * (part.startsWith('hand') ? 1 : 0.6), pitch: high ? U.rand(0.25, 0.5) * strong : 0 } };
    }
    handMid() {
      const J = this.J;
      if (!J) return { x: this.x, y: 1, z: KZ - 0.2 };
      const m = V.lerp(J.handL, J.handR, 0.5);
      return V.add(m, V.mul(J.fwdW, 0.12));
    }

    /* ---------- update & animation ---------- */
    update(dt, ball, opts = {}) {
      this.t += dt; this.modeT += dt;
      const t = this.t;
      // decision logic
      if (ball && ball.inPlay && this.kickT !== null && !this.committed) {
        const since = t - this.kickT;
        if (this.human) {
          if (this.humanCmd) this.startAction(this.humanCmd.x, this.humanCmd.y);
        } else if (this.plan && this.plan.type === 'guess' && since >= this.plan.offset) {
          this.startAction(this.plan.target.x, this.plan.target.y);
        } else if (since >= this.reactDelay) {
          const aware = U.clamp((this.st.ant - 40) / 55, 0, 1);
          const noise = (0.66 - this.st.ant * 0.0056) * U.clamp(ball.speed() / 22, 0.6, 1.6);
          const pr = this.predict(ball, aware, noise);
          if (pr.ok) this.startAction(pr.x, pr.y, pr.t);
          else this.startAction(this.x, 0.5);
        }
      } else if (!this.committed && this.kickT === null) {
        // pre-kick: early committers may go before the ball is struck
        if (this.plan && this.plan.type === 'guess' && opts.timeToKick !== undefined && opts.timeToKick <= -this.plan.offset && this.plan.offset < 0) {
          this.startAction(this.plan.target.x, this.plan.target.y);
        }
        if (this.human && this.humanCmd) this.startAction(this.humanCmd.x, this.humanCmd.y);
      }
      // pounce on a loose ball after a parry
      if (ball && ball.inPlay && !ball.held && ball.touchedKeeper && !this.hold && this.J && ball.speed() < 5 && ball.p.z < KZ + 0.1) {
        const hm = this.handMid();
        if (V.len(V.sub(hm, ball.p)) < 0.75 + this.st.agi * 0.004) {
          this.hold = true;
          const self = this;
          ball.held = { pos: () => self.handMid() };
          ball.events.push({ type: 'catch', t: ball.t, p: Object.assign({}, ball.p), speed: 0 });
        }
      }
      // in-dive correction toward the live ball (reflexes)
      if (this.mode === 'dive' && ball && ball.inPlay && !ball.held && this.kickT !== null && t - this.kickT > this.reactDelay * 0.8) {
        const pr = PL.simToZ(ball.p, ball.v, V.mul(ball.w, 0.5), this.cond, KZ, 0);
        if (pr.ok && ball.p.z < KZ) {
          const d = this.dive;
          const rate = (this.human ? 0.9 : 0.4 + this.st.ref * 0.012) * dt;
          d.ty = U.approach(d.ty, U.clamp(pr.y, 0.1, 2.5), rate * 2);
          const lim = 0.03 + this.st.ref * 0.0012;
          d.exAdj = U.approach(d.exAdj || 0, U.clamp(pr.x - d.tx, -lim, lim), rate * 1.5);
        }
      }
      this.pose(dt, ball, opts);
      this.computeCapsules(dt);
    }
    pose(dt, ball, opts) {
      const P = this.P, t = this.t, mt = this.modeT, h = this.h;
      const base = Pose.make({ yaw: Math.PI, z: KZ, mood: this.mood });
      let o;
      const ready = (bob) => ({
        x: this.x, hpL: 0.55, hpR: 0.55, kL: 1.0, kR: 1.0, haL: 0.16, haR: 0.16, lean: 0.38 + bob * 0.04, roll: -this.lean,
        spL: 0.55, spR: 0.55, saL: 0.6, saR: 0.6, eL: 0.9, eR: 0.9,
      });
      switch (this.mode) {
        case 'ready': {
          const bob = Math.sin(t * 7);
          if (!this.committed && this.kickT === null) this.x = U.approach(this.x, Math.sin(t * 1.3) * 0.12, dt * 0.6);
          o = ready(bob);
          o.kL = o.kR = 0.95 + bob * 0.12; o.hpL = o.hpR = 0.52 + bob * 0.06;
          if (opts.wave) { o.spR = 2.9; o.saR = 0.4; o.eR = 0.3 + Math.sin(t * 8) * 0.3; }
          break;
        }
        case 'block': case 'blockLow': {
          const k = U.clamp(mt / 0.15, 0, 1);
          if (!this.hold) this.x = U.approach(this.x, this.blockX, dt * (2.5 + this.st.agi * 0.03));
          const low = this.mode === 'blockLow';
          o = ready(0);
          o.kL = o.kR = low ? 1.7 : 0.9; o.hpL = o.hpR = low ? 1.2 : 0.6; o.lean = low ? 0.7 : 0.25;
          o.haL = o.haR = low ? 0.35 : 0.2;
          const sp = low ? 0.5 : U.clamp(0.6 + (this.blockY - 0.7) * 1.6, 0.6, 2.2);
          o.spL = o.spR = U.lerp(0.55, sp, k); o.saL = o.saR = U.lerp(0.6, low ? 0.35 : 0.22, k); o.eL = o.eR = U.lerp(0.9, 0.3, k);
          if (this.hold) { o.spL = o.spR = 1.2; o.saL = o.saR = 0.05; o.eL = o.eR = 1.6; }
          break;
        }
        case 'jump': {
          const k = U.clamp(mt / 0.42, 0, 1);
          const yj = Math.sin(Math.min(1, k) * Math.PI) * this.jumpH * 0.8;
          o = { x: this.x + this.jumpX * U.easeOut(k) * 0.6, ground: false, y: 0.93 * h + yj, hpL: 0.2, hpR: 0.4, kL: 0.4, kR: 0.8, lean: 0.05,
            spL: 2.95, spR: 2.95, saL: 0.12 - this.armAdj, saR: 0.12 + this.armAdj, eL: 0.15, eR: 0.15 };
          if (k >= 1) { o.ground = true; if (mt > 0.8) this.setMode('getupDone'); }
          break;
        }
        case 'dive': {
          const d = this.dive;
          if (t < d.t0) { o = ready(0); o.x = this.x = U.approach(this.x, d.x0 + d.s * 0.15, dt); d.x0 = this.x; break; }
          const p = U.clamp((t - d.t0) / d.T, 0, 1);
          const ey = U.clamp(d.ey + (d.ty - d.tyStart0()), 0.2, 0.95 * h + this.jumpH);
          o = this.divePose(d, p, ey, this.armAdj);
          this.x = o.x;
          if (p >= 1) {
            const f = U.clamp((t - d.t0 - d.T - 0.12) / 0.38, 0, 1);
            o.y = U.lerp(ey, 0.2 * h, U.easeIn(f));
            o.roll = d.s * U.lerp(d.theta, Math.max(d.theta, 1.5), f);
            if (f >= 1 && t - d.t0 - d.T > 0.8) { this.x = d.ex + (d.exAdj || 0); this.setMode('fallen'); }
          }
          if (this.hold) { o.spL = o.spR = 2.0; o.saL = o.saR = 0.0; o.eL = o.eR = 1.2; }
          break;
        }
        case 'fallen': {
          const d = this.dive || { s: 1, theta: 1.5 };
          o = { x: this.x, ground: false, y: 0.2 * h, roll: d.s * Math.max(1.5, d.theta), hpL: 0.4, hpR: 0.1, kL: 0.9, kR: 0.4,
            spL: 2.6, spR: this.hold ? 1.8 : 2.6, saL: 0.3, saR: 0.3, eL: this.hold ? 1.4 : 0.4, eR: this.hold ? 1.4 : 0.4, head: -0.2 };
          if (this.hold) { o.spL = 1.8; o.eL = 1.4; }
          break;
        }
        case 'getup': {
          const k = U.easeInOut(U.clamp(mt / 0.8, 0, 1));
          const d = this.dive || { s: 1, theta: 1.5 };
          const a = Pose.make(Object.assign({ yaw: Math.PI, z: KZ }, { x: this.x, ground: false, y: 0.2 * h, roll: d.s * 1.5, spL: 2.6, spR: 2.6, kL: 0.9 }));
          const b = Pose.make(Object.assign({ yaw: Math.PI, z: KZ }, ready(0), { x: this.x }));
          a.y = 0.2 * h; b.ground = false; b.y = 0.86 * h;
          const bl = Pose.blend(a, b, k);
          bl.ground = k > 0.95;
          o = bl;
          if (k >= 1) this.setMode('getupDone');
          break;
        }
        case 'celebrate': {
          const j = Math.abs(Math.sin(mt * 5.5));
          o = { x: this.x, ground: false, y: 0.95 * h + j * 0.35, hpL: 0.3 * j, hpR: 0.6 * j, kL: 0.6 * j, kR: 1.2 * j,
            spR: 2.9, saR: 0.25, eR: 0.1 + j * 0.3, spL: 1.2, saL: 0.9, eL: 1.9, lean: -0.1, mood: 'happy' };
          if (mt > 2.2) o = { x: this.x, spR: 2.4, saR: 0.6, eR: 1.6, spL: 2.4, saL: 0.6, eL: 1.6, mood: 'happy', lean: -0.15 };
          break;
        }
        case 'dejected': {
          const k = U.clamp(mt / 0.5, 0, 1);
          o = { x: this.x, hpL: 0.2, hpR: 0.2, kL: 0.3, kR: 0.3, lean: 0.35 * k, head: 0.6 * k, spL: -0.3, spR: -0.3, saL: 0.5, saR: 0.5, eL: 2.2 * k, eR: 2.2 * k, mood: 'sad' };
          break;
        }
        default: {
          o = ready(0);
        }
      }
      if (this.mode === 'getupDone') { this.mode = 'ready'; this.dive = null; }
      const np = Object.assign(base, o);
      if (np.ground === undefined) np.ground = true;
      this.P = np;
    }
    computeCapsules(dt) {
      const J = (this.J = PL.fk(this.P, this.h));
      const h = this.h;
      const list = [
        { a: J.pelvis, b: J.neck, r: 0.17 * h, part: 'torso' },
        { a: J.head, b: J.head, r: 0.13 * h, part: 'head' },
        { a: J.shL, b: J.elL, r: 0.065 * h, part: 'armL' }, { a: J.elL, b: J.handL, r: 0.065 * h, part: 'armL' },
        { a: J.shR, b: J.elR, r: 0.065 * h, part: 'armR' }, { a: J.elR, b: J.handR, r: 0.065 * h, part: 'armR' },
        { a: J.handL, b: J.handL, r: 0.11 * h, part: 'handL' }, { a: J.handR, b: J.handR, r: 0.11 * h, part: 'handR' },
        { a: J.hipL, b: J.kneeL, r: 0.085 * h, part: 'legL' }, { a: J.kneeL, b: J.footL, r: 0.075 * h, part: 'legL' },
        { a: J.hipR, b: J.kneeR, r: 0.085 * h, part: 'legR' }, { a: J.kneeR, b: J.footR, r: 0.075 * h, part: 'legR' },
      ];
      const hd = V.len(V.sub(J.handL, J.handR));
      list.push({ a: J.handL, b: J.handR, r: hd < 0.4 ? 0.1 * h : 0.001, part: 'handM' });
      if (this.prevCaps && dt > 0) {
        for (let i = 0; i < list.length; i++) {
          const a = list[i], b = this.prevCaps[i];
          const m1 = V.lerp(a.a, a.b, 0.5), m0 = V.lerp(b.a, b.b, 0.5);
          a.vel = V.mul(V.sub(m1, m0), 1 / dt);
          const sp = V.len(a.vel);
          if (sp > 12) a.vel = V.mul(a.vel, 12 / sp);
        }
      }
      this.prevCaps = list;
      this.capsules = list;
    }
    celebrate() { this.setMode('celebrate'); this.mood = 'happy'; }
    dejected() { if (this.mode === 'fallen' || this.mode === 'dive') return; this.setMode('dejected'); this.mood = 'sad'; }
    getUp() { if (this.mode === 'fallen') this.setMode('getup'); }
    // keeper "tell" used by the Ojo de Halcón ability (leans only if keeper has a pre-plan)
    tell() { return this.plan && this.plan.type === 'guess' ? this.plan.side : null; }
  }
  Keeper.KZ = KZ;
  PL.Keeper = Keeper;
})(typeof window !== 'undefined' ? window : globalThis);
