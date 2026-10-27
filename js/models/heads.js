// The puppet's head, in one of several styles. Each style decides how the head is sculpted (brow, eye sockets, nose,
// cheekbones, lips, chin, the jaw narrowing), what its skin is made of (painted toon, glossy lacquered wood, soft
// skin), whether the eyes are glass eyeballs under lids or painted on, and how the face is made up. The character
// (js/cast/characters.js) still decides the brows, the eye colour, the lips, the marks and the demon's paint.
//   headLook(spec) -> materials (skin, face, hair) for buildPuppet; addHead(head, spec, look) builds it on the neck
// The style: spec.style, else ?style= in the address, else DEFAULT_STYLE. styles.html shows them side by side.
import * as THREE from '../../lib/three.module.min.js';
import { TOON } from '../toon.js?v=12';

export const STYLES = {
  paper: { zh: '原本的樣子', en: 'As it was', about: { zh: '畫在球上的臉，色塊明暗', en: 'a face painted on a ball, toon bands' } },
  pili: { zh: '霹靂寫實', en: 'Pili realism', about: { zh: '雕出眉骨、鼻樑、顴骨的頭，玻璃眼珠與眼瞼，柔和的皮膚光澤', en: 'carved brow, nose and cheekbones, glass eyes under lids, soft skin' } },
  wood: { zh: '古典木雕', en: 'Carved wood', about: { zh: '老戲偶：刀刻的面、上漆的亮面、濃重的彩繪', en: 'an old puppet: knife-cut facets, lacquer shine, bold paint' } },
  opera: { zh: '戲曲濃妝', en: 'Opera make-up', about: { zh: '白粉底、胭脂紅眼影掃到太陽穴、上挑的鳳眼', en: 'white base, rouge sweeping to the temples, upswept phoenix eyes' } },
  anime: { zh: '日系動畫', en: 'Anime', about: { zh: '賽璐璐上色與描邊，大而亮的畫眼', en: 'cel shading with outlines, big bright painted eyes' } },
  film: { zh: '3D 動畫電影', en: 'Animated feature', about: { zh: '圓潤的頭、大玻璃眼、柔軟的皮膚', en: 'a rounded head, big glass eyes, soft skin' } },
  drama: { zh: '武俠劇真人感', en: 'Live-action wuxia', about: { zh: '照古裝武俠劇：自然膚色、淡妝、濃直的劍眉、紅唇', en: 'like a costume drama: natural skin, light make-up, straight brows, red lips' } },
};
export const DEFAULT_STYLE = 'paper';
export const lockAt = (look) => (look.p.sculpt ? [0.09, 0.165, -0.002] : [0.11, 0.2, 0.06]); // where the side locks hang from
const fromAddress = (() => { try { const s = new URLSearchParams(location.search).get('style'); return STYLES[s] ? s : null; } catch (e) { return null; } })();
export const styleOf = (spec) => (STYLES[spec.style] ? spec.style : fromAddress || DEFAULT_STYLE);

// how each style is sculpted (0 = a plain ball) and finished
const P = {
  paper: { sculpt: 0 },
  pili: { sculpt: 1, eyes: 'glass', eyeK: 1.32, lidTilt: 0.12, skin: 'skin' },
  wood: { sculpt: 1, eyes: 'glass', eyeK: 1.24, nose: 0.9, cheek: 1.3, chin: 0.9, lidTilt: 0.08, skin: 'lacquer' },
  opera: { sculpt: 1, eyes: 'glass', eyeK: 1.28, nose: 0.95, lidTilt: 0.3, skin: 'powder' },
  anime: { sculpt: 1, eyes: 'paint', socket: 0.15, nose: 0.35, noseBulb: 0.8, lip: 0.25, brow: 0.3, cheek: 0.3, chin: 0.7, chinPoint: 1.2, jawW: 0.92, skin: 'cel', outline: true },
  drama: { sculpt: 1, eyes: 'glass', eyeK: 1.12, lidTilt: 0.05, skin: 'skin' },
  film: { sculpt: 1, eyes: 'glass', eyeK: 1.75, socket: 1.3, nose: 1.1, noseBulb: 1.7, lip: 0.8, cheek: 1.6, chin: 0.6, jawW: 1.12, mouthW: 1.1, lidTilt: 0.04, skin: 'soft' },
};
const skinOf = (spec, style) => (style === 'opera' ? '#f8eeea' : style === 'film' ? '#f4d8c6' : style === 'wood' ? '#f2dcbc' : spec.skin || '#f2dccb');

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

