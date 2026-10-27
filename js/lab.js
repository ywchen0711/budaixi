// styles.html: the same puppet in every head style, side by side, each in its own little view of one shared canvas.
import * as THREE from '../lib/three.module.min.js';
import { buildPuppet } from './models/puppet.js?v=12';
import { STYLES } from './models/heads.js?v=12';
import { CHARACTERS } from './cast/characters.js?v=12';

const $ = (id) => document.getElementById(id);
const ORDER = ['paper', 'drama', 'pili', 'wood', 'opera', 'anime', 'film']; // F, after the drama still, next to how it was
const LETTER = { paper: '現', pili: 'A', wood: 'B', opera: 'C', anime: 'D', film: 'E', drama: 'F' };
const WHO = ['wanderer', 'lady', 'ling', 'yan', 'ye'];
const params = new URLSearchParams(location.search);
let who = WHO.includes(params.get('who')) ? params.get('who') : 'wanderer', shot = 'face', light = 'stage';

const canvas = $('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.shadowMap.enabled = true; renderer.setScissorTest(true);

// one scene per style: the puppet, a floor, the lights
const views = ORDER.map((style) => {
  const card = document.createElement('div'); card.className = 'card';
  card.innerHTML = `<div class="view"><b>${LETTER[style]}</b></div><div class="info"><h2>${STYLES[style].zh}<small>${STYLES[style].en}</small></h2><p>${STYLES[style].about.zh}<br>${STYLES[style].about.en}</p><a href="./?style=${style}&t=100">▶ 用這個風格看整部片 · watch the film</a></div>`;
  $('cards').appendChild(card);
  const el = card.querySelector('.view');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(22, 0.75, 0.05, 50);
  const hemi = new THREE.HemisphereLight('#c8b8d8', '#3a2824', 1.2); scene.add(hemi);
  const key = new THREE.DirectionalLight('#ffe2c0', 2.6); key.position.set(1.4, 2.4, 2.2); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.01; Object.assign(key.shadow.camera, { left: -1.2, right: 1.2, top: 2, bottom: -0.2, near: 0.5, far: 8 }); scene.add(key);
  const fill = new THREE.DirectionalLight('#a8b8ff', 0.7); fill.position.set(-2, 1.2, 1.5); scene.add(fill);
  const rim = new THREE.DirectionalLight('#ffffff', 1.2); rim.position.set(-1, 2, -2.5); scene.add(rim);
  const floor = new THREE.Mesh(new THREE.CircleGeometry(1.2, 40), new THREE.MeshStandardMaterial({ color: '#2a1c18', roughness: 0.9 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  const v = { style, el, scene, camera, hemi, key, fill, rim, yaw: 0.35, drag: null, puppet: null };
  el.addEventListener('pointerdown', (e) => { v.drag = { x: e.clientX, yaw: v.yaw }; el.setPointerCapture(e.pointerId); el.style.cursor = 'grabbing'; });
  el.addEventListener('pointermove', (e) => { if (v.drag) v.yaw = v.drag.yaw + (e.clientX - v.drag.x) * 0.012; });
  el.addEventListener('pointerup', () => { v.drag = null; el.style.cursor = ''; });
  return v;
});

function build() {
  for (const v of views) {
    if (v.puppet) v.scene.remove(v.puppet.group);
    const P = buildPuppet({ ...CHARACTERS[who], style: v.style });
    P.pose({ crouch: 0, R: { s: -0.35, e: -0.9, w: 0.2, a: 0.15 }, L: { s: -0.1, e: -0.5, w: 0, a: 0.1 } }, {});
    P.group.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    v.scene.add(P.group); v.puppet = P;
  }
}
function lights() {
  for (const v of views) {
    if (light === 'moon') { v.key.color.set('#b8c8ff'); v.key.intensity = 2.0; v.hemi.color.set('#4a5a90'); v.hemi.groundColor.set('#12141c'); v.hemi.intensity = 1.1; v.fill.color.set('#ffb060'); v.fill.intensity = 0.9; v.rim.color.set('#8ab0ff'); }
    else { v.key.color.set('#ffe2c0'); v.key.intensity = 2.6; v.hemi.color.set('#c8b8d8'); v.hemi.groundColor.set('#3a2824'); v.hemi.intensity = 1.2; v.fill.color.set('#a8b8ff'); v.fill.intensity = 0.7; v.rim.color.set('#ffffff'); }
  }
}
// the buttons
$('who').innerHTML = WHO.map((w) => `<button data-who="${w}" class="${w === who ? 'on' : ''}">${CHARACTERS[w].zh}</button>`).join('');
document.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
  if (b.dataset.who) { who = b.dataset.who; build(); }
  if (b.dataset.shot) shot = b.dataset.shot;
  if (b.dataset.light) { light = b.dataset.light; lights(); }
  for (const k of ['who', 'shot', 'light']) if (b.dataset[k]) document.querySelectorAll(`[data-${k}]`).forEach((x) => x.classList.toggle('on', x === b));
}));
build(); lights();

const SHOT = { face: { y: 1.27, d: 0.95, fov: 20 }, bust: { y: 1.12, d: 2.0, fov: 22 }, full: { y: 0.8, d: 4.2, fov: 24 } };
const target = new THREE.Vector3();
function frame(now) {
  const W = canvas.clientWidth, H = canvas.clientHeight;
  if (canvas.width !== Math.round(W * renderer.getPixelRatio()) || canvas.height !== Math.round(H * renderer.getPixelRatio())) renderer.setSize(W, H, false);
  renderer.setClearColor(0x000000, 0); renderer.setScissor(0, 0, W, H); renderer.clear();
  for (const v of views) {
    const r = v.el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > H || r.right < 0 || r.left > W) continue;
    const s = SHOT[shot], K = CHARACTERS[who].scale || 1;
    if (!v.drag) v.yaw += 0.0;
    v.puppet.group.rotation.y = v.yaw;
    const breathe = Math.sin(now / 900) * 0.006; v.puppet.parts.head.rotation.set(0.05 + breathe, 0, 0);
    target.set(0, s.y * K, 0);
    v.camera.position.set(0, s.y * K + 0.05, s.d * K); v.camera.fov = s.fov; v.camera.aspect = r.width / r.height; v.camera.updateProjectionMatrix(); v.camera.lookAt(target);
    v.scene.background = new THREE.Color(light === 'moon' ? '#0c1220' : '#2a1618');
    const y = H - r.bottom;
    renderer.setViewport(r.left, y, r.width, r.height); renderer.setScissor(r.left, y, r.width, r.height);
    renderer.render(v.scene, v.camera);
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
window.LAB = { views, build, set: (o) => { if (o.who) { who = o.who; build(); } if (o.shot) shot = o.shot; if (o.yaw != null) views.forEach((v) => { v.yaw = o.yaw; }); if (o.light) { light = o.light; lights(); } } };
