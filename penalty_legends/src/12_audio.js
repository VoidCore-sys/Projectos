/* PENALTY LEGENDS — audio: original procedural sound synthesis (Web Audio), crowd engine, music sequencer,
 * and a sample hook: PL.Audio.registerSample(name, url) replaces any synthesized effect with a licensed file. */
(function (G) {
  'use strict';
  const PL = G.PL, U = PL.U;

  const A = (PL.Audio = {
    ctx: null, ready: false, samples: {}, track: null, crowdLevel: 0.25,
    init() {
      if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
      const AC = G.AudioContext || G.webkitAudioContext;
      if (!AC) return;
      try { this.ctx = new AC(); } catch (e) { return; }
      const c = this.ctx;
      this.master = c.createGain(); this.master.connect(c.destination);
      const comp = c.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4;
      comp.connect(this.master);
      this.out = comp;
      this.music = c.createGain(); this.music.connect(comp);
      this.fx = c.createGain(); this.fx.connect(comp);
      this.crowdBus = c.createGain(); this.crowdBus.connect(comp);
      const len = c.sampleRate * 2;
      this.noise = c.createBuffer(1, len, c.sampleRate);
      const d = this.noise.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; b0 = 0.99765 * b0 + w * 0.099; b1 = 0.963 * b1 + w * 0.2965; b2 = 0.57 * b2 + w * 1.0526; d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.2; }
      this.white = c.createBuffer(1, len, c.sampleRate);
      const wd = this.white.getChannelData(0);
      for (let i = 0; i < len; i++) wd[i] = Math.random() * 2 - 1;
      this.ready = true;
      this.applyVolumes();
      this.startCrowd();
      for (const k in this._pending) this._load(k, this._pending[k]);
      if (this._wantTrack) this.playMusic(this._wantTrack);
    },
    _pending: {},
    registerSample(name, url) { this._pending[name] = url; if (this.ready) this._load(name, url); },
    _load(name, url) {
      fetch(url).then((r) => r.arrayBuffer()).then((ab) => this.ctx.decodeAudioData(ab)).then((buf) => { this.samples[name] = buf; }).catch(() => {});
    },
    applyVolumes() {
      if (!this.ready) return;
      const s = PL.Save.data.settings;
      const t = this.ctx.currentTime;
      this.master.gain.setTargetAtTime(s.master, t, 0.05);
      this.music.gain.setTargetAtTime(s.music * 0.55, t, 0.05);
      this.fx.gain.setTargetAtTime(s.sfx, t, 0.05);
      this.crowdBus.gain.setTargetAtTime(s.crowd, t, 0.05);
    },
    now() { return this.ctx ? this.ctx.currentTime : 0; },
    // ---- primitives ----
    tone(type, f0, t0, dur, gain, dest, f1, attack = 0.005) {
      const c = this.ctx, o = c.createOscillator(), g = c.createGain();
      o.type = type; o.frequency.setValueAtTime(f0, t0);
      if (f1) o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t0 + dur);
      g.gain.setValueAtTime(0.0001, t0); g.gain.linearRampToValueAtTime(gain, t0 + attack);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g); g.connect(dest || this.fx); o.start(t0); o.stop(t0 + dur + 0.05);
      return o;
    },
    noiseHit(t0, dur, gain, ftype, f0, q, dest, f1, white, attack = 0.003) {
      const c = this.ctx, s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
      s.buffer = white ? this.white : this.noise; s.loop = true;
      f.type = ftype; f.frequency.setValueAtTime(f0, t0); f.Q.value = q;
      if (f1) f.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
      g.gain.setValueAtTime(0.0001, t0); g.gain.linearRampToValueAtTime(gain, t0 + attack); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      s.connect(f); f.connect(g); g.connect(dest || this.fx);
      s.start(t0, Math.random()); s.stop(t0 + dur + 0.05);
    },
    voices(t0, dur, n, fLo, fHi, gain, dest, cutoff, rise) { // crowd vocal chord
      const c = this.ctx, lp = c.createBiquadFilter(), g = c.createGain();
      lp.type = 'lowpass'; lp.frequency.value = cutoff; lp.Q.value = 0.7;
      g.gain.setValueAtTime(0.0001, t0); g.gain.linearRampToValueAtTime(gain, t0 + 0.25); g.gain.setValueAtTime(gain, t0 + dur * 0.5); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      lp.connect(g); g.connect(dest || this.crowdBus);
      for (let i = 0; i < n; i++) {
        const o = c.createOscillator(), vg = c.createGain(), lfo = c.createOscillator(), lg = c.createGain();
        o.type = 'sawtooth';
        const f = U.rand(fLo, fHi);
        o.frequency.setValueAtTime(f, t0); o.frequency.linearRampToValueAtTime(f * rise, t0 + dur);
        lfo.frequency.value = U.rand(4, 7); lg.gain.value = f * 0.02; lfo.connect(lg); lg.connect(o.frequency);
        vg.gain.value = 1 / n;
        o.connect(vg); vg.connect(lp);
        const st = t0 + U.rand(0, 0.2);
        o.start(st); lfo.start(st); o.stop(t0 + dur + 0.1); lfo.stop(t0 + dur + 0.1);
      }
    },
    play(name, gain = 1, rate = 1) {
      const b = this.samples[name];
      if (!b) return false;
      const s = this.ctx.createBufferSource(), g = this.ctx.createGain();
      s.buffer = b; s.playbackRate.value = rate; g.gain.value = gain; s.connect(g); g.connect(this.fx); s.start();
      return true;
    },
    // ---- sound effects ----
    sfx(name, o = {}) {
      if (!this.ready) return;
      if (this.play(name, o.gain || 1)) return;
      const t = this.now();
      switch (name) {
        case 'kick': {
          const p = o.power || 0.7;
          this.tone('sine', 150 + p * 40, t, 0.16, 0.9, null, 45);
          this.noiseHit(t, 0.06, 0.55 * p + 0.2, 'bandpass', 1600, 1.2, null, 600, true);
          this.noiseHit(t, 0.025, 0.4, 'highpass', 3000, 0.7, null, null, true);
          break;
        }
        case 'post': case 'bar': {
          for (const [f, g] of [[523, 0.3], [1180, 0.22], [1873, 0.16], [2790, 0.1], [3612, 0.06]]) this.tone('sine', f * U.rand(0.99, 1.01), t, 1.4 * (1200 / f) ** 0.4, g, null, f * 0.995, 0.002);
          this.noiseHit(t, 0.05, 0.6, 'bandpass', 2400, 2, null, null, true);
          this.tone('sine', 120, t, 0.12, 0.5, null, 60);
          break;
        }
        case 'net': {
          this.noiseHit(t, 0.45, 0.45, 'bandpass', 900, 0.8, null, 300);
          this.noiseHit(t + 0.02, 0.3, 0.25, 'highpass', 4000, 0.5, null, null, true);
          break;
        }
        case 'save': case 'catch': {
          this.tone('sine', 110, t, 0.14, 0.8, null, 55);
          this.noiseHit(t, 0.08, 0.7, 'bandpass', name === 'catch' ? 700 : 1200, 1.4, null, 300, true);
          break;
        }
        case 'bounce': this.tone('sine', 140, t, 0.1, 0.35 * (o.gain || 1), null, 70); this.noiseHit(t, 0.03, 0.15, 'bandpass', 900, 1, null, null, true); break;
        case 'board': this.tone('square', 90, t, 0.15, 0.25, null, 60); this.noiseHit(t, 0.12, 0.4, 'lowpass', 900, 1, null, 200, true); break;
        case 'whistle': {
          const parts = o.kind === 'long' ? [[0, 0.9]] : o.kind === 'triple' ? [[0, 0.25], [0.32, 0.25], [0.64, 1.0]] : [[0, 0.32]];
          for (const [d, l] of parts) {
            const c = this.ctx, osc = c.createOscillator(), lfo = c.createOscillator(), lg = c.createGain(), g = c.createGain();
            osc.type = 'sine'; osc.frequency.value = 2650; lfo.frequency.value = 38; lg.gain.value = 140;
            lfo.connect(lg); lg.connect(osc.frequency);
            g.gain.setValueAtTime(0.0001, t + d); g.gain.linearRampToValueAtTime(0.28, t + d + 0.02); g.gain.setValueAtTime(0.28, t + d + l - 0.05); g.gain.exponentialRampToValueAtTime(0.0001, t + d + l);
            osc.connect(g); g.connect(this.fx); osc.start(t + d); lfo.start(t + d); osc.stop(t + d + l + 0.05); lfo.stop(t + d + l + 0.05);
            this.noiseHit(t + d, l, 0.08, 'bandpass', 2600, 3, null, null, true, 0.02);
          }
          break;
        }
        case 'click': this.tone('square', 880, t, 0.05, 0.12, null, 660); break;
        case 'hover': this.tone('sine', 1320, t, 0.03, 0.05); break;
        case 'back': this.tone('square', 520, t, 0.07, 0.1, null, 330); break;
        case 'error': this.tone('square', 180, t, 0.18, 0.15, null, 120); break;
        case 'coin': this.tone('square', 988, t, 0.08, 0.12); this.tone('square', 1319, t + 0.07, 0.25, 0.12); break;
        case 'perfect': for (const [i, f] of [1047, 1319, 1568, 2093].entries()) this.tone('triangle', f, t + i * 0.045, 0.25, 0.18); break;
        case 'levelup': for (const [i, f] of [523, 659, 784, 1047, 784, 1047].entries()) this.tone('square', f, t + i * 0.09, 0.2, 0.12); break;
        case 'unlock': for (const [i, f] of [784, 988, 1175, 1568].entries()) this.tone('triangle', f, t + i * 0.07, 0.35, 0.16); break;
        case 'charge': this.tone('sawtooth', 220, t, 1.1, 0.05, null, 880, 0.05); break;
        case 'aim': this.tone('sine', 660, t, 0.04, 0.05); break;
        case 'heart': this.tone('sine', 58, t, 0.16, 0.55, null, 40); this.tone('sine', 52, t + 0.2, 0.14, 0.4, null, 38); break;
        case 'thunder': this.noiseHit(t, 2.8, 0.9, 'lowpass', 400, 0.5, null, 60, false, 0.08); this.noiseHit(t + 0.1, 1.5, 0.5, 'lowpass', 900, 0.5, null, 100, true, 0.02); break;
        case 'firework': this.noiseHit(t, 0.6, 0.35, 'lowpass', 2500, 0.5, null, 200, true); this.tone('sine', 90, t, 0.3, 0.3, null, 40); break;
        case 'swoosh': this.noiseHit(t, 0.35, 0.3, 'bandpass', 500, 1.5, null, 3000, true, 0.15); break;
        case 'step': this.noiseHit(t, 0.05, 0.12, 'lowpass', 500, 1, null, null, false); break;
      }
    },
    // ---- crowd ----
    startCrowd() {
      const c = this.ctx;
      const mk = (f, q, g) => {
        const s = c.createBufferSource(); s.buffer = this.noise; s.loop = true;
        const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f; bp.Q.value = q;
        const gg = c.createGain(); gg.gain.value = g;
        s.connect(bp); bp.connect(gg); gg.connect(this.crowdAmb); s.start();
        return gg;
      };
      this.crowdAmb = c.createGain(); this.crowdAmb.gain.value = 0.0001; this.crowdAmb.connect(this.crowdBus);
      this.cl1 = mk(520, 0.7, 0.9); this.cl2 = mk(1500, 1.1, 0.35); this.cl3 = mk(260, 0.9, 0.5);
      this._crowdTick = setInterval(() => {
        if (!this.ready) return;
        const t = this.now(), base = this.crowdLevel;
        this.crowdAmb.gain.setTargetAtTime(base * (0.85 + Math.random() * 0.3), t, 0.4);
        this.cl2.gain.setTargetAtTime(0.25 + Math.random() * 0.25, t, 0.3);
      }, 400);
    },
    setCrowd(level) { this.crowdLevel = level; },
    cheer(big = 1) {
      if (!this.ready) return;
      const t = this.now();
      this.voices(t, 3.2 * big, 18, 220, 520, 0.5 * big, null, 2400, 1.05);
      this.noiseHit(t, 3.4 * big, 0.9 * big, 'bandpass', 700, 0.6, this.crowdBus, 1300, false, 0.12);
      this.noiseHit(t + 0.1, 2.5, 0.35 * big, 'highpass', 2500, 0.5, this.crowdBus, null, true, 0.2);
    },
    groan() {
      if (!this.ready) return;
      const t = this.now();
      this.voices(t, 2.0, 16, 140, 260, 0.45, null, 900, 0.82);
      this.noiseHit(t, 1.8, 0.35, 'bandpass', 500, 0.8, this.crowdBus, 280, false, 0.1);
    },
    ooh() {
      if (!this.ready) return;
      const t = this.now();
      this.voices(t, 1.6, 14, 180, 330, 0.42, null, 1200, 1.12);
    },
    // ---- music sequencer ----
    playMusic(name) {
      this._wantTrack = name;
      if (!this.ready || this.track === name) return;
      this.stopMusic();
      this.track = name;
      const T = TRACKS[name];
      if (!T) return;
      this.step = 0;
      this.nextT = this.now() + 0.1;
      const out = this.ctx.createGain(); out.gain.value = 1; out.connect(this.music);
      this.trackOut = out;
      this._seq = setInterval(() => {
        const spb = 60 / T.bpm / 4;
        while (this.nextT < this.now() + 0.25) {
          T.step(this, this.step, this.nextT, spb, out);
          this.step++;
          this.nextT += spb;
          if (T.once && this.step >= T.len) { clearInterval(this._seq); this._seq = null; this.track = null; break; }
        }
      }, 50);
    },
    stopMusic() {
      if (this._seq) clearInterval(this._seq);
      this._seq = null; this.track = null;
      if (this.trackOut) { const g = this.trackOut; g.gain.setTargetAtTime(0.0001, this.now(), 0.2); setTimeout(() => g.disconnect(), 1500); this.trackOut = null; }
    },
  });

  const NOTE = (n) => 440 * Math.pow(2, (n - 69) / 12);
  function drum(a, kind, t, out, g = 1) {
    if (kind === 'k') a.tone('sine', 140, t, 0.22, 0.7 * g, out, 42);
    else if (kind === 's') { a.noiseHit(t, 0.16, 0.35 * g, 'bandpass', 1800, 0.8, out, 900, true); a.tone('triangle', 200, t, 0.08, 0.2 * g, out, 150); }
    else if (kind === 'h') a.noiseHit(t, 0.04, 0.12 * g, 'highpass', 7000, 0.6, out, null, true);
    else if (kind === 't') a.tone('sine', 98, t, 0.6, 0.55 * g, out, 70, 0.01);
  }
  function pad(a, notes, t, dur, out, g) {
    for (const n of notes) {
      const c = a.ctx, o = c.createOscillator(), o2 = c.createOscillator(), lp = c.createBiquadFilter(), gg = c.createGain();
      o.type = 'sawtooth'; o2.type = 'sawtooth'; o.frequency.value = NOTE(n); o2.frequency.value = NOTE(n) * 1.006;
      lp.type = 'lowpass'; lp.frequency.value = 1100;
      gg.gain.setValueAtTime(0.0001, t); gg.gain.linearRampToValueAtTime(g, t + dur * 0.3); gg.gain.linearRampToValueAtTime(0.0001, t + dur);
      o.connect(lp); o2.connect(lp); lp.connect(gg); gg.connect(out);
      o.start(t); o2.start(t); o.stop(t + dur + 0.05); o2.stop(t + dur + 0.05);
    }
  }
  const TRACKS = {
    menu: {
      bpm: 122,
      step(a, s, t, spb, out) {
        const chords = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]];
        const bar = Math.floor(s / 16) % 4, i = s % 16, ch = chords[bar];
        if (i % 4 === 0) drum(a, 'k', t, out);
        if (i === 4 || i === 12) drum(a, 's', t, out);
        if (i % 2 === 0) drum(a, 'h', t, out, i % 4 === 2 ? 1.2 : 0.6);
        if (i % 2 === 0) a.tone('triangle', NOTE(ch[0] - 12 + (i % 8 === 6 ? 7 : 0)), t, spb * 1.8, 0.32, out);
        if (i === 0) pad(a, ch, t, spb * 16, out, 0.05);
        const arp = [0, 1, 2, 1, 2, 0, 2, 1];
        if (s % 64 >= 32 || i % 2 === 0) a.tone('square', NOTE(ch[arp[i % 8]] + 12), t, spb * 0.9, 0.045, out);
        if (s % 128 >= 64 && (i === 0 || i === 6 || i === 10)) a.tone('square', NOTE(ch[(i / 4) | 0 % 3] + 24), t, spb * 2.5, 0.04, out);
      },
    },
    tension: {
      bpm: 92,
      step(a, s, t, spb, out) {
        const roots = [50, 50, 46, 48];
        const bar = Math.floor(s / 16) % 4, i = s % 16, r = roots[bar];
        if (i % 2 === 0) a.tone('triangle', NOTE(r - 12), t, spb * 1.5, i % 4 === 0 ? 0.4 : 0.22, out);
        if (i === 0) { drum(a, 't', t, out, 1); pad(a, [r, r + 3, r + 7], t, spb * 16, out, 0.035); }
        if (i === 8 && bar % 2 === 1) drum(a, 't', t, out, 0.7);
        if (i % 4 === 2) drum(a, 'h', t, out, 0.5);
        if (i === 14 && bar === 3) a.tone('square', NOTE(r + 15), t, spb * 2, 0.03, out);
      },
    },
    victory: {
      bpm: 132, once: true, len: 48,
      step(a, s, t, spb, out) {
        const mel = { 0: 60, 2: 64, 4: 67, 6: 72, 12: 67, 14: 72, 16: 76, 24: 74, 26: 76, 28: 79, 32: 84 };
        if (mel[s]) { a.tone('sawtooth', NOTE(mel[s]), t, spb * (s >= 32 ? 10 : 3), 0.09, out); a.tone('square', NOTE(mel[s] - 12), t, spb * 2, 0.05, out); }
        if (s % 4 === 0 && s < 40) drum(a, 'k', t, out, 0.8);
        if (s % 8 === 4 && s < 40) drum(a, 's', t, out);
        if (s === 0 || s === 16 || s === 32) pad(a, s === 32 ? [60, 64, 67, 72] : [60, 64, 67], t, spb * 16, out, 0.05);
      },
    },
    defeat: {
      bpm: 80, once: true, len: 32,
      step(a, s, t, spb, out) {
        const mel = { 0: 67, 4: 65, 8: 63, 12: 62, 16: 60 };
        if (mel[s]) a.tone('triangle', NOTE(mel[s]), t, spb * (s === 16 ? 12 : 4), 0.12, out);
        if (s === 0) pad(a, [48, 51, 55], t, spb * 16, out, 0.05);
        if (s === 16) pad(a, [44, 48, 51], t, spb * 16, out, 0.05);
      },
    },
  };
  A.TRACKS = TRACKS;
})(typeof window !== 'undefined' ? window : globalThis);
