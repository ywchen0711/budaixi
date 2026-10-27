// The episode compiler: an episode is written as beats (a scene, a line said to someone, an entrance with its poem,
// a duel, a named technique, a scheme whispered, the narrator over the landscape...) and this turns them into what the
// film plays: every actor's track of moves, the camera's shots, the words and their times, the cues, the music, the
// name cards, the cuts to black, the skies, the slow motion. The film grammar lives here, so the episodes can be
// written like scripts:
//   const E = episode({ id: 's1', title, end, cast: ['luo', 'yin', ...], look: { style: 'anime' } });
//   E.scene('hall', { sky: 'dusk', place: { yin: [7, 0, 'wei'], wei: [-3, 1, 'yin'] }, mood: 'tense' });
//   E.say('yin', '……', '...', { to: 'wei', act: 'fan' });
//   E.enter('luo', { how: 'lotus', at: [0, 0], poem: [['……', '...'], ['……', '...']] });
//   E.duel('ling', 'wei', { d: 18, end: 'apart' });
//   E.strike('luo', 'yin', { kind: 'wave', name: ['蓮華劍氣', 'Lotus Sword Light'], result: 'hit' });
//   export default E.done();
// Places are given in the location's own coordinates (its centre at 0, 0); angles in degrees.
import { CHARACTERS } from '../cast/characters.js?v=12';
import { bodyOf } from '../models/looks.js?v=12';

const LOC = {
  bamboo: { o: [0, 0], key: 'Dm', est: [[[-14, 1.8, 3], [-5, 1.3, 2]], [[6, 2.4, 0], [4, 1.4, 0]], 46], wide: [[-9, 2.2, 6], [2, 1.0, 0], 44], scenic: [[[-20, 1.2, -6], [-8, 1.4, -3]], [[4, 3.5, 2], [2, 4.5, 0]], 50] },
  cliff: { o: [300, 0], key: 'Dm', est: [[[-24, 4, 7], [-12, 2.2, 5]], [[2, 1, 0], [0, 1.2, 0]], 42], wide: [[-12, 2.6, 7], [0, 1.0, 0], 44], scenic: [[[-30, 6, 0], [-20, 3, 8]], [[40, 3, -10], [30, 4, -5]], 46] },
  hall: { o: [600, 0], key: 'Eb', est: [[[-16, 5.5, 9], [-10, 3.2, 6]], [[4, 2.0, 0], [3, 1.5, 0]], 50], wide: [[-9, 3.2, 5.5], [3, 1.2, 0], 48], scenic: [[[-24, 6, -14], [-18, 4, -10]], [[0, 4, 0], [2, 3, 0]], 46] },
  lotus: { o: [900, 0], key: 'G', est: [[[2, 3.0, 22], [1, 2.0, 13]], [[0, 1.8, 0], [0, 1.4, 0]], 46], wide: [[-3, 2.6, 9], [0, 1.1, 0], 46], scenic: [[[-20, 1.2, 12], [-14, 0.8, 8]], [[0, 2, 0], [0, 1.5, 0]], 50] },
  temple: { o: [1200, 0], key: 'D', est: [[[-18, 7, 2], [-9, 3.5, 3]], [[16, 4.5, 0], [12, 3, 0]], 52], wide: [[-8, 3.0, 7], [4, 1.4, 0], 48], scenic: [[[0, 1.4, -14], [6, 2.0, -12]], [[21, 5, 0], [21, 5.5, 0]], 44] },
  abyss: { o: [1500, 0], key: 'Dm', est: [[[-20, 4, -10], [-9, 2.2, -4]], [[10, 3, 0], [8, 2.5, 0]], 50], wide: [[-10, 3.4, 6], [3, 1.4, 0], 50], scenic: [[[-16, 9, 12], [-10, 6, 8]], [[10, 4, 0], [10, 5, 0]], 48] },
};
const OBST = {
  hall: [...[-8, -4, 0, 4, 8].flatMap((x) => [[x, 6, 0.55], [x, -6, 0.55]]), [8.9, 0, 1.0], [8.9, 2, 1.0], [8.9, -2, 1.0]],
  lotus: [[-4.6, -4.6, 0.4], [4.6, -4.6, 0.4], [-4.6, 4.6, 0.4], [4.6, 4.6, 0.4]],
  temple: [[14.4, -6, 0.5], [14.4, -2, 0.5], [14.4, 2, 0.5], [14.4, 6, 0.5], [2, 9, 1.3], [-6, -9, 1.8]],
};
// each master's theme: [instrument, [note, beat length]...] played over the entrance poem
const THEME = {
  luo: ['OC', [['G4', 1], ['A4', 1], ['D5', 2], ['E5', 1], ['D5', 1], ['B4', 1], ['A4', 1], ['G4', 3]]],
  wuya: ['PS', [['D4', 2], ['F4', 1], ['G4', 2], ['A4', 2], ['G4', 1], ['F4', 1], ['D4', 3]]],
  guhong: ['RC', [['E5', 2], ['B4', 1], ['D5', 3], ['E5', 1], ['G5', 1], ['E5', 3]]],
  wei: ['RC', [['D5', 0.5], ['F5', 0.5], ['G5', 0.5], ['A5', 1], ['C6', 1], ['A5', 0.5], ['G5', 0.5], ['A5', 2]]],
  qian: ['RC', [['G5', 0.5], ['E5', 0.5], ['G5', 0.5], ['A5', 0.5], ['G5', 0.5], ['E5', 0.5], ['D5', 1], ['C5', 1]]],
  yin: ['PS', [['Eb4', 1.5], ['G4', 1], ['Bb4', 1.5], ['Ab4', 1], ['G4', 1], ['F4', 1], ['Eb4', 2]]],
  baihe: ['OC', [['C5', 1], ['D5', 1], ['E5', 1], ['G5', 2], ['A5', 1], ['G5', 1], ['E5', 1], ['D5', 2]]],
  jingwang: ['PS', [['E4', 1.5], ['Eb4', 1.5], ['D4', 1.5], ['C#4', 1.5], ['C4', 3]]],
  yinyang: ['RC', [['B5', 0.5], ['F5', 0.5], ['B5', 0.5], ['E5', 1], ['F5', 0.5], ['C6', 1.5], ['B5', 2]]],
  youming: ['PS', [['D3', 3], ['Eb3', 3], ['D3', 4]]],
  yue: ['OC', [['A4', 1], ['C5', 1], ['E5', 2], ['D5', 1], ['C5', 1], ['A4', 3]]],
  ling: ['OC', [['D5', 1], ['E5', 0.5], ['G5', 1.5], ['E5', 0.5], ['D5', 1.5], ['B4', 1], ['A4', 0.5], ['G4', 2]]],
  yan: ['RC', [['D5', 0.5], ['F5', 0.5], ['G5', 0.5], ['A5', 1], ['G5', 0.5], ['F5', 0.5], ['D5', 1.5]]],
  ye: ['PS', [['D4', 2], ['F4', 1.2], ['Eb4', 1.6], ['D4', 2], ['C4', 1.2], ['D4', 1.6]]],
  huiming: ['PS', [['D4', 1.5], ['A4', 1.5], ['G4', 2]]],
};
const PI = Math.PI, rad = (d) => (d * PI) / 180;
const r3 = (v) => Math.round(v * 1000) / 1000;
// a seeded random number, so an episode comes out the same every time
const hash = (s) => { let h = 2166136261; for (const c of String(s)) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };

export function episode(meta) {
  const E = new Episode(meta); return E;
}

