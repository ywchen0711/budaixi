// The puppet's head, in one of several styles. Each style decides how the head is sculpted (brow, eye sockets, nose,
// cheekbones, lips, chin, the jaw narrowing), what its skin is made of (painted toon, glossy lacquered wood, soft
// skin), whether the eyes are glass eyeballs under lids or painted on, and how the face is made up. The character
// (js/cast/characters.js) still decides the brows, the eye colour, the lips, the marks and the demon's paint.
//   headLook(spec) -> materials (skin, face, hair) for buildPuppet; addHead(head, spec, look) builds it on the neck
// The style: spec.style, else ?style= in the address, else DEFAULT_STYLE. styles.html shows them side by side.
import * as THREE from '../../lib/three.module.min.js';
import { TOON } from '../toon.js?v=1';

export const STYLES = {
  paper: { zh: '原本的樣子', en: 'As it was', about: { zh: '畫在球上的臉，色塊明暗', en: 'a face painted on a ball, toon bands' } },
  pili: { zh: '霹靂寫實', en: 'Pili realism', about: { zh: '雕出眉骨、鼻樑、顴骨的頭，玻璃眼珠與眼瞼，柔和的皮膚光澤', en: 'carved brow, nose and cheekbones, glass eyes under lids, soft skin' } },
  wood: { zh: '古典木雕', en: 'Carved wood', about: { zh: '老戲偶：刀刻的面、上漆的亮面、濃重的彩繪', en: 'an old puppet: knife-cut facets, lacquer shine, bold paint' } },
  opera: { zh: '戲曲濃妝', en: 'Opera make-up', about: { zh: '白粉底、胭脂紅眼影掃到太陽穴、上挑的鳳眼', en: 'white base, rouge sweeping to the temples, upswept phoenix eyes' } },
  anime: { zh: '日系動畫', en: 'Anime', about: { zh: '賽璐璐上色與描邊，大而亮的畫眼', en: 'cel shading with outlines, big bright painted eyes' } },
  film: { zh: '3D 動畫電影', en: 'Animated feature', about: { zh: '圓潤的頭、大玻璃眼、柔軟的皮膚', en: 'a rounded head, big glass eyes, soft skin' } },
};
export const DEFAULT_STYLE = 'paper';
const fromAddress = (() => { try { const s = new URLSearchParams(location.search).get('style'); return STYLES[s] ? s : null; } catch (e) { return null; } })();
export const styleOf = (spec) => (STYLES[spec.style] ? spec.style : fromAddress || DEFAULT_STYLE);

// how each style is sculpted (0 = a plain ball) and finished
const P = {
  paper: { sculpt: 0 },
  pili: { sculpt: 1, socket: 0.07, brow: 0.03, nose: 1, cheek: 0.03, lip: 0.022, chin: 0.03, jaw: 0.22, temple: 0.03, eyes: 'glass', eyeR: 0.021, lidTilt: 0.18, skin: 'skin', scale: [0.93, 1.06, 0.98] },
  wood: { sculpt: 1, socket: 0.05, brow: 0.035, nose: 0.85, cheek: 0.05, lip: 0.02, chin: 0.035, jaw: 0.22, temple: 0.02, eyes: 'glass', eyeR: 0.02, lidTilt: 0.1, skin: 'lacquer', scale: [0.96, 1.05, 1] },
  opera: { sculpt: 1, socket: 0.06, brow: 0.025, nose: 0.9, cheek: 0.035, lip: 0.02, chin: 0.04, jaw: 0.3, temple: 0.03, eyes: 'glass', eyeR: 0.02, lidTilt: 0.32, skin: 'powder', scale: [0.93, 1.07, 0.98] },
  anime: { sculpt: 1, socket: 0, brow: 0.004, nose: 0.25, cheek: 0, lip: 0, chin: 0.05, jaw: 0.42, temple: 0.01, eyes: 'paint', skin: 'cel', outline: true, chinW: 0.2, chinFwd: 0.06, chinDrop: 0.1, jawCorner: 0, scale: [0.98, 1.04, 0.98] },
  film: { sculpt: 1, socket: 0.05, brow: 0.025, nose: 1.15, noseBulb: 1.8, cheek: 0.06, lip: 0.018, chin: 0.03, jaw: 0.12, temple: 0.0, eyes: 'glass', eyeR: 0.031, lidTilt: 0.06, skin: 'soft', chinW: 0.4, chinFwd: 0.08, floor: 0.78, scale: [1.0, 1.06, 1.0] },
};

