// Retargets CMU BVH motion onto the Universal Animation Library skeleton (the bodies of Budaixi), by matching the
// direction of every bone, with each limb's twist taken from the bend of the limb below it.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { BVHLoader } from 'three/examples/jsm/loaders/BVHLoader.js';
import fs from 'fs';

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z), Q = () => new THREE.Quaternion();
export async function target() {
  const buf = fs.readFileSync('C:/Budaixi/models/ual1.glb');
  const g = await new Promise((res, rej) => new GLTFLoader().parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), '', res, rej));
  let sk = null; g.scene.traverse((o) => { if (o.isSkinnedMesh && !sk) sk = o.skeleton; }); g.scene.updateMatrixWorld(true);
  const B = Object.fromEntries(sk.bones.map((b) => [b.name, b]));
  const rest = {}; for (const b of sk.bones) rest[b.name] = { L: b.quaternion.clone(), P: b.position.clone(), W: b.getWorldQuaternion(Q()), p: b.getWorldPosition(V()) };
  return { scene: g.scene, sk, B, rest, clips: g.animations };
}
export function loadBVH(file) { return new BVHLoader().parse(fs.readFileSync(file, 'utf8')); }

// the source joints' world positions at each sample
export function sample(bvh, t0, t1, hz = 30) {
  const root = bvh.skeleton.bones[0], mixer = new THREE.AnimationMixer(root), a = mixer.clipAction(bvh.clip); a.play();
  const J = Object.fromEntries(bvh.skeleton.bones.map((b) => [b.name, b])), frames = [];
  const end = Math.min(t1 ?? bvh.clip.duration, bvh.clip.duration);
  for (let t = t0; t <= end + 1e-6; t += 1 / hz) { a.time = t; mixer.update(0); root.updateMatrixWorld(true); const f = {}; for (const n in J) f[n] = J[n].getWorldPosition(V()); frames.push(f); }
  return frames;
}
const S = { // the target bone, the source segment it follows (from, to)
  thigh_l: ['LeftUpLeg', 'LeftLeg'], calf_l: ['LeftLeg', 'LeftFoot'], foot_l: ['LeftFoot', 'LeftToeBase'],
  thigh_r: ['RightUpLeg', 'RightLeg'], calf_r: ['RightLeg', 'RightFoot'], foot_r: ['RightFoot', 'RightToeBase'],
  spine_01: ['LowerBack', 'Spine'], spine_02: ['Spine', 'Spine1'], neck_01: ['Neck', 'Neck1'], Head: ['Neck1', 'Head'],
  clavicle_l: ['LeftShoulder', 'LeftArm'], upperarm_l: ['LeftArm', 'LeftForeArm'], lowerarm_l: ['LeftForeArm', 'LeftHand'], hand_l: ['LeftHand', 'LeftHandIndex1'],
  clavicle_r: ['RightShoulder', 'RightArm'], upperarm_r: ['RightArm', 'RightForeArm'], lowerarm_r: ['RightForeArm', 'RightHand'], hand_r: ['RightHand', 'RightHandIndex1'],
};
const CHILD = { thigh_l: 'calf_l', calf_l: 'foot_l', foot_l: 'ball_l', thigh_r: 'calf_r', calf_r: 'foot_r', foot_r: 'ball_r', spine_01: 'spine_02', spine_02: 'spine_03', neck_01: 'Head', Head: null,
  clavicle_l: 'upperarm_l', upperarm_l: 'lowerarm_l', lowerarm_l: 'hand_l', hand_l: 'middle_01_l', clavicle_r: 'upperarm_r', upperarm_r: 'lowerarm_r', lowerarm_r: 'hand_r', hand_r: 'middle_01_r' };
// twist: the limb's bend, as a direction across it (the next bone down), in source and target
const TW = { thigh_l: ['LeftFoot', 'LeftToeBase', 'foot_l', 'ball_l'], thigh_r: ['RightFoot', 'RightToeBase', 'foot_r', 'ball_r'], calf_l: ['LeftFoot', 'LeftToeBase', 'foot_l', 'ball_l'], calf_r: ['RightFoot', 'RightToeBase', 'foot_r', 'ball_r'],
  upperarm_l: ['LeftForeArm', 'LeftHand', 'lowerarm_l', 'hand_l'], upperarm_r: ['RightForeArm', 'RightHand', 'lowerarm_r', 'hand_r'] };
