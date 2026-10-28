// The places a story can be set, and the sky over them. set = { kinds: ['stage', 'bamboo', 'cliff'], sky: [[t, preset], ...], ... }
//   stage   a traditional glove-puppet theatre (彩樓) facing +x at x = -16: red lacquer and gold, couplets on the
//           pillars, a plaque over the opening, red curtains that part (set.curtain = [t0, t1]); gone after set.stageUntil
//   bamboo  a bamboo forest round a moonlit clearing at the origin, a path along x, stone lanterns, mist
//   cliff   a mountain top at x = 300: a plateau of rock over a sea of clouds, an old pine, peaks far off, the moon
//   hall, lotus, temple, abyss (js/sets2.js) at x = 600, 900, 1200, 1500; and rain (set.rain)
import * as THREE from '../lib/three.module.min.js';
import { TOON, shade } from './toon.js?v=15';
import { SETS2, SKY2 } from './sets2.js?v=15';
const mat = (o) => shade(o);

export const FOG = '#1a2234';
export const CLIFF = new THREE.Vector3(300, 0, 0);
export const SKY = {
  // the moon high in the east, a deep blue night, mist
  moon: { sun: [0.62, 0.42, -0.32], top: '#050814', mid: '#0e1a34', hor: '#2a3c5c', low: '#0c1220', glow: '#4a5a8a', disc: '#fff4d8', cloud: '#1c2640', stars: 1, sunCol: '#b8c8ff', sunI: 1.9, hemiSky: '#4a5a90', hemiGround: '#12141c', hemiI: 1.1, rimI: 0.6, fog: '#18223a', windows: 1.2, lamps: 1 },
  // the moon low and huge, gold, over the cloud sea (the last duel)
  bigmoon: { sun: [0.9, 0.2, 0.1], top: '#060714', mid: '#1a1a3a', hor: '#5a4a5a', low: '#141420', glow: '#c8a060', disc: '#ffe8b0', cloud: '#2a2236', stars: 0.8, sunCol: '#ffe0b0', sunI: 2.2, hemiSky: '#5a5a8a', hemiGround: '#181418', hemiI: 1.1, rimI: 0.7, fog: '#2a2a40', windows: 1.2, lamps: 1 },
  dawn: { sun: [-0.85, 0.18, 0.3], top: '#24345a', mid: '#6a6a8a', hor: '#f0a878', low: '#3a3440', glow: '#ffb070', disc: '#fff0c8', cloud: '#8a6a78', stars: 0, sunCol: '#ffd0a0', sunI: 2.4, hemiSky: '#a8b0d0', hemiGround: '#40383a', hemiI: 1.6, rimI: 0.4, fog: '#8a8098', windows: 0.3, lamps: 0.2 },
};
Object.assign(SKY, SKY2); // dusk, day, storm, the demon realm's
const _c1 = new THREE.Color(), _c2 = new THREE.Color();
export function skyAt(keys, t) {
  keys = keys || [[0, 'moon']];
  let i = 0; while (i < keys.length - 1 && keys[i + 1][0] <= t) i++;
  const a = SKY[keys[i][1]], nb = keys[i + 1], b = nb ? SKY[nb[1]] : a;
  const from = nb ? nb[2] ?? nb[0] - 8 : 0, k = nb ? Math.max(0, Math.min(1, (t - from) / Math.max(0.01, nb[0] - from))) : 0, e = k * k * (3 - 2 * k);
  const out = {};
  for (const key of Object.keys(a)) {
    const va = a[key], vb = b[key];
    if (typeof va === 'number') out[key] = va + (vb - va) * e;
    else if (Array.isArray(va)) out[key] = new THREE.Vector3(...va).lerp(new THREE.Vector3(...vb), e).normalize();
    else out[key] = _c1.set(va).clone().lerp(_c2.set(vb), e);
  }
  return out;
}
function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function canvasTex(w, h, paint, repeat = true) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; paint(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}
const add = (scene, geo, mat, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, cast = true) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.rotation.set(rx, ry, rz); m.castShadow = cast; m.receiveShadow = true; m.userData.solid = cast && geo.type !== 'PlaneGeometry'; scene.add(m); return m; };