const CEL = (() => { const t = new THREE.DataTexture(new Uint8Array([185, 255]), 2, 1, THREE.RedFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; })(); // anime: a light and a shade
function canvasTex(w, h, paint) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; paint(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.wrapS = THREE.RepeatWrapping; return t;
}
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const R0 = 0.135; // the head's radius
const EYE = { lon: 0.36, lat: 0.06 }; // where the eyes are, in longitude and latitude on the head (radians)
// the face texture is the head's own sphere unwrapped: 512 x 256, the face centred at x = 128, the equator at y = 128,
// so a feature at (lon, lat) is painted at (128 + lon * K, 128 - lat * K)
const K = 256 / Math.PI;
const px = (lon, lat) => [128 + lon * K, 128 - lat * K];

// ---------------------------------------------------------------- the sculpt: a radius for each direction from the centre
function radius(lon, lat, p) {
  if (!p.sculpt) return 1;
  const G = (a, b, sa, sb) => Math.exp(-(((lon - a) / sa) ** 2) - (((lat - b) / sb) ** 2));
  const S = (a, b, sa, sb) => G(a, b, sa, sb) + G(-a, b, sa, sb);
  let r = 1;
  r -= p.socket * S(EYE.lon, EYE.lat, 0.15, 0.1);
  r += p.brow * S(0.33, 0.21, 0.26, 0.065);
  const ridge = Math.exp(-((lon / 0.062) ** 2)) * clamp((0.1 - lat) / 0.4) * smooth(-0.36, -0.29, lat);
  r += p.nose * (0.07 * ridge + 0.032 * (p.noseBulb || 1) * G(0, -0.3, 0.075 * Math.sqrt(p.noseBulb || 1), 0.065) + 0.016 * S(0.08, -0.33, 0.05, 0.045));
  r += p.cheek * S(0.47, -0.2, 0.22, 0.17);
  r += p.lip * (G(0, -0.49, 0.15, 0.045) + 0.9 * G(0, -0.6, 0.12, 0.045)) - p.lip * 0.5 * G(0, -0.545, 0.16, 0.016) - p.lip * 0.3 * G(0, -0.41, 0.025, 0.05);
  r += p.chin * G(0, -0.8, 0.16, 0.11);
  r -= p.temple * S(1.15, 0.25, 0.3, 0.3);
  r -= 0.03 * p.sculpt * Math.max(0, Math.cos(lon)) * smooth(-0.9, -0.2, lat) * (1 - smooth(0.2, 0.7, lat)) * (1 - Math.exp(-((lon / 0.5) ** 2))); // the flatter sides of a face
  return r;
}
// where the head's surface is in direction d (a unit vector): the radius above, then the jaw. The jaw narrows to the
// chin; the chin comes forward and down; under it the head is pulled up flat back to the neck, so the jaw has an edge
// from the chin round to the jaw's corners below the ears, the way a carved puppet's head does.
function shapePoint(d, p) {
  const lon = Math.atan2(d.x, d.z), lat = Math.asin(clamp(d.y, -1, 1)), r = radius(lon, lat, p) * R0;
  let x = d.x * r, y = d.y * r, z = d.z * r;
  if (!p.sculpt) return new THREE.Vector3(x, y, z);
  const below = smooth(0.05, -1, d.y);
  x *= 1 - p.jaw * below ** 1.2;
  z *= 1 - 0.12 * below * smooth(0.3, -0.6, d.z); // the neck side of the jaw tucks in
  const floor = -(p.floor ?? 0.8) * R0; // the underside of the jaw
  if (y < floor) y = floor + (y - floor) * (p.under ?? 0.35);
  const cg = Math.exp(-((lon / (p.chinW ?? 0.3)) ** 2) - (((lat + 0.8) / 0.17) ** 2)); // the chin
  z += (p.chinFwd ?? 0.1) * R0 * cg; y -= (p.chinDrop ?? 0.07) * R0 * cg;
  const jg = Math.exp(-(((Math.abs(lon) - 1.05) / 0.3) ** 2) - (((lat + 0.62) / 0.16) ** 2)); // the corners of the jaw
  x += Math.sign(d.x) * (p.jawCorner ?? 0.03) * R0 * jg;
  return new THREE.Vector3(x, y, z);
}
function sculptGeo(p) {
  const [ws, hs] = p.segs || [96, 64];
  const geo = new THREE.SphereGeometry(R0, ws, hs);
  if (!p.sculpt) return geo;
  const pos = geo.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    const lon = Math.atan2(v.x, v.z), lat = Math.asin(clamp(v.y, -1, 1));
    const q = shapePoint(v, p); pos.setXYZ(i, q.x, q.y, q.z);
  }
  if (p.flat) { geo.computeVertexNormals(); return geo; } // facets: the material shades flat
  geo.computeVertexNormals();
  // the seam down the side of a sphere has its vertices twice: give both copies the same normal
  const n = geo.attributes.normal, key = (i) => `${pos.getX(i).toFixed(5)},${pos.getY(i).toFixed(5)},${pos.getZ(i).toFixed(5)}`, seen = new Map();
  for (let i = 0; i < pos.count; i++) { const k = key(i); if (seen.has(k)) { const j = seen.get(k); const a = new THREE.Vector3().fromBufferAttribute(n, i).add(new THREE.Vector3().fromBufferAttribute(n, j)).normalize(); n.setXYZ(i, a.x, a.y, a.z); n.setXYZ(j, a.x, a.y, a.z); } else seen.set(k, i); }
  return geo;
}
// a point on the sculpted surface (before the head's own scale), and its direction
function surface(lon, lat, p) {
  const d = new THREE.Vector3(Math.sin(lon) * Math.cos(lat), Math.sin(lat), Math.cos(lon) * Math.cos(lat));
  return { d, at: shapePoint(d, p) };
}

