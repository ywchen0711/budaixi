// A glove puppet in the Taiwanese style (布袋戲): a big carved head with a painted face, a crown, long hair, layered
// silk robes with embroidered patterns and gold trim, wide sleeves, small hands holding a sword, a fan or claws.
// No legs: the robe reaches the ground and the puppet glides, bobbing as the puppeteer's hand steps.
//   buildPuppet(spec) -> { group, parts, points, pose(ch, sec) }
// The head is made in js/models/heads.js, in one of its styles.
// spec (js/cast/characters.js): skin, face {brow, eye, lip, paint, mark}, hair {color, len, white}, crown {type, color,
// gem}, robe {base, pattern, ink, trim, inner, sleeve}, cape, ribbons, weapons {R, L}, scale
import * as THREE from '../../lib/three.module.min.js';
import { TOON } from '../toon.js?v=12';
import { headLook, addHead, lockAt } from './heads.js?v=12';

const toon = (o) => new THREE.MeshToonMaterial({ gradientMap: TOON, ...o });
function canvasTex(w, h, paint) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; paint(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}
const rnd = (s) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };

// ---------------------------------------------------------------- silk: a base colour with an embroidered pattern
function silkTex(R, seed) {
  return canvasTex(256, 256, (g, W, H) => {
    g.fillStyle = R.base; g.fillRect(0, 0, W, H);
    const r = rnd(seed + 7); g.strokeStyle = R.ink || 'rgba(255,255,255,0.35)'; g.fillStyle = R.ink || 'rgba(255,255,255,0.35)'; g.lineWidth = 2;
    if (R.pattern === 'clouds') { // auspicious clouds: spirals in a scatter
      for (let k = 0; k < 9; k++) { const x = r() * W, y = r() * H, s = 10 + r() * 14; g.beginPath(); for (let a = 0; a < 9; a += 0.25) { const rr = s * (1 - a / 10); g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } g.stroke(); g.beginPath(); g.arc(x + s * 1.2, y + s * 0.2, s * 0.6, Math.PI, 0); g.stroke(); }
    } else if (R.pattern === 'waves') {
      for (let y = 16; y < H; y += 26) for (let x = -20; x < W + 20; x += 36) { g.beginPath(); g.arc(x + ((y / 26) % 2) * 18, y, 16, Math.PI, 0); g.stroke(); g.beginPath(); g.arc(x + ((y / 26) % 2) * 18, y, 9, Math.PI, 0); g.stroke(); }
    } else if (R.pattern === 'scales') {
      for (let y = 0; y < H + 16; y += 14) for (let x = 0; x < W + 16; x += 16) { g.beginPath(); g.arc(x + ((y / 14) % 2) * 8, y, 8, 0, Math.PI); g.stroke(); }
    } else if (R.pattern === 'lotus') {
      for (let k = 0; k < 7; k++) { const x = r() * W, y = r() * H; for (let p = 0; p < 5; p++) { g.save(); g.translate(x, y); g.rotate((p - 2) * 0.45); g.beginPath(); g.ellipse(0, -10, 4.5, 11, 0, 0, Math.PI * 2); g.fill(); g.restore(); } }
    } else if (R.pattern === 'plum') {
      for (let k = 0; k < 14; k++) { const x = r() * W, y = r() * H; for (let p = 0; p < 5; p++) { g.beginPath(); g.arc(x + Math.cos(p * 1.256) * 5, y + Math.sin(p * 1.256) * 5, 3.6, 0, Math.PI * 2); g.fill(); } }
      g.lineWidth = 1.5; for (let k = 0; k < 6; k++) { g.beginPath(); let x = r() * W, y = r() * H; g.moveTo(x, y); for (let j = 0; j < 4; j++) { x += (r() - 0.5) * 40; y += r() * 30; g.lineTo(x, y); } g.stroke(); }
    }
    else if (R.pattern === 'weave') { // rough hemp: slubbed threads both ways, mottled
      for (let k = 0; k < 900; k++) { g.fillStyle = `rgba(${r() < 0.5 ? '255,255,255' : '0,0,0'},${0.04 + r() * 0.08})`; const x = r() * W, y = r() * H; if (r() < 0.5) g.fillRect(x, y, 6 + r() * 30, 1 + r() * 1.5); else g.fillRect(x, y, 1 + r() * 1.5, 6 + r() * 30); }
      for (let k = 0; k < 30; k++) { g.fillStyle = `rgba(0,0,0,${0.03 + r() * 0.05})`; g.beginPath(); g.ellipse(r() * W, r() * H, 10 + r() * 30, 6 + r() * 20, r() * 3, 0, Math.PI * 2); g.fill(); }
    } else if (R.pattern === 'split') { // half one colour, half another: down the front and the back
      g.fillStyle = R.ink || '#141414'; g.fillRect(W / 2, 0, W / 2, H);
    } else if (R.pattern === 'plain') { // plain white silk: long soft folds
      for (let k = 0; k < 14; k++) { const x = r() * W, gr = g.createLinearGradient(x - 12, 0, x + 12, 0); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(0.5, `rgba(120,120,140,${0.05 + r() * 0.06})`); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - 12, 0, 24, H); }
    }
    // a faint weave
    g.globalAlpha = 0.07; g.fillStyle = '#000'; for (let y = 0; y < H; y += 2) g.fillRect(0, y, W, 1); g.globalAlpha = 1;
  });
}

