// 《天機策》第三集　陰陽一笑 / Episode 3: The Yin-Yang Laugh. About ten minutes.
// On the road below the Peak of Ten Thousand Buddhas Wei Wuyou calls Luo Wuchen out at last. Before a blade is drawn,
// the Yin-Yang Gentleman appears with Yan Feishuang his prisoner: fight each other for my amusement, he says, or she
// dies. They fight, and mean it — almost. Three moves in, both turn on him. Gu Hong cuts Yan free; the Gentleman
// laughs and goes. Afterwards the two rivals take each other's measure. In the Netherworld a dead man opens his eyes.
import { episode } from './compose.js?v=12';
import { poemOf } from './world.js?v=12';

const E = episode({
  id: 's3', plaque: '陰陽一笑',
  title: { zh: ['掌中劍・天機策', '第三集　陰陽一笑', ''], en: ['THE CELESTIAL STRATAGEM', 'Episode 3: The Yin-Yang Laugh', ''] },
  end: { zh: ['天機策　第三集　陰陽一笑', '魔尊重臨　且看下回分解'], en: ['THE CELESTIAL STRATAGEM — Episode 3', 'The Demon Lord returns next'] },
  cast: ['luo', 'wei', 'yinyang', 'yan', 'guhong', 'ling', 'qian', 'youming', 'ye', 'jingwang'],
});

// ---------------------------------------------------------------- the lotus pond: a challenge delivered
E.open('lotus', { sky: 'dawn', mood: 'calm', place: { luo: [0.6, -1.4, 160], guhong: [2.6, 2.2, 220], qian: [-1.4, 2.0, 160] } });
E.narrate('蓮心小築的清晨。一封戰帖，比太陽來得還早。', 'Morning at the Lotus Heart Retreat. A challenge arrived before the sun did.');
E.say('qian', '洛先生，魏無憂托我送來的，說是十年之約，今日了斷。', 'Master Luo, Wei Wuyou asked me to bring this. He says: the ten-year promise, settled today.', { to: 'luo', act: 'bow' });
E.say('luo', '他托你送？他該知道，你的嘴，比信封還要漏風。', 'He sent you? He ought to know your mouth leaks worse than any envelope.', { to: 'qian', act: 'whisk' });
E.say('qian', '嘿嘿，所以整個江湖，現在都知道了。', 'Hee hee — which is why the whole world knows about it now.', { to: 'luo', act: 'laugh' });
E.say('luo', '那就好。這場決鬥，本來就是要給人看的。', 'Good. This duel was always meant to be watched.', { to: 'qian', close: true });
E.say('qian', '……給誰看？', '...Watched by whom?', { to: 'luo', act: 'shock' });
E.say('luo', '給那些，想看我們互相殘殺的人。孤鴻，萬佛峰下，你在暗處。', 'By those who want to see us kill each other. Gu Hong — below the Peak, keep to the shadows.', { to: 'guhong', act: 'point' });
E.act('guhong', 'bow', { d: 1.2 });
E.exit('guhong', { how: 'leap', d: [-3, 3] });

