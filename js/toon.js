// The toon ramp every material in the film shades with: light falls in a few soft bands, like painted wood and silk.
import * as THREE from '../lib/three.module.min.js';
export const TOON = (() => { const d = new Uint8Array([60, 110, 170, 230, 255]); const t = new THREE.DataTexture(d, 5, 1, THREE.RedFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; })();
// the shading of a film: painted bands (the puppet films), or real light on real surfaces (a story with look.real):
// cloth, wood and stone rough, lacquer and metal smoother, the gold metallic
export const LOOK = { real: false };
export function shade(o = {}) {
  if (!LOOK.real) return new THREE.MeshToonMaterial({ gradientMap: TOON, ...o });
  const { gradientMap, ...r } = o; void gradientMap;
  const c = new THREE.Color(r.color ?? '#ffffff'), metal = r.emissive && c.r > c.b * 1.4 && c.g > c.b * 1.1 ? 0.55 : 0; // gold and brass
  return new THREE.MeshStandardMaterial({ roughness: metal ? 0.38 : 0.86, metalness: metal, ...r, emissiveIntensity: r.emissiveIntensity ?? (metal ? 0.15 : 1) });
}
export const toon = (color, o = {}) => shade({ color, ...o });