const ORDER = ['pelvis', 'spine_01', 'spine_02', 'spine_03', 'neck_01', 'Head', 'clavicle_l', 'upperarm_l', 'lowerarm_l', 'hand_l', 'clavicle_r', 'upperarm_r', 'lowerarm_r', 'hand_r', 'thigh_l', 'calf_l', 'foot_l', 'thigh_r', 'calf_r', 'foot_r'];
const basis = (up, side) => { const u = up.clone().normalize(), s = side.clone().sub(u.clone().multiplyScalar(side.dot(u))).normalize(), f = V().crossVectors(s, u); return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(s, u, f)); };
const perp = (v, d) => v.clone().sub(d.clone().multiplyScalar(v.dot(d)));

// one frame of source positions -> local quaternions of the target bones, and the pelvis position (world)
export function retargetFrame(T, f, k, origin, yaw) {
  const R = T.rest, B = T.B, rot = new THREE.Quaternion().setFromAxisAngle(V(0, 1, 0), yaw);
  const P = (n) => f[n].clone().sub(origin).applyQuaternion(rot); // source position, faced and placed
  const W = {}, L = {};
  const parentW = (n) => { const p = B[n].parent.name; return W[p] || R[p].W; };
  // pelvis and chest: whole frames from two directions (up the body, across the hips / shoulders)
  const bPel = basis(P('Spine1').sub(P('Hips')), P('LeftUpLeg').sub(P('RightUpLeg')));
  const bPelR = basis(R.spine_03.p.clone().sub(R.pelvis.p), R.thigh_l.p.clone().sub(R.thigh_r.p));
  W.pelvis = bPel.clone().multiply(bPelR.clone().invert()).multiply(R.pelvis.W);
  for (const n of ORDER.slice(1)) {
    if (n === 'spine_03') { const bC = basis(P('Neck1').sub(P('Spine1')), P('LeftArm').sub(P('RightArm'))), bCR = basis(R.neck_01.p.clone().sub(R.spine_03.p), R.upperarm_l.p.clone().sub(R.upperarm_r.p)); W[n] = bC.multiply(bCR.invert()).multiply(R[n].W); continue; }
    const [a, b] = S[n], pw = parentW(n), d1 = P(b).sub(P(a)).normalize();
    const c = CHILD[n] ? R[CHILD[n]].P.clone() : V(0, 1, 0); // where the child is, in this bone's own frame
    const v0 = c.clone().applyQuaternion(R[n].L).normalize(), v1 = d1.clone().applyQuaternion(pw.clone().invert()); // in the parent's frame
    let lq = new THREE.Quaternion().setFromUnitVectors(v0, v1).multiply(R[n].L), wq = pw.clone().multiply(lq);
    if (TW[n]) { // turn about the bone so the limb below bends the same way
      const [sa, sb, ta, tb] = TW[n], refS = perp(P(sb).sub(P(sa)), d1);
      const restDirW = R[CHILD[n]].p.clone().sub(R[n].p).normalize(), refT0 = perp(R[tb].p.clone().sub(R[ta].p), restDirW);
      if (refS.length() > 1e-3 && refT0.length() > 1e-3) {
        const refT = refT0.clone().applyQuaternion(R[n].W.clone().invert()).applyQuaternion(wq); // where the target's would be now
        const pT = perp(refT, d1).normalize(), pS = refS.normalize(); let ang = Math.atan2(V().crossVectors(pT, pS).dot(d1), pT.dot(pS));
        wq = new THREE.Quaternion().setFromAxisAngle(d1, ang).multiply(wq);
      }
    }
    W[n] = wq;
  }
  for (const n of ORDER) { const pw = n === 'pelvis' ? R.root.W : parentW(n); L[n] = pw.clone().invert().multiply(W[n]); }
  const hip = P('Hips').multiplyScalar(k);
  return { L, hip };
}