// ---------------------------------------------------------------- the temple road: the challenge
E.scene('temple', { sky: 'day', mood: 'tense', place: { wei: [-2.4, 0.6, 90] } });
E.narrate('萬佛峰下。魏無憂等這一天，已經等了十年。', 'Below the Peak of Ten Thousand Buddhas. Wei Wuyou has waited ten years for this day.');
E.say('wei', '洛無塵！你約我在這裡，人呢？', 'Luo Wuchen! You named this place — where are you?', { act: 'angry', cam: 'low' });
E.enter('luo', { how: 'glide', at: [2.0, 0.2], from: [12, 2], face: 'wei', poem: poemOf('luo') });
E.say('luo', '魏兄，十年不見，你的刀，還是這麼急。', 'Brother Wei. Ten years, and your blade is as impatient as ever.', { to: 'wei', act: 'whisk' });
E.say('wei', '少廢話。十年前那一戰，你讓了我三招。今天，我要你一招都不讓！', 'Enough talk. Ten years ago you gave me three moves. Today you give me none!', { to: 'luo', act: 'point' });
E.say('luo', '無塵沒有讓你。那一戰，是無塵輸了。', 'Wuchen gave you nothing. That fight — Wuchen lost.', { to: 'wei' });
E.say('wei', '你輸了，我卻從來沒覺得我贏過！這就是我最恨你的地方！', 'You lost — and I never once felt I had won! That is what I hate about you most!', { to: 'luo', act: 'angry', close: true });
E.say('luo', '那今天，就讓魏兄，好好地贏一次。', 'Then today, let Brother Wei win properly, once.', { to: 'wei', act: 'bow' });
// the laugh
E.wait(1.2, { cam: 'wide' });
E.say('wei', '……誰在笑？', '...Who’s laughing?', { to: 'luo', act: 'shock' });
E.enter('yinyang', { how: 'descend', at: [8.2, 0.0], from: [3, 0], face: 'luo', poem: poemOf('yinyang'), k: 1.2 });
E.say('luo', '陰陽郎君。閣下也是來看熱鬧的？', 'The Yin-Yang Gentleman. Have you come for the show as well?', { to: 'yinyang', act: 'whisk' });
E.say('yinyang', '看熱鬧？不不不。本郎君是來，請兩位看一場更熱鬧的。', 'For the show? No, no, no. I have come to give you two a better one.', { to: 'luo', act: 'laugh' });
E.say('yinyang', '帶上來！', 'Bring her!', { act: 'point', cam: 'low' });
E.enter('yan', { how: 'appear', at: [9.6, 1.6], face: 'luo', aura: 1, gong: false, weapon: false });
E.act('yan', 'kneel', { hold: 70, d: 1.4, cam: 'close' });
E.say('yan', '洛先生！別管我！', 'Master Luo! Don’t mind me!', { to: 'luo', act: 'shock' });
E.say('wei', '燕飛霜？你抓她做什麼！', 'Yan Feishuang? What do you want with her?', { to: 'yinyang', act: 'angry' });
E.say('yinyang', '她呀，是門票。你們兩個，打一場給本郎君看。', 'She? She is the price of a ticket. You two — fight for me.', { to: 'wei', act: 'fan' });
E.say('yinyang', '打得好看，我就放了她。打得不好看……', 'Fight well, and I let her go. Fight badly...', { to: 'luo', act: 'laugh' });
E.say('yinyang', '那就只好，讓她陪本郎君，看下一場了。', 'then she will have to keep me company for the next show.', { to: 'yan', close: true });
E.say('luo', '若是無塵不打呢？', 'And if Wuchen will not fight?', { to: 'yinyang' });
E.say('yinyang', '那她現在就死。哈哈哈！天下最好看的，就是正人君子，為了救人，不得不互相殘殺！', 'Then she dies now. Ha ha ha! There is nothing so fine to watch as good men forced to kill each other to save a life!', { to: 'luo', act: 'laugh' });
E.say('wei', '……洛無塵，你說呢？', '...Luo Wuchen. What do you say?', { to: 'luo' });
E.say('luo', '魏兄等了十年。那就，不必再等了。', 'Brother Wei has waited ten years. He need wait no longer.', { to: 'wei', act: 'whisk' });
E.move('luo', 0.6, 0.2, { d: 1.4, face: 'wei', shot: false, wait: false }); E.move('wei', -1.0, 0.6, { d: 1.4, face: 'luo' });
// the fight, meant; and the word between them
E.duel('luo', 'wei', { d: 26, end: 'apart', k: 1.2 });
E.say('yinyang', '好！好！再狠一點！', 'Good! Good! Harder!', { act: 'laugh', cam: 'mid' });
E.say('luo', '（三招之後，往左。）', '(After three moves — go left.)', { to: 'wei', close: true });
E.say('wei', '（……哼。）', '(...Hmph.)', { to: 'luo', close: true });
E.duel('wei', 'luo', { d: 10, end: 'apart', k: 1.3 });
E.say('yinyang', '怎麼停了？本郎君還沒看夠！', 'Why have you stopped? I haven’t seen nearly enough!', { act: 'angry', cam: 'low' });
// both at once, at him
E.move('wei', 5.2, -1.2, { d: 0.6, glide: true, face: 'yinyang', shot: false, wait: false }); E.move('luo', 5.6, 1.2, { d: 0.6, glide: true, face: 'yinyang', shot: false });
E.strike('wei', 'yinyang', { kind: 'wave', name: ['狂龍斷天！', 'Mad Dragon Severs Heaven!'], result: 'clash', colB: '#ffffff' });
E.strike('luo', 'yinyang', { kind: 'array', name: ['蓮華劍氣・三千界！', 'Lotus Sword Light: Three Thousand Worlds!'], result: 'blocked' });
E.say('yinyang', '哈……哈哈！演的？你們兩個，竟然是演給我看的！', 'Ha... ha ha! An act? The two of you were acting for me!', { to: 'luo', act: 'laugh' });
E.strike('yinyang', 'wei', { kind: 'array', name: ['陰陽逆亂！', 'Yin and Yang in Chaos!'], result: 'blocked', col: '#f0f0f0' });
E.duel('yinyang', 'luo', { d: 12, end: 'apart', k: 1.1 });
E.enter('guhong', { how: 'leap', at: [9.0, 0.4], from: [12, 3], face: 'yinyang', aura: 2, gong: false });
E.act('guhong', 'point', { d: 1.0 }).sfx('hit', { k: 0.3 });
E.exit('yan', { how: 'leap', d: [-6, 2] });
E.say('yinyang', '……連人都被搶走了。洛無塵，你從一開始，就沒打算陪我玩。', '...You’ve even taken her back. Luo Wuchen — you never meant to play my game at all.', { to: 'luo', act: 'think' });
E.say('luo', '郎君的遊戲，無塵陪過了。只是規矩，要由下棋的人定。', 'Wuchen has played your game, sir. Only the rules are set by the one who moves the pieces.', { to: 'yinyang', act: 'whisk' });
E.say('yinyang', '哈哈哈！有意思，這個江湖，越來越有意思了！', 'Ha ha ha! How amusing — this world grows more amusing every day!', { to: 'luo', act: 'laugh' });
E.say('yinyang', '下一次，本郎君會找一個，連你都算不到的遊戲。', 'Next time I will find a game even you cannot see coming.', { to: 'luo', close: true });
E.exit('yinyang', { how: 'fade' });
E.exit('guhong', { how: 'leap', d: [-4, -2] });

