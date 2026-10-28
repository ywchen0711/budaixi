// 《天機策》第七集　蓮君之死 / Episode 7: Death of the Lotus Guest. About ten minutes.
// Three days on. Luo Wuchen pours two cups of tea and waits. Yin Jiuxiao comes, and the Mirror King, and Ye Wuji.
// Gu Hong holds the broken bridge against the Blood Lotus, and does not look back. Luo meets the fan, then the mirror;
// then the palm of the Netherworld takes him from behind, and he goes into the water, and the white lotus turns red.
// At dawn they mourn him. Yan opens his letter: give the manual to Yin Jiuxiao. Trust me. And she does.
import { episode } from './compose.js?v=15';
import { poemOf } from './world.js?v=15';

const E = episode({
  id: 's7', plaque: '蓮君之死',
  title: { zh: ['掌中劍・天機策', '第七集　蓮君之死', ''], en: ['THE CELESTIAL STRATAGEM', 'Episode 7: Death of the Lotus Guest', ''] },
  end: { zh: ['天機策　第七集　蓮君之死', '冷月現身　且看下回分解'], en: ['THE CELESTIAL STRATAGEM — Episode 7', 'The Cold Moon appears next'] },
  cast: ['luo', 'guhong', 'yin', 'jingwang', 'ye', 'yan', 'ling', 'wei', 'baihe', 'wuya', 'qian', 'yinyang', ['e1', 'envoy'], ['e2', 'envoy'], ['e3', 'envoy'], ['e4', 'envoy']],
  set: {},
});

// ---------------------------------------------------------------- the Pavilion, at dusk: three knives
E.open('hall', { sky: 'dusk', mood: 'dark', place: { yin: [6.4, 0, -90], jingwang: [3.6, -1.2, 70], ye: [3.4, 1.6, 110] } });
E.narrate('動手之前。龍淵閣中，三把刀，第一次站在一起。', 'Before the deed. In the Pavilion, three knives stood together for the first time.', { wide: true });
E.say('ye', '殷九霄，本尊聽說，你是儒門之首。', 'Yin Jiuxiao. They tell me you are the first of the Confucians.', { to: 'yin', act: 'laugh' });
E.say('yin', '夜兄有何指教？', 'Has Brother Ye something to teach me?', { to: 'ye', act: 'fan' });
E.say('ye', '本尊只是好奇，一個讀聖賢書的人，殺起人來，手會不會抖。', 'I am only curious whether a man who reads the sages’ books has a steady hand when he kills.', { to: 'yin', close: true });
E.say('yin', '九霄的手抖不抖，今夜，夜兄自會看見。', 'Whether my hand shakes, Brother Ye will see tonight.', { to: 'ye', act: 'none' });
E.say('jingwang', '兩位，留些力氣，給洛無塵吧。', 'Gentlemen, keep some strength for Luo Wuchen.', { to: 'yin', act: 'bow' });
E.say('jingwang', '記住：洛無塵最可怕的，不是他的劍，是他的嘴。他說的每一句話，都不要信。', 'Remember: the most dangerous thing about Luo Wuchen is not his sword but his tongue. Believe nothing he says.', { to: 'ye', act: 'point' });
E.say('ye', '那就不讓他說話。一掌，就夠了。', 'Then we won’t let him talk. One palm will be enough.', { to: 'jingwang', act: 'laugh' });
E.say('yin', '（一個瘋子，一個沒有臉的人……等洛無塵死了，九霄再一個一個，收拾你們。）', '(A madman, and a man with no face... once Luo Wuchen is dead, I shall deal with each of you in turn.)', { close: true });
E.say('jingwang', '（殷九霄以為，他在利用我們。哈……）', '(Yin Jiuxiao believes he is using us. Ha...)', { close: true });