// ---------------------------------------------------------------- the sky dome: gradient, a glowing moon, stars, bands of cloud
function sky(scene) {
  const U = { sun: { value: new THREE.Vector3(0, 1, 0) }, top: { value: new THREE.Color() }, mid: { value: new THREE.Color() }, hor: { value: new THREE.Color() }, low: { value: new THREE.Color() }, glow: { value: new THREE.Color() }, disc: { value: new THREE.Color() }, stars: { value: 0 }, cloud: { value: new THREE.Color() }, size: { value: 0.9985 } };
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false, uniforms: U,
    vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `varying vec3 vD; uniform vec3 sun, top, mid, hor, low, glow, disc, cloud; uniform float stars, size;
      float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      void main(){
        float y = vD.y;
        vec3 c = y > 0.0 ? mix(hor, mid, smoothstep(0.0, 0.25, y)) : mix(hor, low, smoothstep(0.0, -0.2, y));
        c = mix(c, top, smoothstep(0.25, 0.8, y));
        float s = max(0.0, dot(normalize(vD), sun));
        c += glow * pow(s, 6.0) * 0.5 + glow * pow(s, 60.0) * 0.6;
        float d = smoothstep(size - 0.0004, size, s);
        // the moon's face: a little darker in patches
        float m = 0.85 + 0.15 * h(floor(vD.xz * 900.0));
        c = mix(c, disc * m, d);
        float band = sin(vD.y * 70.0 + vD.x * 5.0) * 0.5 + 0.5; band = smoothstep(0.7, 1.0, band) * smoothstep(0.02, 0.08, y) * (1.0 - smoothstep(0.18, 0.3, y));
        c = mix(c, cloud, band * 0.55);
        vec2 g = floor(vec2(atan(vD.z, vD.x) * 140.0, y * 180.0)); c += vec3(0.8, 0.85, 1.0) * step(0.996, h(g)) * smoothstep(0.05, 0.3, y) * stars * (1.0 - d);
        gl_FragColor = vec4(c, 1.0);
      }`,
  });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(400, 32, 16), mat); dome.renderOrder = -10; dome.frustumCulled = false; scene.add(dome);
  return { dome, U };
}

