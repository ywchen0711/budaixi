// More places for the series (each at its own spot along x, so a story can cut between them):
//   hall    龍淵閣 at x = 600: the Confucian lord's great open pavilion, red pillars, a dais and throne, banquet tables
//   lotus   蓮心小築 at x = 900: a pavilion deck over a lotus pond, a zigzag bridge, willows, fireflies, mist
//   temple  萬佛峰 at x = 1200: a stone courtyard before the great hall, a golden Buddha within, a bell, incense
//   abyss   幽冥魔域 at x = 1500: black rock split by glowing fissures, spires, floating stones, a throne of spikes
// and rain over a place for a stretch of time (set.rain = [{ at: [x, z], t: [t0, t1] }, ...]).
// The ground where the actors stand is y = 0 at each of them.
import * as THREE from '../lib/three.module.min.js';
import { TOON } from './toon.js?v=12';
const mat = (o) => new THREE.MeshToonMaterial({ gradientMap: TOON, ...o });
export const HALL = new THREE.Vector3(600, 0, 0), LOTUS = new THREE.Vector3(900, 0, 0), TEMPLE = new THREE.Vector3(1200, 0, 0), ABYSS = new THREE.Vector3(1500, 0, 0);
export const SKY2 = {
  dusk: { sun: [-0.8, 0.12, 0.4], top: '#1a2040', mid: '#5a3a5a', hor: '#f08848', low: '#2a1a20', glow: '#ff9850', disc: '#ffe0a0', cloud: '#7a4048', stars: 0.1, sunCol: '#ffb070', sunI: 2.6, hemiSky: '#8a6a8a', hemiGround: '#2a1a18', hemiI: 1.4, rimI: 0.6, fog: '#6a4a58', windows: 1, lamps: 0.8 },
  day: { sun: [0.4, 0.75, 0.3], top: '#3a6ab0', mid: '#7aa8d8', hor: '#d8e4ec', low: '#6a7a80', glow: '#fff4d0', disc: '#fffcf0', cloud: '#e8eef4', stars: 0, sunCol: '#fff0d8', sunI: 2.8, hemiSky: '#b8d0f0', hemiGround: '#5a5040', hemiI: 1.8, rimI: 0.3, fog: '#b8c8d8', windows: 0.2, lamps: 0.1 },
  storm: { sun: [0.3, 0.6, -0.5], top: '#101418', mid: '#262c34', hor: '#3a424c', low: '#14181c', glow: '#3a4250', disc: '#3a4250', cloud: '#2a3038', stars: 0, sunCol: '#8a98b0', sunI: 1.3, hemiSky: '#4a5868', hemiGround: '#14181c', hemiI: 1.2, rimI: 0.8, fog: '#2a323c', windows: 1, lamps: 1 },
  abyss: { sun: [0.2, 0.5, 0.7], top: '#0a0208', mid: '#2a0818', hor: '#6a1a2a', low: '#14040a', glow: '#c02040', disc: '#ff4060', cloud: '#3a0a1a', stars: 0.3, sunCol: '#ff6a7a', sunI: 1.8, hemiSky: '#6a2a5a', hemiGround: '#1a0608', hemiI: 1.2, rimI: 1.0, fog: '#2a0a18', windows: 1, lamps: 1 },
};

