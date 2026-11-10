/* PENALTY LEGENDS — unified input: keyboard, mouse and touch (pointer events) + virtual buttons */
(function (G) {
  'use strict';
  const PL = G.PL;
  const KEYMAP = {
    ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down',
    KeyQ: 'curlL', KeyE: 'curlR', Space: 'action', Enter: 'action', NumpadEnter: 'action', KeyP: 'pause', Escape: 'pause',
    Digit1: 'tech1', Digit2: 'tech2', Digit3: 'tech3', Digit4: 'tech4', Numpad1: 'tech1', Numpad2: 'tech2', Numpad3: 'tech3', Numpad4: 'tech4', KeyR: 'paradinha',
  };
  const I = (PL.Input = {
    down: new Set(), pressedSet: new Set(), releasedSet: new Set(),
    pointer: { x: 0, y: 0, inside: false, down: false, type: 'mouse', moved: false, tap: null, dragging: false },
    wheel: 0, lastDevice: 'keyboard', canvas: null, enabled: true,
    attach(canvas) {
      this.canvas = canvas;
      G.addEventListener('keydown', (e) => {
        const a = KEYMAP[e.code];
        if (!a) return;
        if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
        if (PL.UI && PL.UI.modalOpen && a !== 'pause' && a !== 'action') return;
        if (['action', 'up', 'down', 'left', 'right'].includes(a) && PL.Game && PL.Game.activity && PL.Game.activity.captures) e.preventDefault();
        this.lastDevice = 'keyboard';
        if (!this.down.has(a)) this.pressedSet.add(a);
        this.down.add(a);
      });
      G.addEventListener('keyup', (e) => {
        const a = KEYMAP[e.code];
        if (!a) return;
        this.down.delete(a); this.releasedSet.add(a);
      });
      G.addEventListener('blur', () => { this.down.clear(); });
      const toLocal = (e) => {
        const r = canvas.getBoundingClientRect();
        this.pointer.x = ((e.clientX - r.left) / r.width) * canvas.width;
        this.pointer.y = ((e.clientY - r.top) / r.height) * canvas.height;
        this.pointer.inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      };
      canvas.addEventListener('pointerdown', (e) => {
        if (PL.Audio) PL.Audio.init();
        toLocal(e);
        this.pointer.type = e.pointerType || 'mouse';
        this.lastDevice = this.pointer.type === 'touch' ? 'touch' : 'mouse';
        this.pointer.down = true; this.pointer.moved = true; this.pointer.dragging = true; this.pointer.aimMove = this.pointer.type === 'touch';
        this.pointer.tap = { x: this.pointer.x, y: this.pointer.y };
        try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
        if (this.pointer.type !== 'touch' && e.button === 0) { this.pressedSet.add('action'); this.down.add('action'); this.pointerAction = true; }
        if (this.pointer.type === 'touch') this.pressedSet.add('tap');
        e.preventDefault();
      });
      canvas.addEventListener('pointermove', (e) => {
        toLocal(e);
        if (e.pointerType === 'mouse' || this.pointer.down) { this.pointer.moved = true; if (this.pointer.down) this.pointer.aimMove = true; this.pointer.type = e.pointerType || 'mouse'; if (e.pointerType === 'mouse') this.lastDevice = 'mouse'; }
      });
      const up = (e) => {
        toLocal(e);
        this.pointer.down = false; this.pointer.dragging = false;
        if (this.pointerAction) { this.down.delete('action'); this.releasedSet.add('action'); this.pointerAction = false; }
      };
      canvas.addEventListener('pointerup', up);
      canvas.addEventListener('pointercancel', up);
      canvas.addEventListener('wheel', (e) => { this.wheel += Math.sign(e.deltaY); e.preventDefault(); }, { passive: false });
      canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    },
    // virtual (on-screen) buttons
    vPress(a) { if (!this.down.has(a)) this.pressedSet.add(a); this.down.add(a); this.lastDevice = 'touch'; },
    vRelease(a) { if (this.down.has(a)) { this.down.delete(a); this.releasedSet.add(a); } },
    held(a) { return this.down.has(a); },
    pressed(a) { return this.pressedSet.has(a); },
    released(a) { return this.releasedSet.has(a); },
    consumeWheel() { const w = this.wheel; this.wheel = 0; return w; },
    consumeMove() { const m = this.pointer.moved; this.pointer.moved = false; return m; },
    consumeAimMove() { const m = this.pointer.aimMove; this.pointer.aimMove = false; return m; },
    consumeTap() { const t = this.pointer.tap; this.pointer.tap = null; return t; },
    endFrame() { this.pressedSet.clear(); this.releasedSet.clear(); },
    reset() { this.down.clear(); this.pressedSet.clear(); this.releasedSet.clear(); this.pointer.tap = null; this.wheel = 0; },
  });
})(typeof window !== 'undefined' ? window : globalThis);
