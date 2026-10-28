// builds models/martial.json: martial motions from the CMU mocap database, retargeted onto the UAL bodies
import * as THREE from 'three';
import fs from 'fs';
import { target, loadBVH, sample, makeClip } from './rt.mjs';
const T = await target();
// name, file, peak (s), before, after, hand pose from, options
const L = [
  ['Kick_Front_R', '135_04', 3.1, 0.85, 0.75, 'Punch_Jab'], ['Kick_Front_L', '135_04', 4.9, 0.85, 0.75, 'Punch_Jab'],
  ['Kick_Round_R', '135_07', 6.4, 1.0, 0.85, 'Punch_Jab'], ['Kick_Round_L', '135_07', 3.7, 1.0, 0.85, 'Punch_Jab'],
  ['Kick_Side_R', '135_11', 5.1, 1.0, 0.85, 'Punch_Jab'], ['Kick_Side_L', '135_11', 13.2, 1.0, 0.85, 'Punch_Jab'],
  ['Kick_Jump', '90_05', 2.4, 1.25, 0.95, 'Punch_Jab'], ['Kick_Knee_R', '86_06', 54.4, 0.7, 0.7, 'Punch_Jab'], ['Kick_Snap_R', '86_06', 29.2, 0.8, 0.75, 'Punch_Jab'],
  ['Punch_Lunge_R', '135_09', 4.2, 0.85, 0.6, 'Punch_Jab'], ['Punch_Lunge_L', '135_09', 6.1, 0.85, 0.6, 'Punch_Jab'],
  ['Punch_Box_L', '143_23', 3.4, 0.5, 0.45, 'Punch_Jab'], ['Punch_Box_R', '143_23', 4.2, 0.5, 0.45, 'Punch_Jab'],
  ['Block_Low_R', '135_05', 2.6, 0.7, 0.6, 'Idle_Loop'], ['Block_Knife_R', '135_10', 1.9, 0.7, 0.6, 'Idle_Loop'], ['Block_Knife_L', '135_10', 3.4, 0.7, 0.6, 'Idle_Loop'],
  ['Palm_Push', '12_04', 10.6, 1.6, 0.8, 'Spell_Simple_Shoot'], ['Palm_Push2', '12_04', 51.5, 1.6, 0.8, 'Spell_Simple_Shoot'], ['Palm_Push3', '12_04', 61.2, 1.4, 0.8, 'Spell_Simple_Shoot'],
  ['Qi_Raise', '12_04', 10.4, 2.2, 0.8, 'Spell_Simple_Shoot'], ['Qi_Gather_Loop', '12_04', 43.0, 3.0, 3.0, 'Spell_Simple_Shoot', { loop: true }], ['Qi_Cloud_Loop', '12_04', 74.0, 3.0, 3.0, 'Spell_Simple_Shoot', { loop: true }],
  ['Guard_Taichi_Loop', '12_04', 26.0, 2.0, 2.0, 'Spell_Simple_Shoot', { loop: true }],
];
const out = { source: 'CMU Graphics Lab Motion Capture Database (mocap.cs.cmu.edu), BVH by B. Hahne; free for all uses', clips: [] };
const cache = {};
for (const [name, file, peak, pre, post, handsFrom, o = {}] of L) {
  const bvh = cache[file] || (cache[file] = loadBVH(`../cmu/${file}.bvh`));
  const fr = sample(bvh, Math.max(1 / 120, peak - pre), peak + post, 30);
  let clip = makeClip(T, fr, name, { inPlace: true });
  if (o.loop) { // a loop: the end eased into the start over the last half second
    const n = fr.length, m = 15;
    for (const tr of clip.tracks) { const w = tr.getValueSize(); for (let i = 0; i < m; i++) { const a = (i + 1) / m, j = n - m + i; if (tr instanceof THREE.QuaternionKeyframeTrack) { const q0 = new THREE.Quaternion().fromArray(tr.values, j * 4), q1 = new THREE.Quaternion().fromArray(tr.values, 0); q0.slerp(q1, a); q0.toArray(tr.values, j * 4); } else for (let c = 0; c < w; c++) tr.values[j * w + c] += (tr.values[c] - tr.values[j * w + c]) * a; } }
  }
  // the floor: the lowest foot at each moment is put back on the ground (eased, so a jump still leaves it)
  { const mixer = new THREE.AnimationMixer(T.scene), ac = mixer.clipAction(clip); ac.play(); const pt = clip.tracks.find((t) => t.name === 'pelvis.position'), n = pt.times.length, low = [];
    for (let i = 0; i < n; i++) { ac.time = pt.times[i]; mixer.update(0); T.scene.updateMatrixWorld(true); low.push(Math.min(T.B.foot_l.getWorldPosition(new THREE.Vector3()).y, T.B.foot_r.getWorldPosition(new THREE.Vector3()).y) - T.rest.foot_l.p.y); }
    ac.stop(); mixer.uncacheRoot(T.scene);
    const base = [...low].sort((a, b) => a - b)[Math.floor(n * 0.3)]; // a little above the lowest: the stance, not a slip
    for (let i = 0; i < n; i++) { const d = low[i] < base + 0.06 ? low[i] : base + (low[i] - base) * 0.3; pt.values[i * 3 + 2] -= Math.max(0, Math.min(d, 0.25)); }
    for (const b in T.B) T.B[b].quaternion.copy(T.rest[b].L), T.B[b].position.copy(T.rest[b].P); }
  // the fingers and the root, held as the reference clip has them (a fist for blows, open for the rest)
  const ref = T.clips.find((c) => c.name === handsFrom), have = new Set(clip.tracks.map((t) => t.name));
  for (const tr of ref.tracks) { if (have.has(tr.name) || tr.name.endsWith('.scale')) continue; const w = tr.getValueSize(), k = Math.min(tr.times.length - 1, Math.floor(tr.times.length * 0.3)); const v = Array.from(tr.values.slice(k * w, k * w + w));
    clip.tracks.push(new (tr.constructor)(tr.name, [0, clip.duration], [...v, ...v])); }
  const j = THREE.AnimationClip.toJSON(clip);
  for (const t of j.tracks) { t.times = t.times.map((x) => +x.toFixed(4)); t.values = t.values.map((x) => +x.toFixed(4)); }
  out.clips.push({ ...j, hit: +pre.toFixed(3), loop: !!o.loop });
  console.log(name, clip.duration.toFixed(2), 'hit', pre);
}
fs.writeFileSync('C:/Budaixi/models/martial.json', JSON.stringify(out));
console.log((fs.statSync('C:/Budaixi/models/martial.json').size / 1e6).toFixed(2), 'MB');
