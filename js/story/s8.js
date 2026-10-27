// 《天機策》第八集　鏡中真相 / Episode 8: Truth in the Mirror. About ten minutes.
// "Huiming" has come back from the dead to the Peak, accusing Yan and the Buddha both. On the road, the Cold Moon
// Fairy stops the four of them: she came from the Mirror Lake; she knows the Mirror King's two arts — faces taken
// from the dead, and puppet doubles so like a man they fool everyone, except that they grow cold too fast. The real
// Huiming lies buried at the Mirror Lake by her own hand. On the Peak, Wei tests "Huiming" with his blade; the left
// hand gives him away; the mask comes off. In the Netherworld the Emperor gives his order: let Yin open the book.
import { episode } from './compose.js?v=12';
import { poemOf } from './world.js?v=12';

const E = episode({
  id: 's8', plaque: '鏡中真相',
  title: { zh: ['掌中劍・天機策', '第八集　鏡中真相', ''], en: ['THE CELESTIAL STRATAGEM', 'Episode 8: Truth in the Mirror', ''] },
  end: { zh: ['天機策　第八集　鏡中真相', '天機逆轉　且看下回分解'], en: ['THE CELESTIAL STRATAGEM — Episode 8', 'The Stratagem turns next'] },
  cast: ['ling', 'yan', 'wei', 'guhong', 'qian', 'yue', 'huiming', 'jingwang', 'wuya', 'baihe', 'youming', 'yinyang', 'yin'],
});

// ---------------------------------------------------------------- the Pavilion: the master and his visitor
E.open('hall', { sky: 'dusk', mood: 'dark', place: { yin: [6.4, 0, -90] } });
E.narrate('龍淵閣。天劍譜與三道封印，擺在殷九霄的案前，已經七天了。', 'The Dragon Abyss Pavilion. For seven days the Heavenly Sword Manual and the three seals have lain on Yin Jiuxiao’s desk.', { wide: true });
E.say('yin', '七天了。鏡王，你的地機卷，還要讓九霄等多久？', 'Seven days. Mirror King — how much longer must I wait for your Earthly Scroll?', { act: 'fan', cam: 'low' });
E.enter('yinyang', { how: 'appear', at: [2.6, 1.2], face: 'yin', aura: 2, gong: false });
E.say('yinyang', '等不到的。殷閣主，你就算等到死，也只是一顆，等著被吃掉的棋。', 'You’ll never have it. Pavilion Master, wait till you die — you are only a piece waiting to be taken.', { to: 'yin', act: 'laugh' });
E.say('yin', '陰陽郎君。龍淵閣，什麼時候變成誰都能進來的地方了？', 'The Yin-Yang Gentleman. Since when has the Pavilion been a place anyone may walk into?', { to: 'yinyang', act: 'angry' });
E.say('yinyang', '從你把三道封印擺在桌上的那一天開始。哈哈，天下人都在看著你這張桌子。', 'Since the day you laid three seals on your desk. Ha ha — the whole world is watching that desk of yours.', { to: 'yin', act: 'point' });
E.say('yin', '滾。', 'Get out.', { to: 'yinyang', close: true });
E.say('yinyang', '好好好。只是送你一句話：翻開那本書之前，先想一想，誰最希望你翻開它。', 'All right, all right. Just one thing before I go: before you open that book, think about who most wants you to.', { to: 'yin', act: 'fan' });
E.move('yin', 3.8, 0.6, { d: 0.6, glide: true, face: 'yinyang', shot: false });
E.duel('yin', 'yinyang', { d: 8, end: 'apart', k: 1.0 });
E.say('yinyang', '哈哈哈！生氣了？生氣，就說明你也怕了！', 'Ha ha ha! Angry? Then you’re afraid too!', { to: 'yin', act: 'laugh' });
E.exit('yinyang', { how: 'fade' });
E.say('yin', '……誰最希望九霄翻開它？', '...Who most wants me to open it?', { act: 'think', close: true });