function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function canvasTex(w, h, paint, repeat = true) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; paint(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}
// a group at a place; add() puts meshes in it in its own coordinates
function place(scene, at) {
  const G = new THREE.Group(); G.position.copy(at); scene.add(G);
  const add = (geo, m, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, cast = true) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.rotation.set(rx, ry, rz); o.castShadow = cast; o.receiveShadow = true; G.add(o); return o; };
  const light = (col, i, x, y, z) => { const l = new THREE.PointLight(col, i, 0, 2); l.position.set(x, y, z); G.add(l); return l; };
  return { G, add, light };
}
const plank = (R, base, line) => canvasTex(128, 128, (g, W, H) => { g.fillStyle = base; g.fillRect(0, 0, W, H); for (let y = 0; y < H; y += 16) { g.fillStyle = line; g.fillRect(0, y, W, 1.5); for (let k = 0; k < 20; k++) { g.fillStyle = `rgba(0,0,0,${0.05 + R() * 0.08})`; g.fillRect(R() * W, y + 2 + R() * 12, 10 + R() * 40, 1); } } });
const flag = (R, base) => canvasTex(128, 128, (g, W, H) => { g.fillStyle = base; g.fillRect(0, 0, W, H); for (let k = 0; k < 400; k++) { const c = R(); g.fillStyle = c < 0.5 ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.07)'; g.fillRect(R() * W, R() * H, 2 + R() * 4, 2 + R() * 4); } g.strokeStyle = 'rgba(0,0,0,0.35)'; g.lineWidth = 2; for (let x = 0; x <= W; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (let y = 0; y <= H; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); } });
const words = (s, w, h, size, bg, fg, vertical) => canvasTex(w, h, (g, W, H) => { g.fillStyle = bg; g.fillRect(0, 0, W, H); g.strokeStyle = fg; g.lineWidth = 5; g.strokeRect(5, 5, W - 10, H - 10); g.fillStyle = fg; g.font = `900 ${size}px "Noto Serif TC", serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; if (vertical) [...s].forEach((c, i) => g.fillText(c, W / 2, H * (i + 0.5) / s.length)); else g.fillText(s, W / 2, H / 2 + 4); }, false);
function roof(add, w, d, y, tile, gold, lift = 0.7) { // a hipped roof with upturned corners
  const r = add(new THREE.CylinderGeometry(0.01, 1, 1, 4, 1), tile, 0, y + 0.9, 0, 0, Math.PI / 4, 0); r.scale.set(w * 0.75, 1.8, d * 0.75);
  add(new THREE.BoxGeometry(w + 0.6, 0.18, d + 0.6), tile, 0, y, 0);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) add(new THREE.ConeGeometry(0.12, 0.8, 5), gold, sx * (w / 2 + 0.3), y + lift * 0.4, sz * (d / 2 + 0.3), sz * 0.6, 0, -sx * 0.6);
}

// ---------------------------------------------------------------- 龍淵閣: the great hall
function hall(scene) {
  const R = rng(31), { add, light } = place(scene, HALL);
  const stone = mat({ map: flag(R, '#5a5450') }); stone.map.repeat.set(10, 10);
  add(new THREE.PlaneGeometry(200, 200), mat({ map: flag(R, '#3a3632') }), 0, -0.02, 0, -Math.PI / 2, 0, 0, false).material.map.repeat.set(60, 60);
  const floor = mat({ map: plank(R, '#5a2a1a', '#2a1208') }); floor.map.repeat.set(8, 6);
  add(new THREE.BoxGeometry(20, 0.4, 14), stone, 0, -0.2, 0); add(new THREE.PlaneGeometry(18, 12), floor, 0, 0.005, 0, -Math.PI / 2, 0, 0, false);
  const red = mat({ color: '#8a1a16' }), gold = mat({ color: '#d8a838', emissive: '#2a1800' }), tile = mat({ color: '#2a2e36' }), dark = mat({ color: '#2a1210' });
  for (let i = 0; i < 5; i++) for (const s of [-1, 1]) { const x = -8 + i * 4; add(new THREE.CylinderGeometry(0.28, 0.32, 6, 14), red, x, 3, s * 6); add(new THREE.CylinderGeometry(0.42, 0.42, 0.3, 14), stone, x, 0.15, s * 6); add(new THREE.BoxGeometry(0.7, 0.4, 0.7), gold, x, 6.1, s * 6); }
  add(new THREE.BoxGeometry(19, 0.5, 13), dark, 0, 6.45, 0); roof((g, m, x, y, z, rx, ry, rz) => add(g, m, x, y, z, rx, ry, rz), 19, 13, 6.8, tile, gold);
  // the dais and throne at the back (+x), the plaque above, banners
  add(new THREE.BoxGeometry(3, 0.5, 6), red, 7.5, 0.25, 0); add(new THREE.BoxGeometry(3.2, 0.08, 6.2), gold, 7.5, 0.52, 0);
  add(new THREE.BoxGeometry(1.2, 0.6, 1.4), gold, 8.0, 0.85, 0); add(new THREE.BoxGeometry(0.3, 1.8, 1.6), gold, 8.55, 1.5, 0);
  add(new THREE.BoxGeometry(0.1, 1.0, 3.4), mat({ map: words('龍淵閣', 320, 96, 64, '#1a0c08', '#f0c858') }), 8.9, 4.6, 0, 0, -Math.PI / 2, 0);
  for (const s of [-1, 1]) add(new THREE.PlaneGeometry(0.9, 3.4), mat({ map: words(s < 0 ? '仁義禮智信' : '天地君親師', 64, 320, 44, '#7a1012', '#f0c858', true), side: THREE.DoubleSide }), 8.8, 3.6, s * 2.4, 0, -Math.PI / 2, 0);
  // the banquet: low tables down both sides with cups and dishes
  const wood = mat({ color: '#4a2416' }), cup = mat({ color: '#e8e0d0' });
  for (let i = 0; i < 4; i++) for (const s of [-1, 1]) { const x = -5 + i * 3; add(new THREE.BoxGeometry(1.6, 0.4, 0.8), wood, x, 0.2, s * 3.6); for (let k = 0; k < 3; k++) add(new THREE.CylinderGeometry(0.05, 0.04, 0.08, 8), cup, x - 0.5 + k * 0.5, 0.44, s * 3.6); }
  const lamps = [];
  for (const [x, z] of [[-6, -4.5], [-6, 4.5], [2, -4.5], [2, 4.5], [7, -2.8], [7, 2.8]]) {
    const l = add(new THREE.CylinderGeometry(0.28, 0.28, 0.6, 10), new THREE.MeshBasicMaterial({ color: '#ffb050' }), x, 4.6, z); l.castShadow = false;
    add(new THREE.CylinderGeometry(0.01, 0.01, 1.6, 4), dark, x, 5.7, z); lamps.push(light('#ffa050', 9, x, 4.3, z));
  }
  // the courtyard: trees, a wall, mountains far off
  const leaf = mat({ color: '#1e3424' }), bark = mat({ color: '#3a2a20' });
  for (let k = 0; k < 16; k++) { const a = R() * 6.28, r = 16 + R() * 14, x = Math.cos(a) * r, z = Math.sin(a) * r * 0.8; add(new THREE.CylinderGeometry(0.15, 0.22, 2.4, 6), bark, x, 1.2, z); add(new THREE.ConeGeometry(1.6 + R(), 3.6, 7), leaf, x, 3.6, z); }
  for (let k = 0; k < 14; k++) { const a = R() * 6.28, r = 90 + R() * 60, h = 20 + R() * 30; add(new THREE.ConeGeometry(14 + R() * 12, h, 5), new THREE.MeshBasicMaterial({ color: '#2a3046', fog: true }), Math.cos(a) * r, h / 2 - 2, Math.sin(a) * r, 0, R() * 3, 0, false); }
  const fill = [light('#ffb070', 8, 5.5, 2.4, 0), light('#ffb070', 6, -2, 2.6, 0)]; // candles by the dais, and down the hall
  return { update: (t, sk) => { const n = sk?.lamps ?? 1; lamps.forEach((l, i) => { l.intensity = (8 + Math.sin(t * 9 + i) * 0.5) * (0.6 + 0.6 * n); }); fill.forEach((l) => { l.intensity = 7 * (0.5 + 0.7 * n); }); } };
}

// ---------------------------------------------------------------- 蓮心小築: the lotus pond
function lotus(scene, o = {}) {
  const R = rng(41), { G, add, light } = place(scene, LOTUS);
  // water: dark, with the sky's light sliding over it
  const wU = { ...THREE.UniformsUtils.clone(THREE.UniformsLib.fog), t: { value: 0 }, c: { value: new THREE.Color('#0c1a2a') }, h: { value: new THREE.Color('#6a8ab0') } };
  const water = new THREE.Mesh(new THREE.PlaneGeometry(220, 220, 1, 1), new THREE.ShaderMaterial({ uniforms: wU, fog: true, vertexShader: '#include <fog_pars_vertex>\nvarying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;\n#include <fog_vertex>\n}', fragmentShader: '#include <fog_pars_fragment>\nuniform float t; uniform vec3 c, h; varying vec3 vW; void main(){ float r = sin(vW.x*1.7+t*0.8)*sin(vW.z*1.3-t*0.6)+sin(vW.x*0.5-vW.z*0.7+t*0.4); vec3 col = mix(c, h, smoothstep(1.2, 1.9, r)*0.35 + 0.08); gl_FragColor = vec4(col,1.0);\n#include <fog_fragment>\n}' }));
  water.rotation.x = -Math.PI / 2; water.position.y = -0.4; water.receiveShadow = false; G.add(water);
  const deckM = mat({ map: plank(R, '#6a4a30', '#2a1a10') }); deckM.map.repeat.set(4, 4);
  add(new THREE.BoxGeometry(11, 0.3, 11), deckM, 0, -0.15, 0);
  const red = mat({ color: '#7a1a16' }), gold = mat({ color: '#c8a040', emissive: '#201400' }), tile = mat({ color: '#2a3a34' }), rail = mat({ color: '#4a2a1a' });
  for (const [x, z] of [[-4.6, -4.6], [4.6, -4.6], [-4.6, 4.6], [4.6, 4.6]]) add(new THREE.CylinderGeometry(0.2, 0.22, 4.2, 12), red, x, 2.1, z);
  roof(add, 10, 10, 4.3, tile, gold); add(new THREE.BoxGeometry(10.4, 0.3, 10.4), rail, 0, 4.15, 0);
  for (const s of [-1, 1]) for (const ax of [0, 1]) { const b = add(new THREE.BoxGeometry(ax ? 0.08 : 9.4, 0.5, ax ? 9.4 : 0.08), rail, ax ? s * 5.3 : 0, 0.25, ax ? 0 : s * 5.3); if (!ax && s > 0) b.visible = false; } // railing, open at the front (+z)
  add(new THREE.BoxGeometry(2.4, 0.5, 1.2), rail, 2.6, 0.25, -3.2); add(new THREE.CylinderGeometry(0.12, 0.1, 0.12, 10), mat({ color: '#d8e8d8' }), 2.4, 0.56, -3.2); // a tea table, a cup
  add(new THREE.BoxGeometry(0.08, 0.9, 3), mat({ map: words('蓮心小築', 64, 320, 50, '#1a2a1a', '#e8e0b0', true) }), -5.0, 3.4, 0, 0, 0, 0);
  // the zigzag bridge to the shore (+z)
  for (let k = 0; k < 5; k++) add(new THREE.BoxGeometry(1.4, 0.18, 3.2), deckM, (k % 2 ? 0.9 : -0.9), -0.12, 7 + k * 2.9, 0, (k % 2 ? 0.5 : -0.5), 0);
  // pads and flowers
  const pad = new THREE.InstancedMesh(new THREE.CircleGeometry(0.45, 14, 0.3, 5.9), mat({ color: '#2a5a30', side: THREE.DoubleSide }), 420);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v = new THREE.Vector3(), sc = new THREE.Vector3();
  let n = 0;
  for (let k = 0; k < 2000 && n < 420; k++) { const x = (R() - 0.5) * 60, z = (R() - 0.5) * 60; if (Math.abs(x) < 6.4 && Math.abs(z) < 6.4) continue; if (Math.abs(x) < 2.6 && z > 5 && z < 22) continue; e.set(-Math.PI / 2, 0, R() * 6.3); q.setFromEuler(e); sc.setScalar(0.6 + R() * 1.0); v.set(x, -0.37, z); pad.setMatrixAt(n++, m4.compose(v, q, sc)); }
  pad.count = n; G.add(pad);
  const petal = mat({ color: '#f0a8c0', emissive: '#3a0a18', side: THREE.DoubleSide });
  for (let k = 0; k < 60; k++) {
    const x = (R() - 0.5) * 40, z = (R() - 0.5) * 40; if (Math.abs(x) < 7 && Math.abs(z) < 7) continue; if (Math.abs(x) < 3 && z > 5) continue;
    const f = new THREE.Group(); f.position.set(x, -0.2, z); G.add(f);
    for (let p = 0; p < 8; p++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6, 0, Math.PI, 0, Math.PI), petal); m.scale.set(0.5, 1.2, 0.3); m.position.set(Math.cos(p * 0.785) * 0.08, 0.12, Math.sin(p * 0.785) * 0.08); m.rotation.set(Math.sin(p * 0.785) * 0.5, -p * 0.785, Math.cos(p * 0.785) * 0.5); f.add(m); }
  }
  // willows on the shore, their curtains of leaves
  const willow = mat({ color: '#2a4a2a', side: THREE.DoubleSide, transparent: true, opacity: 0.92 }), bark = mat({ color: '#2a2018' });
  for (let k = 0; k < 10; k++) { const a = R() * 6.28, r = 32 + R() * 10, x = Math.cos(a) * r, z = Math.sin(a) * r; if (Math.abs(x) < 8 && z > 0) continue; add(new THREE.CylinderGeometry(0.25, 0.35, 4, 7), bark, x, 1.6, z); add(new THREE.CylinderGeometry(1.4, 3.2, 4.4, 12, 1, true), willow, x, 3.0, z); }
  const lanterns = [light('#ffb060', 4, 4.4, 3.5, 4.4), light('#ffb060', 4, -4.4, 3.5, 4.4), light('#ffb060', 3, 0, 3.5, -4.4)];
  for (const l of lanterns) add(new THREE.SphereGeometry(0.22, 10, 8), new THREE.MeshBasicMaterial({ color: '#ffc070' }), l.position.x, l.position.y + 0.1, l.position.z).castShadow = false;
  // fireflies
  const ffN = 90, ffG = new THREE.BufferGeometry(), ffP = new Float32Array(ffN * 3), seeds = [];
  for (let k = 0; k < ffN; k++) seeds.push([(R() - 0.5) * 30, 0.3 + R() * 2, (R() - 0.5) * 30, R() * 6]);
  ffG.setAttribute('position', new THREE.BufferAttribute(ffP, 3));
  const ff = new THREE.Points(ffG, new THREE.PointsMaterial({ color: '#d8ff90', size: 0.07, transparent: true, opacity: 0.9, depthWrite: false })); G.add(ff);
  return {
    update: (t, sk) => {
      if (o.lotusRed != null) { const k = Math.max(0, Math.min(1, (t - o.lotusRed) / 5)); petal.color.set('#f0a8c0').lerp(new THREE.Color('#c81a2a'), k); petal.emissive.set('#3a0a18').lerp(new THREE.Color('#5a0008'), k); } // the white lotus turning red
      wU.t.value = t; if (sk) { wU.c.value.copy(sk.low).lerp(new THREE.Color('#0a1420'), 0.5); wU.h.value.copy(sk.hor); }
      seeds.forEach(([x, y, z, s], k) => { ffP[k * 3] = x + Math.sin(t * 0.3 + s) * 1.5; ffP[k * 3 + 1] = y + Math.sin(t * 0.7 + s * 2) * 0.3; ffP[k * 3 + 2] = z + Math.cos(t * 0.25 + s) * 1.5; });
      ffG.attributes.position.needsUpdate = true; ff.material.opacity = 0.9 * (sk?.lamps ?? 1);
    },
  };
}

// ---------------------------------------------------------------- 萬佛峰: the temple courtyard
function temple(scene) {
  const R = rng(51), { add, light } = place(scene, TEMPLE);
  const fl = mat({ map: flag(R, '#7a7068') }); fl.map.repeat.set(14, 14);
  add(new THREE.PlaneGeometry(220, 220), mat({ map: flag(R, '#4a463e') }), 0, -0.02, 0, -Math.PI / 2, 0, 0, false).material.map.repeat.set(60, 60);
  add(new THREE.PlaneGeometry(26, 26), fl, 0, 0.004, 0, -Math.PI / 2, 0, 0, false);
  const wall = mat({ color: '#a8402a' }), gold = mat({ color: '#e0b040', emissive: '#3a2400' }), tile = mat({ color: '#3a3428' }), stone = mat({ color: '#8a8478' });
  // the great hall at the back (+x): steps up to it, red walls, a deep roof, the Buddha within
  for (let k = 0; k < 5; k++) add(new THREE.BoxGeometry(1, 0.22, 10), stone, 10.5 + k * 0.6, 0.11 + k * 0.22, 0);
  add(new THREE.BoxGeometry(12, 1.1, 22), stone, 19, 0.55, 0);
  for (const s of [-1, 1]) add(new THREE.BoxGeometry(10, 7, 7), wall, 19, 4.6, s * 7.5);
  add(new THREE.BoxGeometry(10, 2.4, 8), wall, 19, 7.0, 0);
  for (let i = 0; i < 4; i++) add(new THREE.CylinderGeometry(0.35, 0.35, 6.2, 14), mat({ color: '#7a1a12' }), 14.4, 4.2, -6 + i * 4);
  roof(add, 12, 24, 8.8, tile, gold, 1.2);
  const B = mat({ color: '#d8a030', emissive: '#4a2a00' });
  add(new THREE.CylinderGeometry(2.2, 2.6, 1.2, 16), B, 21, 1.7, 0);   // the lotus seat
  add(new THREE.SphereGeometry(1.9, 16, 12), B, 21, 3.6, 0).scale.set(1, 1.1, 1.2); // the body
  add(new THREE.SphereGeometry(0.9, 16, 12), B, 21, 5.9, 0);           // the head
  add(new THREE.SphereGeometry(0.35, 10, 8), B, 21, 6.85, 0);          // the crown of the head
  add(new THREE.CircleGeometry(2.6, 30), new THREE.MeshBasicMaterial({ color: '#ffd870', transparent: true, opacity: 0.35 }), 22.2, 5.6, 0, 0, -Math.PI / 2, 0, false); // the halo
  const glow = light('#ffc060', 10, 17, 4.5, 0);
  // the incense cauldron in the middle of the courtyard, the bell tower, lanterns, pines
  const bronze = mat({ color: '#4a3a24' });
  add(new THREE.CylinderGeometry(0.9, 0.7, 1.0, 14), bronze, 4.5, 1.0, 0); for (const a of [0, 2.1, 4.2]) add(new THREE.CylinderGeometry(0.08, 0.08, 0.6, 6), bronze, 4.5 + Math.cos(a) * 0.6, 0.3, Math.sin(a) * 0.6);
  add(new THREE.BoxGeometry(2.2, 0.3, 2.2), bronze, 4.5, 1.6, 0);
  const smoke = [];
  for (let k = 0; k < 8; k++) { const m = add(new THREE.SphereGeometry(0.35, 8, 6), new THREE.MeshBasicMaterial({ color: '#c8c4c0', transparent: true, opacity: 0.18, depthWrite: false }), 4.5, 2, 0, 0, 0, 0, false); smoke.push({ m, s: k / 8 }); }
  const tower = new THREE.Group(); tower.position.set(-6, 0, -9); add(new THREE.BoxGeometry(3, 0.4, 3), stone, -6, 0.2, -9);
  for (const [x, z] of [[-1.2, -1.2], [1.2, -1.2], [-1.2, 1.2], [1.2, 1.2]]) add(new THREE.CylinderGeometry(0.15, 0.15, 4.6, 8), mat({ color: '#6a1a12' }), -6 + x, 2.5, -9 + z);
  add(new THREE.CylinderGeometry(0.55, 0.75, 1.4, 14), bronze, -6, 3.2, -9);
  roof((g, m, x, y, z, rx, ry, rz) => add(g, m, -6 + x, y, -9 + z, rx, ry, rz), 3.2, 3.2, 4.8, tile, gold);
  const lamps = [];
  for (const [x, z] of [[-2, -5], [-2, 5], [8, -5], [8, 5]]) { for (const [w, h, y] of [[0.6, 0.15, 0.08], [0.2, 0.7, 0.5], [0.5, 0.1, 0.9], [0.4, 0.4, 1.15], [0.66, 0.1, 1.4]]) add(new THREE.BoxGeometry(w, h, w), stone, x, y, z); add(new THREE.BoxGeometry(0.26, 0.24, 0.42), new THREE.MeshBasicMaterial({ color: '#ffd080' }), x, 1.15, z).castShadow = false; lamps.push(light('#ffb060', 3, x, 1.2, z)); }
  const pineM = mat({ color: '#1a3424' }), bark = mat({ color: '#3a2a20' });
  for (let k = 0; k < 18; k++) { const a = R() * 6.28, r = 16 + R() * 18; const x = Math.cos(a) * r - 4, z = Math.sin(a) * r; if (x > 9) continue; add(new THREE.CylinderGeometry(0.18, 0.26, 3, 6), bark, x, 1.5, z); for (let j = 0; j < 3; j++) add(new THREE.CylinderGeometry(1.6 - j * 0.4, 1.9 - j * 0.4, 0.5, 9), pineM, x, 2.8 + j * 0.9, z); }
  for (let k = 0; k < 12; k++) { const a = R() * 6.28, r = 100 + R() * 60, h = 30 + R() * 40; add(new THREE.ConeGeometry(18 + R() * 12, h, 5), new THREE.MeshBasicMaterial({ color: '#3a4258', fog: true }), Math.cos(a) * r, h / 2 - 4, Math.sin(a) * r, 0, R() * 3, 0, false); }
  return {
    update: (t, sk) => {
      for (const S of smoke) { const k = (t * 0.12 + S.s) % 1; S.m.position.set(4.5 + Math.sin(t * 0.5 + S.s * 9) * 0.3 * k, 1.9 + k * 4, Math.cos(t * 0.4 + S.s * 7) * 0.3 * k); S.m.scale.setScalar(0.6 + k * 2.2); S.m.material.opacity = 0.2 * (1 - k); }
      glow.intensity = 9 + Math.sin(t * 2) * 0.5; lamps.forEach((l) => { l.intensity = 3 * (sk?.lamps ?? 1); });
    },
  };
}

// ---------------------------------------------------------------- 幽冥魔域: the demon realm
function abyss(scene) {
  const R = rng(61), { G, add, light } = place(scene, ABYSS);
  // black rock with cracks of fire: the cracks glow (emissive), and pulse
  const crack = canvasTex(512, 512, (g, W, H) => { g.fillStyle = '#000'; g.fillRect(0, 0, W, H); g.strokeStyle = '#ff3050'; g.lineCap = 'round'; for (let k = 0; k < 40; k++) { let x = R() * W, y = R() * H; g.lineWidth = 1 + R() * 3; g.beginPath(); g.moveTo(x, y); for (let j = 0; j < 8; j++) { x += (R() - 0.5) * 70; y += (R() - 0.5) * 70; g.lineTo(x, y); } g.stroke(); } });
  const rockT = canvasTex(256, 256, (g, W, H) => { g.fillStyle = '#16121a'; g.fillRect(0, 0, W, H); for (let k = 0; k < 1500; k++) { g.fillStyle = R() < 0.5 ? '#221a26' : '#0c0a10'; g.fillRect(R() * W, R() * H, 2 + R() * 5, 1 + R() * 3); } });
  crack.repeat.set(10, 10); rockT.repeat.set(30, 30);
  const groundM = mat({ map: rockT, emissiveMap: crack, emissive: '#ff2040', emissiveIntensity: 1.2 });
  add(new THREE.PlaneGeometry(220, 220), groundM, 0, 0, 0, -Math.PI / 2, 0, 0, false);
  const obsidian = mat({ color: '#1a141e' }), bone = mat({ color: '#b8a898' }), violet = new THREE.MeshBasicMaterial({ color: '#c040ff' });
  for (let k = 0; k < 70; k++) { const a = R() * 6.28, r = 18 + R() * 64, h = 4 + R() * 18, x = Math.cos(a) * r, z = Math.sin(a) * r; if (Math.abs(x) < 20 && Math.abs(z) < 14) continue; add(new THREE.ConeGeometry(0.8 + R() * 2.4, h, 5), obsidian, x, h / 2, z, (R() - 0.5) * 0.2, R() * 3, (R() - 0.5) * 0.2); } // spires all round, none on the fighting ground
  // the throne on a raised rock at the back (+x): spikes behind it, violet fire in two braziers
  add(new THREE.CylinderGeometry(4, 5, 1.4, 9), obsidian, 10, 0.7, 0);
  for (let k = 0; k < 4; k++) add(new THREE.BoxGeometry(1, 0.3, 4), obsidian, 6.6 - k * 0.55, 0.15 + k * 0.32 - 0.15, 0);
  add(new THREE.BoxGeometry(1.4, 1.0, 1.6), obsidian, 10.6, 1.9, 0); add(new THREE.BoxGeometry(0.4, 3.2, 2.0), obsidian, 11.3, 3.0, 0);
  for (let k = -3; k <= 3; k++) add(new THREE.ConeGeometry(0.14, 1.6 + (3 - Math.abs(k)) * 0.5, 5), bone, 11.4, 4.4 + (3 - Math.abs(k)) * 0.2, k * 0.32, 0, 0, k * 0.08);
  const fires = [];
  for (const s of [-1, 1]) { add(new THREE.CylinderGeometry(0.5, 0.3, 1.2, 8), obsidian, 8.2, 2.0, s * 3); const f = add(new THREE.ConeGeometry(0.45, 1.2, 8), violet, 8.2, 3.1, s * 3, 0, 0, 0, false); fires.push({ f, l: light('#c040ff', 10, 8.2, 3.3, s * 3) }); }
  // stones floating in the air, slowly turning
  const floats = [];
  for (let k = 0; k < 14; k++) { const s = 0.4 + R() * 1.4, m = add(new THREE.DodecahedronGeometry(s, 0), obsidian, (R() - 0.5) * 40, 5 + R() * 10, (R() - 0.5) * 40); floats.push({ m, y: m.position.y, s: R() * 6 }); }
  return {
    update: (t) => {
      groundM.emissiveIntensity = 1.0 + Math.sin(t * 1.3) * 0.3;
      fires.forEach(({ f, l }, i) => { f.scale.set(1, 1 + Math.sin(t * 9 + i) * 0.15, 1); l.intensity = 9 + Math.sin(t * 13 + i * 2) * 2; });
      for (const F of floats) { F.m.position.y = F.y + Math.sin(t * 0.4 + F.s) * 0.6; F.m.rotation.y = t * 0.1 + F.s; }
    },
  };
}

// ---------------------------------------------------------------- rain over a place, for a while
function rain(scene, o) {
  const N = 2600, geo = new THREE.BufferGeometry(), P = new Float32Array(N * 6), R = rng(71), seeds = [];
  for (let k = 0; k < N; k++) seeds.push([(R() - 0.5) * 34, R() * 14, (R() - 0.5) * 34, 6 + R() * 3]);
  geo.setAttribute('position', new THREE.BufferAttribute(P, 3));
  const lines = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: '#9ab0c8', transparent: true, opacity: 0.45, depthWrite: false })); lines.frustumCulled = false; scene.add(lines);
  return {
    update: (t) => {
      const on = (o.rain || []).find((r) => t >= r.t[0] && t < r.t[1]); lines.visible = !!on; if (!on) return;
      const [cx, cz] = on.at;
      seeds.forEach(([x, y, z, v], k) => { const yy = 14 - ((y + t * v) % 14), i = k * 6; P[i] = cx + x; P[i + 1] = yy; P[i + 2] = cz + z; P[i + 3] = cx + x + 0.02; P[i + 4] = yy - 0.35; P[i + 5] = cz + z; });
      geo.attributes.position.needsUpdate = true;
    },
  };
}
export const SETS2 = { hall, lotus, temple, abyss, rain };
