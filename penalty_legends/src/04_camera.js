/* PENALTY LEGENDS — perspective camera (world meters -> low-res screen pixels) */
(function (G) {
  'use strict';
  const PL = G.PL;

  class Camera {
    constructor(W, H) { this.set(W, H, { x: 0, y: 2.0, z: -8.6 }, 0.07, 1.0); }
    // pitch: radians looking down; zoom: focal multiplier relative to height
    set(W, H, pos, pitch, zoom, yaw = 0) {
      this.W = W; this.H = H; this.pos = pos; this.pitch = pitch; this.yaw = yaw;
      const cp = Math.cos(pitch), sp = Math.sin(pitch), cy = Math.cos(yaw), sy = Math.sin(yaw);
      this.f = { x: sy * cp, y: -sp, z: cy * cp };
      this.r = { x: cy, y: 0, z: -sy };
      this.u = { x: sy * sp, y: cp, z: cy * sp };
      // focal length in pixels; keep the goal wide enough but inside narrow screens
      const base = H * 2.15 * zoom;
      const maxByWidth = (W * 0.92 * (11 - pos.z)) / 7.6 / zoom;
      this.F = Math.min(base, maxByWidth * zoom);
      this.cx = W / 2; this.cy = H / 2;
      return this;
    }
    // returns {x,y,z(depth)} ; z<=0 means behind
    project(p) {
      const dx = p.x - this.pos.x, dy = p.y - this.pos.y, dz = p.z - this.pos.z;
      const Z = dx * this.f.x + dy * this.f.y + dz * this.f.z;
      const X = dx * this.r.x + dy * this.r.y + dz * this.r.z;
      const Y = dx * this.u.x + dy * this.u.y + dz * this.u.z;
      if (Z < 0.05) return { x: 0, y: 0, z: -1, s: 0 };
      const s = this.F / Z;
      return { x: this.cx + X * s, y: this.cy - Y * s, z: Z, s };
    }
    ray(sx, sy) {
      const X = (sx - this.cx) / this.F, Y = -(sy - this.cy) / this.F;
      const d = {
        x: this.r.x * X + this.u.x * Y + this.f.x,
        y: this.r.y * X + this.u.y * Y + this.f.y,
        z: this.r.z * X + this.u.z * Y + this.f.z,
      };
      return d;
    }
    // screen point -> point on plane z = zp (used for aiming with pointer)
    toPlaneZ(sx, sy, zp) {
      const d = this.ray(sx, sy);
      if (Math.abs(d.z) < 1e-6) return null;
      const t = (zp - this.pos.z) / d.z;
      return { x: this.pos.x + d.x * t, y: this.pos.y + d.y * t, z: zp };
    }
  }
  PL.Camera = Camera;
  // camera presets
  PL.CAM = {
    penalty: { pos: { x: 0, y: 2.25, z: -10.6 }, pitch: 0.055, zoom: 1.12 },
    keeper: { pos: { x: 0, y: 2.25, z: -10.6 }, pitch: 0.055, zoom: 1.12 },
    wide: { pos: { x: 0, y: 13, z: -36 }, pitch: 0.2, zoom: 0.62 },
    menu: { pos: { x: 3.2, y: 2.4, z: -7.6 }, pitch: 0.065, zoom: 1.05, yaw: -0.08 },
  };
})(typeof window !== 'undefined' ? window : globalThis);
