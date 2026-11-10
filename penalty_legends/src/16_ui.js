/* PENALTY LEGENDS — interface: menu screens, shop, profile, settings, results and the in-match HUD */
(function (G) {
  'use strict';
  const PL = G.PL, U = PL.U, D = PL.Data, C = PL.C;
  const S = () => PL.Save.data;
  const A = () => PL.Audio;
  const esc = U.esc;
  const $ = (sel, root) => (root || document).querySelector(sel);

  /* ---------------- art helpers (all real pixel renders) ---------------- */
  const Art = (PL.Art = {
    charApp(prof, kit, opts = {}) {
      const k = kit || D.KITS[0];
      return Object.assign({}, prof.look, { kit: { p: k.p, s: k.s, pattern: k.pattern || 'solid', shorts: k.shorts || k.s, socks: k.socks || k.p }, boots: { color: '#202028' }, number: prof.num, height: 1, gloves: opts.gloves || null, longSleeves: !!opts.gloves });
    },
    portrait(prof, kit, size = 96, extra = '') {
      const k = kit || D.KITS[0];
      const key = [prof.id, JSON.stringify(prof.look), k.p, k.s, k.pattern, size, extra].join('|');
      return PL.portrait(key, Art.charApp(prof, kit, extra === 'gk' ? { gloves: { color: '#f2f2f2', accent: k.p } } : {}), size);
    },
    _thumbs: {},
    stadiumThumb(id) {
      if (this._thumbs[id]) return this._thumbs[id];
      const W = 192, H = 108;
      const st = new PL.Stadium(D.stadiumById(id));
      const c = PL.CAM.penalty;
      const cam = new PL.Camera(W, H).set(W, H, c.pos, c.pitch, c.zoom);
      const layer = st.layer(cam);
      const buf = new PL.PixBuf(W, H);
      buf.data.set(layer.bg);
      st.drawCrowd(buf, layer, { mood: 'idle', t: 0 }, 1, ['#1e5bd8', '#d8262e']);
      st.drawBoards(buf, layer, 0, null);
      st.drawLightsGlow(buf, layer, 0);
      // goal frame
      const fake = { cam, frame: buf };
      PL.Scene.prototype.drawGoalFrame.call(fake);
      st.applyGrade(buf);
      const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
      cv.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(buf.data.buffer.slice(0)), W, H), 0, 0);
      return (this._thumbs[id] = cv.toDataURL());
    },
    _icons: {},
    icon(kind, item, size = 64) {
      const key = kind + item.id + size;
      if (this._icons[key]) return this._icons[key];
      const N = 32, b = new PL.PixBuf(N, N);
      if (kind === 'balls') {
        const cam = new PL.Camera(N, N).set(N, N, { x: 0, y: 0.11, z: -1 }, 0, 1); cam.F = 120;
        const ball = new PL.Ball(); ball.ori = [PL.V.norm({ x: 1, y: 0.4, z: 0.2 }), PL.V.norm({ x: -0.4, y: 1, z: 0.1 }), { x: 0, y: 0, z: 1 }];
        ball.ori[2] = PL.V.norm(PL.V.cross(ball.ori[0], ball.ori[1]));
        PL.Scene.prototype.drawBall.call({ cam, frame: b, ballSkin: item }, ball);
      } else if (kind === 'boots') {
        const p = PL.pal(item.color), a = PL.pal(item.accent);
        b.capsule(8, 14, 14, 22, 4.2, p); b.capsule(12, 22, 26, 22, 4.2, p);
        b.capsule(14, 21, 24, 21, 1.1, a);
        for (let x = 12; x <= 26; x += 4) b.px(x, 27, C.hex('#c0c0c0'));
        b.outline();
      } else if (kind === 'gloves') {
        const p = PL.pal(item.color), a = PL.pal(item.accent);
        b.capsule(16, 20, 16, 26, 6, p);
        for (let i = 0; i < 4; i++) b.capsule(10 + i * 4, 18, 10 + i * 4, 7 + Math.abs(i - 1.5) * 1.5, 2, p);
        b.capsule(9, 22, 5, 15, 2.2, p);
        b.capsule(11, 25, 21, 25, 1.4, a);
        b.outline();
      } else if (kind === 'effects') {
        const cols = item.colors.length ? item.colors.map((c) => C.hex(c)) : [C.hex('#556')];
        for (let i = 0; i < 20; i++) { const c = cols[Math.min(cols.length - 1, Math.floor((1 - i / 20) * cols.length))]; b.capsule(3 + i, 22 - i * 0.6, 4 + i, 22 - i * 0.6, 1 + i * 0.12, { base: c, hi: c, sh: c }); }
        if (item.sparkle) for (let i = 0; i < 8; i++) b.px(4 + Math.random() * 20, 10 + Math.random() * 14, C.WHITE);
        b.disc(26, 9, 4, C.hex('#f6f6f2')); b.px(25, 8, C.hex('#1d1d24')); b.px(27, 10, C.hex('#1d1d24'));
      }
      const cv = document.createElement('canvas'); cv.width = N; cv.height = N;
      cv.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(b.data.buffer.slice(0)), N, N), 0, 0);
      return (this._icons[key] = cv.toDataURL());
    },
  });

  /* ---------------- small builders ---------------- */
  const coin = (n) => `<span class="chip"><i class="coin"></i><b>${U.fmt(n)}</b></span>`;
  const tierTag = (t) => `<span class="tag" style="background:${D.TIERS[t].color}">${D.TIERS[t].name}</span>`;
  const statRows = (st, extra = {}) => [['pre', 'Precisión'], ['pow', 'Potencia'], ['con', 'Control'], ['cur', 'Efecto'], ['com', 'Sangre fría']].map(([k, n]) => `<div class="stat"><span>${n}</span><div class="bar"><i style="width:${st[k]}%"></i></div><span>${st[k]}${extra[k] ? `<button class="btn sm" data-act="upgrade" data-stat="${k}" style="margin-left:4px;padding:0 5px">+</button>` : ''}</span></div>`).join('');
  const back = (to = 'main') => `<button class="btn back" data-act="go" data-to="${to}" aria-label="Volver">◀</button>`;
  const wallet = () => `<span class="chip">NIVEL <b>${S().level}</b></span>${coin(S().coins)}`;
  const header = (title, to = 'main', extra = '') => `<div class="topbar">${back(to)}<h2>${title}</h2><span class="sp"></span>${extra}${wallet()}</div>`;
  const ICON = {
    play: '<svg viewBox="0 0 24 24" width="30" height="30"><circle cx="12" cy="12" r="10" fill="#fff"/><path d="M12 5l3 2-1 3h-4l-1-3zM5 10l3-1 1 4-2 3-2-1zM19 10l-3-1-1 4 2 3 2-1zM9 17h6l-1 3h-4z" fill="#111"/></svg>',
    cup: '<svg viewBox="0 0 24 24" width="30" height="30"><path d="M6 3h12v3a6 6 0 01-12 0zM6 5H3v2a4 4 0 004 4M18 5h3v2a4 4 0 01-4 4M10 13h4v4h3v3H7v-3h3z" fill="#ffc93c"/></svg>',
    star: '<svg viewBox="0 0 24 24" width="30" height="30"><path d="M12 2l3 7 7 .6-5.3 4.6 1.7 7.3L12 17.8 5.6 21.5l1.7-7.3L2 9.6 9 9z" fill="#ffc93c"/></svg>',
    cone: '<svg viewBox="0 0 24 24" width="30" height="30"><path d="M10 3h4l5 16H5z" fill="#ff7a1a"/><path d="M8.7 9h6.6l1 3H7.7zM6.6 15h10.8" stroke="#fff" stroke-width="2"/><rect x="3" y="19" width="18" height="2" fill="#ff7a1a"/></svg>',
    target: '<svg viewBox="0 0 24 24" width="30" height="30"><circle cx="12" cy="12" r="10" fill="#ff4d5a"/><circle cx="12" cy="12" r="6.5" fill="#fff"/><circle cx="12" cy="12" r="3" fill="#ff4d5a"/></svg>',
    duo: '<svg viewBox="0 0 24 24" width="30" height="30"><circle cx="8" cy="7" r="3" fill="#47b4ff"/><circle cx="16" cy="7" r="3" fill="#ff4d5a"/><path d="M3 20c0-5 2-8 5-8s5 3 5 8zM11 20c0-5 2-8 5-8s5 3 5 8z" fill="#fff"/></svg>',
  };

  /* ======================= UI core ======================= */
  const UI = (PL.UI = {
    cur: null, modalOpen: false, params: {},
    init() {
      this.root = $('#screens');
      this.hudEl = $('#hud');
      this.app = $('#app');
      this.root.addEventListener('click', (e) => this.onClick(e));
      this.hudEl.addEventListener('click', (e) => this.onClick(e));
      this.root.addEventListener('pointerenter', (e) => { if (e.target.classList && (e.target.classList.contains('mbtn'))) A().sfx('hover'); }, true);
      this.root.addEventListener('input', (e) => this.onInput(e));
      this.root.addEventListener('change', (e) => this.onInput(e));
      document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && this.cur && this.cur.name !== 'title' && this.cur.name !== 'main' && !PL.Game.activity?.captures) { const b = this.root.querySelector('[data-act=go]'); if (b) b.click(); }
      });
    },
    show(name, params = {}) {
      this.cur = { name, params };
      this.params = params;
      const fn = SCREENS[name];
      this.app.classList.toggle('menu-open', !!fn);
      this.closeModal();
      if (!fn) { this.root.innerHTML = ''; return; }
      const hud = document.getElementById('hud'); if (hud) hud.hidden = true;
      this.root.innerHTML = `<div class="screen" data-screen="${name}">${fn(params)}</div>`;
      const after = AFTER[name];
      if (after) after(params);
      const first = this.root.querySelector('.mbtn, .btn.primary');
      if (first && PL.Input.lastDevice === 'keyboard') first.focus({ preventScroll: true });
    },
    refresh() { if (this.cur) { const sc = this.root.querySelector('.screen'); const y = sc ? sc.scrollTop : 0; this.show(this.cur.name, this.cur.params); const s2 = this.root.querySelector('.screen'); if (s2) s2.scrollTop = y; } },
    hide() { this.cur = null; this.root.innerHTML = ''; this.app.classList.remove('menu-open'); },
    toast(msg) {
      const t = $('#toast'); const d = document.createElement('div'); d.textContent = msg; t.appendChild(d);
      setTimeout(() => d.remove(), 2600);
    },
    modal(html) {
      this.closeModal();
      const m = document.createElement('div');
      m.className = 'modal-bg'; m.innerHTML = `<div class="modal panel">${html}</div>`;
      m.addEventListener('click', (e) => this.onClick(e));
      m.addEventListener('input', (e) => this.onInput(e));
      $('#app').appendChild(m);
      this.modalEl = m; this.modalOpen = true;
      const f = m.querySelector('.btn.primary, .btn'); if (f) f.focus({ preventScroll: true });
    },
    closeModal() { if (this.modalEl) this.modalEl.remove(); this.modalEl = null; this.modalOpen = false; },
    onClick(e) {
      const el = e.target.closest('[data-act]');
      if (!el || el.disabled) return;
      A().init();
      const act = ACT[el.dataset.act];
      if (act) { A().sfx(el.dataset.act === 'go' && el.classList.contains('back') ? 'back' : 'click'); act(el.dataset, el, e); }
    },
    onInput(e) {
      const el = e.target;
      if (el.dataset && el.dataset.inp && INP[el.dataset.inp]) INP[el.dataset.inp](el);
    },
  });

  /* ======================= screens ======================= */
  const SCREENS = {
    title: () => `<div class="title-screen screen" style="position:absolute">
        <div class="logo"><span class="l1">PENALTY</span><span class="l2">LEGENDS</span></div>
        <p class="muted" style="max-width:520px;margin:0;font-weight:600;font-size:1.05rem">Once metros. Un arquero. Toda la gloria.</p>
        <button class="btn primary" data-act="start" style="font-size:1.3rem;padding:14px 34px">Empezar</button>
        <div class="press muted">Pulsá ESPACIO, hacé clic o tocá</div>
      </div>`,
    main: () => {
      const s = S();
      const c = s.career;
      const hero = PL.Game.currentHero();
      const kit = PL.Game.playerEquip().kit;
      const rank = c.created ? PL.Progress.rank(c.reputation).name : '';
      const t = s.tournament;
      const xpN = D.xpToNext(s.level);
      return `<div class="topbar"><div class="logo" style="font-size:.42rem"><span class="l1" style="font-size:3.2rem">PENALTY</span><span class="l2" style="font-size:3.6rem">LEGENDS</span></div><span class="sp"></span>
        <span class="chip">${esc(s.profileName)}</span>${wallet()}</div>
      <div class="menu-main">
        <div class="menu-list">
          <button class="mbtn hero" data-act="go" data-to="quick"><span class="ico">${ICON.play}</span><span><div class="n">Partido rápido</div><div class="d">Tanda de penales al instante</div></span></button>
          <button class="mbtn" data-act="go" data-to="career"><span class="ico">${ICON.star}</span><span><div class="n">Carrera</div><div class="d">${c.created ? esc(c.hero.name) + ' · ' + rank : 'De desconocido a leyenda'}</div></span></button>
          <button class="mbtn" data-act="go" data-to="tournaments"><span class="ico">${ICON.cup}</span><span><div class="n">Torneos</div><div class="d">${t ? 'En curso: ' + esc(t.name) : 'Copas con cuadro de eliminación'}</div></span></button>
          <button class="mbtn" data-act="go" data-to="training"><span class="ico">${ICON.cone}</span><span><div class="n">Entrenamiento</div><div class="d">Dianas, potencia, efecto y práctica libre</div></span></button>
          <button class="mbtn" data-act="go" data-to="challenges"><span class="ico">${ICON.target}</span><span><div class="n">Desafíos</div><div class="d">${D.CHALLENGES.filter((x) => PL.Challenges.done(x.id)).length}/${D.CHALLENGES.length} completados</div></span></button>
          <button class="mbtn" data-act="go" data-to="mp"><span class="ico">${ICON.duo}</span><span><div class="n">2 Jugadores</div><div class="d">Duelo local por turnos</div></span></button>
          <div class="subrow">
            <button class="btn" data-act="go" data-to="locker">Vestuario</button>
            <button class="btn" data-act="go" data-to="shop">Tienda</button>
            <button class="btn" data-act="go" data-to="profile">Perfil</button>
            <button class="btn" data-act="go" data-to="settings">Ajustes</button>
          </div>
        </div>
        <div class="feature">
          <div class="panel row" style="gap:14px;align-items:center">
            <img class="pix" src="${Art.portrait(hero.prof, kit, 96)}" width="96" height="96" alt="Retrato de ${esc(hero.prof.name)}" style="background:#1c2a48;border-radius:3px">
            <div class="col" style="flex:1">
              <div class="lbl">Tu jugador</div>
              <div class="big">${esc(hero.prof.name)}</div>
              <div class="muted" style="font-weight:700">${esc(hero.prof.nat)} · ${D.ABILITIES[hero.prof.ability || 'none'].name} · Nv ${hero.level}</div>
              <div class="lvl"><span class="lbl">XP</span><div class="bar" style="flex:1"><i style="width:${U.pct(s.xp, xpN)}%"></i></div><span class="muted">${s.xp}/${xpN}</span></div>
            </div>
          </div>
          <div class="panel row" style="justify-content:space-around;text-align:center">
            <div><div class="big">${s.stats.wins}</div><div class="lbl">Victorias</div></div>
            <div><div class="big">${U.pct(s.stats.goals, s.stats.shots)}%</div><div class="lbl">Efectividad</div></div>
            <div><div class="big">${s.stats.bestSpeed || 0}</div><div class="lbl">km/h récord</div></div>
            <div><div class="big">${s.trophies.length}</div><div class="lbl">Trofeos</div></div>
          </div>
          ${s.history.length ? `<div class="panel"><div class="lbl" style="margin-bottom:6px">Último partido</div><div style="font-weight:700">${esc(s.history[0].mode)} vs ${esc(s.history[0].opp)} · ${s.history[0].sa}-${s.history[0].sb} <span class="${s.history[0].won ? 'win' : 'lose'}">${s.history[0].won ? 'VICTORIA' : 'DERROTA'}</span></div></div>` : `<div class="panel muted" style="font-weight:600">Consejo: elegí la técnica (1-4), apuntá con flechas o mouse, mantené ESPACIO para la potencia y volvé a pulsar justo cuando el anillo se cierre sobre la pelota.</div>`}
          ${PL.Save.persistent ? '' : '<div class="panel" style="border-color:var(--red)"><b>Guardado local no disponible</b> en este navegador. Usá Ajustes → Exportar para conservar el progreso.</div>'}
        </div>
      </div>`;
    },
    quick: (p) => {
      const q = UI.params;
      q.tier = q.tier || 2; q.kicks = q.kicks || 5;
      q.stadium = q.stadium || S().unlocked.stadiums[S().unlocked.stadiums.length - 1];
      q.char = q.char || S().equipped.char;
      return header('Partido rápido') + `
        <div class="col" style="gap:14px">
          <div class="panel col"><div class="lbl">Tu pateador</div>${charPicker(q.char, 'qchar')}</div>
          <div class="panel col"><div class="lbl">Arquero rival</div><div class="tierchips">${[1, 2, 3, 4].map((t) => `<button class="btn ${q.tier === t ? 'sel' : ''}" data-act="qtier" data-t="${t}" style="border-bottom:3px solid ${D.TIERS[t].color}">${D.TIERS[t].name}</button>`).join('')}</div>
            <div class="muted" style="font-weight:600">${tierDesc(q.tier)}</div></div>
          <div class="panel col"><div class="lbl">Estadio</div>${stadiumPicker(q.stadium, 'qstad')}</div>
          <div class="row"><span class="lbl">Penales por equipo</span>${[3, 5].map((k) => `<button class="btn sm ${q.kicks === k ? 'sel' : ''}" data-act="qkicks" data-k="${k}">${k}</button>`).join('')}<span class="sp" style="flex:1"></span><button class="btn primary" data-act="qstart" style="font-size:1.3rem;padding:12px 40px">¡A jugar!</button></div>
        </div>`;
    },
    tournaments: () => {
      const s = S(), t = s.tournament;
      return header('Torneos') + (t ? `<div class="panel row" style="margin-bottom:12px;border-color:var(--gold)"><div class="col" style="flex:1"><div class="lbl">Torneo en curso</div><div class="big">${esc(t.name)}</div><div class="muted" style="font-weight:700">${t.champion ? 'Finalizado' : PL.Tournament.roundName(t, t.round)}</div></div><button class="btn primary" data-act="go" data-to="bracket">Continuar</button><button class="btn ghost" data-act="tabandon">Abandonar</button></div>` : '') +
        `<div class="grid">${D.TOURNAMENTS.map((d) => {
          const locked = s.level < d.reqLevel;
          const won = s.trophies.filter((x) => x.id === d.id).length;
          return `<div class="card ${locked ? 'lock' : ''}" ${locked || t ? '' : `data-act="tnew" data-id="${d.id}"`} style="border-top:4px solid ${d.color}">
            <div class="lbl">${esc(d.type)} · ${d.size} equipos</div><h3>${esc(d.name)}</h3>
            <div class="muted" style="font-weight:600;font-size:.9rem">${esc(d.desc)}</div>
            <div class="row">${d.tiers.map((x) => tierTag(x)).join('')}</div>
            <div class="row" style="justify-content:space-between"><span class="chip"><i class="coin"></i><b>${U.fmt(d.reward.coins)}</b></span><span class="chip">XP <b>${d.reward.xp}</b></span></div>
            ${d.unlock ? `<div class="muted" style="font-size:.8rem;font-weight:700">Premio: ${Object.keys(d.unlock).map((k) => esc(PL.Progress.unlockName(k, d.unlock[k]))).join(', ')}</div>` : ''}
            ${locked ? `<span class="tag" style="background:var(--red)">Nivel ${d.reqLevel}</span>` : won ? `<span class="tag" style="background:var(--gold)">Ganado x${won}</span>` : t ? '<span class="muted" style="font-size:.8rem">Terminá el torneo en curso primero</span>' : ''}
          </div>`;
        }).join('')}</div>`;
    },
    bracket: () => {
      const t = S().tournament;
      if (!t) return header('Torneo', 'tournaments') + '<div class="panel">No hay torneo en curso.</div>';
      const done = !!t.champion;
      const pm = !done ? PL.Tournament.playerMatch(t) : null;
      const oppId = pm ? (pm.a === 'player' ? pm.b : pm.a) : null;
      const opp = oppId ? PL.Tournament.team(t, oppId, t.round) : null;
      const back = t.career ? 'career' : 'tournaments';
      return header(esc(t.name), back) + `
        ${done ? `<div class="panel" style="text-align:center;margin-bottom:12px;border-color:var(--gold)"><div class="lbl">Campeón</div><div class="res-title ${t.champion === 'player' ? 'win' : ''}">${esc(PL.Tournament.teamName(t.champion))}</div>
          <button class="btn primary" data-act="tclose" style="margin-top:10px">${t.champion === 'player' ? 'Levantar el trofeo' : 'Cerrar torneo'}</button></div>`
        : `<div class="panel row" style="margin-bottom:12px"><div class="col" style="flex:1"><div class="lbl">${PL.Tournament.roundName(t, t.round)}</div><div class="big">vs ${esc(opp.name)}</div>
            <div class="row">${tierTag(opp.tier)}<span class="muted" style="font-weight:700">Arquero: ${esc(opp.keeper.name)} · ${D.STYLES[opp.keeper.style].name}</span></div>
            <div class="muted" style="font-weight:700">Estadio: ${esc(D.stadiumById(t.def.stadiums[Math.min(t.round, t.def.stadiums.length - 1)]).name)}</div></div>
            <img class="pix" src="${Art.portrait({ id: opp.keeper.id, look: opp.keeper.look, num: 1 }, { p: opp.keeper.kit.p, s: opp.keeper.kit.s, pattern: 'solid' }, 80, 'gk')}" width="80" height="80" alt="Arquero rival" style="background:#1c2a48">
            <button class="btn primary" data-act="tplay" style="font-size:1.2rem;padding:12px 26px">Jugar</button></div>`}
        <div class="bracket">${t.bracket.map((rd, i) => `<div class="rd"><div class="lbl">${PL.Tournament.roundName(t, i)}</div>${rd.map((m) => `<div class="match ${m.a === 'player' || m.b === 'player' ? 'me' : ''}">
            <div class="${m.winner === m.a ? 'w' : ''}"><span>${esc(PL.Tournament.teamName(m.a))}</span><span>${m.winner ? m.sa : '–'}</span></div>
            <div class="${m.winner === m.b ? 'w' : ''}"><span>${esc(PL.Tournament.teamName(m.b))}</span><span>${m.winner ? m.sb : '–'}</span></div></div>`).join('') || '<div class="muted">Por definir</div>'}</div>`).join('')}</div>`;
    },
    career: () => {
      const c = S().career;
      if (!c.created) return careerCreate();
      const h = c.hero, tierDef = PL.Career.tierDef();
      const rank = PL.Progress.rank(c.reputation);
      const next = D.REP_RANKS.find((r) => r.rep > c.reputation);
      const kit = PL.Game.playerEquip().kit;
      const canAb = c.reputation >= 350 && h.ability === 'none';
      return header('Carrera') + `<div class="menu-main" style="grid-template-columns:minmax(0,360px) minmax(0,1fr)">
        <div class="col">
          <div class="panel col" style="align-items:center;text-align:center">
            <img class="pix" src="${Art.portrait(h, kit, 128)}" width="128" height="128" alt="Retrato de ${esc(h.name)}" style="background:#1c2a48;border-radius:3px">
            <div class="big">${esc(h.name)}</div>
            <div class="row" style="justify-content:center"><span class="tag" style="background:var(--gold)">${rank.name}</span><span class="chip">#${h.num}</span><span class="chip">${esc(h.nat)}</span></div>
            <div style="width:100%"><div class="row" style="justify-content:space-between"><span class="lbl">Reputación</span><span class="muted">${c.reputation}${next ? ' / ' + next.rep : ''}</span></div><div class="bar"><i style="width:${next ? U.pct(c.reputation, next.rep) : 100}%"></i></div></div>
            <div class="muted" style="font-weight:700">Habilidad: ${D.ABILITIES[h.ability].name}</div>
            ${canAb ? '<button class="btn primary sm" data-act="chooseab">Elegir habilidad especial</button>' : h.ability === 'none' ? '<div class="muted" style="font-size:.8rem">Alcanzá el rango Profesional para desbloquear una habilidad.</div>' : ''}
          </div>
          <div class="panel col"><div class="row" style="justify-content:space-between"><span class="lbl">Atributos</span><span class="chip">Puntos <b>${c.skillPoints}</b></span></div>
            ${statRows(h.stats, c.skillPoints > 0 ? { pre: 1, pow: 1, con: 1, cur: 1, com: 1 } : {})}
            <div class="muted" style="font-size:.8rem">Cada nivel de jugador otorga 3 puntos.</div></div>
        </div>
        <div class="col">
          ${c.finished ? '<div class="panel" style="border-color:var(--gold);text-align:center"><div class="res-title win">¡Sos una leyenda!</div><div class="muted" style="font-weight:700">Completaste la carrera. Podés seguir jugando eventos para sumar reputación.</div></div>' : ''}
          <div class="panel"><div class="lbl">Temporada ${c.season} · Etapa ${c.tier + 1} de ${D.CAREER.length}</div><div class="big">${esc(tierDef.name)}</div><div class="muted" style="font-weight:600">${esc(tierDef.desc)}</div>
            <div class="row" style="margin-top:8px">${D.CAREER.map((t, i) => `<span class="tag" style="background:${i < c.tier || (c.finished && i === c.tier) ? 'var(--gold)' : i === c.tier ? 'var(--sky)' : 'var(--line)'}">${i + 1}. ${esc(t.name)}</span>`).join('')}</div></div>
          <div class="grid">${tierDef.events.map((ev) => careerEventCard(ev)).join('')}</div>
          <div class="row"><button class="btn ghost sm" data-act="careerreset">Nueva carrera</button></div>
        </div></div>`;
    },
    training: () => {
      const r = S().records;
      const q = UI.params; q.tier = q.tier === undefined ? 0 : q.tier;
      const card = (drill, title, desc, rec) => `<div class="card" data-act="train" data-drill="${drill}"><div class="lbl">${rec}</div><h3>${title}</h3><div class="muted" style="font-weight:600">${desc}</div><button class="btn primary sm" data-act="train" data-drill="${drill}">Entrenar</button></div>`;
      return header('Entrenamiento') + `<div class="grid">
        ${card('targets', 'Dianas', 'Tres dianas en el arco. Acertá todas las que puedas en 60 segundos.', 'Récord: ' + r.targets)}
        ${card('power', 'Potencia', 'Diez tiros contra un arquero principiante. Medimos tu gol más rápido.', 'Récord: ' + r.power + ' km/h')}
        ${card('curl', 'Efecto', 'Un muñeco tapa la diana: rodealo con un tiro de Rosca. 60 segundos.', 'Récord: ' + r.curl)}
        <div class="card"><div class="lbl">Sin límite de tiempo</div><h3>Práctica libre</h3><div class="muted" style="font-weight:600">Probá técnicas y efectos. Elegí si querés arquero.</div>
          <div class="tierchips">${[0, 1, 2, 3, 4].map((t) => `<button class="btn sm ${q.tier === t ? 'sel' : ''}" data-act="ttier" data-t="${t}">${t ? D.TIERS[t].name : 'Sin arquero'}</button>`).join('')}</div>
          <button class="btn primary sm" data-act="train" data-drill="free">Entrenar</button></div>
      </div>
      <div class="panel" style="margin-top:12px">${controlsHelp()}</div>`;
    },
    challenges: () => header('Desafíos') + `<div class="grid">${D.CHALLENGES.map((ch) => {
      const done = PL.Challenges.done(ch.id);
      return `<div class="card" data-act="chal" data-id="${ch.id}" style="border-top:4px solid ${done ? 'var(--grass)' : 'var(--line)'}">
        <div class="row" style="justify-content:space-between"><span class="lbl">${ch.type === 'training' ? 'Entrenamiento' : 'Partido especial'}</span>${ch.tier ? tierTag(ch.tier) : ''}</div>
        <h3>${esc(ch.name)}</h3><div class="muted" style="font-weight:600">${esc(ch.desc)}</div>
        <div class="row" style="justify-content:space-between">${coin(ch.reward)}${ch.item ? `<span class="muted" style="font-size:.78rem;font-weight:700">+ ${esc(PL.Progress.unlockName(Object.keys(ch.item)[0], Object.values(ch.item)[0]))}</span>` : ''}</div>
        ${done ? '<span class="tag" style="background:var(--grass)">Completado</span>' : '<button class="btn primary sm" data-act="chal" data-id="' + ch.id + '">Jugar</button>'}
      </div>`;
    }).join('')}</div>`,
    mp: () => {
      const q = UI.params;
      const un = availableChars();
      q.c1 = q.c1 || un[0].id; q.c2 = q.c2 || (un[1] || un[0]).id;
      q.k1 = q.k1 || 'k_default'; q.k2 = q.k2 || (S().unlocked.kits.find((k) => k !== q.k1) || 'k_white');
      if (q.k1 === q.k2) q.k2 = D.KITS.find((k) => k.id !== q.k1).id;
      q.gk = q.gk || 'human'; q.kicks = q.kicks || 5;
      q.stadium = q.stadium || 'municipal';
      const kits = D.KITS;
      const side = (n, c, k) => `<div class="panel col"><div class="lbl" style="color:${n === 1 ? 'var(--sky)' : 'var(--red)'}">Jugador ${n}</div>${charPicker(c, 'mpc' + n)}
        <div class="lbl">Equipación</div><div class="row">${kits.map((kk) => `<button class="swatch ${k === kk.id ? 'on' : ''}" title="${esc(kk.name)}" aria-label="${esc(kk.name)}" data-act="mpk" data-n="${n}" data-id="${kk.id}" style="background:linear-gradient(90deg,${kk.p} 60%,${kk.s} 60%)"></button>`).join('')}</div></div>`;
      return header('2 Jugadores') + `<div class="col" style="gap:12px">
        <div class="menu-main" style="grid-template-columns:1fr 1fr">${side(1, q.c1, q.k1)}${side(2, q.c2, q.k2)}</div>
        <div class="panel col"><div class="lbl">Arqueros</div><div class="row">
          <button class="btn sm ${q.gk === 'human' ? 'sel' : ''}" data-act="mpgk" data-v="human">Los controlan los jugadores</button>
          <button class="btn sm ${q.gk === 'ai' ? 'sel' : ''}" data-act="mpgk" data-v="ai">Arqueros con IA</button></div>
          <div class="muted" style="font-weight:600;font-size:.9rem">${q.gk === 'human' ? 'Cuando un jugador apunta, el otro no mira la pantalla. Después ataja en tiempo real: flechas o tocar el arco.' : 'Ambos patean contra un arquero profesional controlado por la IA.'}</div></div>
        <div class="panel col"><div class="lbl">Estadio</div>${stadiumPicker(q.stadium, 'mpstad')}</div>
        <div class="row"><span class="lbl">Penales</span>${[3, 5].map((k) => `<button class="btn sm ${q.kicks === k ? 'sel' : ''}" data-act="mpkicks" data-k="${k}">${k}</button>`).join('')}<span style="flex:1"></span><button class="btn primary" data-act="mpstart" style="font-size:1.3rem;padding:12px 40px">Comenzar duelo</button></div>
      </div>`;
    },
    shop: () => {
      const q = UI.params; q.tab = q.tab || 'chars';
      const tabs = [['chars', 'Jugadores'], ['kits', 'Equipaciones'], ['boots', 'Botines'], ['gloves', 'Guantes'], ['stadiums', 'Estadios'], ['effects', 'Efectos'], ['balls', 'Balones']];
      return header('Tienda') + `<div class="tabs">${tabs.map(([k, n]) => `<button class="btn ${q.tab === k ? 'on' : ''}" data-act="tab" data-tab="${k}">${n}</button>`).join('')}</div><div class="grid">${shopItems(q.tab)}</div>`;
    },
    locker: () => {
      const s = S(), eq = s.equipped;
      const hero = PL.Game.currentHero();
      const kit = PL.Game.playerEquip().kit;
      const slot = (cat, label) => {
        const owned = s.unlocked[cat];
        return `<div class="panel col"><div class="lbl">${label}</div><div class="row">${owned.map((id) => {
          const it = D.itemById(cat, id); if (!it) return '';
          const img = cat === 'kits' ? `<span style="width:30px;height:30px;display:inline-block;border-radius:3px;background:linear-gradient(90deg,${it.p} 60%,${it.s} 60%)"></span>` : `<img class="pix" src="${Art.icon(cat, it)}" width="32" height="32" alt="">`;
          return `<button class="btn sm ${eq[{ kits: 'kit', boots: 'boots', gloves: 'gloves', effects: 'effect', balls: 'ball' }[cat]] === id ? 'sel' : ''}" data-act="equip" data-cat="${cat}" data-id="${id}" style="display:flex;gap:6px;align-items:center">${img}${esc(it.name)}</button>`;
        }).join('')}</div></div>`;
      };
      return header('Vestuario') + `<div class="menu-main" style="grid-template-columns:minmax(0,300px) minmax(0,1fr)">
        <div class="panel col" style="align-items:center;text-align:center"><img class="pix" src="${Art.portrait(hero.prof, kit, 160)}" width="160" height="160" alt="" style="background:#1c2a48;border-radius:3px">
          <div class="big">${esc(hero.prof.name)}</div><div class="muted" style="font-weight:700">Nivel ${hero.level} · ${D.ABILITIES[hero.prof.ability || 'none'].name}</div>
          ${statRows(PL.Shot.effStats(hero.prof, PL.Game.playerEquip().boots, hero.level))}
          ${hero.prof.id !== 'custom' && hero.level < 10 ? `<button class="btn primary sm" data-act="charlvl" data-id="${hero.prof.id}">Subir a nivel ${hero.level + 1} · ${U.fmt(lvlCost(hero.level))}</button>` : ''}
          <div class="muted" style="font-size:.8rem">Cada nivel de personaje suma +2 a todos los atributos.</div></div>
        <div class="col"><div class="panel col"><div class="lbl">Pateador</div>${charPicker(eq.char, 'lchar')}</div>
          ${slot('kits', 'Equipación')}${slot('boots', 'Botines (bonus de pateo)')}${slot('gloves', 'Guantes (bonus de tu arquero)')}${slot('effects', 'Efecto de estela')}${slot('balls', 'Balón')}</div></div>`;
    },
    profile: () => {
      const s = S(), st = s.stats;
      const zmax = Math.max(1, ...st.zones);
      const lb = D.LEADERBOARD.concat([{ name: s.profileName + ' (vos)', pts: s.legendPoints, me: true }]).sort((a, b) => b.pts - a.pts);
      const row = (k, v) => `<tr><td>${k}</td><td style="text-align:right">${v}</td></tr>`;
      return header('Perfil') + `<div class="menu-main" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr)">
        <div class="col">
          <div class="panel col"><div class="lbl">Nombre del perfil</div><input type="text" id="pname" maxlength="18" value="${esc(s.profileName)}" data-inp="pname">
            <div class="row"><span class="chip">Nivel <b>${s.level}</b></span><span class="chip">Puntos de leyenda <b>${U.fmt(s.legendPoints)}</b></span><span class="chip">Juego <b>${Math.round(st.playTime / 60)} min</b></span></div></div>
          <div class="panel"><div class="lbl">Estadísticas históricas</div><table class="lb">
            ${row('Partidos (G/P)', `${st.matches} (${st.wins}/${st.losses})`)}${row('Penales pateados', st.shots)}${row('Goles', `${st.goals} · ${U.pct(st.goals, st.shots)}%`)}
            ${row('Atajados / Palos / Afuera', `${st.saved} / ${st.posts} / ${st.misses}`)}${row('Golpeos perfectos', st.perfect)}${row('Gol más rápido', (st.bestSpeed || 0) + ' km/h')}
            ${row('Picadas convertidas', st.panenkas)}${row('Goles con rosca / potentes', `${st.curlGoals} / ${st.powerGoals}`)}${row('Goles al ángulo', st.topCorners)}
            ${row('Racha récord de goles', st.streakBest)}${row('Penales atajados como arquero', `${st.keeperSaves} de ${st.keeperFaced}`)}${row('Victorias en muerte súbita', st.suddenDeathWins)}
            ${row('Torneos ganados', st.tournamentsWon)}${row('Récords: dianas / potencia / efecto', `${s.records.targets} / ${s.records.power} km/h / ${s.records.curl}`)}</table></div>
        </div>
        <div class="col">
          <div class="panel col"><div class="lbl">Mapa de tus disparos</div><div class="zones">${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => `<div style="background:rgba(255,201,60,${(0.1 + 0.85 * st.zones[i] / zmax).toFixed(2)});color:#1a1200">${st.zones[i]}</div>`).join('')}</div>
            <div class="muted" style="font-size:.8rem">Los arqueros analistas leen tus tendencias: variá.</div></div>
          <div class="panel col"><div class="lbl">Vitrina de trofeos</div><div class="row">${s.trophies.length ? s.trophies.slice(-12).map((t) => `<div class="trophy">${ICON.cup.replace('#ffc93c', t.color || '#ffc93c').replace('width="30" height="30"', 'width="44" height="44"')}${esc(t.name)}</div>`).join('') : '<span class="muted">Todavía no ganaste trofeos.</span>'}</div></div>
          <div class="panel"><div class="lbl">Clasificación histórica</div><table class="lb">${lb.map((r, i) => `<tr class="${r.me ? 'me' : ''}"><td>${i + 1}</td><td>${esc(r.name)}</td><td style="text-align:right">${U.fmt(r.pts)}</td></tr>`).join('')}</table></div>
          <div class="panel"><div class="lbl">Últimos partidos</div><table class="lb">${s.history.slice(0, 8).map((h) => `<tr><td>${esc(h.mode)}</td><td>${esc(h.opp)}</td><td>${h.sa}-${h.sb}</td><td class="${h.won ? 'win' : 'lose'}">${h.won ? 'G' : 'P'}</td></tr>`).join('') || '<tr><td class="muted">Sin partidos</td></tr>'}</table></div>
        </div></div>`;
    },
    settings: () => {
      const s = S().settings;
      const sl = (k, n) => `<label class="col" style="gap:2px"><span class="lbl">${n} · ${Math.round(s[k] * 100)}%</span><input type="range" min="0" max="1" step="0.05" value="${s[k]}" data-inp="vol" data-k="${k}"></label>`;
      const tg = (k, n, d) => `<button class="btn sm ${s[k] ? 'sel' : ''}" data-act="toggle" data-k="${k}" style="justify-content:space-between;display:flex;gap:10px;text-align:left"><span>${n}<br><span class="muted" style="font-size:.75rem;text-transform:none;letter-spacing:0">${d}</span></span><b>${s[k] ? 'SÍ' : 'NO'}</b></button>`;
      return header('Ajustes') + `<div class="menu-main" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr)">
        <div class="col"><div class="panel col"><div class="lbl">Sonido</div>${sl('master', 'General')}${sl('music', 'Música')}${sl('sfx', 'Efectos')}${sl('crowd', 'Público')}</div>
          <div class="panel col"><div class="lbl">Juego</div>${tg('aimGuide', 'Guía de trayectoria', 'Muestra el inicio de la curva al apuntar.')}${tg('slowmo', 'Cámara lenta', 'En penales decisivos y al atajar.')}${tg('shake', 'Temblor de cámara', 'En palos y tiros potentes.')}${tg('autoKeeper', 'Arquero automático', 'La IA ataja por vos en las tandas.')}${tg('showFps', 'Mostrar FPS', 'Contador de rendimiento.')}</div></div>
        <div class="col"><div class="panel">${controlsHelp()}</div>
          <div class="panel col"><div class="lbl">Copia de seguridad</div><div class="muted" style="font-size:.85rem">El progreso se guarda automáticamente en este navegador${PL.Save.persistent ? '' : ' (no disponible ahora: usá el código)'}. Con el código podés llevarlo a otro dispositivo.</div>
            <textarea id="savecode" data-inp="none" aria-label="Código de guardado"></textarea>
            <div class="row"><button class="btn sm" data-act="exportsave">Generar código</button><button class="btn sm" data-act="importsave">Cargar código</button></div></div>
          <div class="panel col"><div class="lbl">Zona de peligro</div><button class="btn red sm" data-act="resetask">Borrar todo el progreso</button></div></div></div>`;
    },
    results: (p) => resultsScreen(p),
  };
  const AFTER = {
    title: () => { const h = (e) => { if (UI.cur && UI.cur.name === 'title' && (e.code === 'Space' || e.code === 'Enter')) { e.preventDefault(); ACT.start(); } }; document.addEventListener('keydown', h, { once: true }); },
  };

  /* ---------------- screen parts ---------------- */
  function tierDesc(t) {
    return ['', 'Reacciona tarde y adivina mucho. Ideal para aprender.', 'Lee el tiro con criterio. Hay que buscar los costados.', 'Reflejos rápidos y anticipación: castiga los tiros al medio.', 'Atajan casi todo lo que no vaya a la escuadra. Analizan tus tendencias.'][t];
  }
  function availableChars() {
    const s = S();
    const list = D.SHOOTERS.filter((c) => s.unlocked.chars.includes(c.id));
    if (s.career.created) list.unshift(s.career.hero);
    return list;
  }
  function charPicker(selId, key) {
    const kit = PL.Game.playerEquip().kit;
    return `<div class="charrow">${availableChars().map((c) => `<div class="card ${c.id === selId ? 'sel' : ''}" data-act="pick" data-key="${key}" data-id="${c.id}">
      <img class="por pix" src="${Art.portrait(c, kit, 96)}" alt="${esc(c.name)}"><h3>${esc(c.name)}</h3>
      <div class="muted" style="font-size:.75rem;font-weight:700">${esc(c.nat)} · ${D.ABILITIES[c.ability || 'none'].name}</div>
      ${c.id === selId ? statRows(PL.Shot.effStats(c, null, PL.Game.charLevel(c.id))) : ''}</div>`).join('')}</div>`;
  }
  function stadiumPicker(selId, key) {
    return `<div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(min(100%,180px),1fr))">${S().unlocked.stadiums.map((id) => { const st = D.stadiumById(id); return `<div class="card ${id === selId ? 'sel' : ''}" data-act="pick" data-key="${key}" data-id="${id}" style="padding:6px">
      <img class="thumb" src="${Art.stadiumThumb(id)}" alt="${esc(st.name)}"><div style="font-weight:800;text-transform:uppercase;font-size:.9rem">${esc(st.name)}</div>
      <div class="muted" style="font-size:.75rem;font-weight:700">${{ day: 'Día', afternoon: 'Tarde', night: 'Noche', storm: 'Lluvia', sunset: 'Atardecer' }[st.time]} · ${U.fmt(st.capacity)} espectadores</div></div>`; }).join('')}</div>`;
  }
  function careerCreate() {
    const q = UI.params;
    q.name = q.name || ''; q.nat = q.nat || 'Argentina'; q.skin = q.skin || D.SKIN[2]; q.hair = q.hair || 'short'; q.hairC = q.hairC || D.HAIR_COLORS[1];
    q.foot = q.foot || 'R'; q.num = q.num || 9; q.beard = !!q.beard; q.celeb = q.celeb || 'jump';
    const prof = { id: 'preview' + JSON.stringify(q), look: { skin: q.skin, hair: q.hair, hairC: q.hairC, beard: q.beard, height: 1 }, num: q.num };
    return header('Nueva carrera') + `<div class="menu-main" style="grid-template-columns:minmax(0,260px) minmax(0,1fr)">
      <div class="panel col" style="align-items:center"><img class="pix" id="cprev" src="${Art.portrait(prof, D.KITS[0], 160)}" width="160" height="160" alt="Vista previa" style="background:#1c2a48;border-radius:3px">
        <div class="muted" style="text-align:center;font-weight:600">Empezás como un desconocido con atributos bajos. Ganá partidos, subí de nivel y repartí puntos.</div></div>
      <div class="panel col">
        <label class="col" style="gap:4px"><span class="lbl">Nombre y apellido</span><input type="text" id="cname" maxlength="22" placeholder="Ej: Lautaro Benítez" value="${esc(q.name)}" data-inp="cname"></label>
        <label class="col" style="gap:4px"><span class="lbl">Nacionalidad</span><select data-inp="cnat">${D.NATIONS.map((n) => `<option ${n === q.nat ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
        <div class="lbl">Piel</div><div class="row">${D.SKIN.map((c) => `<button class="swatch ${q.skin === c ? 'on' : ''}" aria-label="Tono de piel" data-act="cset" data-k="skin" data-v="${c}" style="background:${c}"></button>`).join('')}</div>
        <div class="lbl">Peinado</div><div class="row">${D.HAIR_STYLES.map((h) => `<button class="btn sm ${q.hair === h ? 'sel' : ''}" data-act="cset" data-k="hair" data-v="${h}">${D.HAIR_NAMES[h]}</button>`).join('')}</div>
        <div class="lbl">Color de pelo</div><div class="row">${D.HAIR_COLORS.map((c) => `<button class="swatch ${q.hairC === c ? 'on' : ''}" aria-label="Color de pelo" data-act="cset" data-k="hairC" data-v="${c}" style="background:${c}"></button>`).join('')}
          <button class="btn sm ${q.beard ? 'sel' : ''}" data-act="cset" data-k="beard" data-v="${q.beard ? '' : '1'}">Barba</button></div>
        <div class="row"><span class="lbl">Pie hábil</span><button class="btn sm ${q.foot === 'R' ? 'sel' : ''}" data-act="cset" data-k="foot" data-v="R">Derecho</button><button class="btn sm ${q.foot === 'L' ? 'sel' : ''}" data-act="cset" data-k="foot" data-v="L">Zurdo</button>
          <span class="lbl">Dorsal</span>${[7, 9, 10, 11, 14, 19, 23].map((n) => `<button class="btn sm ${+q.num === n ? 'sel' : ''}" data-act="cset" data-k="num" data-v="${n}">${n}</button>`).join('')}</div>
        <div class="row"><span class="lbl">Festejo</span>${[['jump', 'Salto'], ['airplane', 'Avioncito'], ['slide', 'Rodillas'], ['point', 'Al cielo']].map(([k, n]) => `<button class="btn sm ${q.celeb === k ? 'sel' : ''}" data-act="cset" data-k="celeb" data-v="${k}">${n}</button>`).join('')}</div>
        <button class="btn primary" data-act="ccreate" style="align-self:flex-end;font-size:1.2rem">Firmar primer contrato</button>
      </div></div>`;
  }
  function careerEventCard(ev) {
    const c = S().career;
    const rec = c.events[ev.id];
    const won = rec && rec.won;
    const t = S().tournament;
    const activeHere = t && t.career === ev.id;
    if (ev.kind === 'match') {
      const tm = D.teamById(ev.team);
      return `<div class="card" style="border-top:4px solid ${won ? 'var(--grass)' : 'var(--line)'}"><div class="row" style="justify-content:space-between"><span class="lbl">Partido</span>${tierTag(ev.tier)}</div>
        <h3>vs ${esc(tm.name)}</h3><div class="muted" style="font-weight:700;font-size:.85rem">${esc(D.stadiumById(ev.stadium).name)}</div>
        ${won ? '<span class="tag" style="background:var(--grass)">Ganado</span>' : rec ? `<span class="tag" style="background:var(--red)">Intentos: ${rec.tries}</span>` : ''}
        <button class="btn ${won ? '' : 'primary'} sm" data-act="cplay" data-id="${ev.id}" ${t && !activeHere ? 'disabled' : ''}>${won ? 'Repetir' : 'Jugar'}</button></div>`;
    }
    return `<div class="card" style="border-top:4px solid ${won ? 'var(--grass)' : 'var(--gold)'}"><div class="row" style="justify-content:space-between"><span class="lbl">Copa · ${ev.size} equipos</span><span class="row">${ev.tiers.map((x) => tierTag(x)).join('')}</span></div>
      <h3>${esc(ev.name)}</h3>${won ? '<span class="tag" style="background:var(--grass)">Campeón</span>' : ''}
      <button class="btn ${won ? '' : 'primary'} sm" data-act="cplay" data-id="${ev.id}" ${t && !activeHere ? 'disabled' : ''}>${activeHere ? 'Continuar copa' : won ? 'Jugar de nuevo' : 'Jugar copa'}</button>
      ${t && !activeHere ? '<span class="muted" style="font-size:.75rem">Terminá el torneo en curso.</span>' : ''}</div>`;
  }
  const lvlCost = (lv) => 300 * lv;
  function shopItems(tab) {
    const s = S();
    const kit = PL.Game.playerEquip().kit;
    const buyBtn = (cat, id, price, req) => {
      const owned = (s.unlocked[cat] || []).includes(id);
      if (owned) return '<span class="tag" style="background:var(--grass)">Tuyo</span>';
      if (req && s.level < req) return `<span class="tag" style="background:var(--red)">Nivel ${req}</span>`;
      return `<button class="btn primary sm" data-act="buy" data-cat="${cat}" data-id="${id}" ${s.coins < price ? 'disabled' : ''}><i class="coin"></i> ${U.fmt(price)}</button>`;
    };
    if (tab === 'chars') return D.SHOOTERS.map((c) => `<div class="card"><img class="por pix" src="${Art.portrait(c, kit, 128)}" alt="${esc(c.name)}"><h3>${esc(c.name)}</h3>
      <div class="muted" style="font-weight:700;font-size:.8rem">"${esc(c.nick)}" · ${esc(c.nat)} · Pie ${c.foot === 'R' ? 'derecho' : 'izquierdo'}</div>
      <div style="font-weight:800;font-size:.9rem;color:var(--gold)">${D.ABILITIES[c.ability].name}</div><div class="muted" style="font-size:.8rem">${D.ABILITIES[c.ability].desc}</div>
      ${statRows(c.stats)}${buyBtn('chars', c.id, c.price, c.reqLevel)}</div>`).join('');
    if (tab === 'stadiums') return D.STADIUMS.map((st) => `<div class="card"><img class="thumb" src="${Art.stadiumThumb(st.id)}" alt="${esc(st.name)}"><h3>${esc(st.name)}</h3><div class="muted" style="font-size:.85rem;font-weight:600">${esc(st.desc)}</div>${buyBtn('stadiums', st.id, st.price, st.reqLevel)}</div>`).join('');
    const list = D.CATALOG[tab];
    return list.map((it) => {
      let img;
      if (tab === 'kits') img = `<img class="por pix" src="${Art.portrait(PL.Game.currentHero().prof, it, 128)}" alt="">`;
      else img = `<img class="por pix" src="${Art.icon(tab, it)}" alt="" style="padding:14%">`;
      const bonus = it.bonus ? Object.keys(it.bonus).map((k) => `+${it.bonus[k]} ${{ pre: 'Precisión', pow: 'Potencia', con: 'Control', cur: 'Efecto', com: 'Sangre fría', han: 'Blocaje', reach: 'Alcance', ref: 'Reflejos', agi: 'Agilidad' }[k]}`).join(' · ') : '';
      return `<div class="card">${img}<h3>${esc(it.name)}</h3>${bonus ? `<div class="muted" style="font-size:.8rem;font-weight:700">${bonus}</div>` : ''}${buyBtn(tab, it.id, it.price)}</div>`;
    }).join('');
  }
  function controlsHelp() {
    return `<div class="lbl" style="margin-bottom:6px">Controles</div><table class="lb" style="font-size:.88rem">
      <tr><td>Apuntar</td><td>Flechas / WASD · mover el mouse · arrastrar el dedo</td></tr>
      <tr><td>Técnica</td><td>1 Colocado · 2 Potente · 3 Rosca · 4 Picada</td></tr>
      <tr><td>Efecto</td><td>Q / E · rueda del mouse · deslizador táctil</td></tr>
      <tr><td>Potencia</td><td>Mantener ESPACIO, clic o botón CHUTAR; soltar para correr</td></tr>
      <tr><td>Golpeo</td><td>Pulsar de nuevo cuando el anillo se cierra (verde = perfecto)</td></tr>
      <tr><td>Paradinha</td><td>R: carrera con pausa que engaña al arquero</td></tr>
      <tr><td>Atajar</td><td>Flechas (+arriba/abajo) · clic o toque en el arco · ESPACIO: quedarse</td></tr>
      <tr><td>Pausa</td><td>ESC / P · botón II</td></tr></table>`;
  }
  function rewardsBlock(r) {
    if (!r) return '';
    return `<div class="panel col"><div class="row" style="justify-content:center;gap:16px">${r.xp ? `<span class="chip">XP <b>+${r.xp}</b></span>` : ''}${r.coins ? `<span class="chip"><i class="coin"></i><b>+${U.fmt(r.coins)}</b></span>` : ''}${r.rep ? `<span class="chip">Reputación <b>+${r.rep}</b></span>` : ''}</div>
      ${(r.levels || []).map((l) => `<div class="win" style="text-align:center;font-weight:800;letter-spacing:.1em">¡SUBISTE A NIVEL ${l}! +150 monedas${S().career.created ? ' · +3 puntos de atributo' : ''}</div>`).join('')}
      ${(r.unlocks || []).map((u) => `<div style="text-align:center;font-weight:800;color:var(--grass)">DESBLOQUEADO · ${esc(u)}</div>`).join('')}
      ${(r.notes || []).map((u) => `<div style="text-align:center;font-weight:800;color:var(--gold)">${esc(u)}</div>`).join('')}</div>`;
  }
  function resultsScreen(p) {
    if (p.training) {
      const tr = p.training;
      const unit = tr.drill === 'power' ? ' km/h' : '';
      return `<div class="col" style="align-items:center;justify-content:center;flex:1;gap:14px;text-align:center">
        <div class="lbl">Entrenamiento terminado</div><div class="res-title">${{ targets: 'Dianas', power: 'Potencia', curl: 'Efecto', free: 'Práctica libre' }[tr.drill]}</div>
        <div class="res-score win">${tr.score}${unit}</div>${tr.record ? '<div class="tag" style="background:var(--gold)">¡Nuevo récord!</div>' : ''}
        <div class="muted" style="font-weight:700">${tr.shots} tiros</div>${rewardsBlock(p.rewards)}
        <div class="row" style="justify-content:center">${p.retry ? `<button class="btn" data-act="retry">Repetir</button>` : ''}<button class="btn primary" data-act="cont" data-to="${p.next || 'training'}">Continuar</button></div></div>`;
    }
    const sum = p.sum, cfg = sum.cfg;
    const mk = (arr, kicks) => arr.map((r) => `<i class="${r === 'goal' ? 'g' : 'm'}"></i>`).join('') + Array(Math.max(0, kicks - arr.length)).fill('<i></i>').join('');
    const K = cfg.suddenOnly ? 0 : cfg.kicks || 5;
    const title = p.mp ? (sum.winner === 'A' ? 'Gana el Jugador 1' : 'Gana el Jugador 2') : sum.won ? '¡Victoria!' : 'Derrota';
    const hs = sum.stats[sum.human];
    return `<div class="col" style="align-items:center;gap:12px;flex:1;justify-content:center">
      <div class="lbl">${esc(p.label || 'Resultado')}</div>
      <div class="res-title ${p.mp || sum.won ? 'win' : 'lose'}">${title}</div>
      <div class="res-score"><span style="font-size:.45em;text-align:right">${esc(cfg.teamA.name)}</span><span>${sum.scoreA}</span><span class="muted">-</span><span>${sum.scoreB}</span><span style="font-size:.45em">${esc(cfg.teamB.name)}</span></div>
      <div class="kmk" style="position:static;transform:none"><div class="side">${mk(sum.resA, K)}</div><div class="side">${mk(sum.resB, K)}</div></div>
      ${sum.sudden ? '<span class="tag" style="background:var(--red)">Definido en muerte súbita</span>' : ''}
      <div class="panel row" style="justify-content:space-around;text-align:center;width:min(640px,100%)">
        <div><div class="big">${hs.goals}/${hs.kicks}</div><div class="lbl">Goles</div></div>
        <div><div class="big">${hs.perfect}</div><div class="lbl">Perfectos</div></div>
        <div><div class="big">${hs.maxSpeed}</div><div class="lbl">km/h máx</div></div>
        <div><div class="big">${hs.saves}</div><div class="lbl">Atajadas</div></div></div>
      <div style="width:min(640px,100%)">${rewardsBlock(p.rewards)}</div>
      <div class="row" style="justify-content:center">${p.retry ? '<button class="btn" data-act="retry">Revancha</button>' : ''}<button class="btn primary" data-act="cont" data-to="${p.next || 'main'}">Continuar</button></div></div>`;
  }

  /* ======================= actions ======================= */
  const ACT = {
    start() { A().init(); A().playMusic('menu'); UI.show('main'); },
    go(d) { UI.show(d.to, {}); },
    cont(d) { PL.Game.toMenu(d.to); },
    retry() { PL.Game.retry(); },
    pick(d) {
      const q = UI.params;
      const map = { qchar: 'char', qstad: 'stadium', mpc1: 'c1', mpc2: 'c2', mpstad: 'stadium' };
      if (d.key === 'lchar') { S().equipped.char = d.id; PL.Save.save(); UI.refresh(); return; }
      q[map[d.key]] = d.id; UI.refresh();
    },
    qtier(d) { UI.params.tier = +d.t; UI.refresh(); },
    qkicks(d) { UI.params.kicks = +d.k; UI.refresh(); },
    qstart() { const q = UI.params; PL.Game.startQuick({ char: q.char, tier: q.tier, stadium: q.stadium, kicks: q.kicks }); },
    ttier(d) { UI.params.tier = +d.t; UI.refresh(); },
    train(d, el, e) { e.stopPropagation(); PL.Game.startTraining(d.drill, UI.params.tier || 0); },
    chal(d, el, e) { e.stopPropagation(); if (!PL.Challenges.done(d.id) || el.classList.contains('btn')) PL.Game.startChallenge(d.id); },
    tnew(d) { const def = D.tournamentById(d.id); PL.Tournament.create(def); UI.show('bracket'); },
    tplay() { PL.Game.playTournamentMatch(); },
    tabandon() { UI.modal(`<h2>¿Abandonar el torneo?</h2><p class="muted">Perdés el progreso de este cuadro.</p><div class="row"><button class="btn red" data-act="tabandonyes">Abandonar</button><button class="btn" data-act="closemodal">Cancelar</button></div>`); },
    tabandonyes() { S().tournament = null; PL.Save.save(); UI.closeModal(); UI.refresh(); },
    tclose() { PL.Game.closeTournament(); },
    closemodal() { UI.closeModal(); },
    cset(d) { const q = UI.params; q[d.k] = d.k === 'beard' ? !!d.v : d.k === 'num' ? +d.v : d.v; q.name = ($('#cname') || {}).value || q.name; UI.refresh(); },
    ccreate() {
      const q = UI.params; const name = (($('#cname') || {}).value || '').trim();
      if (name.length < 2) { UI.toast('Escribí un nombre para tu jugador'); A().sfx('error'); return; }
      PL.Career.create(Object.assign({}, q, { name }));
      A().sfx('unlock'); UI.show('career');
    },
    upgrade(d, el, e) { e.stopPropagation(); if (PL.Career.upgrade(d.stat)) { A().sfx('coin'); UI.refresh(); } },
    chooseab() {
      const opts = ['rayo', 'colocador', 'comba', 'picadita', 'hielo', 'engano', 'maestro'];
      UI.modal(`<h2>Habilidad especial</h2><div class="col">${opts.map((k) => `<button class="btn" data-act="abset" data-id="${k}" style="text-align:left"><b style="color:var(--gold)">${D.ABILITIES[k].name}</b><br><span class="muted" style="text-transform:none;letter-spacing:0;font-weight:600">${D.ABILITIES[k].desc}</span></button>`).join('')}<button class="btn ghost" data-act="closemodal">Cancelar</button></div>`);
    },
    abset(d) { PL.Career.chooseAbility(d.id); UI.closeModal(); A().sfx('unlock'); UI.refresh(); },
    cplay(d) { PL.Game.playCareerEvent(d.id); },
    careerreset() { UI.modal(`<h2>¿Nueva carrera?</h2><p class="muted">Tu jugador actual y su reputación se pierden (monedas, nivel y objetos se conservan).</p><div class="row"><button class="btn red" data-act="careerresetyes">Empezar de cero</button><button class="btn" data-act="closemodal">Cancelar</button></div>`); },
    careerresetyes() { const c = S().career; c.created = false; c.hero = null; if (S().equipped.char === 'custom') S().equipped.char = 'ferreyra'; if (S().tournament && S().tournament.career) S().tournament = null; PL.Save.save(); UI.closeModal(); UI.show('career'); },
    mpk(d) { UI.params['k' + d.n] = d.id; UI.refresh(); },
    mpgk(d) { UI.params.gk = d.v; UI.refresh(); },
    mpkicks(d) { UI.params.kicks = +d.k; UI.refresh(); },
    mpstart() { PL.Game.startMP(Object.assign({}, UI.params)); },
    tab(d) { UI.params.tab = d.tab; UI.refresh(); },
    buy(d) {
      const s = S();
      let price = 0;
      if (d.cat === 'chars') price = D.shooterById(d.id).price;
      else if (d.cat === 'stadiums') price = D.stadiumById(d.id).price;
      else price = D.itemById(d.cat, d.id).price;
      if (s.coins < price) { A().sfx('error'); return; }
      s.coins -= price;
      PL.Progress.unlock(d.cat, d.id);
      A().sfx('unlock'); UI.toast('Comprado: ' + PL.Progress.unlockName(d.cat, d.id));
      UI.refresh();
    },
    equip(d) { const key = { kits: 'kit', boots: 'boots', gloves: 'gloves', effects: 'effect', balls: 'ball' }[d.cat]; S().equipped[key] = d.id; PL.Save.save(); UI.refresh(); },
    charlvl(d) {
      const lv = PL.Game.charLevel(d.id), cost = lvlCost(lv);
      if (S().coins < cost) { A().sfx('error'); UI.toast('Monedas insuficientes'); return; }
      S().coins -= cost; S().charLevels[d.id] = lv + 1; PL.Save.save(); A().sfx('levelup'); UI.refresh();
    },
    toggle(d) { const s = S().settings; s[d.k] = !s[d.k]; PL.Save.save(); UI.refresh(); },
    exportsave() { const t = $('#savecode'); t.value = PL.Save.exportCode(); t.select(); try { navigator.clipboard.writeText(t.value).then(() => UI.toast('Código copiado'), () => {}); } catch (e) {} },
    importsave() { const t = $('#savecode'); if (PL.Save.importCode(t.value)) { UI.toast('Progreso cargado'); A().applyVolumes(); UI.show('main'); } else { A().sfx('error'); UI.toast('Código inválido'); } },
    resetask() { UI.modal(`<h2>¿Borrar todo?</h2><p class="muted">Se pierden nivel, monedas, desbloqueos, carrera y récords. No se puede deshacer.</p><div class="row"><button class="btn red" data-act="resetyes">Borrar progreso</button><button class="btn" data-act="closemodal">Cancelar</button></div>`); },
    resetyes() { PL.Save.reset(); UI.closeModal(); A().applyVolumes(); UI.show('main'); UI.toast('Progreso borrado'); },
    // in-match
    pause() { PL.Game.pause(); },
    resume() { PL.Game.resume(); },
    quitask() { UI.modal(`<h2>¿Abandonar?</h2><p class="muted">${PL.Game.mode === 'training' ? 'Termina el entrenamiento.' : 'El partido cuenta como derrota.'}</p><div class="row"><button class="btn red" data-act="quityes">Abandonar</button><button class="btn" data-act="resume">Seguir jugando</button></div>`); },
    quityes() { UI.closeModal(); PL.Game.quit(); },
    tech(d) { const r = PL.Game.runner(); if (r) r.setTech(d.t); },
    para() { const r = PL.Game.runner(); if (r) r.toggleParadinha(); },
    endtrain() { const a = PL.Game.activity; if (a && a.finish && !a.ended) a.finish(); },
  };
  const INP = {
    vol(el) { S().settings[el.dataset.k] = +el.value; PL.Save.save(); A().applyVolumes(); const l = el.parentElement.querySelector('.lbl'); if (l) l.textContent = l.textContent.replace(/\d+%/, Math.round(el.value * 100) + '%'); },
    pname(el) { S().profileName = el.value.trim().slice(0, 18) || 'Jugador'; PL.Save.save(); },
    cname(el) { UI.params.name = el.value; },
    cnat(el) { UI.params.nat = el.value; },
    curl(el) { const r = PL.Game.runner(); if (r) r.setCurl(+el.value); },
  };
  UI.ACT = ACT;

  /* ======================= HUD ======================= */
  const HUD = (PL.HUD = {
    el: null, last: {},
    clear() { this.el = $('#hud'); this.el.innerHTML = ''; this.el.hidden = true; this.last = {}; this.mode = null; },
    base(extra = '') {
      this.el = $('#hud'); this.el.hidden = false; this.last = {};
      this.el.innerHTML = `${extra}
        <div class="tech pe" id="h-tech" hidden>${D.TECH_ORDER.map((t, i) => `<button class="btn" data-act="tech" data-t="${t}" title="${esc(D.TECH[t].desc)}"><span class="k">${i + 1}</span><span class="full">${D.TECH[t].name}</span><span class="short" hidden>${D.TECH[t].name.slice(0, 3)}</span></button>`).join('')}
          <div class="curl"><div class="lbl">Efecto <span id="h-curlv">0</span></div><input type="range" min="-1" max="1" step="0.05" value="0" id="h-curl" data-inp="curl" aria-label="Efecto"></div>
          <button class="btn" data-act="para" id="h-para"><span class="k">R</span><span>Paradinha</span></button></div>
        <div class="power" id="h-power" hidden><div class="lab">POT</div>
          <div class="z" style="bottom:${(0.75 / 1.25) * 100}%;height:${(0.2 / 1.25) * 100}%;background:#3ddc8433"></div>
          <div class="z" style="bottom:${(1 / 1.25) * 100}%;height:${(0.25 / 1.25) * 100}%;background:#ff4d5a44"></div>
          <div class="fill" id="h-pfill" style="height:0"></div></div>
        <div class="hint" id="h-hint" hidden></div>
        <button class="btn sm pe press-bt" data-act="pause" aria-label="Pausa">II</button>
        <button class="kbtn pe" id="h-kick" hidden>CHUTAR</button>
        <div id="h-pop"></div><div id="h-ban"></div>`;
      const kb = $('#h-kick');
      const down = (e) => { e.preventDefault(); A().init(); kb.classList.add('down'); PL.Input.vPress('action'); };
      const up = (e) => { e.preventDefault(); kb.classList.remove('down'); PL.Input.vRelease('action'); };
      kb.addEventListener('pointerdown', down); kb.addEventListener('pointerup', up); kb.addEventListener('pointercancel', up); kb.addEventListener('pointerleave', up);
      $('#h-curl').addEventListener('input', (e) => INP.curl(e.target));
    },
    matchStart(so) {
      this.mode = 'match'; this.so = so;
      const a = so.cfg.teamA, b = so.cfg.teamB;
      const st = so.cfg.stadium;
      const cond = so.cond;
      const windTxt = cond.windSpeed > 0.5 ? ` · Viento ${cond.windSpeed.toFixed(1)} m/s` : '';
      this.base(`<div class="sb"><div class="tm a"><span class="crest" style="background:linear-gradient(90deg,${a.kit.p} 55%,${a.kit.s} 55%)"></span><span class="nm">${esc(a.short)}</span></div>
        <div class="sc" id="h-sc">0 - 0</div><div class="tm b"><span class="crest" style="background:linear-gradient(90deg,${b.kit.p} 55%,${b.kit.s} 55%)"></span><span class="nm">${esc(b.short)}</span></div></div>
        <div class="kmk"><div class="side" id="h-ka"></div><div class="side" id="h-kb"></div></div>
        <div class="round" id="h-round"></div>
        ${cond.windSpeed > 0.5 ? `<div class="wind"><svg class="arr" viewBox="0 0 20 20" style="transform:rotate(${(Math.atan2(cond.wind.z, cond.wind.x) * -180) / Math.PI}deg)"><path d="M2 10h12M10 5l5 5-5 5" stroke="#9fe8ff" stroke-width="3" fill="none"/></svg>${cond.windSpeed.toFixed(1)} m/s</div>` : ''}
        <div id="h-heart"></div>
        <div class="ncard l" id="h-nl"></div><div class="ncard r" id="h-nr"></div>
        <div class="intro" id="h-intro"><div class="lbl">${esc(so.cfg.title || 'Tanda de penales')}</div><div class="vs"><span>${esc(a.name)}</span><span class="x">VS</span><span>${esc(b.name)}</span></div>
          <div class="st">${esc(st.name)}${st.rain ? ' · Lluvia' : ''}${st.time === 'night' ? ' · Noche' : ''}${windTxt}</div><div class="press muted" style="font-size:.8rem">Pulsá para empezar</div></div>`);
      this.score(so);
    },
    score(so) {
      if (!this.el || this.mode !== 'match') return;
      const sc = $('#h-sc'); if (sc) sc.textContent = so.score('A') + ' - ' + so.score('B');
      const K = so.kicks;
      const mk = (side) => {
        const arr = so.res[side];
        const n = Math.max(K, arr.length + (so.turn === side && so.state === 'kick' ? 1 : 0), so.inSudden() ? Math.max(so.res.A.length, so.res.B.length) : 0);
        let h = '';
        for (let i = 0; i < Math.max(n, 1); i++) h += `<i class="${arr[i] === 'goal' ? 'g' : arr[i] ? 'm' : i === arr.length && so.turn === side ? 'now' : ''}"></i>`;
        return h;
      };
      $('#h-ka').innerHTML = mk('A'); $('#h-kb').innerHTML = mk('B');
      const r = $('#h-round'); if (r) r.textContent = so.inSudden() || so.cfg.suddenOnly ? 'Muerte súbita' : 'Ronda ' + Math.min(K, so.round()) + ' de ' + K;
    },
    kickStart(so, side, shooter, keeperProf, humanShooter, keeperHuman, pressure) {
      const intro = $('#h-intro'); if (intro) intro.remove();
      this.so = so; this.score(so);
      const team = side === 'A' ? so.cfg.teamA : so.cfg.teamB;
      const pl = so.cfg.control[side];
      const who = pl === 'p1' ? 'Jugador 1' : pl === 'p2' ? 'Jugador 2' : esc(team.name);
      $('#h-nl').innerHTML = `<img src="${Art.portrait(shooter, team.kit, 64)}" alt=""><div><div class="t1">${esc(shooter.name)}</div><div class="t2">${who} · ${D.ABILITIES[shooter.ability || 'none'].name}</div></div>`;
      const oteam = side === 'A' ? so.cfg.teamB : so.cfg.teamA;
      const opl = so.cfg.control[side === 'A' ? 'B' : 'A'];
      $('#h-nr').innerHTML = `<img src="${Art.portrait({ id: keeperProf.id, look: keeperProf.look, num: 1 }, { p: keeperProf.kit.p, s: keeperProf.kit.s, pattern: 'solid' }, 64, 'gk')}" alt=""><div><div class="t1">${esc(keeperProf.name)}</div><div class="t2">${keeperHuman ? (opl === 'p2' ? 'Jugador 2' : 'Jugador 1') + ' · Arquero' : D.TIERS[keeperProf.tier] ? D.TIERS[keeperProf.tier].name + ' · ' + D.STYLES[keeperProf.style].name : esc(oteam.name)}</div></div>`;
      $('#h-heart').innerHTML = pressure > 0.5 ? '<div class="heart">PRESIÓN</div>' : '';
      this.humanShooter = humanShooter; this.keeperHuman = keeperHuman;
      const r = PL.Game.runner(); if (r) { const c = $('#h-curl'); if (c) c.value = 0; }
    },
    transition(text) {
      const b = $('#h-ban'); if (!b) return;
      A().sfx('swoosh');
      b.innerHTML = `<div class="wipe"></div>${text ? `<div class="banner"><div class="b1">${esc(text)}</div><div class="b2">Un error y se termina</div></div>` : ''}`;
      clearTimeout(this._bt); this._bt = setTimeout(() => { b.innerHTML = ''; }, text ? 2200 : 700);
    },
    matchEnd(so, w) {
      const b = $('#h-ban'); if (!b) return;
      const team = w === 'A' ? so.cfg.teamA : so.cfg.teamB;
      b.innerHTML = `<div class="banner"><div class="b1">${esc(team.short)} gana</div><div class="b2">${so.score('A')} - ${so.score('B')}</div></div>`;
      for (const id of ['h-tech', 'h-power', 'h-hint', 'h-kick']) { const e = $('#' + id); if (e) e.hidden = true; }
    },
    popup(text, cls) {
      const p = $('#h-pop'); if (!p) return;
      const d = document.createElement('div'); d.className = 'popup ' + (cls || ''); d.textContent = text;
      p.appendChild(d); setTimeout(() => d.remove(), 1500);
    },
    privacy(on) {
      let e = $('#h-priv');
      if (on && !e) { e = document.createElement('div'); e.id = 'h-priv'; e.className = 'privacy'; e.textContent = 'Arquero: ¡no mires mientras apunta el rival!'; this.el.appendChild(e); }
      else if (!on && e) e.remove();
    },
    trainingStart(tr) {
      this.mode = 'training'; this.tr = tr;
      this.base(`<div class="trainhud"><span class="chip" id="h-tt"></span><span class="chip" id="h-ts"></span><span class="chip" id="h-tb"></span><button class="btn sm pe" data-act="endtrain">Terminar</button></div>`);
      this.humanShooter = true; this.keeperHuman = false;
    },
    trainingTick(tr) {
      const set = (id, v) => { if (this.last[id] !== v) { this.last[id] = v; const e = $('#' + id); if (e) e.innerHTML = v; } };
      const names = { targets: 'Dianas', power: 'Potencia', curl: 'Efecto', free: 'Libre' };
      set('h-tt', tr.drill === 'targets' || tr.drill === 'curl' ? `TIEMPO <b>${Math.ceil(tr.time)}</b>` : tr.drill === 'power' ? `TIRO <b>${Math.min(10, tr.shots + 1)}/10</b>` : `TIROS <b>${tr.shots}</b>`);
      set('h-ts', `${names[tr.drill]} <b>${tr.score}${tr.drill === 'power' ? ' km/h' : ''}</b>`);
      const rec = S().records[tr.drill];
      set('h-tb', rec !== undefined ? `RÉCORD <b>${rec}</b>` : 'GOLES');
    },
    update() {
      if (!this.el || this.el.hidden) return;
      const r = PL.Game.runner();
      const info = r ? r.phaseInfo() : null;
      const touch = PL.Input.lastDevice === 'touch';
      const vis = (id, v) => { const k = 'v_' + id; if (this.last[k] !== v) { this.last[k] = v; const e = $('#' + id); if (e) e.hidden = !v; } };
      const shooting = info && info.human && (info.state === 'aim' || info.state === 'power' || info.state === 'runup');
      vis('h-tech', !!(info && info.human && (info.state === 'aim' || info.state === 'power')));
      vis('h-power', !!shooting);
      vis('h-kick', !!(touch && shooting));
      if (info) {
        const pw = Math.round(info.power * 100);
        if (this.last.pw !== pw) { this.last.pw = pw; const f = $('#h-pfill'); if (f) f.style.height = (Math.min(1.25, info.power) / 1.25) * 100 + '%'; }
        const tk = info.tech + (info.paradinha ? 'P' : '');
        if (this.last.tk !== tk) {
          this.last.tk = tk;
          this.el.querySelectorAll('#h-tech [data-t]').forEach((b) => b.classList.toggle('on', b.dataset.t === info.tech));
          const p = $('#h-para'); if (p) p.classList.toggle('on', info.paradinha);
        }
        const cv = Math.round(info.curl * 20) / 20;
        if (this.last.cv !== cv) { this.last.cv = cv; const e = $('#h-curlv'); if (e) e.textContent = (cv > 0 ? '→ ' : cv < 0 ? '← ' : '') + Math.abs(Math.round(cv * 100)) + '%'; const s = $('#h-curl'); if (s && document.activeElement !== s) s.value = cv; }
      }
      // hints
      let hint = '';
      if (info) {
        const kb = !touch;
        if (info.human && info.state === 'aim') hint = kb ? 'Apuntá con <kbd>flechas</kbd>/mouse · técnica <kbd>1-4</kbd> · efecto <kbd>Q</kbd><kbd>E</kbd> · mantené <kbd>ESPACIO</kbd> o clic para la potencia' : 'Arrastrá para apuntar · mantené CHUTAR para la potencia';
        else if (info.human && info.state === 'power') hint = kb ? 'Soltá en la zona verde · rojo = el balón se va alto' : 'Soltá en la zona verde';
        else if (info.human && info.state === 'runup') hint = kb ? '¡Pulsá <kbd>ESPACIO</kbd>/clic cuando el anillo se cierre sobre la pelota!' : '¡Tocá cuando el anillo se cierre!';
        else if (info.keeperHuman && (info.state === 'aiWait' || info.state === 'aiRunup' || info.state === 'flight')) hint = kb ? '¡A atajar! <kbd>flechas</kbd> (+<kbd>↑</kbd>/<kbd>↓</kbd>) o clic en el arco · <kbd>ESPACIO</kbd>: quedarse' : '¡A atajar! Tocá el arco donde te vas a tirar';
      }
      if (this.last.hint !== hint) { this.last.hint = hint; const e = $('#h-hint'); if (e) { e.innerHTML = hint; e.hidden = !hint; } }
    },
  });
})(typeof window !== 'undefined' ? window : globalThis);