// ---------------------------------------------------------------- the Lotus Heart Retreat: two cups
E.scene('lotus', { sky: 'moon', mood: 'sad', place: { luo: [2.0, -2.2, 90], guhong: [0.0, 9.0, 0] } });
E.narrate('三天之後。蓮心小築，池上只點了一盞燈。', 'Three days later. At the Lotus Heart Retreat, only one lamp was lit over the pond.');
E.narrate('洛無塵斟了兩杯茶。一杯給自己，一杯，給要來殺他的人。', 'Luo Wuchen poured two cups of tea: one for himself, one for the man coming to kill him.', { on: 'luo' });
E.act('luo', 'think', { d: 2.0, cam: 'close' });
E.say('luo', '（孤鴻在橋頭。錢不二……應該已經得手了。剩下的，就看這一池蓮花了。）', '(Gu Hong is at the bridge. Qian Bu’er... should have done it by now. The rest is up to this pond of lotus.)', { act: 'none', close: true });
E.enter('yin', { how: 'walk', at: [-0.2, -0.8], from: [-6, -2], face: 'luo', poem: poemOf('yin') });
E.say('yin', '洛先生，九霄來赴約了。', 'Master Luo. I have come as promised.', { to: 'luo', act: 'bow' });
E.say('luo', '茶還溫著。閣主，請。', 'The tea is still warm. Please, Pavilion Master.', { to: 'yin', act: 'whisk' });
E.say('yin', '先生知道九霄要來？', 'Master Luo knew I would come?', { to: 'luo' });
E.say('luo', '無塵知道閣主要來，也知道閣主不是一個人來。', 'Wuchen knew you would come — and knew you would not come alone.', { to: 'yin', close: true });
E.say('yin', '……先生既然知道，為何不走？', '...If you knew, why did you not leave?', { to: 'luo', act: 'think' });
E.say('luo', '走了，閣主這杯茶，就沒有人陪了。', 'If I had, there would be no one to drink this cup with the Pavilion Master.', { to: 'yin', act: 'laugh' });
E.say('yin', '先生是天下最聰明的人。九霄一直很想問：先生覺得，今夜，誰會贏？', 'Master Luo is the cleverest man under heaven. I have long wanted to ask: who do you think will win tonight?', { to: 'luo', act: 'fan' });
E.say('luo', '今夜，閣主會贏。', 'Tonight, the Pavilion Master will win.', { to: 'yin', close: true });
E.say('yin', '哦？', 'Oh?', { to: 'luo', close: true });
E.say('luo', '可是天下，不只有今夜。', 'But the world has more nights than this one.', { to: 'yin', act: 'whisk' });
E.enter('jingwang', { how: 'appear', at: [3.6, -3.8], face: 'luo', aura: 2, gong: false });
E.sfx('qiburst', { at: [904, 6, 0], k: 1.4, col: '#c040ff' }); E.hit(E.t, 1.2);
E.enter('ye', { how: 'descend', at: [4.2, 0.4], from: [2, 2], face: 'luo', col: '#c040ff', aura: 3, gong: true });
E.say('ye', '洛無塵，本尊聽說，你是天下最難殺的人。', 'Luo Wuchen. They tell me you are the hardest man under heaven to kill.', { to: 'luo', act: 'laugh' });
E.say('luo', '三個人？殷閣主，你太看得起無塵了。', 'Three of you? Pavilion Master — you think far too much of Wuchen.', { to: 'yin', act: 'whisk' });
E.say('yin', '對先生，再多一個，也不嫌多。', 'For Master Luo, one more would not be too many.', { to: 'luo', act: 'bow' });

// ---------------------------------------------------------------- the broken bridge
E.cut({ pos: [900, 2.0, 15], look: [900, 1.0, 9], fov: 44 }).wait(0.2);
for (const [id, x, z] of [['e1', 0.4, 15.6], ['e2', -1.0, 16.4], ['e3', 1.2, 17.2], ['e4', -0.4, 18.0]]) { E.enter(id, { how: 'descend', at: [x, z], face: 'guhong', gong: false, aura: 1, weapon: false }); E.t -= 2.2; }
E.t += 2.4;
E.narrate('孤鴻守在斷橋。洛無塵說過：無論看見什麼，都不要回頭。', 'Gu Hong held the broken bridge. Luo Wuchen had told him: whatever you see, do not look back.', { on: 'guhong' });
E.skirmish('guhong', ['e1', 'e2', 'e3', 'e4'], { d: 18, kill: true });

