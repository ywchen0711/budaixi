// 第一回　月下決 / Part One: Duel Under the Moon. About five minutes.
//
// The curtain of a glove-puppet stage parts on a bamboo forest at night. Yan Feishuang, "Red Silk", flees with the
// Heavenly Sword Manual and fights off four envoys of the Blood Lotus. Their master, Ye Wuji, the Blood Lotus Lord,
// comes down out of the sky and beats her down; as his claw goes up, a crescent of sword energy flies out of the dark
// and Ling Yunxiao, the White-Robed Sword, glides down between them. They fight through the bamboo and up into it;
// Ye blasts himself into the sky, Ling follows, and they finish it on a mountain top over a sea of clouds, under a
// huge moon: the Lord's Ten Thousand Demons against the hero's One Sword of Moonlight. At dawn the narrator closes
// the tale, as every glove-puppet play does: what came of the Blood Lotus, the next part will tell.
//
// In the manner of 布袋戲: a narrator's opening poem; each master recites his entrance poem (出場詩) and his name is
// shown in great calligraphy; techniques are called out by name as they are thrown; the drums and gongs (鑼鼓) mark
// every strike and every pose (亮相); the puppets glide and bob and leap as the puppeteers' hands carry them.
const PI = Math.PI;
const tracks = { yan: [], e1: [], e2: [], e3: [], e4: [], ye: [], ling: [] };
const A = (who, ...acts) => { tracks[who].push(...acts); };
// a blow that lands: the striker's swing, the struck one thrown back (by `knock` = [dx, dz] over `dur`)
function hit(att, def, t, o = {}) {
  A(att, { do: 'blow', t, style: o.style || 'side', arm: o.arm || 'R', result: 'hit', target: def, part: o.part || 'chest', close: false, k: o.k ?? 1, speed: o.speed });
  A(def, { do: 'react', t: t + 0.02, part: o.react || 'body', k: o.k ?? 1 });
  if (o.knock) A(def, { do: 'move', t: t + 0.02, t1: t + (o.dur ?? 0.45), d: o.knock, e: 'out' });
}
// a blow met by the other's weapon
const clash = (att, def, t, o = {}) => A(att, { do: 'blow', t, style: o.style || 'side', arm: o.arm || 'R', result: 'clash', target: def, against: o.against || 'tipR', close: false, k: o.k ?? 1, speed: o.speed, bind: o.bind });
// a quick glide to a place
const dash = (who, t, t1, to, o = {}) => A(who, { do: 'goto', t, t1, to, e: o.e || 'in' });
// a technique called out: the shout, the aura, the drums
const cry = (t, t1, who, zh, en) => ({ t, t1, who, zh, en });

// ---------------------------------------------------------------- ACT I: the bamboo, the flight, four envoys
A('yan', { do: 'hide', t: 0, t1: 14.5 }, { do: 'face', t: 0, t1: 24.5, yaw: PI / 2, blend: 0.5 });
dash('yan', 15.0, 23.6, [0, 0], { e: 'out' });
A('yan', { do: 'p', t: 15, t1: 23.6, set: { lean: 0.25, crouch: 0.15 }, ramp: 0.5 }, { do: 'stance', t: 23.5, t1: 24.3 });
for (const [id, x, z, td] of [['e1', 3.0, 0.4, 21.6], ['e2', -2.6, 2.2, 22.0], ['e3', -2.4, -2.3, 22.4], ['e4', 2.0, -2.6, 22.8]]) {
  A(id, { do: 'hide', t: 0, t1: td - 0.05 }, { do: 'drop', t: td, t1: td + 0.9, from: [x * 1.6, 6, z * 1.6], to: [x, z] }, { do: 'flip', t: td, t1: td + 0.8, dir: 1 });
}
// the fight: one at her front, two from the sides, one from behind, again and again
dash('e1', 29.3, 29.9, [1.05, 0.15]); A('e1', { do: 'blow', t: 30.2, style: 'over', result: 'miss', target: 'yan', close: false });
A('yan', { do: 'spin', t: 29.95, t1: 30.55 }); dash('yan', 29.95, 30.4, [0.15, -0.7], { e: 'ss' });
hit('yan', 'e1', 30.7, { style: 'side', knock: [1.6, 0.4], k: 1.2 });
dash('e2', 31.5, 32.1, [-0.85, 0.45]); dash('e3', 31.6, 32.2, [-0.75, -1.25]);
A('e2', { do: 'blow', t: 32.45, style: 'over', result: 'clash', target: 'e3', against: 'tipR', close: false }, { do: 'face', t: 32.0, t1: 33.0, to: 'e3', blend: 0.2 });
A('e3', { do: 'blow', t: 32.45, style: 'side', result: 'miss', target: 'yan', close: false });
A('yan', { do: 'jump', t: 32.05, t1: 33.2, h: 1.5, d: [-1.9, 0.1], land: 0.6 }, { do: 'flip', t: 32.1, t1: 33.1 });
dash('yan', 33.25, 33.5, [-1.45, -0.95]);
hit('yan', 'e3', 33.55, { style: 'thrust', arm: 'L', knock: [1.2, -0.5], k: 1.1 });
dash('e4', 35.0, 35.6, [-0.6, -2.0]);
clash('e4', 'yan', 35.9, { style: 'side', k: 1.2 });
A('yan', { do: 'palm', t: 36.6, target: 'e4', col: '#ff8ab0', k: 0.9 }, { do: 'qi', t: 36.1, t1: 37.3, k: 0.8 });
A('e4', { do: 'react', t: 36.9, part: 'body', k: 1.6 }, { do: 'move', t: 36.9, t1: 37.6, d: [0.6, -2.6], e: 'out' }, { do: 'jump', t: 36.9, t1: 37.6, h: 0.5, land: 1 });
// the three still standing come again
dash('e1', 38.0, 38.6, [-0.4, -0.2]); clash('e1', 'yan', 38.9, { style: 'over' });
A('yan', { do: 'spin', t: 39.2, t1: 39.9, turns: 2 });
hit('yan', 'e1', 39.95, { style: 'side', knock: [1.4, 0.8], k: 1.3 });
dash('e2', 40.0, 40.7, [-1.4, -0.4]); clash('e2', 'yan', 41.0, { style: 'thrust' });
hit('yan', 'e2', 41.6, { style: 'upper', arm: 'L', knock: [-1.6, 0.6], k: 1.4 });
A('e2', { do: 'fall', t: 41.9, t1: 42.6 }, { do: 'die', t: 41.9 });
dash('e1', 42.4, 43.0, [-1.0, -1.3]); clash('e1', 'yan', 43.3, { style: 'side' });
hit('yan', 'e1', 44.0, { style: 'thrust', knock: [0.6, 1.2], k: 1.4 }); A('e1', { do: 'fall', t: 44.3, t1: 45.0 }, { do: 'die', t: 44.3 });
// the last one: a dagger thrown
A('yan', { do: 'missile', t: 45.6, target: 'e3', at: 45.95, off: [0, 1.1, 0], from: 'handL', model: 'micro', arc: 0.2, side: 0, boom: 0 }, { do: 'arm', side: 'L', keys: [[45.2, 0.3, -0.6, 0], [45.6, -1.6, -0.1, 0], [46.1, -0.8, -0.4, 0]] }, { do: 'disarm', t: 45.62, t1: 52, slot: 'wL', v: [0, 0, 0] });
A('e3', { do: 'react', t: 45.95, part: 'body', k: 1.3 }, { do: 'fall', t: 46.2, t1: 47.0 }, { do: 'die', t: 46.2 });
A('e4', { do: 'fall', t: 47.8, t1: 48.6 }, { do: 'die', t: 47.8 });
for (const id of ['e1', 'e2', 'e3', 'e4']) A(id, { do: 'hide', t: 60, t1: 999 });
A('yan', { do: 'p', t: 47, t1: 52, set: { crouch: 0.2, lean: 0.1 } }, { do: 'lookat', t: 50, t1: 57, to: 'ye' });

