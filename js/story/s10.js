// 《天機策》第十集　萬劍歸蓮 / Episode 10: Ten Thousand Swords Return to the Lotus. The finale, about ten minutes.
// Into the Netherworld. Wei Wuyou and Gu Hong cut through the Blood Lotus; Ling Yunxiao and Yan Feishuang end Ye Wuji for
// good with One Sword: Moonlight and Red Silk's twin blades; Yue Qinghan takes back what the Mirror King owed her. The
// Three Teachings and Luo Wuchen meet the Emperor, and his Netherworld Ends the World throws them down — until the
// Yin-Yang Gentleman, as he promised, steps onto whichever side is more fun to watch. Moonlight, Buddha light, sword
// light and lotus light together seal the Emperor away. Dawn over the clouds; Luo burns the Stratagem.
import { episode } from './compose.js?v=15';

const E = episode({
  id: 's10', plaque: '萬劍歸蓮',
  title: { zh: ['掌中劍・天機策', '最終回　萬劍歸蓮', ''], en: ['THE CELESTIAL STRATAGEM', 'Final Episode: Ten Thousand Swords Return to the Lotus', ''] },
  end: { zh: ['掌中劍・天機策　全劇終', '殷九霄何在？　江湖，再會'], en: ['THE CELESTIAL STRATAGEM — The End', 'Where is Yin Jiuxiao? Until we meet again'] },
  cast: ['luo', 'wei', 'ling', 'yan', 'wuya', 'baihe', 'yue', 'guhong', 'qian', 'yinyang', 'youming', 'ye', 'jingwang', ['e1', 'envoy'], ['e2', 'envoy'], ['e3', 'envoy'], ['e4', 'envoy']],
});

// ---------------------------------------------------------------- the night before: on the bamboo path
E.open('bamboo', { sky: 'moon', mood: 'sad', place: { luo: [-0.4, 0.4, 90], wei: [1.0, 0.8, -100], ling: [-2.6, -1.4, 60], yan: [-1.8, -2.2, 30], wuya: [2.6, -1.6, -130], baihe: [3.4, -0.4, -120], yue: [-3.0, 1.8, 60], guhong: [-1.6, 2.4, 0], qian: [0.6, -2.8, 20] } });
E.narrate('下幽冥的前一夜。月光還在，每一個人，都多看了它一眼。', 'The night before they went down into the Netherworld. The moonlight was still there, and every one of them looked at it a moment longer.');
E.say('wei', '洛無塵，要是明天回不來，你欠我的那一戰……', 'Luo Wuchen, if we don’t come back tomorrow — the fight you owe me...', { to: 'luo' });
E.say('luo', '回來了，再打。', 'When we’re back, we fight.', { to: 'wei', close: true });
E.say('wei', '你又算過了？', 'Have you worked that out too?', { to: 'luo', act: 'think' });
E.say('luo', '這一次，沒有算。這一次，是相信。', 'This time I worked out nothing. This time, I believe.', { to: 'wei', act: 'whisk' });
E.say('yan', '凌大俠，你怕不怕？', 'Master Ling, are you afraid?', { to: 'ling' });
E.say('ling', '怕。可是，妳在。', 'I am. But you are here.', { to: 'yan', close: true });
E.say('baihe', '老和尚，明天要是死在下面，貧道這壺酒，你喝不喝？', 'Old monk, if we die down there tomorrow — will you drink this wine of mine?', { to: 'wuya', act: 'laugh' });
E.say('wuya', '阿彌陀佛。活著回來，老衲陪你喝茶。', 'Amitabha. Come back alive, and I will drink tea with you.', { to: 'baihe' });
E.say('yue', '孤鴻，你從來不說話。你怕嗎？', 'Gu Hong, you never speak. Are you afraid?', { to: 'guhong' });
E.act('guhong', 'think', { d: 1.4, cam: 'close' });
E.act('guhong', 'point', { d: 1.4, cam: 'mid' });
E.say('yue', '……他指的是洛先生。他說，跟著那個人，就不怕。', '...He is pointing at Master Luo. He means: following that man, he is not afraid.', { to: 'luo' });
E.say('qian', '我怕！我怕得要死！可是……', 'I’m afraid! I’m scared to death! But...', { act: 'shock', cam: 'mid' });
E.say('qian', '可是你們都去了，我一個人留在上面，更可怕。', 'But if you all go, being left up here alone would be even scarier.', { act: 'none', close: true });

