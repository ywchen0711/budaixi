// A human actor in a film: what its body does at each moment is chosen from recorded human motion (the Universal
// Animation Library's clips), by what the story has it doing — standing at ease, talking, on guard, walking, running,
// gathering its power, in the air, kneeling — with one-off motions laid over it on cue: the cuts (each style of blow its
// own recorded attack, timed so the blade lands on the beat), blocks when the other's blade meets it, palm strikes,
// throws, leaps and landings, being hit, falling. Everything is worked out from the time alone, so any frame stands on
// its own: the clips are set to their times and weights, and the mixer is applied, never run.
import * as THREE from '../../lib/three.module.min.js';
import { buildHuman, humanClips } from '../models/human.js?v=12';

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const cl = (v, a = -1, b = 1) => Math.max(a, Math.min(b, v));
const HZ = 30;
// each style of cut: the recorded attack, when in it the blade lands, the recovery after it
// (the moments the blade lands were measured from the clips: where the sword hand moves fastest)
const CUT = {
  side: [['Sword_Regular_A', 0.25, 'Sword_Regular_A_Rec'], ['Sword_Attack', 0.38]], over: [['Sword_Regular_B', 0.27, 'Sword_Regular_B_Rec'], ['Sword_Regular_C', 0.65]],
  thrust: [['Sword_Attack', 0.38], ['Sword_Dash', 0.33]], upper: [['Sword_Regular_C', 0.65], ['Sword_Regular_B', 0.27, 'Sword_Regular_B_Rec']], heavy: [['Sword_Heavy_Combo', 0.38]],
};
const FIST = [['Punch_Jab', 0.22], ['Punch_Cross', 0.3], ['Melee_Hook', 0.25, 'Melee_Hook_Rec']];
const IDLE = { yin: 'Idle_FoldArms_Loop', wuya: 'Idle_FoldArms_Loop', guhong: 'Idle_FoldArms_Loop', youming: 'Idle_FoldArms_Loop', jingwang: 'Idle_Loop' };
const spring = (x, w, z) => { const o = new Float32Array(x.length); let p = x[0], v = 0; const dt = 1 / HZ / 4; for (let i = 0; i < x.length; i++) for (let s = 0; s < 4; s++) { v += (w * w * (x[i] - p) - 2 * z * w * v) * dt; p += v * dt; o[i] = p; } return o; };