// ---------------------------------------------------------------- weapons (along the hand's +z, as a fist holds them)
function weapon(type, M, side) {
  const g = new THREE.Group(), tip = new THREE.Object3D();
  const add = (geo, mat, x, y, z, rx = 0, ry = 0, rz = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.rotation.set(rx, ry, rz); m.castShadow = true; g.add(m); return m; };
  const steel = toon({ color: '#d8dce4' }), gold = M.gold, dark = toon({ color: '#20140e' }), tassel = toon({ color: M.tassel || '#c81e2a' });
  let tassels = [];
  if (type === 'jian' || type === 'saber' || type === 'dagger') {
    const L = type === 'dagger' ? 0.26 : type === 'saber' ? 0.62 : 0.7, W = type === 'saber' ? 0.05 : 0.036;
    add(new THREE.CylinderGeometry(0.016, 0.016, 0.12, 8), dark, 0, 0, -0.02, Math.PI / 2);
    add(new THREE.SphereGeometry(0.022, 8, 6), gold, 0, 0, -0.085);
    add(new THREE.BoxGeometry(0.11, 0.026, 0.03), gold, 0, 0, 0.05);
    const blade = add(new THREE.BoxGeometry(0.006, W, L), steel, 0, 0, 0.07 + L / 2); if (type === 'saber') { blade.rotation.x = -0.06; blade.position.y = 0.012; }
    add(new THREE.ConeGeometry(W / 2, 0.06, 4), steel, 0, 0, 0.07 + L + 0.025, Math.PI / 2, 0, Math.PI / 4).scale.set(0.2, 1, 1);
    add(new THREE.BoxGeometry(0.008, 0.006, L * 0.85), toon({ color: '#9aa2b0' }), 0, 0, 0.07 + L * 0.45);
    tip.position.set(0, 0, 0.07 + L + 0.04);
    if (type !== 'dagger') { // the sword tassel hanging from the pommel
      let p = new THREE.Group(); p.position.set(0, 0, -0.1); g.add(p);
      for (let k = 0; k < 3; k++) { const q = new THREE.Group(); q.position.set(0, k ? -0.06 : -0.01, 0); p.add(q); const m = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.016, 0.06, 6), tassel); m.position.y = -0.03; q.add(m); tassels.push(q); p = q; }
    }
  } else if (type === 'claw') {
    add(new THREE.BoxGeometry(0.09, 0.05, 0.08), toon({ color: '#2a1418' }), 0, -0.02, 0.0);
    for (let k = -1; k <= 1; k++) { const b = add(new THREE.ConeGeometry(0.012, 0.28, 5), toon({ color: '#a8202c', emissive: '#300408' }), k * 0.03, -0.14, 0.05, Math.PI + 0.25, 0, 0); void b; }
    tip.position.set(0, -0.28, 0.12);
  } else if (type === 'whisk') { // a horsetail whisk: a jade handle, a long fall of white hair
    add(new THREE.CylinderGeometry(0.012, 0.014, 0.26, 8), toon({ color: '#c8e0c0' }), 0, 0, 0.02, Math.PI / 2);
    add(new THREE.SphereGeometry(0.02, 8, 6), gold, 0, 0, 0.16);
    const hairM = toon({ color: '#f4f4ee', side: THREE.DoubleSide });
    let p = new THREE.Group(); p.position.set(0, 0, 0.17); g.add(p);
    for (let k = 0; k < 4; k++) { const q = new THREE.Group(); q.position.set(0, 0, k ? 0.09 : 0); p.add(q); const m = new THREE.Mesh(new THREE.CylinderGeometry(0.03 - k * 0.004, 0.024 - k * 0.004, 0.09, 8, 1, true), hairM); m.rotation.x = Math.PI / 2; m.position.z = 0.045; q.add(m); tassels.push(q); p = q; }
    tip.position.set(0, 0, 0.5);
  } else if (type === 'fan') {
    const fan = new THREE.Mesh(new THREE.CircleGeometry(0.26, 18, 0, Math.PI * 0.75), toon({ color: '#f4ecd8', side: THREE.DoubleSide, map: canvasTex(128, 128, (c) => { c.fillStyle = '#f4ecd8'; c.fillRect(0, 0, 128, 128); c.strokeStyle = '#2a2018'; c.lineWidth = 2; c.beginPath(); c.moveTo(20, 100); c.quadraticCurveTo(60, 40, 110, 30); c.stroke(); c.fillStyle = '#b02020'; c.fillRect(90, 80, 10, 10); }) }));
    fan.rotation.set(0, -Math.PI / 2, Math.PI * 0.12); g.add(fan); tip.position.set(0, 0.15, 0.2);
  }
  g.add(tip);
  return { group: g, tip, tassels, type };
}