// ---------------------------------------------------------------- after: two rivals
E.scene('temple', { sky: 'dusk', mood: 'calm', place: { luo: [-4.0, 4.0, 90], wei: [-2.2, 4.2, -90] }, est: 3 });
E.say('wei', '你剛才那一劍，是真的想殺我。', 'That cut of yours just now — you truly meant to kill me.', { to: 'luo' });
E.say('luo', '不真，騙不了他。', 'If it had not been true, it would not have fooled him.', { to: 'wei' });
E.say('wei', '要是我沒躲開呢？', 'And if I had not dodged it?', { to: 'luo', act: 'angry' });
E.say('luo', '魏兄會躲開的。無塵算過。', 'Brother Wei would dodge it. Wuchen had worked it out.', { to: 'wei', act: 'whisk' });
E.say('wei', '……你什麼都算。連我會怎麼躲，你都算好了。', '...You work everything out. Even how I would dodge — you had it worked out.', { to: 'luo', act: 'think' });
E.say('wei', '洛無塵，我討厭你，就是因為你什麼都算得到。', 'Luo Wuchen, I hate you precisely because you can foresee everything.', { to: 'luo', close: true });
E.say('luo', '那魏兄可知道，無塵算不到的是什麼？', 'Then does Brother Wei know what it is that Wuchen cannot foresee?', { to: 'wei' });
E.say('wei', '是什麼？', 'What?', { to: 'luo' });
E.say('luo', '是人心。每一次，都是人心。', 'Men’s hearts. Every time, it is men’s hearts.', { to: 'wei', close: true });
E.say('wei', '……下次，我們真的打。不演戲，不算計。', '...Next time, we fight for real. No acting. No scheming.', { to: 'luo', act: 'point' });
E.say('luo', '好。', 'Agreed.', { to: 'wei', close: true });
E.exit('wei', { how: 'walk', d: [-7, 0] });
E.say('luo', '（陰陽郎君只愛看戲……可今天這場戲，又是誰，在台下看著我們？）', '(The Gentleman only loves a show... but today’s show — who else was in the audience, watching us?)', { act: 'think', cam: 'low' });

