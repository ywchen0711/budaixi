// creator.html: any of the 50 faces on any of the 20 builds, in the anime style, in any of the cast's costumes.
// The big view is live (drag to turn it); the tiles are each drawn once, a few at a time, by a second renderer.
import * as THREE from '../lib/three.module.min.js';
import { loadHumans, humanStill } from './models/human.js?v=15';
import { faceOf, bodyOf } from './models/looks.js?v=15';
import { CHARACTERS } from './cast/characters.js?v=15';

const $ = (id) => document.getElementById(id);
const OUTFITS = ['ling', 'yan', 'ye', 'wanderer', 'lady'];
const q = new URLSearchParams(location.search);
const st = { face: +(q.get('face') || 1), body: +(q.get('body') || 13), outfit: OUTFITS.includes(q.get('outfit')) ? q.get('outfit') : 'ling', shot: 'full', yaw: 0.35 };
st.face = Math.max(1, Math.min(50, st.face || 1)); st.body = Math.max(1, Math.min(20, st.body || 13));

const specOf = (face, body, outfit, lod) => {
  const F = faceOf(face), Bd = bodyOf(body), C = CHARACTERS[outfit];
  return { ...C, style: 'anime', faceShape: F.shape, eyeShape: F.eye, body: Bd.body, scale: (C.scale || 1) * Bd.scale, lod };
};
function lights(scene) {
  scene.add(new THREE.HemisphereLight('#d8c8e8', '#3a2824', 1.3));
  const key = new THREE.DirectionalLight('#ffe8d0', 2.4); key.position.set(1.4, 2.6, 2.4); scene.add(key);
  const fill = new THREE.DirectionalLight('#a8b8ff', 0.7); fill.position.set(-2, 1.2, 1.5); scene.add(fill);
  const rim = new THREE.DirectionalLight('#ffffff', 1.1); rim.position.set(-1, 2, -2.5); scene.add(rim);
  const floor = new THREE.Mesh(new THREE.CircleGeometry(1.4, 40), new THREE.MeshStandardMaterial({ color: '#2a1c18', roughness: 0.9 })); floor.rotation.x = -Math.PI / 2; scene.add(floor);
  scene.background = new THREE.Color('#2a1618');
}
// a body standing at ease, or on guard if it carries a weapon (a recorded pose, held)
const still = (spec) => humanStill(spec, spec.weapons?.R ? 'Sword_Idle' : 'Idle_Loop', 0.6);
// where to put the camera for a shot of this puppet
function frame(cam, P, shot, aspect) {
  P.group.updateMatrixWorld(true);
  const head = P.points.head(), box = new THREE.Box3().setFromObject(P.group), h = box.max.y;
  cam.aspect = aspect;
  if (shot === 'face' || shot === 'tile') { cam.fov = shot === 'tile' ? 14 : 18; cam.position.set(head.x, head.y, head.z + 0.95); cam.lookAt(head.x, head.y - 0.012, head.z); }
  else if (shot === 'bust') { const y = head.y - 0.2; cam.fov = 22; cam.position.set(head.x, y + 0.05, 2.0); cam.lookAt(head.x, y, 0); }
  else { cam.fov = 26; cam.position.set(0, 1.0, 5.0); cam.lookAt(0, 0.96, 0); } // the same camera for every build, so heights compare
  cam.updateProjectionMatrix();
}
const dispose = (o) => o.traverse((m) => { if (m.geometry) m.geometry.dispose(); const ms = m.material ? [].concat(m.material) : []; for (const x of ms) { for (const k of ['map', 'emissiveMap']) x[k]?.dispose?.(); x.dispose(); } });

