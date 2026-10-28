// A human: a real rigged body (Quaternius's CC0 mannequins, models/, on the Unreal-style skeleton of the Universal
// Animation Library) moved by recorded human motion, dressed in hanfu that is skinned to the same bones so the cloth
// bends with the body, with the character's own anime head on the head bone.
//   await loadHumans(); const H = buildHuman(spec);  H.group, H.root (the skeleton's scene), H.mixer, H.clips,
//   H.bone(name), H.headFrame, H.chestFrame, H.weap, H.mouth(k), H.chains
// The robe, its sleeves and the skirt are generated to fit the body: each ring of the robe is measured from the body's
// own vertices at that height, and every vertex of the cloth takes its weights from the bones it lies along.
import * as THREE from '../../lib/three.module.min.js';
import { GLTFLoader } from '../../lib/addons/GLTFLoader.js';
import { clone as skClone } from '../../lib/addons/SkeletonUtils.js';
import { buildPuppet, silkTex } from './puppet.js?v=14';
import { shade } from '../toon.js?v=14';

let LIB = null;
export async function loadHumans(base = '') {
  if (LIB) return LIB;
  const L = new GLTFLoader();
  const [a, b, f] = await Promise.all(['ual1', 'ual2', 'mannequin_f'].map((n) => L.loadAsync(`${base}models/${n}.glb`)));
  const clips = {}; for (const g of [a, b]) for (const c of g.animations) clips[c.name] = c;
  LIB = { clips, male: a.scene, female: f.scene };
  return LIB;
}
export const humanClips = () => LIB?.clips || {};

const sm = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);

