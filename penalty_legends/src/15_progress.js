/* PENALTY LEGENDS — progression: rewards & stats, headless AI-vs-AI simulation, tournaments, career, challenges */
(function (G) {
  'use strict';
  const PL = G.PL, U = PL.U, V = PL.V, W = PL.W, D = PL.Data, Shot = PL.Shot;
  const S = () => PL.Save.data;

  /* ---------------- headless penalty simulation (same physics + AI as the live game) ---------------- */
  function simKick(shooter, keeperProf, cond) {
    const kp = new PL.Keeper(keeperProf, { cond });
    const dec = PL.AIShooter.decide(shooter, { pressure: 0.3 });
    kp.preKick({ history: [], foot: shooter.foot, feint: 0, chipper: dec.tech === 'picada' });
    const dt = 1 / 60;
    for (let t = 0.6; t > 0; t -= dt) kp.update(dt, null, { timeToKick: t });
    let d = dec;
    if (kp.committed) d = PL.AIShooter.adapt(shooter, dec, kp.dive ? kp.dive.s : 0);
    const L = Shot.compute({ stats: shooter.stats, ability: shooter.ability, tech: d.tech, aim: d.aim, power: d.power, curl: d.curl, timingErr: d.timingErr, cond });
    const ball = new PL.Ball();
    ball.v = L.v; ball.w = L.w; ball.knuckle = L.knuckle; ball.inPlay = true;
    kp.onKick(kp.t);
    for (let i = 0; i < 240; i++) {
      kp.update(dt, ball, {});
      PL.Physics.step(ball, dt, { cond, keeper: kp });
      if (ball.inGoal) return 'goal';
      if (ball.events.some((e) => e.type === 'catch' || e.type === 'out')) break;
      if (ball.stopped) break;
      if ((ball.touchedKeeper || ball.hitWood) && ball.v.z < -0.5 && ball.p.z < 10) break;
    }
    return ball.inGoal ? 'goal' : ball.touchedKeeper ? 'saved' : ball.hitWood ? 'post' : 'miss';
  }
  function simShootout(tA, tB, kicks = 5, sudden = false, cond = { rain: false, wind: { x: 0, z: 0 } }) {
    const ra = [], rb = [];
    const K = sudden ? 0 : kicks;
    let i = 0;
    const sc = (r) => r.filter((x) => x === 'goal').length;
    while (i < 40) {
      ra.push(simKick(tA.shooters[i % 5], tB.keeper, cond));
      if (ra.length <= K && sc(ra) > sc(rb) + (K - rb.length)) break;
      if (ra.length <= K && sc(rb) > sc(ra) + (K - ra.length)) break;
      rb.push(simKick(tB.shooters[i % 5], tA.keeper, cond));
      if (rb.length <= K) {
        if (sc(ra) > sc(rb) + (K - rb.length) || sc(rb) > sc(ra) + (K - ra.length)) break;
        if (rb.length === K && sc(ra) !== sc(rb)) break;
      } else if (sc(ra) !== sc(rb)) break;
      i++;
    }
    const a = sc(ra), b = sc(rb);
    return { a, b, winner: a > b ? 'A' : 'B', ra, rb };
  }
  PL.Sim = { simKick, simShootout };

  /* ---------------- player team ---------------- */
  const Prog = (PL.Progress = {
    playerKeeper() {
      const lv = S().level;
      const b = U.clamp(46 + lv * 2.2, 46, 90);
      return { id: 'my_gk', name: 'Tu Arquero', nat: 'Argentina', tier: 2, style: 'balanced', stats: { ref: b, ant: b - 2, reach: b, agi: b, han: b + 2, com: b }, look: { skin: D.SKIN[2], hair: 'short', hairC: '#1b1410', beard: true, height: 1.04 }, kit: { p: '#2fbf71', s: '#0f3d26' } };
    },
    playerTeam(heroOverride) {
      const s = S();
      const hero = heroOverride || PL.Game.currentHero();
      const eq = PL.Game.playerEquip();
      const kit = Object.assign({}, eq.kit);
      const base = { id: 'player', name: s.career.created && hero.prof.id === 'custom' ? 'Club ' + hero.prof.name.split(' ').slice(-1)[0] : 'Penalty Legends FC', short: 'PLG', kit: { p: kit.p, s: kit.s, pattern: kit.pattern, shorts: kit.shorts, socks: kit.socks } };
      const shooters = [];
      for (let i = 0; i < 5; i++) shooters.push(D.makeShooter(9000 + i, 2, 'Argentina'));
      return Object.assign(base, { hero: hero.prof, heroLevel: hero.level, keeper: Prog.playerKeeper(), equip: eq, shooters });
    },
    /* award after a shoot-out. ctx: { tier, mode } */
    awardMatch(sum, ctx) {
      const s = S(), st = s.stats, tier = ctx.tier || 2;
      const hs = sum.stats[sum.human];
      const mult = 1 + tier * 0.25;
      const out = { xp: 0, coins: 0, levels: [], unlocks: [] };
      if (ctx.mode !== 'mp') {
        st.matches++;
        if (sum.won) { st.wins++; if (sum.sudden) st.suddenDeathWins++; if (tier >= 4) st.legendBeaten++; } else st.losses++;
      }
      for (const k of hs.humanKicks) {
        st.shots++;
        if (k.goal) { st.goals++; st.streakCur++; st.streakBest = Math.max(st.streakBest, st.streakCur); } else { st.streakCur = 0; if (k.result === 'post') st.posts++; else if (k.result === 'saved') st.saved++; else st.misses++; }
        if (k.perfect) st.perfect++;
        if (k.panenka) st.panenkas++;
        if (k.curlGoal) st.curlGoals++;
        if (k.topCorner) st.topCorners++;
        if (k.goal && k.tech === 'potente') st.powerGoals++;
        if (k.goal) st.bestSpeed = Math.max(st.bestSpeed, k.speed);
        st.zones[k.zoneIndex] = (st.zones[k.zoneIndex] || 0) + 1;
      }
      const oth = sum.human === 'A' ? 'B' : 'A';
      st.keeperFaced += sum.stats[oth].kicks;
      st.keeperSaves += hs.saves;
      out.xp = Math.round((50 + hs.goals * 15 + hs.saves * 25 + hs.perfect * 10 + (sum.won ? 110 : 0)) * mult);
      out.coins = Math.round((hs.goals * 10 + hs.saves * 15 + (sum.won ? 110 + tier * 35 : 25)) * mult);
      if (ctx.mode === 'mp') { out.xp = Math.round(out.xp * 0.5); out.coins = Math.round(out.coins * 0.4); }
      if (sum.won) s.legendPoints += Math.round(20 * tier * mult);
      s.history.unshift({ d: Date.now(), mode: ctx.modeName || ctx.mode, opp: ctx.opp || '', sa: sum.scoreA, sb: sum.scoreB, won: sum.won });
      s.history = s.history.slice(0, 25);
      Prog.give(out);
      return out;
    },
    give(out) {
      const s = S();
      s.coins += out.coins || 0;
      s.xp += out.xp || 0;
      while (s.xp >= D.xpToNext(s.level)) {
        s.xp -= D.xpToNext(s.level);
        s.level++;
        s.coins += 150;
        if (s.career.created) s.career.skillPoints += 3;
        (out.levels = out.levels || []).push(s.level);
      }
      PL.Save.save();
      return out;
    },
    unlock(cat, id) {
      const s = S();
      const list = s.unlocked[cat === 'chars' ? 'chars' : cat];
      if (!list || list.includes(id)) return false;
      list.push(id); PL.Save.save();
      return true;
    },
    unlockName(cat, id) {
      if (cat === 'chars') { const c = D.shooterById(id); return c ? 'Jugador: ' + c.name : id; }
      if (cat === 'stadiums') { const st = D.stadiumById(id); return 'Estadio: ' + (st ? st.name : id); }
      const it = D.itemById(cat, id);
      const lab = { kits: 'Equipación', boots: 'Botines', gloves: 'Guantes', effects: 'Efecto', balls: 'Balón' }[cat];
      return lab + ': ' + (it ? it.name : id);
    },
    applyUnlocks(map, out) {
      for (const cat in map) {
        const ids = Array.isArray(map[cat]) ? map[cat] : [map[cat]];
        for (const id of ids) if (Prog.unlock(cat, id)) (out.unlocks = out.unlocks || []).push(Prog.unlockName(cat, id));
      }
    },
    rank(rep) { let r = D.REP_RANKS[0]; for (const x of D.REP_RANKS) if (rep >= x.rep) r = x; return r; },
  });

  /* ---------------- tournaments ---------------- */
  function poolBases(pool) { return pool === 'nations' ? D.NATION_TEAMS : pool === 'legends' ? D.LEGEND_TEAMS : D.CLUBS; }
  const Tour = (PL.Tournament = {
    create(def, careerEvent) {
      const bases = U.shuffle(poolBases(def.pool).slice()).slice(0, def.size - 1);
      const slots = ['player'].concat(bases.map((b) => b.id));
      const order = [slots[0]].concat(U.shuffle(slots.slice(1)));
      const rounds = Math.round(Math.log2(def.size));
      const bracket = [];
      for (let r = 0; r < rounds; r++) bracket.push([]);
      for (let i = 0; i < order.length; i += 2) bracket[0].push({ a: order[i], b: order[i + 1], winner: null, sa: 0, sb: 0 });
      const t = { id: def.id || careerEvent, name: def.name, def: { size: def.size, tiers: def.tiers, stadiums: def.stadiums, kicks: def.kicks || 5, suddenOnly: !!def.suddenOnly, reward: def.reward || null, unlock: def.unlock || null, pool: def.pool, color: def.color || '#3fa7ff', type: def.type || 'Copa' }, round: 0, bracket, eliminated: false, champion: null, career: careerEvent || null, started: Date.now() };
      S().tournament = t; PL.Save.save();
      return t;
    },
    roundName(t, r) {
      const n = t.bracket.length - r;
      return n === 1 ? 'Final' : n === 2 ? 'Semifinal' : n === 3 ? 'Cuartos de final' : 'Octavos de final';
    },
    team(t, id, round) {
      if (id === 'player') return Prog.playerTeam();
      return D.buildTeam(D.teamById(id), t.def.tiers[Math.min(round, t.def.tiers.length - 1)]);
    },
    teamName(id) { return id === 'player' ? (S().career.created && PL.Game.currentHero().prof.id === 'custom' ? 'Tu equipo' : 'Penalty Legends FC') : (D.teamById(id) || { name: id }).name; },
    playerMatch(t) { return t.bracket[t.round].find((m) => m.a === 'player' || m.b === 'player'); },
    // record player match result and simulate the rest of the round
    recordPlayer(t, sum) {
      const m = Tour.playerMatch(t);
      const pIsA = m.a === 'player';
      m.sa = pIsA ? sum.scoreA : sum.scoreB; m.sb = pIsA ? sum.scoreB : sum.scoreA;
      m.winner = sum.won ? 'player' : pIsA ? m.b : m.a;
      Tour.simRound(t);
      if (!sum.won) { t.eliminated = true; while (t.round < t.bracket.length - 1) { Tour.advance(t); Tour.simRound(t); } }
      else if (t.round === t.bracket.length - 1) t.champion = 'player';
      else Tour.advance(t);
      if (t.eliminated && !t.champion) { const f = t.bracket[t.bracket.length - 1][0]; t.champion = f.winner; }
      PL.Save.save();
    },
    simRound(t) {
      const r = t.round, st = D.stadiumById(t.def.stadiums[Math.min(r, t.def.stadiums.length - 1)]);
      const cond = { rain: !!(st && st.rain), wind: { x: 0, z: 0 } };
      for (const m of t.bracket[r]) {
        if (m.winner) continue;
        const A = Tour.team(t, m.a, r), B = Tour.team(t, m.b, r);
        const res = PL.Sim.simShootout(A, B, t.def.kicks, t.def.suddenOnly, cond);
        m.sa = res.a; m.sb = res.b; m.winner = res.winner === 'A' ? m.a : m.b;
      }
    },
    advance(t) {
      const r = t.round;
      if (r >= t.bracket.length - 1) return;
      const winners = t.bracket[r].map((m) => m.winner);
      t.bracket[r + 1] = [];
      for (let i = 0; i < winners.length; i += 2) t.bracket[r + 1].push({ a: winners[i], b: winners[i + 1], winner: null, sa: 0, sb: 0 });
      t.round = r + 1;
    },
    finishRewards(t) {
      const out = { xp: 0, coins: 0, unlocks: [] };
      if (t.champion === 'player') {
        const rw = t.def.reward || { coins: 400 + t.bracket.length * 200, xp: 300 + t.bracket.length * 150 };
        out.coins = rw.coins; out.xp = rw.xp;
        const s = S();
        s.stats.tournamentsWon++;
        s.trophies.push({ id: t.id, name: t.name, d: Date.now(), color: t.def.color });
        s.legendPoints += 150 + t.bracket.length * 60;
        if (t.def.unlock) Prog.applyUnlocks(t.def.unlock, out);
      } else {
        const reached = t.round;
        out.coins = 60 + reached * 90; out.xp = 80 + reached * 80;
      }
      Prog.give(out);
      return out;
    },
  });

  /* ---------------- career ---------------- */
  const Career = (PL.Career = {
    create(o) {
      const c = S().career;
      c.created = true; c.tier = 0; c.reputation = 0; c.season = 1; c.events = {}; c.skillPoints = 5; c.finished = false;
      c.hero = {
        id: 'custom', name: o.name, nick: 'Promesa', nat: o.nat, num: o.num, foot: o.foot, stats: { pre: 46, pow: 46, con: 46, cur: 44, com: 44 },
        ability: 'none', price: 0, celeb: o.celeb || 'jump', look: { skin: o.skin, hair: o.hair, hairC: o.hairC, beard: !!o.beard, band: o.band || null, height: 1.0 },
      };
      S().equipped.char = 'custom';
      PL.Save.saveNow();
    },
    tierDef() { return D.CAREER[Math.min(S().career.tier, D.CAREER.length - 1)]; },
    eventDone(id) { const e = S().career.events[id]; return !!(e && e.won); },
    upgrade(stat) {
      const c = S().career;
      if (c.skillPoints <= 0 || c.hero.stats[stat] >= 99) return false;
      c.hero.stats[stat]++; c.skillPoints--; PL.Save.save();
      return true;
    },
    chooseAbility(id) { S().career.hero.ability = id; PL.Save.save(); },
    complete(ev, won, extra) {
      const c = S().career;
      const rec = c.events[ev.id] || { won: false, tries: 0 };
      rec.tries++;
      const out = { rep: 0, tierUp: false, unlocks: [], coins: 0, xp: 0 };
      if (won && !rec.won) { out.rep = 40 + c.tier * 30 + (ev.kind === 'cup' ? 60 : 0); rec.won = true; }
      else if (won) out.rep = 10;
      else out.rep = 5;
      c.events[ev.id] = rec;
      c.reputation += out.rep;
      const tierDef = D.CAREER[c.tier];
      if (tierDef && tierDef.events.every((e) => Career.eventDone(e.id))) {
        const unl = [{ stadiums: 'tormenta' }, { stadiums: 'luna', chars: 'valdes' }, { stadiums: 'continental' }, { stadiums: 'templo', kits: 'k_black' }, { chars: 'quiroga', kits: 'k_legend', effects: 'fx_gold' }][c.tier];
        if (unl) Prog.applyUnlocks(unl, out);
        out.coins = 500 + c.tier * 400;
        Prog.give({ coins: out.coins });
        if (c.tier < D.CAREER.length - 1) { c.tier++; c.season++; out.tierUp = true; }
        else { c.finished = true; out.legend = true; S().trophies.push({ id: 'career', name: 'Leyenda del Penal', d: Date.now(), color: '#ffbf2e' }); }
      }
      PL.Save.save();
      return out;
    },
  });

  /* ---------------- challenges ---------------- */
  PL.Challenges = {
    done(id) { return !!(S().challenges[id] && S().challenges[id].done); },
    complete(ch) {
      const out = { coins: 0, unlocks: [] };
      if (PL.Challenges.done(ch.id)) return out;
      S().challenges[ch.id] = { done: true, d: Date.now() };
      out.coins = ch.reward;
      if (ch.item) Prog.applyUnlocks(ch.item, out);
      Prog.give({ coins: ch.reward, xp: Math.round(ch.reward / 2) });
      return out;
    },
  };
})(typeof window !== 'undefined' ? window : globalThis);