// ---------------------------------------------------------------- the bamboo forest
function bamboo(scene, o) {
  const R = rng(11), parts = {};
  const earth = canvasTex(256, 256, (g, W, H) => { g.fillStyle = '#2a261c'; g.fillRect(0, 0, W, H); for (let k = 0; k < 2600; k++) { const c = R(); g.fillStyle = c < 0.3 ? '#3a3420' : c < 0.55 ? '#4a4026' : c < 0.7 ? '#5a5a2c' : '#201c14'; g.save(); g.translate(R() * W, R() * H); g.rotate(R() * 6.3); g.fillRect(-4, -1, 8, 2); g.restore(); } });
  earth.repeat.set(30, 30);
  add(scene, new THREE.PlaneGeometry(240, 240), mat({ map: earth }), 0, 0, 0, -Math.PI / 2, 0, 0, false);
  // a beaten path through the middle
  const path = canvasTex(64, 64, (g) => { g.fillStyle = '#3e3626'; g.fillRect(0, 0, 64, 64); for (let k = 0; k < 300; k++) { g.fillStyle = R() < 0.5 ? '#4a4030' : '#342c1e'; g.fillRect(R() * 64, R() * 64, 2, 2); } }); path.repeat.set(30, 2);
  add(scene, new THREE.PlaneGeometry(90, 4.4), mat({ map: path }), 0, 0.005, 0, -Math.PI / 2, 0, 0, false);
  add(scene, new THREE.CircleGeometry(6.5, 40), mat({ map: path }), 0, 0.006, 0, -Math.PI / 2, 0, 0, false);
  // the stalks: a green with darker rings at every node; a little yellow on the old ones
  const stalkTex = canvasTex(32, 256, (g, W, H) => { const gr = g.createLinearGradient(0, 0, W, 0); gr.addColorStop(0, '#2c4a22'); gr.addColorStop(0.5, '#5a8a3a'); gr.addColorStop(1, '#2a4220'); g.fillStyle = gr; g.fillRect(0, 0, W, H); for (let y = 0; y < H; y += 42) { g.fillStyle = '#1c2a14'; g.fillRect(0, y, W, 3); g.fillStyle = '#7aa050'; g.fillRect(0, y + 3, W, 1); } });
  const geo = new THREE.CylinderGeometry(1, 1, 1, 8, 1);
  const stalks = new THREE.InstancedMesh(geo, mat({ map: stalkTex }), 900); stalks.castShadow = true; stalks.receiveShadow = true;
  const leafTex = canvasTex(128, 128, (g, W, H) => { g.clearRect(0, 0, W, H); for (let k = 0; k < 26; k++) { const x = 20 + R() * 88, y = 20 + R() * 88, a = R() * 6.3, l = 18 + R() * 20; g.save(); g.translate(x, y); g.rotate(a); const gr = g.createLinearGradient(0, 0, l, 0); gr.addColorStop(0, '#3a6a2a'); gr.addColorStop(1, '#5a9a3c'); g.fillStyle = gr; g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(l * 0.5, -4, l, 0); g.quadraticCurveTo(l * 0.5, 4, 0, 0); g.fill(); g.restore(); } }, false);
  const leafMat = mat({ map: leafTex, transparent: true, alphaTest: 0.4, side: THREE.DoubleSide });
  // the leaves stir in the wind (a sway added in the vertex shader)
  const wind = { value: 0 }; leafMat.onBeforeCompile = (sh) => { sh.uniforms.uWind = wind; sh.vertexShader = 'uniform float uWind;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vec4 wp = instanceMatrix * vec4(position, 1.0); transformed.x += sin(uWind * 1.3 + wp.x * 0.7 + wp.z * 0.5) * 0.08 * (position.y + 0.5); transformed.z += cos(uWind * 1.1 + wp.z * 0.6) * 0.06 * (position.y + 0.5);'); };
  const leaves = new THREE.InstancedMesh(new THREE.PlaneGeometry(1.4, 1.4), leafMat, 2600); leaves.castShadow = true;
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v = new THREE.Vector3(), sc = new THREE.Vector3();
  let n = 0, nl = 0;
  for (let k = 0; k < 3000 && n < 900; k++) {
    const x = (R() - 0.5) * 110, z = (R() - 0.5) * 70;
    if (Math.abs(z) < 2.6 + (Math.abs(x) < 9 ? 4.2 : 0)) continue; // the path and the clearing
    if (Math.hypot(x, z) < 7.2) continue;
    const r = 0.035 + R() * 0.045, h = 6 + R() * 6, lean = (R() - 0.5) * 0.12;
    e.set(lean, 0, (R() - 0.5) * 0.12); q.setFromEuler(e); sc.set(r, h, r); v.set(x, h / 2, z);
    stalks.setMatrixAt(n++, m4.compose(v, q, sc));
    for (let j = 0; j < 3 && nl < 2600; j++) { const y = h * (0.55 + R() * 0.45); e.set(R() * 6.3, R() * 6.3, R() * 6.3); q.setFromEuler(e); sc.setScalar(0.8 + R() * 0.9); v.set(x + Math.sin(lean) * y + (R() - 0.5) * 0.6, y, z + (R() - 0.5) * 0.6); leaves.setMatrixAt(nl++, m4.compose(v, q, sc)); }
  }
  stalks.count = n; leaves.count = nl; stalks.userData.solid = true; scene.add(stalks); scene.add(leaves);
  // a few stalks right at the clearing's edge, to be cut in the fight (their ids are noted for the director)
  // stone lanterns with a glow inside, rocks, low mist
  const stone = mat({ color: '#6a6a64' }), paper = new THREE.MeshBasicMaterial({ color: '#ffcf80' });
  const lanterns = [];
  for (const [x, z] of o.lanterns || [[-5.5, -3.2], [5.8, 3.4], [-12, 2.8]]) {
    const g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g);
    for (const [w, h, y] of [[0.5, 0.12, 0.06], [0.16, 0.55, 0.38], [0.42, 0.08, 0.7], [0.3, 0.3, 0.88], [0.56, 0.08, 1.07]]) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, w), stone); m.position.y = y; m.castShadow = true; g.add(m); }
    const glow = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.18, 0.31), paper); glow.position.y = 0.88; g.add(glow);
    const l = new THREE.PointLight('#ffb060', 3, 0, 2); l.position.set(x, 0.9, z); scene.add(l); lanterns.push(l);
  }
  for (let k = 0; k < 18; k++) { const x = (R() - 0.5) * 30, z = (R() < 0.5 ? -1 : 1) * (3 + R() * 6); const s = 0.2 + R() * 0.6; add(scene, new THREE.DodecahedronGeometry(s, 0), stone, x, s * 0.4, z, R(), R(), R()); }
  const mistTex = canvasTex(256, 64, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, 'rgba(200,210,230,0)'); gr.addColorStop(0.6, 'rgba(200,210,230,0.5)'); gr.addColorStop(1, 'rgba(200,210,230,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); }, false);
  const mists = [];
  for (let k = 0; k < 10; k++) { const m = add(scene, new THREE.PlaneGeometry(24, 2.2), new THREE.MeshBasicMaterial({ map: mistTex, transparent: true, opacity: 0.22, depthWrite: false, fog: true }), (R() - 0.5) * 40, 0.7 + R() * 0.6, (R() - 0.5) * 30, 0, R() * 3, 0, false); m.renderOrder = 4; mists.push({ m, x0: m.position.x, s: 0.1 + R() * 0.15 }); }
  parts.update = (t) => { wind.value = t; for (const M of mists) M.m.position.x = M.x0 + Math.sin(t * M.s) * 3; };
  return parts;
}

