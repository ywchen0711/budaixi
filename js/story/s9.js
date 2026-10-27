// 《天機策》第九集　天機逆轉 / Episode 9: The Stratagem Turns. About ten minutes.
// The Mirror King brings the Earthly Scroll; Yin Jiuxiao breaks the three seals and opens the Heavenly Sword Manual —
// blank pages. "Pavilion Master, is the Stratagem a good read?" Luo Wuchen comes back up out of the lotus pond: the
// death was his own, the red lotus cinnabar he planted, the blank book Qian Bu'er's work. Yin Jiuxiao shows his true
// heart and falls. Then the sky over the Pavilion turns violet and the Netherworld Emperor himself comes up into the
// world, and takes both halves away.
import { episode } from './compose.js?v=12';
import { poemOf } from './world.js?v=12';

const E = episode({
  id: 's9', plaque: '天機逆轉',
  title: { zh: ['掌中劍・天機策', '第九集　天機逆轉', ''], en: ['THE CELESTIAL STRATAGEM', 'Episode 9: The Stratagem Turns', ''] },
  end: { zh: ['天機策　第九集　天機逆轉', '萬劍歸蓮　最終回'], en: ['THE CELESTIAL STRATAGEM — Episode 9', 'Next: the final episode'] },
  cast: ['yin', 'jingwang', 'luo', 'guhong', 'qian', 'wei', 'yan', 'ling', 'baihe', 'wuya', 'yue', 'youming', 'ye', 'yinyang'],
});

// ---------------------------------------------------------------- the lotus pond, the night before: out of the water
E.open('lotus', { sky: 'moon', mood: 'sad', place: { yue: [0.6, 4.4, 180], qian: [-0.8, 4.0, 170] } });
E.narrate('第七夜，三更。蓮心小築的池水，又冒了一次泡。', 'The seventh night, in the third watch. The water of the Lotus Heart Retreat bubbled once again.', { wide: true });
E.sfx('qiburst', { at: [900.4, -0.3, 7.2], k: 0.8, col: '#d8ffd0' });
E.enter('luo', { how: 'leap', at: [0.2, 5.6], from: [0, 3], face: 'yue', aura: 2, gong: false, weapon: false });
E.say('qian', '鬼……鬼啊！', 'A g— a ghost!', { to: 'luo', act: 'shock' });
E.act('qian', 'fall', { d: 1.2, cam: 'mid' });
E.say('yue', '洛先生。龜息三天，你比我想的，撐得還久。', 'Master Luo. Three days of tortoise breath — you held out longer than I thought you would.', { to: 'luo' });
E.say('luo', '多謝月姑娘，在池底等了三天。', 'Thank you, Miss Yue, for waiting three days at the bottom of the pond.', { to: 'yue', act: 'bow' });
E.say('yue', '鏡王拆穿了，劍譜換了。明天，殷九霄就會翻開那本書。', 'The Mirror King is unmasked; the manual has been swapped. Tomorrow Yin Jiuxiao will open the book.', { to: 'luo' });
E.say('luo', '那明天，無塵就去看他翻書。', 'Then tomorrow, Wuchen will go and watch him read.', { to: 'yue', act: 'whisk' });
E.say('luo', '錢不二……他還好嗎？', 'Qian Bu’er... is he all right?', { to: 'yue', act: 'shock' });
E.say('yue', '只是嚇昏了。', 'He only fainted from fright.', { to: 'luo', act: 'laugh' });

