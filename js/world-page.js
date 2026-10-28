// world.html: the world of 《天機策》 — its lore, places, people (each with a portrait drawn once in the browser, in
// the series' anime style and the character's own face and build) and the ten episodes.
import * as THREE from '../lib/three.module.min.js';
import { WORLD } from './story/world.js?v=12';
import { CHARACTERS } from './cast/characters.js?v=12';
import { loadHumans, humanStill } from './models/human.js?v=12';
import { faceOf, bodyOf } from './models/looks.js?v=12';

const $ = (id) => document.getElementById(id);
let lang = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'zh';
const T = {
  zh: { lore: '天機策與武林', places: '地點', people: '人物', eps: '十集劇情', watch: '▶ 從第一集看起', mk: '角色創作', move: '招式', ep: '觀看' },
  en: { lore: 'The Stratagem and the martial world', places: 'Places', people: 'People', eps: 'The ten episodes', watch: '▶ Watch from Episode 1', mk: 'Character maker', move: 'Move', ep: 'Watch' },
};
const portraits = {};
function render() {
  const t = T[lang], W = WORLD;
  document.title = lang === 'zh' ? '天機策・世界設定' : 'The Celestial Stratagem: the world';
  $('t').innerHTML = `${W.title[lang]}<small>${lang === 'zh' ? 'Swords in the Palm: The Celestial Stratagem' : '掌中劍・天機策'}</small>`;
  $('log').textContent = W.logline[lang]; $('watch').textContent = t.watch; $('mk').textContent = t.mk;
  for (const k of ['lore', 'places', 'people', 'eps']) $('h-' + k).textContent = t[k];
  $('lore').innerHTML = W.lore.map((l) => `<div class="card"><b>${l[lang]}</b><br>${l.text[lang]}</div>`).join('');
  $('places').innerHTML = W.places.map((p) => `<div class="card"><b>${p[lang]}</b><br>${p.about[lang]}</div>`).join('');
  $('people').innerHTML = W.factions.map((f) => `<div class="fac">${f[lang]}</div><div class="grid people">${f.who.map((id) => {
    const C = CHARACTERS[id], P = W.people[id] || {};
    const poem = P.poem ? P.poem.map((l) => (lang === 'zh' ? l[0] : l[1])).join(lang === 'zh' ? '' : ' ') : '';
    return `<div class="card who"><${portraits[id] ? `img src="${portraits[id]}" alt=""` : `i data-p="${id}"`}></${portraits[id] ? '' : 'i'}><div><h3>${C[lang]}<small>${C.title?.[lang] || ''}</small></h3><p>${P.about?.[lang] || ''}</p>${P.move && P.move.zh !== '—' ? `<div class="mv">${t.move}：${P.move[lang]}</div>` : ''}${poem ? `<div class="po">${poem}</div>` : ''}</div></div>`;
  }).join('')}</div>`).join('');
  $('eps').innerHTML = W.episodes.map((e) => `<div class="card"><div class="n">${e.n}</div><div><h3>${lang === 'zh' ? (e.n === 10 ? '最終回' : `第${'一二三四五六七八九十'[e.n - 1]}集`) + '　' + e.zh : `Episode ${e.n}: ${e.en}`}</h3><p>${e.about[lang]}</p></div><a href="./?ep=s${e.n}${lang === 'en' ? '&lang=en' : ''}">▶ ${t.ep}</a></div>`).join('');
  document.querySelectorAll('[data-l]').forEach((b) => b.classList.toggle('on', b.dataset.l === lang));
}
document.querySelectorAll('[data-l]').forEach((b) => b.addEventListener('click', () => { lang = b.dataset.l; render(); }));
render();

// the portraits: each puppet built once, drawn to a small canvas, kept as an image
const R = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); R.outputColorSpace = THREE.SRGBColorSpace; R.setSize(184, 232, false);
const scene = new THREE.Scene(); scene.background = new THREE.Color('#2a1618');
scene.add(new THREE.HemisphereLight('#d8c8e8', '#3a2824', 1.3));
const key = new THREE.DirectionalLight('#ffe8d0', 2.4); key.position.set(1.4, 2.6, 2.4); scene.add(key);
const rim = new THREE.DirectionalLight('#ffffff', 1.1); rim.position.set(-1, 2, -2.5); scene.add(rim);
const cam = new THREE.PerspectiveCamera(24, 184 / 232, 0.05, 30);
const ids = WORLD.factions.flatMap((f) => f.who);
await loadHumans();
(function next(i) {
  if (i >= ids.length) return;
  const id = ids[i], C0 = CHARACTERS[id], F = faceOf(C0.anime.face), B = bodyOf(C0.anime.body);
  const spec = { ...C0, style: 'anime', faceShape: F.shape, eyeShape: F.eye, body: B.body, scale: (C0.scale || 1) * B.scale, lod: true };
  const P = humanStill(spec, C0.weapons?.R ? 'Sword_Idle' : 'Idle_Loop', 0.6);
  P.group.rotation.y = 0.35; scene.add(P.group); P.group.updateMatrixWorld(true);
  const h = P.points.head(); cam.position.set(h.x + 0.25, h.y - 0.05, h.z + 1.7); cam.lookAt(h.x, h.y - 0.17, h.z);
  R.render(scene, cam); portraits[id] = R.domElement.toDataURL('image/jpeg', 0.86);
  scene.remove(P.group); P.group.traverse((m) => { m.geometry?.dispose(); [].concat(m.material || []).forEach((x) => { x.map?.dispose(); x.dispose(); }); });
  const slot = document.querySelector(`[data-p="${id}"]`); if (slot) { const img = new Image(); img.src = portraits[id]; img.alt = ''; slot.replaceWith(img); }
  setTimeout(() => next(i + 1), 30);
})(0);