// ---------------------------------------------------------------- the mountain top over the clouds
function cliff(scene) {
  const R = rng(23), C = CLIFF;
  const rock = canvasTex(256, 256, (g, W, H) => { g.fillStyle = '#4a4a52'; g.fillRect(0, 0, W, H); for (let k = 0; k < 1500; k++) { const c = R(); g.fillStyle = c < 0.4 ? '#3a3a42' : c < 0.7 ? '#5a5a62' : '#2a2a30'; g.fillRect(R() * W, R() * H, 2 + R() * 6, 1 + R() * 2); } g.strokeStyle = 'rgba(20,20,26,0.6)'; for (let k = 0; k < 30; k++) { g.beginPath(); let x = R() * W, y = R() * H; g.moveTo(x, y); for (let j = 0; j < 5; j++) { x += (R() - 0.5) * 40; y += R() * 20; g.lineTo(x, y); } g.stroke(); } });
  rock.repeat.set(4, 4);
  // the plateau: a rough column of rock, its top a little uneven
  const top = new THREE.CylinderGeometry(9.5, 7, 40, 24, 6), p = top.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), a = Math.atan2(z, x), r = Math.hypot(x, z); const k = 1 + 0.12 * Math.sin(a * 5 + y * 0.3) + 0.08 * Math.sin(a * 11 - y * 0.5); p.setXYZ(i, x * k, y > 19.9 ? y + (r < 8 ? 0.15 * Math.sin(x * 0.7) * Math.cos(z * 0.6) : -0.3) : y, z * k); }
  top.computeVertexNormals();
  add(scene, top, mat({ map: rock }), C.x, -20, C.z, 0, 0, 0, true);
  for (let k = 0; k < 12; k++) { const a = R() * 6.3, r = 7.4 + R() * 1.6, s = 0.15 + R() * 0.35; add(scene, new THREE.DodecahedronGeometry(s, 0), mat({ map: rock }), C.x + Math.cos(a) * r, s * 0.3, C.z + Math.sin(a) * r, R(), R(), R()); } // stones round the rim, none in the middle
  // an old pine leaning out over the edge
  const bark = mat({ color: '#3a2a20' }), needles = mat({ color: '#1e3a2a' });
  const pine = new THREE.Group(); pine.position.set(C.x - 4.5, 0, C.z - 5.8); pine.rotation.y = 0.6; scene.add(pine);
  let pnt = new THREE.Vector3(0, 0, 0), dir = new THREE.Vector3(0.25, 1, 0.1).normalize();
  for (let k = 0; k < 7; k++) {
    const len = 1.1, nxt = pnt.clone().addScaledVector(dir, len), m = new THREE.Mesh(new THREE.CylinderGeometry(0.16 - k * 0.018, 0.2 - k * 0.018, len, 7), bark);
    m.position.copy(pnt.clone().add(nxt).multiplyScalar(0.5)); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir); m.castShadow = true; pine.add(m);
    if (k > 2) for (let j = 0; j < 2; j++) { const d = new THREE.Mesh(new THREE.CylinderGeometry(1.1 - k * 0.08, 1.3 - k * 0.08, 0.28, 10), needles); d.position.copy(nxt).add(new THREE.Vector3((R() - 0.5) * 1.2, 0.1, (R() - 0.5) * 1.2)); d.scale.set(1, 1, 0.6); d.castShadow = true; pine.add(d); }
    pnt = nxt; dir.add(new THREE.Vector3(0.18, -0.05, (R() - 0.5) * 0.3)).normalize();
  }
  // the sea of clouds below, and peaks standing out of it far away
  const cloudTex = canvasTex(512, 512, (g, W, H) => { g.fillStyle = 'rgba(0,0,0,0)'; g.clearRect(0, 0, W, H); for (let k = 0; k < 220; k++) { const x = R() * W, y = R() * H, r = 20 + R() * 70, gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(210,214,230,0.55)'); gr.addColorStop(1, 'rgba(210,214,230,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); } });
  cloudTex.repeat.set(3, 3);
  const clouds = [];
  for (const [y, op, sp] of [[-5, 0.9, 0.004], [-3.4, 0.55, 0.007]]) { const m = add(scene, new THREE.PlaneGeometry(500, 500), new THREE.MeshBasicMaterial({ map: cloudTex.clone(), transparent: true, opacity: op, depthWrite: false, color: '#c0c4d8' }), C.x, y, C.z, -Math.PI / 2, 0, 0, false); m.material.map.repeat.set(3, 3); m.material.map.wrapS = m.material.map.wrapT = THREE.RepeatWrapping; m.renderOrder = 3; clouds.push({ m, sp }); }
  const peakMat = (c) => new THREE.MeshBasicMaterial({ color: c, fog: true });
  for (let k = 0; k < 26; k++) { const a = (R() - 0.5) * 2.6, r = 60 + R() * 140, h = 15 + R() * 40; const m = add(scene, new THREE.ConeGeometry(8 + R() * 16, h, 5 + Math.floor(R() * 3)), peakMat(R() < 0.5 ? '#2a3048' : '#363c56'), C.x + Math.cos(a) * r, -8 + h / 2 - 6, C.z + Math.sin(a) * r * 1.4, 0, R() * 3, 0, false); void m; }
  return { update: (t) => { for (const c of clouds) { c.m.material.map.offset.x = t * c.sp; c.m.material.map.offset.y = t * c.sp * 0.4; } } };
}