// ---------------------------------------------------------------- the Pavilion: the book opened
E.scene('hall', { sky: 'moon', mood: 'dark', place: { yin: [6.4, 0, -90] } });
E.narrate('第八夜。千面鏡王，帶著地機卷，走進了龍淵閣。', 'The eighth night. The Mirror King walked into the Dragon Abyss Pavilion with the Earthly Scroll.', { wide: true });
E.enter('jingwang', { how: 'walk', at: [3.8, -0.6], from: [-4, -1], face: 'yin', aura: 2, gong: false, weapon: false });
E.say('jingwang', '閣主。地機卷，帝君的禮物。', 'Pavilion Master. The Earthly Scroll — a gift from the Emperor.', { to: 'yin', act: 'bow' });
E.say('yin', '帝君的禮物……鏡王，九霄現在很想知道，收下這份禮，要付多少代價。', 'A gift from the Emperor... Mirror King, I should very much like to know what price comes with it.', { to: 'jingwang', act: 'fan' });
E.say('jingwang', '翻開它，閣主就知道了。', 'Open it, and the Pavilion Master will know.', { to: 'yin', act: 'laugh' });
E.say('yin', '儒門之印、太虛之令、佛門之印。三道封印，今夜，一起打開。', 'The Confucian seal, the Void token, the Buddhist seal. Tonight, all three come open together.', { act: 'none', cam: 'low' });
E.act('yin', 'qi', { d: 3.0, k: 1.3, col: '#c8a0ff', cam: 'mid' });
E.sfx('qiburst', { at: [606.4, 1.2, 0], k: 1.8, col: '#ffe080' }); E.sfx('flash', { k: 0.5 }); E.hit(E.t, 1.5); E.music.push({ hit: 'gong', t: E.t, g: 0.9 });
E.wait(1.6, { cam: 'wide' });
E.say('yin', '天劍譜，地機卷。天機策……', 'The Heavenly Sword Manual. The Earthly Scroll. The Celestial Stratagem...', { act: 'think', close: true });
E.act('yin', 'think', { d: 2.0, cam: 'close' });
E.say('yin', '……空白的？', '...Blank?', { act: 'shock', close: true });
E.say('yin', '天劍譜，是一本白紙？！', 'The Heavenly Sword Manual is blank paper?!', { act: 'angry', cam: 'mid' });
E.say('jingwang', '不可能……燕飛霜親手交給你的……', 'Impossible... Yan Feishuang gave it to you with her own hands...', { to: 'yin', act: 'shock' });
// the voice from the dark
E.say('luo', '殷閣主，天機策，好看嗎？', 'Pavilion Master — is the Stratagem a good read?', { cam: 'wide' });
E.say('yin', '……這個聲音……', '...That voice...', { act: 'shock', close: true });
E.sfx('leaves', { at: [600, 6, 0], k: 1.6, col: '#d8ffd0' });
E.enter('luo', { how: 'lotus', at: [0.2, 0.0], face: 'yin', poem: [['蓮落池中三日夢，', 'The lotus fell into the pond and dreamed three days;'], ['花開依舊笑春風。', 'it opens again, smiling at the spring wind as before.']], k: 1.6, aura: 6 });
E.say('yin', '洛無塵！你……你不是死了嗎？！', 'Luo Wuchen! You... aren’t you dead?!', { to: 'luo', act: 'shock' });
E.say('luo', '閣主親眼看見無塵落水，可閣主沒有看見，無塵從水裡出來。', 'The Pavilion Master saw Wuchen go into the water. He did not see Wuchen come out of it.', { to: 'yin', act: 'whisk' });
for (const [id, x, z] of [['wei', -3.4, 2.4], ['yan', -3.0, -2.2], ['ling', -4.2, -1.0], ['baihe', -4.6, 2.8], ['wuya', -5.6, 0.4], ['yue', -2.0, 3.2], ['guhong', -1.6, -3.2], ['qian', -5.0, -2.6]]) { E.enter(id, { how: 'walk', at: [x, z], from: [-4, 0], face: 'yin', aura: 1, gong: false, weapon: false }); E.t -= 3.6; }
E.t += 3.4;