// ---------------------------------------------------------------- the anatomy: a human head, in metres
// The head is a skull (an egg, narrower than it is tall, the face at +z) with a face laid over its front. The face is
// a height field: for each point (x, y) on the front, how far forward the skin is. Its profile down the middle follows
// a real face: forehead, brow ridge, the dip at the bridge of the nose, the nose rising to its tip and turning back
// under it, the upper lip with its groove, the mouth, the lower lip, the hollow under it, the chin, and then the
// underside of the jaw going back to the neck. Across, it curves round to the cheeks and the jaw, the eyes set in
// their sockets, the cheekbones standing out below them. The eye line is at y = 0, the chin at about -0.135, the
// crown at +0.152; the eyes are 0.067 apart. Each style scales the features (p.nose, p.lip, p.eyeK...).
const SK = { hw: 0.087, hh: 0.148, hd: 0.114, cy: 0.004, cz: -0.014 }; // the skull: half width, height, depth; centre
export const EYE_X = 0.0345, EYE_Y = 0.0;
// a smooth curve through points [[y, value], ...] (y descending), cubic between them
function curve(y, pts) {
  if (y >= pts[0][0]) return pts[0][1];
  const n = pts.length - 1;
  if (y <= pts[n][0]) return pts[n][1];
  let i = 0; while (i < n && y < pts[i + 1][0]) i++;
  const [y0, a] = pts[i], [y1, b] = pts[i + 1], t = (y - y0) / (y1 - y0);
  const slope = (k) => { const p0 = pts[Math.max(0, k - 1)], p1 = pts[Math.min(n, k + 1)]; return (p1[1] - p0[1]) / (p1[0] - p0[0]) * (y1 - y0); };
  const m0 = slope(i), m1 = slope(i + 1), t2 = t * t, t3 = t2 * t;
  return (2 * t3 - 3 * t2 + 1) * a + (t3 - 2 * t2 + t) * m0 + (-2 * t3 + 3 * t2) * b + (t3 - t2) * m1;
}
const G2 = (x, y, x0, y0, sx, sy) => Math.exp(-(((x - x0) / sx) ** 2) - (((y - y0) / sy) ** 2));
const G1 = (y, y0, s) => Math.exp(-(((y - y0) / s) ** 2));
const smax = (a, b, k) => { const h = clamp(0.5 + 0.5 * (b - a) / k); return a * (1 - h) + b * h + k * h * (1 - h) * 0.5; };
// how far forward the face is at (x, y); -1 where there is no face
function faceZ(x, y, p) {
  x /= p.wid || 1; if (y < 0) y /= p.lowY || 1; // a wider or narrower face, a longer or shorter lower face
  const ax = Math.abs(x);
  const Zm = curve(y, [[0.16, -0.03], [0.12, 0.052], [0.09, 0.08], [0.05, 0.092], [0.024, 0.097], [0.0, 0.093], [-0.03, 0.094], [-0.06, 0.095], [-0.09, 0.091], [-0.11, 0.086], [-0.122, 0.077], [-0.132, 0.057], [-0.14, 0.02], [-0.155, -0.06]]);
  const kx = curve(y, [[0.12, 5.6], [0.05, 6], [0.0, 6.8], [-0.04, 8.2], [-0.08, 10], [-0.105, 15 * (p.chinPoint || 1)], [-0.13, 26]]);
  const hw = curve(y, [[0.1, 0.082], [0.0, 0.085], [-0.04, 0.08], [-0.08, 0.072 * (p.jawW || 1)], [-0.105, 0.056 * (p.jawW || 1)], [-0.135, 0.038]]);
  let z = Zm - kx * x * x - 60 * Math.max(0, ax - 0.62 * hw) ** 2;
  // the brow ridge, the bridge, the sockets, the cheekbones
  z += 0.005 * (p.brow ?? 1) * G2(ax, y, 0.028, 0.024, 0.028, 0.01);
  z -= 0.003 * G2(x, y, 0, 0.007, 0.012, 0.012);
  z -= 0.011 * (p.socket ?? 1) * G2(ax, y, EYE_X, EYE_Y + 0.001, 0.0185, 0.0135);
  z += 0.006 * (p.cheek ?? 1) * G2(ax, y, 0.05, -0.024, 0.02, 0.018);
  if (p.jawSq) z += 0.005 * p.jawSq * G2(ax, y, 0.058, -0.088, 0.014, 0.016);  // the corners of a square jaw
  if (p.hollow) z -= 0.004 * p.hollow * G2(ax, y, 0.048, -0.056, 0.014, 0.016); // hollow cheeks
  if (p.temple) z -= 0.004 * p.temple * G2(ax, y, 0.072, 0.035, 0.012, 0.03);  // narrow temples
  // the nose: a ridge from the bridge down to the tip, wider as it goes, the tip, the wings, turning back under the tip
  const N = p.nose ?? 1, NB = p.noseBulb || 1;
  if (y < 0.012 && y > -0.06) {
    const t = clamp((0.008 - y) / 0.048);
    const h = y > -0.04 ? 0.003 + 0.019 * t ** 1.25 : 0.022 * (1 - clamp((-0.04 - y) / 0.013)) ** 1.6;
    const w = 0.0055 + 0.0065 * t * NB;
    z += N * h * Math.exp(-((x / w) ** 2));
  }
  z += N * 0.0035 * NB * G2(x, y, 0, -0.038, 0.009 * NB, 0.008);           // the tip
  z += N * 0.007 * G2(ax, y, 0.0135 * Math.sqrt(NB), -0.044, 0.0075, 0.0065); // the wings of the nose
  z -= N * 0.001 * G2(ax, y, 0.019, -0.04, 0.004, 0.012);                  // the crease beside the wings
  // the mouth: the upper lip and its groove, the line, the lower lip, the hollow below, then the chin
  const L = p.lip ?? 1, mw = 0.023 * (p.mouthW || 1);
  const across = Math.exp(-((x / mw) ** 4)), across2 = Math.exp(-((x / (mw * 0.9)) ** 4));
  z += L * 0.0055 * across * G1(y, -0.062, 0.008);
  z -= L * 0.0016 * G2(x, y, 0, -0.057, 0.0035, 0.006);
  z -= L * 0.0032 * Math.exp(-((x / (mw * 1.05)) ** 4)) * G1(y, -0.0705, 0.0017);
  z += L * 0.0055 * across2 * G1(y, -0.077, 0.0055);
  z -= 0.002 * G2(ax, y, mw * 1.05, -0.071, 0.004, 0.006);                 // the corners of the mouth
  z -= 0.0035 * Math.exp(-((x / 0.02) ** 2)) * G1(y, -0.087, 0.006);         // the hollow above the chin
  z += 0.006 * (p.chin ?? 1) * G2(x, y, 0, -0.106, 0.027, 0.015);            // the chin
  return z;
}
// where the surface is, for a direction d from the centre of the skull
function shapePoint(d, p) {
  let x = SK.hw * (p.wid || 1) * d.x, y = SK.cy + SK.hh * d.y, z = SK.cz + SK.hd * d.z;
  const low = smooth(-0.02, -0.14 * (p.lowY || 1), y);
  x *= 1 - 0.22 * low;                                               // the lower head narrows to the jaw and the neck
  if (d.z > 0) z = SK.cz + (z - SK.cz) * (0.72 - 0.3 * low);        // in front the skull sits back behind the face
  z -= 0.012 * smooth(0.05, 0.15, y) * Math.max(0, d.z);             // the forehead slopes back into the crown
  if (d.z > 0) z = smax(z, faceZ(x, y, p), 0.014);
  return new THREE.Vector3(x, y, z);
}
function sculptGeo(p) {
  const geo = p.lod ? new THREE.SphereGeometry(1, 72, 52) : new THREE.SphereGeometry(1, 160, 112), pos = geo.attributes.position, uv = geo.attributes.uv, v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    const q = shapePoint(v, p); pos.setXYZ(i, q.x, q.y, q.z);
    // the face texture is projected from the front; behind the ears it reads plain skin from a corner of it
    const vv = clamp(0.5 + (q.y - PY) / (PS * 256), 0.005, 0.995);
    uv.setXY(i, v.z > -0.3 ? clamp(0.5 + q.x / (PS * 256), 0.005, 0.995) : 0.5 + Math.sign(q.x) * 0.495, vv);
  }
  geo.computeVertexNormals();
  const n = geo.attributes.normal, key = (i) => `${pos.getX(i).toFixed(6)},${pos.getY(i).toFixed(6)},${pos.getZ(i).toFixed(6)}`, seen = new Map();
  for (let i = 0; i < pos.count; i++) { const k = key(i); if (seen.has(k)) { const j = seen.get(k); const a = new THREE.Vector3().fromBufferAttribute(n, i).add(new THREE.Vector3().fromBufferAttribute(n, j)).normalize(); n.setXYZ(i, a.x, a.y, a.z); n.setXYZ(j, a.x, a.y, a.z); } else seen.set(k, i); }
  return geo;
}
// the hair: everywhere above the hairline, a little out from the skin. The line runs across the forehead with a point
// in the middle, comes down at the temples in front of the ears, rises over them, and down behind them to the nape.
function hairlineY(q) {
  const a = Math.abs(Math.atan2(q.x, q.z - SK.cz));
  const front = 0.066 - 0.004 * Math.exp(-((a / 0.13) ** 2)) + 0.014 * (a / 0.75) ** 2;
  if (a < 0.75) return front;
  if (a < 1.25) return front + (0.0 - front) * smooth(0.75, 1.25, a);
  if (a < 1.5) return 0.0 + 0.02 * smooth(1.3, 1.5, a);
  return 0.02 + (-0.095 - 0.02) * smooth(1.6, 2.1, a);
}
function hairGeo(p) {
  const geo = p.lod ? new THREE.SphereGeometry(1, 72, 48) : new THREE.SphereGeometry(1, 160, 100), pos = geo.attributes.position, v = new THREE.Vector3(), c = new THREE.Vector3(0, SK.cy, SK.cz);
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    let q = shapePoint(v, p), h = hairlineY(q);
    if (q.y < h) {
      const az = Math.atan2(v.x, v.z), dir = (lat) => new THREE.Vector3(Math.sin(az) * Math.cos(lat), Math.sin(lat), Math.cos(az) * Math.cos(lat));
      let lo = Math.asin(clamp(v.y, -1, 1)), hi = 1.5;
      for (let k = 0; k < 16; k++) { const mid = (lo + hi) / 2, qq = shapePoint(dir(mid), p); if (qq.y < hairlineY(qq)) lo = mid; else hi = mid; }
      q = shapePoint(dir(hi), p); h = q.y;
    }
    const out = q.clone().sub(c).normalize();
    const thick = (0.004 + 0.011 * smooth(-0.05, 0.15, q.y)) * smooth(h - 0.0005, h + 0.012, q.y) + 0.0004;
    q.addScaledVector(out, thick); pos.setXYZ(i, q.x, q.y, q.z);
  }
  geo.computeVertexNormals();
  return geo;
}