// ---------------------------------------------------------------- the puppet theatre
function stage(scene, o) {
  const G = new THREE.Group(); G.position.set(-16, 0, 0); G.rotation.y = Math.PI / 2; scene.add(G); // facing +x
  const red = mat({ color: '#8a1416' }), gold = mat({ color: '#d8a838', emissive: '#3a2400' }), dark = mat({ color: '#2a0c0a' });
  const carve = canvasTex(256, 64, (g, W, H) => { g.fillStyle = '#8a1416'; g.fillRect(0, 0, W, H); g.strokeStyle = '#e0b040'; g.lineWidth = 3; for (let x = 0; x < W; x += 32) { g.beginPath(); g.arc(x + 16, H / 2, 12, 0, Math.PI * 1.6); g.stroke(); g.beginPath(); g.arc(x + 16, H / 2, 5, Math.PI, Math.PI * 2.6); g.stroke(); } g.fillStyle = '#e0b040'; g.fillRect(0, 0, W, 4); g.fillRect(0, H - 4, W, 4); });
  const text = (s, w, h, size, vertical) => canvasTex(w, h, (g, W, H) => { g.fillStyle = '#7a1012'; g.fillRect(0, 0, W, H); g.strokeStyle = '#e0b040'; g.lineWidth = 6; g.strokeRect(6, 6, W - 12, H - 12); g.fillStyle = '#f0c858'; g.font = `900 ${size}px "Noto Serif TC", serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; if (vertical) [...s].forEach((c, i) => g.fillText(c, W / 2, H * (i + 0.5) / s.length)); else g.fillText(s, W / 2, H / 2 + 4); }, false);
  const box = (w, h, d, mat, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; G.add(m); return m; };
  box(9, 1.0, 1.6, dark, 0, 0.5, 0); box(9.2, 0.12, 1.7, gold, 0, 1.02, 0); // the base
  const W2 = 3.0, top = 4.6;
  for (const s of [-1, 1]) { box(0.5, top, 0.5, mat({ map: carve }), s * (W2 + 0.25), 1 + top / 2, 0.3); box(0.42, 3.2, 0.06, mat({ map: text(s < 0 ? (o.couplet?.[0] || '掌中乾坤藏日月') : (o.couplet?.[1] || '指上風雲動江湖'), 64, 512, 52, true) }), s * (W2 + 0.25), 3.3, 0.56); }
  box(2 * W2 + 1.4, 0.7, 0.6, mat({ map: carve }), 0, 1 + top + 0.35, 0.3);
  box(2.6, 0.8, 0.08, mat({ map: text(o.plaque || '月下決', 256, 80, 56) }), 0, 1 + top + 0.35, 0.62);
  // eaves: a curved roof line with upturned corners
  for (let k = -6; k <= 6; k++) { const x = k * 0.62, y = 1 + top + 0.85 + Math.pow(Math.abs(k) / 6, 3) * 0.6; box(0.66, 0.14, 1.2, k % 2 ? red : gold, x, y, 0.2).rotation.z = Math.sign(k) * Math.pow(Math.abs(k) / 6, 2) * 0.5; }
  // two lanterns hanging either side
  for (const s of [-1, 1]) { const l = new THREE.Mesh(new THREE.SphereGeometry(0.32, 14, 10), new THREE.MeshBasicMaterial({ color: '#ff4a2a' })); l.scale.y = 1.2; l.position.set(s * (W2 + 1.3), 4.4, 0.6); G.add(l); const pl = new THREE.PointLight('#ff6a3a', 6, 0, 2); pl.position.copy(l.position); G.add(pl); }
  // the curtains
  const velvet = canvasTex(64, 256, (g, W, H) => { for (let x = 0; x < W; x++) { const k = 0.55 + 0.45 * Math.sin(x / W * Math.PI * 6); g.fillStyle = `rgb(${120 * k + 40},${10 * k},${14 * k})`; g.fillRect(x, 0, 1, H); } g.fillStyle = '#d8a838'; g.fillRect(0, H - 14, W, 6); });
  const curtains = [-1, 1].map((s) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(W2 + 0.1, top), mat({ map: velvet, side: THREE.DoubleSide })); m.position.set(s * W2 / 2, 1 + top / 2, 0.45); G.add(m); return { m, s }; });
  const [c0, c1] = o.curtain || [2, 5];
  return {
    update(t) {
      G.visible = t < (o.stageUntil ?? 1e9);
      const k = Math.max(0, Math.min(1, (t - c0) / (c1 - c0))), e = k * k * (3 - 2 * k);
      for (const c of curtains) { c.m.position.x = c.s * (W2 / 2 + e * (W2 * 0.95)); c.m.scale.x = 1 - e * 0.6; }
    },
  };
}

export function buildSet(scene, set = {}) {
  const S = sky(scene); scene.userData.sky = S.dome; scene.userData.skyU = S.U;
  const parts = (set.kinds || ['bamboo']).map((k) => ({ stage, bamboo, cliff, ...SETS2 }[k]?.(scene, set) || {}));
  if (set.rain) parts.push(SETS2.rain(scene, set));
  return { update: (t, sk) => { for (const p of parts) p.update?.(t, sk); } };
}