// ---------------------------------------------------------------- the puppet
export function buildPuppet(spec0) {
  let spec = spec0;
  const R = spec.robe || {}, H = spec.hair || {}, K = spec.scale || 1;
  // the build (js/models/looks.js): L below the waist, T the torso, S shoulders, W waist, Hp hips, G girth, A arms, Hd head
  const B = { L: 1, T: 1, S: 1, W: 1, Hp: 1, G: 1, A: 1, Hd: 1, ...(spec.body || {}) };
  const look = headLook(spec), human = look.p.sculpt, fem = !!spec.face?.fem; // (the glove-puppet style keeps the puppet's own big head)
  if (human) { B.L *= 1.5; B.T *= 1.12; B.A *= 1.24; B.Hd *= 0.86; }
  if (human && fem) { B.S *= 0.84; B.W *= 0.76; B.G *= 0.88; B.Hp *= 0.92; B.T *= 0.96; B.L *= 1.04; B.Hd *= 0.97; B.A *= 0.96; }
  const P0 = 0.62 * B.L;
  const sk = R.skirtBase ? toon({ map: silkTex({ ...R, base: R.skirtBase, pattern: R.skirtPattern || 'plain' }, 2), side: THREE.DoubleSide }) : null;
  const M = {
    skin: look.skin, face: look.face,
    silk: toon({ map: silkTex(R, 1), side: THREE.DoubleSide }), silk2: toon({ color: R.inner || '#e8e8ee' }), trim: toon({ color: R.trim || '#c8a040' }),
    gold: toon({ color: (spec.crown?.color) || '#d4a840', emissive: '#2a1a00' }), gem: new THREE.MeshBasicMaterial({ color: spec.crown?.gem || '#40a0ff' }),
    hair: look.hair, belt: toon({ color: R.belt || R.trim || '#8a6a2a' }), jade: toon({ color: '#5ab08a', emissive: '#082014' }),
    cape: spec.cape ? toon({ color: spec.cape.color, side: THREE.DoubleSide, map: silkTex({ base: spec.cape.color, pattern: spec.cape.pattern, ink: spec.cape.ink }, 3) }) : null,
    ribbon: spec.ribbons ? toon({ color: spec.ribbons.color, side: THREE.DoubleSide }) : null, tassel: R.tassel,
    hole: toon({ color: '#120c0e', side: THREE.DoubleSide }),
  };
  M.skirt = sk || M.silk;
  if (human && fem && !spec.ribbons) spec = { ...spec, ribbons: { color: R.pibo || R.inner || '#f0e0e8' } }; // a long shawl (披帛) over the arms
  if (spec.ribbons && !M.ribbon) M.ribbon = toon({ color: spec.ribbons.color, side: THREE.DoubleSide });
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body); root.scale.setScalar(K);
  const mesh = (p, geo, mat, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.rotation.set(rx, ry, rz); m.castShadow = true; m.receiveShadow = true; p.add(m); return m; };
  const pivot = (p, x, y, z) => { const g = new THREE.Group(); g.position.set(x, y, z); p.add(g); return g; };
  const tube = (r0, r1, h, n = 18) => new THREE.CylinderGeometry(r1, r0, h, n, 1, true); // r0 at the bottom

  // ---- the lower robe: a waist, two tiers of skirt that sway, an apron panel in front, gold hems
  const pelvis = pivot(body, 0, P0, 0);
  if (human) mesh(pelvis, new THREE.CylinderGeometry(0.165, 0.165, 0.028, 18), M.belt, 0, 0.012, 0).scale.set(B.W, 1, B.W * B.G); // a slim belt
  else { mesh(pelvis, new THREE.CylinderGeometry(0.17, 0.17, 0.07, 18), M.belt, 0, 0, 0).scale.set(B.W, 1, B.W * B.G); mesh(pelvis, new THREE.CylinderGeometry(0.04, 0.04, 0.012, 14), M.jade, 0.0, -0.06, 0.17, Math.PI / 2); }
  const skirtU = pivot(pelvis, 0, -0.02, 0), skirtL = pivot(skirtU, 0, -0.3, 0); skirtU.scale.set(B.Hp, B.L, B.Hp * B.G);
  const sU = mesh(skirtU, tube(0.29 * (R.skirt || 1), 0.165, 0.3), M.skirt, 0, -0.15, 0); sU.material.side = THREE.DoubleSide;
  mesh(skirtL, tube(0.42 * (R.skirt || 1), 0.29 * (R.skirt || 1), 0.32), M.skirt, 0, -0.16, 0);
  if (human) { // the sash ends and a jade pendant with its tassel, hanging down the front of the skirt
    const sash = toon({ color: R.belt || R.trim || '#8a6a2a', side: THREE.DoubleSide });
    for (const sx of [-1, 1]) mesh(skirtU, new THREE.PlaneGeometry(0.026, 0.46), sash, sx * 0.03, -0.23, 0.226, -0.4, 0, sx * 0.04);
    mesh(skirtU, new THREE.CylinderGeometry(0.026, 0.026, 0.008, 16), M.jade, 0, -0.08, 0.2, Math.PI / 2 - 0.4);
    mesh(skirtU, new THREE.CylinderGeometry(0.004, 0.012, 0.12, 6), toon({ color: R.tassel || '#c81e2a' }), 0, -0.16, 0.232, -0.4);
  }
  mesh(skirtL, new THREE.TorusGeometry(0.42 * (R.skirt || 1), 0.012, 6, 28), M.trim, 0, -0.31, 0, Math.PI / 2);
  const apron = pivot(pelvis, 0, -0.03, 0.17 * B.Hp * B.G); apron.scale.set(1, B.L, 1); mesh(apron, new THREE.PlaneGeometry(0.16, 0.5), M.silk2, 0, -0.25, 0.02).material.side = THREE.DoubleSide;
  mesh(apron, new THREE.PlaneGeometry(0.17, 0.03), M.trim, 0, -0.5, 0.025); apron.visible = !human;
  // ---- the chest: a tapered robe, the collar crossed right over left, shoulders
  const torso = pivot(pelvis, 0, 0.03, 0);
  const chest = mesh(torso, new THREE.CylinderGeometry(0.21 * B.S, 0.155 * B.W, 0.42 * B.T, 18), M.silk, 0, 0.21 * B.T, 0); chest.scale.z = 0.72 * B.G;
  mesh(torso, new THREE.SphereGeometry(0.21 * B.S, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), M.silk, 0, 0.41 * B.T, 0).scale.set(1, 0.35, 0.72 * B.G);
  // what is worn over the chest follows its build: a group scaled to it
  const dress = pivot(torso, 0, 0, 0); dress.scale.set((B.S + B.W) / 2, B.T, B.G);
  // a band laid on the chest's surface from (x0, y0) to (x1, y1): segments following the curve of the robe
  const band = (x0, y0, x1, y1, w, mat, n = 8, out = 0.004) => { // one strip, following the chest's surface
    const P = [], N = [];
    for (let k = 0; k <= n; k++) {
      const a = k / n, x = x0 + (x1 - x0) * a, y = y0 + (y1 - y0) * a, r = 0.155 + 0.055 * Math.min(1, y / 0.42), z = 0.72 * r * Math.sqrt(Math.max(0.02, 1 - (x / r) ** 2));
      P.push(new THREE.Vector3(x, y, z)); N.push(new THREE.Vector3(x / (r * r), 0, z / (0.5184 * r * r)).normalize());
    }
    const pos = [], idx = [];
    for (let k = 0; k <= n; k++) {
      const d = P[Math.min(n, k + 1)].clone().sub(P[Math.max(0, k - 1)]).normalize(), sd = d.clone().cross(N[k]).normalize().multiplyScalar(w / 2), c = P[k].clone().addScaledVector(N[k], out);
      pos.push(...c.clone().add(sd).toArray(), ...c.clone().sub(sd).toArray());
      if (k < n) idx.push(2 * k, 2 * k + 1, 2 * k + 2, 2 * k + 1, 2 * k + 3, 2 * k + 2);
    }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setIndex(idx); geo.computeVertexNormals();
    const m = mesh(dress, geo, mat); m.material = mat.clone(); m.material.side = THREE.DoubleSide; return m;
  };
  if (human) {
    band(0.035, 0.47, -0.06, 0.3, 0.05, M.silk2, 4); band(0.04, 0.47, -0.055, 0.31, 0.018, M.trim, 4, 0.006);   // the inner collar, left over to the wearer's left
    band(-0.04, 0.47, 0.15, 0.2, 0.06, M.silk2, 9, 0.007); band(-0.038, 0.475, 0.15, 0.205, 0.022, M.trim, 9, 0.01); // the outer collar, across to the right
    band(0.15, 0.2, 0.135, 0.02, 0.02, M.trim, 3, 0.01);                                                        // and down the right side to the belt
  } else for (const s of [-1, 1]) { // the crossed collar of a glove puppet: on each side a band from the neck down to below the breastbone
    mesh(dress, new THREE.BoxGeometry(0.055, 0.27, 0.008), M.silk2, s * 0.03, 0.352, 0.148, 0.09, 0, -s * 0.36);
    mesh(dress, new THREE.BoxGeometry(0.026, 0.28, 0.01), M.trim, s * 0.056, 0.35, 0.149, 0.09, 0, -s * 0.36);
  }
  if (human && fem) { // a high-waisted skirt (齊胸襦裙): tied just under the breast, falling from there
    const hi = mesh(torso, new THREE.CylinderGeometry(0.175 * B.S, 0.162 * B.W, 0.29 * B.T, 18, 1, true), M.skirt, 0, 0.145 * B.T, 0); hi.scale.z = 0.74 * B.G; hi.material.side = THREE.DoubleSide;
    mesh(torso, new THREE.TorusGeometry(0.176 * B.S, 0.009, 6, 24), M.belt, 0, 0.29 * B.T, 0, Math.PI / 2).scale.set(1, 0.74 * B.G, 1);
    const sash = toon({ color: R.belt || R.trim, side: THREE.DoubleSide });
    for (const sx of [-1, 1]) mesh(torso, new THREE.PlaneGeometry(0.022, 0.55), sash, sx * 0.025, 0.29 * B.T - 0.27, 0.142 * B.G, -0.12, 0, sx * 0.05);
  }
  mesh(torso, new THREE.CylinderGeometry(0.05, 0.06, 0.07, 10), M.skin, 0, 0.47 * B.T, 0);
  if (spec.armor) for (const s of [-1, 1]) mesh(torso, new THREE.SphereGeometry(0.11, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), M.gold, s * 0.2 * B.S, 0.39 * B.T, 0).scale.set(1.1 * B.S, 0.6, B.G);
  // ---- the head: big, carved, painted; hair over it; a crown
  const neck = pivot(torso, 0, 0.5 * B.T, 0), head = pivot(neck, 0, 0.0, 0); head.scale.setScalar(B.Hd);
  addHead(head, spec, look, mesh); // the skull, the face, the eyes, the hair over it: js/models/heads.js, in the chosen style
  const crown = pivot(head, 0, 0.29, -0.03), C = spec.crown || {};
  if (C.type === 'horns') {
    mesh(crown, new THREE.CylinderGeometry(0.07, 0.09, 0.06, 12), M.gold, 0, -0.01, 0.02);
    for (const s of [-1, 1]) mesh(crown, new THREE.ConeGeometry(0.03, 0.22, 8), M.gold, s * 0.07, 0.1, 0.0, 0, 0, s * -0.5);
    mesh(crown, new THREE.SphereGeometry(0.026, 10, 8), M.gem, 0, 0.02, 0.09);
  } else if (C.type === 'hairpin') {
    mesh(crown, new THREE.SphereGeometry(0.06, 12, 10), M.hair, 0, -0.01, -0.06); // a bun
    mesh(crown, new THREE.CylinderGeometry(0.006, 0.006, 0.26, 6), M.gold, 0, 0.0, -0.06, 0, 0, Math.PI / 2 - 0.3);
    for (const s of [-1, 1]) mesh(crown, new THREE.SphereGeometry(0.02, 8, 6), M.gem, s * 0.12, -0.02 + s * 0.04, -0.06);
  } else if (C.type === 'topknot') { // the hair gathered up into a knot on the crown, tied with a band
    mesh(crown, new THREE.SphereGeometry(0.034, 16, 12), M.hair, 0, -0.012, 0.005).scale.set(1, 0.9, 1);
    mesh(crown, new THREE.TorusGeometry(0.03, 0.007, 8, 20), toon({ color: C.color || '#2a2622' }), 0, -0.025, 0.005, Math.PI / 2);
  } else if (C.type === 'halfup') { // the top hair tied back in a small knot with a ribbon, the rest falling loose
    mesh(crown, new THREE.SphereGeometry(0.03, 14, 10), M.hair, 0, -0.07, -0.075);
    for (const s of [-1, 1]) mesh(crown, new THREE.PlaneGeometry(0.02, 0.12), toon({ color: C.color || '#f2f0ec', side: THREE.DoubleSide }), s * 0.018, -0.13, -0.1, 0.2, 0, s * 0.15);
  } else if (C.type === 'cap') { // a small round cap with a brim
    mesh(crown, new THREE.CylinderGeometry(0.08, 0.095, 0.07, 14), toon({ color: C.color || '#3a2a1a' }), 0, -0.03, 0.03);
    mesh(crown, new THREE.CylinderGeometry(0.13, 0.13, 0.012, 16), toon({ color: C.color || '#3a2a1a' }), 0, -0.065, 0.03);
  } else if (C.type === 'bun') { // a Taoist's knot of hair with a wooden pin through it
    mesh(crown, new THREE.SphereGeometry(0.036, 14, 10), M.hair, 0, -0.01, 0.0);
    mesh(crown, new THREE.CylinderGeometry(0.004, 0.004, 0.14, 6), toon({ color: C.color || '#6a4a2a' }), 0, -0.004, 0, 0, 0, Math.PI / 2);
  } else if (C.type === 'buddha') { // a Buddhist crown: five gold petals in an arc, a jewel in the middle
    for (let k = -2; k <= 2; k++) { const m = mesh(crown, new THREE.CircleGeometry(0.04, 3, Math.PI / 2 - 0.5, 1.0), M.gold, k * 0.04, -0.03 + (2 - Math.abs(k)) * 0.008, 0.065 - Math.abs(k) * 0.018, -0.2, k * 0.35, 0); m.scale.set(1, 1.6, 1); m.material.side = THREE.DoubleSide; }
    mesh(crown, new THREE.TorusGeometry(0.075, 0.008, 6, 24), M.gold, 0, -0.06, 0.02, Math.PI / 2);
    mesh(crown, new THREE.SphereGeometry(0.014, 8, 6), M.gem, 0, 0.0, 0.075);
  } else if (C.type === 'mask') { // a silver mask over the upper face, slits for the eyes
    const mt = canvasTex(128, 64, (g, W, H) => { g.fillStyle = C.color || '#d8dce8'; g.fillRect(0, 0, W, H); g.strokeStyle = 'rgba(60,60,80,0.5)'; g.lineWidth = 2; for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(10 + k * 20, 4); g.quadraticCurveTo(64, 30, 118 - k * 20, 4); g.stroke(); } g.fillStyle = '#05050a'; for (const s of [-1, 1]) { g.beginPath(); g.ellipse(64 + s * 22, 34, 13, 4, s * -0.25, 0, Math.PI * 2); g.fill(); } });
    const m = mesh(head, new THREE.SphereGeometry(0.1, 24, 10, Math.PI * 0.5 - 0.95, 1.9, Math.PI * 0.33, Math.PI * 0.22), new THREE.MeshPhysicalMaterial({ map: mt, metalness: 0.15, roughness: 0.25, clearcoat: 1, sheen: 0.6, sheenColor: '#e8f0ff', emissive: '#202430', side: THREE.DoubleSide }), 0, 0.14, -0.003);
    m.scale.set(1.05, 1.08, 1.02);
  } else if (C.type === 'none') {
  } else if (C.type === 'hood') {
    mesh(head, new THREE.SphereGeometry(0.16, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.6), toon({ color: '#141016', side: THREE.DoubleSide }), 0, 0.14, -0.01).scale.set(1, 1.15, 1.05);
    mesh(head, new THREE.PlaneGeometry(0.2, 0.09), toon({ color: '#8a1018', side: THREE.DoubleSide }), 0, 0.09, 0.135); // the mask
  } else {
    mesh(crown, new THREE.CylinderGeometry(0.045, 0.055, 0.07, 12), M.gold, 0, 0, 0);
    mesh(crown, new THREE.SphereGeometry(0.02, 10, 8), M.gem, 0, 0.01, 0.055);
    mesh(crown, new THREE.CylinderGeometry(0.005, 0.005, 0.24, 6), M.gold, 0, 0.0, 0, 0, 0, Math.PI / 2);
    for (const s of [-1, 1]) mesh(crown, new THREE.BoxGeometry(0.012, 0.1, 0.012), M.gold, s * 0.12, -0.04, 0);
  }
  // long hair down the back, forelocks, ribbons from the crown: chains of segments, swung by springs (sec)
  const chain = (parent, x, y, z, n, len, w, mat, taper = 0.75, shape = 'flat') => {
    const out = []; let p = pivot(parent, x, y, z);
    for (let k = 0; k < n; k++) {
      const q = k ? pivot(p, 0, -len, 0) : p, w0 = w * Math.pow(taper, k), w1 = w0 * taper;
      const geo = shape === 'tube' ? new THREE.CylinderGeometry(w0 / 2, w1 / 2, len, 9, 1, true).scale(1, 1, 0.45)
        : shape === 'wrap' ? new THREE.CylinderGeometry(w0, w1, len, 18, 1, true, Math.PI * 0.62, Math.PI * 0.76)
        : new THREE.PlaneGeometry(w0, len);
      mesh(q, geo, mat, 0, -len / 2, 0); out.push(q); p = q;
    }
    return out;
  };
  const strands = (col) => { const c = new THREE.Color(col), t = canvasTex(64, 128, (g, W, H) => { g.fillStyle = col; g.fillRect(0, 0, W, H); for (let x = 0; x < W; x++) { const k = 0.72 + 0.5 * Math.random(); g.fillStyle = `rgb(${Math.min(255, c.r * 255 * k + 10)},${Math.min(255, c.g * 255 * k + 10)},${Math.min(255, c.b * 255 * k + 12)})`; g.fillRect(x, 0, 1, H); } }); t.repeat.set(3, 1); return t; };
  const hairLen = (H.len || 0.9) / 4;
  const hair = H.none ? [] : look.p.sculpt ? chain(head, 0, 0.13, -0.075, 4, hairLen, 0.088, M.hair, 0.86, 'wrap') : chain(head, 0, 0.12, -0.13, 4, hairLen, 0.25, M.hair, 0.82);
  const LK = lockAt(look), segL = look.p.sculpt ? 0.06 : 0.12, lockN = Math.max(2, Math.round((H.lockLen || 0.24) / segL));
  const lockM = H.locks ? new THREE.MeshPhysicalMaterial({ map: strands(H.locks), roughness: 0.5, sheen: 0.6, sheenColor: '#ffffff', side: THREE.DoubleSide }) : M.hair;
  // each side lock can be several finer strands, a little apart and of different lengths, so it reads as hair
  const NS = look.p.sculpt ? H.lockStrands || 1 : 1, forelocks = [];
  if (!H.none) for (const s of [-1, 1]) for (let j = 0; j < NS; j++) {
    const o = NS > 1 ? (j - (NS - 1) / 2) / (NS - 1) : 0, n = Math.max(2, lockN - (j % 2) * Math.round(lockN * 0.2));
    forelocks.push(chain(head, s * (LK[0] + Math.abs(o) * 0.004), LK[1] - Math.abs(o) * 0.006, LK[2] + o * 0.026, n, segL, (H.lockW || 0.035) / Math.sqrt(NS), lockM, look.p.sculpt ? 0.95 : 0.9, look.p.sculpt ? 'tube' : 'flat'));
  }
  // long locks are laid forward over the front of the shoulders, so they hang down the chest, not through it
  // down beside the jaw to the shoulder, forward over it, then down the chest
  const lockBase = segL < 0.1 ? Array.from({ length: lockN }, (_, i) => [-0.1, 0, 0, -0.9, 0, 0.6, 0.25, 0.05][i] ?? 0.02 * Math.sin(i * 1.7))
    : lockN >= 4 ? [-0.95, 0.65, 0.2, 0, 0.02] : lockN === 3 ? [-0.55, 0.35, 0.1] : [0];
  const ribbons = spec.crownRibbon ? [-1, 1].map((s) => chain(crown, s * 0.03, 0.0, -0.04, 4, 0.13, 0.03, M.trim, 0.95)) : [];
  // ---- arms: shoulder, upper arm (in its sleeve), elbow, a wide sleeve that hangs, a small hand
  const SW = R.sleeve || 1;
  const arm = (side) => {
    const sh = pivot(torso, side * 0.21 * B.S, 0.37 * B.T, 0), g = 0.8 + 0.2 * B.G, ua = 0.25 * B.A, fa = 0.2 * B.A;
    mesh(sh, new THREE.SphereGeometry(0.075 * g, 12, 8), M.silk, 0, 0, 0);
    const up = pivot(sh, 0, 0, 0);
    mesh(up, tube(0.095 * SW * g, 0.075 * g, ua), M.silk, 0, -ua / 2, 0).material.side = THREE.DoubleSide;
    const el = pivot(up, 0, -ua, 0);
    const cuff = (human ? 0.12 : 0.1) * SW * g;
    mesh(el, tube(cuff, 0.08 * g, fa), M.silk, 0, -fa / 2, 0).material.side = THREE.DoubleSide;
    if (human) mesh(el, tube(cuff, cuff * 0.97, 0.03, 22), M.trim, 0, -fa + 0.015, 0).material.side = THREE.DoubleSide; // a band of trim at the cuff
    else mesh(el, new THREE.TorusGeometry(cuff, 0.005, 6, 22), M.trim, 0, -fa, 0, Math.PI / 2);
    // the long hanging part of the sleeve, below the forearm, on its own joint
    const drop = pivot(el, 0, -0.12, -0.02);
    if (human) { // the deep belly of a Chinese sleeve: a curve from the elbow round to the cuff, hemmed in the trim colour
      const w = 0.26 * SW, h = 0.36 * SW, sh2 = new THREE.Shape(); sh2.moveTo(-w / 2, 0); sh2.lineTo(w / 2, 0); sh2.lineTo(w / 2, -h * 0.35); sh2.quadraticCurveTo(w / 2, -h, -w * 0.05, -h); sh2.quadraticCurveTo(-w / 2, -h, -w / 2, -h * 0.45); sh2.lineTo(-w / 2, 0);
      mesh(drop, new THREE.ShapeGeometry(sh2, 12), M.silk, 0, 0, 0).material.side = THREE.DoubleSide;
      const hem = new THREE.Shape(); hem.moveTo(w / 2, -h * 0.35); hem.quadraticCurveTo(w / 2, -h, -w * 0.05, -h); hem.quadraticCurveTo(-w / 2, -h, -w / 2, -h * 0.45); hem.lineTo(-w / 2 + 0.018, -h * 0.45); hem.quadraticCurveTo(-w / 2 + 0.018, -h + 0.018, -w * 0.05, -h + 0.018); hem.quadraticCurveTo(w / 2 - 0.018, -h + 0.018, w / 2 - 0.018, -h * 0.35);
      mesh(drop, new THREE.ShapeGeometry(hem, 12), M.trim, 0, 0, 0.002).material.side = THREE.DoubleSide;
    } else { mesh(drop, new THREE.PlaneGeometry(0.24 * SW, 0.34 * SW), M.silk, 0, -0.17 * SW, 0).material.side = THREE.DoubleSide; mesh(drop, new THREE.PlaneGeometry(0.25 * SW, 0.02), M.trim, 0, -0.34 * SW, 0.002); }
    const wr = pivot(el, 0, -fa, 0);
    mesh(wr, new THREE.BoxGeometry(0.055, 0.075, 0.035), M.skin, 0, -0.045, 0.004); mesh(wr, new THREE.BoxGeometry(0.018, 0.04, 0.018), M.skin, -side * 0.032, -0.03, 0.02, 0, 0, side * 0.5);
    const hand = pivot(wr, 0, -0.06, 0.01);
    return { sh, up, el, wr, hand, drop, side };
  };
  const armR = arm(1), armL = arm(-1);
  // ---- a cape, or silk ribbons flowing from the shoulders
  const cape = spec.cape ? chain(torso, 0, 0.42 * B.T, -0.13 * B.G, 4, 0.2, 0.52, M.cape, 0.98) : [];
  const ribbonsBody = spec.ribbons ? [-1, 1].map((s) => chain(torso, s * 0.2 * B.S, 0.38 * B.T, -0.05, 6, 0.13, 0.05, M.ribbon, 0.97)) : [];
  // ---- what a swordsman of the dramas wears: earrings, a rough cloak over the shoulders, a sash across, a sword on the back
  if (spec.earrings) for (const s of [-1, 1]) {
    mesh(head, new THREE.SphereGeometry(0.0035, 8, 6), M.gold, s * 0.084, 0.097, -0.012);
    mesh(head, new THREE.CylinderGeometry(0.0009, 0.0009, 0.012, 4), M.gold, s * 0.084, 0.089, -0.012);
    mesh(head, new THREE.SphereGeometry(0.0055, 10, 8), new THREE.MeshPhysicalMaterial({ color: spec.earrings, roughness: 0.2, clearcoat: 1, sheen: 1, sheenColor: '#ffe8f0' }), s * 0.084, 0.08, -0.012);
  }
  if (spec.shawl) {
    const sh = toon({ map: silkTex({ base: spec.shawl.color, pattern: 'weave' }, 5), side: THREE.DoubleSide });
    const cl = mesh(dress, new THREE.CylinderGeometry(0.16, 0.3, 0.32, 28, 1, true, Math.PI * 0.17, Math.PI * 1.66), sh, 0, 0.34, -0.005, 0, 0, -0.1); cl.scale.z = 0.8; // open at the front, over the collar
  }
  if (spec.sash) {
    const sm = toon({ map: silkTex({ base: spec.sash, pattern: 'weave' }, 9) });
    mesh(dress, new THREE.BoxGeometry(0.05, 0.6, 0.014), sm, 0.0, 0.25, 0.166, -0.12, 0, -0.62);
    mesh(dress, new THREE.BoxGeometry(0.05, 0.6, 0.014), sm, 0.0, 0.25, -0.166, 0.12, 0, 0.62);
    mesh(dress, new THREE.TorusGeometry(0.03, 0.012, 6, 12), sm, 0.13, 0.43, 0.06, 0.4, 0.6, 0); // the knot at the shoulder
  }
  if (spec.back) { // the big sword on the back: the hilt up over the right shoulder, the blade down to the left hip
    const b = new THREE.Group(); b.position.set(0.02, 0.27, -0.185); b.rotation.set(Math.PI / 2, 0, -0.62, 'ZYX'); dress.add(b);
    const leather = toon({ color: '#1e1a1c' }), metal = toon({ color: '#3a3a40' });
    mesh(b, new THREE.BoxGeometry(0.075, 0.03, 0.74), leather, 0, 0, 0.3);
    for (const z of [0.0, 0.32, 0.64]) mesh(b, new THREE.BoxGeometry(0.084, 0.036, 0.04), metal, 0, 0, z);
    mesh(b, new THREE.BoxGeometry(0.12, 0.05, 0.04), metal, 0, 0, -0.08);                       // the guard
    mesh(b, new THREE.CylinderGeometry(0.019, 0.019, 0.2, 10), leather, 0, 0, -0.19, Math.PI / 2); // the grip
    for (let k = 0; k < 5; k++) mesh(b, new THREE.TorusGeometry(0.021, 0.004, 6, 14), M.gold, 0, 0, -0.11 - k * 0.04);
    mesh(b, new THREE.BoxGeometry(0.05, 0.04, 0.05), metal, 0, 0, -0.31);                       // the pommel
    mesh(b, new THREE.SphereGeometry(0.012, 8, 6), M.gold, 0, 0.022, -0.31);
  }
  // ---- weapons
  const weap = {};
  for (const [s, type] of Object.entries(spec.weapons || {})) { if (!type) continue; const A = s === 'R' ? armR : armL; const w = weapon(type, M, A.side); A.hand.add(w.group); weap[s] = w; }

  const parts = { pelvis, skirtU, skirtL, torso, neck, head, armR, armL, hair, forelocks, ribbons, cape, ribbonsBody, apron };
  const tmp = new THREE.Vector3();
  const world = (o, x = 0, y = 0, z = 0) => { o.updateWorldMatrix(true, false); return new THREE.Vector3(x, y, z).applyMatrix4(o.matrixWorld); };
  const points = {
    chest: () => world(torso, 0, 0.25, 0.1), head: () => world(head, 0, 0.14, 0), eye: () => world(head, 0, 0.14, 0.13), root: () => world(root),
    handR: () => world(armR.hand), handL: () => world(armL.hand), shoulderR: () => world(armR.sh), shoulderL: () => world(armL.sh),
    tipR: () => (weap.R ? world(weap.R.tip) : world(armR.hand, 0, 0, 0.1)), tipL: () => (weap.L ? world(weap.L.tip) : world(armL.hand, 0, 0, 0.1)),
    launcher: () => world(armR.hand), muzzle: () => world(armR.hand), front: (off = [0, 0, 0.9]) => world(root, ...off),
  };
  void tmp;
  // ch: { lean, twist, roll, crouch, bob, headX, headY, headZ, R: {s, e, w, a}, L: {...} }; sec: the swinging cloth and hair
  function pose(ch, sec = {}) {
    pelvis.position.y = P0 - 0.16 * B.L * (ch.crouch || 0) + (ch.bob || 0);
    pelvis.rotation.set((ch.lean || 0) * 0.35, (ch.twist || 0) * 0.3, (ch.roll || 0) * 0.4);
    torso.rotation.set((ch.lean || 0) * 0.65, (ch.twist || 0) * 0.7, (ch.roll || 0) * 0.6);
    head.rotation.set(ch.headX || 0, ch.headY || 0, ch.headZ || 0);
    for (const [A, c] of [[armR, ch.R], [armL, ch.L]]) {
      if (!c) continue;
      A.sh.rotation.set(0, 0, A.side * (0.12 + (c.a || 0)));
      A.up.rotation.set(c.s, 0, 0); A.el.rotation.set(c.e, 0, 0); A.wr.rotation.set(c.w || 0, 0, 0);
    }
    // the skirt hangs from the waist whatever the body does, and sways
    skirtU.rotation.set(-(ch.lean || 0) * 0.3 + (sec.skirtX || 0), 0, -(ch.roll || 0) * 0.3 + (sec.skirtZ || 0));
    skirtL.rotation.set((sec.skirtX || 0) * 0.8, 0, (sec.skirtZ || 0) * 0.8);
    apron.rotation.x = Math.max(-0.2, (sec.skirtX || 0) * 1.5 - (ch.lean || 0) * 0.5);
    // sleeves hang down (counter to the arm's own angle) and swing behind its movement
    for (const [A, c, k] of [[armR, ch.R, 'R'], [armL, ch.L, 'L']]) if (c) A.drop.rotation.set(-(c.s + c.e) * 0.85 + (sec['drop' + k] || 0), 0, 0);
    const chainPose = (ch2, ax, az) => ch2.forEach((q, i) => q.rotation.set(ax[i] ?? ax[ax.length - 1] ?? 0, 0, az[i] ?? az[az.length - 1] ?? 0));
    chainPose(hair, sec.hairX || [0], sec.hairZ || [0]);
    const lx = sec.lockX || [0]; for (const f of forelocks) chainPose(f, lockBase.map((b, i) => b + (lx[i] ?? lx[lx.length - 1] ?? 0)), [0]);
    for (const r of ribbons) chainPose(r, sec.ribX || [0], sec.ribZ || [0]);
    chainPose(cape, sec.capeX || [0], sec.capeZ || [0]);
    ribbonsBody.forEach((r, i) => chainPose(r, sec.ribX || [0], (sec.ribZ || [0]).map((v) => v * (i ? 1 : -1))));
    for (const w of Object.values(weap)) w.tassels.forEach((q, i) => { q.rotation.x = (sec.tassel || 0) * (i + 1) * 0.6; });
  }
  return { group: root, body, parts, points, weap, pose, M, mouth: (k) => look.mouth?.(k) };
}