// ---------------------------------------------------------------- the Netherworld: the last road
E.scene('abyss', { sky: 'abyss', mood: 'dark', place: { luo: [-10, 0.2, 90], wei: [-10.6, 1.6, 90], ling: [-10.8, -1.0, 90], yan: [-11.6, -1.8, 90], wuya: [-12.0, 0.6, 90], baihe: [-12.2, 2.4, 90], yue: [-11.2, 3.0, 90], guhong: [-12.6, -0.6, 90], qian: [-13.4, -1.6, 90], youming: [4.2, 0, -90], ye: [2.6, 2.8, -100], jingwang: [2.6, -2.8, -80] } });
E.narrate('幽冥魔域。沒有日，沒有月，只有地底的火，照著一群從人間來的人。', 'The Netherworld. No sun, no moon — only the fire under the ground, lighting a band of people come down from the world of men.');
for (const [id, x, z] of [['luo', -3.0, 0.2], ['wei', -3.6, 1.6], ['ling', -3.8, -1.0], ['yan', -4.6, -1.8], ['wuya', -5.0, 0.6], ['baihe', -5.2, 2.4], ['yue', -4.2, 3.0], ['guhong', -5.6, -0.6], ['qian', -6.4, -1.6]]) E.move(id, x, z, { d: 6, shot: false, wait: false });
E.cut({ pos: [1488, 2.0, 7], look: [1486, 1.2, 0], fov: 46 });
E.narrate('洛無塵說：這一次，不演戲，不算計。', 'Luo Wuchen had said: this time, no acting, no scheming.', { shot: false });
E.wait(3.6);
E.say('qian', '我……我為什麼也要來啊……', 'Why... why did I have to come too...', { act: 'shock', cam: 'mid' });
E.say('luo', '因為你說過，這是你這輩子，賺得最值的一百兩。', 'Because you said it was the best hundred taels you ever earned.', { to: 'qian', act: 'whisk' });
E.say('youming', '人間的英雄，都到齊了。', 'The heroes of the world of men have all arrived.', { to: 'luo', cam: 'low' });
E.say('youming', '洛無塵，你帶著他們來送死，這一步棋，你算過嗎？', 'Luo Wuchen, you have brought them here to die. Did you reckon out this move?', { to: 'luo', act: 'point' });
E.say('luo', '算過。算到最後，這一局，無塵不用算。', 'I did. And in the end, this game is one Wuchen does not need to reckon.', { to: 'youming', act: 'whisk' });
E.say('youming', '哦？', 'Oh?', { to: 'luo', close: true });
E.say('luo', '因為跟無塵一起來的，都是不會回頭的人。', 'Because everyone who came with Wuchen is the kind who does not turn back.', { to: 'youming' });
E.say('youming', '那就讓本帝看看，人心，能不能擋住幽冥。', 'Then let me see whether men’s hearts can hold back the Netherworld.', { to: 'luo', act: 'laugh' });
E.say('youming', '殺。', 'Kill them.', { close: true });

// ---------------------------------------------------------------- the Blood Lotus, one last time
for (const [id, x, z] of [['e1', 0.6, 1.8], ['e2', 1.0, -0.4], ['e3', 0.0, 3.2], ['e4', 1.6, -2.2]]) { E.enter(id, { how: 'appear', at: [x, z], face: 'wei', gong: false, aura: 1, weapon: false }); E.t -= 1.0; }
E.t += 1.2;
E.say('wei', '這些雜兵，交給我們！', 'Leave the rabble to us!', { to: 'guhong', act: 'angry' });
E.skirmish('wei', ['e1', 'e3'], { d: 10, kill: true });
E.skirmish('guhong', ['e2', 'e4'], { d: 10, kill: true });
E.say('wei', '啞劍，你砍了兩個，我也砍了兩個。平手！', 'Mute Sword — you cut down two, so did I. A draw!', { to: 'guhong', act: 'laugh' });
E.act('guhong', 'bow', { d: 1.2 });