// ---------------------------------------------------------------- the face as it was: painted on a ball (the 'paper' style)
const rgba = (c, a) => { const k = new THREE.Color(c); return `rgba(${Math.round(k.r * 255)},${Math.round(k.g * 255)},${Math.round(k.b * 255)},${a})`; };
function paintOld(spec, style) {
  const F = spec.face || {}, p = P[style];
  const base = skinOf(spec, style);
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
// ---------------------------------------------------------------- the face, made up (on the front-projected texture)
// The texture is 256 x 256 (drawn at 4x): a point (x, y) on the face, in metres, is at (128 + x / PS, 128 - (y - PY) / PS).
const PS = 0.0009, PY = -0.02;
function makeUp(spec, style, p = P[style]) {
  const F = spec.face || {}, base = skinOf(spec, style), E = spec.eyeShape || {};
  return canvasTex(1024, 1024, (g) => {
    g.scale(4, 4);
    const wid = p.wid || 1, lowY = p.lowY || 1; // the features move with the face's shape
    const X = (x) => 128 + x * wid / PS, Y = (y) => 128 - ((y < 0 ? y * lowY : y) - PY) / PS, L = (m) => m / PS;
    const soft = (x, y, rx, ry, col, rot = 0) => { g.save(); g.translate(X(x), Y(y)); g.rotate(rot); g.scale(1, ry / rx); const gr = g.createRadialGradient(0, 0, 0, 0, 0, L(rx)); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(-L(rx), -L(rx), L(rx) * 2, L(rx) * 2); g.restore(); };
    const path = (pts, close) => { g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(X(x), Y(y)) : g.moveTo(X(x), Y(y)))); if (close) g.closePath(); };
    const quad = (x0, y0, x1, y1, x2, y2) => { g.beginPath(); g.moveTo(X(x0), Y(y0)); g.quadraticCurveTo(X(x1), Y(y1), X(x2), Y(y2)); };
    g.fillStyle = base; g.fillRect(0, 0, 256, 256);
    const anime = style === 'anime';
    // modelling in paint: a little warmth on the nose, the cheeks and the chin, cool at the temples, shade under the jaw
    if (!anime) {
      soft(0, -0.04, 0.012, 0.01, 'rgba(220,120,110,0.22)');
      soft(0, -0.11, 0.02, 0.012, 'rgba(220,130,120,0.16)');
      for (const s of [-1, 1]) soft(s * 0.072, 0.03, 0.022, 0.04, 'rgba(110,90,120,0.16)');
      soft(0, -0.135, 0.05, 0.012, 'rgba(120,60,60,0.25)');
    }
    const blush = F.blush || 'rgba(230,110,120,0.32)';
    for (const s of [-1, 1]) {
      if (anime) { g.fillStyle = 'rgba(240,120,130,0.4)'; for (let k = 0; k < 3; k++) { g.beginPath(); g.ellipse(X(s * (0.04 + k * 0.005)), Y(-0.03), 1.1, 3.8, 0.4 * s, 0, Math.PI * 2); g.fill(); } soft(s * 0.045, -0.03, 0.016, 0.009, 'rgba(240,120,130,0.3)'); }
      else if (style === 'drama' && !F.fem) { /* a man in a drama: no rouge */ }
      else soft(s * 0.045, -0.03, style === 'wood' ? 0.024 : 0.021, style === 'wood' ? 0.018 : 0.015, style === 'wood' ? 'rgba(235,90,110,0.55)' : blush);
    }
    // opera: rouge round the eyes, up to the brows, out to the temples, fading down the sides of the nose
    if (style === 'opera') for (const s of [-1, 1]) {
      soft(s * 0.036, 0.004, 0.028, 0.021, 'rgba(225,55,90,0.85)', s * -0.3);
      soft(s * 0.034, 0.003, 0.016, 0.011, 'rgba(195,30,70,0.6)', s * -0.3);
      soft(s * 0.056, 0.018, 0.018, 0.012, 'rgba(210,40,80,0.45)', s * -0.6);
      soft(s * 0.026, -0.02, 0.014, 0.016, 'rgba(230,90,110,0.4)');
    }
    if (F.paint === 'yinyang') { g.fillStyle = '#1c1a1e'; g.fillRect(0, 0, X(0), 256); } // half the face black
    if (F.paint === 'demon') for (const s of [-1, 1]) { // the demon's mask: red (or its colour) round the eyes and down the cheek, black inside
      g.fillStyle = F.paintColor ? rgba(F.paintColor, 0.88) : 'rgba(150,10,20,0.88)'; path([[s * 0.014, 0.014], [s * 0.04, 0.022], [s * 0.064, 0.016], [s * 0.066, -0.004], [s * 0.05, -0.03], [s * 0.032, -0.05], [s * 0.03, -0.018], [s * 0.016, -0.008]], true); g.fill();
      g.fillStyle = 'rgba(20,0,10,0.88)'; path([[s * 0.018, 0.008], [s * 0.04, 0.014], [s * 0.058, 0.01], [s * 0.054, -0.006], [s * 0.034, -0.012], [s * 0.018, -0.006]], true); g.fill();
    }
    if (F.shadow) for (const s of [-1, 1]) soft(s * EYE_X, 0.007, 0.018, 0.01, F.shadow);
    if (F.eyeshadow && style !== 'opera') for (const s of [-1, 1]) soft(s * (EYE_X + 0.004), 0.006, 0.017, 0.009, F.eyeshadow, s * -0.3);
    const er = 0.0122 * (p.eyeK || 1), line = F.line || '#140806';
    for (const s of [-1, 1]) {
      const ex = s * EYE_X * (anime ? (E.gap || 1) * 1.1 : 1);
      if (!anime) {
        // glass eyes sit in the sockets: paint the dark wing out from the outer corner and the crease above the lid
        const wing = style === 'opera' ? 1.6 : style === 'film' ? 0.3 : style === 'wood' ? 1.2 : style === 'drama' ? (F.fem ? 0.55 : 0.2) : 1;
        g.strokeStyle = line; g.lineCap = 'round'; g.lineWidth = 1.5 * wing;
        quad(ex + s * er * 0.85, 0.002, ex + s * (er + 0.004 * wing), 0.0035, ex + s * (er + 0.009 * wing), 0.004 + 0.005 * wing); g.stroke();
        g.strokeStyle = 'rgba(90,40,30,0.35)'; g.lineWidth = 0.8;
        quad(ex - s * er * 0.95, 0.0065, ex, 0.0115 + er * 0.25, ex + s * er * 1.05, 0.007); g.stroke();
      } else {
        // anime: a big painted eye, its lids cutting it, a heavy upper lash line, two highlights
        const w = (E.w || 0.0175) * 1.22, h = (E.h || 0.016) * 1.25, y = -0.002, ir = (E.iris || 1) * 1.22, lw = E.lash || 1, ex0 = ex; // anime eyes: bigger than life
        g.save(); g.translate(X(ex0), Y(y)); g.rotate(-s * (E.tilt || 0)); g.translate(-X(ex0), -Y(y)); // the slant of the eye
        g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(X(ex), Y(y), L(w), L(h), 0, 0, Math.PI * 2); g.fill();
        const gr = g.createLinearGradient(0, Y(y + h), 0, Y(y - h)); gr.addColorStop(0, '#0a0610'); gr.addColorStop(0.55, F.iris && F.iris !== '#2a1a14' ? F.iris : '#5a3424'); gr.addColorStop(1, '#d8a070');
        g.fillStyle = gr; g.beginPath(); g.ellipse(X(ex + s * 0.001), Y(y - 0.001), L(0.0095 * ir), L(Math.min(h * 0.92, 0.0135 * ir)), 0, 0, Math.PI * 2); g.fill();
        g.fillStyle = F.pupil && F.pupil !== '#050303' ? F.pupil : '#0a0408'; g.beginPath(); g.ellipse(X(ex + s * 0.001), Y(y - 0.001), L(0.0042 * ir * (E.sharp ? 0.6 : 1)), L(Math.min(h * 0.5, 0.0062 * ir)), 0, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(X(ex - 0.003), Y(y + 0.005), L(0.0032), L(0.004), 0, 0, Math.PI * 2); g.fill(); g.beginPath(); g.arc(X(ex + 0.004), Y(y - 0.006), L(0.0016), 0, Math.PI * 2); g.fill();
        g.fillStyle = base;
        g.beginPath(); g.moveTo(X(ex - w * 1.3), Y(y + h * 1.5)); g.lineTo(X(ex + w * 1.3), Y(y + h * 1.5)); g.lineTo(X(ex + s * w * 1.2), Y(y + 0.004)); g.quadraticCurveTo(X(ex), Y(y + h * 1.2), X(ex - s * w * 1.2), Y(y + 0.001)); g.fill();
        g.beginPath(); g.moveTo(X(ex - w * 1.3), Y(y - h * 1.4)); g.lineTo(X(ex + w * 1.3), Y(y - h * 1.4)); g.lineTo(X(ex + s * w * 1.1), Y(y - 0.007)); g.quadraticCurveTo(X(ex), Y(y - h * 1.15), X(ex - s * w * 1.1), Y(y - 0.006)); g.fill();
        g.strokeStyle = line; g.lineCap = 'round'; g.lineWidth = 2.6 * lw;
        g.beginPath(); g.moveTo(X(ex - s * w * 1.15), Y(y + 0.0015)); g.quadraticCurveTo(X(ex), Y(y + h * 1.22), X(ex + s * w * 1.2), Y(y + 0.005)); g.lineTo(X(ex + s * w * 1.45), Y(y + 0.008)); g.stroke();
        g.lineWidth = 0.9; quad(ex - s * w * 0.8, y - h * 0.68, ex + s * 0.002, y - h * 1.12, ex + s * w * 1.05, y - h * 0.38); g.stroke();
        g.restore();
      }
      // the brows, hair by hair (or in one stroke for the painted styles): sword-blade, fine and arched, or a demon's
      const bw = { pili: 0.8, wood: 1.4, opera: 1.2, anime: 0.8, film: 1.3, drama: 1.0 }[style] || 1;
      const brow = anime && E.brow ? E.brow : F.brow;
      const B = brow === 'thick' ? [[0.012, 0.016], [0.033, 0.0235], [0.058, 0.026], 3.6] : brow === 'fine' ? [[0.015, 0.02], [0.033, 0.029], [0.053, 0.022], 1.6] : brow === 'demon' ? [[0.013, 0.014], [0.036, 0.024], [0.062, 0.042], 3.0] : [[0.014, 0.017], [0.034, 0.025], [0.058, 0.034], 2.6];
      const pt = (t) => { const [a, b, c] = B; return [s * ((1 - t) ** 2 * a[0] + 2 * t * (1 - t) * b[0] + t * t * c[0]), (1 - t) ** 2 * a[1] + 2 * t * (1 - t) * b[1] + t * t * c[1]]; };
      g.strokeStyle = F.browColor || (style === 'film' ? '#3a2418' : '#100604'); g.lineCap = 'round';
      const hairs = style === 'pili' || style === 'film' || style === 'opera' || style === 'drama';
      for (let k = 0; k < (hairs ? 40 : 24); k++) {
        const t = k / (hairs ? 39 : 23), a = pt(t), b = pt(Math.min(1, t + (hairs ? 0.08 : 0.05)));
        const thick = B[3] * bw * (hairs ? 0.45 * Math.sin(Math.PI * Math.min(1, 0.15 + t * 1.2)) + 0.25 : (1 - 0.6 * t) * (0.45 + 0.55 * Math.min(1, t * 4)));
        g.lineWidth = Math.max(0.3, thick); g.beginPath(); g.moveTo(X(a[0]), Y(a[1] - (hairs ? 0.0012 * (1 - t) : 0))); g.lineTo(X(b[0]), Y(b[1] + (hairs ? 0.0008 : 0))); g.stroke();
      }
    }
    // the nose: a little shade beside the bridge, the nostrils
    if (anime && E.nose === 'line') { g.strokeStyle = 'rgba(170,95,85,0.55)'; g.lineWidth = 0.8; quad(-0.003, -0.025, -0.001, -0.036, -0.004, -0.043); g.stroke(); }
    else if (anime) { g.fillStyle = 'rgba(180,100,90,0.5)'; g.beginPath(); g.ellipse(X(-0.002), Y(-0.042), L(0.002), L(0.001), 0, 0, Math.PI * 2); g.fill(); }
    else { soft(-0.008, -0.02, 0.003, 0.014, 'rgba(150,80,70,0.18)'); for (const s of [-1, 1]) soft(s * 0.0065, -0.047, 0.0028, 0.0016, 'rgba(80,25,25,0.75)', s * 0.4); }
    // the mouth: the lips in their colour, the line between them darker, a gleam on the lower lip
    const lip = F.lip || '#b42828', mw = 0.022 * (p.mouthW || 1) * (F.male ? 1.08 : 1);
    if (anime) {
      const m = E.mouth || 'line', mw2 = 0.009 * (p.mouthW || 1) * (m === 'small' ? 0.6 : 1);
      g.strokeStyle = 'rgba(120,40,40,0.8)'; g.lineWidth = 1.2;
      if (m === 'smile') { quad(-mw2 * 1.1, -0.068, 0, -0.0735, mw2 * 1.1, -0.068); g.stroke(); }
      else { quad(-mw2, -0.07, 0, -0.072, mw2, -0.07); g.stroke(); }
      if (F.lip && F.fem) { g.fillStyle = rgba(F.lip, 0.35); g.beginPath(); g.ellipse(X(0), Y(-0.0735), L(mw2 * 0.6), L(0.0018), 0, 0, Math.PI * 2); g.fill(); }
    }
    else {
      const k = style === 'film' ? 0.55 : style === 'drama' && F.male ? 0.5 : 1;
      const gr = g.createLinearGradient(0, Y(-0.06), 0, Y(-0.082)); gr.addColorStop(0, rgba(lip, 0.85 * k)); gr.addColorStop(0.45, rgba(lip, 1 * k)); gr.addColorStop(1, rgba(lip, 0.7 * k));
      g.fillStyle = gr; g.beginPath(); g.moveTo(X(-mw), Y(-0.0705));
      g.bezierCurveTo(X(-mw * 0.6), Y(-0.067), X(-mw * 0.35), Y(-0.0625), X(0), Y(-0.0645));
      g.bezierCurveTo(X(mw * 0.35), Y(-0.0625), X(mw * 0.6), Y(-0.067), X(mw), Y(-0.0705));
      g.bezierCurveTo(X(mw * 0.6), Y(-0.08), X(-mw * 0.6), Y(-0.08), X(-mw), Y(-0.0705)); g.fill();
      g.strokeStyle = 'rgba(60,10,10,0.8)'; g.lineWidth = 0.9; quad(-mw, -0.0705, 0, -0.0718, mw, -0.0705); g.stroke();
      soft(0.003, -0.0755, 0.004, 0.0015, 'rgba(255,255,255,0.3)');
    }
    if (F.fangs) { g.fillStyle = '#fff8ee'; for (const s of [-1, 1]) { path([[s * 0.006, -0.071], [s * 0.0075, -0.0785], [s * 0.009, -0.071]], true); g.fill(); } }
    // a mark on the brow: a lotus, a flame, a jewel-drop
    if (F.mark) {
      g.fillStyle = F.markColor || '#c81828'; const my = 0.048;
      if (F.mark === 'lotus') for (const a of [-0.5, 0, 0.5]) { g.save(); g.translate(X(0), Y(my - 0.004)); g.rotate(a); g.beginPath(); g.ellipse(0, -L(0.006), L(0.0026), L(0.0068), 0, 0, Math.PI * 2); g.fill(); g.restore(); }
      else if (F.mark === 'drop') { g.beginPath(); g.moveTo(X(0), Y(my + 0.008)); g.quadraticCurveTo(X(0.0045), Y(my - 0.002), X(0), Y(my - 0.007)); g.quadraticCurveTo(X(-0.0045), Y(my - 0.002), X(0), Y(my + 0.008)); g.fill(); }
      else { g.beginPath(); g.moveTo(X(0), Y(my + 0.01)); g.quadraticCurveTo(X(0.006), Y(my), X(0.0015), Y(my - 0.009)); g.quadraticCurveTo(X(-0.004), Y(my - 0.002), X(0), Y(my + 0.01)); g.fill(); }
    }
    if (style === 'wood') { // varnish, and fine cracks in it
      g.fillStyle = 'rgba(200,150,60,0.1)'; g.fillRect(0, 0, 256, 256);
      g.strokeStyle = 'rgba(90,60,30,0.16)'; g.lineWidth = 0.4; let sd = 7; const R = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
      for (let k = 0; k < 120; k++) { let x = 20 + R() * 216, y = 20 + R() * 216; g.beginPath(); g.moveTo(x, y); for (let j = 0; j < 4; j++) { x += (R() - 0.5) * 10; y += (R() - 0.5) * 10; g.lineTo(x, y); } g.stroke(); }
    }
    g.fillStyle = base; g.fillRect(248, 248, 8, 8); // the corner the back of the head reads
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
  const style = styleOf(spec), p00 = P[style], fem = spec.face?.fem, male = spec.face?.male;
  // a man's face: a heavier brow, a stronger nose, a wider jaw, a squarer chin
  const p0 = male && p00.sculpt ? { ...p00, brow: (p00.brow ?? 1) * 1.5, nose: (p00.nose ?? 1) * 1.08, jawW: (p00.jawW ?? 1) * 1.06, chin: (p00.chin ?? 1) * 1.35, chinPoint: (p00.chinPoint ?? 1) * 0.85, socket: (p00.socket ?? 1) * 1.15, eyeK: (p00.eyeK ?? 1) * 0.96 } : p00;
  const pS = p0.sculpt && (spec.faceShape || spec.lod) ? { ...p0, ...(spec.faceShape || {}), lod: !!spec.lod } : p0;
  const p = fem && pS.sculpt ? { ...pS, nose: (pS.nose ?? 1) * 0.82, brow: (pS.brow ?? 1) * 0.4, jawW: (pS.jawW ?? 1) * 0.9, chin: (pS.chin ?? 1) * 0.7, chinPoint: (pS.chinPoint ?? 1) * 1.05, mouthW: (pS.mouthW ?? 1) * 0.9, eyeK: (pS.eyeK ?? 1) * 1.05 } : pS;
  const face = p.sculpt ? makeUp(spec, style, p) : paintOld(spec, style);
  const skinCol = skinOf(spec, style);
  const toonM = (o) => new THREE.MeshToonMaterial({ gradientMap: TOON, ...o });
  const mk = (o) => {
    if (p.skin === 'cel') return new THREE.MeshToonMaterial({ gradientMap: CEL, emissive: '#ffffff', emissiveIntensity: 0.22, ...o, ...(o.map ? { emissiveMap: o.map } : { emissive: o.color }) });
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
  const skin = mk({ color: skinCol }), faceM = mk({ map: face });
  if (p.sculpt && p.skin !== 'cel' && p.skin !== 'lacquer') { // skin glows a little from within: lift it to sit with the silk beside it
    faceM.emissive = new THREE.Color('#ffffff'); faceM.emissiveMap = face; faceM.emissiveIntensity = 0.2;
    skin.emissive = new THREE.Color(skinCol); skin.emissiveIntensity = 0.2;
  }
  return { style, p, skin, face: faceM, hair };
}

export function addHead(head, spec, look, mesh) {
  const { p, style } = look, F = spec.face || {};
  if (!p.sculpt) { // as it was: a ball with a face painted on, a cap of hair over it
    mesh(head, new THREE.SphereGeometry(R0, 32, 20), look.face, 0, 0.14, 0).scale.set(0.95, 1.15, 1.0);
    mesh(head, new THREE.SphereGeometry(0.143, 24, 14, Math.PI * 0.62, Math.PI * 1.76, 0, Math.PI * 0.62), look.hair, 0, 0.15, -0.004).scale.set(0.97, 1.13, 1.04);
    for (const s of [-1, 1]) mesh(head, new THREE.SphereGeometry(0.03, 8, 6), look.skin, s * 0.128, 0.13, -0.005).scale.set(0.4, 1, 0.7);
    return;
  }
  look.face.map.wrapS = look.face.map.wrapT = THREE.ClampToEdgeWrapping;
  const skull = mesh(head, sculptGeo(p), look.face, 0, 0.14, 0);
  const hair = spec.hair?.none ? null : mesh(head, hairGeo(p), look.hair, 0, 0.14, 0);
  if (p.outline) for (const m of [skull, hair].filter(Boolean)) { const o = new THREE.Mesh(m.geometry, new THREE.MeshBasicMaterial({ color: '#1a0c0c', side: THREE.BackSide })); o.scale.setScalar(1.03); m.add(o); }
  mesh(head, new THREE.CylinderGeometry(0.046, 0.056, 0.13, 20, 1, true), look.skin, 0, 0.035, -0.014); // the neck, up under the jaw
  for (const s of [-1, 1]) { // the ears
    const ear = mesh(head, new THREE.SphereGeometry(1, 16, 12), look.skin, s * 0.083, 0.125, -0.017, 0, s * 0.35, s * 0.1); ear.scale.set(0.006, 0.027, 0.016);
  }
  // the mouth: dark inside, opened by the voice (look.mouth(k), k from 0 shut to 1 wide)
  { const lowY = p.lowY || 1, my = -0.0712 * lowY, mz = faceZ(0, my, p) + 0.0022, mw = 0.0105 * (p.mouthW || 1) * (spec.face?.male ? 1.08 : 1);
    const inner = new THREE.MeshBasicMaterial({ color: '#3a0c10', transparent: true, depthWrite: false, opacity: 0.95 });
    const m = new THREE.Mesh(new THREE.CircleGeometry(1, 20), inner); m.position.set(0, 0.14 + my, mz); m.scale.set(mw, 0.0001, 1); m.renderOrder = 2; head.add(m);
    const teeth = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.35), new THREE.MeshBasicMaterial({ color: '#f4eee6', transparent: true, depthWrite: false })); teeth.position.set(0, 0.62, 0.0005); m.add(teeth);
    look.mouth = (k) => { const o = Math.max(0, Math.min(1, k)); m.visible = o > 0.03; m.scale.set(mw * (1 - 0.25 * o), 0.0001 + 0.0068 * o, 1); }; }
  if (p.eyes !== 'glass') return;
  // glass eyes in their sockets, an upper and a lower lid over each, the upper one lined dark at its edge
  const eyeM = new THREE.MeshPhysicalMaterial({ map: irisTex(F), roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.03 });
  const lidTex = canvasTex(8, 64, (g) => { const gr = g.createLinearGradient(0, 0, 0, 64); gr.addColorStop(0, '#fff'); gr.addColorStop(0.8, '#fff'); gr.addColorStop(0.86, F.line || '#1a0a08'); gr.addColorStop(1, F.line || '#0a0404'); g.fillStyle = gr; g.fillRect(0, 0, 8, 64); });
  const lidCol = F.paint === 'demon' ? '#6a1018' : style === 'opera' ? '#e86a88' : F.eyeshadow ? '#e8a8b0' : look.skin.color.getStyle();
  const lidM = look.skin.clone(); lidM.map = lidTex; lidM.color = new THREE.Color(lidCol); lidM.side = THREE.DoubleSide;
  const lowM = look.skin.clone(); lowM.color = new THREE.Color(lidCol).lerp(new THREE.Color(look.skin.color), 0.6); lowM.side = THREE.DoubleSide;
  for (const s of [-1, 1]) {
    const zs = faceZ(s * EYE_X, EYE_Y, p), er = 0.0122 * (p.eyeK || 1);
    const eye = new THREE.Group(); eye.position.set(s * EYE_X, 0.14 + EYE_Y, zs + 0.0075 * (p.eyeK || 1) - er); eye.rotation.set(0, s * 0.04, 0); head.add(eye);
    mesh(eye, new THREE.SphereGeometry(er, 32, 20), eyeM, 0, 0, 0); // the iris looks out along +z
    const tilt = s * p.lidTilt; // the outer corners lift (phoenix eyes)
    const up = mesh(eye, new THREE.SphereGeometry(er * 1.06, 32, 12, 0, Math.PI * 2, 0, Math.PI * 0.4), lidM, 0, 0, 0); up.rotation.set(-0.08, 0, -tilt);
    const lo = mesh(eye, new THREE.SphereGeometry(er * 1.04, 32, 8, 0, Math.PI * 2, Math.PI * 0.64, Math.PI * 0.36), lowM, 0, 0, 0); lo.rotation.set(-0.1, 0, -tilt * 0.6);
  }
}