// ---------------------------------------------------------------- the fan, the mirror, the palm
E.cut({ pos: [905, 2.6, 4], look: [902, 1.0, -1.5], fov: 46 }).wait(0.4);
E.move('yin', 0.6, -1.2, { d: 0.8, face: 'luo', glide: true, shot: false });
E.duel('yin', 'luo', { d: 18, end: 'apart', k: 1.2 });
E.say('yin', '先生的拂塵，比九霄想的，還要快。', 'Master Luo’s whisk is quicker than I imagined.', { to: 'luo', act: 'fan' });
E.say('luo', '閣主的扇子，比無塵想的，還要毒。', 'And the Pavilion Master’s fan more poisonous than I imagined.', { to: 'yin', act: 'whisk' });
E.strike('yin', 'luo', { kind: 'wave', name: ['九霄扇風！', 'Wind of the Nine Heavens!'], result: 'blocked', col: '#c8a0ff' });
E.move('jingwang', 0.4, 1.0, { d: 0.8, glide: true, face: 'luo', shot: false });
E.duel('jingwang', 'luo', { d: 12, end: 'apart', k: 1.2 });
E.strike('luo', 'jingwang', { kind: 'array', name: ['蓮華劍氣・三千界！', 'Lotus Sword Light: Three Thousand Worlds!'], result: 'clash', colB: '#e0e8ff', power: 1.3 });
E.say('jingwang', '好一個三千界……可惜，你的背後，沒有眼睛。', 'A fine Three Thousand Worlds... a pity you have no eyes in the back of your head.', { to: 'luo', act: 'laugh' });
// he is put by the water's edge, and the palm comes from behind
E.move('luo', 0.4, 4.4, { d: 1.2, face: 'jingwang', shot: false });
E.move('ye', 0.6, 1.2, { d: 0.6, glide: true, face: 'luo', shot: false });
E.strike('ye', 'luo', { kind: 'palm', name: ['幽冥九掌！', 'Nine Palms of the Netherworld!'], result: 'hit', col: '#c040ff', power: 1.6, knock: 2.6 });
E.A('luo', { do: 'fall', t: E.t - 1.4, t1: E.t - 0.8 }, { do: 'plunge', t: E.t - 1.0, t1: E.t + 0.4, dy: -2.4 });
E.hide('luo', E.t + 0.4);
E.sfx('qiburst', { at: [900.4, -0.3, 7.4], k: 2.0, col: '#ff2030' }); E.music.push({ hit: 'gong', t: E.t, g: 1.0 }, { tutti: 'D', t: E.t, d: 6, g: 0.5, soft: true });
E.m.set.lotusRed = E.t;
E.cut({ pos: [903, 2.2, 10], look: [900, -0.2, 6.5], fov: 48 }).wait(3.0);
E.narrate('那一夜，蓮心小築的一池白蓮，從根到花，一朵一朵，變成了紅色。', 'That night, every white lotus in the pond of the Lotus Heart Retreat turned red, from root to flower, one by one.', { wide: true });
// the one who must not look back
E.act('guhong', 'turn', { to: 'luo', d: 0.4 });
E.act('guhong', 'shock', { d: 1.6, cam: 'close' });
E.move('ye', 1.0, 9.4, { d: 1.2, glide: true, face: 'guhong' });
E.duel('ye', 'guhong', { d: 10, end: 'win:a', hold: 6 });
E.exit('guhong', { how: 'leap', d: [-4, 4] });
E.say('ye', '跑了一個。', 'One got away.', { act: 'laugh', cam: 'mid' });
E.say('yin', '不必追。主人死了，一把啞劍，成不了事。', 'Let him go. With his master dead, a mute sword can do nothing.', { to: 'ye', act: 'fan' });
E.say('jingwang', '池水這麼深，要不要撈？', 'The water is deep. Shall we drag for him?', { to: 'yin', act: 'think' });
E.say('yin', '不必。中了夜兄一掌，又落進池裡……蓮心已碎。', 'No need. One of Brother Ye’s palms, and then into the pond... the heart of the lotus is broken.', { to: 'jingwang', close: true });
E.say('yin', '天機，就在九霄手中了。', 'The Stratagem is in my hand.', { act: 'laugh', cam: 'low' });
E.exit('ye', { how: 'fade', col: '#c040ff' }); E.exit('jingwang', { how: 'fade' }); E.exit('yin', { how: 'walk', d: [-8, -2], wait: false });
// in the willows, someone who bought the best seat
E.scene('lotus', { sky: 'moon', mood: 'dark', place: { yinyang: [-12, 12, 135] }, est: 2 });
E.say('yinyang', '死了？洛無塵，就這樣死了？', 'Dead? Luo Wuchen — dead, just like that?', { act: 'shock', cam: 'low' });
E.say('yinyang', '……不對。這齣戲，太乾淨了。', '...No. This show was too neat.', { act: 'think', close: true });
E.say('yinyang', '哈哈哈！好，本郎君不走了。我倒要看看，你在池子裡，能躲多久。', 'Ha ha ha! Good — I’m staying. Let’s see how long you can hide in that pond.', { act: 'laugh', cam: 'mid' });

