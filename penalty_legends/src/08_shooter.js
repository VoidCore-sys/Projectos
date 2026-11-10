/* PENALTY LEGENDS — penalty taker entity (run-up, strike, celebrations) and AI shooter decisions */
(function (G) {
  'use strict';
  const PL = G.PL, U = PL.U, V = PL.V, Pose = PL.Pose, D = PL.Data;

  class Shooter {
    constructor(profile, kit, opts = {}) {
      this.profile = profile;
      this.fs = profile.foot === 'L' ? -1 : 1;
      this.h = (profile.look && profile.look.height) || 1;
      this.app = Object.assign({}, profile.look, { kit, boots: opts.boots || { color: '#202028', accent: '#fff' }, number: profile.num, label: (profile.name || '').split(' ').slice(-1)[0], height: this.h });
      this.reset();
    }
    reset() {
      const fs = this.fs;
      this.start = { x: -1.55 * fs, z: -2.7 };
      this.plant = { x: -0.13 * fs, z: -0.44 };
      this.pos = { x: this.start.x, z: this.start.z };
      this.mode = 'idle'; this.t = 0; this.mt = 0; this.u = 0; this.kickAt = null; this.kicked = false;
      this.tellSide = 0; this.tellAmp = 0; this.aimYaw = 0; this.yaw = Math.atan2(-this.start.x, -this.start.z);
      this.tech = 'colocado'; this.paradinha = false;
      this.P = Pose.make({ x: this.pos.x, z: this.pos.z, yaw: this.yaw });
      this.celebStyle = this.profile.celeb || 'jump';
      this.update(0);
    }
    setMode(m) { this.mode = m; this.mt = 0; }
    beginRunup(dur, paradinha) { this.runDur = dur; this.paradinha = !!paradinha; this.setMode('runup'); this.u = 0; }
    // force the strike at a given time from now (timing input)
    triggerKick(delay) { if (this.kickAt === null) { this.kickAt = this.t + Math.max(0.05, delay); this.uAtTrig = this.u; this.tTrig = this.t; } }
    runPose(ph, lean) {
      const s = Math.sin(ph), c = Math.cos(ph);
      return {
        hpL: s * 0.7, hpR: -s * 0.7, kL: 0.3 + Math.max(0, -c) * 1.3, kR: 0.3 + Math.max(0, c) * 1.3,
        spL: -s * 0.75, spR: s * 0.75, eL: 1.3, eR: 1.3, saL: 0.2, saR: 0.2, lean, haL: 0.04, haR: 0.04,
      };
    }
    kickPose(k) { // k: 0 backswing, 0.5 contact, 1 follow-through
      const K = this.fs > 0 ? 'R' : 'L', N = this.fs > 0 ? 'L' : 'R';
      const chip = this.tech === 'picada', power = this.tech === 'potente';
      const keys = [
        { hpK: -0.85, kK: 1.85, hpN: 0.32, kN: 0.38, lean: 0.18, side: -0.12 * this.fs, saK: 0.6, spK: -0.7, saN: 1.15, spN: 0.35 },
        { hpK: 0.32, kK: 0.5, hpN: 0.05, kN: 0.32, lean: chip ? -0.05 : 0.06, side: -0.05 * this.fs, saK: 0.85, spK: -0.3, saN: 0.95, spN: 0.45 },
        { hpK: chip ? 0.85 : power ? 1.45 : 1.2, kK: 0.25, hpN: -0.12, kN: 0.15, lean: chip ? -0.2 : -0.12, side: 0.02, saK: 0.8, spK: 0.25, saN: 0.75, spN: -0.25 },
      ];
      const a = k < 0.5 ? keys[0] : keys[1], b = k < 0.5 ? keys[1] : keys[2];
      const t = k < 0.5 ? U.smooth(k / 0.5) : U.smooth((k - 0.5) / 0.5);
      const o = {};
      for (const key in a) o[key] = U.lerp(a[key], b[key], t);
      const P = { lean: o.lean, side: o.side };
      P['hp' + K] = o.hpK; P['k' + K] = o.kK; P['hp' + N] = o.hpN; P['k' + N] = o.kN;
      P['sa' + K] = o.saK; P['sp' + K] = o.spK; P['sa' + N] = o.saN; P['sp' + N] = o.spN;
      P['e' + K] = 0.7; P['e' + N] = 0.6; P['ha' + K] = 0.05; P['ha' + N] = 0.1;
      return P;
    }
    update(dt) {
      this.t += dt; this.mt += dt;
      const fs = this.fs, mt = this.mt, t = this.t;
      let o = {};
      let yaw = this.yaw;
      switch (this.mode) {
        case 'idle': {
          const br = Math.sin(t * 2.2);
          this.pos = { x: this.start.x, z: this.start.z };
          yaw = Math.atan2(this.plant.x - this.start.x, this.plant.z - this.start.z) * 0.6;
          o = { spL: 0.05 + br * 0.03, spR: 0.05 - br * 0.03, saL: 0.2, saR: 0.2, eL: 0.35, eR: 0.35, lean: 0.06 + br * 0.015, head: 0.15, haL: 0.1, haR: 0.1 };
          break;
        }
        case 'runup': {
          let u;
          if (this.kickAt !== null) {
            const span = Math.max(0.02, this.kickAt - this.tTrig);
            u = U.lerp(this.uAtTrig, 1, U.clamp((t - this.tTrig) / span, 0, 1));
          } else {
            let lin = mt / this.runDur;
            if (this.paradinha) lin = lin < 0.55 ? lin / 0.55 * 0.62 : lin < 0.8 ? 0.62 + (lin - 0.55) * 0.12 : 0.65 + (lin - 0.8) / 0.2 * 0.31;
            u = Math.min(lin, 0.965);
          }
          this.u = u;
          const ue = U.smooth(Math.min(1, u * 1.05));
          const cx = U.lerp(this.start.x, this.plant.x, ue), cz = U.lerp(this.start.z, this.plant.z, ue) - Math.sin(u * Math.PI) * 0.15 * 0;
          const dx = this.plant.x - this.start.x, dz = this.plant.z - this.start.z;
          const pathYaw = Math.atan2(dx, dz);
          this.pos = { x: cx + Math.sin(u * Math.PI) * 0.25 * -fs, z: cz };
          yaw = U.lerp(pathYaw, this.aimYaw, U.smooth(U.clamp((u - 0.6) / 0.4, 0, 1)));
          const ph = u * 15.5;
          const run = this.runPose(ph, 0.24);
          if (u > 0.78) {
            const k = U.clamp((u - 0.78) / 0.22, 0, 1) * 0.5;
            const kp = this.kickPose(k);
            const bl = U.smooth(U.clamp((u - 0.78) / 0.1, 0, 1));
            for (const key in kp) o[key] = U.lerp(run[key] !== undefined ? run[key] : 0, kp[key], bl);
            for (const key in run) if (o[key] === undefined) o[key] = U.lerp(run[key], 0.2, bl);
          } else o = run;
          o.roll = this.tellSide * this.tellAmp * U.smooth(U.clamp((u - 0.45) / 0.3, 0, 1));
          if (this.kickAt !== null && t >= this.kickAt && !this.kicked) { this.kicked = true; this.setMode('follow'); }
          break;
        }
        case 'follow': {
          const k = 0.5 + U.clamp(mt / 0.3, 0, 1) * 0.5;
          o = this.kickPose(k);
          this.pos = { x: this.plant.x + U.clamp(mt, 0, 0.4) * 0.3 * fs * 0, z: this.plant.z + U.easeOut(U.clamp(mt / 0.6, 0, 1)) * 0.35 };
          yaw = this.aimYaw;
          break;
        }
        case 'celebrate': {
          const turn = U.smooth(U.clamp(mt / 0.45, 0, 1));
          yaw = U.lerp(this.aimYaw, Math.PI + 0.25 * fs, turn);
          const st = this.celebStyle;
          o.mood = 'happy';
          if (mt < 0.45) { o = Object.assign(this.runPose(mt * 14, 0.15), { mood: 'happy' }); this.pos.z += dt * 1.2; }
          else if (st === 'jump') {
            const j = Math.abs(Math.sin((mt - 0.45) * 5.2));
            o = { ground: false, y: 0.95 * this.h + j * 0.42, hpL: 0.5 * j, hpR: 0.2 * j, kL: 1.2 * j, kR: 0.5 * j, spR: 2.95, saR: 0.15, eR: 0.15 + 0.4 * j, spL: 0.6, saL: 0.9, eL: 1.8, lean: -0.08, mood: 'happy' };
          } else if (st === 'airplane') {
            const ph = mt * 11;
            o = Object.assign(this.runPose(ph, 0.1), { saL: 1.5, saR: 1.5, spL: 0, spR: 0, eL: 0.05, eR: 0.05, side: Math.sin(mt * 2) * 0.25, mood: 'happy' });
            this.pos.x += Math.cos(mt * 1.5) * dt * 2.2 * fs; this.pos.z -= dt * 0.6;
          } else if (st === 'slide') {
            const s = U.clamp((mt - 0.45) / 0.6, 0, 1);
            if (s < 1) this.pos.z -= dt * (1 - s) * 4;
            o = { hpL: 1.4, hpR: -0.2, kL: 2.2, kR: 2.2, lean: -0.35 * U.smooth(s), spL: 2.8, spR: 2.8, saL: 0.45, saR: 0.45, eL: 0.2, eR: 0.2, mood: 'happy' };
          } else {
            const a = Math.sin(mt * 3) > 0;
            o = { spL: a ? 2.95 : 2.4, spR: a ? 2.4 : 2.95, saL: 0.25, saR: 0.25, eL: 0.1, eR: 0.1, lean: -0.15, head: -0.4, mood: 'happy' };
          }
          break;
        }
        case 'dejected': {
          const k = U.smooth(U.clamp(mt / 0.5, 0, 1));
          yaw = U.lerp(this.aimYaw, Math.PI * 0.85 * fs, U.smooth(U.clamp((mt - 0.8) / 0.8, 0, 1)));
          if (mt < 1.6) o = { spL: 2.5 * k, spR: 2.5 * k, saL: 0.8, saR: 0.8, eL: 2.1 * k, eR: 2.1 * k, head: -0.35, lean: -0.1, mood: 'sad' };
          else {
            const c = U.smooth(U.clamp((mt - 1.6) / 0.5, 0, 1));
            o = { hpL: 1.5 * c, hpR: 1.5 * c, kL: 2.4 * c, kR: 2.4 * c, lean: 0.5 * c, spL: 1.0, spR: 1.0, saL: 0.3, saR: 0.3, eL: 1.2, eR: 1.2, head: 0.5, mood: 'sad', haL: 0.2, haR: 0.2 };
          }
          break;
        }
        case 'walkoff': {
          yaw = Math.PI * 0.7;
          o = this.runPose(mt * 6, 0.05);
          o.kL *= 0.5; o.kR *= 0.5; o.hpL *= 0.5; o.hpR *= 0.5;
          this.pos.x -= dt * 0.8 * this.fs; this.pos.z -= dt * 0.9;
          break;
        }
      }
      this.yaw = yaw;
      const P = Pose.make(Object.assign({ x: this.pos.x, z: this.pos.z, yaw }, o));
      if (o.ground === false) { P.ground = false; P.y = o.y; }
      this.P = P;
    }
    celebrate() { this.setMode('celebrate'); }
    dejected() { this.setMode('dejected'); }
    // contact point of kicking foot (for effects)
    footPos() { const J = PL.fk(this.P, this.h); return this.fs > 0 ? J.toeR : J.toeL; }
  }
  PL.Shooter = Shooter;

  // AI penalty-taker decisions (aim chosen privately; keeper never sees it)
  PL.AIShooter = {
    decide(prof, ctx = {}) {
      const st = prof.stats, ai = prof.ai || { cornerBias: 0.6, favSide: 1, chipP: 0.04 };
      let tech = 'colocado';
      const r = Math.random();
      if (r < (ai.chipP || 0.04)) tech = 'picada';
      else if (r < 0.1 + st.pow / 250) tech = 'potente';
      else if (r < 0.2 + st.pow / 250 + st.cur / 300) tech = 'rosca';
      let side = U.chance(0.12) ? 0 : U.chance(0.6) ? ai.favSide : -ai.favSide;
      if (tech === 'picada') side = 0;
      const corner = ai.cornerBias + (st.pre - 50) / 200;
      const x = side === 0 ? U.rand(-0.6, 0.6) : side * U.clamp(U.rand(1.4, 2.6) + corner * 1.0, 1.2, 3.35);
      const y = tech === 'picada' ? U.rand(1.3, 1.9) : U.chance(0.45) ? U.rand(1.3, 2.15) : U.rand(0.18, 0.75);
      const power = tech === 'picada' ? U.rand(0.35, 0.7) : U.rand(0.62, 0.98);
      const curl = tech === 'rosca' ? -side * U.rand(0.5, 1) || U.rand(-1, 1) : U.rand(-0.25, 0.25);
      // timing quality depends on composure & control
      const q = (st.con + st.com) / 200 - (ctx.pressure || 0) * 0.25;
      const timingErr = U.gauss() * U.lerp(0.11, 0.025, U.clamp(q, 0, 1));
      return { tech, aim: { x, y }, power, curl, timingErr, side };
    },
    // react to a keeper that moved before the strike
    adapt(prof, dec, keeperSide) {
      if (keeperSide === null || keeperSide === undefined) return dec;
      if (!U.chance(prof.stats.com / 140)) return dec;
      if (keeperSide !== 0 && Math.sign(dec.aim.x) === keeperSide) {
        return Object.assign({}, dec, { aim: { x: -keeperSide * U.rand(1.6, 2.8), y: dec.aim.y }, adapted: true });
      }
      return dec;
    },
  };
})(typeof window !== 'undefined' ? window : globalThis);
