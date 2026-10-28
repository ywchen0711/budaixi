// The lens of a live-action film: depth of field (the subject sharp, what is nearer and further soft), a little bloom
// on lamps and qi, filmic tone, and a grade — the colours a touch muted, warm in the light and cool in the shade, a
// vignette, a fine grain that moves. For a story with look.real; the puppet films keep their painted look.
import * as THREE from '../lib/three.module.min.js';
import { EffectComposer } from '../lib/addons/EffectComposer.js';
import { RenderPass } from '../lib/addons/RenderPass.js';
import { BokehPass } from '../lib/addons/BokehPass.js';
import { UnrealBloomPass } from '../lib/addons/UnrealBloomPass.js';
import { OutputPass } from '../lib/addons/OutputPass.js';
import { ShaderPass } from '../lib/addons/ShaderPass.js';

const GRADE = {
  uniforms: { tDiffuse: { value: null }, uT: { value: 0 }, uVig: { value: 0.32 }, uGrain: { value: 0.035 }, uSat: { value: 0.86 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `uniform sampler2D tDiffuse; uniform float uT, uVig, uGrain, uSat; varying vec2 vUv;
    float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    void main(){
      vec3 c = texture2D(tDiffuse, vUv).rgb;
      float l = dot(c, vec3(0.299, 0.587, 0.114));
      c = mix(vec3(l), c, uSat);                                   // a little less colour
      c += (vec3(1.02, 0.99, 0.94) - 1.0) * smoothstep(0.35, 1.0, l); // warm highlights
      c += (vec3(0.97, 1.0, 1.05) - 1.0) * (1.0 - smoothstep(0.0, 0.45, l)) * 0.6; // cool shadows
      c = (c - 0.5) * 1.06 + 0.5;                                  // a little more contrast
      vec2 d = vUv - 0.5; c *= 1.0 - uVig * smoothstep(0.25, 0.85, length(d * vec2(1.25, 1.0)));
      c += (h(vUv * vec2(1920.0, 1080.0) + uT) - 0.5) * uGrain;     // the grain
      gl_FragColor = vec4(clamp(c, 0.0, 1.0), 1.0);
    }`,
};

export function createLens(renderer, scene, camera) {
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  const comp = new EffectComposer(renderer);
  comp.addPass(new RenderPass(scene, camera));
  const bokeh = new BokehPass(scene, camera, { focus: 5, aperture: 0.0009, maxblur: 0.009 }); comp.addPass(bokeh);
  const bloom = new UnrealBloomPass(new THREE.Vector2(512, 256), 0.32, 0.45, 0.86); comp.addPass(bloom);
  comp.addPass(new OutputPass());
  const grade = new ShaderPass(GRADE); comp.addPass(grade);
  return {
    setSize: (w, h) => { comp.setPixelRatio(renderer.getPixelRatio()); comp.setSize(w, h); },
    // focus: how far the subject is; the nearer the subject and the longer the lens, the shallower the field
    render(focus, fov, t) {
      bokeh.uniforms.focus.value = focus;
      bokeh.uniforms.aperture.value = 0.00055 * Math.min(2.5, 40 / Math.max(10, fov)) * Math.min(1.6, 4 / Math.max(1.5, focus));
      grade.uniforms.uT.value = (t * 24) % 97;
      comp.render();
    },
  };
}