// ---------------------------------------------------------------- dawn: the mourning
E.scene('lotus', { sky: 'dawn', mood: 'sad', place: { yan: [0.0, 4.0, 0], ling: [-1.2, 3.4, 20], wei: [1.6, 3.2, -20], baihe: [-2.4, 2.0, 40], wuya: [2.8, 1.8, -40], qian: [-0.6, 1.8, 10], guhong: [0.8, 4.8, 0] } });
E.act('guhong', 'kneel', { hold: 90, d: 0.2, wait: false });
E.narrate('天亮了。紅蓮滿池，卻再也沒有那個帶著半分笑意的人。', 'Dawn came. The pond was full of red lotus, but the man with the half smile was gone.', { wide: true });
E.say('qian', '洛先生……你還欠我一百兩……你怎麼能就這樣走了……', 'Master Luo... you still owe me a hundred taels... how could you just go like this...', { act: 'none', cam: 'mid' });
E.say('baihe', '洛無塵，你這個閒雲野鶴，連死，都死得這麼不聲不響。', 'Luo Wuchen, you idle crane — even your death was quiet.', { act: 'none', cam: 'mid' });
E.say('wuya', '阿彌陀佛。無塵，你算盡天下，終究，沒有算到你自己。', 'Amitabha. Wuchen, you reckoned out the world, and in the end you never reckoned yourself.', { act: 'bow', cam: 'mid' });
E.say('wei', '我魏無憂，此生還沒有勝過你一次……你怎麼能死！', 'I, Wei Wuyou, have never beaten you once in my life... how dare you die!', { act: 'angry', close: true });
E.say('wei', '殷九霄！夜無極！千面鏡王！我發誓，一個都不放過！', 'Yin Jiuxiao! Ye Wuji! The Mirror King! I swear it — not one of you will escape!', { act: 'angry', cam: 'low' });
E.say('ling', '魏兄，冷靜。他們三個人聯手，連洛先生都……', 'Brother Wei, steady. The three of them together — even Master Luo...', { to: 'wei' });
E.say('wei', '那又怎樣？我的刀，不怕死！', 'So what? My blade isn’t afraid to die!', { to: 'ling', act: 'angry' });
E.say('yan', '……洛先生，給我留了一封信。', '...Master Luo left me a letter.', { to: 'ling', act: 'think' });
E.act('yan', 'think', { d: 1.6, cam: 'close' });
E.say('luo', '燕姑娘：若無塵身死，請將劍譜，交給殷九霄。', 'Miss Yan: if Wuchen is dead, give the manual to Yin Jiuxiao.', { act: 'none', cam: 'wide' });
E.say('luo', '不必問為什麼。相信我。', 'Do not ask why. Trust me.', { act: 'none', shot: false });
E.say('ling', '交給殷九霄？他就是兇手！', 'Give it to Yin Jiuxiao? He is the murderer!', { to: 'yan', act: 'shock' });
E.say('wei', '洛無塵死了，腦子也壞了嗎？', 'Did Luo Wuchen lose his mind as well as his life?', { to: 'yan', act: 'angry' });
E.say('yan', '洛先生說，相信他。', 'Master Luo said: trust him.', { to: 'ling', close: true });
E.say('ling', '燕姑娘……', 'Miss Yan...', { to: 'yan' });
E.say('yan', '從大會到現在，他說的每一句話，都是對的。這一次，我也相信他。', 'From the council until now, every single thing he told us came true. This time, too, I believe him.', { to: 'ling', act: 'none' });
// the mourner who is not one
E.enter('yin', { how: 'walk', at: [-3.4, 0.6], from: [-8, -1], face: 'yan', aura: 1.5, gong: false, weapon: false });
E.say('yin', '九霄聽說洛先生遇害，特來弔唁。', 'I heard that Master Luo was murdered, and have come to mourn him.', { to: 'baihe', act: 'bow' });
E.say('wei', '殷九霄，你還敢來！', 'Yin Jiuxiao — you dare come here!', { to: 'yin', act: 'angry' });
E.say('yin', '魏兄何出此言？洛先生之死，九霄與諸位一樣痛心。', 'Why say such a thing, Brother Wei? Master Luo’s death grieves me as much as any of you.', { to: 'wei', act: 'fan' });
E.move('yan', -1.8, 1.4, { d: 1.6, face: 'yin' });
E.say('yan', '殷閣主。這是天劍譜。洛先生說，交給你。', 'Pavilion Master. Here is the Heavenly Sword Manual. Master Luo said to give it to you.', { to: 'yin', act: 'point' });
E.say('yin', '……燕姑娘深明大義。九霄，必定替天下，好好守著它。', '...Miss Yan understands the greater good. I shall guard it well, for all under heaven.', { to: 'yan', act: 'bow' });
E.say('yin', '（洛無塵啊洛無塵，你到死，都在替九霄鋪路。）', '(Luo Wuchen, Luo Wuchen — even in death, you pave my road for me.)', { close: true, act: 'none' });
E.exit('yin', { how: 'walk', d: [-8, -1] });
E.say('wei', '燕飛霜，妳瘋了嗎！', 'Yan Feishuang — have you gone mad!', { to: 'yan', act: 'angry' });
E.say('yan', '也許吧。可我寧願瘋，也不願意不相信他。', 'Perhaps. But I would rather be mad than not believe him.', { to: 'wei', close: true });
E.say('wei', '你們等，我不等。我現在就去龍淵閣，砍了殷九霄！', 'You can wait. I won’t. I’m going to the Pavilion right now to cut Yin Jiuxiao down!', { to: 'ling', act: 'angry' });
E.move('ling', 0.4, 2.2, { d: 0.6, glide: true, face: 'wei', shot: false });
E.say('ling', '你去，就是送死。', 'If you go, you die.', { to: 'wei', close: true });
E.say('wei', '那又怎樣？讓開！', 'So what? Out of my way!', { to: 'ling', act: 'angry' });
E.duel('wei', 'ling', { d: 12, end: 'apart', k: 1.2 });
E.say('ling', '洛先生要我們相信他。他從來不做白白送死的事——也不會讓我們去送死。', 'Master Luo asked us to trust him. He never threw a life away for nothing — and he would not want us to.', { to: 'wei' });
E.say('wei', '……我恨他。他死了，還要管著我。', '...I hate him. He’s dead, and he’s still telling me what to do.', { to: 'ling', act: 'none', close: true });
E.say('baihe', '老和尚……那一夜，貧道錯怪你了。左手出掌的人，不是你。', 'Old monk... I wronged you that night. The one who struck with his left hand was not you.', { to: 'wuya', act: 'bow' });
E.say('wuya', '阿彌陀佛。白鶴，你沒有錯。錯的，是那張臉。', 'Amitabha. Baihe, you did no wrong. The face did.', { to: 'baihe' });
E.say('baihe', '那張臉，害死了我師兄，害死了洛無塵。貧道這把劍，不會再喝酒了。', 'That face killed my elder brother, and killed Luo Wuchen. This sword of mine will drink no more wine.', { to: 'wuya', act: 'angry' });
E.act('guhong', 'point', { d: 1.6, cam: 'mid' });
E.say('ling', '孤鴻，你想說什麼？', 'Gu Hong — what are you trying to tell us?', { to: 'guhong' });
E.act('guhong', 'point', { d: 1.4, cam: 'close' });
E.say('yan', '他在指池子……他在說，洛先生叫他，不要回頭。', 'He is pointing at the pond... he is saying that Master Luo told him not to look back.', { to: 'ling', act: 'think' });
E.say('ling', '可他回頭了。', 'But he did look back.', { to: 'yan', close: true });
E.say('yan', '所以他才這麼難過。', 'That is why it hurts him so.', { to: 'ling', act: 'none' });
E.say('qian', '（洛先生交代的事，我已經辦好了……可是，洛先生，你人呢？）', '(I did what Master Luo told me... but Master Luo — where are you?)', { close: true, act: 'think' });

