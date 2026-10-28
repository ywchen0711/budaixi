// Real faces: heads cut from scanned, photo-textured people (Microsoft Rocketbox avatars, MIT licence: models/heads/
// LICENSE-Rocketbox.md), one baked for each character by tools/scanheads (its hair recoloured, a cap of hair fitted to
// its skull). Each head keeps the face's own blend shapes, so its mouth makes the shapes of speech, its eyes blink
// and its brows and mouth can smile or frown.
//   await loadScans(['ling', ...]); scanHead(id, hairColour) -> { group, ud, mouth(k), mood(name, k) }
import * as THREE from '../../lib/three.module.min.js';
import { GLTFLoader } from '../../lib/addons/GLTFLoader.js';

const CACHE = {};
export async function loadScans(ids, base = '') {
  const L = new GLTFLoader();
  await Promise.all(ids.filter((id) => !(id in CACHE)).map(async (id) => {
    try { const sc = (await L.loadAsync(`${base}models/heads/${id}.glb?v=1`)).scene; CACHE[id] = sc.getObjectByName('scanhead') || sc.children[0];
      sc.traverse((o) => { const g = o.geometry; if (g && !g.attributes._edge) { const e = g.attributes.__edge || g.attributes._EDGE; if (e) g.setAttribute('_edge', e); } }); // (the exporter names it __EDGE)
    } catch (e) { CACHE[id] = null; }
  }));
}
export const hasScan = (id) => !!CACHE[id];
export const scanInfo = (id) => CACHE[id]?.userData || null;

// strands of hair, combed back
const hairTexs = {};
function hairTex(col) {
  if (hairTexs[col]) return hairTexs[col];
  const c = document.createElement('canvas'); c.width = c.height = 512; const x = c.getContext('2d'), base = new THREE.Color(col), light = base.r + base.g + base.b > 1.5;
  x.fillStyle = col; x.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 2600; i++) {
    const px = Math.random() * 512, l = Math.random(), k = light ? 0.75 + l * 0.35 : 1.4 + l * 2.2;
    const cc = base.clone().multiplyScalar(k); x.strokeStyle = `rgba(${Math.min(255, cc.r * 255 + 14)},${Math.min(255, cc.g * 255 + 11)},${Math.min(255, cc.b * 255 + 10)},${0.16 + Math.random() * 0.22})`;
    x.lineWidth = 1 + Math.random() * 2.2; x.beginPath(); x.moveTo(px, -10); x.bezierCurveTo(px + 10, 170, px - 10, 340, px + 4, 522); x.stroke();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 1); t.anisotropy = 8;
  return (hairTexs[col] = t);
}
export function hairMaterial(col, edge) {
  const m = new THREE.MeshPhysicalMaterial({ map: hairTex(col), roughness: 0.42, sheen: 0.25, sheenColor: new THREE.Color(col).lerp(new THREE.Color('#d8dce8'), 0.25), sheenRoughness: 0.3, side: THREE.DoubleSide });
  if (edge) { // the hairline: it thins out into the skin, each strand stopping at its own place
    m.transparent = true; m.side = THREE.FrontSide;
    m.onBeforeCompile = (sh) => {
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute float _edge; varying float vEdge; varying vec2 vHU;').replace('#include <uv_vertex>', '#include <uv_vertex>\nvEdge = _edge; vHU = uv;');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vEdge; varying vec2 vHU; float hh(float x){ return fract(sin(x * 91.7) * 43758.5453); }')
        .replace('#include <alphatest_fragment>', 'diffuseColor.a *= smoothstep(0.0005, 0.003 + 0.002 * hh(floor(vHU.x * 900.0)), vEdge);\n#include <alphatest_fragment>');
    };
    m.customProgramCacheKey = () => 'hairline';
  }
  return m;
}

