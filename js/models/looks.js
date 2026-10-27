// The character creator's parts: 50 face shapes and 20 builds, any face on any build (creator.html).
// A face is one of 10 outlines (how the head is shaped: width, the length of the lower face, the jaw, the chin, the
// cheeks) with one of 5 kinds of eyes (painted, anime style: their width, height, slant, iris, lashes). The nose, the
// mouth and the brows vary with the pair, so no two of the 50 are alike.
// A build is one of 4 heights with one of 5 frames (shoulders, waist, hips, girth, arms, the head's size).
//   faceOf(n) -> { n, zh, en, shape: {...head params}, eye: {...paint params} }   n = 1..50
//   bodyOf(n) -> { n, zh, en, body: {...puppet params}, scale }                    n = 1..20

export const OUTLINES = [
  { zh: '鵝蛋臉', en: 'Oval', p: {} },
  { zh: '圓臉', en: 'Round', p: { wid: 1.06, lowY: 0.9, jawW: 1.22, chinPoint: 0.7, chin: 0.5, cheek: 1.6 } },
  { zh: '瓜子臉', en: 'Heart', p: { wid: 1.02, lowY: 1.0, jawW: 0.84, chinPoint: 1.35, chin: 0.9, cheek: 0.8 } },
  { zh: '方臉', en: 'Square', p: { wid: 1.05, lowY: 1.0, jawW: 1.3, chinPoint: 0.62, chin: 1.4, jawSq: 1 } },
  { zh: '長臉', en: 'Long', p: { wid: 0.94, lowY: 1.13, jawW: 0.96, chinPoint: 1.0, chin: 1.0 } },
  { zh: '菱形臉', en: 'Diamond', p: { wid: 1.0, lowY: 1.02, jawW: 0.86, chinPoint: 1.2, chin: 1.0, cheek: 1.9, temple: 1 } },
  { zh: '娃娃臉', en: 'Baby face', p: { wid: 1.08, lowY: 0.82, jawW: 1.12, chinPoint: 0.8, chin: 0.4, cheek: 1.4 } },
  { zh: '清瘦臉', en: 'Lean', p: { wid: 0.93, lowY: 1.06, jawW: 0.95, chinPoint: 1.05, chin: 1.1, cheek: 0.2, hollow: 1 } },
  { zh: '寬臉', en: 'Broad', p: { wid: 1.12, lowY: 0.95, jawW: 1.15, chinPoint: 0.85, chin: 1.0, cheek: 1.2 } },
  { zh: '尖下巴', en: 'Pointed chin', p: { wid: 0.98, lowY: 1.05, jawW: 0.8, chinPoint: 1.6, chin: 1.25 } },
];
export const EYES = [
  { zh: '大圓眼', en: 'Big round eyes', e: { w: 0.0185, h: 0.019, tilt: 0, iris: 1.12, lash: 1.0 } },
  { zh: '鳳眼', en: 'Phoenix eyes', e: { w: 0.0195, h: 0.012, tilt: 0.26, iris: 0.86, lash: 1.35 } },
  { zh: '細長眼', en: 'Long narrow eyes', e: { w: 0.021, h: 0.009, tilt: 0.06, iris: 0.74, lash: 1.1 } },
  { zh: '下垂眼', en: 'Drooping eyes', e: { w: 0.018, h: 0.015, tilt: -0.2, iris: 1.0, lash: 0.9 } },
  { zh: '銳利眼', en: 'Sharp eyes', e: { w: 0.0165, h: 0.011, tilt: 0.16, iris: 0.7, lash: 1.5, sharp: 1 } },
];
const BROWS = ['fine', 'sword', 'thick', 'fine', 'sword'];
export function faceOf(n) {
  n = Math.max(1, Math.min(50, n | 0));
  const o = OUTLINES[Math.floor((n - 1) / 5)], e = EYES[(n - 1) % 5], k = n * 7919;
  const v = (a, b, s) => a + (b - a) * (((k * s) % 97) / 96); // a steady variation for each face
  return {
    n, zh: `${o.zh}・${e.zh}`, en: `${o.en}, ${e.en.toLowerCase()}`,
    shape: { ...o.p, nose: v(0.22, 0.45, 3), mouthW: v(0.85, 1.15, 5) },
    eye: { ...e.e, gap: v(0.97, 1.05, 11), nose: (k >> 3) % 2 ? 'dot' : 'line', mouth: ['line', 'smile', 'small'][(k >> 5) % 3], brow: BROWS[(n + Math.floor((n - 1) / 5)) % 5] },
  };
}

// L: the length below the waist, T: the torso, S: the shoulders, W: the waist, Hp: the hips (the skirt), G: girth
// (front to back, and arms and sleeves), A: the arms, Hd: the head (bigger for the young), K: the whole height
export const HEIGHTS = [
  { zh: '孩童', en: 'Child', b: { L: 0.62, T: 0.72, A: 0.75, Hd: 1.18 }, k: 0.78 },
  { zh: '嬌小', en: 'Petite', b: { L: 0.86, T: 0.9, A: 0.92, Hd: 1.06 }, k: 0.92 },
  { zh: '中等', en: 'Average', b: {}, k: 1.0 },
  { zh: '高挑', en: 'Tall', b: { L: 1.12, T: 1.06, A: 1.08, Hd: 0.96 }, k: 1.08 },
];
export const FRAMES = [
  { zh: '纖細', en: 'Slender', b: { S: 0.82, W: 0.78, Hp: 0.86, G: 0.84 } },
  { zh: '勻稱', en: 'Lean', b: { S: 0.92, W: 0.9, Hp: 0.94, G: 0.93 } },
  { zh: '標準', en: 'Medium', b: {} },
  { zh: '健壯', en: 'Athletic', b: { S: 1.18, W: 0.98, Hp: 1.0, G: 1.1, A: 1.03 } },
  { zh: '魁梧', en: 'Heavy', b: { S: 1.3, W: 1.32, Hp: 1.18, G: 1.3 } },
];
export function bodyOf(n) {
  n = Math.max(1, Math.min(20, n | 0));
  const h = HEIGHTS[Math.floor((n - 1) / 5)], f = FRAMES[(n - 1) % 5];
  const b = { L: 1, T: 1, S: 1, W: 1, Hp: 1, G: 1, A: 1, Hd: 1 };
  for (const src of [h.b, f.b]) for (const [key, val] of Object.entries(src)) b[key] *= val;
  return { n, zh: `${h.zh}・${f.zh}`, en: `${h.en}, ${f.en.toLowerCase()}`, body: b, scale: h.k };
}