// ---------------------------------------------------------------- how it was done
E.say('jingwang', '中了夜無極的九掌，沒有人活得下來！', 'No one survives the Nine Palms of Ye Wuji!', { to: 'luo', act: 'angry' });
E.say('luo', '所以，無塵在中掌之前，就已經死了。', 'Which is why Wuchen was already dead before the palm struck him.', { to: 'jingwang', act: 'whisk' });
E.say('yue', '鏡湖的龜息之法。心跳停了，血也冷了，三天之內，跟死人一模一樣。是我教他的。', 'The tortoise breath of the Mirror Lake. The heart stops, the blood goes cold, and for three days you are no different from a dead man. I taught it to him.', { to: 'jingwang', act: 'point' });
E.say('jingwang', '月清寒……妳！', 'Yue Qinghan... you!', { to: 'yue', act: 'angry', close: true });
E.say('luo', '至於那一池紅蓮——是無塵三個月前，親手種下的硃砂。夜裡一受震動，就會化開。', 'As for that pond of red lotus — Wuchen planted the cinnabar himself, three months ago. Shaken in the night, it dissolves.', { to: 'yin', act: 'whisk' });
E.say('wei', '……三個月前？你三個月前，就算到了今天？', '...Three months ago? Three months ago you already foresaw today?', { to: 'luo', act: 'shock' });
E.say('luo', '魏兄，無塵說過，我算不到的，是人心。可是殷閣主的心，太好算了。', 'Brother Wei, Wuchen told you: what I cannot foresee is men’s hearts. But the Pavilion Master’s heart was all too easy to reckon.', { to: 'wei', act: 'laugh' });
E.say('qian', '還有我！還有我！閣主桌上的那本天劍譜，是我換的！真的那本，在這裡！', 'And me! And me! The manual on the Pavilion Master’s desk — I swapped it! The real one is here!', { to: 'yin', act: 'point' });
E.say('yin', '你……你什麼時候……', 'You... when did you...', { to: 'qian', act: 'angry' });
E.say('qian', '就是你送鏡王出門的那一夜！洛先生說，閣主送客的時候，最不會回頭看自己的桌子！', 'The night you saw the Mirror King out! Master Luo said that when the Pavilion Master sees a guest out, he never looks back at his desk!', { to: 'yin', act: 'laugh' });
E.say('qian', '一百兩！這是我這輩子，賺得最值的一百兩！', 'A hundred taels! The best hundred taels I ever earned!', { act: 'laugh', close: true });
E.move('qian', -3.4, -2.0, { d: 1.2, face: 'yan', shot: false });
E.say('qian', '燕姑娘，物歸原主。', 'Miss Yan — back to its rightful owner.', { to: 'yan', act: 'bow' });
E.say('yan', '……洛先生，你從頭到尾，都在騙我們？', '...Master Luo — you were deceiving us all from beginning to end?', { to: 'luo', act: 'angry' });
E.say('luo', '騙你們，是因為只有你們真的傷心，殷閣主才會真的相信。燕姑娘，對不起。', 'I deceived you because only if you truly grieved would the Pavilion Master truly believe. Miss Yan — forgive me.', { to: 'yan', act: 'bow' });
E.say('yan', '……下次，至少告訴我一聲。', '...Next time, at least tell me.', { to: 'luo', close: true });
E.say('luo', '殷閣主。無塵說過，一個人，只有在他以為贏了的時候，才會把真心拿出來。', 'Pavilion Master. Wuchen once said that a man shows his true heart only when he believes he has won.', { to: 'yin' });
E.say('luo', '閣主拆開三道封印、翻開天機策的那一刻，三教，都看見了。', 'The moment you broke the three seals and opened the Stratagem, all three Teachings saw it.', { to: 'yin', close: true });
E.say('baihe', '殷兄。你那壺酒，原來是這個味道。', 'Brother Yin. So that is what your wine tasted of.', { to: 'yin', act: 'none' });
E.say('wuya', '阿彌陀佛。殷施主，回頭吧。', 'Amitabha. Yin Jiuxiao — turn back.', { to: 'yin' });

// ---------------------------------------------------------------- the true heart
E.say('yin', '回頭？……哈。哈哈哈哈！', 'Turn back? ...Ha. Ha ha ha ha!', { act: 'laugh', cam: 'low' });
E.say('yin', '天下這盤棋，憑什麼要讓三教共議？憑什麼要讓一個和尚、一個酒鬼、一個閒雲野鶴，來決定天下？', 'Why should the game of the world be decided by three Teachings together? Why should a monk, a drunkard and an idle crane decide all under heaven?', { act: 'angry', cam: 'mid' });
E.say('yin', '九霄讀了三十年聖賢書，書裡寫的，全是一個人，就能讓天下太平！', 'I have read the books of the sages for thirty years, and every page says: one man alone can bring peace to all under heaven!', { act: 'point', close: true });
E.say('luo', '書裡寫的那個人，不是閣主。', 'The man in those books is not the Pavilion Master.', { to: 'yin', close: true });
E.say('yin', '那就讓九霄，親手改寫！', 'Then I shall rewrite them with my own hand!', { to: 'luo', act: 'angry' });
E.move('yin', 2.4, 0.2, { d: 0.6, glide: true, face: 'luo', shot: false });
E.duel('yin', 'luo', { d: 16, end: 'apart', k: 1.3 });
E.say('wei', '洛無塵，這一個，分我一半！', 'Luo Wuchen — half of this one is mine!', { to: 'luo', act: 'angry' });
E.move('wei', 2.0, -1.4, { d: 0.6, glide: true, face: 'yin', shot: false });
E.duel('wei', 'yin', { d: 10, end: 'apart', k: 1.3 });
E.strike('yin', 'wei', { kind: 'wave', name: ['九霄扇風！', 'Wind of the Nine Heavens!'], result: 'blocked', col: '#c8a0ff' });
E.strike('luo', 'yin', { kind: 'array', name: ['蓮華劍氣・三千界！', 'Lotus Sword Light: Three Thousand Worlds!'], result: 'down', power: 1.4, hold: 40 });
E.say('yin', '……九霄……輸了？', '...I... have lost?', { act: 'shock', close: true });
E.move('jingwang', 1.0, -1.8, { d: 0.6, glide: true, face: 'yan', shot: false });
E.say('jingwang', '天劍譜，給我！', 'The Heavenly Sword Manual — give it to me!', { to: 'yan', act: 'point' });
E.move('yue', 0.4, -1.4, { d: 0.5, glide: true, face: 'jingwang', shot: false });
E.duel('yue', 'jingwang', { d: 10, end: 'apart', k: 1.2 });