// ---------------------------------------------------------------- ACT II: the Blood Lotus Lord
A('ye', { do: 'hide', t: 0, t1: 52.8 }, { do: 'drop', t: 53.0, t1: 57.0, from: [6, 9, 0.5], to: [4.2, 0.3] }, { do: 'qi', t: 52.8, t1: 68.5, k: 0.9 });
A('ye', { do: 'arm', side: 'L', keys: [[57.2, -0.4, -0.9, 0], [58.5, -1.2, -1.6, 0, 0.3], [66, -1.2, -1.6, 0, 0.3]] }, { do: 'arm', side: 'R', keys: [[57.2, -0.2, -0.4, 0], [60, 0.3, -1.4, 0], [66, 0.3, -1.4, 0]] }); // the claw before him, the sabre behind his back
A('yan', { do: 'stance', t: 58, t1: 58.6 });
// Yan goes for him; he hardly moves
dash('yan', 75.4, 76.0, [3.0, 0.2]); A('yan', { do: 'face', t: 75, t1: 125, to: 'ye', blend: 0.2 });
clash('yan', 'ye', 76.2, { style: 'side', against: 'tipR' }); clash('yan', 'ye', 76.9, { style: 'thrust', arm: 'L', against: 'tipR' }); clash('yan', 'ye', 77.6, { style: 'over', against: 'tipL' });
A('yan', { do: 'spin', t: 78.0, t1: 78.6 }); clash('yan', 'ye', 78.8, { style: 'side', against: 'tipR', k: 1.2 });
hit('ye', 'yan', 79.6, { style: 'side', knock: [-1.2, -0.4], k: 1.0 });
dash('yan', 81.2, 81.8, [2.9, -0.5]); clash('yan', 'ye', 82.1, { style: 'upper', arm: 'L', against: 'tipL' }); clash('ye', 'yan', 82.8, { style: 'over', against: 'tipR', k: 1.2 });
// the Blood Lotus Palm
A('ye', { do: 'qi', t: 84.5, t1: 87.5, k: 1.4 }, { do: 'palm', t: 86.2, target: 'yan', col: '#ff2a48', k: 1.3, both: false });
A('yan', { do: 'react', t: 86.5, part: 'body', k: 1.8, decay: 1.6 }, { do: 'move', t: 86.5, t1: 87.5, d: [-3.4, -1.0], e: 'out' }, { do: 'jump', t: 86.5, t1: 87.5, h: 0.8, land: 1.2 }, { do: 'kneel', t: 87.6, t1: 103, ramp: 0.4 });
A('ye', { do: 'walk', t: 90, t1: 95.5, v: [-0.42, -0.14], stop: 0.6 }, { do: 'p', t: 90, t1: 98, set: { sway: 0.5 } });
A('ye', { do: 'arm', side: 'L', keys: [[96, -1.0, -1.2, 0], [97.6, -2.6, -0.5, 0.4], [98.2, -2.7, -0.4, 0.4]], blendOut: 0.4 });
// a crescent out of the dark: the White-Robed Sword
A('ling', { do: 'hide', t: 0, t1: 98.0 }, { do: 'wave', t: 98.2, to: [0.9, 0.3, -0.7], at: 98.75, col: '#a8e0ff', k: 1.2 });
A('ye', { do: 'jump', t: 98.8, t1: 99.8, h: 1.2, d: [2.4, 0.6], land: 0.6 }, { do: 'react', t: 98.8, part: 'head', k: 0.5 });
A('ling', { do: 'drop', t: 100.0, t1: 104.0, from: [-6, 7.5, 1], to: [-0.6, 0.6] }, { do: 'spin', t: 100.0, t1: 103.8, turns: 2, e: 'ss' }, { do: 'qi', t: 100, t1: 104.5, k: 0.7 });
A('ling', { do: 'arm', side: 'R', keys: [[104.2, -0.4, -0.5, 0.2], [105, 0.5, -0.9, 1.2], [114, 0.5, -0.9, 1.2]] }, { do: 'arm', side: 'L', keys: [[104.2, -0.3, -0.5, 0], [105, -0.6, -1.95, 0], [114, -0.6, -1.95, 0]] }); // the sword behind him, two fingers before his chest: the pose
A('ling', { do: 'face', t: 100, t1: 300, to: 'ye', blend: 0.3 });
A('ling', { do: 'lookat', t: 123.6, t1: 125.6, to: 'yan' });

// ---------------------------------------------------------------- ACT III: sword against claw, in the bamboo
A('ling', { do: 'stance', t: 125, t1: 125.6 }); A('ye', { do: 'stance', t: 125, t1: 125.6 });
dash('ling', 128.6, 129.2, [0.6, 0.4]); dash('ye', 128.6, 129.2, [1.75, 0.5]);
clash('ling', 'ye', 129.5, { style: 'side', k: 1.2 }); clash('ye', 'ling', 130.3, { style: 'over', against: 'tipR', k: 1.1 });
clash('ling', 'ye', 131.0, { style: 'thrust', speed: 0.8 });
A('ling', { do: 'spin', t: 131.4, t1: 132.0 }); dash('ling', 131.4, 131.9, [0.9, -0.6], { e: 'ss' });
hit('ling', 'ye', 132.1, { style: 'side', part: 'shoulderL', react: 'armL', k: 0.8, knock: [0.4, 0.3] });
// the quick exchange: eight blows in four seconds
const fast = [[133.4, 'ye', 'over'], [133.9, 'ling', 'side'], [134.35, 'ye', 'thrust'], [134.8, 'ling', 'upper'], [135.3, 'ye', 'side'], [135.75, 'ling', 'over'], [136.25, 'ye', 'side'], [136.7, 'ling', 'thrust']];
for (const [t, who, st] of fast) clash(who, who === 'ye' ? 'ling' : 'ye', t, { style: st, against: 'tipR', speed: 0.75 });
A('ling', { do: 'p', t: 133, t1: 137.2, set: { crouch: 0.2 } }); A('ye', { do: 'p', t: 133, t1: 137.2, set: { crouch: 0.15 } });
// stray sword energy cuts the bamboo round them
// up into the canopy: blows in the air, apart again
A('ling', { do: 'jump', t: 139.6, t1: 141.9, h: 3.4, d: [0.4, 0.2], land: 0.7 }, { do: 'flip', t: 141.0, t1: 141.8 });
A('ye', { do: 'jump', t: 139.7, t1: 142.0, h: 3.4, d: [-0.2, -0.1], land: 0.7 });
clash('ling', 'ye', 140.5, { style: 'side', k: 1.2 }); clash('ye', 'ling', 141.0, { style: 'over', against: 'tipR', k: 1.2 });
dash('ling', 142.2, 142.9, [-2.6, 0.5], { e: 'out' }); dash('ye', 142.2, 142.9, [4.6, -0.4], { e: 'out' });
// two crescents meet in the middle
A('ye', { do: 'blow', t: 145.9, style: 'side', result: 'miss', target: 'ling', close: false }, { do: 'wave', t: 146.0, to: [1.0, 1.1, 0.0], at: 146.8, col: '#ff3050', k: 1.3, burst: false });
A('ling', { do: 'blow', t: 146.1, style: 'side', result: 'miss', target: 'ye', close: false }, { do: 'wave', t: 146.2, to: [1.0, 1.1, 0.0], at: 146.8, col: '#a8e0ff', k: 1.3, burst: false });
// the Nine Netherworlds Palm
A('ye', { do: 'qi', t: 150, t1: 157.6, k: 1.6 }, { do: 'p', t: 150, t1: 156.8, set: { crouch: 0.3, lean: -0.1 }, ramp: 1 }, { do: 'palm', t: 157.2, target: 'ling', col: '#ff2040', k: 1.6, both: false });
A('ling', { do: 'arm', side: 'R', keys: [[156.6, -0.4, -0.5, 0], [157.1, -1.3, -1.1, 0.8], [157.6, -1.3, -1.1, 0.8]], blendOut: 0.4 }, { do: 'react', t: 157.5, part: 'body', k: 1.5, decay: 1.8 });
A('ling', { do: 'move', t: 157.5, t1: 158.4, d: [-2.4, -0.4], e: 'out' }, { do: 'kneel', t: 158.5, t1: 161.2, ramp: 0.35 });
// Frost Sky, One Sword: through him, and the claw arm comes off
A('ling', { do: 'qi', t: 161, t1: 166.8, k: 1.5 }, { do: 'p', t: 163.2, t1: 165.4, set: { crouch: 0.35, twist: 0.5 }, ramp: 0.6 });
A('ling', { do: 'goto', t: 165.4, t1: 166.3, to: [4.2, 0.9], e: 'in' });
hit('ling', 'ye', 165.95, { style: 'side', part: 'shoulderL', react: 'armL', k: 1.6 });
A('ye', { do: 'sever', t: 166.05, part: 'armL', v: [0.8, 3.2, -1.6] }, { do: 'p', t: 166, t1: 182, set: { crouch: 0.15, sway: 0.4 } });
A('ling', { do: 'arm', side: 'R', keys: [[166.3, -1.45, -0.15, 1.2], [168.6, -1.45, -0.15, 1.2]], blendOut: 0.6 });
A('ye', { do: 'qi', t: 167.6, t1: 181, k: 2.0 });
A('ye', { do: 'jump', t: 176.2, t1: 180, h: 18, d: [0, 0], land: 0 }, { do: 'hide', t: 178.5, t1: 182.8 });
A('ling', { do: 'jump', t: 177.0, t1: 180.6, h: 16, d: [0, 0], land: 0 }, { do: 'hide', t: 179.0, t1: 185.0 });

