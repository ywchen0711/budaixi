// The actors on the stage: glove puppets (js/models/puppet.js), posed each frame from the runtime's state.
// The poses go through springs (the arms a little behind the body, the head behind them), and the cloth and hair
// are worked out from how the puppet moves: the skirt and sleeves swing, the hair and ribbons stream behind,
// the sword's tassel swings. All of it is run once over the whole film at load, so any frame stands on its own.
// Named points for the effects and the cameras: chest, head, eye, tipR, tipL, handR, handL, shoulderR, shoulderL, root, front
import * as THREE from '../../lib/three.module.min.js';
import { CHARACTERS } from '../cast/characters.js?v=3';
import { buildPuppet } from '../models/puppet.js?v=9';

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const cl = (v, a = -1, b = 1) => Math.max(a, Math.min(b, v));
const HZ = 60;
// how each puppet stands when the story does not move its arms: the sword held low and ready, the other hand's two
// fingers raised before the chest (劍指); relaxed, the hands rest lower
const REST = { R: { s: -0.35, e: -0.6, w: 0.25, a: 0.1 }, L: { s: -0.15, e: -0.4, w: 0, a: 0.05 } };
const GUARD = { R: { s: -0.75, e: -0.85, w: 0.65, a: 0.18 }, L: { s: -0.55, e: -1.95, w: 0, a: 0.08 } };
const mix = (a, b, k) => ({ s: a.s + (b.s - a.s) * k, e: a.e + (b.e - a.e) * k, w: (a.w || 0) + ((b.w || 0) - (a.w || 0)) * k, a: (a.a || 0) + ((b.a || 0) - (a.a || 0)) * k });

// a damped spring run over an array of targets
function spring(targets, w, z, sub = 4) {
  const out = new Float32Array(targets.length); let x = targets[0], v = 0; const dt = 1 / HZ / sub;
  for (let i = 0; i < targets.length; i++) { for (let s = 0; s < sub; s++) { v += (w * w * (targets[i] - x) - 2 * z * w * v) * dt; x += v * dt; } out[i] = x; }
  return out;
}