export function humanActor(scene, A, C, rt) {
  const H = buildHuman(C); scene.add(H.group);
  const clips = humanClips(), story = rt.story, LEN = story.LEN, N = Math.ceil(LEN * HZ) + 2;
  const armed = !!(C.weapons?.R || C.weapons?.L);
  const acts = {}; const act = (name) => { if (!acts[name]) { const c = clips[name]; if (!c) return null; const a = H.mixer.clipAction(c); a.play(); a.weight = 0; acts[name] = a; } return acts[name]; };
  let base = [], over = [], hairX = null, hairZ = null;
  const talking = (story.lines?.zh || []).filter((l) => l[2] === A.who).map(([a, b]) => [a, b]);
  function bake() {
    // ---- the steady layer, sampled through the film: what the body is doing
    const ids = [], sc = [], pos = [];
    for (let i = 0; i < N; i++) pos.push(rt.pos(A.id, i / HZ));
    let lastSpeed = 0;
    for (let i = 0; i < N; i++) {
      const t = i / HZ, s = rt.state(A.id, t), p = pos[i], q = pos[Math.max(0, i - 6)], r = pos[Math.min(N - 1, i + 6)];
      const sp = Math.hypot(r.x - q.x, r.z - q.z) / (12 / HZ); lastSpeed = lastSpeed * 0.6 + sp * 0.4;
      let id = IDLE[A.who] || 'Idle_Loop', ts = 1;
      const talk = talking.some(([a, b]) => t >= a - 0.1 && t <= b), guard = (s.pose.stance ?? 1) > 0.5 || s.pose.guard > 0.5;
      if (talk && !guard) id = 'Idle_Talking_Loop';
      if (guard) id = armed ? 'Sword_Idle' : 'Spell_Simple_Idle_Loop';
      if ((s.qi || 0) > 0.6 && lastSpeed < 0.4) id = 'Spell_Simple_Idle_Loop';
      if (lastSpeed > 0.35 && p.y < 0.2) { if (lastSpeed < 2.0) { id = guard ? 'Walk_Loop' : 'Walk_Formal_Loop'; ts = cl(lastSpeed / 1.3, 0.6, 1.7); } else if (lastSpeed < 4) { id = 'Jog_Fwd_Loop'; ts = cl(lastSpeed / 3.2, 0.8, 1.5); } else { id = 'Sprint_Loop'; ts = cl(lastSpeed / 5.5, 0.8, 1.6); } }
      if (p.y > 0.3) id = 'NinjaJump_Idle_Loop';
      if ((s.kneel || 0) > 0.4) id = 'Crouch_Idle_Loop';
      ids.push(id); sc.push(ts);
    }
    base = []; for (let i = 0; i < N; i++) { const L = base[base.length - 1]; if (!L || L.id !== ids[i]) base.push({ t0: i / HZ, id: ids[i], ts: sc[i], ph: (A.i * 0.37) % 1 }); else L.ts = L.ts * 0.9 + sc[i] * 0.1; }
    // ---- the one-off motions, on cue
    over = [];
    const ev = (t0, id, o = {}) => { const c = clips[id]; if (c) over.push({ t0, id, ts: o.ts || 1, dur: c.duration / (o.ts || 1), hold: !!o.hold, fin: o.fin ?? 0.1, fout: o.fout ?? 0.22 }); };
    const mine = A.track, n = { k: 0 };
    for (const a of mine) {
      if (a.do === 'anim') ev(a.t, a.clip, { fin: a.fin ?? 0.12, ts: a.ts });
      else if (a.do === 'blow') {
        if (a.noAnim) continue; // part of a recorded combo already playing
        if (armed) { const st = a.style || 'side', V2 = CUT[st] || CUT.side, [id, hit, rec] = V2[Math.floor(a.t * 7.3) % V2.length]; ev(a.t - hit, id, { fin: 0.08 }); if (rec) ev(a.t, rec, { fin: 0.02 }); }
        else { const [id, hit, rec] = FIST[n.k++ % FIST.length]; ev(a.t - hit, id); if (rec) ev(a.t, rec, { fin: 0.02 }); }
      } else if (a.do === 'wave') { if (!mine.some((b) => b.do === 'blow' && Math.abs(b.t - a.t) < 0.2)) ev(a.t - (armed ? 0.65 : 0.18), armed ? 'Sword_Regular_C' : 'Spell_Simple_Shoot'); }
      else if (a.do === 'palm') { ev(a.t - 0.7, 'Spell_Simple_Enter'); ev(a.t - 0.18, 'Spell_Simple_Shoot', { fin: 0.05 }); }
      else if (a.do === 'react') ev(a.t, (a.k ?? 1) >= 1.5 ? 'Hit_Knockback' : a.part === 'head' ? 'Hit_Head' : 'Hit_Chest', { fin: 0.04 });
      else if (a.do === 'fall') ev(a.t, 'Death01', { hold: mine.some((b) => b.do === 'die'), fin: 0.1 });
      else if (a.do === 'jump' || a.do === 'drop') { ev(a.t - 0.5, 'NinjaJump_Start', { fin: 0.1, fout: 0.15 }); if (a.land !== 0) ev(a.t1 - 0.1, 'NinjaJump_Land', { fin: 0.05 }); }
      else if (a.do === 'missile') ev(a.t - 0.38, 'OverhandThrow');
    }
    // when another's blade meets this one's, it blocks
    for (const B of rt.actors) for (const a of B.track) if (a.do === 'blow' && a.target === A.id && a.result === 'clash') ev(a.t - 0.38, armed ? 'Sword_Block' : 'Idle_Shield_Break', { fout: 0.3 });
    over.sort((x, y) => x.t0 - y.t0);
    // the hair streams behind the movement
    const vf = new Float32Array(N); for (let i = 1; i < N - 1; i++) { const y = rt.yaw(A.id, i / HZ), dx = pos[i + 1].x - pos[i - 1].x, dz = pos[i + 1].z - pos[i - 1].z; vf[i] = (dx * Math.sin(y) + dz * Math.cos(y)) * HZ / 2; }
    hairX = spring(vf.map((v) => cl(0.08 * v, -0.3, 0.9)), 6, 0.35); hairZ = spring(vf.map((v, i) => 0.04 * Math.sin(i / HZ * 1.3 + A.i)), 5, 0.3);
  }
  const at = (arr, t) => { const q = cl(t * HZ, 0, N - 1.001), i = Math.floor(q), f = q - i; return arr[i] + (arr[i + 1] - arr[i]) * f; };
  const loopT = (a, seg, t) => { const d = a.getClip().duration; return (((t - seg.t0) * seg.ts / d + seg.ph) % 1) * d; };
  const points = {
    chest: () => H.chestFrame.localToWorld(V(0, 0.05, 0.12)), head: () => H.headFrame.localToWorld(V(0, 0.14, 0)), eye: () => H.headFrame.localToWorld(V(0, 0.14, 0.12)), root: () => H.group.getWorldPosition(V()),
    handR: () => H.bone('hand_r').getWorldPosition(V()), handL: () => H.bone('hand_l').getWorldPosition(V()), shoulderR: () => H.bone('upperarm_r').getWorldPosition(V()), shoulderL: () => H.bone('upperarm_l').getWorldPosition(V()),
    tipR: () => (H.weap.wR ? H.weap.wR.tip.getWorldPosition(V()) : H.bone('hand_r').getWorldPosition(V())), tipL: () => (H.weap.wL ? H.weap.wL.tip.getWorldPosition(V()) : H.bone('hand_l').getWorldPosition(V())),
    launcher: () => H.bone('hand_r').getWorldPosition(V()), muzzle: () => H.bone('hand_r').getWorldPosition(V()), front: (off = [0, 0, 0.9]) => H.group.localToWorld(V(...off)),
  };
  return {
    kind: 'puppet', human: true, A, C, P: H, points, frames: { head: H.headFrame, chest: H.chestFrame, root: H.group }, weap: H.weap, m: { head: H.headFrame, torso: H.chestFrame },
    looseOf: (what) => (what === 'wR' ? H.weap.wR?.group : what === 'wL' ? H.weap.wL?.group : null),
    bake, mouth: (k) => H.mouth(k),
    pose(t, s, other) {
      const p = rt.pos(A.id, t);
      H.group.visible = !s.hidden; H.group.position.set(p.x, p.y - (s.sink || 0), p.z); H.group.rotation.y = rt.yaw(A.id, t) + (s.spin || 0);
      H.body.rotation.x = (s.flip || 0); H.body.position.y = s.flip ? 0.7 * Math.sin(Math.abs(s.flip) / 2) : 0;
      if (s.hidden) return;
      for (const a of Object.values(acts)) a.weight = 0;
      // the steady layer, crossfading into each new state over 0.3 s
      let bi = base.length - 1; while (bi > 0 && base[bi].t0 > t) bi--;
      const cur = base[bi], prev = base[bi - 1], xf = prev ? cl((t - cur.t0) / 0.3, 0, 1) : 1;
      // the one-off over it: the latest that is still playing (or held)
      let ov = null, ow = 0;
      for (let i = over.length - 1; i >= 0; i--) { const o = over[i]; if (o.t0 > t) continue; const e = o.t0 + o.dur; if (t <= e + o.fout || o.hold) { ov = o; ow = Math.min(cl((t - o.t0) / o.fin, 0, 1), o.hold && t > e ? 1 : cl((e + o.fout - t) / o.fout, 0, 1)); break; } }
      const bw = 1 - ow;
      const setA = (id, tt, w) => { const a = act(id); if (!a) return; a.time = tt; a.weight += w; };
      setA(cur.id, loopT(act(cur.id), cur, t), bw * xf); if (prev && xf < 1) setA(prev.id, loopT(act(prev.id), prev, t), bw * (1 - xf));
      if (ov) setA(ov.id, Math.min(ov.dur, t - ov.t0) * ov.ts, ow);
      H.mixer.update(0); H.build();
      // the head turns to whoever it watches, and nods on its words
      const hd = H.bone('Head'), nk = H.bone('neck_01');
      if (other && !s.dead && (s.lookW ?? 0.85) > 0.01) {
        H.group.updateMatrixWorld(true); const h = hd.getWorldPosition(V()), d = other.clone().sub(h);
        const yaw = Math.atan2(d.x, d.z) - H.group.rotation.y; let a = ((yaw + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI; a = cl(a, -1.0, 1.0) * (s.lookW ?? 0.85);
        const pitch = cl(Math.atan2(-d.y, Math.hypot(d.x, d.z)), -0.4, 0.4) * 0.6;
        nk.rotateY(a * 0.4); hd.rotateY(a * 0.6); hd.rotateX(pitch);
      }
      hd.rotateX((s.pose.headKick || 0) * -0.5);
      // hair and locks
      const hx = at(hairX, t), hz = at(hairZ, t), ch = H.chains;
      ch.hair?.forEach((q, i) => q.rotation.set(hx * (0.5 + i * 0.2) + 0.05, 0, hz));
      ch.forelocks?.forEach((f) => f.forEach((q, i) => q.rotation.set((ch.lockBase[i] ?? 0) + hx * 0.2, 0, 0)));
      ch.ribbonsBody?.forEach((r, j) => r.forEach((q, i) => q.rotation.set(0.25 + hx * (0.6 + 0.2 * i) + 0.06 * Math.sin(t * 1.7 + i + j), 0, (j ? 1 : -1) * 0.2)));
      ch.cape?.forEach((q, i) => q.rotation.set((i ? 0.04 : 0.15) + hx * (0.5 + 0.2 * i), 0, 0));
      for (const [k, w] of Object.entries(H.weap)) w.group.visible = !s.gone[k];
    },
  };
}
