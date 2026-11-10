/* PENALTY LEGENDS — game controller: main loop, resolution management, mode orchestration and rewards flow */
(function (G) {
  'use strict';
  const PL = G.PL, U = PL.U, D = PL.Data;
  const S = () => PL.Save.data;
  const A = () => PL.Audio;

  PL.debug = PL.debug || { auto: false };
  // Autopilot (used by automated QA): plays human turns with plausible random inputs
  const proto = PL.KickRunner.prototype;
  const origUpdate = proto.update;
  proto.update = function (dt) {
    if (PL.debug.auto) {
      const kp = this.scene.keeper;
      if (this.state === 'aim' && this.st > 0.12) {
        this.tech = U.choice(D.TECH_ORDER); this.scene.shooter.tech = this.tech;
        this.aim = this.tech === 'picada' ? { x: U.rand(-0.5, 0.5), y: 1.6 } : { x: U.choice([-1, 1]) * U.rand(1.4, 3.3), y: U.rand(0.3, 2.1) };
        this.curl = this.tech === 'rosca' ? U.rand(-1, 1) : 0;
        this.setState('power'); this.power = U.rand(0.6, 1.0); this.startRunup();
      }
      if (this.state === 'runup' && this.pressT == null && this.st >= this.runDur - 0.03) this.press(this.st + U.rand(-0.05, 0.05));
      if (this.state === 'aiRunup' && kp && kp.human && !kp.committed && this.st > this.runDur - 0.1) kp.commandDive(U.rand(-3, 3), U.rand(0.3, 2));
    }
    return origUpdate.call(this, dt);
  };

  const Game = (PL.Game = {
    activity: null, mode: null, paused: false, fps: 0, lastCtx: null,
    init() {
      PL.Save.load();
      this.canvas = document.getElementById('game');
      this.stage = document.getElementById('stage');
      this.scene = new PL.Scene(this.canvas);
      PL.Input.attach(this.canvas);
      PL.UI.init();
      PL.HUD.clear();
      this.resize();
      G.addEventListener('resize', () => this.resize());
      document.addEventListener('visibilitychange', () => { if (document.hidden && this.activity && this.activity.captures && !this.paused) this.pause(); });
      document.addEventListener('pointerdown', () => A().init(), { once: true });
      document.addEventListener('keydown', () => A().init(), { once: true });
      this.activity = new PL.Attract(this.scene);
      PL.UI.show('title');
      this.fpsEl = document.createElement('div'); this.fpsEl.className = 'fps'; document.getElementById('app').appendChild(this.fpsEl);
      this.last = performance.now();
      requestAnimationFrame((t) => this.loop(t));
    },
    resize() {
      const app = document.getElementById('app');
      const r = app.getBoundingClientRect();
      const cw = Math.max(200, r.width), ch = Math.max(150, r.height);
      const aspect = cw / ch;
      let W, H;
      if (aspect >= 1.15) { H = 270; W = Math.round(U.clamp(270 * aspect, 400, 600)); }
      else { W = 320; H = Math.round(U.clamp(320 / aspect, 270, 560)); }
      W -= W % 2; H -= H % 2;
      if (W !== this.scene.W || H !== this.scene.H) this.scene.resize(W, H);
      const sc = Math.min(cw / W, ch / H);
      this.stage.style.width = Math.floor(W * sc) + 'px';
      this.stage.style.height = Math.floor(H * sc) + 'px';
    },
    loop(t) {
      const dt = Math.min(0.05, Math.max(0, (t - this.last) / 1000));
      this.last = t;
      try {
        const I = PL.Input;
        if (I.pressed('pause') && this.activity && this.activity.captures) { if (this.paused) this.resume(); else this.pause(); }
        if (!this.paused && this.activity) {
          const ts = this.activity.timeScale ? this.activity.timeScale() : 1;
          this.activity.update(dt * ts);
          this.scene.update(dt * ts);
          if (this.activity.captures) S().stats.playTime += dt;
        }
        this.scene.render(this.paused ? 0 : dt);
        PL.HUD.update();
        I.endFrame();
      } catch (e) { console.error(e); }
      this.fps = this.fps * 0.95 + (dt > 0 ? 1 / dt : 60) * 0.05;
      if (S().settings.showFps) this.fpsEl.textContent = Math.round(this.fps) + ' FPS · ' + this.scene.W + 'x' + this.scene.H; else if (this.fpsEl.textContent) this.fpsEl.textContent = '';
      requestAnimationFrame((tt) => this.loop(tt));
    },
    runner() { const a = this.activity; return a && a.captures && a.runner ? a.runner : null; },
    charLevel(id) { return id === 'custom' ? 1 : S().charLevels[id] || 1; },
    heroById(id) {
      const s = S();
      if (id === 'custom' && s.career.created) return { prof: s.career.hero, level: 1 };
      const p = D.shooterById(id) || D.SHOOTERS[0];
      return { prof: p, level: this.charLevel(p.id) };
    },
    currentHero() { return this.heroById(S().equipped.char); },
    playerEquip() {
      const e = S().equipped;
      return {
        kit: D.itemById('kits', e.kit) || D.KITS[0], boots: D.itemById('boots', e.boots) || D.BOOTS[0], gloves: D.itemById('gloves', e.gloves) || D.GLOVES[0],
        effect: D.itemById('effects', e.effect) || D.EFFECTS[0], ball: D.itemById('balls', e.ball) || D.BALLS[0],
      };
    },
    opponent(tier, excludeKit) {
      const pool = D.CLUBS.filter((c) => c.kit.p !== excludeKit);
      const base = U.choice(pool);
      const team = D.buildTeam(base, tier);
      const named = D.KEEPERS.filter((k) => k.tier === tier);
      const k = U.choice(named);
      team.keeper = Object.assign({}, k, { kit: { p: k.kit.p, s: k.kit.s } });
      return team;
    },
    // ----- match plumbing -----
    beginMatch(cfg, ctx) {
      this.abortActivity();
      PL.UI.hide();
      PL.Input.reset();
      this.mode = ctx.mode; this.lastCtx = ctx;
      cfg.onEnd = (sum) => this.afterMatch(sum, ctx);
      if (PL.debug.auto) cfg.autoIntro = true;
      this.activity = new PL.Shootout(this.scene, cfg);
      if (PL.debug.auto) this.activity.st = 3.1;
    },
    abortActivity() { if (this.activity && this.activity.abort) this.activity.abort(); this.paused = false; PL.UI.closeModal(); },
    afterMatch(sum, ctx) {
      let rewards = PL.Progress.awardMatch(sum, { tier: ctx.tier, mode: ctx.mode, modeName: ctx.modeName, opp: ctx.opp });
      rewards.notes = [];
      let next = ctx.next || 'main';
      if (ctx.onEnd) { const extra = ctx.onEnd(sum, rewards) || {}; if (extra.next) next = extra.next; }
      if (rewards.levels && rewards.levels.length) A().sfx('levelup');
      PL.Save.saveNow();
      PL.UI.show('results', { sum, rewards, next, retry: !!ctx.retry, mp: ctx.mode === 'mp', label: ctx.modeName });
    },
    retry() { if (this.lastCtx && this.lastCtx.retry) this.lastCtx.retry(); },
    toMenu(to = 'main') {
      this.abortActivity();
      PL.HUD.clear();
      this.mode = null;
      this.activity = new PL.Attract(this.scene);
      A().playMusic('menu'); A().setCrowd(0.25);
      PL.UI.show(to);
    },
    quit() {
      const a = this.activity;
      if (a instanceof PL.Shootout && !a.done) {
        PL.Progress.awardMatch({ winner: 'B', scoreA: a.score('A'), scoreB: a.score('B'), stats: a.stats, human: 'A', won: false, sudden: false }, { tier: (this.lastCtx || {}).tier || 1, mode: this.mode === 'mp' ? 'mp' : 'abandon', modeName: 'Abandonado', opp: a.cfg.teamB.name });
        if (this.lastCtx && this.lastCtx.onAbandon) this.lastCtx.onAbandon();
      }
      if (a instanceof PL.Training && !a.ended) { a.ended = true; }
      const to = this.lastCtx && this.lastCtx.next ? this.lastCtx.next : 'main';
      this.toMenu(to);
    },
    pause() {
      if (this.paused) return;
      this.paused = true;
      const s = S().settings;
      PL.UI.modal(`<h2>Pausa</h2><div class="col">
        <button class="btn primary" data-act="resume">Reanudar</button>
        <label class="col" style="gap:2px"><span class="lbl">Volumen general</span><input type="range" min="0" max="1" step="0.05" value="${s.master}" data-inp="vol" data-k="master"></label>
        <label class="col" style="gap:2px"><span class="lbl">Música</span><input type="range" min="0" max="1" step="0.05" value="${s.music}" data-inp="vol" data-k="music"></label>
        <div class="panel" style="font-size:.9rem">${PL.UI && document.querySelector('#screens') ? '' : ''}<div class="lbl">Recordá</div><div class="muted" style="font-weight:600">Pulsá cuando el anillo se cierre: un golpeo perfecto quita casi todo el error. Los arqueros analistas recuerdan hacia dónde pateás.</div></div>
        <button class="btn red" data-act="quitask">Abandonar</button></div>`);
    },
    resume() { this.paused = false; PL.UI.closeModal(); PL.Input.reset(); },

    // ----- modes -----
    startQuick(q) {
      const hero = this.heroById(q.char);
      const A_ = PL.Progress.playerTeam(hero);
      const B_ = this.opponent(q.tier, A_.kit.p);
      const st = D.stadiumById(q.stadium);
      this.beginMatch({ teamA: A_, teamB: B_, stadium: st, kicks: q.kicks, control: { A: 'p1', B: 'ai' }, keeperHuman: { A: true, B: false }, title: 'Partido rápido' },
        { mode: 'quick', modeName: 'Partido rápido', tier: q.tier, opp: B_.name, retry: () => this.startQuick(q), next: 'quick' });
    },
    startMP(q) {
      const mk = (n, cid, kid) => {
        const hero = this.heroById(cid);
        const kit = D.itemById('kits', kid) || D.KITS[n - 1];
        const gk = PL.Progress.playerKeeper();
        gk.name = 'Arquero J' + n; gk.look = Object.assign({}, gk.look, { skin: D.SKIN[n === 1 ? 1 : 4], hair: n === 1 ? 'short' : 'buzz' });
        gk.kit = n === 1 ? { p: '#2fbf71', s: '#0f3d26' } : { p: '#ff7a1a', s: '#2a1100' };
        if (q.gk === 'ai') Object.assign(gk, D.keeperById(n === 1 ? 'kovac' : 'berg'), { kit: gk.kit });
        return { id: 'p' + n, name: 'Jugador ' + n, short: 'J' + n, kit: { p: kit.p, s: kit.s, pattern: kit.pattern, shorts: kit.shorts, socks: kit.socks }, hero: hero.prof, heroLevel: hero.level, keeper: gk, equip: { kit, boots: D.BOOTS[0], gloves: D.GLOVES[0], effect: D.EFFECTS[0] }, shooters: [] };
      };
      const tA = mk(1, q.c1, q.k1), tB = mk(2, q.c2, q.k2);
      const hk = q.gk === 'human';
      this.beginMatch({ teamA: tA, teamB: tB, stadium: D.stadiumById(q.stadium), kicks: q.kicks, control: { A: 'p1', B: 'p2' }, keeperHuman: { A: hk, B: hk }, title: 'Duelo local' },
        { mode: 'mp', modeName: '2 Jugadores', tier: 2, opp: 'Jugador 2', retry: () => this.startMP(q), next: 'mp' });
    },
    playTournamentMatch() {
      const t = S().tournament;
      if (!t || t.champion) return;
      const pm = PL.Tournament.playerMatch(t);
      const oppId = pm.a === 'player' ? pm.b : pm.a;
      const B_ = PL.Tournament.team(t, oppId, t.round);
      const A_ = PL.Progress.playerTeam();
      const st = D.stadiumById(t.def.stadiums[Math.min(t.round, t.def.stadiums.length - 1)]);
      const isFinal = t.round === t.bracket.length - 1;
      const tier = t.def.tiers[Math.min(t.round, t.def.tiers.length - 1)];
      const rname = PL.Tournament.roundName(t, t.round);
      this.beginMatch({ teamA: A_, teamB: B_, stadium: st, kicks: t.def.kicks, suddenOnly: t.def.suddenOnly, control: { A: 'p1', B: 'ai' }, keeperHuman: { A: true, B: false }, title: t.name + ' · ' + rname, isFinal },
        {
          mode: 'tournament', modeName: t.name + ' · ' + rname, tier, opp: B_.name, next: 'bracket',
          onEnd: (sum, rewards) => {
            PL.Tournament.recordPlayer(t, sum);
            if (t.champion || t.eliminated) {
              const fr = PL.Tournament.finishRewards(t);
              rewards.xp += fr.xp; rewards.coins += fr.coins; rewards.unlocks = (rewards.unlocks || []).concat(fr.unlocks || []);
              rewards.levels = (rewards.levels || []).concat(fr.levels || []);
              rewards.notes.push(t.champion === 'player' ? '¡CAMPEÓN DE ' + t.name.toUpperCase() + '!' : 'Eliminado en ' + rname.toLowerCase());
              if (t.career) {
                const ev = this.findCareerEvent(t.career);
                if (ev) { const cr = PL.Career.complete(ev, t.champion === 'player'); this.mergeCareer(rewards, cr); }
              }
            } else rewards.notes.push('Avanzás a ' + PL.Tournament.roundName(t, t.round).toLowerCase());
          },
          onAbandon: () => { PL.Tournament.recordPlayer(t, { won: false, scoreA: 0, scoreB: 1 }); },
        });
    },
    closeTournament() {
      const t = S().tournament;
      const to = t && t.career ? 'career' : 'tournaments';
      S().tournament = null; PL.Save.save();
      PL.UI.show(to);
    },
    findCareerEvent(id) { for (const t of D.CAREER) for (const e of t.events) if (e.id === id) return e; return null; },
    mergeCareer(rewards, cr) {
      rewards.rep = (rewards.rep || 0) + cr.rep;
      rewards.unlocks = (rewards.unlocks || []).concat(cr.unlocks || []);
      if (cr.coins) rewards.coins += cr.coins;
      if (cr.tierUp) rewards.notes.push('¡ASCENSO! Nueva etapa: ' + D.CAREER[S().career.tier].name);
      if (cr.legend) rewards.notes.push('¡TE CONVERTISTE EN LEYENDA DEL PENAL!');
    },
    playCareerEvent(id) {
      const ev = this.findCareerEvent(id);
      if (!ev) return;
      if (ev.kind === 'cup') {
        const t = S().tournament;
        if (!t || t.career !== ev.id) PL.Tournament.create({ id: ev.id, name: ev.name, size: ev.size, tiers: ev.tiers, stadiums: ev.stadiums, pool: ev.pool, type: 'Copa de carrera', color: '#ffc93c', reward: { coins: 300 + ev.size * 80, xp: 300 + ev.size * 60 } }, ev.id);
        PL.UI.show('bracket');
        return;
      }
      const A_ = PL.Progress.playerTeam();
      const B_ = D.buildTeam(D.teamById(ev.team), ev.tier);
      this.beginMatch({ teamA: A_, teamB: B_, stadium: D.stadiumById(ev.stadium), kicks: 5, control: { A: 'p1', B: 'ai' }, keeperHuman: { A: true, B: false }, title: 'Carrera · ' + PL.Career.tierDef().name },
        { mode: 'career', modeName: 'Carrera', tier: ev.tier, opp: B_.name, next: 'career', onEnd: (sum, rewards) => { const cr = PL.Career.complete(ev, sum.won); this.mergeCareer(rewards, cr); } });
    },
    startChallenge(id) {
      const ch = D.CHALLENGES.find((c) => c.id === id);
      if (!ch) return;
      if (ch.type === 'training') { this.startTraining(ch.drill, 0, { challenge: ch }); return; }
      const A_ = PL.Progress.playerTeam();
      const B_ = this.opponent(ch.tier, A_.kit.p);
      this.beginMatch({ teamA: A_, teamB: B_, stadium: D.stadiumById(ch.stadium), kicks: 5, suddenOnly: !!ch.suddenOnly, preset: ch.preset, control: { A: 'p1', B: 'ai' }, keeperHuman: { A: true, B: false }, title: 'Desafío · ' + ch.name },
        {
          mode: 'challenge', modeName: 'Desafío: ' + ch.name, tier: ch.tier, opp: B_.name, next: 'challenges', retry: () => this.startChallenge(id),
          onEnd: (sum, rewards) => {
            const hs = sum.stats.A;
            const s = { won: sum.won, goals: hs.goals, misses: hs.misses, saves: hs.saves, topCorners: hs.topCorners, panenkas: hs.panenkas, perfect: hs.perfect };
            if (ch.check(s)) {
              const was = PL.Challenges.done(ch.id);
              const out = PL.Challenges.complete(ch);
              rewards.notes.push(was ? 'Desafío superado otra vez' : '¡DESAFÍO COMPLETADO! +' + ch.reward + ' monedas');
              rewards.unlocks = (rewards.unlocks || []).concat(out.unlocks || []);
              if (!was) A().sfx('unlock');
            } else rewards.notes.push('Desafío no superado: ' + ch.desc);
          },
        });
    },
    startTraining(drill, tier, opts = {}) {
      this.abortActivity();
      PL.UI.hide(); PL.Input.reset();
      this.mode = 'training';
      const ch = opts.challenge;
      const next = ch ? 'challenges' : 'training';
      this.lastCtx = { mode: 'training', next, retry: () => this.startTraining(drill, tier, opts) };
      this.activity = new PL.Training(this.scene, {
        drill, tier, stadium: D.stadiumById('escuela'),
        onEnd: (res) => {
          const rewards = { xp: Math.min(150, res.shots * 6 + (drill === 'power' ? 0 : res.score * 12)), coins: Math.min(120, res.score * (drill === 'power' ? 0.5 : 8)) | 0, notes: [], unlocks: [] };
          PL.Progress.give(rewards);
          if (ch) {
            if (res.score >= ch.goal) {
              const was = PL.Challenges.done(ch.id);
              const out = PL.Challenges.complete(ch);
              rewards.notes.push(was ? 'Objetivo cumplido otra vez' : '¡DESAFÍO COMPLETADO! +' + ch.reward + ' monedas');
              rewards.unlocks = rewards.unlocks.concat(out.unlocks || []);
            } else rewards.notes.push('Objetivo: ' + ch.goal + (drill === 'power' ? ' km/h' : '') + '. ¡Otra vez!');
          }
          PL.Save.saveNow();
          PL.UI.show('results', { training: res, rewards, retry: true, next });
        },
      });
    },
  });

  G.addEventListener('DOMContentLoaded', () => {
    try { Game.init(); } catch (e) { console.error(e); const d = document.getElementById('screens'); if (d) d.innerHTML = '<div class="screen"><h2>Error al iniciar</h2><pre>' + U.esc(e.stack || e) + '</pre></div>'; }
  });
})(typeof window !== 'undefined' ? window : globalThis);