// ---------------------------------------------------------------- Ye Wuji, for the last time
E.move('ye', 2.6, 1.4, { d: 1.4, glide: true, face: 'ling' });
E.say('ye', '凌雲霄！三次了。這一次，我們之間，只能活一個！', 'Ling Yunxiao! Three times now. This time, only one of us lives!', { to: 'ling', act: 'angry' });
E.say('ling', '你說得對。', 'You are right.', { to: 'ye', close: true });
E.move('ling', 0.6, 0.8, { d: 1.0, glide: true, face: 'ye', shot: false });
E.duel('ling', 'ye', { d: 18, end: 'apart', k: 1.4 });
E.strike('ye', 'ling', { kind: 'palm', name: ['幽冥——九掌！', 'Netherworld — Nine Palms!'], result: 'blocked', col: '#c040ff', power: 1.6 });
E.say('yan', '凌大俠，我來！', 'Master Ling — I’m coming!', { to: 'ling', act: 'angry' });
E.move('yan', 1.2, -0.6, { d: 0.6, glide: true, face: 'ye', shot: false });
E.strike('yan', 'ye', { kind: 'dash', name: ['紅綾雙刃！', 'Twin Blades of Red Silk!'], result: 'hit', col: '#ff8ab0', knock: 1.0 });
E.say('ye', '……燕飛霜！', '...Yan Feishuang!', { to: 'yan', act: 'angry', close: true });
E.say('yan', '凌大俠，就是現在！', 'Master Ling — now!', { to: 'ling', close: true });
E.say('ling', '一劍——', 'One Sword —', { to: 'ye', close: true });
E.strike('ling', 'ye', { kind: 'wave', name: ['月華！', 'Moonlight!'], result: 'kill', col: '#f0f8ff', power: 2.0, knock: 3 });
E.say('ye', '這一次……本尊……真的……回不來了……', 'This time... I... truly... cannot come back...', { act: 'none', cam: 'mid' });
E.music.push({ tutti: 'D', t: E.t, d: 5, g: 0.45, soft: true });
E.say('yan', '結束了……', 'It’s over...', { to: 'ling', act: 'none' });
E.say('ling', '月下的那一劍，今天，終於結束了。', 'The sword under the moon has finally come to its end today.', { to: 'yan', close: true });

// ---------------------------------------------------------------- the Mirror King and the Cold Moon
E.move('jingwang', 3.0, -2.4, { d: 1.2, glide: true, face: 'yue' });
E.say('jingwang', '月清寒，本王一直想要一張新的臉。今天，就要妳的。', 'Yue Qinghan. This king has long wanted a new face. Today, I will have yours.', { to: 'yue', act: 'laugh' });
E.say('yue', '十年前，你要了我的心。今天，你什麼都拿不走了。', 'Ten years ago you took my heart. Today, you will take nothing more.', { to: 'jingwang' });
E.move('yue', 1.4, -1.4, { d: 0.8, glide: true, face: 'jingwang', shot: false });
E.duel('yue', 'jingwang', { d: 16, end: 'apart', k: 1.3 });
E.strike('jingwang', 'yue', { kind: 'array', name: ['萬象鏡光！', 'Mirror Light of Ten Thousand Forms!'], result: 'blocked', col: '#e0e8ff', power: 1.4 });
E.strike('yue', 'jingwang', { kind: 'array', name: ['寒月——九折！', 'Nine Folds — of the Cold Moon!'], result: 'kill', col: '#e8f0ff', power: 1.8 });
E.say('jingwang', '千面之下……原來……本王的真臉……是這個樣子……', 'Beneath a thousand faces... so this... is what this king’s true face looks like...', { act: 'none', cam: 'mid' });
E.say('yue', '……你的真臉，我早就忘了。', '...I forgot your true face long ago.', { to: 'jingwang', close: true });