class Episode {
  constructor(m) {
    this.m = m; this.t = 0.3; this.seed = hash(m.id); this.n = 0;
    this.tracks = {}; this.pos = {}; this.facing = {}; this.vis = {}; this.who = {};
    this.shots = []; this.L = []; this.cues = []; this.music = []; this.cards = []; this.blacks = []; this.warp = []; this.sky = []; this.rain = []; this.scenes = [];
    this.loc = null; this.conv = null; this.bed = null;
    for (const c of m.cast) { const [id, who] = Array.isArray(c) ? c : [c, c]; this.tracks[id] = []; this.who[id] = who; this.vis[id] = []; }
  }
  // ---------------------------------------------------------------- helpers
  R() { this.seed = (Math.imul(this.seed, 1664525) + 1013904223) >>> 0; return this.seed / 4294967296; }
  pick(a) { return a[Math.floor(this.R() * a.length)]; }
  A(id, ...acts) { if (!this.tracks[id]) throw new Error(`${this.m.id}: '${id}' is not in the cast`); this.tracks[id].push(...acts); }
  O() { return LOC[this.loc]?.o || [0, 0]; }
  abs(x, z) { const o = this.O(); return [r3(o[0] + x), r3(o[1] + z)]; }
  local(id) { const p = this.pos[id], o = this.O(); return [p[0] - o[0], p[1] - o[1]]; }
  dir(id) { // the way an actor faces, as a unit [x, z]
    const f = this.facing[id], p = this.pos[id];
    if (f && typeof f === 'string' && this.pos[f]) { const q = this.pos[f], dx = q[0] - p[0], dz = q[1] - p[1], l = Math.hypot(dx, dz) || 1; return [dx / l, dz / l]; }
    const y = typeof f === 'number' ? f : 0; return [Math.sin(y), Math.cos(y)];
  }
  size(id) { const C = CHARACTERS[this.who[id]] || {}; return (C.scale || 1) * (C.anime ? bodyOf(C.anime.body).scale : 1); } // how big the puppet is
  // an offset round an actor in its own frame: x to its right, y up, z ahead
  rel(id, [x, y, z]) { const [fx, fz] = this.dir(id), rx = -fz, rz = fx; return [r3(rx * x + fx * z), y, r3(rz * x + fz * z)]; }
  // a camera placed round an actor is pulled in towards it until nothing stands between them
  clear(s) {
    const ob = OBST[this.loc]; if (!ob || !s.pos || Array.isArray(s.pos) || !s.pos.off) return s;
    const base = s.pos.at ? this.pos[s.pos.at] : s.pos.mid ? [(this.pos[s.pos.mid[0]][0] + this.pos[s.pos.mid[1]][0]) / 2, (this.pos[s.pos.mid[0]][1] + this.pos[s.pos.mid[1]][1]) / 2] : null;
    if (!base) return s;
    const O = this.O(), bx = base[0] - O[0], bz = base[1] - O[1], [ox, oy, oz] = s.pos.off;
    const hits = (k) => { const cx = bx + ox * k, cz = bz + oz * k; for (const [x, z, r] of ob) { // the segment from the camera to the subject passes within r + 0.3 of the obstacle?
      const dx = bx - cx, dz = bz - cz, l2 = dx * dx + dz * dz || 1, u = Math.max(0, Math.min(1, ((x - cx) * dx + (z - cz) * dz) / l2)), px = cx + dx * u - x, pz = cz + dz * u - z;
      if (px * px + pz * pz < (r + 0.3) ** 2 && u < 0.92) return true; } return false; };
    let k = 1; while (k > 0.35 && hits(k)) k -= 0.08;
    if (k >= 1) return s;
    if (k <= 0.35) { const side = [-oz, ox]; return { ...s, pos: { ...s.pos, off: [r3(side[0]), oy, r3(side[1])] } }; } // crowded: from the side instead
    return { ...s, pos: { ...s.pos, off: [r3(ox * k), oy, r3(oz * k)] }, fov: s.fov ? Math.min(60, s.fov / Math.max(0.6, k)) : s.fov };
  }
  shot(s) { s = this.clear(s); const prev = this.shots[this.shots.length - 1]; if (prev && Math.abs(prev.t - s.t) < 0.25) this.shots.pop(); this.shots.push({ ...s, t: r3(s.t) }); }
  face(id, to, t = this.t) { // to: an actor id or a heading in degrees
    const tr = this.tracks[id], last = tr.lastFace; if (last) last.t1 = r3(t);
    const a = typeof to === 'string' ? { do: 'face', t: r3(t), t1: 1e4, to, blend: 0.35 } : { do: 'face', t: r3(t), t1: 1e4, yaw: rad(to), blend: 0.35 };
    tr.push(a); tr.lastFace = a; this.facing[id] = typeof to === 'string' ? to : rad(to);
  }
  show(id, t) { const v = this.vis[id]; if (!v.length || v[v.length - 1][1] != null) v.push([t, null]); }
  hide(id, t) { const v = this.vis[id]; if (v.length && v[v.length - 1][1] == null) v[v.length - 1][1] = t; }
  shown(id) { const v = this.vis[id]; return v.length && v[v.length - 1][1] == null; }
  goto(id, x, z, t0, t1, o = {}) { const [ax, az] = this.abs(x, z); this.A(id, { do: 'goto', t: r3(t0), t1: r3(t1), to: [ax, az], e: o.e || 'ss', ...(o.hover ? { hover: o.hover } : {}) }); this.pos[id] = [ax, az]; }
  dur(id, zh, en) { // how long a line takes to say
    const v = CHARACTERS[this.who[id]]?.voice, rate = v ? 1 - (v.zh[2] || 0) / 100 : 1;
    const n = [...zh].filter((c) => /[㐀-鿿]/.test(c)).length, w = en.split(/\s+/).length;
    return Math.max(1.5, Math.max((0.45 + n * 0.25) * rate, (0.4 + w * 0.33) / 1.3));
  }
  line(id, zh, en, t, d, emo) { this.L.push([r3(t), r3(t + d), this.who[id] || id, zh, en, emo || null]); }
  theme(id, t0, t1, g = 0.4) {
    const T = THEME[this.who[id]] || THEME.ling, beats = T[1].reduce((s, n) => s + n[1], 0), k = (t1 - t0) / beats; let t = t0;
    this.music.push({ line: T[0], g, notes: T[1].map(([n, b]) => { const e = [n, r3(t), r3(b * k * 0.95)]; t += b * k; return e; }) });
  }
  // the bed of music under a scene: calm (the zither), tense (low strings trembling), dark, sad, grand
  setBed(mood, t) {
    if (this.bed) this.endBed(t);
    this.bed = { mood, t0: t, key: LOC[this.loc]?.key || 'Dm' };
  }
  endBed(t) {
    const B = this.bed; if (!B) return; this.bed = null; const d = t - B.t0; if (d < 2) return;
    const key = B.key, root = { Dm: 'D', G: 'G', Eb: 'Eb', D: 'D' }[key] || 'D', zk = key === 'G' ? 'G' : 'Dm';
    if (B.mood === 'calm') { this.music.push({ zheng: zk, t: r3(B.t0 + 0.5), t1: r3(t - 0.5), g: 0.42 }); for (let s = B.t0; s < t - 2; s += 12) this.music.push({ pad: 'VC', n: root + '2', t: r3(s), d: r3(Math.min(12, t - s)), g: 0.18 }); }
    else if (B.mood === 'tense') for (let s = B.t0; s < t - 2; s += 8) { this.music.push({ pad: 'VCt', n: root + '2', t: r3(s), d: r3(Math.min(8, t - s)), g: 0.3 }); this.music.push({ pad: 'CB', n: root + '1', t: r3(s), d: r3(Math.min(8, t - s)), g: 0.28 }); if ((s - B.t0) % 16 < 8) this.music.push({ hit: 'roll', t: r3(s + 6), g: 0.3 }); }
    else if (B.mood === 'dark') for (let s = B.t0; s < t - 2; s += 10) { this.music.push({ pad: 'CB', n: 'D1', t: r3(s), d: r3(Math.min(10, t - s)), g: 0.35 }); this.music.push({ pad: 'TB', n: 'D2', t: r3(s + 1), d: r3(Math.min(9, t - s - 1)), g: 0.18 }); this.music.push({ pad: 'VNt', n: 'Eb5', t: r3(s + 4), d: 3, g: 0.16 }); }
    else if (B.mood === 'sad') { for (let s = B.t0; s < t - 2; s += 10) { this.music.push({ pad: 'VA', n: 'D3', t: r3(s), d: r3(Math.min(10, t - s)), g: 0.2 }); this.music.push({ pad: 'VC', n: 'A2', t: r3(s), d: r3(Math.min(10, t - s)), g: 0.18 }); } const notes = []; for (let s = B.t0 + 1, i = 0; s < t - 3; s += 3.2, i++) notes.push([['A4', 'G4', 'F4', 'E4', 'D4', 'F4', 'E4', 'D4'][i % 8], r3(s), 2.8]); this.music.push({ line: 'PS', g: 0.26, notes }); }
    else if (B.mood === 'grand') for (let s = B.t0; s < t - 2; s += 12) this.music.push({ tutti: key === 'G' ? 'G' : 'D', t: r3(s), d: r3(Math.min(12, t - s)), g: 0.35, soft: true });
  }
  // ---------------------------------------------------------------- the opening: the title over the first place
  open(loc, o = {}) { // the puppet theatre first, its curtain parting; then the first place
    this.music.push({ luogu: 'kaitai', t: 0.3, t1: 4.0 }, { luogu: 'hit', t: 4.0, g: 1.2 });
    this.shot({ t: 0, pos: [[-24, 2.6, 0], [-20.5, 2.3, 0]], look: [[-16, 2.7, 0], [-16, 2.4, 0]], fov: [40, 36] });
    this.t = 4.5; this.scene(loc, { ...o, first: true }); return this;
  }
  // ---------------------------------------------------------------- a place: everyone in it on their marks, the rest gone
  scene(loc, o = {}) {
    if (!LOC[loc]) throw new Error(`no place '${loc}'`);
    let tc = this.t;
    if (this.loc && !o.first) { this.blacks.push([r3(this.t), r3(this.t + 1.6)]); tc = this.t + 0.8; }
    if (this.loc) this.scenes[this.scenes.length - 1][1] = r3(tc);
    const rn = this.rain[this.rain.length - 1]; if (rn && rn.t[1] == null) rn.t[1] = r3(tc);
    this.endBed(tc); this.loc = loc; this.conv = null;
    this.scenes.push([r3(tc), null, loc]);
    this.sky.push([r3(tc), o.sky || 'moon', r3(tc - 0.01)]);
    for (const id of Object.keys(this.tracks)) {
      const pl = o.place?.[id];
      if (pl) { this.goto(id, pl[0], pl[1], tc, tc + 0.04); this.show(id, tc); if (pl[2] != null) this.face(id, pl[2], tc); }
      else if (this.shown(id)) this.hide(id, tc);
    }
    if (o.rain) this.rain.push({ at: this.abs(0, 0), t: [r3(tc), null] });
    if (o.mood) this.setBed(o.mood, tc);
    this.t = tc;
    if (o.est !== false) { // the place, before anyone speaks
      const [p, l, f] = LOC[loc].est, O = this.O(), w = ([x, y, z]) => [r3(O[0] + x), y, r3(O[1] + z)];
      const d = o.est || 4.2;
      this.shot({ t: tc, pos: [w(p[0]), w(p[1])], look: [w(l[0]), w(l[1])], fov: f });
      this.t = tc + d;
    } else this.t = tc + 0.9;
    return this;
  }
  endRain() { const r = this.rain[this.rain.length - 1]; if (r && r.t[1] == null) r.t[1] = r3(this.t); }
  // ---------------------------------------------------------------- the narrator, over the place
  narrate(zh, en, o = {}) {
    const d = this.dur('narrator', zh, en) + 0.4, t = this.t;
    if (o.shot !== false) {
      const [p, l, f] = (o.wide ? LOC[this.loc].wide.map((x) => (Array.isArray(x) ? [x, x] : x)) : LOC[this.loc].scenic), O = this.O(), w = ([x, y, z]) => [r3(O[0] + x), y, r3(O[1] + z)];
      const P = Array.isArray(p[0]) ? p : [p, p], Lk = Array.isArray(l[0]) ? l : [l, l];
      this.shot(o.on ? { t, pos: { at: o.on, off: this.rel(o.on, [2.6, 1.3, 3.2]) }, look: { at: o.on, off: [0, 1.1, 0] }, fov: 34 } : { t, pos: [w(P[0]), w(P[1])], look: [w(Lk[0]), w(Lk[1])], fov: f });
    }
    this.line('narrator', zh, en, t + 0.2, d - 0.3, o.emo || 'calm');
    this.t = t + d; return this;
  }
  // ---------------------------------------------------------------- words, said to someone, with a gesture
  say(id, zh, en, o = {}) {
    const d = this.dur(id, zh, en) + (o.pause ?? 0.5), t = this.t, to = o.to;
    if (!this.shown(id)) { const [lx, lz] = this.loc ? [0, 0] : [0, 0]; if (this.pos[id] && this.loc && Math.abs(this.pos[id][0] - this.O()[0]) > 60) this.arrive(id, lx, lz, t); this.show(id, t); }
    if (to && o.turn !== false) { this.face(id, to, t); }
    // the camera: a new pair of speakers opens on the two of them; then over the listener's shoulder at whoever
    // speaks, the camera keeping to one side of the line between them; now and then the face up close
    const pair = to ? [id, to].sort().join('|') : id, fresh = !this.conv || this.conv.pair !== pair;
    if (fresh) this.conv = { pair, side: this.R() < 0.5 ? 1 : -1, n: 0 };
    const C = this.conv; C.n++;
    const cam = o.cam || (fresh && to ? 'two' : o.close ? 'close' : !to ? 'mid' : C.n % 5 === 0 ? 'close' : 'ots');
    this.camOn(cam, id, to, t, d, C.side);
    // a cut to the one listening, in a long speech
    if (to && d > 5.5 && o.react !== false) this.camOn('ots', to, id, t + d * 0.62, d * 0.38, C.side);
    this.gesture(id, o.act, t, d);
    if (to && this.shown(to)) this.A(to, { do: 'lookat', t: r3(t), t1: r3(t + d), to: id });
    const EMO = { angry: 'angry', shock: 'shock', laugh: 'laugh', think: 'think', bow: 'bow', fan: 'tease', whisk: 'calm', point: null, none: null };
    this.line(id, zh, en, t + 0.12, d - 0.2, o.emo || EMO[o.act] || null);
    // speaking: the head nods on the stresses, the body leans into it
    if (o.act !== 'none') for (let k = 0.4; k < d - 0.6; k += 1.1 + this.R() * 0.9) this.A(id, { do: 'p', t: r3(t + k), t1: r3(t + k + 0.5), set: { headKick: -0.12 - this.R() * 0.1 }, shape: 'bump' });
    this.t = t + d; return this;
  }
  camOn(kind, id, to, t, d, side = 1) {
    if (kind === 'two' && to) { const [ax, az] = this.pos[id], [bx, bz] = this.pos[to], dx = bx - ax, dz = bz - az, l = Math.hypot(dx, dz) || 1, px = -dz / l * side, pz = dx / l * side, dist = Math.max(3.2, l * 1.5);
      this.shot({ t, pos: { mid: [id, to], off: [r3(px * dist), 1.5, r3(pz * dist)] }, look: { mid: [id, to], off: [0, 1.3, 0] }, fov: 38 }); }
    else if (kind === 'ots' && to) { const [ax, az] = this.pos[id], [bx, bz] = this.pos[to], dx = ax - bx, dz = az - bz, l = Math.hypot(dx, dz) || 1, ux = dx / l, uz = dz / l, px = -uz * side, pz = ux * side;
      this.shot({ t, pos: { at: to, off: [r3(-ux * 1.15 + px * 0.8), 1.7, r3(-uz * 1.15 + pz * 0.8)] }, look: { actor: id, part: 'head', off: [0, -0.08, 0] }, fov: l > 3 ? 20 : 26 }); }
    else if (kind === 'close') this.shot({ t, pos: { actor: id, part: 'head', local: true, off: [0.1 * side, 0.06, 0.95 * this.size(id)] }, look: { actor: id, part: 'head', local: true, off: [0, 0.03, 0] }, fov: 28 });
    else if (kind === 'low') { const k = this.size(id) ** 1.5; this.shot({ t, pos: { at: id, off: this.rel(id, [1.6 * side * k, 0.35, 1.8 * k]) }, look: { actor: id, part: 'head', off: [0, 0.1, 0] }, fov: 36 }); }
    else if (kind === 'wide') { const [p, l, f] = LOC[this.loc].wide, O = this.O(); this.shot({ t, pos: [r3(O[0] + p[0]), p[1], r3(O[1] + p[2])], look: [r3(O[0] + l[0]), l[1], r3(O[1] + l[2])], fov: f }); }
    else { const k = this.size(id); this.shot({ t, pos: { at: id, off: this.rel(id, [0.9 * side * k, 1.35 * k, 2.3 * k]) }, look: { actor: id, part: 'head', off: [0, -0.12, 0] }, fov: 32 }); } // a medium shot from in front
  }
  // what the hands do while speaking
  gesture(id, act, t, d) {
    const R = this.R(), A = (...a) => this.A(id, ...a);
    const nod = () => A({ do: 'p', t: r3(t + 0.3), t1: r3(t + 1.1), set: { headX: 0.12 }, shape: 'bump' });
    if (act === 'point') A({ do: 'arm', side: 'R', keys: [[r3(t + 0.35), -1.45, -0.2, 0], [r3(t + Math.min(d, 2.4)), -1.4, -0.25, 0]] });
    else if (act === 'fan' || act === 'whisk') A({ do: 'arm', side: 'R', keys: [[r3(t + 0.3), -1.0, -1.5, 0.4, 0.4], [r3(t + 1.0), -1.15, -1.1, -0.2, 0.6], [r3(t + Math.min(d, 2.6)), -1.0, -1.5, 0.3, 0.4]] });
    else if (act === 'bow') A({ do: 'p', t: r3(t + 0.2), t1: r3(t + 1.6), set: { lean: 0.35, headX: 0.2 }, shape: 'bump' }, { do: 'arm', side: 'L', keys: [[r3(t + 0.3), -1.2, -1.5, 0], [r3(t + 1.4), -1.2, -1.5, 0]] }, { do: 'arm', side: 'R', keys: [[r3(t + 0.3), -1.2, -1.5, 0], [r3(t + 1.4), -1.2, -1.5, 0]] });
    else if (act === 'laugh') A({ do: 'p', t: r3(t + 0.1), t1: r3(t + Math.min(d, 2.6)), set: { headX: -0.25, lean: -0.12 }, shape: 'bump' }, { do: 'p', t: r3(t + 0.2), t1: r3(t + Math.min(d, 2.4)), set: { roll: 0.06 }, shape: 'bump' });
    else if (act === 'angry') A({ do: 'p', t: r3(t + 0.2), t1: r3(t + Math.min(d, 2.2)), set: { lean: 0.25, crouch: 0.15 }, shape: 'bump' }, { do: 'arm', side: 'L', keys: [[r3(t + 0.3), -1.1, -0.9, 0], [r3(t + 1.5), -1.2, -0.7, 0]] });
    else if (act === 'shock') A({ do: 'p', t: r3(t), t1: r3(t + 1.4), set: { lean: -0.22, headX: -0.1 }, shape: 'bump' });
    else if (act === 'think') A({ do: 'p', t: r3(t + 0.2), t1: r3(t + Math.min(d, 3)), set: { headX: 0.18, look: 0.2 }, shape: 'bump' }, { do: 'arm', side: 'L', keys: [[r3(t + 0.4), -1.5, -2.0, 0.3], [r3(t + Math.min(d, 2.8)), -1.5, -2.0, 0.3]] });
    else if (act === 'none') { /* still */ }
    else if (R < 0.5) { const sd = R < 0.25 ? 'L' : 'R'; A({ do: 'arm', side: sd, keys: [[r3(t + 0.35), -0.55, -1.25, 0.25, 0.1], [r3(t + 1.0), -0.7, -1.0, 0.1, 0.2], [r3(t + Math.min(d, 1.9)), -0.5, -1.1, 0.2, 0.1]] }); } // an open hand turned out on the words
    else nod();
  }
  // ---------------------------------------------------------------- a master's entrance: the arrival, the pose, the poem, the name
  enter(id, o = {}) {
    const C = CHARACTERS[this.who[id]], col = o.col || C?.qi || '#ffffff', [x, z] = o.at || [0, 0], t = this.t;
    const face = o.face ?? null, how = o.how || 'descend';
    let land = t + 2.0;
    if (how === 'descend' || how === 'lotus') { // down from the sky, turning over; for the lotus, slowly, petals falling
      const slow = how === 'lotus' ? 1.6 : 1, from = this.abs(x + (o.from?.[0] ?? -3), z + (o.from?.[1] ?? 1)), to = this.abs(x, z);
      this.A(id, { do: 'goto', t: r3(t - 0.05), t1: r3(t), to: [from[0], from[1]] }, { do: 'drop', t: r3(t + 0.3), t1: r3(t + 0.3 + 1.5 * slow), from: [from[0], 7, from[1]], to }, { do: 'flip', t: r3(t + 0.4), t1: r3(t + 0.4 + 1.1 * slow), dir: 1 });
      this.pos[id] = to; land = t + 0.3 + 1.5 * slow;
      this.shot({ t, pos: { at: id, off: [0, 0, 0] }, look: [to[0], 3.6, to[1]], fov: 50 });
      this.shot({ t, pos: [r3(to[0] + 2.6), 0.4, r3(to[1] + 2.6)], look: [to[0], 2.4, to[1]], fov: 54 });
      if (how === 'lotus') for (let k = 0; k < 3; k++) this.cues.push({ t: r3(t + k * 0.8), kind: 'leaves', at: [to[0], 5, to[1]], k: 1.2, col: '#ffb8d0' });
    } else if (how === 'glide') { // across the ground from far off, the robes streaming
      const from = this.abs(x + (o.from?.[0] ?? -10), z + (o.from?.[1] ?? 0));
      this.A(id, { do: 'goto', t: r3(t - 0.05), t1: r3(t), to: from }); this.pos[id] = from; this.goto(id, x, z, t + 0.2, t + 2.4, { hover: 0.6, e: 'out' }); land = t + 2.4;
      this.shot({ t, pos: [r3(this.pos[id][0] - 3), 0.5, r3(this.pos[id][1] + 3.2)], look: { at: id, off: [0, 1.25, 0] }, fov: 44 });
    } else if (how === 'walk') { // a slow walk in, the camera at the feet then up
      const from = this.abs(x + (o.from?.[0] ?? -6), z + (o.from?.[1] ?? 0));
      this.A(id, { do: 'goto', t: r3(t - 0.05), t1: r3(t), to: from }); this.pos[id] = from; this.goto(id, x, z, t + 0.2, t + 4.0, { e: 'in' }); land = t + 4.0;
      this.shot({ t, pos: { at: id, off: [1.0, 0.25, 1.6] }, look: { at: id, off: [0, 0.4, 0] }, fov: 40 });
      this.shot({ t: t + 2.2, pos: { at: id, off: [-1.6, 0.5, 2.4] }, look: { actor: id, part: 'head' }, fov: 32 });
    } else if (how === 'appear') { // out of nothing: a flash, and there
      const to = this.abs(x, z); this.A(id, { do: 'goto', t: r3(t - 0.05), t1: r3(t), to }); this.pos[id] = to; land = t + 0.8;
      this.cues.push({ t: r3(t + 0.7), kind: 'qiburst', at: [to[0], 0.6, to[1]], k: 1.4, col }, { t: r3(t + 0.7), kind: 'flash', k: 0.5 });
      this.shot({ t, pos: [r3(to[0] - 2.6), 1.2, r3(to[1] + 3.4)], look: [to[0], 1.0, to[1]], fov: 42 });
    } else if (how === 'leap') {
      const from = this.abs(x + (o.from?.[0] ?? -5), z + (o.from?.[1] ?? 0)), to = this.abs(x, z);
      this.A(id, { do: 'goto', t: r3(t - 0.05), t1: r3(t), to: from }, { do: 'jump', t: r3(t + 0.4), t1: r3(t + 1.6), h: 2.4, d: [r3(to[0] - from[0]), r3(to[1] - from[1])], land: 0.9 }, { do: 'flip', t: r3(t + 0.5), t1: r3(t + 1.5) });
      this.pos[id] = to; land = t + 1.6;
      this.shot({ t, pos: [r3(to[0] + 3), 0.6, r3(to[1] + 3)], look: [r3((from[0] + to[0]) / 2), 2.2, r3((from[1] + to[1]) / 2)], fov: 52 });
    }
    this.show(id, t - 0.05);
    if (face) this.face(id, face, t); else if (o.yaw != null) this.face(id, o.yaw, t);
    this.cues.push({ t: r3(land), kind: 'qiburst', at: [this.pos[id][0], 0.2, this.pos[id][1]], k: o.k ?? 0.9, col });
    this.music.push({ luogu: 'hit', t: r3(land), g: 1.2 }); if (o.gong !== false) this.music.push({ hit: 'gong', t: r3(land), g: 0.7 });
    // the pose (亮相): a stance, the inner power showing
    this.A(id, { do: 'stance', t: r3(land), t1: r3(land + 0.6) }, { do: 'qi', t: r3(land), t1: r3(land + (o.aura ?? 4)), k: 0.7, col });
    if (o.weapon !== false) this.A(id, { do: 'arm', side: 'R', keys: [[r3(land + 0.1), -2.1, -0.4, 0.4], [r3(land + 1.2), -1.6, -0.6, 0.6]] });
    this.camOn('low', id, null, land, 2, 1);
    let tp = land + 1.0;
    // the poem, two lines: low and up at the master, then round, then close; the name in calligraphy
    if (o.poem) {
      const v = o.voice || id, p0 = tp, side = this.R() < 0.5 ? 1 : -1;
      this.cards.push([r3(p0), r3(p0 + 5.5), this.who[id]]);
      o.poem.forEach(([zh, en], i) => {
        const d = this.dur(v, zh, en) + 0.5;
        if (i === 0) this.shot({ t: tp, pos: { at: id, off: this.rel(id, [2.0 * side, 0.35, 1.4]) }, look: { actor: id, part: 'head', off: [0, 0.15, 0] }, fov: 34 });
        else if (i === 1) { const c = this.pos[id], [fx, fz] = this.dir(id), a0 = Math.atan2(fz, fx); this.shot({ t: tp, orbit: { c: { at: id, off: [0, 1.15, 0] }, r: 2.8, h: 0.3, a: [r3(a0 - 0.5 * side), r3(a0 + 0.5 * side)] }, fov: 34 }); void c; }
        else this.camOn('close', id, null, tp, d, side);
        this.line(v, zh, en, tp + 0.15, d - 0.25, 'shout'); tp += d;
      });
      this.theme(id, p0, tp, 0.42);
      this.camOn('close', id, null, tp - 1.6, 1.6, side);
      this.music.push({ luogu: 'hit', t: r3(tp), g: 0.9 });
    } else this.theme(id, land, land + 6, 0.36);
    this.A(id, { do: 'stance', t: r3(tp), t1: r3(tp + 1.4), k: 0 });
    this.t = tp + 0.3; return this;
  }
  // ---------------------------------------------------------------- moving, leaving, small acts
  arrive(id, x, z, t) { if (this.shown(id)) return; const [fx, fz] = [x - 3.2, z]; const p = this.abs(fx, fz); this.A(id, { do: 'goto', t: r3(t - 0.05), t1: r3(t), to: p }); this.pos[id] = p; this.show(id, t); }
  move(id, x, z, o = {}) {
    this.arrive(id, x, z, this.t);
    const d = o.d ?? Math.max(1.2, Math.hypot(this.local(id)[0] - x, this.local(id)[1] - z) / (o.speed ?? 1.4)), t = this.t;
    if (o.face) this.face(id, o.face, t);
    this.goto(id, x, z, t, t + d, { hover: o.glide ? 0.4 : 0, e: o.glide ? 'out' : 'ss' });
    if (o.shot !== false) this.shot({ t, pos: { at: id, off: this.rel(id, [2.6, 1.2, 1.2]) }, look: { at: id, off: [0, 1.25, 0] }, fov: 38 });
    if (o.wait !== false) this.t = t + d; return this;
  }
  exit(id, o = {}) {
    const t = this.t, how = o.how || 'leap', [lx, lz] = this.local(id);
    if (how === 'leap') { this.A(id, { do: 'jump', t: r3(t + 0.3), t1: r3(t + 1.4), h: 4, d: [r3(o.d?.[0] ?? -2), r3(o.d?.[1] ?? 0)], land: 0 }, { do: 'flip', t: r3(t + 0.35), t1: r3(t + 1.2) }); this.hide(id, t + 1.2); this.shot({ t, pos: { at: id, off: this.rel(id, [2.4, 0.5, 2.6]) }, look: { at: id, off: [0, 2.6, 0] }, fov: 50 }); this.t = t + 1.6; }
    else if (how === 'fade') { const p = this.pos[id]; this.cues.push({ t: r3(t + 0.6), kind: 'qiburst', at: [p[0], 0.8, p[1]], k: 0.9, col: o.col || CHARACTERS[this.who[id]]?.qi }); this.hide(id, t + 0.7); this.t = t + 1.4; }
    else { this.goto(id, lx + (o.d?.[0] ?? -6), lz + (o.d?.[1] ?? 0), t, t + 4); this.hide(id, t + 4); this.t = t + (o.wait === false ? 0 : 3); }
    return this;
  }
  act(id, kind, o = {}) { // a reaction without words
    const t = this.t, d = o.d ?? 1.6, A = (...a) => this.A(id, ...a);
    if (kind === 'kneel') A({ do: 'kneel', t: r3(t), t1: r3(t + (o.hold ?? 6)) });
    else if (kind === 'fall') A({ do: 'fall', t: r3(t), t1: r3(t + 0.8) });
    else if (kind === 'die') A({ do: 'fall', t: r3(t), t1: r3(t + 0.8) }, { do: 'die', t: r3(t) });
    else if (kind === 'qi') A({ do: 'qi', t: r3(t), t1: r3(t + d), k: o.k ?? 1, col: o.col || CHARACTERS[this.who[id]]?.qi });
    else if (kind === 'stance') A({ do: 'stance', t: r3(t), t1: r3(t + 0.6) }, { do: 'stance', t: r3(t + d + 0.8), t1: r3(t + d + 2), k: 0 });
    else if (kind === 'turn') this.face(id, o.to, t);
    else if (kind === 'hit') A({ do: 'react', t: r3(t), part: 'body', k: o.k ?? 1.2 });
    else if (kind === 'stagger') { A({ do: 'react', t: r3(t), part: 'body', k: o.k ?? 1.4 }); const [lx, lz] = this.local(id), [fx, fz] = this.dir(id); this.goto(id, lx - fx * 1.4, lz - fz * 1.4, t, t + 0.6, { e: 'out' }); }
    else this.gesture(id, kind, t, d);
    if (o.cam) this.camOn(o.cam, id, o.to, t, d);
    if (o.wait !== false) this.t = t + d; return this;
  }
  wait(d, o = {}) { if (o.cam) this.camOn(o.cam, o.on, o.to, this.t, d); this.t += d; return this; }
  cut(s) { this.shot({ t: this.t, ...s }); return this; }
  sfx(kind, o = {}) { this.cues.push({ t: r3(this.t + (o.dt || 0)), kind, ...o }); return this; }
  hit(t = this.t, g = 1.2) { this.music.push({ luogu: 'hit', t: r3(t), g }); return this; }
  // ---------------------------------------------------------------- a duel: d seconds of exchanges between a and b
  guard(ids, t0, t1) { for (const id of ids) this.A(id, { do: 'stance', t: r3(t0), t1: r3(t0 + 0.5), k: 1 }, { do: 'stance', t: r3(t1), t1: r3(t1 + 1.2), k: 0 }); }
  duel(a, b, o = {}) {
    const t0 = this.t, d = o.d ?? 16, k = o.k ?? 1, ca = CHARACTERS[this.who[a]]?.qi, cb = CHARACTERS[this.who[b]]?.qi;
    this.face(a, b, t0); this.face(b, a, t0);
    // they close the distance
    const [ax, az] = this.local(a), [bx, bz] = this.local(b), mx = (ax + bx) / 2, mz = (az + bz) / 2;
    let ux = bx - ax, uz = bz - az; const ul = Math.hypot(ux, uz) || 1; ux /= ul; uz /= ul;
    const put = (id, x, z, t, t1, e) => this.goto(id, r3(x), r3(z), t, t1, { e: e || 'ss' });
    put(a, mx - ux * 0.65, mz - uz * 0.65, t0, t0 + 0.7, 'in'); put(b, mx + ux * 0.65, mz + uz * 0.65, t0, t0 + 0.7, 'in');
    this.music.push({ luogu: 'fight', t: r3(t0), t1: r3(t0 + d) });
    let t = t0 + 0.9, side = 1, centre = [mx, mz];
    const two = (t1, kind) => {
      const [px, pz] = [-uz * side, ux * side], C = this.abs(centre[0], centre[1]);
      if (kind === 'orbit') { const a0 = Math.atan2(pz, px); this.shot({ t: t1, orbit: { c: { mid: [a, b], off: [0, 1.25, 0] }, r: 3.0, h: 0.4, a: [r3(a0), r3(a0 + 1.1 * side)] }, fov: 40, hand: 0.3 }); }
      else if (kind === 'low') this.shot({ t: t1, pos: { mid: [a, b], off: [r3(px * 2.4 - ux * 1.2), 0.3, r3(pz * 2.4 - uz * 1.2)] }, look: { mid: [a, b], off: [0, 1.3, 0] }, fov: 46 });
      else if (kind === 'high') this.shot({ t: t1, pos: [r3(C[0] + px * 4.5), 3.8, r3(C[1] + pz * 4.5)], look: { mid: [a, b], off: [0, 0.6, 0] }, fov: 44 });
      else if (kind === 'otsA') this.shot({ t: t1, pos: { at: a, off: [r3(-ux * 0.9 + px * 0.6), 1.6, r3(-uz * 0.9 + pz * 0.6)] }, look: { at: b, off: [0, 1.3, 0] }, fov: 34, hand: 0.3 });
      else if (kind === 'otsB') this.shot({ t: t1, pos: { at: b, off: [r3(ux * 0.9 + px * 0.6), 1.6, r3(uz * 0.9 + pz * 0.6)] }, look: { at: a, off: [0, 1.3, 0] }, fov: 34, hand: 0.3 });
      else this.shot({ t: t1, pos: { mid: [a, b], off: [r3(px * 3.6), 1.15, r3(pz * 3.6)] }, look: { mid: [a, b], off: [0, 1.25, 0] }, fov: 40, hand: 0.4 });
    };
    const blow = (who, tgt, tt, res, style, kk = k) => this.A(who, { do: 'blow', t: r3(tt), style: style || this.pick(['side', 'over', 'thrust', 'side', 'upper']), arm: 'R', result: res, target: tgt, against: 'tipR', close: false, k: kk });
    const units = ['clash3', 'leap', 'wave', 'palm', 'pass', 'spin', 'circle', 'lock', 'clash3', 'leap'];
    let n = 0;
    while (t < t0 + d - 2.4) {
      const u = n === 0 ? 'clash3' : this.pick(units), A_ = this.R() < 0.5 ? [a, b] : [b, a], [p, q] = A_, cp = p === a ? ca : cb;
      two(t, ['side', 'orbit', 'otsA', 'low', 'otsB', 'high', 'side'][n % 7]);
      if (u === 'clash3') { blow(p, q, t + 0.3, 'clash'); blow(q, p, t + 0.85, 'clash'); blow(p, q, t + 1.4, 'clash'); this.hit(t + 1.4, 0.7); t += 2.0; }
      else if (u === 'leap') { // over the other's head, turning, and a cut on the way down
        const [px, pz] = this.local(p), [qx, qz] = this.local(q), nx = 2 * qx - px, nz = 2 * qz - pz;
        this.A(p, { do: 'jump', t: r3(t + 0.2), t1: r3(t + 1.25), h: 1.9, d: [r3(nx - px), r3(nz - pz)], land: 0.7 }, { do: 'flip', t: r3(t + 0.25), t1: r3(t + 1.15) });
        this.pos[p] = this.abs(nx, nz); blow(p, q, t + 1.4, 'clash', 'over'); this.A(q, { do: 'spin', t: r3(t + 0.9), t1: r3(t + 1.35) });
        this.shot({ t: t + 0.15, pos: { at: q, off: [r3(-uz * side * 1.6), 0.4, r3(ux * side * 1.6)] }, look: { at: q, off: [0, 2.6, 0] }, fov: 56 });
        ux = -ux; uz = -uz; t += 2.0;
      } else if (u === 'wave') { // a crescent of sword light; the other meets it with its own
        const [qx, qz] = this.local(q), [px, pz] = this.local(p), back = 2.0;
        put(p, px - (qx - px) * 0.0 - (p === a ? ux : -ux) * back, pz - (p === a ? uz : -uz) * back, t, t + 0.5, 'out');
        this.A(p, { do: 'wave', t: r3(t + 0.9), at: r3(t + 1.3), target: q, col: cp, k: 1.0 * k }); this.A(q, { do: 'wave', t: r3(t + 0.95), at: r3(t + 1.3), target: p, col: p === a ? cb : ca, k: 0.9 * k });
        const P = this.pos[p], Q = this.pos[q]; this.cues.push({ t: r3(t + 1.3), kind: 'qiburst', at: [r3((P[0] + Q[0]) / 2), 1.1, r3((P[1] + Q[1]) / 2)], k: 1.2, col: '#ffffff' }); this.hit(t + 1.3, 1.0);
        this.shot({ t: t + 0.7, pos: { mid: [a, b], off: [r3(-uz * side * 5), 1.4, r3(ux * side * 5)] }, look: { mid: [a, b], off: [0, 1.25, 0] }, fov: 52 });
        t += 2.2; put(p, qx - (qx - px) * 0.35, qz - (qz - pz) * 0.35, t - 0.6, t, 'in');
      } else if (u === 'palm') {
        this.A(p, { do: 'qi', t: r3(t), t1: r3(t + 1.2), k: 0.7, col: cp }, { do: 'palm', t: r3(t + 0.9), target: q, col: cp, k: 0.8 * k, both: this.R() < 0.5 });
        this.A(q, { do: 'palm', t: r3(t + 0.92), target: p, col: p === a ? cb : ca, k: 0.6 * k }); this.hit(t + 1.0, 1.0);
        this.cues.push({ t: r3(t + 1.0), kind: 'shake', k: 0.08 });
        const [qx, qz] = this.local(q), [px, pz] = this.local(p), l = Math.hypot(qx - px, qz - pz) || 1;
        put(q, qx + (qx - px) / l * 0.9, qz + (qz - pz) / l * 0.9, t + 1.0, t + 1.5, 'out'); put(p, px - (qx - px) / l * 0.5, pz - (qz - pz) / l * 0.5, t + 1.0, t + 1.5, 'out');
        t += 2.0; const [qx2, qz2] = this.local(q), [px2, pz2] = this.local(p); put(q, (qx2 * 2 + px2) / 3, (qz2 * 2 + pz2) / 3, t - 0.4, t);
      } else if (u === 'pass') { // past each other in a flash: one stroke each, and a freeze
        const [px, pz] = this.local(p), [qx, qz] = this.local(q), dx = qx - px, dz = qz - pz;
        put(p, qx + dx * 0.6, qz + dz * 0.6, t + 0.3, t + 0.75, 'in'); put(q, px - dx * 0.6, pz - dz * 0.6, t + 0.3, t + 0.75, 'in');
        blow(p, q, t + 0.52, 'clash', 'side', 1.3 * k); this.warp.push([r3(t + 0.45), r3(t + 0.75), 0.25]); this.hit(t + 0.52, 1.3);
        this.shot({ t: t + 0.2, pos: { mid: [a, b], off: [r3(-uz * side * 3.2), 0.6, r3(ux * side * 3.2)] }, look: { mid: [a, b], off: [0, 1.25, 0] }, fov: 48 });
        this.face(p, q, t + 0.9); this.face(q, p, t + 0.9); ux = -ux; uz = -uz; t += 2.4;
        const [px2, pz2] = this.local(p), [qx2, qz2] = this.local(q); put(p, px2 + (qx2 - px2) * 0.3, pz2 + (qz2 - pz2) * 0.3, t - 0.7, t - 0.2); put(q, qx2 - (qx2 - px2) * 0.3, qz2 - (qz2 - pz2) * 0.3, t - 0.7, t - 0.2);
      } else if (u === 'spin') { this.A(p, { do: 'spin', t: r3(t + 0.2), t1: r3(t + 0.8), turns: 2 }); blow(p, q, t + 0.85, 'clash', 'side'); blow(q, p, t + 1.35, 'clash', 'upper'); t += 1.9; }
      else if (u === 'circle') { // round each other, a quarter turn, watching
        const [cx, cz] = centre, r = 1.1, a0 = Math.atan2(this.local(a)[1] - cz, this.local(a)[0] - cx), a1 = a0 + side * 1.3;
        put(a, cx + Math.cos(a1) * r, cz + Math.sin(a1) * r, t, t + 1.8); put(b, cx - Math.cos(a1) * r, cz - Math.sin(a1) * r, t, t + 1.8);
        [ux, uz] = [-Math.cos(a1), -Math.sin(a1)]; t += 2.0;
      } else if (u === 'lock') { blow(p, q, t + 0.4, 'clash', 'over'); this.A(p, { do: 'blow', t: r3(t + 0.45), style: 'thrust', result: 'clash', target: q, against: 'tipR', close: false, bind: 0.9, k }); this.cues.push({ t: r3(t + 0.5), t1: r3(t + 1.4), kind: 'sparks', every: 0.2, at: { actor: q, part: 'tipR' }, k: 0.5 }); this.shot({ t: t + 0.3, pos: { mid: [a, b], off: [r3(-uz * side * 1.4), 1.3, r3(ux * side * 1.4)] }, look: { mid: [a, b], off: [0, 1.3, 0] }, fov: 30 }); t += 1.9; }
      n++; if (n % 3 === 0) side = -side;
    }
    // how it ends
    const end = o.end || 'apart', [ex, ez] = this.local(a), [fx, fz] = this.local(b);
    if (end === 'apart' || end === 'stalemate') { // both leap back and stand facing each other
      const dx = fx - ex, dz = fz - ez, l = Math.hypot(dx, dz) || 1;
      this.A(a, { do: 'jump', t: r3(t + 0.2), t1: r3(t + 1.0), h: 0.9, d: [r3(-dx / l * 2.2), r3(-dz / l * 2.2)], land: 0.8 }); this.A(b, { do: 'jump', t: r3(t + 0.2), t1: r3(t + 1.0), h: 0.9, d: [r3(dx / l * 2.2), r3(dz / l * 2.2)], land: 0.8 });
      this.pos[a] = this.abs(ex - dx / l * 2.2, ez - dz / l * 2.2); this.pos[b] = this.abs(fx + dx / l * 2.2, fz + dz / l * 2.2);
      this.A(a, { do: 'stance', t: r3(t + 1.0), t1: r3(t + 1.6) }); this.A(b, { do: 'stance', t: r3(t + 1.0), t1: r3(t + 1.6) });
      two(t, 'side'); this.hit(t + 1.0, 1.2); t += 1.8;
    } else if (end.startsWith('win')) { // the winner's blow lands; the loser is thrown and goes down
      const [w, l] = end === 'win:b' ? [b, a] : [a, b];
      this.A(w, { do: 'blow', t: r3(t + 0.5), style: 'side', arm: 'R', result: 'hit', target: l, part: 'chest', close: false, k: 1.5 * k });
      this.A(l, { do: 'react', t: r3(t + 0.52), part: 'body', k: 1.6 }); const [lx, lz] = this.local(l), [wx, wz] = this.local(w), dl = Math.hypot(lx - wx, lz - wz) || 1;
      this.goto(l, lx + (lx - wx) / dl * 2.4, lz + (lz - wz) / dl * 2.4, t + 0.52, t + 1.2, { e: 'out' });
      this.A(l, { do: 'kneel', t: r3(t + 1.2), t1: r3(t + (o.hold ?? 8)) }); this.warp.push([r3(t + 0.4), r3(t + 0.8), 0.25]);
      this.cues.push({ t: r3(t + 0.52), kind: 'qiburst', at: { actor: l, part: 'chest' }, k: 1.2, col: CHARACTERS[this.who[w]]?.qi });
      this.shot({ t: t + 0.2, pos: { at: w, off: this.rel(w, [1.4, 0.6, 1.8]) }, look: { mid: [a, b], off: [0, 1.25, 0] }, fov: 44 }); this.hit(t + 0.52, 1.5); this.music.push({ hit: 'gong', t: r3(t + 0.52), g: 0.6 });
      t += 2.0;
    } else if (end.startsWith('flee')) { const f = end === 'flee:a' ? a : b; blow(f === a ? b : a, f, t + 0.4, 'clash', 'over'); this.A(f, { do: 'jump', t: r3(t + 0.8), t1: r3(t + 1.9), h: 4, d: [-2, 0], land: 0 }, { do: 'flip', t: r3(t + 0.85), t1: r3(t + 1.7) }); this.hide(f, t + 1.7); this.shot({ t: t + 0.6, pos: { at: f, off: this.rel(f, [2.4, 0.5, 2.6]) }, look: { at: f, off: [0, 2.5, 0] }, fov: 50 }); t += 2.2; }
    this.guard([a, b], t0, t); this.t = t; this.conv = null; return this;
  }
  // one against many: the foes come in turn, the hero turns from one to the next
  skirmish(hero, foes, o = {}) {
    const t0 = this.t, d = o.d ?? 14, col = CHARACTERS[this.who[hero]]?.qi;
    this.music.push({ luogu: 'fight', t: r3(t0), t1: r3(t0 + d) });
    let t = t0 + 0.4, i = 0, side = 1; const down = new Set();
    while (t < t0 + d - 1.5) {
      const f = foes[i % foes.length]; i++; if (down.has(f)) { if (down.size >= foes.length) break; continue; }
      const [hx, hz] = this.local(hero), [fx, fz] = this.local(f), dl = Math.hypot(fx - hx, fz - hz) || 1;
      this.face(hero, f, t); this.face(f, hero, t);
      this.goto(f, hx + (fx - hx) / dl * 1.2, hz + (fz - hz) / dl * 1.2, t, t + 0.6, { e: 'in' });
      this.shot({ t, pos: { at: hero, off: [r3(-(fz - hz) / dl * 3 * side), 1.2, r3((fx - hx) / dl * 3 * side)] }, look: { mid: [hero, f], off: [0, 1.25, 0] }, fov: 42, hand: 0.4 });
      this.A(f, { do: 'blow', t: r3(t + 0.7), style: this.pick(['over', 'side', 'thrust']), arm: 'R', result: 'clash', target: hero, against: 'tipR', close: false });
      const fin = i > foes.length && this.R() < 0.6;
      if (this.R() < 0.4) this.A(hero, { do: 'spin', t: r3(t + 0.85), t1: r3(t + 1.3) });
      this.A(hero, { do: 'blow', t: r3(t + 1.35), style: this.pick(['side', 'upper', 'thrust']), arm: 'R', result: 'hit', target: f, part: 'chest', close: false, k: 1.2 });
      this.A(f, { do: 'react', t: r3(t + 1.37), part: 'body', k: 1.3 });
      const [gx, gz] = this.local(f); this.goto(f, gx + (gx - hx) / dl * 1.8, gz + (gz - hz) / dl * 1.8, t + 1.37, t + 1.9, { e: 'out' });
      if (fin || o.kill) { this.A(f, { do: 'fall', t: r3(t + 1.7), t1: r3(t + 2.4) }, { do: 'die', t: r3(t + 1.7) }); down.add(f); }
      this.hit(t + 1.35, 0.8); t += 2.1; if (i % 2 === 0) side = -side;
    }
    this.guard([hero, ...foes], t0, t); void col; this.t = t; this.conv = null; return this;
  }
  // ---------------------------------------------------------------- a named technique: the power gathered, the name cried out, the blow
  strike(a, b, o = {}) {
    const t = this.t, ca = o.col || CHARACTERS[this.who[a]]?.qi, kind = o.kind || 'wave', k = o.k ?? 1.4, res = o.result || 'hit';
    this.face(a, b, t);
    // gathering: low, the aura rising; then the face, the name cried out
    this.A(a, { do: 'qi', t: r3(t), t1: r3(t + 3.0), k: 1.3 * (o.power ?? 1), col: ca, ramp: 1.0 }, { do: 'p', t: r3(t), t1: r3(t + 2.6), set: { crouch: 0.3, lean: -0.1 }, ramp: 0.8 });
    this.shot({ t, pos: { at: a, off: this.rel(a, [-1.6, 0.35, 1.4]) }, look: { actor: a, part: 'head', off: [0, 0.1, 0] }, fov: 38 });
    this.music.push({ pad: 'VNt', n: 'D5', t: r3(t), d: 2.8, g: 0.3 }, { hit: 'roll', t: r3(t + 0.4), g: 0.45 });
    let ti = t + 2.4;
    if (o.name) { const [zh, en] = o.name, d = this.dur(a, zh, en); this.camOn('close', a, null, t + 1.0, d, 1); this.line(a, zh, en, t + 1.1, d, 'shout'); ti = Math.max(ti, t + 1.1 + d); }
    // the release, seen wide; the slow motion through it
    const tr = ti;
    this.shot({ t: tr - 0.3, pos: { mid: [a, b], off: (() => { const [ax, az] = this.pos[a], [bx, bz] = this.pos[b], dx = bx - ax, dz = bz - az, l = Math.hypot(dx, dz) || 1; return [r3(-dz / l * 5), 1.3, r3(dx / l * 5)]; })() }, look: { mid: [a, b], off: [0, 1.25, 0] }, fov: 50 });
    let hitT = tr + 0.45;
    if (kind === 'wave') this.A(a, { do: 'blow', t: r3(tr), style: 'side', arm: 'R', result: 'miss', target: b, close: false, k: 1.4 }, { do: 'wave', t: r3(tr), at: r3(hitT), target: b, col: ca, k });
    else if (kind === 'palm') { this.A(a, { do: 'palm', t: r3(tr), target: b, col: ca, k }); hitT = tr + 0.3; }
    else if (kind === 'dash') { const [bx, bz] = this.local(b), [ax, az] = this.local(a), l = Math.hypot(bx - ax, bz - az) || 1; this.goto(a, bx + (bx - ax) / l * 1.6, bz + (bz - az) / l * 1.6, tr - 0.1, tr + 0.25, { e: 'in' }); this.A(a, { do: 'blow', t: r3(tr + 0.12), style: 'side', arm: 'R', result: res === 'blocked' ? 'clash' : 'hit', target: b, part: 'chest', close: false, k: 1.6 }); hitT = tr + 0.12; this.face(a, b, tr + 0.9); }
    else if (kind === 'array') { for (let i = 0; i < 5; i++) this.A(a, { do: 'wave', t: r3(tr + i * 0.12), at: r3(tr + 0.5 + i * 0.12), target: b, col: ca, k: k * 0.7, tilt: (i - 2) * 0.4 }); hitT = tr + 0.9; }
    this.warp.push([r3(hitT - 0.35), r3(hitT + 0.45), 0.28]);
    this.cues.push({ t: r3(hitT), kind: 'qiburst', at: { actor: b, part: 'chest' }, k: 1.8 * (o.power ?? 1), col: ca }, { t: r3(hitT), kind: 'flash', k: 0.5 }, { t: r3(hitT), kind: 'shake', k: 0.14 });
    this.music.push({ luogu: 'hit', t: r3(hitT), g: 1.6 }, { hit: 'gong', t: r3(hitT), g: 0.8 });
    // what it does to the other
    const [bx, bz] = this.local(b), [ax, az] = this.local(a), l = Math.hypot(bx - ax, bz - az) || 1, ux = (bx - ax) / l, uz = (bz - az) / l;
    if (res === 'blocked') { this.A(b, { do: 'qi', t: r3(hitT - 0.6), t1: r3(hitT + 1.2), k: 1.1 }, { do: 'p', t: r3(hitT), t1: r3(hitT + 1.0), set: { crouch: 0.35, lean: 0.2 }, shape: 'bump' }); this.goto(b, bx + ux * 0.8, bz + uz * 0.8, hitT, hitT + 0.6, { e: 'out' }); }
    else if (res === 'clash') { this.A(b, { do: 'wave', t: r3(tr + 0.05), at: r3(hitT), target: a, col: o.colB || CHARACTERS[this.who[b]]?.qi, k: k * 0.9 }); }
    else { this.A(b, { do: 'react', t: r3(hitT + 0.02), part: 'body', k: 1.8 }); this.goto(b, bx + ux * (o.knock ?? 3), bz + uz * (o.knock ?? 3), hitT, hitT + 0.8, { e: 'out' });
      if (res === 'kill') this.A(b, { do: 'fall', t: r3(hitT + 0.7), t1: r3(hitT + 1.5) }, { do: 'die', t: r3(hitT + 0.7) });
      else if (res === 'down') this.A(b, { do: 'kneel', t: r3(hitT + 0.8), t1: r3(hitT + (o.hold ?? 8)) }); }
    this.shot({ t: hitT + 0.5, pos: { at: b, off: this.rel(b, [1.8, 0.6, 2.2]) }, look: { at: b, off: [0, 0.9, 0] }, fov: 40 });
    this.guard([a, b], t, hitT + 1.6); this.t = hitT + 2.0; this.conv = null; return this;
  }
  // one turns into another: the mask lifts, the face beneath (the two are different actors at the same place)
  reveal(from, to, o = {}) {
    const t = this.t, p = this.pos[from];
    this.A(to, { do: 'goto', t: r3(t - 0.05), t1: r3(t), to: [p[0], p[1]] }); this.pos[to] = [p[0], p[1]];
    if (this.facing[from] != null) this.face(to, typeof this.facing[from] === 'string' ? this.facing[from] : (this.facing[from] * 180) / PI, t);
    this.cues.push({ t: r3(t + 0.8), kind: 'qiburst', at: [p[0], 1.0, p[1]], k: 1.6, col: o.col || '#e0e8ff' }, { t: r3(t + 0.8), kind: 'flash', k: 0.7 }, { t: r3(t + 0.8), kind: 'shake', k: 0.1 });
    this.hide(from, t + 0.8); this.show(to, t + 0.8);
    this.shot({ t, vertigo: { at: { at: from, off: [0, 1.2, 0] }, dir: this.rel(from, [0.2, 0.1, 1]), d: [2.0, 5.0], h: 1.4 } });
    this.music.push({ hit: 'gong', t: r3(t + 0.8), g: 1.0 }, { luogu: 'hit', t: r3(t + 0.8), g: 1.5 }, { pad: 'VNt', n: 'Eb5', t: r3(t), d: 3, g: 0.35 });
    this.t = t + 2.6; this.conv = null; return this;
  }
  // ---------------------------------------------------------------- the end: the narrator's closing words, the end card
  done() {
    const LEN = r3(this.t + 6.5), end = this.m.end;
    this.endBed(LEN - 1); this.scenes[this.scenes.length - 1][1] = LEN;
    this.music.push({ luogu: 'kaitai', t: r3(LEN - 6), t1: r3(LEN - 1.6) }, { luogu: 'hit', t: r3(LEN - 1.6), g: 1.3 }, { hit: 'gong', t: r3(LEN - 1.6), g: 0.7 });
    for (const r of this.rain) if (r.t[1] == null) r.t[1] = LEN;
    const actors = Object.keys(this.tracks).map((id) => {
      const tr = this.tracks[id], v = this.vis[id], hides = []; let last = 0;
      for (const [a, b] of v) { if (a > last + 0.001) hides.push({ do: 'hide', t: r3(last), t1: r3(a) }); last = b ?? 1e4; }
      if (last < 1e4) hides.push({ do: 'hide', t: r3(last), t1: 1e4 });
      if (!v.length) hides.push({ do: 'hide', t: 0, t1: 1e4 });
      const start = tr.find((a) => a.do === 'goto')?.to || [0, 0];
      return { id, who: this.who[id], start, stance0: 0, track: [...hides, ...tr.map((a) => { const { lastFace, ...rest } = a; void lastFace; return rest; })] };
    });
    const lines = this.L.sort((x, y) => x[0] - y[0]);
    // a line that would run into the next one is cut back a little (its voice is sped up to fit, tools/voices.py)
    for (let i = 0; i + 1 < lines.length; i++) if (lines[i][1] > lines[i + 1][0] - 0.05) lines[i][1] = r3(lines[i + 1][0] - 0.05);
    const shots = this.shots.sort((x, y) => x.t - y.t);
    return {
      id: this.m.id, LEN, title: this.m.title, end, endFor: 5, hitstopK: 1.1, look: this.m.look || { style: 'anime' },
      warp: this.warp.sort((x, y) => x[0] - y[0]).filter((w, i, W) => i === 0 || w[0] >= W[i - 1][1]), blacks: this.blacks, cards: this.cards, scenes: this.scenes,
      set: { kinds: [...new Set(['stage', ...this.scenes.map((s) => s[2])])], curtain: [1.2, 3.6], stageUntil: 4.4, plaque: this.m.plaque || '天機策', couplet: this.m.couplet || ['一策天機藏萬象', '半笑江湖定風雲'], sky: this.sky, rain: this.rain.length ? this.rain : undefined, ...(this.m.set || {}), embers: 0, fires: [], columns: [] },
      actors, shots,
      lines: { zh: lines.map(([a, b, w, z, , m]) => [a, b, w, z, m]), en: lines.map(([a, b, w, , e, m]) => [a, b, w, e, m]) },
      cues: this.cues, music: this.music.sort((x, y) => (x.t ?? x.notes?.[0]?.[1] ?? 0) - (y.t ?? y.notes?.[0]?.[1] ?? 0)),
    };
  }
}
