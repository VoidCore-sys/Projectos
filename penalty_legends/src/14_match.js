/* PENALTY LEGENDS — gameplay: single penalty (KickRunner), full shoot-out (Shootout), training drills, attract mode */
(function (G) {
  'use strict';
  const PL = G.PL, U = PL.U, V = PL.V, W = PL.W, D = PL.Data, I = PL.Input, Shot = PL.Shot;
  const A = () => PL.Audio;
  const S = () => PL.Save.data;

  /* ===================================================================== */
  /* KickRunner: one penalty kick, human or AI on each side                 */
  /* ===================================================================== */
  class KickRunner {
    constructor(scene, cfg) {
      this.scene = scene; this.cfg = cfg;
      this.state = 'setup'; this.t = 0; this.st = 0;
      this.aim = { x: 0, y: 1.2 }; this.curl = 0; this.power = 0; this.tech = cfg.tech || 'colocado';
      this.paradinha = false; this.timing = null; this.result = null; this.launch = null; this.timeScale = 1;
      this.popups = [];
      const sc = scene;
      sc.ball.reset(); sc.ball.visible = true;
      sc.shooter = new PL.Shooter(cfg.shooter, cfg.shooterKit, { boots: cfg.boots });
      sc.shooter.tech = this.tech;
      sc.keeper = cfg.keeper ? new PL.Keeper(cfg.keeper, { human: cfg.keeperHuman, gloves: cfg.gloves, bonus: cfg.keeperBonus, cond: cfg.cond }) : null;
      sc.extras = cfg.extras || [];
      sc.overlay = { aim: null, ring: null, guide: null, keeperMark: null, tell: null };
      this.stats = Shot.effStats(cfg.shooter, cfg.boots, cfg.level);
      this.ability = cfg.shooter.ability || 'none';
      this.wobbleAmp = cfg.shooterHuman ? Shot.pressureWobble(this.stats, this.ability, cfg.pressure || 0) * 0.5 : 0;
      this.ball = sc.ball;
      this.ball.onEvent = (e) => this.onBallEvent(e);
      this.guideT = 0;
      this.lastAimSig = '';
      if (!cfg.shooterHuman) this.aiDec = PL.AIShooter.decide(cfg.shooter, { pressure: cfg.pressure || 0 });
    }
    get captures() { return true; }
    phaseInfo() {
      return { state: this.state, power: this.power, curl: this.curl, tech: this.tech, paradinha: this.paradinha, human: this.cfg.shooterHuman, keeperHuman: this.cfg.keeperHuman && !!this.scene.keeper, timing: this.timing, result: this.result };
    }
    popup(text, cls) { if (this.cfg.quiet) return; this.popups.push({ text, cls, t: 0 }); if (PL.HUD) PL.HUD.popup(text, cls); }
    setState(s) { this.state = s; this.st = 0; }
    update(dt) {
      const cfg = this.cfg, sc = this.scene;
      this.t += dt; this.st += dt;
      const kp = sc.keeper, sh = sc.shooter, ball = this.ball;
      switch (this.state) {
        case 'setup':
          if (this.st > (cfg.fast ? 0.15 : 0.7)) {
            if (!cfg.fast) { sc.whistle(); A().sfx('whistle'); }
            this.setState(cfg.shooterHuman ? 'aim' : 'aiWait');
            if (cfg.shooterHuman && cfg.hideAimFromKeeper) PL.HUD && PL.HUD.privacy(true);
          }
          break;
        case 'aim': case 'power':
          this.updateAimInput(dt, 1);
          if (this.state === 'aim' && I.pressed('action')) { this.setState('power'); this.power = 0; A().sfx('charge'); }
          if (this.state === 'power') {
            const rate = this.power < 1 ? 1 / 1.05 : 0.45;
            this.power = Math.min(1.25, this.power + dt * rate);
            if (!I.held('action') || I.released('action')) this.startRunup();
          }
          sc.overlay.aim = { x: this.aimX(), y: this.aimY(), color: this.wobbleAmp > 0.15 ? '#ff7a1a' : '#ffe14d' };
          this.updateGuide(dt);
          break;
        case 'runup': {
          const sf = (0.15 + this.stats.con * 0.0045) + (this.paradinha ? 0.25 : 0);
          this.updateAimInput(dt, sf);
          if (!cfg.hideAimFromKeeper) sc.overlay.aim = { x: this.aimX(), y: this.aimY(), color: '#ffe14d' };
          sc.overlay.guide = null;
          const Tk = this.runDur;
          sc.overlay.ring = this.pressT == null ? { k: U.clamp((Tk - this.st) / Tk, -0.2, 1) } : null;
          if (this.pressT == null && (I.pressed('action') || I.pressed('tap')) && this.st > 0.12) this.press(this.st);
          if (this.pressT == null && this.st > Tk + 0.25) this.press(this.st);
          if (this.ability === 'ojo' || this.ability === 'mago') sc.overlay.tell = kp ? kp.tell() : null;
          if (sh.kicked && !ball.inPlay) this.kick();
          break;
        }
        case 'aiWait':
          if (this.st > (cfg.fast ? 0.1 : 0.55)) {
            this.runDur = cfg.fast ? 0.8 : U.rand(0.95, 1.2);
            sh.aimYaw = Math.atan2(this.aiDec.aim.x, 11) * 0.5;
            sh.tellSide = Math.sign(this.aiDec.aim.x); sh.tellAmp = (1 - cfg.shooter.stats.com / 100) * 0.16;
            sh.tech = this.aiDec.tech;
            sh.beginRunup(this.runDur, false);
            if (kp) kp.preKick({ history: cfg.history, foot: cfg.shooter.foot, feint: 0, chipper: this.aiDec.tech === 'picada' });
            this.setState('aiRunup');
          }
          this.keeperInput();
          break;
        case 'aiRunup':
          this.keeperInput();
          if (this.st >= this.runDur + this.aiDec.timingErr * 0.5 && sh.kickAt === null) sh.triggerKick(0.06);
          if (sh.kicked && !ball.inPlay) this.kick();
          break;
        case 'flight':
          this.keeperInput();
          this.checkResult();
          if (this.st > 0.9 || this.result) this.timeScale = U.approach(this.timeScale, 1, dt * 3);
          break;
        case 'react':
          if (this.st > 0.9 && kp && kp.mode === 'fallen') kp.getUp();
          if (this.st > (cfg.fast ? 1.1 : 2.7)) this.setState('done');
          break;
      }
      // simulation
      sh.update(dt);
      if (kp) {
        const ttk = sh.mode === 'runup' && sh.kickAt === null && this.runDur ? Math.max(0, this.runDur - sh.mt) : undefined;
        kp.update(dt, ball, { timeToKick: ttk });
        if (this.state === 'aiRunup' || this.state === 'aiWait') sc.overlay.keeperMark = kp.humanCmd ? { x: kp.humanCmd.x, y: kp.humanCmd.y } : null;
      }
      const world = { cond: cfg.cond, keeper: this.collider() };
      PL.Physics.step(ball, dt, world);
      if (this.state === 'flight' && cfg.onFlight) cfg.onFlight(ball, this);
    }
    collider() {
      const kp = this.scene.keeper, obs = this.cfg.obstacles;
      if (!obs || !obs.length) return kp;
      const caps = (kp ? kp.capsules : []).concat(obs);
      return { capsules: caps, onContact: (b, cp, c, sp) => (cp.static ? { type: 'parry', e: 0.35 } : kp.onContact(b, cp, c, sp)) };
    }
    aimX() { return this.aim.x + (this.wobbleAmp ? (Math.sin(this.t * 1.7) * 0.7 + Math.sin(this.t * 3.3) * 0.3) * this.wobbleAmp : 0); }
    aimY() { return this.aim.y + (this.wobbleAmp ? (Math.cos(this.t * 2.1) * 0.6 + Math.sin(this.t * 4.1) * 0.25) * this.wobbleAmp * 0.6 : 0); }
    updateAimInput(dt, speedF) {
      const sp = 3.4 * speedF * dt;
      if (I.held('left')) this.aim.x -= sp;
      if (I.held('right')) this.aim.x += sp;
      if (I.held('up')) this.aim.y += sp * 0.8;
      if (I.held('down')) this.aim.y -= sp * 0.8;
      const mv = I.consumeMove(), tmv = I.consumeAimMove();
      if ((mv && I.pointer.inside && I.pointer.type === 'mouse') || (tmv && I.pointer.type === 'touch')) {
        const p = this.scene.cam.toPlaneZ(I.pointer.x, I.pointer.y, W.GOAL_Z);
        if (p) {
          if (speedF >= 1) { this.aim.x = p.x; this.aim.y = p.y; }
          else { this.aim.x = U.approach(this.aim.x, p.x, sp * 1.5); this.aim.y = U.approach(this.aim.y, p.y, sp * 1.2); }
        }
      }
      this.aim.x = U.clamp(this.aim.x, -4.8, 4.8); this.aim.y = U.clamp(this.aim.y, 0.12, 3.4);
      if (this.state !== 'runup') {
        if (I.held('curlL')) this.curl -= dt * 1.6;
        if (I.held('curlR')) this.curl += dt * 1.6;
        const w = I.consumeWheel(); if (w) this.curl -= w * 0.1;
        this.curl = U.clamp(this.curl, -1, 1);
        if (Math.abs(this.curl) < 0.02) this.curl = 0;
        for (let i = 1; i <= 4; i++) if (I.pressed('tech' + i)) this.setTech(D.TECH_ORDER[i - 1]);
        if (I.pressed('paradinha')) this.toggleParadinha();
      }
    }
    setTech(t) { if (this.state === 'aim' || this.state === 'power') { this.tech = t; this.scene.shooter.tech = t; A().sfx('click'); if (t === 'picada' && this.aim.y < 1.0) this.aim.y = 1.4; } }
    toggleParadinha() { if (this.state === 'aim' || this.state === 'power') { this.paradinha = !this.paradinha; A().sfx('click'); } }
    setCurl(v) { if (this.state !== 'runup') this.curl = U.clamp(v, -1, 1); }
    updateGuide(dt) {
      if (!S().settings.aimGuide) { this.scene.overlay.guide = null; return; }
      this.guideT -= dt;
      const sig = this.aim.x.toFixed(2) + this.aim.y.toFixed(2) + this.curl.toFixed(2) + this.tech;
      if (this.guideT > 0 && sig === this.lastAimSig) return;
      this.guideT = 0.12; this.lastAimSig = sig;
      const L = Shot.compute({ stats: Object.assign({}, this.stats, { pre: 200 }), ability: 'none', tech: this.tech, aim: { x: this.aim.x, y: this.aim.y }, power: 0.85, curl: this.curl, timingErr: 0, cond: this.cfg.cond });
      const pts = [];
      let p = { x: 0, y: W.BALL_R, z: 0 }, v = Object.assign({}, L.v), w = Object.assign({}, L.w);
      const h = 1 / 60;
      for (let i = 0; i < 60 && p.z < 7.5; i++) {
        const a = PL.Physics.accel(p, v, w, this.cfg.cond, 0, 0);
        v = V.add(v, V.mul(a, h)); p = V.add(p, V.mul(v, h));
        if (i % 2 === 0) pts.push(p);
      }
      this.scene.overlay.guide = pts;
    }
    startRunup() {
      const sc = this.scene, kp = sc.keeper, sh = sc.shooter;
      if (this.paradinha) this.power = Math.min(this.power, 0.9);
      this.runDur = this.paradinha ? 1.45 : 1.0;
      sh.aimYaw = Math.atan2(this.aim.x, 11) * 0.5;
      sh.beginRunup(this.runDur, this.paradinha);
      const feint = (this.ability === 'engano' ? 0.5 : 0) + (this.paradinha ? 0.35 : 0) + (this.ability === 'mago' ? 0.2 : 0);
      if (kp) kp.preKick({ history: this.cfg.history, foot: this.cfg.shooter.foot, feint, chipper: this.ability === 'picadita' && this.tech === 'picada', pressure: this.cfg.pressure });
      if (this.cfg.hideAimFromKeeper) { sc.overlay.aim = null; PL.HUD && PL.HUD.privacy(false); }
      this.setState('runup');
    }
    press(t) {
      this.pressT = t;
      this.timingErr = U.clamp(t - this.runDur, -0.35, 0.3);
      this.scene.shooter.triggerKick(0.06);
      this.scene.overlay.ring = null;
    }
    kick() {
      const cfg = this.cfg, sc = this.scene, kp = sc.keeper, ball = this.ball;
      let p;
      if (cfg.shooterHuman) {
        p = { stats: this.stats, ability: this.ability, tech: this.tech, aim: { x: this.aimX(), y: this.aimY() }, power: this.power, curl: this.curl, timingErr: this.timingErr, cond: cfg.cond };
      } else {
        let dec = this.aiDec;
        if (kp && kp.committed && kp.commitAt !== null) { // keeper moved before the strike: a calm taker sends it the other way
          const side = kp.dive ? kp.dive.s : 0;
          dec = PL.AIShooter.adapt(cfg.shooter, dec, side);
        }
        p = { stats: this.stats, ability: this.ability, tech: dec.tech, aim: dec.aim, power: dec.power, curl: dec.curl, timingErr: dec.timingErr, cond: cfg.cond };
      }
      const L = Shot.compute(p);
      this.launch = L; this.timing = L.timing;
      ball.reset();
      ball.onEvent = (e) => this.onBallEvent(e);
      ball.v = L.v; ball.w = L.w; ball.knuckle = L.knuckle; ball.inPlay = true;
      if (kp) kp.onKick(kp.t);
      A().sfx('kick', { power: U.clamp(L.speed / 30, 0.3, 1) });
      sc.burst('grass', { x: 0, y: 0.05, z: -0.05 }, 10, { speed: 1.6, dir: { x: 0, y: 1, z: 1.5 } });
      if (L.speed > 27) sc.addShake(0.25);
      if (cfg.shooterHuman) {
        this.popup(L.timing.name, 'timing-' + L.timing.id);
        if (L.timing.id === 'perfect') { A().sfx('perfect'); sc.burst('spark', { x: 0, y: 0.2, z: 0 }, 14, { speed: 2.5 }); }
      }
      sc.overlay.aim = null; sc.overlay.guide = null; sc.overlay.tell = null;
      const slow = S().settings.slowmo && (cfg.keeperHuman || (cfg.pressure || 0) > 0.55);
      this.timeScale = slow ? (cfg.keeperHuman ? 0.42 : 0.6) : 1;
      if (cfg.fast) this.timeScale = 1;
      this.setState('flight');
      A().setCrowd(0.12);
    }
    keeperInput() {
      const kp = this.scene.keeper;
      if (!kp || !kp.human || kp.committed) return;
      const tap = I.consumeTap();
      if (tap) {
        const p = this.scene.cam.toPlaneZ(tap.x, tap.y, W.GOAL_Z);
        if (p) { kp.commandDive(U.clamp(p.x, -3.6, 3.6), U.clamp(p.y, 0.15, 2.4)); return; }
      }
      if (I.pointer.type === 'mouse' && I.pressed('action') && I.pointer.inside && I.lastDevice === 'mouse') {
        const p = this.scene.cam.toPlaneZ(I.pointer.x, I.pointer.y, W.GOAL_Z);
        if (p) { kp.commandDive(U.clamp(p.x, -3.6, 3.6), U.clamp(p.y, 0.15, 2.4)); return; }
      }
      const l = I.held('left'), r = I.held('right'), u = I.held('up'), d = I.held('down');
      if (l || r || u || d || (I.pressed('action') && I.lastDevice === 'keyboard')) {
        if (!this.kbT) this.kbT = this.t;
        if (this.t - this.kbT > 0.05 || I.pressed('action')) {
          const x = l ? -2.7 : r ? 2.7 : 0, y = u ? 1.9 : d ? 0.35 : (l || r ? 1.0 : 1.1);
          kp.commandDive(x, y);
          this.kbT = null;
        }
      } else this.kbT = null;
    }
    onBallEvent(e) {
      const sc = this.scene;
      switch (e.type) {
        case 'post': case 'bar': A().sfx('post'); sc.addShake(0.35); sc.burst('spark', e.p, 6, { speed: 1.5, colors: ['#ffffff'] }); this.popup(e.type === 'bar' ? '¡TRAVESAÑO!' : '¡PALO!', 'post'); A().ooh(); break;
        case 'net': A().sfx('net'); break;
        case 'catch': A().sfx('catch'); break;
        case 'parry': A().sfx('save'); sc.burst('spark', e.p, 5, { speed: 1.2 }); break;
        case 'bounce': A().sfx('bounce', { gain: U.clamp(e.speed / 20, 0.2, 1) }); if (this.cfg.cond && this.cfg.cond.rain) sc.burst('splash', e.p, 6, { speed: 1 }); break;
        case 'board': A().sfx('board'); break;
      }
    }
    checkResult() {
      if (this.result) return;
      const b = this.ball, ev = b.events.map((e) => e.type);
      let r = null;
      if (b.inGoal) r = 'goal';
      else if (ev.includes('catch')) r = 'saved';
      else if (ev.includes('out')) r = b.hitWood && !b.touchedKeeper ? 'post' : b.touchedKeeper ? 'saved' : 'miss';
      else if ((b.touchedKeeper || b.hitWood) && b.v.z < -0.5 && b.p.z < W.GOAL_Z - 0.6) r = b.touchedKeeper ? 'saved' : 'post';
      else if (b.stopped || this.st > 3.2) r = b.touchedKeeper ? 'saved' : b.hitWood ? 'post' : 'miss';
      if (r) this.resolve(r);
    }
    resolve(r) {
      const sc = this.scene, cfg = this.cfg, kp = sc.keeper, L = this.launch, b = this.ball;
      const goalEv = b.events.find((e) => e.type === 'goal');
      const cross = goalEv ? goalEv.p : L.target;
      const kmh = Math.round(L.speed * 3.6);
      const keeperDived = kp && kp.dive && Math.abs(kp.dive.s) > 0;
      this.result = {
        result: r, goal: r === 'goal', speed: kmh, tech: L.tech, timing: L.timing.id, perfect: L.timing.id === 'perfect',
        zone: Shot.zoneOf(cross.x, cross.y), zoneIndex: Shot.zoneIndex(cross.x, cross.y),
        topCorner: r === 'goal' && Math.abs(cross.x) > 2.4 && cross.y > 1.6,
        panenka: r === 'goal' && L.tech === 'picada' && Math.abs(cross.x) < 1.5,
        curlGoal: r === 'goal' && L.tech === 'rosca', offPost: r === 'goal' && b.hitWood, keeperTouched: b.touchedKeeper,
        keeperDived, shooterHuman: !!cfg.shooterHuman, keeperHuman: !!(kp && kp.human), aim: L.aim,
      };
      const R = this.result;
      if (r === 'goal') {
        sc.shooter.celebrate(); if (kp) kp.dejected();
        A().cheer(cfg.pressure > 0.5 ? 1.3 : 1);
        sc.crowdReact('cheer', cfg.side || 'A');
        sc.boardMsg = 'GOOOL';
        sc.flash = 0.25;
        this.popup(R.panenka ? '¡GOL DE PICADITA!' : R.topCorner ? '¡GOL A LA ESCUADRA!' : R.offPost ? '¡GOL AL PALO!' : '¡GOOOL!', 'goal');
        if (cfg.shooterHuman && this.cfg.effect && this.cfg.effect.colors.length) sc.burst('spark', b.p, 30, { speed: 3, colors: this.cfg.effect.colors });
      } else {
        sc.shooter.dejected();
        if (r === 'saved') {
          if (kp) { if (kp.mode !== 'dive' && kp.mode !== 'fallen') kp.celebrate(); else setTimeout(() => kp.celebrate(), 900); }
          A().groan();
          sc.crowdReact('cheer', cfg.side === 'B' ? 'A' : 'B');
          this.popup(kp && kp.hold ? '¡ATAJADA!' : '¡TAPADÓN!', 'save');
        } else {
          A().groan();
          sc.crowdReact('groan', cfg.side || 'A');
          if (r === 'miss') this.popup(L.target.y > W.GOAL_H ? '¡A LAS NUBES!' : '¡AFUERA!', 'miss');
        }
      }
      if (cfg.shooterHuman && r === 'goal') this.popup(kmh + ' KM/H', 'speed');
      A().setCrowd(0.3);
      this.setState('react');
      if (cfg.onResult) cfg.onResult(R, this);
    }
    finished() { return this.state === 'done'; }
  }
  PL.KickRunner = KickRunner;

  /* ===================================================================== */
  /* Shootout: a full penalty shoot-out between two teams                   */
  /* ===================================================================== */
  class Shootout {
    /* cfg: { teamA, teamB, stadium, kicks, suddenOnly, preset, control:{A:'p1'|'p2'|'ai', B:...}, keeperHuman:{A,B}, title, isFinal, onEnd } */
    constructor(scene, cfg) {
      this.scene = scene; this.cfg = cfg;
      this.kicks = cfg.suddenOnly ? 0 : cfg.kicks || 5;
      this.res = { A: [], B: [] };
      if (cfg.preset) { this.res.A = cfg.preset.a.slice(); this.res.B = cfg.preset.b.slice(); }
      this.turn = 'A'; this.state = 'intro'; this.st = 0; this.runner = null; this.done = false;
      this.stats = { A: newStats(), B: newStats() };
      this.history = { A: [], B: [] };
      this.shooterIdx = { A: 0, B: 0 };
      const st = cfg.stadium;
      const wind = st.wind ? U.rand(st.wind[0], st.wind[1]) : 0, wa = U.rand(0, Math.PI * 2);
      this.cond = { rain: !!st.rain, wind: { x: Math.cos(wa) * wind, z: Math.sin(wa) * wind * 0.4 }, windSpeed: wind, windAng: wa };
      scene.setStadium(st);
      scene.setTeams(cfg.teamA.kit.p, cfg.teamB.kit.p);
      scene.setCamera('wide');
      scene.crowdReact('wave', null);
      scene.ball.reset();
      scene.boardMsg = null;
      scene.shooter = null; scene.keeper = null; scene.extras = [];
      scene.ballSkin = D.itemById('balls', S().equipped.ball) || D.BALLS[0];
      scene.effect = D.EFFECTS[0];
      A().playMusic('tension');
      A().setCrowd(0.45);
      A().sfx('whistle', { kind: 'long' });
      this.updateScreen();
      if (PL.HUD) PL.HUD.matchStart(this);
    }
    get captures() { return true; }
    score(side) { return this.res[side].filter((r) => r === 'goal').length; }
    taken(side) { return this.res[side].length; }
    inSudden() {
    const ta = this.taken('A'), tb = this.taken('B'), K = this.kicks;
    return ta > K || tb > K || (ta === K && tb === K && this.score('A') === this.score('B'));
  }
    round() { return Math.max(this.taken('A'), this.taken('B')) + (this.turn === 'A' ? 1 : 0); }
    decided() {
      const a = this.score('A'), b = this.score('B'), ta = this.taken('A'), tb = this.taken('B'), K = this.kicks;
      if (ta <= K && tb <= K && !(ta === K && tb === K)) {
        const remA = K - ta, remB = K - tb;
        if (a > b + remB) return 'A';
        if (b > a + remA) return 'B';
        return null;
      }
      if (ta === tb && a !== b) return a > b ? 'A' : 'B';
      return null;
    }
    pressureFor(side) {
      let p = this.cfg.isFinal ? 0.3 : 0.1;
      if (this.inSudden() || (this.cfg.suddenOnly)) p += 0.4;
      const other = side === 'A' ? 'B' : 'A';
      const K = this.kicks, me = this.taken(side);
      if (me >= K - 2) p += 0.15;
      if (this.score(other) > this.score(side)) p += 0.15;
      return U.clamp(p, 0, 1);
    }
    teamCtl(side) { return this.cfg.control[side]; }
    nextKick() {
      const side = this.turn, other = side === 'A' ? 'B' : 'A';
      const team = side === 'A' ? this.cfg.teamA : this.cfg.teamB;
      const opp = side === 'A' ? this.cfg.teamB : this.cfg.teamA;
      const humanShooter = this.teamCtl(side) !== 'ai';
      let shooter;
      if (humanShooter && team.hero) shooter = team.hero;
      else { shooter = team.shooters[this.shooterIdx[side] % team.shooters.length]; this.shooterIdx[side]++; }
      const keeperHuman = this.teamCtl(other) !== 'ai' && this.cfg.keeperHuman[other] && !S().settings.autoKeeper;
      const eq = team.equip || {};
      const oeq = opp.equip || {};
      const pressure = this.pressureFor(side);
      const sc = this.scene;
      sc.setCamera('penalty');
      sc.boardMsg = null;
      this.runner = new KickRunner(sc, {
        shooter, shooterKit: team.kit, boots: eq.boots, level: team.heroLevel || 1, shooterHuman: humanShooter, side,
        keeper: opp.keeper, keeperHuman, gloves: oeq.gloves, keeperBonus: oeq.gloves ? oeq.gloves.bonus : null,
        cond: this.cond, pressure, history: this.history[side], effect: eq.effect,
        hideAimFromKeeper: humanShooter && keeperHuman && this.cfg.control[other] !== 'ai' && this.cfg.control[other] !== this.cfg.control[side],
        onResult: (r) => this.onKickResult(side, r),
      });
      sc.effect = eq.effect || D.EFFECTS[0];
      sc.crowdReact('tense', null);
      if (pressure > 0.5) A().sfx('heart');
      this.state = 'kick'; this.st = 0;
      if (PL.HUD) PL.HUD.kickStart(this, side, shooter, opp.keeper, humanShooter, keeperHuman, pressure);
    }
    onKickResult(side, r) {
      this.res[side].push(r.result);
      this.history[side].push(r.zone);
      const st = this.stats[side], other = side === 'A' ? 'B' : 'A', ost = this.stats[other];
      st.kicks++; st.maxSpeed = Math.max(st.maxSpeed, r.speed);
      if (r.goal) { st.goals++; if (r.topCorner) st.topCorners++; if (r.panenka) st.panenkas++; if (r.curlGoal) st.curlGoals++; if (r.tech === 'potente') st.powerGoals++; if (r.offPost) st.offPost++; }
      else { st.misses++; if (r.result === 'post') st.posts++; if (r.result === 'saved') ost.saves++; }
      if (r.perfect) st.perfect++;
      st.zones.push(r.zoneIndex);
      if (r.shooterHuman) st.humanKicks.push(r);
      this.updateScreen();
      if (PL.HUD) PL.HUD.score(this);
    }
    updateScreen() {
      const a = this.cfg.teamA, b = this.cfg.teamB;
      this.scene.screenInfo = { a: a.short, b: b.short, sa: this.score('A'), sb: this.score('B'), line: this.inSudden() ? 'MUERTE SUBITA' : 'RONDA ' + Math.min(this.kicks || 1, this.round()) };
    }
    update(dt) {
      this.st += dt;
      const sc = this.scene;
      switch (this.state) {
        case 'intro':
          if (this.st > 3.2 || (this.st > 0.6 && (I.pressed('action') || I.pressed('tap')))) {
            I.reset();
            if (PL.HUD) PL.HUD.transition();
            this.nextKick();
          }
          break;
        case 'kick': {
          const r = this.runner;
          r.update(dt);
          if (r.finished()) {
            const w = this.decided();
            if (w) { this.finish(w); break; }
            this.turn = this.turn === 'A' ? 'B' : 'A';
            this.updateScreen();
            if (PL.HUD) PL.HUD.transition(this.inSudden() && this.turn === 'A' && this.taken('A') === this.kicks ? 'MUERTE SÚBITA' : null);
            this.nextKick();
          }
          break;
        }
        case 'end':
          if (this.runner) this.runner.update(dt);
          if (this.st > 1.2 && this.st < 4 && this.fireworks && Math.random() < dt * 3) sc.firework();
          if (this.st > 4.8 && !this.done) {
            this.done = true;
            if (this.cfg.onEnd) this.cfg.onEnd(this.summary());
          }
          break;
      }
    }
    timeScale() { return this.state === 'kick' && this.runner ? this.runner.timeScale : 1; }
    finish(w) {
      this.winner = w;
      this.state = 'end'; this.st = 0;
      const sc = this.scene;
      A().sfx('whistle', { kind: 'triple' });
      const humanWon = this.teamCtl(w) !== 'ai';
      const anyHuman = this.teamCtl('A') !== 'ai' || this.teamCtl('B') !== 'ai';
      sc.crowdReact('cheer', w);
      A().cheer(1.4);
      if (!anyHuman || humanWon) { sc.confetti(180); A().playMusic('victory'); } else A().playMusic('defeat');
      this.fireworks = (this.cfg.isFinal || sc.stadium.st.kind === 'temple') && (humanWon || !anyHuman);
      sc.boardMsg = (w === 'A' ? this.cfg.teamA.short : this.cfg.teamB.short) + ' GANA';
      this.scene.screenInfo.flash = w === 'A' ? this.cfg.teamA.short + ' GANA' : this.cfg.teamB.short + ' GANA';
      if (PL.HUD) PL.HUD.matchEnd(this, w);
    }
    summary() {
      const human = this.teamCtl('A') !== 'ai' ? 'A' : 'B';
      const st = this.stats[human];
      return {
        winner: this.winner, scoreA: this.score('A'), scoreB: this.score('B'), resA: this.res.A, resB: this.res.B,
        stats: this.stats, human, won: this.winner === human, sudden: this.taken('A') > this.kicks || !!this.cfg.suddenOnly,
        goals: st.goals, misses: st.misses, perfect: st.perfect, panenkas: st.panenkas, topCorners: st.topCorners, saves: st.saves,
        maxSpeed: st.maxSpeed, cfg: this.cfg,
      };
    }
    abort() { A().stopMusic(); }
  }
  function newStats() { return { kicks: 0, goals: 0, misses: 0, posts: 0, saves: 0, perfect: 0, panenkas: 0, topCorners: 0, curlGoals: 0, powerGoals: 0, offPost: 0, maxSpeed: 0, zones: [], humanKicks: [] }; }
  PL.Shootout = Shootout;

  /* ===================================================================== */
  /* Training drills                                                        */
  /* ===================================================================== */
  function targetExtra(x, y, r) {
    return {
      x, y, r, hit: 0,
      drawFlat(f, cam, t) {
        const p = cam.project({ x: this.x, y: this.y, z: W.GOAL_Z - 0.05 });
        const R = this.r * p.s;
        const C = PL.C;
        const cols = [C.hex('#ff3b3b'), C.hex('#ffffff'), C.hex('#ff3b3b'), C.hex('#ffe14d')];
        for (let y = Math.floor(p.y - R); y <= p.y + R; y++) for (let x = Math.floor(p.x - R); x <= p.x + R; x++) {
          const d = Math.hypot(x + 0.5 - p.x, y + 0.5 - p.y) / R;
          if (d > 1) continue;
          const c = this.hit > 0 ? (Math.floor(t * 12) % 2 ? C.hex('#36e07a') : C.WHITE) : cols[Math.min(3, Math.floor((1 - d) * 4))];
          f.px(x, y, d > 0.9 ? C.OUT : c);
        }
      },
    };
  }
  function dummyExtra(x, z, h = 1) {
    const app = { skin: '#e0b030', hair: 'bald', hairC: '#c09020', kit: { p: '#e0b030', s: '#16161c', pattern: 'hoops', shorts: '#e0b030', socks: '#e0b030' }, boots: { color: '#16161c' }, height: h, number: 0 };
    const P = PL.Pose.make({ x, z, yaw: Math.PI, saL: 0.1, saR: 0.1, eL: 0.1, eR: 0.1 });
    const J = PL.fk(P, h);
    const caps = [{ a: J.footL, b: J.head, r: 0.24, part: 'dummy', static: true }];
    return { P, app, shadow: true, caps };
  }

  class Training {
    /* cfg: { drill:'free'|'targets'|'power'|'curl', tier, stadium, duration, goal, onEnd } */
    constructor(scene, cfg) {
      this.scene = scene; this.cfg = cfg; this.drill = cfg.drill;
      this.score = 0; this.shots = 0; this.best = 0; this.time = cfg.duration || (this.drill === 'free' ? 0 : 60);
      this.state = 'run'; this.st = 0; this.ended = false;
      scene.setStadium(cfg.stadium); scene.setTeams('#1e5bd8', '#1e5bd8'); scene.setCamera('penalty'); scene.crowdReact('idle');
      scene.boardMsg = null; scene.screenInfo = { a: 'PRAC', b: 'TICA', sa: 0, sb: 0, line: 'ENTRENAMIENTO' };
      scene.ballSkin = D.itemById('balls', S().equipped.ball) || D.BALLS[0];
      this.cond = { rain: !!cfg.stadium.rain, wind: { x: 0, z: 0 } };
      this.targets = [];
      this.equip = PL.Game.playerEquip();
      this.hero = PL.Game.currentHero();
      A().playMusic('menu'); A().setCrowd(0.12);
      this.newKick();
      if (PL.HUD) PL.HUD.trainingStart(this);
    }
    get captures() { return true; }
    spawnTargets() {
      this.targets = [];
      const n = this.drill === 'curl' ? 1 : 3;
      for (let i = 0; i < n; i++) {
        let x, y;
        if (this.drill === 'curl') { this.curlSide = U.chance(0.5) ? -1 : 1; x = this.curlSide * U.rand(1.6, 2.8); y = U.rand(0.6, 1.8); }
        else { x = U.rand(-3.1, 3.1); y = U.rand(0.45, 2.0); if (this.targets.some((t) => Math.hypot(t.x - x, t.y - y) < 1.2)) { i--; continue; } }
        this.targets.push(targetExtra(x, y, 0.42));
      }
    }
    newKick() {
      const sc = this.scene;
      const tierKeeper = this.drill === 'power' ? D.KEEPERS[0] : this.drill === 'free' && this.cfg.tier ? U.choice(D.KEEPERS.filter((k) => k.tier === this.cfg.tier)) : null;
      if (this.drill === 'targets' || this.drill === 'curl') if (!this.targets.length || this.targets.every((t) => t.hit)) this.spawnTargets();
      let extras = this.targets.slice(), obstacles = [];
      if (this.drill === 'curl') {
        const t = this.targets[0];
        const dz = 7.6, dx = t.x * (dz / 11) * 0.95;
        const dm = dummyExtra(dx, dz, 1.05), dm2 = dummyExtra(dx - Math.sign(t.x) * 0.55, dz, 1.0);
        extras = extras.concat([dm, dm2]);
        obstacles = dm.caps.concat(dm2.caps);
      }
      this.runner = new KickRunner(sc, {
        shooter: this.hero.prof, shooterKit: this.equip.kit, boots: this.equip.boots, level: this.hero.level, shooterHuman: true, side: 'A',
        keeper: tierKeeper, keeperHuman: false, cond: this.cond, pressure: 0, history: [], extras, obstacles, fast: true, effect: this.equip.effect,
        onFlight: (ball) => this.checkTargets(ball),
        onResult: (r) => this.onResult(r),
      });
      sc.effect = this.equip.effect;
    }
    checkTargets(ball) {
      if (!ball.crossedTargets && ball.p.z >= W.GOAL_Z - 0.1) {
        ball.crossedTargets = true;
        for (const t of this.targets) if (!t.hit && Math.hypot(ball.p.x - t.x, ball.p.y - t.y) < t.r + W.BALL_R) {
          if (this.drill === 'curl' && !(this.runner.launch && this.runner.launch.tech === 'rosca')) continue;
          t.hit = 1; this.score++; A().sfx('coin'); this.scene.burst('spark', ball.p, 16, { speed: 2.5 }); this.runner.popup('¡DIANA! +1', 'goal');
        }
      }
    }
    onResult(r) {
      this.shots++;
      S().stats.trainingShots++;
      if (this.drill === 'power' && r.goal) { if (r.speed > this.score) this.score = r.speed; }
      if (this.drill === 'free' && r.goal) this.score++;
      this.scene.screenInfo.sa = this.score; this.scene.screenInfo.sb = this.shots;
    }
    update(dt) {
      this.st += dt;
      if (this.ended) return;
      if (this.time > 0 && this.drill !== 'free' && this.drill !== 'power') {
        this.time -= dt;
        if (this.time <= 0) { this.time = 0; this.finish(); return; }
      }
      this.runner.update(dt);
      if (this.runner.finished()) {
        if (this.drill === 'power' && this.shots >= 10) { this.finish(); return; }
        this.newKick();
      }
      if (PL.HUD) PL.HUD.trainingTick(this);
    }
    timeScale() { return 1; }
    finish() {
      this.ended = true;
      const rec = S().records;
      const key = { targets: 'targets', power: 'power', curl: 'curl' }[this.drill];
      let record = false;
      if (key && this.score > (rec[key] || 0)) { rec[key] = this.score; record = true; }
      PL.Save.save();
      if (this.cfg.onEnd) this.cfg.onEnd({ score: this.score, shots: this.shots, drill: this.drill, record });
    }
    abort() {}
  }
  PL.Training = Training;

  /* ===================================================================== */
  /* Attract mode (menu background): AI vs AI kicks                         */
  /* ===================================================================== */
  class Attract {
    constructor(scene) {
      this.scene = scene;
      const st = D.stadiumById(U.choice(['municipal', 'luna', 'continental', 'templo', 'tormenta']));
      scene.setStadium(st); scene.setTeams('#1e5bd8', '#d8262e'); scene.setCamera('penalty'); scene.crowdReact('idle');
      scene.boardMsg = null; scene.screenInfo = { a: 'PEN', b: 'LEG', sa: 0, sb: 0, line: 'PENALTY LEGENDS' };
      scene.ballSkin = D.BALLS[0]; scene.effect = D.EFFECTS[0];
      this.cond = { rain: !!st.rain, wind: { x: 0, z: 0 } };
      this.newKick();
    }
    get captures() { return false; }
    newKick() {
      const sh = U.choice(D.SHOOTERS), kp = U.choice(D.KEEPERS);
      const kit = U.choice(D.KITS);
      this.runner = new KickRunner(this.scene, { shooter: sh, shooterKit: kit, shooterHuman: false, keeper: kp, keeperHuman: false, cond: this.cond, pressure: 0.2, history: [], side: 'A', quiet: true });
    }
    update(dt) {
      this.runner.update(dt);
      if (this.runner.finished()) this.newKick();
    }
    timeScale() { return 1; }
    abort() {}
  }
  PL.Attract = Attract;
})(typeof window !== 'undefined' ? window : globalThis);