// ---------------------------------------------------------------- the Pavilion, that night: the pawn
E.scene('hall', { sky: 'moon', mood: 'dark', place: { yin: [6.4, 0, -90], jingwang: [3.6, -1.0, 70] }, est: 2.5 });
E.say('yin', '天劍譜到手了。三道封印也在這裡。鏡王，地機卷呢？', 'The Heavenly Sword Manual is mine. The three seals are here. Mirror King — the Earthly Scroll?', { to: 'jingwang', act: 'fan' });
E.say('jingwang', '地機卷，本王會親手奉上。在帝君點頭之後。', 'This king will place the Earthly Scroll in your hands himself. Once the Emperor nods.', { to: 'yin', act: 'bow' });
E.say('yin', '……帝君？', '...The Emperor?', { to: 'jingwang', act: 'shock', close: true });
E.say('jingwang', '閣主不知道嗎？夜無極的主人，也是本王的主人。幽冥帝君。', 'Did the Pavilion Master not know? Ye Wuji’s master is this king’s master too. The Netherworld Emperor.', { to: 'yin', act: 'laugh' });
E.say('yin', '你……你從頭到尾，都是幽冥的人？', 'You... you were the Netherworld’s man from the very beginning?', { to: 'jingwang', act: 'angry' });
E.say('jingwang', '閣主以為，你在利用本王。帝君以為，閣主是一顆好棋。本王以為……兩位說得都對。', 'The Pavilion Master believed he was using this king. The Emperor believes the Pavilion Master is a fine piece on his board. And this king believes... you are both right.', { to: 'yin', close: true });
E.exit('jingwang', { how: 'fade' });
E.say('yin', '……一顆棋？', '...A piece on his board?', { act: 'shock', cam: 'low' });
E.say('yin', '九霄這一生，從來只下棋，不做棋。', 'In all my life I have moved the pieces. I have never been one.', { close: true, act: 'fan' });
E.act('guhong', 'think', { d: 0.1, wait: false });
E.narrate('清蓮已謝，天機誰解？', 'The lotus has withered. Who now can read the Stratagem?');
E.narrate('池水深處，有沒有人，在等一個回頭的時機？', 'In the deeps of the pond — is someone waiting for the moment to turn back?');
export default E.done();
