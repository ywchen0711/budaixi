// 天機策's places, built in bricks, where the puppet sets stand (the bamboo forest at the origin, 龍淵閣 at x = 600,
// the lotus pond at 900): a baseplate for the ground, tiles for paths and floors, round bricks stacked into bamboo
// and pillars, slopes for roofs, glowing pieces for lamps. Places with no brick version yet keep their own set.
import * as THREE from '../../lib/three.module.min.js';
import { buildSet } from '../sets.js?v=15';
import { HALL, LOTUS } from '../sets2.js?v=15';
import { kit, P, BH, PH } from './bricks.js?v=1';

const rng = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);
const BRICK = new Set(['bamboo', 'hall', 'lotus']);
function words(s, w, h, size, bg, fg, vertical) { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.fillStyle = bg; g.fillRect(0, 0, w, h); g.strokeStyle = fg; g.lineWidth = 5; g.strokeRect(5, 5, w - 10, h - 10); g.fillStyle = fg; g.font = `900 ${size}px "Noto Serif TC", serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; if (vertical) [...s].forEach((ch, i) => g.fillText(ch, w / 2, h * (i + 0.5) / s.length)); else g.fillText(s, w / 2, h / 2 + 4); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
const solid = (meshes, pre) => { for (const m of meshes) if (pre.some((p) => m.userData.key?.startsWith(p))) m.userData.solid = true; };

function bamboo(scene, o) { // a forest of bamboo, a path and a clearing, stone lanterns
  const G = new THREE.Group(); scene.add(G); const K = kit(G), R = rng(11);
  K.baseplate(0, 0, 220, 150, '#3a4a2a');
  for (let x = -40; x <= 40; x += 8 * P) for (let z = -1.8; z <= 1.8; z += 4 * P) K.brick(x, 0, z, 8, 4, 'tile', '#6a5a40'); // the path
  for (let i = -6; i <= 6; i++) for (let j = -6; j <= 6; j++) { const x = i * 4 * P * 1.0, z = j * 4 * P; if (Math.hypot(x, z) < 6.2 && Math.abs(z) > 1.8) K.brick(x, 0, z, 4, 4, 'tile', '#5e5038'); } // the clearing
  let n = 0;
  for (let k = 0; k < 2400 && n < 520; k++) {
    const x = (R() - 0.5) * 90, z = (R() - 0.5) * 60; if (Math.abs(z) < 2.6 + (Math.abs(x) < 9 ? 4.2 : 0) || Math.hypot(x, z) < 7.2) continue; n++;
    const h = Math.round((5 + R() * 6) / BH); let y = 0; const c = R() < 0.15 ? '#8a9a3a' : R() < 0.5 ? '#3a7a2a' : '#4a8a34';
    for (let j = 0; j < h; j++) { y = K.round(x, y, z, 1, 'brick', c); if (j % 4 === 3) y = K.round(x, y, z, 1, 'plate', '#2a4a1a'); } // nodes every few bricks
    for (let j = 0; j < 4; j++) { const ly = y - BH * (1 + j * 2.2 + R() * 2), w = 2 + (j % 2) * 2; K.round(x + (R() - 0.5) * 0.4, ly, z + (R() - 0.5) * 0.4, w, 'plate', R() < 0.5 ? '#3a7a2a' : '#5a9a3a'); } // tufts of leaves up the top of the stalk
  }
  for (const [x, z] of o.lanterns || [[-5.5, -3.2], [5.8, 3.4], [-12, 2.8]]) { // stone lanterns, lit inside
    K.brick(x, 0, z, 2, 2, 'plate', '#7a7a76'); K.round(x, PH, z, 1, 'brick', '#7a7a76'); K.round(x, PH + BH, z, 1, 'brick', '#7a7a76'); K.brick(x, PH + 2 * BH, z, 2, 2, 'plate', '#7a7a76');
    K.brick(x, 2 * PH + 2 * BH, z, 1, 1, 'brick', '#ffd27a', 0, 'glow'); K.brick(x, 2 * PH + 3 * BH, z, 2, 2, 'plate', '#6a6a66'); K.round(x, 3 * PH + 3 * BH, z, 1, 'plate', '#6a6a66');
    const l = new THREE.PointLight('#ffb060', 3, 0, 2); l.position.set(x, 0.95, z); G.add(l);
  }
  for (let k = 0; k < 18; k++) { const x = (R() - 0.5) * 30, z = (R() < 0.5 ? -1 : 1) * (3 + R() * 6); K.slope(x, 0, z, 2, 2, '#6a6a64', R() * 6.3); if (R() < 0.5) K.brick(x + 0.3, 0, z + 0.2, 2, 2, 'brick', '#5a5a56'); }
  solid(K.done(), ['r1x']);
  return {};
}

function hall(scene) { // 龍淵閣: a hall of red pillars on a stone floor, a dais and throne, banners, the banquet tables, lamps
  const G = new THREE.Group(); G.position.copy(HALL); scene.add(G); const K = kit(G), R = rng(31);
  K.baseplate(0, 0, 200, 160, '#5a5650');
  for (let x = -9; x <= 9; x += 6 * P) for (let z = -6; z <= 6; z += 6 * P) K.brick(x, 0, z, 6, 6, 'tile', '#6a2a1a'); // the floor
  for (let i = 0; i < 5; i++) for (const s of [-1, 1]) { const x = -8 + i * 4; K.round(x, 0, s * 6, 2, 'plate', '#8a8680'); let y = PH; for (let k = 0; k < 16; k++) y = K.round(x, y, s * 6, 2, 'brick', '#a81c18'); K.brick(x, y, s * 6, 2, 2, 'brick', '#d8a838'); }
  // the roof: a deck of dark plates over the pillars, slopes all round
  for (let x = -9.5; x <= 9.5; x += 4 * P) for (let z = -6.6; z <= 6.6; z += 4 * P) K.brick(x, 6.3, z, 4, 4, 'plate', '#2a2e36');
  for (let x = -9.5; x <= 9.5; x += 2 * P) { K.slope(x, 6.42, -6.9, 2, 2, '#2a2e36', 0); K.slope(x, 6.42, 6.9, 2, 2, '#2a2e36', Math.PI); }
  // the dais and throne at the back (+x)
  for (let z = -2.4; z <= 2.4; z += 2 * P) { K.brick(8.9, 0, z, 4, 2, 'brick', '#a81c18'); K.brick(8.9, BH, z, 4, 2, 'plate', '#d8a838'); }
  K.brick(9.1, BH + PH, 0, 3, 4, 'brick', '#d8a838'); K.brick(9.55, BH * 2 + PH, 0, 1, 5, 'brick', '#d8a838'); K.brick(9.55, BH * 3 + PH, 0, 1, 5, 'brick', '#d8a838');
  const sign = (tex, w, h, x, y, z, ry) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.06), new THREE.MeshPhysicalMaterial({ map: tex, roughness: 0.3, clearcoat: 0.6 })); m.position.set(x, y, z); m.rotation.y = ry; G.add(m); };
  sign(words('龍淵閣', 320, 96, 64, '#1a0c08', '#f0c858'), 3.4, 1.0, 9.7, 4.6, 0, -Math.PI / 2);
  for (const s of [-1, 1]) sign(words(s < 0 ? '仁義禮智信' : '天地君親師', 64, 320, 44, '#7a1012', '#f0c858', true), 0.9, 3.4, 9.6, 3.6, s * 2.4, -Math.PI / 2);
  // the banquet: low tables down both sides, white cups on them
  for (let i = 0; i < 4; i++) for (const s of [-1, 1]) { const x = -5 + i * 3; for (const dx of [-0.6, 0.6]) K.brick(x + dx, 0, s * 3.6, 1, 2, 'brick', '#3a2014'); K.brick(x, BH, s * 3.6, 6, 3, 'plate', '#5a2c18'); for (let k = 0; k < 3; k++) K.round(x - 0.5 + k * 0.5, BH + PH, s * 3.6, 1, 'plate', '#f0ece0'); }
  const lamps = [];
  for (const [x, z] of [[-6, -4.5], [-6, 4.5], [2, -4.5], [2, 4.5], [7, -2.8], [7, 2.8]]) { K.round(x, 4.3, z, 2, 'brick', '#ffb050', 'glow'); K.round(x, 4.3 + BH, z, 2, 'brick', '#ffb050', 'glow'); K.round(x, 4.3 + 2 * BH, z, 1, 'plate', '#a81c18'); const l = new THREE.PointLight('#ffa050', 9, 0, 2); l.position.set(x, 4.4, z); G.add(l); lamps.push(l); }
  // the courtyard: brick pines round about
  for (let k = 0; k < 16; k++) { const a = R() * 6.28, r = 16 + R() * 14, x = Math.cos(a) * r, z = Math.sin(a) * r * 0.8; let y = 0; for (let j = 0; j < 6; j++) y = K.round(x, y, z, 1, 'brick', '#5a3a24'); for (let j = 0, w = 8; w >= 2; j++, w -= 2) y = K.round(x, y, z, w, 'brick', '#1e5a2e'); }
  const fill = []; for (const [x, i] of [[5.5, 8], [-2, 6]]) { const l = new THREE.PointLight('#ffb070', i, 0, 2); l.position.set(x, 2.5, 0); G.add(l); fill.push(l); }
  solid(K.done(), ['r2x', 'b1x5', 'b3x4']);
  return { update: (t, sk) => { const n = sk?.lamps ?? 1; lamps.forEach((l, i) => { l.intensity = (8 + Math.sin(t * 9 + i) * 0.5) * (0.6 + 0.6 * n); }); fill.forEach((l) => { l.intensity = 7 * (0.5 + 0.7 * n); }); } };
}

function lotus(scene) { // 蓮心小築: a pavilion on a deck over water, lotus all round
  const G = new THREE.Group(); G.position.copy(LOTUS); scene.add(G); const K = kit(G), R = rng(41);
  K.baseplate(0, -0.4, 200, 200, '#1e4a7a');
  for (let x = -5.4; x <= 5.4; x += 6 * P) for (let z = -5.4; z <= 5.4; z += 6 * P) K.brick(x, -0.12, z, 6, 6, 'tile', '#7a5234');
  for (const [x, z] of [[-4.6, -4.6], [4.6, -4.6], [-4.6, 4.6], [4.6, 4.6]]) { let y = 0; for (let k = 0; k < 11; k++) y = K.round(x, y, z, 2, 'brick', '#a81c18'); }
  for (let x = -5.6; x <= 5.6; x += 4 * P) for (let z = -5.6; z <= 5.6; z += 4 * P) K.brick(x, 4.0, z, 4, 4, 'plate', '#2a3a34');
  for (let k = 0; k < 4; k++) { const w = 38 - k * 8; for (let x = -w * P / 2; x <= w * P / 2; x += 4 * P) for (const s of [-1, 1]) K.brick(x, 4.12 + k * BH, s * (w * P / 2), 4, 2, 'brick', '#2a3a34'); }
  for (let k = 0; k < 120; k++) { const a = R() * 6.28, r = 7 + R() * 22, x = Math.cos(a) * r, z = Math.sin(a) * r; K.round(x, -0.4, z, 4, 'plate', '#2e7a3a'); if (R() < 0.45) { K.round(x + 0.2, -0.28, z, 1, 'brick', '#f2a0c0'); K.round(x + 0.2, -0.28 + BH, z, 1, 'plate', '#ffe0ec'); } }
  // a low railing round the deck
  for (let x = -5.4; x <= 5.4; x += 2 * P) for (const s of [-1, 1]) { if (Math.abs(x) < 1 && s > 0) continue; K.brick(x, 0, s * 5.5, 2, 1, 'plate', '#4a2a1a'); K.brick(s * 5.5, 0, x, 1, 2, 'plate', '#4a2a1a'); }
  solid(K.done(), ['r2x']);
  return {};
}

export function buildBrickSet(scene, set = {}) {
  const kinds = set.kinds || ['bamboo'], rest = buildSet(scene, { ...set, kinds: kinds.filter((k) => !BRICK.has(k)) }); // the sky, and whatever has no brick version
  const parts = kinds.filter((k) => BRICK.has(k)).map((k) => ({ bamboo, hall, lotus })[k](scene, set));
  return { update: (t, sk) => { rest.update(t, sk); for (const p of parts) p.update?.(t, sk); } };
}