// ---------------------------------------------------------------- the pines behind the temple: two masks
E.scene('temple', { sky: 'dusk', mood: 'dark', place: { yinyang: [-8, -8, 45] }, est: 2.5 });
E.say('yinyang', '出來吧。站在樹後面看了一整場戲，腿不酸嗎？', 'Come out. You watched the whole show from behind that tree — aren’t your legs tired?', { act: 'laugh', cam: 'low' });
E.enter('jingwang', { how: 'appear', at: [-6.0, -6.2], face: 'yinyang', aura: 2, gong: false, weapon: false });
E.say('jingwang', '郎君好眼力。', 'The Gentleman has sharp eyes.', { to: 'yinyang', act: 'bow' });
E.say('yinyang', '千面鏡王。你那張借來的臉，戴得累不累？', 'The Mirror King. That borrowed face of yours — doesn’t it get tiring to wear?', { to: 'jingwang', act: 'fan' });
E.say('jingwang', '郎君說笑了。本王今日，戴的是自己的面具。', 'You jest, sir. Today this king wears his own mask.', { to: 'yinyang' });
E.say('yinyang', '是嗎？那龍淵閣上，喝下那杯酒的，又是誰的臉？', 'Is that so? Then on the night of the council — whose face was it that drank that cup?', { to: 'jingwang', close: true });
E.act('jingwang', 'stance', { d: 1.0, cam: 'close' });
E.say('jingwang', '……郎君知道得太多了。', '...The Gentleman knows too much.', { to: 'yinyang', act: 'angry' });
E.say('yinyang', '別緊張。本郎君不會說出去的。', 'Relax. I shan’t tell a soul.', { to: 'jingwang', act: 'laugh' });
E.say('yinyang', '說出去，戲就不好看了。我要看著你們，一個一個，把自己騙死。哈哈哈哈！', 'If I told, the show would be spoiled. I want to watch every one of you lie yourselves to death. Ha ha ha ha!', { to: 'jingwang', act: 'laugh' });
E.exit('yinyang', { how: 'fade' });
E.say('jingwang', '（這個瘋子……總有一天，本王要戴上你的臉。）', '(That madman... one day this king will wear your face.)', { close: true });
E.exit('jingwang', { how: 'fade' });

// ---------------------------------------------------------------- the stone steps at night: Yan, Ling and the Gentleman's words
E.scene('temple', { sky: 'moon', mood: 'sad', place: { yan: [4.6, 1.8, -90], ling: [3.0, 1.4, 90] }, est: 2.5 });
E.say('ling', '他有沒有傷到妳？', 'Did he hurt you?', { to: 'yan' });
E.say('yan', '沒有。他一路上都在笑，笑得我渾身發冷。', 'No. He laughed the whole way. It made my skin crawl.', { to: 'ling', act: 'shock' });
E.say('yan', '他還說了一句奇怪的話。他說：「妳知道嗎？妳身上的劍譜，是有人故意讓妳帶出來的。」', 'And he said something strange. He said: “Do you know? Someone meant for you to carry that manual out.”', { to: 'ling', act: 'think' });
E.say('ling', '故意？', 'Meant to?', { to: 'yan', close: true });
E.say('yan', '我師父死的那一夜，是誰把消息透露給血蓮的？我一直以為是巧合。', 'The night my master died — who told the Blood Lotus where we were? I always thought it was chance.', { to: 'ling' });
E.say('ling', '江湖上，沒有那麼多巧合。', 'In this world, there are not so many chances.', { to: 'yan' });
E.enter('qian', { how: 'leap', at: [1.4, -0.6], from: [-2, -3], face: 'ling', gong: false, weapon: false, aura: 1 });
E.say('qian', '兩位，有一個消息，免費送你們！', 'You two — a piece of news, free of charge!', { to: 'ling', act: 'bow' });
E.say('ling', '你錢不二，也有免費的消息？', 'Qian Bu’er gives away news for free?', { to: 'qian', act: 'shock' });
E.say('qian', '因為這個消息，我賣不出去——沒有人敢買！', 'Because nobody will buy this one — they’re all too scared!', { to: 'ling', act: 'shock' });
E.say('qian', '有人在太虛峰下，看見了血蓮的旗子。還有……一個本來應該已經死了的人。', 'Someone saw the banner of the Blood Lotus below Void Peak. And... a man who ought to be dead.', { to: 'yan', close: true });
E.say('yan', '……夜無極？', '...Ye Wuji?', { to: 'qian', act: 'shock' });
E.exit('qian', { how: 'leap', d: [4, -2] });
E.enter('luo', { how: 'glide', at: [2.0, 2.6], from: [-6, 4], face: 'yan', aura: 2, gong: false, weapon: false });
E.say('luo', '燕姑娘，妳師父遇害的那一夜，血蓮來得太準了，是不是？', 'Miss Yan — the night your master was killed, the Blood Lotus came far too surely, didn’t they?', { to: 'yan' });
E.say('yan', '洛先生也這麼想？', 'You think so too, Master Luo?', { to: 'luo', act: 'shock' });
E.say('luo', '那一夜透露消息的人，和在大會上換掉慧明的人，是同一個人。', 'Whoever gave you away that night is the same one who took Huiming’s place at the council.', { to: 'yan', act: 'whisk' });
E.say('luo', '他要劍譜離開妳師父的手，又要它離開妳的手。他一直在等，等它走到一個……他拿得到的地方。', 'He wanted the manual out of your master’s hands, and then out of yours. He has been waiting all this while for it to arrive somewhere... where he can reach it.', { to: 'yan' });
E.say('ling', '哪裡？', 'Where?', { to: 'luo' });
E.say('luo', '三教的封印之下。', 'Beneath the seals of the Three Teachings.', { to: 'ling', close: true });
E.say('ling', '夜無極若真的回來了，第一個要找的，是太虛峰。我去。', 'If Ye Wuji truly is back, the first place he will go is Void Peak. I’ll go.', { to: 'luo', act: 'point' });
E.say('luo', '凌少俠，萬事小心。這一次的夜無極……也許已經不是人了。', 'Young Master Ling, take every care. The Ye Wuji who comes this time... may no longer be a man.', { to: 'ling', act: 'think' });