// ---------------------------------------------------------------- the bamboo: the dead come back
E.scene('bamboo', { sky: 'moon', mood: 'sad', place: { ling: [-3.0, 0.4, 90], yan: [-3.6, -0.5, 90], wei: [-2.0, 1.4, 90], guhong: [-4.6, 0.6, 90] } });
E.narrate('洛無塵死後第七天。四個人，往鏡湖的方向走。', 'The seventh day after Luo Wuchen’s death. Four people walk toward the Mirror Lake.');
E.move('ling', -0.6, 0.4, { d: 3.0, wait: false }); E.move('yan', -1.2, -0.5, { d: 3.0, shot: false, wait: false }); E.move('wei', 0.2, 1.4, { d: 3.0, shot: false, wait: false }); E.move('guhong', -1.8, 0.8, { d: 3.0, shot: false });
E.say('wei', '鏡湖？就憑老和尚一句話，我們就要去鏡湖？', 'The Mirror Lake? On one word from an old monk, we go to the Mirror Lake?', { to: 'ling', act: 'angry' });
E.say('ling', '慧明去了鏡湖，就再也沒有回來。這是我們唯一的線索。', 'Huiming went to the Mirror Lake and never came back. It is the only thread we have.', { to: 'wei' });
E.say('yan', '洛先生如果還在，他一定早就去了。', 'If Master Luo were still here, he would have gone long ago.', { to: 'ling', act: 'none' });
E.say('wei', '別提他了。一提他，我就想砍人。', 'Don’t talk about him. Every time you do, I want to cut someone.', { to: 'yan', act: 'angry' });
E.enter('qian', { how: 'leap', at: [1.8, -1.0], from: [5, -3], face: 'ling', gong: false, weapon: false, aura: 1 });
E.say('qian', '各位！各位！萬佛峰出了大事！', 'Everyone! Everyone! Something has happened on the Peak!', { to: 'ling', act: 'shock' });
E.say('ling', '什麼事？', 'What?', { to: 'qian' });
E.say('qian', '慧明……慧明回來了！', 'Huiming... Huiming has come back!', { to: 'ling', act: 'shock', close: true });
E.say('yan', '慧明不是死了嗎？我們都看見了！', 'Isn’t Huiming dead? We all saw it!', { to: 'qian', act: 'shock' });
E.say('qian', '他說他根本沒死！大會上是他被人下毒，裝死才逃了出來。現在他在萬佛峰上，指控燕姑娘下毒，還說……是佛者指使的！', 'He says he never died! Someone poisoned him at the council and he played dead to escape. Now he’s up on the Peak, accusing Miss Yan of the poison — and saying the Buddha put her up to it!', { to: 'yan', act: 'point' });
E.say('wei', '佛者指使？……這下子，誰都說不清了。', 'The Buddha put her up to it? ...Now no one can untangle anything.', { to: 'ling', act: 'think' });
E.say('ling', '一個死人回來，指控兩個人。他回來得，太是時候了。', 'A dead man comes back and accuses two people. He has come back at exactly the right moment.', { to: 'wei', act: 'think' });

// ---------------------------------------------------------------- the Cold Moon
E.sfx('leaves', { at: [0, 5, 0], k: 1.2, col: '#d8e8ff' }); E.wait(1.0, { cam: 'wide' });
E.enter('yue', { how: 'lotus', at: [1.4, 0.4], from: [2, 2], face: 'ling', poem: poemOf('yue'), col: '#e8f0ff', k: 1.2 });
E.say('yue', '你們要去萬佛峰？那個回來的慧明，是假的。', 'You are going to the Peak? That Huiming who has come back is false.', { to: 'ling' });
E.say('wei', '妳是誰？', 'Who are you?', { to: 'yue', act: 'angry' });
E.say('yue', '鏡湖月清寒。十年前，我是千面鏡王的徒弟。', 'Yue Qinghan of the Mirror Lake. Ten years ago, I was the Mirror King’s disciple.', { to: 'wei' });
E.say('yan', '鏡王的徒弟？', 'The Mirror King’s disciple?', { to: 'yue', act: 'shock' });
E.say('yue', '他的武功，有兩樣，天下無人能及。一樣，是千面術——他能戴上任何一個死人的臉。', 'Two of his arts are matched by no one under heaven. One is the Thousand Faces — he can wear the face of anyone who has died.', { to: 'yan' });
E.say('yue', '另一樣，是替身傀儡。一具和真人一模一樣的傀儡，會說話，會走路，連倒下的樣子都一樣。', 'The other is the puppet double. A puppet so like the man that it speaks, walks — and even falls down the same way.', { to: 'ling', act: 'point' });
E.say('ling', '傀儡……', 'A puppet...', { to: 'yue', act: 'think', close: true });
E.say('yue', '它騙得過所有人的眼睛。只有一個破綻：它冷得太快。', 'It fools every eye. It has only one flaw: it grows cold too fast.', { to: 'ling', close: true });
E.say('yan', '洛先生說過！那具屍首，冷得太快，不像一個剛死的人！', 'Master Luo said that! The body went cold too fast — not like a man who had only just died!', { to: 'ling', act: 'shock' });
E.say('yue', '真正的慧明，七天前就死在鏡湖了。是我，親手埋了他。', 'The real Huiming died at the Mirror Lake before the council. I buried him myself.', { to: 'yan', act: 'none' });
E.say('yue', '在大會上倒下的，是一具傀儡。替傀儡舉杯的，才是鏡王本人。', 'What fell at the council was a puppet. The one who lifted the cup for it was the Mirror King himself.', { to: 'yan', close: true });
E.say('wei', '舉杯用左手？', 'And lifted it with his left hand?', { to: 'yue', act: 'shock' });
E.say('yue', '鏡王，是左撇子。', 'The Mirror King is left-handed.', { to: 'wei', close: true });
E.say('wei', '……殺青松子的那一掌，也是左手。', '...The palm that killed Qingsong Zi was the left hand too.', { to: 'ling', act: 'think' });
E.say('wei', '可是，我憑什麼相信妳？妳是鏡王的徒弟，說不定，妳就是下一張臉。', 'But why should I believe you? You were the Mirror King’s disciple. For all I know, you are his next face.', { to: 'yue', act: 'angry' });
E.say('yue', '你不必信我。到了萬佛峰，你自己看。', 'You need not believe me. Go to the Peak, and see for yourself.', { to: 'wei' });
E.say('yan', '妳為什麼要幫我們？', 'Why help us?', { to: 'yue' });
E.say('yue', '因為他殺了我的師妹。也因為……他騙了我十年。', 'Because he killed my younger sister in the school. And because... he lied to me for ten years.', { to: 'yan', close: true });
E.act('guhong', 'bow', { d: 1.4, cam: 'mid' });