// ---------------------------------------------------------------- the Emperor
E.say('youming', '一個魔尊，一個鏡王。你們殺得很好。', 'A demon lord, a mirror king. You have killed well.', { act: 'laugh', cam: 'low' });
E.say('youming', '可是，天機策，已經合一了。', 'But the Stratagem is already whole.', { act: 'point', cam: 'mid' });
E.sfx('qiburst', { at: [1510.6, 2.0, 0], k: 3.0, col: '#c040ff' }); E.sfx('shake', { k: 0.15 }); E.hit(E.t, 1.6); E.music.push({ hit: 'gong', t: E.t, g: 1.0 });
E.act('youming', 'qi', { d: 2.4, k: 2.0, col: '#c040ff', cam: 'wide' });
E.say('wuya', '……門，要開了！', '...The gate is opening!', { act: 'shock', cam: 'mid' });
E.say('wei', '別讓他開！', 'Don’t let him open it!', { to: 'guhong', act: 'angry' });
E.move('wei', 6.4, 1.2, { d: 0.8, glide: true, face: 'youming', shot: false, wait: false }); E.move('guhong', 6.6, -1.2, { d: 0.8, glide: true, face: 'youming', shot: false });
E.duel('wei', 'youming', { d: 10, end: 'win:b', hold: 4 });
E.duel('guhong', 'youming', { d: 8, end: 'win:b', hold: 4 });
E.say('youming', '一把狂刀，一把啞劍。可惜，都太輕了。', 'A mad blade and a mute sword. A pity — both far too light.', { act: 'laugh', cam: 'low' });
E.move('youming', 4.0, 0.0, { d: 2.4, glide: true, face: 'luo' });
E.move('wuya', 0.0, 1.6, { d: 1.0, glide: true, face: 'youming', shot: false, wait: false }); E.move('baihe', 0.4, -1.6, { d: 1.0, glide: true, face: 'youming', shot: false, wait: false }); E.move('luo', 0.4, 0.0, { d: 1.0, glide: true, face: 'youming', shot: false });
E.strike('wuya', 'youming', { kind: 'palm', name: ['大日——佛印！', 'Seal of the Great Sun!'], result: 'blocked', col: '#ffd860', power: 1.8 });
E.strike('baihe', 'youming', { kind: 'array', name: ['太虛——劍陣！', 'Sword Formation — of the Void!'], result: 'blocked', power: 1.6 });
E.strike('luo', 'youming', { kind: 'array', name: ['蓮華劍氣・三千界！', 'Lotus Sword Light: Three Thousand Worlds!'], result: 'clash', colB: '#c040ff', power: 1.8 });
E.say('youming', '就這樣？三教之力，就只有這樣？', 'Is that all? The power of the Three Teachings — only this?', { to: 'luo', act: 'laugh' });
E.strike('youming', 'luo', { kind: 'array', name: ['幽冥——滅世！', 'The Netherworld — Ends the World!'], result: 'down', col: '#c040ff', power: 2.4, knock: 3.6, hold: 16 });
for (const id of ['wuya', 'baihe', 'wei', 'ling', 'yue']) E.act(id, 'stagger', { d: 0.1, k: 1.8, wait: false });
E.wait(1.2, { cam: 'wide' });
E.say('wei', '洛無塵！', 'Luo Wuchen!', { to: 'luo', act: 'shock', close: true });
E.say('youming', '人心？人心，最容易碎。', 'Men’s hearts? Men’s hearts break more easily than anything.', { act: 'laugh', cam: 'low' });

