// The toon ramp every material in the film shades with: light falls in a few soft bands, like painted wood and silk.
import * as THREE from '../lib/three.module.min.js';
export const TOON = (() => { const d = new Uint8Array([60, 110, 170, 230, 255]); const t = new THREE.DataTexture(d, 5, 1, THREE.RedFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; })();
export const toon = (color, o = {}) => new THREE.MeshToonMaterial({ color, gradientMap: TOON, ...o });