// ---------------------------------------------------------------- the Netherworld: a dead man opens his eyes
E.scene('abyss', { sky: 'abyss', mood: 'dark', place: { youming: [4.2, 0, -90] } });
E.narrate('武林之下，是另一個世界。那裡沒有日月，只有火。', 'Beneath the martial world lies another. There is no sun there, no moon — only fire.', { wide: true });
E.say('youming', '夜無極。', 'Ye Wuji.', { cam: 'low' });
E.say('youming', '你墜下雲海的時候，是本帝，接住了你的魂。', 'When you fell into the sea of clouds, it was I who caught your soul.', { cam: 'mid' });
E.say('youming', '現在，本帝給你，第二條命。', 'And now I give you a second life.', { close: true });
E.sfx('qiburst', { at: [1502, 0.4, 0.2], k: 2.0, col: '#c040ff' }); E.sfx('flash', { k: 0.6 }); E.hit(E.t, 1.6);
E.wait(1.0, { cam: 'wide' });
E.enter('ye', { how: 'appear', at: [2.4, 0.2], face: 'youming', poem: poemOf('ye'), col: '#c040ff', k: 1.6 });
E.say('ye', '帝君。本尊這條命，從今以後，就是帝君的。', 'My Emperor. From this day, this life of mine is yours.', { to: 'youming', act: 'bow' });
E.say('youming', '去吧。去太虛峰。讓那些人知道，幽冥的影子，回來了。', 'Go. Go to Void Peak. Let them know the shadow of the Netherworld has returned.', { to: 'ye', act: 'point' });
E.say('ye', '帝君，那殷九霄與千面鏡王，真的可信？', 'My Emperor — Yin Jiuxiao and the Mirror King: can they truly be trusted?', { to: 'youming', act: 'think' });
E.say('youming', '殷九霄以為，他在利用鏡王。鏡王以為，他在利用殷九霄。', 'Yin Jiuxiao believes he is using the Mirror King. The Mirror King believes he is using Yin Jiuxiao.', { to: 'ye', act: 'none' });
E.say('youming', '他們都不知道，他們只是在替本帝，把兩卷天機策，送到一處。', 'Neither knows that both of them are only carrying the two halves of the Stratagem to one place — for me.', { to: 'ye', close: true });
E.say('ye', '帝君英明。', 'My Emperor is wise.', { to: 'youming', act: 'bow' });
E.say('ye', '凌雲霄……這一次，本尊要你親眼看著，你所守護的，一一毀滅。', 'Ling Yunxiao... this time I will make you watch everything you protect destroyed, one by one.', { close: true, act: 'laugh' });
E.narrate('魔影重臨，太虛峰上，風雲將變。', 'The demon’s shadow returns, and on Void Peak the winds are about to turn.');
export default E.done();