// ---------------------------------------------------------------- the most amusing side
E.say('yinyang', '哈……哈哈哈哈哈！', 'Ha... ha ha ha ha ha!', { cam: 'wide' });
E.enter('yinyang', { how: 'descend', at: [1.6, 2.4], from: [-3, 2], face: 'youming', k: 1.6, aura: 4 });
E.say('youming', '陰陽郎君。你也來看本帝，打開人間的門？', 'The Yin-Yang Gentleman. Have you come too, to watch me open the gate of the world?', { to: 'yinyang' });
E.say('yinyang', '本來是。可是看了一會兒，本郎君發現——', 'I had. But after watching a while, I realised —', { to: 'youming', act: 'fan' });
E.say('yinyang', '看他們輸，不好玩。看你輸，才好玩！', 'watching them lose is no fun at all. Watching YOU lose — that will be fun!', { to: 'youming', act: 'laugh' });
E.strike('yinyang', 'youming', { kind: 'array', name: ['陰陽——逆亂！', 'Yin and Yang — in Chaos!'], result: 'hit', col: '#f0f0f0', power: 1.8, knock: 1.2 });
E.A('luo', { do: 'stance', t: E.t, t1: E.t + 0.6 }); E.tracks.luo.filter((a) => a.do === 'kneel').forEach((a) => { a.t1 = Math.min(a.t1, E.t); });
E.say('luo', '就是現在！所有人，一起！', 'Now! Everyone — together!', { cam: 'low' });
// moonlight, Buddha light, sword light, lotus light, all at once
const tt = E.t;
for (const [id, col, kind] of [['ling', '#f0f8ff', 'wave'], ['yan', '#ff8ab0', 'wave'], ['wuya', '#ffd860', 'palm'], ['baihe', '#a8e8ff', 'wave'], ['yue', '#e8f0ff', 'wave'], ['wei', '#ff5040', 'wave'], ['guhong', '#7ab0ff', 'wave'], ['yinyang', '#f0f0f0', 'wave']]) {
  E.face(id, 'youming', tt); E.A(id, { do: 'qi', t: tt, t1: tt + 3.6, k: 1.4, col });
  if (kind === 'palm') E.A(id, { do: 'palm', t: tt + 2.4, target: 'youming', col, k: 1.6 }); else E.A(id, { do: 'blow', t: tt + 2.4, style: 'side', arm: 'R', result: 'miss', target: 'youming', close: false, k: 1.4 }, { do: 'wave', t: tt + 2.4, at: tt + 2.9, target: 'youming', col, k: 1.4 });
}
E.face('luo', 'youming', tt); E.A('luo', { do: 'qi', t: tt, t1: tt + 3.8, k: 1.8, col: '#d8ffd0' });
for (let i = 0; i < 6; i++) E.A('luo', { do: 'wave', t: tt + 2.5 + i * 0.1, at: tt + 3.0 + i * 0.1, target: 'youming', col: '#d8ffd0', k: 1.4, tilt: (i - 2.5) * 0.4 });
E.cut({ orbit: { c: { at: 'luo', off: [0, 1.2, 0] }, r: 6, h: 1.4, a: [2.0, 3.6] }, fov: 50 });
E.say('luo', '萬劍——', 'Ten Thousand Swords —', { close: true, act: 'none' });
E.t = tt + 2.2;
E.cut({ pos: [1500, 2.0, 7], look: [1504, 1.6, 0], fov: 56 });
E.warp.push([tt + 2.6, tt + 3.6, 0.22]);
E.say('luo', '歸蓮！', 'Return to the Lotus!', { cam: 'wide', act: 'none' });
E.t = tt + 3.2;
E.sfx('qiburst', { at: { actor: 'youming', part: 'chest' }, k: 3.6, col: '#ffffff' }); E.sfx('flash', { k: 0.9 }); E.sfx('shake', { k: 0.25 });
E.music.push({ luogu: 'hit', t: E.t, g: 1.8 }, { hit: 'gong', t: E.t, g: 1.2 }, { tutti: 'D', t: E.t, d: 6, g: 0.6 });
E.A('youming', { do: 'react', t: E.t, part: 'body', k: 2.0 }, { do: 'kneel', t: E.t + 0.6, t1: E.t + 30 });
E.wait(2.0, { cam: 'mid', on: 'youming' });
E.say('youming', '……人心……竟然……', '...Men’s hearts... could...', { act: 'shock', close: true });
E.say('wuya', '阿彌陀佛。帝君，人心會碎，可碎了的人心，還會再長回來。', 'Amitabha. Emperor — men’s hearts do break. But broken hearts grow back again.', { to: 'youming' });
E.A('youming', { do: 'fall', t: E.t + 0.4, t1: E.t + 1.2 }, { do: 'die', t: E.t + 0.4 });
E.sfx('qiburst', { at: [1504, 1.0, 0], k: 2.6, col: '#c040ff', dt: 0.6 }); E.wait(2.6, { cam: 'wide' });
E.narrate('幽冥之門，在萬劍與一池蓮光之中，緩緩地合上了。', 'Amid ten thousand swords and a pond’s worth of lotus light, the gate of the Netherworld slowly closed.', { wide: true });

