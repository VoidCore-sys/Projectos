/* PENALTY LEGENDS — shot model: converts player/AI decisions + stats into a real launch (velocity, spin, error) */
(function (G) {
  'use strict';
  const PL = G.PL, U = PL.U, D = PL.Data;

  const Shot = (PL.Shot = {
    // effective stats with boots + character level
    effStats(prof, boots, level) {
      const s = Object.assign({}, prof.stats);
      const lv = Math.max(0, (level || 1) - 1) * 2;
      for (const k in s) s[k] = U.clamp(s[k] + lv + ((boots && boots.bonus && boots.bonus[k]) || 0), 1, 99);
      return s;
    },
    timingClass(err, ability) {
      let w = 1;
      if (ability === 'maestro') w = 1.5; else if (ability === 'mago') w = 1.25;
      const a = Math.abs(err) / w;
      if (a < 0.04) return { id: 'perfect', name: '¡PERFECTO!', q: 0 };
      if (a < 0.09) return { id: 'good', name: 'BUENO', q: 0.3 };
      if (a < 0.16) return { id: 'ok', name: err < 0 ? 'APURADO' : 'TARDE', q: 0.62 };
      return { id: 'poor', name: err < 0 ? 'MUY APURADO' : 'MUY TARDE', q: 1 };
    },
    pressureWobble(stats, ability, pressure) {
      let f = pressure * (1.1 - stats.com / 100);
      if (ability === 'hielo') f *= 0.05; else if (ability === 'mago') f *= 0.5;
      return U.clamp(f, 0, 1);
    },
    /**
     * p: { stats, ability, tech, aim{x,y}, power(0..1.25), curl(-1..1), timingErr(s), cond }
     * returns launch { v, w, knuckle, target, speed, timing, err }
     */
    compute(p) {
      const T = D.TECH[p.tech] || D.TECH.colocado;
      const st = p.stats, ab = p.ability;
      const timing = Shot.timingClass(p.timingErr, ab);
      const pw = U.clamp(p.power, 0, 1.25);
      const over = Math.max(0, pw - 1);
      // speed
      let speed = U.lerp(T.vmin, T.vmax, Math.min(1, pw)) * (0.86 + st.pow * 0.0022);
      if (ab === 'rayo' && p.tech === 'potente') speed *= 1.12;
      speed *= 1 - timing.q * 0.12;
      if (timing.id === 'perfect') speed *= 1.04;
      // error
      let precision = 1.25 - st.pre * 0.0085; // 0.41 .. 1.16
      if (ab === 'colocador' && p.tech === 'colocado') precision *= 0.65;
      if (ab === 'picadita' && p.tech === 'picada') precision *= 0.6;
      let errR = T.err * precision * (0.18 + timing.q * 1.1) * (1 + over * 2.2);
      const ang = Math.random() * Math.PI * 2;
      let ex = Math.cos(ang) * errR * U.rand(0.4, 1), ey = Math.sin(ang) * errR * 0.7 * U.rand(0.4, 1);
      if (p.timingErr < 0) ey += Math.min(0.9, -p.timingErr * 3.2);      // rushed: leans back, ball rises
      else ey -= Math.min(0.6, p.timingErr * 2.2);                        // late: smothered
      ey += over * (ab === 'canon' ? 0.9 : 4.2);                           // over-hit: skied
      const target = { x: p.aim.x + ex, y: U.clamp(p.aim.y + ey, 0.12, 6), z: PL.W.GOAL_Z };
      // spin
      let curlMul = (0.55 + st.cur * 0.0065);
      if (ab === 'comba') curlMul *= 1.45; else if (ab === 'mago') curlMul *= 1.25;
      const side = -p.curl * T.spin * curlMul; // positive curl input bends ball to the right (+x)
      const w = { x: T.top, y: side, z: 0 };
      // fix: spin around y: (w x v).x = wy*vz -> positive wy bends to +x
      w.y = p.curl * T.spin * curlMul;
      let knuckle = 0;
      if (p.tech === 'potente' && Math.abs(p.curl) < 0.25) knuckle = U.rand(0.3, 0.8);
      const start = { x: 0, y: PL.W.BALL_R, z: 0 };
      let sol;
      if (p.tech === 'picada') {
        const el = U.lerp(0.78, 0.5, Math.min(1, pw));
        sol = PL.solveShot(start, target, { mode: 'angle', el, speed: 12, spin: w }, p.cond);
        speed = sol.speed;
      } else {
        sol = PL.solveShot(start, target, { speed, spin: w }, p.cond);
      }
      return { v: sol.v, w, knuckle, target, speed, timing, tech: p.tech, aim: p.aim, power: pw };
    },
    zoneOf(x, y) {
      const side = x < -1.2 ? -1 : x > 1.2 ? 1 : 0;
      return { side, high: y > 1.3 };
    },
    zoneIndex(x, y) {
      const c = x < -1.2 ? 0 : x > 1.2 ? 2 : 1;
      const r = y > 1.6 ? 0 : y > 0.8 ? 1 : 2;
      return r * 3 + c;
    },
  });
})(typeof window !== 'undefined' ? window : globalThis);