// ---------------------------------------------------------------- the face, painted
const rgba = (c, a) => { const k = new THREE.Color(c); return `rgba(${Math.round(k.r * 255)},${Math.round(k.g * 255)},${Math.round(k.b * 255)},${a})`; };
function paintFace(spec, style) {
  const F = spec.face || {}, p = P[style];
  const base = style === 'opera' ? '#f8eeea' : style === 'film' ? '#f4d8c6' : style === 'wood' ? '#f2dcbc' : spec.skin || '#f2dccb';
  return canvasTex(1024, 512, (g, W, H) => {
    g.scale(2, 2);
    const soft = (x, y, rx, ry, col, rot = 0) => { g.save(); g.translate(x, y); g.rotate(rot); g.scale(1, ry / rx); const gr = g.createRadialGradient(0, 0, 0, 0, 0, rx); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(-rx, -rx, rx * 2, rx * 2); g.restore(); };
    g.fillStyle = base; g.fillRect(0, 0, 512, 256);
    const [cx] = px(0, 0), [, ey] = px(0, EYE.lat);
    // modelling in paint: warmth in the cheeks, the nose tip and the ears, cool shade at the temples and under the jaw
    if (style !== 'anime') {
      soft(cx, 128 - (-0.75) * K, 50, 18, 'rgba(160,90,80,0.18)');
      soft(cx, px(0, -0.3)[1], 9, 7, 'rgba(220,120,110,0.25)');
      for (const s of [-1, 1]) soft(cx + s * 1.05 * K, 128, 30, 40, 'rgba(120,90,110,0.18)');
    }
    // cheeks
    const blush = F.blush || 'rgba(230,110,120,0.35)';
    const bk = { paper: 1.1, pili: 0.8, wood: 1.6, opera: 1.1, anime: 0.9, film: 1.0 }[style];
    for (const s of [-1, 1]) {
      if (style === 'wood') soft(cx + s * 0.5 * K, px(0, -0.22)[1], 20, 16, blush.replace(/[\d.]+\)$/, `${Math.min(0.9, 0.55)})`));
      else if (style === 'anime') { g.save(); g.fillStyle = 'rgba(240,120,130,0.35)'; for (let k = 0; k < 3; k++) { g.beginPath(); g.ellipse(cx + s * (0.44 * K + k * 5 - 5), px(0, -0.2)[1], 1.2, 4, 0.4 * s, 0, Math.PI * 2); g.fill(); } g.restore(); soft(cx + s * 0.46 * K, px(0, -0.2)[1], 16, 9, 'rgba(240,120,130,0.3)'); }
      else soft(cx + s * 0.48 * K, px(0, -0.2)[1], 22 * bk, 16 * bk, blush);
    }
    // opera: rouge from the lids up past the brows and out to the temples, fading down the sides of the nose
    if (style === 'opera') for (const s of [-1, 1]) {
      soft(cx + s * 0.38 * K, ey - 4, 40, 30, 'rgba(225,55,90,0.85)', s * -0.35);
      soft(cx + s * 0.36 * K, ey - 2, 22, 16, 'rgba(200,30,70,0.6)', s * -0.35);
      soft(cx + s * 0.62 * K, ey - 14, 22, 16, 'rgba(210,40,80,0.5)', s * -0.6);
      soft(cx + s * 0.3 * K, ey + 18, 18, 18, 'rgba(230,90,110,0.45)');
    }
    if (F.paint === 'demon') for (const s of [-1, 1]) { // a demon's mask of red and black round the eyes, down to the cheek
      const [ex, y] = px(s * EYE.lon, EYE.lat);
      g.fillStyle = 'rgba(150,10,20,0.85)'; g.beginPath(); g.moveTo(ex - s * 12, y - 15); g.quadraticCurveTo(ex + s * 22, y - 24, ex + s * 27, y - 3); g.quadraticCurveTo(ex + s * 20, y + 20, ex + s * 6, y + 30); g.quadraticCurveTo(ex + s * 4, y + 10, ex - s * 12, y + 6); g.fill();
      g.fillStyle = 'rgba(20,0,10,0.85)'; g.beginPath(); g.moveTo(ex - s * 10, y - 8); g.quadraticCurveTo(ex + s * 16, y - 16, ex + s * 22, y - 4); g.quadraticCurveTo(ex + s * 8, y + 6, ex - s * 9, y + 4); g.fill();
    }
    if (F.shadow) for (const s of [-1, 1]) soft(cx + s * EYE.lon * K, ey - 5, 18, 12, F.shadow);
    if (F.eyeshadow && style !== 'opera') for (const s of [-1, 1]) soft(cx + s * (EYE.lon + 0.04) * K, ey - 6, 17, 10, F.eyeshadow, s * -0.3);
    // the eyes
    for (const s of [-1, 1]) {
      const [ex] = px(s * EYE.lon, 0);
      if (p.eyes === 'glass') {
        // glass eyes sit in the head; paint only the dark wing at the outer corner and the crease above
        const wing = style === 'opera' ? 1.5 : style === 'film' ? 0.4 : 1;
        g.strokeStyle = F.line || '#140806'; g.lineCap = 'round'; g.lineWidth = 2.4 * wing;
        const eo = (p.eyeR / R0) * K * 0.95;
        g.beginPath(); g.moveTo(ex + s * eo * 0.8, ey - eo * 0.35); g.quadraticCurveTo(ex + s * (eo + 6 * wing), ey - eo * 0.5, ex + s * (eo + 11 * wing), ey - eo * 0.5 - 6 * wing); g.stroke();
        g.strokeStyle = 'rgba(90,40,30,0.35)'; g.lineWidth = 1.1; g.beginPath(); g.moveTo(ex - s * eo * 0.9, ey - eo * 0.95); g.quadraticCurveTo(ex, ey - eo * 1.55, ex + s * eo * 1.05, ey - eo * 1.0); g.stroke();
      } else if (style === 'anime') {
        const w = 15, h = 13, y = ey + 2;
        g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(ex, y, w, h, 0, 0, Math.PI * 2); g.fill();
        const gr = g.createLinearGradient(0, y - h, 0, y + h); gr.addColorStop(0, '#0a0610'); gr.addColorStop(0.55, F.iris && F.iris !== '#2a1a14' ? F.iris : '#5a3424'); gr.addColorStop(1, '#d8a070');
        g.fillStyle = gr; g.beginPath(); g.ellipse(ex + s * 1, y + 1, 8.5, 11.5, 0, 0, Math.PI * 2); g.fill();
        g.fillStyle = F.pupil && F.pupil !== '#050303' ? F.pupil : '#0a0408'; g.beginPath(); g.ellipse(ex + s * 1, y + 1, 3.8, 5.5, 0, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(ex - 3, y - 4, 3, 3.8, 0, 0, Math.PI * 2); g.fill(); g.beginPath(); g.arc(ex + 3, y + 5, 1.5, 0, Math.PI * 2); g.fill();
        // the lids cut the eye: skin over the top, a heavy lash line, a fine lower line
        g.fillStyle = base; g.beginPath(); g.moveTo(ex - w - 3, y - h - 6); g.lineTo(ex + w + 3, y - h - 6); g.lineTo(ex + w + 3, y - 3 - s * 2); g.quadraticCurveTo(ex, y - h - 4, ex - w - 3, y - 3 + s * 2); g.fill();
        g.beginPath(); g.moveTo(ex - w - 3, y + h + 4); g.lineTo(ex + w + 3, y + h + 4); g.lineTo(ex + w, y + 6); g.quadraticCurveTo(ex, y + h + 2, ex - w, y + 6); g.fill();
        g.strokeStyle = F.line || '#1a0a0a'; g.lineCap = 'round'; g.lineWidth = 3.6; g.beginPath(); g.moveTo(ex - s * (w + 2), y - 2 + 2); g.quadraticCurveTo(ex, y - h - 3.5, ex + s * (w + 4), y - 6); g.lineTo(ex + s * (w + 8), y - 9); g.stroke();
        g.lineWidth = 1.2; g.beginPath(); g.moveTo(ex - s * (w - 4), y + h - 1); g.quadraticCurveTo(ex + s * 2, y + h + 1.5, ex + s * (w - 1), y + 7); g.stroke();
      } else {
        // the old painted eye (paper)
        const y = ey - 1;
        g.fillStyle = '#fbf6ef'; g.beginPath(); g.moveTo(ex - s * 16, y + 2); g.quadraticCurveTo(ex, y - 13, ex + s * 17, y - 4); g.quadraticCurveTo(ex + s * 4, y + 9, ex - s * 16, y + 2); g.fill();
        g.fillStyle = F.iris || '#2a1a14'; g.beginPath(); g.arc(ex + s, y - 2, 7.5, 0, Math.PI * 2); g.fill();
        g.fillStyle = F.pupil || '#050303'; g.beginPath(); g.arc(ex + s, y - 2, 3.6, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#fff'; g.beginPath(); g.arc(ex + s * 3 - 2, y - 5, 1.8, 0, Math.PI * 2); g.fill();
        g.strokeStyle = F.line || '#140806'; g.lineCap = 'round'; g.lineWidth = 4.5; g.beginPath(); g.moveTo(ex - s * 17, y + 1); g.quadraticCurveTo(ex, y - 15, ex + s * 19, y - 6); g.lineTo(ex + s * 27, y - 12); g.stroke();
      }
      // the brows: swept up like sword blades, fine and arched, or a demon's spikes; drawn as many fine hairs
      const by = px(0, 0.215)[1], bw = { pili: 0.8, wood: 1.5, opera: 1.2, anime: 0.7, film: 1.3, paper: 1.2 }[style];
      const stroke = (pts, w0, col) => {
        if (style === 'pili' || style === 'film') { // hair by hair
          g.strokeStyle = col; g.lineCap = 'round';
          for (let k = 0; k < 26; k++) { const t = k / 25, a = pts(t), b = pts(Math.min(1, t + 0.09)); g.lineWidth = 0.7 + w0 * 0.5 * Math.sin(Math.PI * Math.min(1, t * 1.6)); g.beginPath(); g.moveTo(a[0], a[1] + 1.5 * (1 - t)); g.lineTo(b[0], b[1] - 1); g.stroke(); }
        } else { g.strokeStyle = col; g.lineCap = 'round'; for (let k = 0; k < 20; k++) { const t = k / 19, a = pts(t), b = pts(Math.min(1, t + 0.06)); g.lineWidth = w0 * (1 - 0.6 * t) * (0.4 + 0.6 * Math.min(1, t * 4)); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); } }
      };
      const col = F.browColor || (style === 'film' ? '#3a2418' : '#100604'), q = (x0, y0, x1, y1, x2, y2) => (t) => [(1 - t) ** 2 * x0 + 2 * t * (1 - t) * x1 + t * t * x2, (1 - t) ** 2 * y0 + 2 * t * (1 - t) * y1 + t * t * y2];
      if (F.brow === 'fine') stroke(q(ex - s * 13, by + 4, ex + s * 4, by - 7, ex + s * 22, by - 1), 2.6 * bw, col);
      else if (F.brow === 'demon') stroke(q(ex - s * 15, by + 9, ex + s * 8, by - 2, ex + s * 28, by - 16), 5 * bw, col);
      else stroke(q(ex - s * 16, by + 6, ex + s * 4, by - 2, ex + s * 26, by - 12), 4.4 * bw, col);
    }
    // the nose: shade down one side and under the tip, the nostrils; the mouth
    const [, ny] = px(0, -0.3);
    if (style === 'anime') { g.fillStyle = 'rgba(180,100,90,0.5)'; g.beginPath(); g.ellipse(cx - 2, ny + 3, 2.4, 1.2, 0, 0, Math.PI * 2); g.fill(); }
    else if (style === 'paper') { g.strokeStyle = 'rgba(120,70,50,0.55)'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(cx - 2, ey + 8); g.quadraticCurveTo(cx + 1, ey + 22, cx - 5, ey + 28); g.stroke(); }
    else { soft(cx - 6, ny - 8, 4, 14, 'rgba(150,80,70,0.25)'); for (const s of [-1, 1]) soft(cx + s * 6, ny + 5, 3, 2, 'rgba(90,30,30,0.6)'); }
    const [, my] = px(0, -0.545), lip = F.lip || '#b42828', mw = style === 'film' ? 13 : style === 'anime' ? 7 : 11;
    if (style === 'anime') { g.strokeStyle = 'rgba(120,40,40,0.8)'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(cx - mw, my); g.quadraticCurveTo(cx, my + 3, cx + mw, my); g.stroke(); }
    else {
      const top = my - (style === 'wood' ? 6 : 5), bot = my + (style === 'film' ? 6 : 7);
      const gr = g.createLinearGradient(0, top, 0, bot); gr.addColorStop(0, rgba(lip, style === 'film' ? 0.45 : 0.9)); gr.addColorStop(0.45, rgba(lip, style === 'film' ? 0.6 : 1)); gr.addColorStop(1, rgba(lip, style === 'film' ? 0.35 : 0.75));
      g.fillStyle = gr; g.beginPath(); g.moveTo(cx - mw, my); g.quadraticCurveTo(cx - mw * 0.45, top - 1, cx, top + 2); g.quadraticCurveTo(cx + mw * 0.45, top - 1, cx + mw, my); g.quadraticCurveTo(cx, bot + 2, cx - mw, my); g.fill();
      g.strokeStyle = 'rgba(60,10,10,0.75)'; g.lineWidth = 1.1; g.beginPath(); g.moveTo(cx - mw, my); g.quadraticCurveTo(cx, my + 1.8, cx + mw, my); g.stroke();
      soft(cx + 2, my + 3, 4, 2, 'rgba(255,255,255,0.3)');
    }
    if (F.fangs) { g.fillStyle = '#fff8ee'; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(cx + s * 5, my + 1); g.lineTo(cx + s * 7, my + 8); g.lineTo(cx + s * 9, my + 1); g.fill(); } }
    // a mark on the brow: a lotus, a flame, a jewel-drop
    if (F.mark) {
      const [, my2] = px(0, 0.36); g.fillStyle = F.markColor || '#c81828';
      if (F.mark === 'lotus') { for (const a of [-0.5, 0, 0.5]) { g.save(); g.translate(cx, my2 + 6); g.rotate(a); g.beginPath(); g.ellipse(0, -7, 3, 8, 0, 0, Math.PI * 2); g.fill(); g.restore(); } }
      else if (F.mark === 'drop') { g.beginPath(); g.moveTo(cx, my2 - 8); g.quadraticCurveTo(cx + 5, my2 + 2, cx, my2 + 7); g.quadraticCurveTo(cx - 5, my2 + 2, cx, my2 - 8); g.fill(); }
      else { g.beginPath(); g.moveTo(cx, my2 - 10); g.quadraticCurveTo(cx + 7, my2, cx + 2, my2 + 10); g.quadraticCurveTo(cx - 5, my2 + 2, cx, my2 - 10); g.fill(); }
    }
    // lacquer: a few fine cracks and a warm varnish over the old carved face
    if (style === 'wood') {
      g.fillStyle = 'rgba(200,150,60,0.1)'; g.fillRect(0, 0, 512, 256);
      g.strokeStyle = 'rgba(90,60,30,0.18)'; g.lineWidth = 0.5; let sd = 7; const R = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
      for (let k = 0; k < 90; k++) { let x = 40 + R() * 180, y = 40 + R() * 180; g.beginPath(); g.moveTo(x, y); for (let j = 0; j < 4; j++) { x += (R() - 0.5) * 14; y += (R() - 0.5) * 14; g.lineTo(x, y); } g.stroke(); }
    }
    // the back of the head and the top are under the hair
    g.fillStyle = spec.hair?.color || '#121014'; g.fillRect(256, 0, 256, 256); g.fillRect(0, 0, 512, 26);
  });
}
function irisTex(F) {
  return canvasTex(256, 128, (g) => {
    g.fillStyle = '#f6f2ec'; g.fillRect(0, 0, 256, 128);
    const gr0 = g.createLinearGradient(0, 0, 256, 0); gr0.addColorStop(0, 'rgba(200,120,120,0.25)'); gr0.addColorStop(0.25, 'rgba(0,0,0,0)'); gr0.addColorStop(0.75, 'rgba(0,0,0,0)'); gr0.addColorStop(1, 'rgba(200,120,120,0.25)'); g.fillStyle = gr0; g.fillRect(0, 0, 256, 128);
    const x = 64, y = 64, r = 19, iris = new THREE.Color(F.iris || '#3a2418');
    const gr = g.createRadialGradient(x, y, 2, x, y, r); gr.addColorStop(0, '#000'); gr.addColorStop(0.35, '#' + iris.clone().multiplyScalar(0.6).getHexString()); gr.addColorStop(0.75, '#' + iris.clone().lerp(new THREE.Color('#c89060'), 0.35).getHexString()); gr.addColorStop(0.95, '#140808'); gr.addColorStop(1, 'rgba(20,8,8,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
    g.strokeStyle = 'rgba(255,255,255,0.12)'; for (let a = 0; a < 6.28; a += 0.2) { g.beginPath(); g.moveTo(x + Math.cos(a) * 8, y + Math.sin(a) * 8); g.lineTo(x + Math.cos(a) * 17, y + Math.sin(a) * 17); g.stroke(); }
    g.fillStyle = F.pupil && F.pupil !== '#050303' ? F.pupil : '#020101'; g.beginPath(); g.arc(x, y, 7, 0, Math.PI * 2); g.fill();
  });
}

// ---------------------------------------------------------------- materials, then the head
export function headLook(spec) {
  const style = styleOf(spec), p = P[style], face = paintFace(spec, style);
  const skinCol = style === 'opera' ? '#f8eeea' : style === 'film' ? '#f4d8c6' : style === 'wood' ? '#f2dcbc' : spec.skin || '#f2dccb';
  const toonM = (o) => new THREE.MeshToonMaterial({ gradientMap: TOON, ...o });
  const mk = (o) => {
    if (p.skin === 'cel') return new THREE.MeshToonMaterial({ gradientMap: CEL, emissive: '#ffffff', emissiveIntensity: 0.35, ...o, ...(o.map ? { emissiveMap: o.map } : { emissive: o.color }) });
    if (style === 'paper') return toonM(o);
    if (p.skin === 'lacquer') return new THREE.MeshPhysicalMaterial({ roughness: 0.42, clearcoat: 1, clearcoatRoughness: 0.12, flatShading: !!p.flat, ...o });
    if (p.skin === 'powder') return new THREE.MeshPhysicalMaterial({ roughness: 0.55, sheen: 0.6, sheenColor: '#ffd8e0', sheenRoughness: 0.5, clearcoat: 0.25, clearcoatRoughness: 0.4, ...o });
    if (p.skin === 'soft') return new THREE.MeshPhysicalMaterial({ roughness: 0.62, sheen: 0.8, sheenColor: '#ffb8a0', sheenRoughness: 0.6, emissive: '#2a0a04', ...o });
    return new THREE.MeshPhysicalMaterial({ roughness: 0.5, sheen: 0.5, sheenColor: '#ffc8b8', sheenRoughness: 0.5, clearcoat: 0.3, clearcoatRoughness: 0.35, emissive: '#140504', ...o });
  };
  const hairCol = spec.hair?.color || '#101014';
  const hairMap = canvasTex(128, 256, (g, W, H) => {
    g.fillStyle = hairCol; g.fillRect(0, 0, W, H); const c = new THREE.Color(hairCol), lift = c.r + c.g + c.b < 0.5 ? 46 : 0; // dark hair shows its strands as lighter lines
    for (let x = 0; x < W; x++) { const k = 0.7 + 0.6 * Math.random(), l = Math.random() < 0.3 ? lift * Math.random() : 0; g.fillStyle = `rgb(${Math.min(255, c.r * 255 * k + 6 + l)},${Math.min(255, c.g * 255 * k + 6 + l)},${Math.min(255, c.b * 255 * k + 8 + l * 1.1)})`; g.fillRect(x, 0, 1, H); }
  });
  hairMap.wrapT = THREE.RepeatWrapping; if (style !== 'paper') hairMap.repeat.set(6, 1); // finer strands over the whole head
  const hair = style === 'paper' || style === 'anime' ? toonM({ map: hairMap, side: THREE.DoubleSide })
    : new THREE.MeshPhysicalMaterial({ map: hairMap, roughness: 0.55, sheen: 0.5, sheenColor: new THREE.Color(hairCol).lerp(new THREE.Color('#ffffff'), 0.5), sheenRoughness: 0.35, clearcoat: style === 'wood' ? 0.5 : 0, side: THREE.DoubleSide });
  return { style, p, skin: mk({ color: skinCol }), face: mk({ map: face }), hair };
}

// the hair: the head's own shape a little larger, everywhere above the hairline. In front the line runs across the
// forehead with a point in the middle, comes down at the temples in front of the ears, and behind them to the nape.
function hairline(lon) {
  const a = Math.abs(lon);
  const front = 0.52 - 0.06 * Math.exp(-((lon / 0.12) ** 2)) + 0.03 * (a / 1.1) ** 2;
  const temple = -0.25, nape = -0.75;
  if (a < 1.1) return front;
  if (a < 1.45) return front + (temple - front) * smooth(1.1, 1.45, a);
  return temple + (nape - temple) * smooth(1.55, 1.9, a);
}
function hairGeo(p) {
  const geo = new THREE.SphereGeometry(R0, 96, 56), pos = geo.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    const lon = Math.atan2(v.x, v.z), lat = Math.asin(clamp(v.y, -1, 1)), h = hairline(lon);
    const { at } = surface(lon, Math.max(lat, h), p);
    // a little thickness, more on the crown; the swell of the hair swept back over the head; below the line it tucks in
    const thick = lat >= h ? 0.009 + 0.012 * smooth(0.0, 1.2, lat) + 0.004 * smooth(h, h + 0.15, lat) : -0.02 * smooth(h, h - 0.06, lat);
    const d = at.clone().normalize(); at.addScaledVector(d, thick);
    pos.setXYZ(i, at.x, at.y, at.z);
  }
  geo.computeVertexNormals();
  return geo;
}