// ---------------------------------------------------------------- ACT IV: the mountain top, the moon
// (both come down out of the sky on the plateau at x = 300)
A('ye', { do: 'goto', t: 181.0, t1: 181.1, to: [304, 0.3] }, { do: 'drop', t: 182.9, t1: 185.0, from: [304, 12, 0.3], to: [304, 0.3] }, { do: 'qi', t: 182.8, t1: 300, k: 0.8 });
A('ling', { do: 'goto', t: 181.0, t1: 181.1, to: [296, 0] }, { do: 'drop', t: 185.0, t1: 187.2, from: [296, 10, 0], to: [296, 0] }, { do: 'spin', t: 185.0, t1: 187.0, turns: 1 });
A('ling', { do: 'arm', side: 'R', keys: [[187.4, -0.4, -0.5, 0.2], [188.6, -0.75, -0.85, 0.65], [196, -0.75, -0.85, 0.65]] });
dash('ling', 196.5, 197.4, [300.6, 0.1]); dash('ye', 196.6, 197.4, [301.8, 0.2]);
const cliffBlows = [[197.7, 'ling', 'side'], [198.4, 'ye', 'over'], [199.1, 'ling', 'thrust'], [199.9, 'ye', 'side'], [200.6, 'ling', 'over'], [201.3, 'ye', 'upper'], [202.2, 'ling', 'side'], [203.0, 'ye', 'thrust']];
for (const [t, who, st] of cliffBlows) clash(who, who === 'ye' ? 'ling' : 'ye', t, { style: st, against: 'tipR', k: 1.1 });
hit('ling', 'ye', 204.0, { style: 'upper', part: 'chest', k: 1.1, knock: [1.3, -0.3] });
A('ling', { do: 'jump', t: 205.0, t1: 206.4, h: 1.6, d: [-1.8, 0], land: 0.6 }, { do: 'flip', t: 205.1, t1: 206.3 });
// Ten Thousand Demons: six red crescents
A('ye', { do: 'qi', t: 210.5, t1: 219.8, k: 2.4 }, { do: 'p', t: 210.5, t1: 216.8, set: { crouch: 0.35, lean: -0.15 }, ramp: 1.2 });
for (let k = 0; k < 6; k++) {
  const t = 217.4 + k * 0.34; A('ye', { do: 'blow', t, style: k % 2 ? 'over' : 'side', result: 'miss', target: 'ling', close: false, speed: 0.6 }, { do: 'wave', t: t + 0.02, target: 'ling', at: t + 0.42, off: [0.5, 0.1, 0], col: '#ff2a48', k: 1.1, tilt: k % 2 ? 1.2 : 0, burst: true });
  if (k < 5) A('ling', { do: 'blow', t: t + 0.38, style: k % 2 ? 'side' : 'upper', result: 'miss', target: 'ye', close: false, speed: 0.6 });
}
A('ling', { do: 'react', t: 219.5, part: 'body', k: 1.6 }, { do: 'move', t: 219.5, t1: 220.6, d: [-3.4, 1.0], e: 'out' }, { do: 'p', t: 220.6, t1: 223.6, set: { lean: -0.25, roll: 0.15 }, shape: 'bump' });
// Red Silk comes up the mountain; two daggers
A('yan', { do: 'goto', t: 180, t1: 180.1, to: [291, 5.2] }, { do: 'hide', t: 180, t1: 222.4 }, { do: 'drop', t: 222.5, t1: 223.6, from: [291, 4, 5.2], to: [294.5, 3.4] }, { do: 'face', t: 222.5, t1: 300, to: 'ye', blend: 0.3 });
A('yan', { do: 'missile', t: 224.0, target: 'ye', at: 224.5, off: [0, 1.2, 0.1], from: 'handR', model: 'micro', arc: 0.3, side: 0.2, boom: 0 }, { do: 'missile', t: 224.15, target: 'ye', at: 224.65, off: [0, 1.0, -0.1], from: 'handL', model: 'micro', arc: 0.3, side: -0.2, boom: 0 });
A('yan', { do: 'arm', side: 'R', keys: [[223.7, 0.3, -0.6, 0], [224.0, -1.6, -0.1, 0], [224.6, -0.6, -0.5, 0]] }, { do: 'arm', side: 'L', keys: [[223.8, 0.3, -0.6, 0], [224.15, -1.6, -0.1, 0], [224.7, -0.6, -0.5, 0]] });
A('ye', { do: 'react', t: 224.55, part: 'body', k: 1.1 }, { do: 'face', t: 224.6, t1: 228.4, to: 'yan', blend: 0.25 });
// One Sword, Moonlight: up towards the moon, and down
A('ling', { do: 'qi', t: 227.0, t1: 236.5, k: 2.2, col: '#e8f4ff' });
A('ling', { do: 'jump', t: 229.0, t1: 233.2, h: 5.5, d: [5.2, 0.2], land: 1.0, recover: 0.8 }, { do: 'flip', t: 229.2, t1: 230.8 });
A('ling', { do: 'arm', side: 'R', keys: [[229.4, -2.0, -0.4, 0.4], [230.6, -2.95, -0.2, 0.2], [232.6, -2.95, -0.2, 0.2], [233.0, -0.8, -0.1, 0.6], [240, -0.8, -0.1, 0.6]], blendOut: 1.0 });
A('ling', { do: 'wave', t: 232.85, target: 'ye', at: 233.25, off: [0, 0.4, 0], col: '#f0f8ff', k: 2.6, tilt: 1.57 });
A('ye', { do: 'react', t: 233.3, part: 'head', k: 1.6 }, { do: 'p', t: 233.3, t1: 242, set: { lean: -0.2 }, ramp: 0.5 }, { do: 'look', t: 233.3, w: 0 });
A('ling', { do: 'p', t: 233.2, t1: 240.4, set: { crouch: 0.55, lean: 0.25 }, ramp: 0.4 });
// the pause; then he goes over the edge, down into the clouds
A('ye', { do: 'fall', t: 242.2, t1: 243.0 }, { do: 'goto', t: 242.4, t1: 244.0, to: [310.5, 0.6], e: 'in' }, { do: 'plunge', t: 243.5, t1: 246.2, dy: -26 }, { do: 'hide', t: 246.5, t1: 999 });
// afterwards: the sword put away, the dawn
A('ling', { do: 'stance', t: 246, t1: 247, k: 0.2 }, { do: 'face', t: 247.5, t1: 300, to: 'yan', blend: 0.8 });
A('ling', { do: 'arm', side: 'R', keys: [[247.6, -0.8, -0.1, 0.6], [248.6, 0.4, -1.2, 1.4], [262, 0.4, -1.2, 1.4]] });
A('yan', { do: 'goto', t: 247, t1: 249.5, to: [298, 1.6] }, { do: 'face', t: 247.5, t1: 300, to: 'ling', blend: 0.8 });
A('ling', { do: 'face', t: 263, t1: 300, yaw: -PI / 2 + 0.3, blend: 1.4 }); A('yan', { do: 'face', t: 263.5, t1: 300, yaw: -PI / 2 + 0.2, blend: 1.4 });

