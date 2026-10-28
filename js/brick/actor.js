// 天機策 in bricks: each character as a minifigure in its own colours (the robe printed on the torso, a topknot,
// a crown, long hair down the back, the sword in its hand), moved by the same story as the puppets: the arms from the
// story's arm targets (the cuts, parries, palms), the feet from its footwork, through the same springs; a minifig has
// only hips, shoulders, wrists and a turning head, so the rest is the whole figure leaning, rocking and hopping.
// The same named points as the puppets (chest, head, eye, handR, tipR, ...) so the effects and cameras find them.
import * as THREE from '../../lib/three.module.min.js';
import { CHARACTERS } from '../cast/characters.js?v=15';
import { makeFig, plastic, rbox } from './minifig.js?v=1';

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const cl = (v, a = -1, b = 1) => Math.max(a, Math.min(b, v));
const HZ = 60, SCALE = 1.16; // a minifig stands 1.55; the story's people stand about 1.8
const REST = { R: { s: -0.35, e: -0.6, w: 0.25, a: 0.1 }, L: { s: -0.15, e: -0.4, w: 0, a: 0.05 } };
const GUARD = { R: { s: -0.75, e: -0.85, w: 0.65, a: 0.18 }, L: { s: -0.55, e: -1.95, w: 0, a: 0.08 } };
const EASE = { R: { s: -0.1, e: -0.28, w: 0.35, a: 0.05 }, L: { s: -0.28, e: -0.95, w: 0.1, a: 0.02 } };
const mix = (a, b, k) => ({ s: a.s + (b.s - a.s) * k, e: a.e + (b.e - a.e) * k, w: (a.w || 0) + ((b.w || 0) - (a.w || 0)) * k, a: (a.a || 0) + ((b.a || 0) - (a.a || 0)) * k });
function spring(targets, w, z, sub = 4) { const out = new Float32Array(targets.length); let x = targets[0], v = 0; const dt = 1 / HZ / sub; for (let i = 0; i < targets.length; i++) { for (let s = 0; s < sub; s++) { v += (w * w * (targets[i] - x) - 2 * z * w * v) * dt; x += v * dt; } out[i] = x; } return out; }
const shade = (hex, k) => { const c = new THREE.Color(hex); c.multiplyScalar(k); return '#' + c.getHexString(); };