export function addHead(head, spec, look, mesh) {
  const { p, style } = look, F = spec.face || {};
  const sc = p.scale || [0.95, 1.15, 1.0];
  const skull = mesh(head, sculptGeo(p), look.face, 0, 0.14, 0); skull.scale.set(...sc);
  if (p.outline) { // anime: an inked outline round the head and hair
    const ink = new THREE.MeshBasicMaterial({ color: '#1a0c0c', side: THREE.BackSide });
    const o = new THREE.Mesh(skull.geometry, ink); o.scale.setScalar(1.035); skull.add(o);
  }
  // the hair over the crown and back
  const cap = [style === 'paper' ? new THREE.SphereGeometry(0.143, 24, 14, Math.PI * 0.62, Math.PI * 1.76, 0, Math.PI * 0.62) : hairGeo(p)];
  for (const geo of cap) {
    const shell = mesh(head, geo, look.hair, 0, 0.14, 0); if (style === 'paper') shell.scale.set(0.97, 1.13, 1.04); else shell.scale.set(...sc);
    if (p.outline) { const o = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: '#1a0c0c', side: THREE.BackSide })); o.scale.setScalar(1.03); shell.add(o); }
  }
  if (p.sculpt) mesh(head, new THREE.CylinderGeometry(0.047, 0.062, 0.15, 20, 1, true), look.skin, 0, 0.02, -0.01); // the neck, up under the jaw
  for (const s of [-1, 1]) mesh(head, new THREE.SphereGeometry(0.03, 12, 8), look.skin, s * 0.128 * sc[0] / 0.95, 0.13, -0.005).scale.set(0.4, 1, 0.7); // ears
  if (p.eyes !== 'glass') return;
  // glass eyes in their sockets, an upper and a lower lid over each, the upper one lined dark at its edge
  const eyeM = new THREE.MeshPhysicalMaterial({ map: irisTex(F), roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.03 });
  const lidTex = canvasTex(8, 64, (g) => { const gr = g.createLinearGradient(0, 0, 0, 64); gr.addColorStop(0, '#fff'); gr.addColorStop(0.8, '#fff'); gr.addColorStop(0.86, F.line || '#1a0a08'); gr.addColorStop(1, F.line || '#0a0404'); g.fillStyle = gr; g.fillRect(0, 0, 8, 64); });
  const lidCol = F.paint === 'demon' ? '#6a1018' : style === 'opera' ? '#e86a88' : F.eyeshadow ? '#e8a8b0' : look.skin.color.getStyle();
  const lidM = look.skin.clone(); lidM.map = lidTex; lidM.color = new THREE.Color(lidCol); lidM.side = THREE.DoubleSide;
  const lowM = look.skin.clone(); lowM.color = new THREE.Color(lidCol).lerp(new THREE.Color(look.skin.color), 0.6); lowM.side = THREE.DoubleSide;
  const er = p.eyeR;
  for (const s of [-1, 1]) {
    const { d, at } = surface(s * EYE.lon, EYE.lat, p);
    const c = at.clone().addScaledVector(d, -er * 0.55); c.multiply(new THREE.Vector3(...sc)); c.y += 0.14;
    const eye = new THREE.Group(); eye.position.copy(c); eye.rotation.set(0, s * 0.05, 0); head.add(eye);
    mesh(eye, new THREE.SphereGeometry(er, 32, 20), eyeM, 0, 0, 0); // the iris looks out along +z
    const tilt = s * p.lidTilt; // the outer corners lift (phoenix eyes)
    const up = mesh(eye, new THREE.SphereGeometry(er * 1.08, 32, 10, 0, Math.PI * 2, 0, Math.PI * 0.4), lidM, 0, 0, 0); up.rotation.set(-0.08, 0, -tilt);
    const lo = mesh(eye, new THREE.SphereGeometry(er * 1.05, 32, 8, 0, Math.PI * 2, Math.PI * 0.66, Math.PI * 0.34), lowM, 0, 0, 0); lo.rotation.set(-0.15, 0, -tilt * 0.6);
  }
}