// a clip: source samples -> quaternion tracks (and the pelvis, in place or with its travel)
export function makeClip(T, frames, name, { hz = 30, inPlace = true, keepY = true } = {}) {
  const R = T.R || T.rest;
  // scale: the target's hip height over the source's (standing, the first frame)
  const f0 = frames[0], len = (f, a, b) => f[a].distanceTo(f[b]);
  // scale: the length of the target's leg over the source's (the bones keep their length, whatever the stance)
  const srcLeg = len(f0, 'LeftUpLeg', 'LeftLeg') + len(f0, 'LeftLeg', 'LeftFoot'), tgtLeg = R.thigh_l.p.distanceTo(R.calf_l.p) + R.calf_l.p.distanceTo(R.foot_l.p);
  const k = tgtLeg / srcLeg;
  // face +z at the start: the hips' forward
  const side = f0.LeftUpLeg.clone().sub(f0.RightUpLeg), fwd = V(-side.z, 0, side.x); // left x up = forward... (left = +x faces +z)
  const yaw = Math.atan2(fwd.x, fwd.z) * -1;
  const floor = Math.min(...frames.map((f) => Math.min(f.LeftToeBase.y, f.RightToeBase.y, f.LeftFoot.y, f.RightFoot.y)));
  const origin = V(f0.Hips.x, floor, f0.Hips.z);
  const out = frames.map((f) => retargetFrame(T, f, k, origin, yaw));
  const n = out.length, times = Float32Array.from({ length: n }, (_, i) => i / hz), tracks = [];
  for (const b of ORDER) { const v = new Float32Array(n * 4); let prev = null; out.forEach((o, i) => { const q = o.L[b]; if (prev && prev.dot(q) < 0) q.set(-q.x, -q.y, -q.z, -q.w); prev = q; v.set([q.x, q.y, q.z, q.w], i * 4); }); tracks.push(new THREE.QuaternionKeyframeTrack(b + '.quaternion', times, v)); }
  // the pelvis: in the root's frame; travel taken out (it ends where it began) unless kept
  const rootInv = new THREE.Matrix4().compose(V(), R.root.W, V(1, 1, 1)).invert(), p = new Float32Array(n * 3), end = out[n - 1].hip.clone(), p0 = R.pelvis.P;
  out.forEach((o, i) => { const h = o.hip.clone(); if (inPlace) { h.x -= end.x * i / (n - 1); h.z -= end.z * i / (n - 1); } const local = h.applyMatrix4(rootInv); p.set([local.x, keepY ? local.y : p0.y, local.z], i * 3); });
  tracks.push(new THREE.VectorKeyframeTrack('pelvis.position', times, p));
  return new THREE.AnimationClip(name, (n - 1) / hz, tracks);
}

// events in a recording: kicks (a foot high), punches (a hand far out in front)
export function events(frames, hz = 30) {
  const f0 = frames[0], hipH = (f0.LeftUpLeg.y + f0.RightUpLeg.y) / 2 - Math.min(f0.LeftToeBase.y, f0.RightToeBase.y), floor = Math.min(f0.LeftToeBase.y, f0.RightToeBase.y);
  const sig = frames.map((f) => { const side = f.LeftUpLeg.clone().sub(f.RightUpLeg).setY(0).normalize(), fwd = V(-side.z, 0, side.x), chest = f.Spine1;
    const reach = (h) => f[h].clone().sub(chest).dot(fwd) / hipH, lat = (h) => f[h].clone().sub(f.Hips).dot(side) / hipH;
    return { lf: (f.LeftFoot.y - floor) / hipH, rf: (f.RightFoot.y - floor) / hipH, lh: reach('LeftHand'), rh: reach('RightHand'), lfl: lat('LeftFoot'), rfl: lat('RightFoot'), lff: f.LeftFoot.clone().sub(f.Hips).dot(fwd) / hipH, rff: f.RightFoot.clone().sub(f.Hips).dot(fwd) / hipH, hip: ((f.LeftUpLeg.y + f.RightUpLeg.y) / 2 - floor) / hipH, yaw: Math.atan2(fwd.x, fwd.z) }; });
  const peaks = (key, thr, gap = 0.6) => { const r = []; for (let i = 2; i < sig.length - 2; i++) { const v = sig[i][key]; if (v > thr && v >= sig[i - 1][key] && v >= sig[i + 1][key] && v >= sig[i - 2][key] && v >= sig[i + 2][key]) { if (r.length && i - r[r.length - 1].i < gap * hz) { if (v > r[r.length - 1].v) r[r.length - 1] = { i, v }; } else r.push({ i, v }); } } return r; };
  return { sig, kicksL: peaks('lf', 0.45), kicksR: peaks('rf', 0.45), punchL: peaks('lh', 0.75), punchR: peaks('rh', 0.75) };
}