export function buildHuman(spec) {
  const fem = !!spec.face?.fem, src = fem ? LIB.female : LIB.male;
  const root = skClone(src), bodies = []; root.traverse((o) => { if (o.isSkinnedMesh) bodies.push(o); });
  root.updateMatrixWorld(true);
  const body = bodies[0], sk = body.skeleton, bi = (n) => sk.bones.findIndex((b) => b.name === n), bone = (n) => sk.getBoneByName(n);
  const bp = (n) => bone(n).getWorldPosition(V()); // where a bone is in the bind pose
  // the costume, the head, the weapons and the accessories are made by the puppet builder, then moved onto the body
  const P = buildPuppet({ ...spec, scale: 1, body: { ...(spec.body || {}), Hd: 1 } });
  P.pose({ R: { s: 0, e: 0, w: 0, a: 0 }, L: { s: 0, e: 0, w: 0, a: 0 } }, {});
  P.group.updateMatrixWorld(true);
  const R = spec.robe || {}, M = P.M;

  // ---------------------------------------------------------------- the body (all its parts): skin, trousers and boots by vertex colour; no head of its own
  const skin = new THREE.Color(P.look.skin.color), trou = new THREE.Color(R.skirtBase || R.base || '#2a2428'), boot = new THREE.Color(R.boots || '#18141a'), neck = bp('neck_01'), robeC = new THREE.Color(R.base || '#e8e8e8');
  const MP = [], MN = []; // the body's own surface, before anything is drawn in: for measuring the clothes
  const bodyMat = shade({ vertexColors: true });
  for (const bm of bodies) {
    const geo = bm.geometry = bm.geometry.clone(), pos = geo.attributes.position, si = geo.attributes.skinIndex, sw = geo.attributes.skinWeight, bones = bm.skeleton.bones;
    const dom = (i) => { let m = 0, k = 0; for (let j = 0; j < 4; j++) { const w = sw.getComponent(i, j); if (w > m) { m = w; k = si.getComponent(i, j); } } return bones[k].name; };
    const col = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const n = dom(i); MP.push(pos.getX(i), pos.getY(i), pos.getZ(i)); MN.push(n);
      if (n === 'Head') pos.setXYZ(i, neck.x, neck.y, neck.z); // the body's own head is folded away: the character's head goes there
      else if (/^(pelvis|spine|clavicle|neck|upperarm|thigh)/.test(n)) { // under the robe: drawn in a little, so the cloth always covers it
        const b = bone(n).getWorldPosition(V()), k = /^(thigh)/.test(n) ? 0.72 : /^upperarm/.test(n) ? 0.8 : 0.84;
        if (/^upperarm/.test(n)) pos.setXYZ(i, pos.getX(i), b.y + (pos.getY(i) - b.y) * k, b.z + (pos.getZ(i) - b.z) * k);
        else pos.setXYZ(i, b.x + (pos.getX(i) - b.x) * k, pos.getY(i), b.z + (pos.getZ(i) - b.z) * k);
      }
      // what the clothes cover takes the clothes' colour, so nothing shows where the body comes through them
      const c = /^(foot|ball)/.test(n) ? boot : /^(thigh|calf)/.test(n) ? trou : /^(pelvis|spine|clavicle|upperarm|lowerarm)/.test(n) ? robeC : skin; col.set([c.r, c.g, c.b], i * 3);
    }
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3)); pos.needsUpdate = true; geo.computeVertexNormals();
    bm.material = bodyMat; bm.castShadow = true; bm.frustumCulled = false;
  }

  // ---------------------------------------------------------------- measuring the body, ring by ring
  const torsoBones = new Set(['pelvis', 'spine_01', 'spine_02', 'spine_03', 'neck_01', 'clavicle_l', 'clavicle_r']);
  const legBones = new Set(['pelvis', 'thigh_l', 'thigh_r', 'calf_l', 'calf_r']);
  function extent(y, set, dy = 0.025) {
    let x0 = 0, x1 = 0, z0 = 0, z1 = 0, n = 0;
    for (let i = 0; i < MN.length; i++) { const py = MP[i * 3 + 1]; if (Math.abs(py - y) > dy || !set.has(MN[i])) continue; const px = MP[i * 3], pz = MP[i * 3 + 2]; x0 = Math.min(x0, px); x1 = Math.max(x1, px); z0 = Math.min(z0, pz); z1 = Math.max(z1, pz); n++; }
    return n ? { rx: Math.max(-x0, x1), cz: (z0 + z1) / 2, rz: (z1 - z0) / 2 } : null;
  }
  // a skinned surface: rings[k] = { y, rx, rz, cz, cx, w: [[boneIndex, weight] x up to 4] (or a function of the angle) }
  const skinMat = (m) => { const c = m.clone(); c.side = THREE.DoubleSide; return c; };
  function ringsMesh(rings, mat, nA = 28, arc = [0, Math.PI * 2], axis = 'y') {
    const verts = [], uvs = [], idx = [], ind = [], wts = [], nR = rings.length;
    for (let k = 0; k < nR; k++) {
      const r = rings[k];
      for (let j = 0; j <= nA; j++) {
        const a = arc[0] + (arc[1] - arc[0]) * (j / nA), s = Math.sin(a), c = Math.cos(a);
        if (axis === 'y') verts.push((r.cx || 0) + r.rx * s, r.y, r.cz + r.rz * c);
        else { const p = r.p.clone().addScaledVector(r.u, r.rx * c).addScaledVector(r.v, r.rz * s); verts.push(p.x, p.y, p.z); }
        uvs.push(j / nA * 3, k / (nR - 1) * 2);
        const w = typeof r.w === 'function' ? r.w(a, s, c) : r.w, W = [...w, [0, 0], [0, 0], [0, 0], [0, 0]].slice(0, 4), tot = W.reduce((q, x) => q + x[1], 0) || 1;
        ind.push(...W.map((x) => x[0])); wts.push(...W.map((x) => x[1] / tot));
        if (k < nR - 1 && j < nA) { const q = k * (nA + 1) + j; idx.push(q, q + nA + 1, q + 1, q + 1, q + nA + 1, q + nA + 2); }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(ind, 4)); g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(wts, 4));
    g.setIndex(idx); g.computeVertexNormals();
    const m = new THREE.SkinnedMesh(g, skinMat(mat)); m.castShadow = true; m.frustumCulled = false; body.parent.add(m); m.bind(sk, body.bindMatrix); return m;
  }
  const B = (n) => bi(n);
  // ---- the robe's upper body: from the waist to the collar, each ring measured from the body and a little out from it
  const yPel = bp('pelvis').y, ySp3 = bp('spine_03').y, yNeck = bp('neck_01').y, chestRings = [];
  for (let y = yPel + 0.02; y <= yNeck + 0.02; y += 0.03) {
    const e = extent(Math.min(y, yNeck - 0.03), torsoBones) || { rx: 0.15, rz: 0.1, cz: 0 }, top = sm(ySp3 + 0.08, yNeck + 0.02, y);
    const b0 = y < bp('spine_01').y ? [[B('pelvis'), 1 - sm(yPel, bp('spine_01').y, y)], [B('spine_01'), sm(yPel, bp('spine_01').y, y)]]
      : y < bp('spine_02').y ? [[B('spine_01'), 1 - sm(bp('spine_01').y, bp('spine_02').y, y)], [B('spine_02'), sm(bp('spine_01').y, bp('spine_02').y, y)]]
      : y < ySp3 ? [[B('spine_02'), 1 - sm(bp('spine_02').y, ySp3, y)], [B('spine_03'), sm(bp('spine_02').y, ySp3, y)]] : [[B('spine_03'), 1 - top * 0.6], [B('neck_01'), top * 0.6]];
    chestRings.push({ y, rx: (e.rx + 0.03) * (1 - 0.45 * top ** 2), rz: (e.rz + 0.032) * (1 - 0.35 * top), cz: e.cz, w: (a, s) => (y > ySp3 && Math.abs(s) > 0.6 ? [[B(s > 0 ? 'clavicle_l' : 'clavicle_r'), 0.5], ...b0.map(([i, w]) => [i, w * 0.5])] : b0) });
  }
  ringsMesh(chestRings, M.silk, 32);
  // ---- the skirt: from the waist to the ankles, flaring; each side follows its leg, the middle of the front and back between them
  const yKnee = bp('calf_l').y, skirtRings = [], hem = (fem ? 0.33 : 0.36) * (R.skirt || 1);
  for (let y = yPel + 0.03; y >= 0.07; y -= 0.035) {
    const e = extent(Math.max(y, 0.55), legBones, 0.03) || { rx: 0.17, rz: 0.12, cz: 0 }, d = sm(yPel, 0.07, y), legw = sm(yPel, yPel - 0.35, y), calfw = sm(yKnee + 0.05, yKnee - 0.25, y) * 0.45;
    skirtRings.push({ y, rx: e.rx + 0.05 + (hem - e.rx) * d ** 1.1, rz: e.rz + 0.055 + (hem * 0.85 - e.rz) * d ** 1.1, cz: e.cz + 0.02 * d, w: (a, s) => {
      const side = sm(-0.35, 0.35, s), L = [[B('thigh_l'), legw * side * (1 - calfw)], [B('thigh_r'), legw * (1 - side) * (1 - calfw)], [B('calf_l'), legw * side * calfw], [B('calf_r'), legw * (1 - side) * calfw]];
      return [[B('pelvis'), 1 - legw], ...L];
    } });
  }
  ringsMesh(skirtRings, M.skirt || M.silk, 36);
  const trimRing = (r, mat) => ringsMesh([{ ...r, y: r.y + 0.012 }, { ...r, y: r.y - 0.012, rx: r.rx + 0.002, rz: r.rz + 0.002 }], mat, 36);
  trimRing(skirtRings[skirtRings.length - 1], M.trim);
  // ---- the belt at the waist
  const waist = extent(yPel + 0.05, torsoBones) || { rx: 0.15, rz: 0.11, cz: 0 };
  ringsMesh([{ y: yPel + 0.075, rx: waist.rx + 0.03, rz: waist.rz + 0.033, cz: waist.cz, w: [[B('spine_01'), 1]] }, { y: yPel + 0.035, rx: waist.rx + 0.03, rz: waist.rz + 0.033, cz: waist.cz, w: [[B('pelvis'), 1]] }], M.belt, 32);
  // ---- the sleeves: along the arm from the shoulder, wide at the cuff, and the deep hanging belly under the forearm
  for (const sd of ['l', 'r']) {
    const pU = bp('upperarm_' + sd), pL = bp('lowerarm_' + sd), pH = bp('hand_' + sd), dir = pH.clone().sub(pU).normalize(), u = V(0, 1, 0), v = V(0, 0, 1).cross(dir).normalize().multiplyScalar(Math.sign(dir.x) || 1), SW = R.sleeve || 1;
    const rings = [], seg = (p, rx, rz, w) => rings.push({ p, u, v: V(0, 0, 1), rx, rz, w });
    const lenU = pL.distanceTo(pU), lenL = pH.distanceTo(pL), cuff = 0.13 * SW;
    for (let k = -1; k <= 6; k++) { const f = k / 6, p = pU.clone().addScaledVector(dir, f * lenU); seg(p, 0.07 + 0.01 * f, 0.07, [[B('upperarm_' + sd), 1 - sm(0.7, 1.0, f) * 0.5], [B(k < 0 ? 'clavicle_' + sd : 'lowerarm_' + sd), k < 0 ? 0.6 : sm(0.7, 1.0, f) * 0.5]]); }
    for (let k = 1; k <= 7; k++) { const f = k / 7, p = pL.clone().addScaledVector(dir, f * (lenL + 0.02)); seg(p, 0.08 + (cuff - 0.08) * f ** 1.4, 0.075 + (cuff - 0.075) * f ** 1.4, [[B('lowerarm_' + sd), 1]]); }
    void v; ringsMesh(rings, M.silk, 22, [0, Math.PI * 2], 'arm');
    const last = rings[rings.length - 1]; ringsMesh([{ ...last, rx: last.rx + 0.002, rz: last.rz + 0.002 }, { ...last, p: last.p.clone().addScaledVector(dir, 0.02), rx: last.rx + 0.003, rz: last.rz + 0.003 }], M.trim, 22, [0, Math.PI * 2], 'arm');
    // the hanging belly: a curved panel from under the elbow to the cuff, falling 0.3 below the arm (in the T-pose: below it)
    const bel = [], n = 8;
    for (let k = 0; k <= n; k++) { const f = k / n, p = pL.clone().addScaledVector(dir, -0.04 + f * (lenL + 0.04)), drop = (0.08 + 0.26 * Math.sin(Math.PI * Math.min(1, f * 0.9 + 0.1)) ** 0.8) * SW;
      bel.push({ p: p.clone().add(V(0, -drop / 2, -0.01)), u: V(0, 1, 0), v: V(0, 0, 1), rx: drop / 2, rz: 0.012, w: [[B('lowerarm_' + sd), 1]] }); }
    ringsMesh(bel, M.silk, 10, [0, Math.PI * 2], 'arm');
  }
  // ---- the crossed collar, right over left (交領右衽): strips on the robe's surface
  const chestAt = (x, y) => { const r = chestRings.reduce((a, b) => (Math.abs(b.y - y) < Math.abs(a.y - y) ? b : a)); const zz = r.cz + r.rz * Math.sqrt(Math.max(0.03, 1 - (x / r.rx) ** 2)); return { z: zz + 0.004, r }; };
  const strip = (x0, y0, x1, y1, w, mat) => {
    const rings = [], n = 10;
    for (let k = 0; k <= n; k++) { const f = k / n, x = x0 + (x1 - x0) * f, y = y0 + (y1 - y0) * f, c = chestAt(x, y), wts = y > ySp3 ? [[B('spine_03'), 1]] : [[B('spine_02'), 1 - sm(bp('spine_02').y, ySp3, y)], [B('spine_03'), sm(bp('spine_02').y, ySp3, y)]];
      rings.push({ p: V(x, y, c.z), u: V(-(y1 - y0), x1 - x0, 0).normalize(), v: V(0, 0, 1), rx: w / 2, rz: 0.003, w: wts }); }
    ringsMesh(rings, mat, 4, [0, Math.PI * 2], 'arm');
  };
  // the character's right is -x on this body: the outer panel runs from the neck across to under the right arm
  const yC = yNeck - 0.015, yW = yPel + 0.1;
  strip(0.03, yC, -0.14, yW + 0.16, 0.055, M.silk2); strip(0.032, yC + 0.004, -0.138, yW + 0.164, 0.02, M.trim);
  strip(-0.03, yC, 0.06, yC - 0.17, 0.045, M.silk2); strip(-0.032, yC + 0.004, 0.058, yC - 0.166, 0.016, M.trim);

  // ---------------------------------------------------------------- what moves over from the puppet: head, weapons, accessories
  const attachAt = (boneName, worldPos, obj, scale = 1) => { // obj placed at worldPos (bind pose), world-aligned, then hung on the bone
    const c = new THREE.Group(); c.position.copy(worldPos); root.add(c); root.updateMatrixWorld(true);
    if (obj) { obj.position.set(0, 0, 0); obj.rotation.set(0, 0, 0); obj.scale.setScalar(scale); c.add(obj); }
    bone(boneName).attach(c); return c;
  };
  const head = P.parts.head; head.parent.remove(head);
  const headFrame = attachAt('Head', V(0, bp('Head').y - 0.03, 0.012), head, 0.9 * (spec.body?.Hd || 1) ** 0.8); // a child's head is bigger for its body
  const weap = {};
  for (const [k, w] of Object.entries(P.weap)) { w.group.parent.remove(w.group); const hp = bp(k === 'R' ? 'hand_r' : 'hand_l'), dx = k === 'R' ? -0.075 : 0.075; attachAt(k === 'R' ? 'hand_r' : 'hand_l', V(hp.x + dx, hp.y - 0.02, hp.z + 0.01), w.group); weap['w' + k] = w; }
  const chestFrame = attachAt('spine_03', V(0, ySp3, 0), null);
  // ribbons and a cape from the shoulders, a sword or a shawl on the back: as they were on the puppet's chest
  const torso = P.parts.torso; torso.updateMatrixWorld(true);
  const keep = [...(P.chains.ribbonsBody || []).map((r) => r[0]), ...(P.chains.cape?.length ? [P.chains.cape[0]] : [])];
  const dress = torso.children.find((c) => c.isGroup && c.children.some((m) => m.isGroup)); // the dress group holds the back sword, the shawl, the sash
  const moved = new THREE.Group(); attachAt('spine_03', V(0, ySp3 - 0.37, -0.01), moved, 1);
  for (const o of keep) moved.attach(o);
  if (spec.back || spec.sash || spec.shawl) for (const o of [...(dress?.children || [])]) if (o.isGroup || (o.isMesh && o.geometry.type !== 'BufferGeometry')) moved.attach(o);
  root.updateMatrixWorld(true);

  // ---------------------------------------------------------------- the whole: group (placed and turned) > body (flips) > root (the skeleton)
  const group = new THREE.Group(), inner = new THREE.Group(); group.add(inner); inner.add(root);
  const S = (spec.scale || 1) * (fem ? 0.96 : 1); root.scale.setScalar(S);
  const mixer = new THREE.AnimationMixer(root);
  // the build (js/models/looks.js) on the skeleton, after the motion has been applied: shoulders and chest (S, G) on the
  // upper spine, waist (W) on the lower, hips (Hp) on the pelvis; each undone again where the limbs and head begin, so
  // only the trunk changes; the clothes, skinned to the same bones, follow
  const Bd = { S: 1, W: 1, Hp: 1, G: 1, ...(spec.body || {}) }, nonDefault = ['S', 'W', 'Hp', 'G'].some((k) => Math.abs(Bd[k] - 1) > 0.01);
  const build = () => {
    if (!nonDefault) return;
    const set = (n, x, z) => bone(n).scale.set(x, 1, z);
    set('spine_01', Bd.W, Bd.G); set('spine_02', Bd.S / Bd.W, 1); set('spine_03', 1, 1);
    for (const sd of ['l', 'r']) set('clavicle_' + sd, 1 / Bd.S, 1 / Bd.G);
    set('neck_01', 1 / Bd.S, 1 / Bd.G); set('pelvis', Bd.Hp, Bd.G); for (const sd of ['l', 'r']) set('thigh_' + sd, 1 / Bd.Hp, 1 / Bd.G);
  };
  return { group, body: inner, root, mixer, sk, bone, headFrame, chestFrame, weap, M, P, chains: P.chains, mouth: (k) => P.mouth(k), scale: S, fem, build };
}

// a body standing in one recorded pose, for pictures (the creator, the world page): its clip at a moment
export function humanStill(spec, clip = 'Idle_Loop', t = 0.6) {
  const H = buildHuman(spec), c = LIB.clips[clip] || LIB.clips.Idle_Loop, a = H.mixer.clipAction(c); a.play(); a.time = Math.min(t, c.duration - 0.01); H.mixer.update(0); H.build(); H.group.updateMatrixWorld(true);
  H.chains.forelocks?.forEach((f) => f.forEach((q, i) => q.rotation.set(H.chains.lockBase[i] ?? 0, 0, 0)));
  return { group: H.group, H, points: { head: () => H.headFrame.localToWorld(new THREE.Vector3(0, 0.14, 0)) }, pose: (tt) => { a.time = tt % c.duration; H.mixer.update(0); H.build(); } };
}