// a character's look, as a minifig
function figSpec(C) {
  const R = C.robe || {}, F = C.face || {}, fem = !!F.fem, bald = !C.hair?.color;
  return {
    age: 'adult', longSkirt: fem, lashes: fem, swordBrows: F.brow === 'sword' || F.brow === 'demon', paint: F.paint === 'demon' ? 'demon' : null, paintColor: F.paintColor,
    mark: F.mark || null, markColor: F.markColor, mask: C.crown?.type === 'mask' || C.mask ? '#c8ccd8' : null, cheeks: fem,
    colors: { top: R.base || '#888888', bottom: R.skirtBase || shade(R.base || '#888888', 0.8), shoes: '#2a2228' },
    outfit: { top: 'robe', bottom: fem ? 'skirt' : 'pants' }, robe: R, hair: { style: bald ? 'bald' : 'short', color: C.hair?.color || '#1a1410' },
  };
}
// what goes on top: a topknot with its crown, long hair behind, and the weapons in the hands
function dress(F, C) {
  const M = plastic(C.hair?.color || '#1a1410', { roughness: 0.4 }), H = F.headP, mesh = (g, m, p = H) => { const o = new THREE.Mesh(g, m); o.castShadow = true; p.add(o); return o; };
  const cr = C.crown || {}, gold = plastic(cr.color || '#d8a838', { metalness: 0.4, roughness: 0.3 });
  if (C.hair?.color) {
    if ((C.hair.len ?? 1) >= 0.7) { const b = mesh(rbox(9.6, 12 * Math.min(1.6, C.hair.len), 3.0, 1.2), M); b.position.set(0, 4.6 - 6 * Math.min(1.6, C.hair.len), -4.6); b.rotation.x = -0.12; }
    if (cr.type !== 'hood') { const knot = mesh(new THREE.CylinderGeometry(2.0, 2.4, 3.2, 16), M); knot.position.set(0, 12.2, -0.6); }
  }
  if (cr.type === 'coronet' || cr.type === 'halfup' || cr.type === 'hairpin' || cr.type === 'bun') { const c = mesh(new THREE.CylinderGeometry(2.7, 3.0, 2.0, 16, 1, true), gold); c.position.set(0, 12.0, -0.6); c.material.side = THREE.DoubleSide; if (cr.gem) { const g = mesh(new THREE.SphereGeometry(0.9, 12, 10), new THREE.MeshPhysicalMaterial({ color: cr.gem, emissive: cr.gem, emissiveIntensity: 0.4, roughness: 0.1 })); g.position.set(0, 12.2, 2.2); } if (cr.type === 'hairpin') { const pin = mesh(new THREE.CylinderGeometry(0.35, 0.35, 10, 8), gold); pin.rotation.z = Math.PI / 2; pin.position.set(0, 12.6, -0.6); } }
  if (cr.type === 'horns') for (const s of [-1, 1]) { const h = mesh(new THREE.ConeGeometry(1.4, 6, 10), gold); h.position.set(s * 3.6, 12.2, 0); h.rotation.z = -s * 0.5; }
  if (cr.type === 'hood') { const h = mesh(new THREE.SphereGeometry(6.6, 30, 16, 0, Math.PI * 2, 0, Math.PI * 0.62), plastic(cr.color || '#2a2a2a')); h.position.y = 5.2; h.scale.set(1, 1.05, 1.08); }
  // the weapons, held in the hand's grip: a blade pointing ahead and up
  const weap = {};
  for (const [side, type] of Object.entries(C.weapons || {})) {
    const hand = F.hands[side === 'R' ? 0 : 1], g = new THREE.Group(); hand.add(g); g.rotation.set(0, 0, 0);
    const len = type === 'dagger' ? 11 : type === 'saber' ? 22 : type === 'fan' ? 0 : type === 'claw' ? 0 : 24;
    if (len) {
      mesh(new THREE.CylinderGeometry(0.75, 0.75, 6, 10), plastic('#2a1a14'), g).position.set(0, 0, 0);
      const guard = mesh(rbox(5.2, 1.0, 1.6, 0.4), plastic('#d8a838', { metalness: 0.5 }), g); guard.position.set(0, 3.2, 0);
      const bl = mesh(rbox(type === 'saber' ? 2.6 : 1.8, len, 0.5, 0.25), new THREE.MeshPhysicalMaterial({ color: '#e8eef4', metalness: 0.85, roughness: 0.18, clearcoat: 1 }), g); bl.position.set(0, 3.7 + len / 2, 0);
    } else if (type === 'fan') { const f = mesh(new THREE.CylinderGeometry(8, 8, 0.5, 20, 1, false, -0.9, 1.8), plastic('#f4eee0'), g); f.rotation.x = Math.PI / 2; f.position.y = 1; }
    else { for (const dx of [-1.2, 0, 1.2]) { const c = mesh(new THREE.ConeGeometry(0.5, 6, 6), plastic('#c8ccd4', { metalness: 0.8 }), g); c.position.set(dx, 4, 0); } }
    g.rotation.x = Math.PI / 2; // through the hand's grip, the blade toward the front
    const tip = new THREE.Object3D(); tip.position.set(0, 3.7 + Math.max(len, 6), 0); g.add(tip);
    weap['w' + side] = { type, group: g, tip };
  }
  return weap;
}