// ---------------------------------------------------------------- the sky turns violet
E.sky.push([E.t + 0.4, 'abyss', E.t - 1.5]);
E.sfx('shake', { k: 0.12 }); E.wait(1.6, { cam: 'wide' });
E.say('wuya', '……天，變色了。', '...The sky has changed colour.', { act: 'shock', cam: 'mid' });
E.sfx('qiburst', { at: [607, 8, 0], k: 3.0, col: '#c040ff' }); E.hit(E.t, 1.8); E.music.push({ hit: 'gong', t: E.t, g: 1.2 });
E.enter('youming', { how: 'descend', at: [5.4, 0.0], from: [2, 0], face: 'luo', poem: poemOf('youming'), col: '#c040ff', k: 2.4, aura: 10 });
E.say('youming', '天機策合一的時候，到了。', 'The hour when the Stratagem is made whole has come.', { to: 'luo', act: 'none' });
E.enter('ye', { how: 'descend', at: [4.2, 2.2], from: [2, 2], face: 'ling', col: '#c040ff', aura: 3, gong: false });
E.say('luo', '幽冥帝君。你等的，原來是這一刻。', 'The Netherworld Emperor. So this is the moment you were waiting for.', { to: 'youming', act: 'whisk' });
E.say('youming', '洛無塵，你很聰明。你騙過了殷九霄，騙過了鏡王，可你騙不過天機——', 'Luo Wuchen, you are very clever. You fooled Yin Jiuxiao, you fooled the Mirror King — but you cannot fool heaven’s design —', { to: 'luo', act: 'point' });
E.say('youming', '兩卷天機策，此刻，就在這一間屋子裡。', 'both halves of the Stratagem are, at this moment, in this one room.', { to: 'luo', close: true });
E.say('ye', '凌雲霄。這一次，在帝君面前，本尊陪你玩。', 'Ling Yunxiao. This time, before my Emperor, I’ll play with you.', { to: 'ling', act: 'laugh' });
E.move('ling', 2.0, 1.2, { d: 0.6, glide: true, face: 'ye', shot: false });
E.duel('ling', 'ye', { d: 12, end: 'apart', k: 1.3 });
E.strike('youming', 'yan', { kind: 'palm', result: 'down', col: '#c040ff', power: 1.6, knock: 2.0, hold: 20 });
E.say('ye', '天劍譜，到手了。', 'The Heavenly Sword Manual — taken.', { act: 'laugh', cam: 'mid' });
E.say('jingwang', '地機卷，也在這裡。', 'And the Earthly Scroll is here.', { act: 'bow', cam: 'mid' });
E.say('ling', '燕姑娘！', 'Miss Yan!', { to: 'yan', act: 'shock', close: true });
E.say('youming', '殷九霄。你這顆棋，用完了。', 'Yin Jiuxiao. You are a piece that has been used up.', { to: 'yin', close: true });
E.strike('youming', 'yin', { kind: 'palm', result: 'down', col: '#c040ff', power: 1.2, knock: 3.0, hold: 60 });
E.sfx('qiburst', { at: [605, 1.2, 0], k: 3.2, col: '#c040ff' }); E.sfx('shake', { k: 0.2 }); E.hit(E.t, 1.8);
for (const id of ['wei', 'ling', 'baihe', 'yue']) E.act(id, 'stagger', { d: 0.1, k: 1.6, wait: false });
E.wait(1.4, { cam: 'wide' });
E.say('youming', '天機合一，人間與幽冥之間的門，就會打開。想要回去，就到幽冥來。', 'When the Stratagem is whole, the gate between the world of men and the Netherworld will open. If you want it back — come to the Netherworld.', { act: 'laugh', cam: 'low' });
E.exit('youming', { how: 'fade', col: '#c040ff' }); E.exit('ye', { how: 'fade', col: '#c040ff' }); E.exit('jingwang', { how: 'fade' });