// ---------------------------------------------------------------- the Peak: the accuser
E.scene('temple', { sky: 'day', mood: 'tense', place: { huiming: [3.4, 0.4, 90], wuya: [6.4, 0, -90], baihe: [4.6, -2.6, 40] }, est: 2.5 });
E.say('huiming', '師父！弟子差一點，就死在龍淵閣了！', 'Master! I very nearly died in the Pavilion!', { to: 'wuya', act: 'bow' });
E.say('wuya', '……慧明。你回來了。', '...Huiming. You have come back.', { to: 'huiming', act: 'none' });
E.say('huiming', '是燕飛霜在酒裡下毒！弟子裝死，才逃過一劫。師父，您為什麼……要讓她這麼做？', 'It was Yan Feishuang who poisoned the wine! I only escaped by playing dead. Master, why... why did you let her do it?', { to: 'wuya', act: 'shock' });
E.say('wuya', '老衲讓她？', 'I let her?', { to: 'huiming', close: true });
E.say('baihe', '小師父，你說佛者指使燕飛霜殺你。佛者，為什麼要殺自己的徒弟？', 'Young master — you say the Buddha set Yan Feishuang to kill you. Why would the Buddha kill his own disciple?', { to: 'huiming', act: 'think' });
E.say('huiming', '因為……因為弟子知道了，師父的秘密。', 'Because... because I learned my master’s secret.', { to: 'baihe', act: 'none' });
E.move('ling', -2.0, 0.6, { d: 2.0, face: 'huiming', wait: false }); E.move('yan', -2.6, -0.6, { d: 2.0, shot: false, wait: false }); E.move('wei', -1.6, 1.8, { d: 2.0, shot: false, wait: false }); E.move('yue', -3.0, 1.0, { d: 2.0, shot: false, wait: false }); E.move('guhong', -3.6, -1.2, { d: 2.0, shot: false });
E.say('huiming', '就是她！就是她在酒裡下毒！', 'That’s her! She’s the one who poisoned the wine!', { to: 'yan', act: 'point' });
E.say('yan', '慧明，你看著我的眼睛說。', 'Huiming. Look me in the eye and say it.', { to: 'huiming', close: true });
E.say('huiming', '……小僧……小僧親眼看見！', '...I... I saw it with my own eyes!', { to: 'yan', act: 'shock' });
E.say('yue', '慧明，你還記得，七天前在鏡湖，你最後跟我說的話嗎？', 'Huiming — do you remember the last thing you said to me, at the Mirror Lake, before the council?', { to: 'huiming' });
E.say('huiming', '妳……妳是……', 'You... you are...', { to: 'yue', act: 'shock', close: true });
E.say('yue', '你不記得。因為那一天，是你殺了他。', 'You don’t remember. Because that was the day you killed him.', { to: 'huiming', close: true });
E.say('wei', '說這麼多做什麼。是真是假，一刀便知！', 'Why so many words? True or false — one cut will tell!', { to: 'huiming', act: 'angry' });
E.move('wei', 1.8, 0.4, { d: 0.6, glide: true, face: 'huiming', shot: false });
E.duel('wei', 'huiming', { d: 8, end: 'apart', k: 1.2 });
E.strike('wei', 'huiming', { kind: 'dash', result: 'blocked', k: 1.0 });
E.say('baihe', '左手！他用左手接的刀！', 'His left! He caught the blade with his left hand!', { to: 'wuya', act: 'point' });
E.say('wuya', '慧明，從小用右手抄經。阿彌陀佛……你不是慧明。', 'Huiming copied sutras with his right hand from the time he was a child. Amitabha... you are not Huiming.', { to: 'huiming', close: true });
E.say('huiming', '……哈。哈哈哈。', '...Ha. Ha ha ha.', { act: 'laugh', close: true });
E.reveal('huiming', 'jingwang', { col: '#e0e8ff' });
E.say('jingwang', '月清寒。十年不見，妳還是這麼，不聽話。', 'Yue Qinghan. Ten years, and you are as disobedient as ever.', { to: 'yue', act: 'laugh' });
E.say('yue', '十年前，我聽了你的話。所以，我失去了一切。', 'Ten years ago I did as you told me. And so I lost everything.', { to: 'jingwang' });
E.say('jingwang', '千面之下無真我。你們拆穿了一張臉，本王，還有九百九十九張。', 'Beneath a thousand faces there is no true self. You have torn off one face — this king has nine hundred and ninety-nine more.', { to: 'wei', act: 'point' });

