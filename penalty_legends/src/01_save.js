/* PENALTY LEGENDS — persistent save system (localStorage with in-memory fallback, versioned migration) */
(function (G) {
  'use strict';
  const PL = G.PL;
  const KEY = 'penaltyLegends.save.v1';

  function defaults() {
    return {
      version: 1,
      created: Date.now(),
      coins: 400,
      xp: 0,
      level: 1,
      legendPoints: 0,
      profileName: 'Jugador',
      unlocked: {
        chars: ['ferreyra', 'okafor', 'custom'],
        kits: ['k_default', 'k_white'],
        boots: ['b_basic'],
        gloves: ['g_basic'],
        stadiums: ['escuela', 'municipal'],
        effects: ['fx_none'],
        balls: ['ball_classic'],
      },
      equipped: { kit: 'k_default', boots: 'b_basic', gloves: 'g_basic', effect: 'fx_none', ball: 'ball_classic', char: 'ferreyra' },
      charLevels: {},
      career: {
        created: false,
        hero: null,
        tier: 0,
        reputation: 0,
        season: 1,
        events: {},
        skillPoints: 0,
        finished: false,
      },
      stats: {
        matches: 0, wins: 0, losses: 0, shots: 0, goals: 0, saved: 0, posts: 0, misses: 0,
        keeperFaced: 0, keeperSaves: 0, perfect: 0, bestSpeed: 0, panenkas: 0, curlGoals: 0, powerGoals: 0,
        topCorners: 0, streakBest: 0, streakCur: 0, tournamentsWon: 0, suddenDeathWins: 0, legendBeaten: 0,
        zones: [0, 0, 0, 0, 0, 0, 0, 0, 0], playTime: 0, trainingShots: 0,
      },
      trophies: [],
      records: { targets: 0, power: 0, curl: 0, survival: 0 },
      challenges: {},
      history: [],
      tournament: null,
      settings: {
        master: 0.8, music: 0.55, sfx: 0.9, crowd: 0.7,
        shake: true, slowmo: true, aimGuide: true, autoKeeper: false, showFps: false, quality: 'high',
      },
    };
  }

  function merge(def, src) {
    if (Array.isArray(def)) return Array.isArray(src) ? src : def;
    if (def && typeof def === 'object') {
      const out = {};
      const s = src && typeof src === 'object' ? src : {};
      for (const k of Object.keys(def)) out[k] = merge(def[k], s[k]);
      for (const k of Object.keys(s)) if (!(k in out)) out[k] = s[k];
      return out;
    }
    return src === undefined || src === null || typeof src !== typeof def ? def : src;
  }

  const Save = (PL.Save = {
    data: defaults(),
    persistent: true,
    _timer: null,
    load() {
      let raw = null;
      try { raw = G.localStorage ? G.localStorage.getItem(KEY) : null; } catch (e) { this.persistent = false; }
      if (raw) {
        try { this.data = merge(defaults(), JSON.parse(raw)); } catch (e) { console.warn('Save corrupto, se reinicia', e); this.data = defaults(); }
      } else this.data = defaults();
      return this.data;
    },
    saveNow() {
      clearTimeout(this._timer); this._timer = null;
      try {
        if (G.localStorage) { G.localStorage.setItem(KEY, JSON.stringify(this.data)); this.persistent = true; }
        else this.persistent = false;
      } catch (e) { this.persistent = false; }
      PL.Bus.emit('saved');
    },
    save() {
      if (this._timer) return;
      this._timer = setTimeout(() => this.saveNow(), 250);
    },
    reset() { this.data = defaults(); this.saveNow(); },
    exportCode() {
      try { return btoa(unescape(encodeURIComponent(JSON.stringify(this.data)))); } catch (e) { return ''; }
    },
    importCode(code) {
      try {
        const obj = JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
        if (!obj || typeof obj !== 'object' || !obj.stats) return false;
        this.data = merge(defaults(), obj); this.saveNow(); return true;
      } catch (e) { return false; }
    },
    defaults,
  });
})(typeof window !== 'undefined' ? window : globalThis);