// ---------------------------------------------------------------- the big live view
const canvas = $('view'), renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2)); renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene(); lights(scene);
const cam = new THREE.PerspectiveCamera(26, 0.75, 0.05, 50);
let P = null;
function rebuild() {
  if (P) { scene.remove(P.group); dispose(P.group); }
  P = still(specOf(st.face, st.body, st.outfit)); scene.add(P.group);
  const F = faceOf(st.face), Bd = bodyOf(st.body);
  $('fn').textContent = `${F.n}. ${F.zh} ${F.en}`; $('bn').textContent = `${Bd.n}. ${Bd.zh} ${Bd.en}`;
  document.querySelectorAll('#faces .tile').forEach((t) => t.classList.toggle('on', +t.dataset.n === st.face));
  document.querySelectorAll('#bodies .tile').forEach((t) => t.classList.toggle('on', +t.dataset.n === st.body));
  history.replaceState(null, '', `?face=${st.face}&body=${st.body}&outfit=${st.outfit}`);
}
let drag = null;
canvas.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, yaw: st.yaw }; canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointermove', (e) => { if (drag) st.yaw = drag.yaw + (e.clientX - drag.x) * 0.012; });
canvas.addEventListener('pointerup', () => { drag = null; });
function loop() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (canvas.width !== Math.round(w * renderer.getPixelRatio())) renderer.setSize(w, h, false);
  if (P) { P.group.rotation.y = st.yaw; P.pose(performance.now() / 1000); frame(cam, P, st.shot, w / h); renderer.render(scene, cam); } // breathing: the recorded idle, playing
  requestAnimationFrame(loop);
}

// ---------------------------------------------------------------- the tiles, each drawn once
const thumbR = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
thumbR.outputColorSpace = THREE.SRGBColorSpace;
const tScene = new THREE.Scene(); lights(tScene);
const tCam = new THREE.PerspectiveCamera(20, 1, 0.05, 50);
const jobs = [];
function tile(kind, n, label) {
  const b = document.createElement('button'); b.className = 'tile'; b.dataset.n = n;
  b.innerHTML = `<i></i><div><em>${n}</em>${label}</div>`;
  b.addEventListener('click', () => { st[kind] = n; rebuild(); });
  $(kind === 'face' ? 'faces' : 'bodies').appendChild(b);
  jobs.push({ kind, n, el: b });
}
function drawTile(j) {
  const spec = j.kind === 'face' ? specOf(j.n, 13, st.outfit, true) : specOf(st.face, j.n, st.outfit, true);
  const T = still(spec); T.group.rotation.y = 0.3; tScene.add(T.group); T.group.updateMatrixWorld(true);
  const [w, h] = j.kind === 'face' ? [160, 160] : [150, 200];
  thumbR.setSize(w, h, false); frame(tCam, T, j.kind === 'face' ? 'tile' : 'full', w / h);
  thumbR.render(tScene, tCam);
  const img = new Image(); img.src = thumbR.domElement.toDataURL('image/jpeg', 0.85); img.alt = '';
  j.el.querySelector('i, img').replaceWith(img);
  tScene.remove(T.group); dispose(T.group);
}
let queue = [];
function redrawTiles() { queue = jobs.slice(); }
(function work() { const t0 = performance.now(); while (queue.length && performance.now() - t0 < 40) drawTile(queue.shift()); setTimeout(work, queue.length ? 10 : 200); })();

for (let n = 1; n <= 50; n++) tile('face', n, faceOf(n).zh);
for (let n = 1; n <= 20; n++) tile('body', n, bodyOf(n).zh);
$('outfits').innerHTML = OUTFITS.map((o) => `<button data-outfit="${o}" class="${o === st.outfit ? 'on' : ''}">${CHARACTERS[o].zh}</button>`).join('');
document.querySelectorAll('[data-outfit]').forEach((b) => b.addEventListener('click', () => {
  st.outfit = b.dataset.outfit; document.querySelectorAll('[data-outfit]').forEach((x) => x.classList.toggle('on', x === b)); rebuild(); redrawTiles();
}));
document.querySelectorAll('[data-shot]').forEach((b) => b.addEventListener('click', () => {
  st.shot = b.dataset.shot; document.querySelectorAll('[data-shot]').forEach((x) => x.classList.toggle('on', x === b));
}));
$('rnd').addEventListener('click', () => { st.face = 1 + Math.floor(Math.random() * 50); st.body = 1 + Math.floor(Math.random() * 20); rebuild(); });
await loadHumans(); rebuild(); redrawTiles(); loop();
window.MAKER = { st, rebuild, set: (o) => { Object.assign(st, o); rebuild(); }, pending: () => queue.length };