// ---------------------------------------------------------------- the fight
E.move('yue', 1.0, 1.0, { d: 0.8, glide: true, face: 'jingwang', shot: false });
E.duel('yue', 'jingwang', { d: 16, end: 'apart', k: 1.1 });
E.strike('yue', 'jingwang', { kind: 'array', name: ['寒月九折！', 'Nine Folds of the Cold Moon!'], result: 'blocked', col: '#e8f0ff' });
E.move('ling', 1.4, -0.8, { d: 0.6, glide: true, face: 'jingwang', shot: false });
E.duel('ling', 'jingwang', { d: 14, end: 'apart', k: 1.2 });
E.strike('jingwang', 'ling', { kind: 'array', name: ['萬象鏡光！', 'Mirror Light of Ten Thousand Forms!'], result: 'blocked', col: '#e0e8ff' });
E.say('wuya', '施主。這一掌，是老衲的右手。', 'My friend. This palm is my right hand.', { to: 'jingwang', act: 'none' });
E.move('wuya', 3.4, 0.0, { d: 1.6, face: 'jingwang', shot: false });
E.strike('wuya', 'jingwang', { kind: 'palm', name: ['大日——佛印！', 'Seal of the Great Sun!'], result: 'hit', col: '#ffd860', power: 1.8, knock: 3 });
E.say('jingwang', '……好掌。可惜，殺不了本王。', '...A fine palm. A pity it cannot kill this king.', { to: 'wuya', act: 'angry' });
E.exit('jingwang', { how: 'fade' });

// ---------------------------------------------------------------- after: two apologies
E.say('wei', '佛者……魏無憂錯怪你了。', 'Great Buddha... I wronged you.', { to: 'wuya', act: 'bow' });
E.say('wuya', '阿彌陀佛。你的眼睛沒有錯，錯的是你看見的那張臉。這句話，是洛無塵說的。', 'Amitabha. Your eyes did not deceive you; the face did. Those were Luo Wuchen’s words.', { to: 'wei' });
E.say('wei', '……洛無塵。你又對了。', '...Luo Wuchen. Right again.', { act: 'none', close: true });
E.say('wei', '你死了，還是每一次都對。這比你活著，更讓人生氣。', 'You’re dead, and you’re still right every time. That’s even more infuriating than when you were alive.', { act: 'angry', cam: 'low' });
E.say('yan', '月姑娘，多謝。', 'Miss Yue — thank you.', { to: 'yue', act: 'bow' });
E.say('yue', '不必謝我。鏡王拆穿了，他背後的人，還在。', 'Don’t thank me. The Mirror King is unmasked, but the one behind him is still there.', { to: 'yan' });
E.say('ling', '背後的人？殷九霄？', 'The one behind him? Yin Jiuxiao?', { to: 'yue' });
E.say('yue', '殷九霄也只是一顆棋子。鏡王跪的，是幽冥。', 'Yin Jiuxiao is only a piece on the board too. The Mirror King kneels to the Netherworld.', { to: 'ling', close: true });
E.say('baihe', '天劍譜在殷九霄手上，地機卷在鏡王手上……兩卷要是合在一起……', 'The Heavenly Sword Manual is in Yin Jiuxiao’s hands, the Earthly Scroll in the Mirror King’s... if the two halves come together...', { to: 'wuya', act: 'think' });
E.say('wuya', '那就是，幽冥等了二十年的那一天。', 'That will be the day the Netherworld has waited twenty years for.', { to: 'baihe', close: true });