// ---------------------------------------------------------------- dawn, over the clouds
E.scene('cliff', { sky: 'dawn', mood: 'grand', place: { luo: [-0.4, 0.4, 90], wei: [1.6, 1.4, -90], ling: [-1.6, -1.2, 60], yan: [-0.8, -1.8, 40], wuya: [2.4, -1.0, -120], baihe: [3.2, 0.6, -110], yue: [-2.6, 1.8, 90], guhong: [-2.8, 0.2, 90], qian: [0.6, -2.6, 30], yinyang: [5.4, 2.6, -120] } });
E.narrate('太虛峰。雲海之上，太陽，又一次升了起來。', 'Void Peak. Above the sea of clouds, the sun rose once again.');
E.say('luo', '天機策。兩卷，都在這裡了。', 'The Celestial Stratagem. Both halves, here.', { act: 'whisk', cam: 'mid' });
E.say('baihe', '你真的要燒？算盡天下每一步棋的書，你捨得？', 'You really mean to burn it? A book that foresees every move under heaven — you can bear to?', { to: 'luo', act: 'think' });
E.say('luo', '天機不可盡知。人心，方是天機。', 'Heaven’s design cannot be wholly known. Men’s hearts — those are heaven’s design.', { to: 'baihe', close: true });
E.sfx('qiburst', { at: [299.6, 1.0, 0.6], k: 1.4, col: '#ffa040' }); E.sfx('leaves', { at: [299.6, 1.4, 0.6], k: 1.4, col: '#ffc060' }); E.hit(E.t, 1.0);
E.wait(2.0, { cam: 'close', on: 'luo' });
E.say('wuya', '阿彌陀佛。燒得好。', 'Amitabha. Well burned.', { to: 'luo', act: 'bow' });
E.say('wei', '洛無塵。現在，總可以真的打一場了吧？', 'Luo Wuchen. Now, at last, we can have a real fight?', { to: 'luo', act: 'point' });
E.say('luo', '好。', 'Agreed.', { to: 'wei', close: true });
E.duel('wei', 'luo', { d: 10, end: 'apart', k: 0.8 });
E.say('wei', '……還是分不出勝負。', '...Still no winner.', { to: 'luo', act: 'laugh' });
E.say('luo', '那就留到下一次。', 'Then we save it for next time.', { to: 'wei', act: 'laugh' });
E.say('yan', '凌大俠，以後……你還守著我嗎？', 'Master Ling... will you still keep me safe, from now on?', { to: 'ling' });
E.say('ling', '以後，換妳守著我。', 'From now on, you keep me safe.', { to: 'yan', close: true });
E.say('yan', '……好。', '...All right.', { to: 'ling', act: 'laugh', close: true });
E.say('qian', '洛先生！那一百兩……', 'Master Luo! That hundred taels...', { to: 'luo', act: 'bow' });
E.say('luo', '在錢兄的袖子裡。從無塵落水那天起，就在了。', 'Is in your sleeve, Brother Qian. It has been since the day Wuchen went into the water.', { to: 'qian', act: 'whisk' });
E.say('qian', '……什麼時候放的？！', '...When did you put it there?!', { to: 'luo', act: 'shock' });
E.say('yue', '洛先生，鏡湖的月亮，以後，就只是月亮了。', 'Master Luo, from now on, the moon over the Mirror Lake is only a moon.', { to: 'luo', act: 'none' });
E.say('luo', '那就好。月亮，本來就只該是月亮。', 'Good. A moon should only ever have been a moon.', { to: 'yue' });
E.act('guhong', 'bow', { d: 1.4, cam: 'close' });
E.say('yinyang', '戲演完了，本郎君也該走了。', 'The show is over. Time I was off.', { to: 'luo', act: 'fan' });
E.say('luo', '郎君下一場，要去看什麼？', 'And what will the Gentleman go to watch next?', { to: 'yinyang' });
E.say('yinyang', '下一場？哈哈……你們很快就會知道。', 'Next? Ha ha... you’ll find out soon enough.', { to: 'luo', act: 'laugh' });
E.exit('yinyang', { how: 'fade' });
E.cut({ pos: [[292, 1.4, 6], [286, 4, 12]], look: [[300, 1.0, 0], [302, 1.0, -2]], fov: 46 }).wait(5);
E.narrate('天機策化成了灰，飄進了雲海。', 'The Stratagem turned to ash, and drifted down into the sea of clouds.', { shot: false });
E.narrate('只是，沒有人知道，殷九霄去了哪裡。', 'Only, no one knew where Yin Jiuxiao had gone.', { shot: false });
E.scene('lotus', { sky: 'moon', mood: 'calm', place: { luo: [2.0, -2.2, 90], guhong: [3.6, -2.0, -90] }, est: 3 });
E.narrate('蓮心小築。一池蓮花，又變回了白色。', 'The Lotus Heart Retreat. The pond of lotus had turned white again.', { wide: true });
E.say('luo', '孤鴻，喝茶。', 'Gu Hong — tea.', { to: 'guhong', act: 'whisk' });
E.act('guhong', 'bow', { d: 1.4, cam: 'mid' });
E.say('luo', '上一次，無塵斟了兩杯，一杯給自己，一杯給要殺我的人。', 'Last time, Wuchen poured two cups: one for himself, one for the man who came to kill him.', { to: 'guhong' });
E.say('luo', '這一次，兩杯茶，都有人喝了。', 'This time, both cups have someone to drink them.', { to: 'guhong', close: true });
E.act('guhong', 'laugh', { d: 1.6, cam: 'close' });
E.narrate('一蓮開時天下靜，半笑之間局已成。江湖，再會。', 'When the lotus opens, all under heaven is still; between half a smile and the next, the game is won. Until we meet again.', { shot: false });
export default E.done();