// ---------------------------------------------------------------- after: the gate
E.scene('hall', { sky: 'abyss', mood: 'tense', place: { luo: [0.4, 0.2, -90], wuya: [-1.0, 1.6, -60], baihe: [-1.2, -1.6, -110], wei: [-2.4, 0.8, -80], ling: [-2.0, -0.6, -90], yan: [-2.8, -1.6, -80], yue: [-0.6, 2.8, -40], guhong: [-3.6, 1.8, -80], qian: [-3.8, -2.6, -70] }, est: 2.5 });
E.say('ling', '燕姑娘，還能走嗎？', 'Miss Yan, can you walk?', { to: 'yan' });
E.say('yan', '我沒事……劍譜，被他們搶走了。', 'I’m all right... but they took the manual.', { to: 'ling', act: 'none' });
E.say('luo', '他要的，從來不是天機策。他要的，是兩卷合一的那一刻，那股能打開門的力量。', 'It was never the Stratagem he wanted. He wanted the power of the moment the two halves become one — the power that opens the gate.', { to: 'wuya', act: 'think' });
E.say('wuya', '門一開……', 'Once the gate opens...', { to: 'luo' });
E.say('luo', '人間，就是第二個幽冥。', 'the world of men becomes a second Netherworld.', { to: 'wuya', close: true });
E.say('baihe', '那殷九霄呢？', 'And Yin Jiuxiao?', { to: 'luo', act: 'think' });
E.say('qian', '不見了！剛才還趴在那裡，一眨眼，就不見了！', 'Gone! He was lying right there a moment ago — and in a blink, he’s gone!', { act: 'shock', cam: 'mid' });
E.say('luo', '讓他走吧。一顆被丟掉的棋，比誰都清楚，下棋的人在哪裡。', 'Let him go. A piece that has been thrown away knows better than anyone where the player sits.', { to: 'qian' });
E.say('wei', '洛無塵，你又算計了所有人一次。', 'Luo Wuchen, you’ve schemed against every one of us again.', { to: 'luo', act: 'angry' });
E.say('luo', '是。', 'I have.', { to: 'wei', close: true });
E.say('wei', '……下次，算計我之前，先告訴我。', '...Next time, before you scheme against me — tell me first.', { to: 'luo', act: 'point' });
E.say('luo', '告訴你，就不叫算計了。', 'If I told you, it would not be scheming.', { to: 'wei', act: 'laugh' });
E.say('wei', '這一次去幽冥，我們一起打。不演戲，不算計。', 'This time, in the Netherworld, we fight together. No acting. No scheming.', { to: 'luo' });
E.say('luo', '好。', 'Agreed.', { to: 'wei', close: true });
E.say('luo', '孤鴻。那一夜，你回頭了。', 'Gu Hong. That night, you looked back.', { to: 'guhong' });
E.act('guhong', 'bow', { d: 1.4, cam: 'close' });
E.say('luo', '無塵叫你不要回頭，你還是回頭了。所以無塵知道，你是真的朋友。', 'Wuchen told you not to look back, and still you did. That is how Wuchen knows you are a true friend.', { to: 'guhong', close: true });
E.say('wuya', '幽冥之門，不是一人一劍，能夠關上的。', 'The gate of the Netherworld cannot be closed by one man and one sword.', { to: 'baihe' });
E.say('baihe', '那就三教一起去。和尚，酒鬼，再加上一個閒雲野鶴。', 'Then the three Teachings go together. A monk, a drunkard — and an idle crane.', { to: 'wuya', act: 'laugh' });
E.say('yue', '還有鏡湖。鏡王欠我的，我要親手討回來。', 'And the Mirror Lake. What the Mirror King owes me, I will take back with my own hands.', { to: 'luo', act: 'angry' });
E.enter('yinyang', { how: 'appear', at: [3.4, 1.4], face: 'luo', aura: 2, gong: false });
E.say('yinyang', '幽冥？哈哈哈！這麼好看的戲，本郎君，怎麼能不去？', 'The Netherworld? Ha ha ha! A show this fine — how could I possibly miss it?', { to: 'luo', act: 'laugh' });
E.say('luo', '郎君要站在哪一邊？', 'And on which side will the Gentleman stand?', { to: 'yinyang', act: 'whisk' });
E.say('yinyang', '本郎君，永遠站在，最好看的那一邊。', 'I always stand on whichever side is the best to watch.', { to: 'luo', close: true });
E.narrate('天機逆轉，局中有局；可最後的一局，要在沒有日月的地方下。', 'The Stratagem has turned, a game within a game; but the last game must be played where there is no sun and no moon.');
E.narrate('萬劍歸蓮，最終一回。', 'Ten Thousand Swords Return to the Lotus — the final episode.');
export default E.done();