const DBG = (() => { try { return new URLSearchParams(location.search).get('scandbg'); } catch (e) { return null; } })();
const sm = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
export function scanHead(id, hairCol = '#1c1614') {
  const src = CACHE[id]; if (!src) return null;
  const group = src.clone(true), ud = src.userData, meshes = [];
  let face = null;
  group.traverse((o) => {
    if (!o.isMesh) return; o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false;
    if (o.name === 'face') { face = o; const s = o.material; o.material = new THREE.MeshPhysicalMaterial({ map: s.map, color: new THREE.Color(1.18, 1.14, 1.12), normalMap: s.normalMap, normalScale: new THREE.Vector2(0.9, 0.9), roughness: 0.5, sheen: 0.35, sheenColor: '#ff9078', sheenRoughness: 0.55, clearcoat: 0.06, clearcoatRoughness: 0.5 }); }
    else if (o.name === 'cap') o.material = DBG === 'cap' ? new THREE.MeshBasicMaterial({ color: '#ff00ff' }) : hairMaterial(hairCol, DBG !== 'opaque');
    else if (o.name === 'lash') o.material = new THREE.MeshStandardMaterial({ color: '#0a0606', transparent: true, opacity: 0.85 });
    if (o.morphTargetDictionary) meshes.push(o);
  });
  // a skull inside, a little smaller than the head, in the hair's colour (or the skin's, shaven): any gap in the scan shows it, not the sky
  { const ch = ud.crown - ud.chin, sh = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 20), ud.bald ? new THREE.MeshPhysicalMaterial({ color: ud.skin, roughness: 0.55 }) : hairMaterial(hairCol));
    sh.scale.set(0.074, ch * 0.36, 0.088); sh.position.set(0, ud.chin + ch * 0.6, (ud.eyeL[2] - 0.085) + 0.01); sh.name = 'skull'; group.add(sh); }
  const set = (n, v) => { for (const m of meshes) { const i = m.morphTargetDictionary[n]; if (i != null) m.morphTargetInfluences[i] = v; } };
  // blinking: every few seconds, both eyes, now and then twice
  let next = 1 + Math.random() * 3, t0 = performance.now() / 1000, moodBlink = 0;
  face.onBeforeRender = () => {
    const t = performance.now() / 1000 - t0; if (t > next + 0.5) next = t + 2 + Math.random() * 4 + (Math.random() < 0.15 ? -1.8 : 0);
    const b = Math.max(moodBlink, Math.max(0, 1 - Math.abs(t - next - 0.07) / 0.07)); set('blinkL', b); set('blinkR', b);
  };
  // the mouth: k from 0 shut to 1 wide; the shapes of speech follow the loudness, so the mouth never just flaps
  let last = 0;
  const mouth = (k) => {
    k = Math.max(0, Math.min(1, k)); const ch = k - last; last = k;
    set('jaw', k * 0.42); set('aa', sm(0.05, 0.8, k) * 0.7); set('O', k * 0.55 * Math.max(0, Math.sin(k * 23 + 1))); set('E', k * 0.5 * Math.max(0, Math.cos(k * 17)));
    set('I', k * 0.3 * Math.max(0, Math.sin(k * 31))); set('PP', k < 0.04 && ch < 0 ? 0.4 : 0); set('FF', Math.max(0, -ch) * 2.5 * (k > 0.1 ? 1 : 0));
  };
  // a mood on the face: smile, frown, anger, fear, grief (k from 0 to 1)
  const mood = (name, k = 1) => {
    for (const n of ['smileL', 'smileR', 'frownL', 'frownR', 'browDownL', 'browDownR', 'browUp', 'squintL', 'squintR', 'sneerL', 'sneerR']) set(n, 0);
    moodBlink = 0;
    if (name === 'smile') { set('smileL', 0.55 * k); set('smileR', 0.55 * k); set('squintL', 0.25 * k); set('squintR', 0.25 * k); }
    else if (name === 'smirk') { set('smileL', 0.6 * k); set('squintL', 0.2 * k); }
    else if (name === 'anger') { set('browDownL', 0.8 * k); set('browDownR', 0.8 * k); set('sneerL', 0.25 * k); set('sneerR', 0.25 * k); set('squintL', 0.3 * k); set('squintR', 0.3 * k); }
    else if (name === 'sad') { set('browUp', 0.7 * k); set('frownL', 0.5 * k); set('frownR', 0.5 * k); }
    else if (name === 'fear') { set('browUp', 0.9 * k); }
    else if (name === 'cold') { set('browDownL', 0.25 * k); set('browDownR', 0.25 * k); set('squintL', 0.2 * k); set('squintR', 0.2 * k); }
    else if (name === 'shut') moodBlink = k;
  };
  return { group, ud, face, mouth, mood, set };
}