function brickActor(scene, A, C, rt) {
  const F = makeFig(figSpec(C)); F.root.scale.setScalar(SCALE * (C.scale || 1)); scene.add(F.root);
  const weap = dress(F, C), LEN = rt.story.LEN, N = Math.ceil(LEN * HZ) + 2;
  let CH = null, mouthK = 0, lastFace = {};
  function raw(s) { // the same as the puppets: the arms from the story, or at ease, at rest, on guard
    const p = s.pose, st = p.stance ?? 1, g = Math.max(st * 0.8, p.guard || 0);
    const arm = (k) => { const base = st < 0.5 && !(p.guard > st) ? mix(EASE[k], REST[k], Math.min(1, g / 0.4)) : mix(REST[k], GUARD[k], Math.min(1, g)); const set = p['arm' + k]; const a = set ? { s: set.s, e: set.e, w: p['wrist' + k] ?? 0, a: p['abd' + k] ?? base.a } : base; a.s += (p['kick' + k] || 0) * 0.8; return a; };
    s._g = Math.min(1, g);
    return { lean: (p.lean || 0) + 0.06 * (p.crouch || 0) + 0.25 * (s.kneel || 0), roll: (p.roll || 0) + (p.sway || 0) * 0.03, crouch: Math.min(1.3, (p.crouch || 0) + 0.8 * (s.kneel || 0)), headY: p.look || 0, R: arm('R'), L: arm('L') };
  }
  function bake() {
    const keys = ['lean', 'roll', 'crouch', 'headY'], ak = ['s', 'e', 'w', 'a'], T = {}; for (const k of keys) T[k] = new Float32Array(N); for (const sd of ['R', 'L']) for (const k of ak) T[sd + k] = new Float32Array(N);
    const pos = [], yaw = [], G = new Float32Array(N), kn = new Float32Array(N);
    for (let i = 0; i < N; i++) { const t = i / HZ, s = rt.state(A.id, t); s.t = t; const r = raw(s); for (const k of keys) T[k][i] = r[k]; for (const sd of ['R', 'L']) for (const k of ak) T[sd + k][i] = r[sd][k]; pos.push(rt.pos(A.id, t)); yaw.push(rt.yaw(A.id, t)); G[i] = s._g || 0; kn[i] = s.kneel || 0; }
    CH = {}; for (const k of keys) CH[k] = spring(T[k], 13, 0.65); for (const sd of ['R', 'L']) for (const k of ak) CH[sd + k] = spring(T[sd + k], 20, 0.5);
    // the waddle: from how far it has gone and how fast, forward in its own frame
    const ph = new Float32Array(N), amp = new Float32Array(N), air = new Float32Array(N); let dist = 0;
    for (let i = 1; i < N - 1; i++) { const a = pos[i - 1], b = pos[i + 1], y = yaw[i], vx = (b.x - a.x) * HZ / 2, vz = (b.z - a.z) * HZ / 2, vf = vx * Math.sin(y) + vz * Math.cos(y); dist += Math.hypot(pos[i].x - a.x, pos[i].z - a.z); ph[i] = dist / 0.55 * Math.PI * Math.sign(vf || 1); amp[i] = Math.min(1, Math.abs(vf) / 0.9); air[i] = Math.min(1, Math.max(0, (pos[i].y || 0) - 0.05) * 3); }
    CH.amp = spring(amp, 10, 0.8); CH.ph = ph; CH.air = spring(air, 14, 0.7); CH.g = spring(G, 10, 0.8); CH.kn = spring(kn, 10, 0.8);
  }
  const at = (arr, t) => { const q = Math.max(0, Math.min(N - 1.001, t * HZ)), i = Math.floor(q), f = q - i; return arr[i] + (arr[i + 1] - arr[i]) * f; };
  const wp = (o, x, y, z) => o.localToWorld(V(x, y, z));
  const points = {
    head: () => wp(F.headP, 0, 4.6, 0), eye: () => wp(F.headP, 0, 4.8, 5.4), spot: () => wp(F.headP, 0, 13, 0), chest: () => wp(F.body, 0, 21, 4.4), root: () => F.root.getWorldPosition(V()),
    handR: () => F.hands[0].getWorldPosition(V()), handL: () => F.hands[1].getWorldPosition(V()), shoulderR: () => F.arms[0].getWorldPosition(V()), shoulderL: () => F.arms[1].getWorldPosition(V()),
    tipR: () => (weap.wR ? weap.wR.tip.getWorldPosition(V()) : F.hands[0].getWorldPosition(V())), tipL: () => (weap.wL ? weap.wL.tip.getWorldPosition(V()) : F.hands[1].getWorldPosition(V())),
    launcher: () => F.hands[0].getWorldPosition(V()), muzzle: () => F.hands[0].getWorldPosition(V()),
    front: (off = [0, 0, 0.9]) => { const r = F.root, y = r.rotation.y, [ox, oy, oz] = off; return V(r.position.x + Math.cos(y) * ox + Math.sin(y) * oz, r.position.y + oy, r.position.z - Math.sin(y) * ox + Math.cos(y) * oz); },
  };
  const face = (s) => {
    const f = { mouth: { open: mouthK, smile: s.dead ? 0 : 0.3, wide: 0.5, round: mouthK > 0.4 ? 0.3 : 0 }, brow: 0, browIn: (s.pose.stance ?? 1) > 0.6 ? 0.5 : 0, blink: s.dead ? 1 : ((s.t * 0.31 + A.i * 0.17) % 1 < 0.025 ? 1 : 0), look: [0, 0] };
    if (s.qi > 0.5) { f.browIn = 1; f.mouth.smile = -0.2; }
    lastFace = f; F.face(f);
  };
  return {
    kind: 'puppet', A, C, P: F, points, frames: { head: F.headP, chest: F.body, root: F.root }, weap, m: { head: F.headP, torso: F.body },
    looseOf: (what) => (what === 'wR' ? weap.wR?.group : what === 'wL' ? weap.wL?.group : what === 'armR' ? F.arms[0] : what === 'armL' ? F.arms[1] : null),
    bake,
    mouth: (k) => { mouthK = Math.max(0, Math.min(1, k * 1.3)); if (lastFace.mouth) { lastFace.mouth.open = mouthK; lastFace.mouth.round = mouthK > 0.4 ? 0.3 : 0; F.face(lastFace); } },
    pose(t, s, other) {
      const p = rt.pos(A.id, t), R = { s: at(CH.Rs, t), e: at(CH.Re, t), w: at(CH.Rw, t), a: at(CH.Ra, t) }, L = { s: at(CH.Ls, t), e: at(CH.Le, t), w: at(CH.Lw, t), a: at(CH.La, t) };
      const amp = at(CH.amp, t), ph = at(CH.ph, t), air = at(CH.air, t), g = at(CH.g, t), kneel = at(CH.kn, t), crouch = at(CH.crouch, t), sw = Math.sin(ph) * amp;
      F.root.visible = !s.hidden;
      const yaw = rt.yaw(A.id, t) + (s.spin || 0), dead = s.dead ? 1 : 0;
      const legF = -0.28 * g - 0.5 * kneel - 0.25 * crouch, legB = 0.22 * g + 0.25 * kneel + 0.15 * crouch; // the bow stance: a leg forward, a leg back
      F.pose({
        x: p.x, y: (p.y || 0) - (s.sink || 0) + 0.05 * amp * Math.abs(Math.sin(ph)) - 0.12 * crouch - 0.22 * kneel + dead * 0.18, z: p.z, yaw,
        tilt: at(CH.lean, t) * 0.8 + (s.flip || 0) + (s.tilt || 0) + 0.05 * amp - dead * 1.5, roll: at(CH.roll, t) + 0.06 * sw,
        hipR: legF + sw * 0.6 - air * 0.7, hipL: legB - sw * 0.6 + air * 0.3,
        armR: R.s + R.e * 0.5 - sw * 0.35 * (1 - g), armL: L.s + L.e * 0.5 + sw * 0.35 * (1 - g), outR: R.a, outL: L.a, wristR: R.w, wristL: L.w,
        head: at(CH.headY, t) * 0.8,
      });
      // the head turns to whoever it watches
      if (other && !s.dead && (s.lookW ?? 0.85) > 0.01) { F.root.updateMatrixWorld(true); const h = F.headP.getWorldPosition(V()), d = other.clone().sub(h), want = Math.atan2(d.x, d.z); let a = want - yaw; a = Math.atan2(Math.sin(a), Math.cos(a)); F.headP.rotation.y += cl(a, -0.9, 0.9) * (s.lookW ?? 0.85); }
      for (const [k, w] of Object.entries(weap)) w.group.visible = !s.gone?.[k];
      F.arms[0].visible = !(s.hp?.armR <= 0); F.arms[1].visible = !(s.hp?.armL <= 0);
      face(s);
    },
  };
}

export function buildBrickActors(scene, rt) {
  const views = {};
  for (const A of rt.actors) { const C = CHARACTERS[A.who]; if (!C || C.kind !== 'puppet') continue; views[A.id] = brickActor(scene, A, { ...C, ...(A.look || {}) }, rt); }
  return views;
}
