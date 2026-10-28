// Keeping the subject in view: before a shot is used, the line from what it looks at to the camera is checked against
// the set (anything a set marked solid: walls, pillars, lanterns, trees, bamboo) and against the bystanders (anyone
// not the subject, and not standing right by the camera, as the listener in an over-the-shoulder shot does). If it is
// blocked, the camera swings round the subject, a little and then more, or comes in closer, to the first place that
// sees it clearly. The choice is made once for each shot, at the moment it starts, so the shot holds steady.
import * as THREE from '../../lib/three.module.min.js';

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
export function createClearShot(scene, rt, cam) {
  let solids = null;
  const ray = new THREE.Raycaster(), memo = new Map();
  const getSolids = () => solids || (solids = (() => { const a = []; scene.traverse((o) => { if ((o.isMesh || o.isInstancedMesh) && o.userData.solid) a.push(o); }); return a; })());
  // does anything stand between p (the subject) and q (the camera)?
  function blocked(p, q, t) {
    const d = q.clone().sub(p), L = d.length(); if (L < 0.4) return false; d.divideScalar(L);
    const side = V(-d.z, 0, d.x).normalize();
    for (const o of [V(), side.clone().multiplyScalar(0.6), side.clone().multiplyScalar(-0.6), V(0, 0.45, 0)]) { // the subject, and either side of it, and above
      const p2 = p.clone().add(o), d2 = q.clone().sub(p2), L2 = d2.length(); ray.set(p2, d2.divideScalar(L2)); ray.far = L2 - 0.25; ray.near = 0.35;
      if (ray.intersectObjects(getSolids(), false).length) return true;
    }
    for (const A of rt.actors) { // the bystanders, as upright capsules
      if (rt.state(A.id, t).hidden) continue;
      const a = rt.pos(A.id, t), base = V(a.x, a.y, a.z);
      const dq = Math.hypot(a.x - q.x, a.z - q.z); if (dq < 0.75 && q.y < a.y + 2.0) return true; // never inside someone (or their robe and sleeves)
      if (Math.hypot(a.x - p.x, a.z - p.z) < 0.75 || dq < 1.35) continue;
      for (const hy of [0.6, 1.1, 1.55]) { const c = base.clone().setY(a.y + hy), u = Math.max(0, Math.min(L, c.clone().sub(p).dot(d))); if (p.clone().addScaledVector(d, u).distanceTo(c) < 0.32 && u > 0.4 && u < L - 0.3) return true; }
    }
    return false;
  }
  const move = (pos, look, rot, k) => { const o = pos.clone().sub(look).applyAxisAngle(V(0, 1, 0), rot).multiplyScalar(k); return look.clone().add(o); };
  function choose(i) {
    const s = cam.shots[i], ts = [s.t + 0.05, (s.t + s.t1) / 2].filter((x) => x < s.t1);
    const views = ts.map((t) => ({ t, c: cam.raw(t) }));
    for (const k of [1, 0.8, 0.62]) for (const rot of [0, 0.3, -0.3, 0.6, -0.6, 0.95, -0.95, 1.35, -1.35])
      if (views.every(({ t, c }) => !blocked(c.look, move(c.pos, c.look, rot, k), t))) return { rot, k };
    return { rot: 0, k: 0.5 };
  }
  return {
    at(t) {
      const c = cam.raw(t), i = cam.index(t), s = cam.shots[i];
      if (s.vertigo || s.clear === false) return c;
      if (!memo.has(i)) memo.set(i, choose(i));
      const { rot, k } = memo.get(i); if (!rot && k === 1) return c;
      return { ...c, pos: move(c.pos, c.look, rot, k) };
    },
  };
}