function puppet(scene, A, C, rt) {
  const P = buildPuppet(C); scene.add(P.group);
  const LEN = rt.story.LEN, N = Math.ceil(LEN * HZ) + 2;
  let CH = null, SEC = null;
  // the joint values for a state: arms from the story, or the rest / guard stance
  function raw(s) {
    const p = s.pose, st = p.stance ?? 1, g = Math.max(st * 0.8, p.guard || 0);
    const arm = (k) => { const base = mix(REST[k], GUARD[k], Math.min(1, g)); const set = p['arm' + k]; const a = set ? { s: set.s, e: set.e, w: p['wrist' + k] ?? 0, a: p['abd' + k] ?? base.a } : base; a.s += (p['kick' + k] || 0) * 0.8; return a; };
    return { lean: (p.lean || 0) + 0.06 * (p.crouch || 0) + 0.25 * (s.kneel || 0), twist: (p.twist || 0) - 0.2, roll: (p.roll || 0) + (p.sway || 0) * 0.03, crouch: Math.min(1.3, (p.crouch || 0) + 0.8 * (s.kneel || 0)), headX: -(p.headKick || 0) * 0.5, headY: p.look || 0, R: arm('R'), L: arm('L') };
  }
  function bake() {
    const keys = ['lean', 'twist', 'roll', 'crouch', 'headX', 'headY'], armK = ['s', 'e', 'w', 'a'];
    const T = {}; for (const k of keys) T[k] = new Float32Array(N); for (const s of ['R', 'L']) for (const k of armK) T[s + k] = new Float32Array(N);
    const pos = [], yaw = [];
    for (let i = 0; i < N; i++) {
      const t = i / HZ, s = rt.state(A.id, t), r = raw(s);
      for (const k of keys) T[k][i] = r[k]; for (const sd of ['R', 'L']) for (const k of armK) T[sd + k][i] = r[sd][k];
      pos.push(rt.pos(A.id, t)); yaw.push(rt.yaw(A.id, t) + (s.spin || 0));
    }
    // springs: the body quick, the head slower; the arms quickest, with a little overshoot
    const W = { lean: [14, 0.7], twist: [14, 0.65], roll: [12, 0.6], crouch: [16, 0.8], headX: [10, 0.55], headY: [9, 0.6] };
    CH = {}; for (const k of keys) CH[k] = spring(T[k], ...W[k]); for (const sd of ['R', 'L']) for (const k of armK) CH[sd + k] = spring(T[sd + k], 24, 0.6);
    // the cloth and hair: from the puppet's motion in its own frame (forward, sideways, up) and the arms' movement
    const vf = new Float32Array(N), vs = new Float32Array(N), vy = new Float32Array(N), af = new Float32Array(N), dist = new Float32Array(N);
    for (let i = 1; i < N - 1; i++) {
      const a = pos[i - 1], b = pos[i + 1], c = pos[i], y = yaw[i], fx = Math.sin(y), fz = Math.cos(y);
      const vx = (b.x - a.x) * HZ / 2, vz = (b.z - a.z) * HZ / 2; vf[i] = vx * fx + vz * fz; vs[i] = vx * fz - vz * fx; vy[i] = (b.y - a.y) * HZ / 2;
      af[i] = ((b.x - 2 * c.x + a.x) * fx + (b.z - 2 * c.z + a.z) * fz) * HZ * HZ; dist[i] = dist[i - 1] + Math.hypot(c.x - a.x, c.z - a.z) / 2;
    }
    const spin = new Float32Array(N); for (let i = 1; i < N - 1; i++) { let d = yaw[i + 1] - yaw[i - 1]; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; spin[i] = d * HZ / 2; }
    const map = (f) => { const o = new Float32Array(N); for (let i = 0; i < N; i++) o[i] = f(i); return o; };
    const wind = (i, k) => Math.sin(i / HZ * (1.3 + k * 0.4) + A.i + k) * 0.05;
    const lift = (i) => cl(vy[i] * 0.25, -0.6, 1.2);
    SEC = {
      skirtX: spring(map((i) => cl(0.05 * vf[i] + 0.012 * af[i] - 0.25 * lift(i), -0.5, 0.5)), 8, 0.3),
      skirtZ: spring(map((i) => cl(-0.06 * vs[i] + 0.02 * spin[i], -0.5, 0.5)), 8, 0.3),
      dropR: spring(map((i) => cl(-0.06 * (CH.Rs[Math.min(N - 1, i + 1)] - CH.Rs[Math.max(0, i - 1)]) * HZ + 0.06 * vf[i], -0.9, 0.9)), 9, 0.35),
      dropL: spring(map((i) => cl(-0.06 * (CH.Ls[Math.min(N - 1, i + 1)] - CH.Ls[Math.max(0, i - 1)]) * HZ + 0.06 * vf[i], -0.9, 0.9)), 9, 0.35),
      tassel: spring(map((i) => cl(0.2 * vf[i] - 0.03 * (CH.Rw[Math.min(N - 1, i + 1)] - CH.Rw[Math.max(0, i - 1)]) * HZ, -1.2, 1.2)), 6, 0.25),
      hair: [0, 1, 2, 3].map((k) => spring(map((i) => (k === 0 ? -(CH.lean[i] + CH.headX[i]) * 0.9 + 0.1 : 0) + cl((0.07 + 0.03 * k) * vf[i] + 0.012 * af[i] + 0.25 * lift(i), -0.3, 0.9) + wind(i, k)), 7 - k, 0.32)),
      hairZ: [0, 1, 2, 3].map((k) => spring(map((i) => cl(-0.05 * vs[i] + 0.03 * spin[i], -0.6, 0.6) + wind(i, k + 4) * 0.6), 6 - k * 0.8, 0.3)),
      cape: [0, 1, 2, 3].map((k) => spring(map((i) => (k === 0 ? 0.15 - CH.lean[i] * 0.8 : 0.04) + cl((0.1 + 0.04 * k) * vf[i] + 0.015 * af[i] + 0.3 * lift(i), -0.2, 1.2) + wind(i, k) * 1.5), 6 - k * 0.7, 0.3)),
      rib: [0, 1, 2, 3, 4, 5].map((k) => spring(map((i) => 0.25 + cl((0.1 + 0.05 * k) * vf[i] + 0.35 * lift(i), -0.2, 1.3) + wind(i, k) * 2), 6 - k * 0.6, 0.28)),
      ribZ: [0, 1, 2, 3, 4, 5].map((k) => spring(map((i) => 0.25 + cl(-0.06 * vs[i], -0.6, 0.6) + wind(i, k + 2)), 5 - k * 0.5, 0.3)),
      // the puppeteer's hand bobs the puppet as it goes, a hop for every stride
      bob: map((i) => 0.035 * Math.abs(Math.sin(dist[i] * 4.2)) * Math.min(1, Math.abs(vf[i]) / 0.6) + 0.006 * Math.sin(i / HZ * 2.1 + A.i)),
    };
  }
  const at = (arr, t) => { const q = Math.max(0, Math.min(N - 1.001, t * HZ)), i = Math.floor(q), f = q - i; return arr[i] + (arr[i + 1] - arr[i]) * f; };
  const frames = { head: P.parts.head, chest: P.parts.torso, root: P.group };
  // an arm pointed at a place (a parry meeting a blade)
  function reach(Arm, target, w) {
    const t = Arm.sh.parent.worldToLocal(target.clone()).sub(Arm.sh.position);
    const pitch = -Math.atan2(t.z, -t.y), abd = Math.atan2(Arm.side * t.x, Math.hypot(t.y, t.z));
    Arm.up.rotation.x += (pitch * 0.9 - Arm.up.rotation.x) * w; Arm.el.rotation.x += (-0.35 - Arm.el.rotation.x) * w; Arm.sh.rotation.z += (Arm.side * (0.1 + cl(abd, -0.6, 0.9)) - Arm.sh.rotation.z) * w;
  }
  return {
    kind: 'puppet', A, C, P, points: P.points, frames, weap: Object.fromEntries(Object.entries(P.weap).map(([k, w]) => ['w' + k, w])), m: { head: P.parts.head, torso: P.parts.torso },
    looseOf: (what) => (what === 'wR' ? P.weap.R?.group : what === 'wL' ? P.weap.L?.group : what === 'armR' ? P.parts.armR.sh : what === 'armL' ? P.parts.armL.sh : null),
    bake,
    pose(t, s, other, aimAt, resolve) {
      const p = rt.pos(A.id, t);
      P.group.visible = !s.hidden; P.group.position.set(p.x, p.y - (s.sink || 0), p.z); P.group.rotation.y = rt.yaw(A.id, t) + (s.spin || 0);
      P.body.rotation.x = (s.flip || 0) + (s.tilt || 0); P.body.position.y = s.flip ? 0.6 * Math.sin(Math.abs(s.flip) / 2) : 0;
      const ch = { lean: at(CH.lean, t), twist: at(CH.twist, t), roll: at(CH.roll, t), crouch: at(CH.crouch, t), headX: at(CH.headX, t), headY: at(CH.headY, t), bob: at(SEC.bob, t),
        R: { s: at(CH.Rs, t), e: at(CH.Re, t), w: at(CH.Rw, t), a: at(CH.Ra, t) }, L: { s: at(CH.Ls, t), e: at(CH.Le, t), w: at(CH.Lw, t), a: at(CH.La, t) } };
      const sec = { skirtX: at(SEC.skirtX, t), skirtZ: at(SEC.skirtZ, t), dropR: at(SEC.dropR, t), dropL: at(SEC.dropL, t), tassel: at(SEC.tassel, t),
        hairX: SEC.hair.map((a) => at(a, t)), hairZ: SEC.hairZ.map((a) => at(a, t)), lockX: [SEC.hair[0] ? at(SEC.hair[0], t) * 0.5 : 0], capeX: SEC.cape.map((a) => at(a, t)), capeZ: [at(SEC.skirtZ, t)],
        ribX: SEC.rib.map((a) => at(a, t)), ribZ: SEC.ribZ.map((a) => at(a, t)) };
      P.pose(ch, sec);
      // the head turns to whoever it watches
      if (other && !s.dead && (s.lookW ?? 0.85) > 0.01) {
        const h = P.parts.head; h.updateWorldMatrix(true, false); const d = other.clone().sub(h.getWorldPosition(V()));
        d.applyQuaternion(P.parts.torso.getWorldQuaternion(new THREE.Quaternion()).invert());
        const w = s.lookW ?? 0.85; h.rotation.y += cl(Math.atan2(d.x, d.z), -0.9, 0.9) * w; h.rotation.x += cl(Math.atan2(-d.y, Math.hypot(d.x, d.z)), -0.5, 0.5) * w * 0.7;
      }
      if (s.ik && resolve) { P.group.updateMatrixWorld(true); for (const k of s.ik) { const tg = resolve(k.to, t); if (tg) reach(k.side === 'R' ? P.parts.armR : P.parts.armL, tg, Math.min(1, k.w)); } }
      for (const [k, w] of Object.entries(P.weap)) w.group.visible = !s.gone['w' + k] && !(k === 'R' ? s.hp.armR <= 0 : s.hp.armL <= 0);
      P.parts.armR.sh.visible = s.hp.armR > 0; P.parts.armL.sh.visible = s.hp.armL > 0;
    },
  };
}

export function buildActors(scene, rt) {
  const views = {};
  for (const A of rt.actors) { const C = CHARACTERS[A.who]; if (!C || C.kind !== 'puppet') continue; views[A.id] = puppet(scene, A, C, rt); }
  return views;
}