E.act('guhong', 'point', { d: 1.4, cam: 'mid' });
E.say('yue', '……這枚蓮花玉牌？他讓你，把這個給我？', '...This lotus token? He wanted you to give it to me?', { to: 'guhong', act: 'shock' });
E.say('yan', '妳認識洛先生？', 'You knew Master Luo?', { to: 'yue', act: 'shock' });
E.say('yue', '他死前三天，來過鏡湖。他說，七天之後，會有一個不說話的人，把這個交給我。', 'Three days before he died, he came to the Mirror Lake. He said that seven days later, a man who never speaks would give me this.', { to: 'yan' });
E.say('yue', '他說：「到那時候，請妳帶他們上萬佛峰，拆穿那張臉。」', 'He said: “When that day comes, take them to the Peak, and tear that face away.”', { to: 'yan', close: true });
E.say('wei', '他死前三天，就算到了今天？', 'Three days before he died, he foresaw today?', { to: 'yue', act: 'shock' });
E.say('ling', '他算到了今天……那他有沒有算到，他自己會死？', 'He foresaw today... then did he foresee his own death?', { to: 'yue', act: 'think' });
E.say('yue', '他只說了一句：「相信我。」', 'All he said was: “Trust me.”', { to: 'ling', close: true });

// ---------------------------------------------------------------- the lotus pond at night: a little man talks to the water
E.scene('lotus', { sky: 'moon', mood: 'sad', place: { qian: [0.4, 4.6, 180] }, est: 2.5 });
E.say('qian', '洛先生……東西，我已經放好了，放在殷九霄的桌上，誰都沒發現。', 'Master Luo... I put the thing where you said — on Yin Jiuxiao’s desk. Nobody noticed.', { act: 'none', cam: 'mid' });
E.say('qian', '你說過，七天之後，你會告訴我為什麼……今天，已經是第七天了。', 'You said that after seven days you’d tell me why... today is the seventh day.', { act: 'think', close: true });
E.say('qian', '你到底，在不在啊？', 'Are you really there or not?', { act: 'shock', cam: 'low' });
E.sfx('qiburst', { at: [900.4, -0.3, 7.0], k: 0.5, col: '#d8ffd0' }); E.wait(1.6, { cam: 'wide' });
E.say('qian', '……水，在冒泡？', '...The water — is it bubbling?', { act: 'shock', close: true });

// ---------------------------------------------------------------- the Netherworld: the order
E.scene('abyss', { sky: 'abyss', mood: 'dark', place: { youming: [4.2, 0, -90], jingwang: [4.0, 0.2, 90] }, est: 2.5 });
E.act('jingwang', 'kneel', { hold: 40, d: 0.2, wait: false });
E.say('jingwang', '帝君，本王的臉，被拆穿了。', 'My Emperor. This king’s face has been torn away.', { to: 'youming', act: 'bow' });
E.say('youming', '一張臉而已。天劍譜呢？', 'One face, no more. And the Heavenly Sword Manual?', { to: 'jingwang', cam: 'low' });
E.say('jingwang', '在殷九霄手中。三道封印，也在他那裡。地機卷，在本王這裡。', 'In Yin Jiuxiao’s hands, with the three seals. The Earthly Scroll is with me.', { to: 'youming' });
E.say('youming', '把地機卷給他。', 'Give him the Earthly Scroll.', { to: 'jingwang', close: true });
E.say('jingwang', '帝君？', 'My Emperor?', { to: 'youming', act: 'shock' });
E.say('youming', '天機策只有在合一的那一刻，才能被奪走。讓他合起來，讓他翻開。', 'The Stratagem can be seized only at the moment it is made whole. Let him put it together. Let him open it.', { to: 'jingwang', act: 'point' });
E.say('youming', '等他翻開的時候——本帝，親自去取。', 'And when he opens it — I shall come and take it myself.', { close: true });
E.say('yinyang', '……哈。聽到了，全都聽到了。', '...Ha. I heard that. Every word.', { act: 'laugh', cam: 'wide' });
E.narrate('鏡中真相大白，鏡外的棋局，卻才剛剛走到最後一步。', 'The truth in the mirror is out; but outside it, the game has only now reached its last move.');
E.narrate('龍淵閣上，殷九霄將翻開天機策。他會看見什麼？', 'In the Pavilion, Yin Jiuxiao is about to open the Stratagem. What will he see?');
export default E.done();