export const T = { open: 2, yanRun: 15, envoys: 21.6, yeComes: 53, palm1: 86.2, wave1: 98.2, lingComes: 100, duel: 128.6, waves: 146.8, palm2: 157.2, frost: 165.95, sky: 176.2, cliff: 182.9, demons: 217.4, daggers: 224, moon: 229, strike: 233.25, fallOff: 242.2 };

export default {
  id: 'ep1', LEN: 292, T,
  title: { zh: ['掌中劍', '第一回　月下決', ''], en: ['SWORDS IN THE PALM', 'Part One: Duel Under the Moon', ''] },
  end: { zh: ['掌中劍　第一回　月下決', '欲知後事如何　且待下回分解'], en: ['SWORDS IN THE PALM — Part One', 'What came of it, the next part will tell'] },
  endFor: 5,
  hitstopK: 1.15,
  warp: [[230.4, 231.6, 0.25], [233.2, 234.0, 0.3]],
  blacks: [[180.4, 182.8]],
  // the names shown in calligraphy as each master appears
  cards: [[24.4, 28.5, 'yan'], [58.4, 63.5, 'ye'], [104.4, 109.5, 'ling']],
  set: {
    kinds: ['stage', 'bamboo', 'cliff'], curtain: [5, 9.2], stageUntil: 16, plaque: '月下決', couplet: ['掌中乾坤藏日月', '指上風雲動江湖'],
    sky: [[0, 'moon'], [182.8, 'bigmoon', 182.6], [292, 'dawn', 258]],
    embers: 0, fires: [], columns: [],
  },
  actors: [
    { id: 'yan', who: 'yan', start: [-24, 0], face: 'e1', track: [...tracks.yan, { do: 'face', t: 24.5, t1: 52, to: 'e1', blend: 0.3 }] },
    { id: 'e1', who: 'envoy', start: [4.8, 0.6], face: 'yan', track: tracks.e1 },
    { id: 'e2', who: 'envoy', start: [-4.2, 3.5], face: 'yan', track: tracks.e2 },
    { id: 'e3', who: 'envoy', start: [-3.8, -3.7], face: 'yan', track: tracks.e3 },
    { id: 'e4', who: 'envoy', start: [3.2, -4.2], face: 'yan', track: tracks.e4 },
    { id: 'ye', who: 'ye', start: [6, 0.5], floor: [[0, 0]], face: 'yan', track: [...tracks.ye, { do: 'face', t: 99, t1: 300, to: 'ling', blend: 0.4 }] },
    { id: 'ling', who: 'ling', start: [-6, 1], face: 'ye', track: tracks.ling },
  ],

  // ---------------------------------------------------------------- the camera
  shots: [
    { t: 0, pos: [-24, 2.6, 0], look: [-16, 2.9, 0], fov: 40 }, // the theatre, the curtain closed
    { t: 9.2, pos: [[-22, 2.6, 0], [-12, 1.8, 0]], look: [[-16, 2.4, 0], [0, 1.2, 0]], fov: [40, 50] }, // into the stage, into the forest
    { t: 15, pos: { at: 'yan', off: [-2.4, 0.5, 1.4] }, look: { at: 'yan', off: [1.0, 1.0, 0] }, fov: 40, hand: 0.4 }, // running with her
    { t: 18.4, pos: [-6, 1.3, -3.4], look: { at: 'yan', off: [0, 1.0, 0] }, fov: 14 }, // through the bamboo, a long lens
    { t: 21.3, pos: [0.2, 0.4, 0.4], look: [2.5, 4.5, 0.5], fov: 56 }, // up: they come down out of the bamboo
    { t: 23.6, orbit: { c: { at: 'yan', off: [0, 1.0, 0] }, r: 5.5, h: 1.0, a: [-1.8, -1.1] }, fov: 44 }, // surrounded
    { t: 26.6, pos: { actor: 'yan', part: 'head', local: true, off: [0.1, 0.06, 0.9] }, look: { actor: 'yan', part: 'head', local: true, off: [0, 0.08, 0] }, fov: 30 },
    { t: 29.2, pos: { at: 'yan', off: [0.4, 1.4, -4.2] }, look: { at: 'yan', off: [0.5, 0.9, 0] }, fov: 46 }, // the fight, side on
    { t: 32.0, pos: { at: 'yan', off: [-0.5, 0.3, -2.8] }, look: { at: 'yan', off: [0, 1.8, 0] }, fov: 54 }, // up at the leap
    { t: 33.4, pos: { at: 'yan', off: [-1.6, 1.2, 2.6] }, look: { at: 'yan', off: [0.8, 0.9, -0.4] }, fov: 42 },
    { t: 35.4, pos: { mid: ['yan', 'e4'], off: [-0.6, 1.2, -2.8] }, look: { mid: ['yan', 'e4'], off: [0, 1.0, 0] }, fov: 40 },
    { t: 37.4, pos: [0, 2.2, 5.4], look: [0, 0.8, -0.6], fov: 50 },
    { t: 39.0, orbit: { c: { at: 'yan', off: [0, 1.0, 0] }, r: 3.4, h: 0.5, a: [0.6, 1.8] }, fov: 42, hand: 0.4 },
    { t: 42.2, pos: { at: 'yan', off: [-2.6, 1.0, 1.8] }, look: { at: 'yan', off: [0.6, 1.0, -0.4] }, fov: 42 },
    { t: 45.2, pos: { at: 'yan', off: [-1.2, 1.3, -1.0] }, look: { at: 'e3', off: [0, 1.0, 0] }, fov: 34 },
    { t: 46.6, pos: [-1.0, 1.4, 4.8], look: [-0.4, 0.9, -0.8], fov: 40 }, // stillness; leaves fall
    { t: 50.0, pos: { at: 'yan', off: [0.6, 0.6, 1.6] }, look: [5, 6, 0.5], fov: 52 }, // a red wind in the bamboo
    { t: 53.0, pos: [1.0, 0.5, -3.2], look: { at: 'ye', off: [0, 1.0, 0] }, fov: 44 }, // he comes down
    { t: 57.4, pos: { at: 'ye', off: [-2.6, 0.35, -0.9] }, look: { at: 'ye', off: [0, 1.6, 0] }, fov: 36 }, // low, up at him, as he speaks his poem
    { t: 61.5, orbit: { c: { at: 'ye', off: [0, 1.2, 0] }, r: 3.2, h: 0.3, a: [2.6, 3.6] }, fov: 34 },
    { t: 65.0, pos: { actor: 'ye', part: 'head', local: true, off: [0.12, 0.08, 1.0] }, look: { actor: 'ye', part: 'head', local: true, off: [0, 0.1, 0] }, fov: 30 },
    { t: 68.2, pos: { mid: ['yan', 'ye'], off: [0, 1.2, -4.2] }, look: { mid: ['yan', 'ye'], off: [0, 1.0, 0] }, fov: 44 },
    { t: 72.8, pos: { actor: 'yan', part: 'head', local: true, off: [-0.1, 0.06, 1.0] }, look: { actor: 'yan', part: 'head', local: true, off: [0, 0.08, 0] }, fov: 32 },
    { t: 75.3, pos: { mid: ['yan', 'ye'], off: [0.3, 1.1, -3.0] }, look: { mid: ['yan', 'ye'], off: [0, 1.0, 0] }, fov: 40, hand: 0.4 },
    { t: 79.4, pos: { mid: ['yan', 'ye'], off: [-0.6, 0.6, 3.0] }, look: { mid: ['yan', 'ye'], off: [0, 1.0, 0] }, fov: 42 },
    { t: 84.4, pos: { at: 'ye', off: [0.6, 0.4, -2.6] }, look: { at: 'ye', off: [0, 1.4, 0] }, fov: 40 }, // the palm gathering
    { t: 86.1, pos: { mid: ['yan', 'ye'], off: [0, 1.4, -4.8] }, look: { mid: ['yan', 'ye'], off: [-1, 1.0, 0] }, fov: 52 },
    { t: 88.0, pos: { at: 'yan', off: [-1.8, 0.4, -0.8] }, look: { at: 'ye', off: [0, 1.6, 0] }, fov: 40 }, // up from her at him coming
    { t: 96.0, pos: { at: 'yan', off: [-0.9, 0.3, -1.2] }, look: { at: 'ye', off: [0, 2.0, 0] }, fov: 46 },
    { t: 98.1, pos: [-1.5, 1.2, -4.4], look: [1.0, 0.8, 0], fov: 50 }, // the crescent
    { t: 100.0, pos: [-0.6, 0.4, 3.0], look: { at: 'ling', off: [0, 1.0, 0] }, fov: 46 }, // he comes down, turning
    { t: 104.2, pos: { at: 'ling', off: [2.4, 0.35, -0.8] }, look: { at: 'ling', off: [0, 1.4, 0] }, fov: 34 }, // the pose, his poem
    { t: 108.4, orbit: { c: { at: 'ling', off: [0, 1.2, 0] }, r: 3.0, h: 0.4, a: [-0.4, 0.6] }, fov: 34 },
    { t: 111.8, pos: { actor: 'ling', part: 'head', local: true, off: [0.1, 0.08, 1.0] }, look: { actor: 'ling', part: 'head', local: true, off: [0, 0.1, 0] }, fov: 30 },
    { t: 114.3, pos: { at: 'ye', off: [-1.4, 1.3, -1.2] }, look: { at: 'ling', off: [0, 1.1, 0] }, fov: 34 },
    { t: 119.0, pos: { at: 'ling', off: [1.4, 1.3, 1.0] }, look: { at: 'ye', off: [0, 1.1, 0] }, fov: 34 },
    { t: 123.8, pos: { mid: ['ling', 'yan'], off: [1.0, 1.0, 2.6] }, look: { mid: ['ling', 'yan'], off: [0, 1.0, 0] }, fov: 40 },
    { t: 125.8, orbit: { c: { mid: ['ling', 'ye'], off: [0, 1.0, 0] }, r: 5, h: 0.8, a: [-1.6, -0.9] }, fov: 40 }, // they circle
    { t: 129.2, pos: { mid: ['ling', 'ye'], off: [0, 1.0, -2.6] }, look: { mid: ['ling', 'ye'], off: [0, 1.0, 0] }, fov: 38, hand: 0.4 },
    { t: 131.3, pos: { mid: ['ling', 'ye'], off: [0.6, 0.5, 2.6] }, look: { mid: ['ling', 'ye'], off: [0, 1.0, 0] }, fov: 40 },
    { t: 133.2, orbit: { c: { mid: ['ling', 'ye'], off: [0, 1.0, 0] }, r: 2.8, h: 0.3, a: [-1.2, 0.4] }, fov: 40, hand: 0.5 }, // the quick exchange, round them
    { t: 137.4, pos: [0.8, 0.4, 3.6], look: [1.0, 3.2, 0], fov: 60 }, // up into the canopy
    { t: 142.2, pos: [1.0, 1.4, -5.2], look: [1.0, 1.2, 0], fov: 60 },
    { t: 145.6, pos: [1.0, 1.2, 3.0], look: [1.0, 1.1, 0], fov: 64 }, // the crescents meet
    { t: 148.0, pos: { at: 'ye', off: [-2.4, 0.4, 1.6] }, look: { at: 'ye', off: [0, 1.4, 0] }, fov: 38 }, // he gathers the Netherworld Palm
    { t: 154.6, pos: { actor: 'ye', part: 'head', local: true, off: [0.1, 0.1, 0.9] }, look: { actor: 'ye', part: 'head', local: true, off: [0, 0.1, 0] }, fov: 28 },
    { t: 156.9, pos: { mid: ['ling', 'ye'], off: [0, 1.2, -4.6] }, look: { mid: ['ling', 'ye'], off: [0, 1.0, 0] }, fov: 54 },
    { t: 158.6, pos: { at: 'ling', off: [1.4, 0.4, 1.2] }, look: { at: 'ling', off: [0, 0.9, 0] }, fov: 38 },
    { t: 161.4, pos: { at: 'ling', off: [-1.6, 0.4, -1.4] }, look: { at: 'ling', off: [0, 1.2, 0] }, fov: 40 }, // he rises, the light round him
    { t: 163.0, pos: { actor: 'ling', part: 'head', local: true, off: [0.1, 0.1, 0.85] }, look: { actor: 'ling', part: 'head', local: true, off: [0, 0.1, 0] }, fov: 28 },
    { t: 165.3, pos: [2.0, 0.4, -3.6], look: [2.6, 1.0, 0.6], fov: 52 }, // Frost Sky, One Sword: through him
    { t: 167.4, pos: { at: 'ye', off: [-2.0, 0.4, -1.6] }, look: { at: 'ye', off: [0, 1.4, 0] }, fov: 38 },
    { t: 172.4, pos: { at: 'ling', off: [-1.4, 1.2, -1.2] }, look: { at: 'ye', off: [0, 1.2, 0] }, fov: 32 },
    { t: 176.0, pos: [2.0, 0.3, 2.0], look: { at: 'ye', off: [0, 1.0, 0] }, fov: 60 }, // up and away into the sky
    // the mountain top
    { t: 182.8, pos: [278, 3.5, 6], look: [300, 1.0, 0], fov: 42 }, // over the clouds, the moon
    { t: 185.0, pos: [292, 0.5, -3.5], look: { at: 'ling', off: [0, 1.4, 0] }, fov: 46 },
    { t: 187.6, pos: [300, 1.0, -6.5], look: [300, 1.0, 0], fov: 46 }, // Kurosawa: the two of them, the wind
    { t: 191.5, pos: { at: 'ling', off: [-3.0, 1.0, 0.6] }, look: { at: 'ye', off: [0, 1.0, 0] }, fov: 18 },
    { t: 194.0, pos: { at: 'ye', off: [2.6, 1.5, -2.2] }, look: { at: 'ling', off: [0, 1.0, 0] }, fov: 18 },
    { t: 196.3, pos: { mid: ['ling', 'ye'], off: [0, 1.0, -3.0] }, look: { mid: ['ling', 'ye'], off: [0, 1.0, 0] }, fov: 40, hand: 0.4 },
    { t: 200.4, orbit: { c: { mid: ['ling', 'ye'], off: [0, 1.0, 0] }, r: 3.2, h: 0.4, a: [-1.4, 0.2] }, fov: 40 },
    { t: 204.6, pos: { at: 'ling', off: [0.5, 0.4, -2.6] }, look: { at: 'ling', off: [0, 1.6, 0] }, fov: 50 },
    { t: 207.0, pos: [297, 1.4, 3.2], look: { at: 'ye', off: [0, 1.0, 0] }, fov: 40 },
    { t: 210.4, pos: { at: 'ye', off: [-2.0, 0.4, -1.5] }, look: { at: 'ye', off: [0, 1.6, 0] }, fov: 40 }, // Ten Thousand Demons gathering
    { t: 214.4, pos: { actor: 'ye', part: 'head', local: true, off: [0.1, 0.1, 0.9] }, look: { actor: 'ye', part: 'head', local: true, off: [0, 0.1, 0] }, fov: 28 },
    { t: 217.0, pos: { mid: ['ling', 'ye'], off: [0, 1.6, -5.2] }, look: { mid: ['ling', 'ye'], off: [0, 1.0, 0] }, fov: 56 },
    { t: 219.4, pos: { at: 'ling', off: [-2.0, 0.6, 1.4] }, look: { at: 'ling', off: [0, 1.0, 0] }, fov: 42 }, // to the very edge
    { t: 222.3, pos: { at: 'yan', off: [1.2, 0.5, 1.6] }, look: { at: 'yan', off: [0, 1.1, 0] }, fov: 42 }, // she comes
    { t: 224.3, pos: { at: 'ye', off: [-1.2, 1.2, 2.2] }, look: { at: 'ye', off: [0, 1.0, 0] }, fov: 40 },
    { t: 226.8, pos: { actor: 'ling', part: 'head', local: true, off: [0.1, 0.1, 0.85] }, look: { actor: 'ling', part: 'head', local: true, off: [0, 0.1, 0] }, fov: 28 },
    { t: 229.0, pos: [298, 0.25, -2.4], look: [306, 5.2, 1.5], fov: 50 }, // up against the moon
    { t: 232.4, pos: { at: 'ye', off: [-1.2, 0.4, -2.6] }, look: { at: 'ye', off: [0, 1.6, 0] }, fov: 54 }, // the blow coming down
    { t: 234.0, pos: [301.6, 1.0, -5.0], look: [302, 0.9, 0], fov: 42 }, // the pause
    { t: 239.4, pos: { at: 'ye', off: [-1.6, 0.6, -1.2] }, look: { at: 'ye', off: [0, 1.2, 0] }, fov: 34 },
    { t: 242.3, pos: [305, 1.6, -3.4], look: { at: 'ye', off: [0, 0.5, 0] }, fov: 46 }, // over the edge
    { t: 244.2, pos: [308.5, 3.2, 0.8], look: [310, -4.0, 0.8], fov: 50 }, // down into the clouds
    { t: 246.8, pos: [304.2, 1.4, 4.2], look: { mid: ['ling', 'yan'], off: [0, 0.9, 0] }, fov: 44 },
    { t: 250.4, pos: { at: 'ling', off: [1.2, 1.3, 1.0] }, look: { at: 'yan', off: [0, 1.0, 0] }, fov: 32 },
    { t: 255.4, pos: { at: 'yan', off: [-1.0, 1.25, 0.8] }, look: { at: 'ling', off: [0, 1.1, 0] }, fov: 32 },
    { t: 259.0, pos: { actor: 'ling', part: 'head', local: true, off: [0.12, 0.1, 1.1] }, look: { actor: 'ling', part: 'head', local: true, off: [0, 0.1, 0] }, fov: 30 },
    { t: 262.5, pos: [[303, 1.0, 2.6], [306, 2.6, 5.0]], look: [[297, 1.0, 1.0], [280, 2.0, -2.0]], fov: 44 }, // the two of them, the sun coming up over the clouds
    { t: 276, pos: [[305, 1.6, 4.0], [312, 9, 10]], look: [[298, 1.0, 1.0], [270, 4, -8]], fov: 46 },
  ],

  // ---------------------------------------------------------------- the words
  lines: (() => {
    const L = [
      [2.0, 6.6, 'narrator', '江湖風雨幾時休，一劍光寒十四州。', 'When will the storms of the rivers and lakes ever end? One sword’s cold light falls on fourteen provinces.'],
      [6.9, 11.6, 'narrator', '月下竹林藏殺氣，掌中乾坤論恩仇。', 'Death hides in the bamboo under the moon; in the palm of a hand, old debts are settled.'],
      [18.0, 21.5, 'yan', '天機劍譜……絕不能落入血蓮手中！', 'The Heavenly Sword Manual... the Blood Lotus must never have it!'],
      [24.6, 27.4, 'envoy', '燕飛霜，交出劍譜，留你全屍！', 'Yan Feishuang! Give up the manual and we leave your body whole!'],
      [27.7, 29.3, 'yan', '血蓮的狗，也配？', 'You? The Blood Lotus’s dogs?'],
      [48.0, 50.6, 'yan', '……還有人。出來！', '...There is someone else. Show yourself!'],
      [51.0, 53.0, 'ye', '哈哈哈哈……', 'Ha ha ha ha...'],
      [58.6, 63.0, 'ye', '血蓮開處萬骨枯，天下蒼生一念屠。', 'Where the blood lotus opens, ten thousand bones dry; a single thought of mine, and all beneath heaven is slaughtered.'],
      [63.4, 68.0, 'ye', '若問魔尊何處去，九幽門下盡我途。', 'Ask where the Demon Lord goes: every gate of the Nine Netherworlds is my road.'],
      [68.5, 72.5, 'ye', '燕飛霜，把劍譜交出來，本尊讓你死得痛快。', 'Yan Feishuang. Give me the manual, and I will let you die quickly.'],
      [73.0, 75.3, 'yan', '要劍譜，先問過我的刀！', 'For the manual, ask my blades first!'],
      [84.6, 86.0, 'ye', '血蓮掌！', 'Blood Lotus Palm!'],
      [95.6, 97.6, 'ye', '去吧。', 'Go now.'],
      [104.5, 109.0, 'ling', '一劍霜寒照九州，白衣不染世間愁。', 'One sword, frost-cold, over the nine provinces; a white robe the sorrows of the world cannot stain.'],
      [109.4, 114.0, 'ling', '若問劍心何所在，月明千里一孤舟。', 'Ask where the sword’s heart lies: a lone boat under a moon that shines a thousand miles.'],
      [114.5, 118.8, 'ye', '凌雲霄！十年前斷你師門，今日斷你性命！', 'Ling Yunxiao! Ten years ago I ended your school; today I end your life!'],
      [119.3, 123.5, 'ling', '十年前我留你一命，是我此生最大的錯。', 'Ten years ago I let you live. It was the greatest mistake of my life.'],
      [123.8, 125.6, 'ling', '燕姑娘，退下。', 'Miss Yan. Stand back.'],
      [154.8, 157.0, 'ye', '血蓮・九幽掌！', 'Blood Lotus: Nine Netherworlds Palm!'],
      [158.2, 159.6, 'yan', '凌大俠！', 'Master Ling!'],
      [163.2, 165.3, 'ling', '霜天——一劍！', 'Frost Sky — One Sword!'],
      [168.8, 172.0, 'ye', '好……好一個凌雲霄！', 'Good... a fine swordsman, Ling Yunxiao!'],
      [172.4, 176.0, 'ye', '陪本尊到九霄之上，再分生死！', 'Come with me, above the nine heavens, and we will see who dies!'],
      [188.6, 195.6, 'narrator', '一輪明月，照盡江湖恩怨；一劍一掌，誰主沉浮？', 'One bright moon over every grudge in the world; one sword, one palm: which will rise, and which will fall?'],
      [214.6, 217.0, 'ye', '萬魔——歸宗！', 'Ten Thousand Demons — Return to the Source!'],
      [224.8, 227.0, 'yan', '凌大俠，就是現在！', 'Master Ling — now!'],
      [229.1, 230.4, 'ling', '一劍——', 'One Sword —'],
      [232.0, 233.2, 'ling', '月華！', 'Moonlight!'],
      [238.0, 242.2, 'ye', '哈……哈哈……本尊……不會就此……', 'Ha... ha ha... this is not... the end of me...'],
      [248.2, 250.2, 'yan', '他……死了嗎？', 'Is he... dead?'],
      [250.6, 255.0, 'ling', '血蓮不死，江湖不寧。今夜，只是開始。', 'While the Blood Lotus lives, the world knows no peace. Tonight is only the beginning.'],
      [255.4, 258.4, 'yan', '那天機劍譜……我們該怎麼辦？', 'And the sword manual... what do we do?'],
      [258.8, 262.0, 'ling', '先離開這裡。風，要變了。', 'Leave this place first. The wind is turning.'],
      [266.0, 271.6, 'narrator', '劍影月華今宵盡，江湖兒女幾人歸？', 'The sword’s shadow and the moon’s light end with the night; of those who live by the sword, how many come home?'],
      [272.0, 278.0, 'narrator', '欲知血蓮生死事，且待下回再分明。', 'Whether the Blood Lotus lives or dies, the next part will tell.'],
    ];
    return { zh: L.map(([a, b, w, z]) => [a, b, w, z]), en: L.map(([a, b, w, , e]) => [a, b, w, e]) };
  })(),

  // ---------------------------------------------------------------- the rest of what is seen and heard
  cues: [
    { t: 49.8, kind: 'leaves', at: [3.5, 5, 0.4], k: 1.6 }, { t: 57.0, kind: 'leaves', at: [4.2, 0.3, 0.3], k: 1.2 }, { t: 57.0, kind: 'qiburst', at: [4.2, 0.2, 0.3], k: 0.8, col: '#ff2a48' },
    { t: 104.0, kind: 'leaves', at: [-0.6, 0.2, 0.6], k: 1.0 }, { t: 104.0, kind: 'qiburst', at: [-0.6, 0.2, 0.6], k: 0.6, col: '#a8e0ff' },
    { t: 146.8, kind: 'qiburst', at: [1.0, 1.1, 0.0], k: 2.0, col: '#e8c8ff' }, { t: 146.8, kind: 'shake', k: 0.15 }, { t: 146.8, kind: 'flash', k: 0.55 },
    ...[[133.4, [1.8, 3.5, 2.4]], [134.8, [-0.6, 2.8, -2.6]], [136.25, [2.6, 4.2, -2.4]], [141.0, [0.6, 3.6, 2.6]]].map(([t, at], i) => ({ t: t + 0.05, kind: 'bamboo', at, v: [(i % 2 ? -1 : 1) * 0.8, 0.6, 0.4], len: 2.4 + i * 0.3, spin: 2 + i * 0.4 })),
    { t: 87.5, kind: 'bamboo', at: [-3.0, 2.6, -1.0], v: [-0.5, 0.4, -0.6], len: 3.0 },
    { t: 157.5, kind: 'flash', k: 0.4 }, { t: 157.5, kind: 'shake', k: 0.12 }, { t: 165.95, kind: 'flash', k: 0.5 }, { t: 165.95, kind: 'shake', k: 0.12 }, { t: 168.0, kind: 'qiburst', at: { actor: 'ye', part: 'chest' }, k: 1.6, col: '#ff2040' },
    { t: 176.3, kind: 'qiburst', at: { actor: 'ye', part: 'root' }, k: 1.4, col: '#ff2040' }, { t: 177.1, kind: 'qiburst', at: { actor: 'ling', part: 'root' }, k: 1.0, col: '#a8e0ff' }, { t: 179.6, kind: 'flash', k: 0.8 },
    { t: 185.0, kind: 'qiburst', at: [304, 0.2, 0.3], k: 0.8, col: '#ff2a48' }, { t: 187.2, kind: 'qiburst', at: [296, 0.2, 0], k: 0.6, col: '#a8e0ff' },
    { t: 219.6, kind: 'shake', k: 0.1 }, { t: 233.3, kind: 'qiburst', at: { actor: 'ye', part: 'chest' }, k: 2.4, col: '#f0f8ff' }, { t: 233.3, kind: 'flash', k: 0.7 }, { t: 233.3, kind: 'shake', k: 0.2 },
    { t: 239.6, t1: 242.2, kind: 'sparks', every: 0.45, at: { actor: 'ye', part: 'chest' }, k: 0.4 }, { t: 241.5, kind: 'qiburst', at: { actor: 'ye', part: 'chest' }, k: 0.8, col: '#ff2040' },
    { t: 245.8, kind: 'qiburst', at: [309.5, -4.5, 0.8], k: 2.0, col: '#ff2040' },
  ],

  // ---------------------------------------------------------------- the music: the drums and gongs, the zither, the flutes
  // luogu: the drums and gongs in a pattern: 'kaitai' (the opening of a play), 'fight', 'chase' (fast and urgent),
  //   'hit' (one crash on a blow or a pose); zheng: the zither, an arpeggio over a chord; line: a melody; pad: held strings
  music: [
    { luogu: 'kaitai', t: 0.4, t1: 5.2 }, { luogu: 'hit', t: 5.2, g: 1.2 },
    { zheng: 'Dm', t: 5.4, t1: 15, g: 0.5 }, { pad: 'VC', n: 'D2', t: 5.4, d: 10, g: 0.25 }, { pad: 'CB', n: 'D1', t: 5.4, d: 10, g: 0.3 },
    { line: 'OC', g: 0.4, notes: [['A4', 6.0, 1.2], ['D5', 7.3, 1.6], ['C5', 9.0, 0.6], ['A4', 9.7, 0.6], ['G4', 10.4, 1.4], ['A4', 12.0, 2.6]] },
    { luogu: 'chase', t: 15, t1: 23.6 }, { line: 'RC', g: 0.3, notes: [['D5', 15.2, 0.25], ['F5', 15.5, 0.25], ['G5', 15.8, 0.25], ['A5', 16.1, 0.5], ['G5', 16.7, 0.25], ['F5', 17.0, 0.25], ['D5', 17.3, 0.5], ['C5', 17.9, 0.25], ['D5', 18.2, 0.8]] },
    { luogu: 'hit', t: 23.6, g: 1.2 }, { pad: 'VCt', n: 'D2', t: 23.6, d: 5.6, g: 0.35 }, { zheng: 'gliss', t: 24.4, g: 0.6 },
    { luogu: 'fight', t: 29.2, t1: 46.2 },
    ...[30.7, 33.55, 36.6, 39.95, 41.6, 44.0, 45.95].map((t) => ({ luogu: 'hit', t, g: 0.8 })),
    { pad: 'PS', n: 'D4', t: 46.6, d: 4, g: 0.25 }, { pad: 'PS', n: 'A3', t: 48.4, d: 3.6, g: 0.2 },
    { pad: 'VCt', n: 'D2', t: 50.0, d: 7.5, g: 0.4 }, { pad: 'CB', n: 'D1', t: 50.0, d: 7.5, g: 0.4 }, { hit: 'roll', t: 52, g: 0.5 },
    { luogu: 'hit', t: 57.0, g: 1.4 }, { hit: 'gong', t: 57.0, g: 0.8 },
    { pad: 'CB', n: 'D1', t: 57.4, d: 11, g: 0.35 }, { pad: 'VC', n: 'A1', t: 57.4, d: 11, g: 0.25 }, { pad: 'TB', n: 'D2', t: 58.4, d: 9, g: 0.22 },
    { line: 'PS', g: 0.3, notes: [['D4', 58.6, 2], ['F4', 60.8, 1.2], ['Eb4', 62.2, 1.6], ['D4', 63.9, 2], ['C4', 66.0, 1.2], ['D4', 67.3, 1.6]] },
    { luogu: 'hit', t: 63.2, g: 0.6 }, { luogu: 'hit', t: 68.0, g: 1.0 },
    { luogu: 'fight', t: 75.2, t1: 86.0 }, ...[76.2, 77.6, 78.8, 79.6, 82.1].map((t) => ({ luogu: 'hit', t, g: 0.7 })),
    { pad: 'VNt', n: 'Eb5', t: 84.4, d: 1.8, g: 0.3 }, { luogu: 'hit', t: 86.4, g: 1.4 }, { hit: 'gong', t: 86.4, g: 0.7 },
    { pad: 'PS', n: 'A3', t: 88, d: 6, g: 0.2 }, { pad: 'VCt', n: 'D2', t: 92, d: 6.2, g: 0.35 }, { hit: 'roll', t: 96, g: 0.4 },
    { luogu: 'hit', t: 98.75, g: 1.3 },
    // the hero's theme: bright, in G, on the flute over the zither
    { zheng: 'G', t: 100, t1: 125, g: 0.55 }, { pad: 'VA', n: 'D3', t: 100.0, d: 14, g: 0.2 }, { pad: 'VC', n: 'G2', t: 100, d: 25, g: 0.22 },
    { line: 'OC', g: 0.45, notes: [['D5', 104.6, 1.0], ['E5', 105.7, 0.5], ['G5', 106.3, 1.4], ['E5', 107.9, 0.6], ['D5', 108.6, 1.6], ['B4', 110.4, 0.8], ['A4', 111.3, 0.6], ['G4', 112.0, 2.0]] },
    { luogu: 'hit', t: 104.1, g: 1.1 }, { luogu: 'hit', t: 114.1, g: 0.8 },
    { luogu: 'fight', t: 128.6, t1: 146.6 }, ...[129.5, 132.1, 140.5, 141.0].map((t) => ({ luogu: 'hit', t, g: 0.8 })),
    { luogu: 'hit', t: 146.8, g: 1.5 }, { hit: 'gong', t: 146.8, g: 0.8 },
    { pad: 'CB', n: 'D1', t: 148, d: 9, g: 0.35 }, { pad: 'VCt', n: 'D2', t: 150, d: 7, g: 0.35 }, { pad: 'VNt', n: 'Eb5', t: 153, d: 4, g: 0.3 },
    { luogu: 'hit', t: 157.4, g: 1.4 }, { hit: 'gong', t: 157.4, g: 0.6 },
    { zheng: 'gliss', t: 161.2, g: 0.7 }, { pad: 'HN', n: 'G3', t: 162, d: 3.4, g: 0.25 }, { pad: 'HN', n: 'D4', t: 162.6, d: 2.8, g: 0.2 },
    { luogu: 'hit', t: 165.95, g: 1.5 }, { hit: 'gong', t: 165.95, g: 0.7 },
    { pad: 'CB', n: 'D1', t: 167.4, d: 9, g: 0.35 }, { pad: 'TB', n: 'D2', t: 168, d: 8, g: 0.25 }, { luogu: 'chase', t: 175.6, t1: 180.2 }, { luogu: 'hit', t: 180.2, g: 1.3 },
    // the mountain top: wide, still; then the last fight
    { zheng: 'Dm', t: 183, t1: 196, g: 0.45 }, { pad: 'VC', n: 'D2', t: 183, d: 13, g: 0.25 }, { pad: 'VA', n: 'A2', t: 183.5, d: 12, g: 0.2 }, { pad: 'VN', n: 'D4', t: 186, d: 10, g: 0.14 },
    { line: 'OC', g: 0.38, notes: [['A4', 188.8, 1.6], ['C5', 190.6, 0.8], ['D5', 191.6, 2.0], ['C5', 193.8, 0.6], ['A4', 194.5, 1.6]] },
    { luogu: 'fight', t: 196.4, t1: 210.2 }, ...[197.7, 199.1, 200.6, 202.2, 204.0].map((t) => ({ luogu: 'hit', t, g: 0.8 })),
    { pad: 'CB', n: 'D1', t: 210.4, d: 7, g: 0.4 }, { pad: 'VCt', n: 'D2', t: 210.4, d: 7, g: 0.4 }, { pad: 'VNt', n: 'Eb5', t: 213, d: 4.2, g: 0.3 }, { hit: 'roll', t: 214, g: 0.5 },
    { luogu: 'chase', t: 217.3, t1: 219.6 }, { luogu: 'hit', t: 219.6, g: 1.3 },
    { luogu: 'hit', t: 224.5, g: 0.9 }, { zheng: 'G', t: 225, t1: 229, g: 0.5 },
    { pad: 'VNt', n: 'D5', t: 229, d: 4, g: 0.4 }, { pad: 'VNt', n: 'A5', t: 229.4, d: 3.6, g: 0.3 }, { zheng: 'gliss', t: 229.1, g: 0.7 }, { hit: 'susp', t: 230.6, g: 0.35 },
    { luogu: 'hit', t: 233.3, g: 1.8 }, { hit: 'gong', t: 233.3, g: 1.0 }, { tutti: 'D', t: 233.3, d: 4, g: 0.6, soft: true },
    { hit: 'gong', t: 245.8, g: 0.5 },
    // dawn: the hero's theme, slow, and the narrator closing the tale
    { zheng: 'G', t: 248, t1: 262, g: 0.4 }, { pad: 'VC', n: 'G2', t: 248, d: 14, g: 0.2 }, { pad: 'VA', n: 'D3', t: 249, d: 13, g: 0.18 },
    { line: 'PS', g: 0.25, notes: [['B3', 251, 2.4], ['D4', 253.6, 1.6], ['E4', 255.4, 2.4], ['D4', 258, 3.4]] },
    { tutti: 'G', t: 262.5, d: 14, g: 0.4, soft: true }, { zheng: 'G', t: 262.5, t1: 290, g: 0.45 },
    { line: 'OC', g: 0.4, notes: [['D5', 263.4, 1.4], ['E5', 265.0, 0.8], ['G5', 266.0, 2.2], ['A5', 268.4, 0.8], ['G5', 269.3, 0.8], ['E5', 270.2, 1.6], ['D5', 272.0, 2.0], ['B4', 274.2, 1.0], ['A4', 275.4, 1.0], ['G4', 276.6, 3.4]] },
    { tutti: 'G', t: 278, d: 14, g: 0.45, soft: true }, { luogu: 'kaitai', t: 284.5, t1: 289 }, { luogu: 'hit', t: 289, g: 1.3 }, { hit: 'gong', t: 289, g: 0.7 },
  ],
};
