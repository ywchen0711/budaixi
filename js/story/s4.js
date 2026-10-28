// 《天機策》第四集　魔影重臨 / Episode 4: The Demon Returns. About ten minutes.
// On Void Peak, Baihe Zi remembers something odd about Huiming the night before the council. Ling Yunxiao comes to
// warn them — too late: Ye Wuji, remade in the Netherworld, comes down out of the dusk. He breaks the elder, breaks
// the Sword Formation of the Void, and with a new Netherworld palm puts Ling on his knees. Yin Jiuxiao arrives and the
// Demon Lord, strangely, goes. In the confusion the token of the Void School goes missing. In the Pavilion, two of
// the three seals lie in one man's hand.
import { episode } from './compose.js?v=14';
import { poemOf } from './world.js?v=14';

const E = episode({
  id: 's4', plaque: '魔影重臨',
  title: { zh: ['掌中劍・天機策', '第四集　魔影重臨', ''], en: ['THE CELESTIAL STRATAGEM', 'Episode 4: The Demon Returns', ''] },
  end: { zh: ['天機策　第四集　魔影重臨', '佛者出關　且看下回分解'], en: ['THE CELESTIAL STRATAGEM — Episode 4', 'The Buddha comes forth next'] },
  cast: ['baihe', 'elder', 'ling', 'ye', 'yin', 'jingwang', 'qian', 'luo', 'yan', 'wei', 'youming'],
});

// ---------------------------------------------------------------- the lotus pond, at dawn: the one left behind
E.open('lotus', { sky: 'dawn', mood: 'sad', place: { yan: [0.2, 0.6, 0], luo: [2.6, -2.4, -30] } });
E.narrate('凌雲霄一個人去了太虛峰。燕飛霜，被留在了蓮池邊。', 'Ling Yunxiao went to Void Peak alone. Yan Feishuang was left behind by the lotus pond.');
E.act('yan', 'stance', { d: 1.0, cam: 'mid' });
E.skirmish('yan', ['luo'], { d: 4 });
E.say('luo', '燕姑娘的刀，今天很急。', 'Miss Yan’s blades are impatient today.', { to: 'yan', act: 'whisk' });
E.say('yan', '他一個人去，萬一夜無極真的在那裡……', 'He went alone. If Ye Wuji really is there...', { to: 'luo', act: 'angry' });
E.say('luo', '他不讓妳去，是因為妳身上帶著劍譜。夜無極要的，從來不只是他。', 'He would not take you because you carry the manual. Ye Wuji never wanted only him.', { to: 'yan' });
E.say('yan', '我知道。我只是……不習慣，被人保護。', 'I know. I am only... not used to being protected.', { to: 'luo', close: true });
E.say('luo', '那就慢慢習慣。在這個江湖裡，肯保護妳的人，比要殺妳的人，少得多。', 'Then grow used to it, slowly. In this world, those who would protect you are far fewer than those who would kill you.', { to: 'yan', act: 'whisk' });

// ---------------------------------------------------------------- Void Peak: wine, and a memory
E.scene('cliff', { sky: 'dusk', mood: 'calm', place: { baihe: [-1.4, 0.6, 100], elder: [1.2, 0.2, -80] } });
E.narrate('太虛峰，道門玄宗所在。雲海之上，只有風聲和酒香。', 'Void Peak, home of the Taoist Void School. Above the sea of clouds there is only the wind, and the smell of wine.');
E.say('elder', '師弟，你又喝。三教大會上，你喝得還不夠嗎？', 'Little brother, drinking again? Didn’t you drink enough at the council?', { to: 'baihe', act: 'angry' });
E.say('baihe', '師兄，大會上那幾杯，是陪殷九霄喝的。這幾杯，才是陪自己喝的。', 'Elder brother, those cups at the council were for Yin Jiuxiao. These are for me.', { to: 'elder', act: 'laugh' });
E.say('elder', '哼。慧明那孩子死得蹊蹺，你倒是一點都不放在心上。', 'Hmph. That boy Huiming died strangely, and you don’t seem to care in the least.', { to: 'baihe' });
E.say('baihe', '放在心上，所以才要喝。師兄，你可知道，大會前一夜，慧明來找過我？', 'I care — that’s why I drink. Elder brother, did you know Huiming came to see me the night before the council?', { to: 'elder', act: 'think' });
E.say('elder', '他找你做什麼？', 'What did he want with you?', { to: 'baihe' });
E.say('baihe', '他說，想聽聽貧道對劍譜的看法。然後，他陪貧道，喝了三杯。', 'He said he wished to hear my view of the manual. And then he kept me company — for three cups.', { to: 'elder' });
E.say('elder', '佛門弟子，飲酒？', 'A Buddhist disciple — drinking wine?', { to: 'baihe', act: 'shock', close: true });
E.say('baihe', '還有更怪的。他舉杯，用的是左手。', 'There’s something stranger. He lifted his cup with his left hand.', { to: 'elder', close: true });
E.say('baihe', '慧明那孩子，從小在萬佛峰長大，貧道看著他抄經。他是右手寫字的。', 'I watched that boy copy sutras on the Peak since he was small. He wrote with his right hand.', { to: 'elder', act: 'think' });
E.say('elder', '你是說……', 'You mean...', { to: 'baihe' });
E.say('baihe', '貧道什麼都沒說。貧道只是，喝多了。', 'I mean nothing at all. I have only had too much to drink.', { to: 'elder', act: 'laugh' });
E.enter('ling', { how: 'glide', at: [-0.4, 3.2], from: [-10, 4], face: 'baihe', aura: 1.5, gong: false });
E.say('ling', '白鶴道長！晚輩冒昧前來，是有要事相告。', 'Master Baihe! Forgive my coming unannounced — I bring urgent news.', { to: 'baihe', act: 'bow' });
E.say('baihe', '凌少俠？什麼事，比喝酒還急？', 'Young Master Ling? What could be more urgent than wine?', { to: 'ling', act: 'laugh' });
E.say('ling', '夜無極沒有死。有人在太虛峰下，看見了血蓮的旗。', 'Ye Wuji is not dead. Someone saw the Blood Lotus banner below Void Peak.', { to: 'baihe' });
E.say('elder', '胡說！那魔頭墜入雲海，屍骨無存，怎麼可能——', 'Nonsense! The demon fell into the sea of clouds and left no bones — how could he —', { to: 'ling', act: 'angry' });

// ---------------------------------------------------------------- the demon comes down
E.sfx('qiburst', { at: [302, 6, 0], k: 1.6, col: '#c040ff' }); E.hit(E.t, 1.2);
E.wait(1.2, { cam: 'wide' });
E.enter('ye', { how: 'descend', at: [3.4, -0.6], from: [4, -2], face: 'ling', poem: poemOf('ye'), col: '#c040ff', k: 1.6 });
E.say('ling', '夜無極……你果然還活著。', 'Ye Wuji... so you are alive.', { to: 'ye', act: 'none' });
E.say('ye', '活著？不。本尊是死過一次，又從幽冥爬回來的人。', 'Alive? No. I am a man who died once, and crawled back up out of the Netherworld.', { to: 'ling', act: 'laugh' });
E.say('ye', '凌雲霄，這一次，本尊不殺你。本尊要你看著。', 'Ling Yunxiao. This time I will not kill you. This time I want you to watch.', { to: 'ling', close: true });
E.say('elder', '魔頭！太虛峰上，豈容你放肆！', 'Demon! On Void Peak you will not do as you please!', { to: 'ye', act: 'angry' });
E.move('elder', 2.0, 0.0, { d: 0.6, glide: true, face: 'ye', shot: false });
E.strike('ye', 'elder', { kind: 'palm', name: ['幽冥掌！', 'Netherworld Palm!'], result: 'down', col: '#c040ff', knock: 3.4, hold: 80 });
E.say('baihe', '師兄！', 'Elder brother!', { to: 'elder', act: 'shock', close: true });
E.say('baihe', '好……好一個魔頭。貧道今天，不喝了。', 'Good... a fine demon. Today I am done with wine.', { to: 'ye', act: 'angry' });
E.move('baihe', 0.6, -0.2, { d: 1.0, face: 'ye', shot: false });
E.strike('baihe', 'ye', { kind: 'array', name: ['太虛劍陣！', 'Sword Formation of the Void!'], result: 'blocked', k: 1.4 });
E.duel('baihe', 'ye', { d: 16, end: 'win:b', hold: 60 });
E.say('ye', '道門的劍陣，也不過如此。', 'So that is the Taoists’ famous formation. It is nothing.', { to: 'baihe', act: 'laugh' });
E.say('ling', '你的對手，是我。', 'Your opponent is me.', { to: 'ye', act: 'point' });
E.move('ling', 1.2, 1.4, { d: 1.0, face: 'ye', glide: true });
E.duel('ling', 'ye', { d: 26, end: 'apart', k: 1.3 });
E.say('ye', '凌雲霄，你的劍，還是這麼乾淨。乾淨得，讓本尊想吐。', 'Ling Yunxiao, your sword is as clean as ever. So clean it turns my stomach.', { to: 'ling', act: 'laugh' });
E.say('ling', '你的掌，比三個月前，多了一股死氣。', 'Your palm carries something it did not three months ago — the breath of the dead.', { to: 'ye' });
E.say('ye', '那是帝君給本尊的禮物。你也收下吧！', 'A gift from my Emperor. You may have it too!', { to: 'ling', act: 'angry' });
E.strike('ling', 'ye', { kind: 'wave', name: ['霜天一劍！', 'Frost Sky, One Sword!'], result: 'clash', colB: '#c040ff' });
E.strike('ye', 'ling', { kind: 'palm', name: ['幽冥——九掌！', 'Netherworld — Nine Palms!'], result: 'down', col: '#c040ff', power: 1.4, hold: 60 });
E.say('ling', '……咳……', '...Ugh...', { act: 'none', close: true });
E.say('ye', '別急著死。本尊說過，要你看著。', 'Don’t hurry to die. I told you — I want you to watch.', { to: 'ling', act: 'laugh' });
E.move('ye', 2.4, 1.0, { d: 1.6, face: 'ling' });
E.act('ye', 'qi', { d: 1.6, k: 1.2, col: '#c040ff', cam: 'low' });

// ---------------------------------------------------------------- the lord of the Pavilion, just in time
E.say('yin', '住手！', 'Stop!', { cam: 'wide' });
E.enter('yin', { how: 'glide', at: [-2.4, -1.6], from: [-12, -3], face: 'ye', aura: 2 });
E.say('yin', '殷九霄在此，魔頭，休得猖狂！', 'Yin Jiuxiao is here. Demon — no more of this!', { to: 'ye', act: 'point' });
E.act('ye', 'turn', { to: 'yin', d: 1.4, cam: 'close' });
E.say('ye', '……哈。哈哈哈！好，今天，就到這裡。', '...Ha. Ha ha ha! Very well. Enough for today.', { to: 'yin', act: 'laugh' });
E.exit('ye', { how: 'fade', col: '#c040ff' });
E.say('baihe', '……那魔頭，看見殷兄，就走了？', '...The demon saw Brother Yin, and simply left?', { to: 'yin', act: 'think' });
E.say('yin', '想必是忌憚儒門的威名。道長，傷得可重？', 'No doubt he fears the name of the Confucians. Master — are you badly hurt?', { to: 'baihe', act: 'bow' });
E.say('baihe', '殷兄來得正好。又剛好……晚了一步。', 'Brother Yin came just in time. And just... a moment too late.', { to: 'yin', close: true });
E.say('yin', '九霄一接到消息，就連夜趕來了。若是能早一刻……', 'I came through the night the moment I heard. If only I had been a little sooner...', { to: 'baihe', act: 'none' });
E.say('elder', '太……太虛令……師弟，太虛令不見了！', 'The... the Void token... little brother, the Void token is gone!', { to: 'baihe', act: 'shock' });
E.say('baihe', '什麼？封印劍譜的太虛令？', 'What? The Void token — the one meant to seal the manual?', { to: 'elder', act: 'shock', close: true });
E.say('yin', '一定是那魔頭趁亂搶走的。九霄立刻派人去追！', 'The demon must have snatched it in the confusion. I shall send men after him at once!', { to: 'baihe', act: 'point' });
E.narrate('沒有人看見，殷九霄的袖中，多了一樣東西。', 'No one saw that something new had found its way into Yin Jiuxiao’s sleeve.', { on: 'yin' });
E.say('ling', '……燕……燕姑娘……劍譜……', '...Miss... Miss Yan... the manual...', { act: 'none', close: true });
E.say('baihe', '別說話，少俠。你這條命，現在比劍譜要緊。', 'Don’t speak, young master. Right now your life matters more than any manual.', { to: 'ling' });
E.say('baihe', '凌少俠中的是幽冥之掌。天下能救他的，只有萬佛峰上那個老和尚。', 'Young Master Ling took a palm of the Netherworld. Under heaven, only the old monk on the Peak can save him.', { to: 'yin' });
E.say('yin', '無涯佛者閉關二十年……他肯出關嗎？', 'The Buddha Wuya has been in seclusion twenty years... will he come out?', { to: 'baihe', act: 'think' });
E.say('baihe', '為了救人，他會的。', 'To save a life, he will.', { to: 'yin', close: true });

// ---------------------------------------------------------------- the Netherworld: why the demon went
E.scene('abyss', { sky: 'abyss', mood: 'dark', place: { youming: [4.2, 0, -90], ye: [4.0, 0.4, 90] }, est: 2.5 });
E.say('youming', '你為什麼不殺凌雲霄？', 'Why did you not kill Ling Yunxiao?', { to: 'ye', cam: 'low' });
E.say('ye', '殷九霄來了。他是帝君的棋子，本尊不能，壞了帝君的棋局。', 'Yin Jiuxiao came. He is my Emperor’s piece; I could not spoil my Emperor’s game.', { to: 'youming', act: 'bow' });
E.say('youming', '很好。讓凌雲霄活著，讓他們去萬佛峰。', 'Good. Let Ling Yunxiao live. Let them go to the Peak.', { to: 'ye' });
E.say('youming', '那個老和尚出關的那一天，就是三教，自己拆散自己的那一天。', 'The day that old monk comes out of seclusion will be the day the Three Teachings tear themselves apart.', { to: 'ye', close: true });
E.say('ye', '帝君的意思是……', 'My Emperor means...', { to: 'youming', act: 'think' });
E.say('youming', '鏡王，會替本帝，戴上佛者的臉。', 'The Mirror King will put on the Buddha’s face — for me.', { to: 'ye', act: 'laugh' });

// ---------------------------------------------------------------- the lotus pond: the news reaches Luo
E.scene('lotus', { sky: 'moon', mood: 'tense', place: { luo: [0.4, -1.2, 180], yan: [-1.6, 0.4, 120] } });
E.enter('qian', { how: 'leap', at: [1.4, 2.0], from: [3, 7], face: 'luo', gong: false, weapon: false, aura: 1 });
E.say('qian', '洛先生！大事不好！太虛峰被血洗了，凌少俠中了夜無極一掌！', 'Master Luo! Terrible news! Void Peak was attacked — Master Ling took a palm from Ye Wuji!', { to: 'luo', act: 'shock' });
E.say('yan', '凌大俠他……他怎麼樣了？', 'Master Ling — how is he?', { to: 'qian', act: 'shock', close: true });
E.say('qian', '還活著！白鶴道長說，只有萬佛峰的無涯佛者救得了他。', 'Still alive! Master Baihe says only the Buddha Wuya can save him.', { to: 'yan' });
E.say('luo', '夜無極在殷九霄面前，就這樣走了？', 'And Ye Wuji simply left, the moment Yin Jiuxiao appeared?', { to: 'qian', act: 'think' });
E.say('qian', '是啊，大家都說，殷閣主好威風。', 'Yes! Everyone says how imposing the Pavilion Master was.', { to: 'luo', act: 'laugh' });
E.say('luo', '一個魔頭，怕的不是威風。他怕的，是壞了別人的事。', 'A demon does not fear an imposing man. What he fears is spoiling someone else’s plans.', { to: 'qian', close: true });
E.say('yan', '洛先生，我要去萬佛峰。', 'Master Luo, I am going to the Peak.', { to: 'luo', act: 'angry' });
E.say('luo', '我們一起去。萬佛峰上，還有一個二十年沒見過的老朋友。', 'We go together. On the Peak there is an old friend I have not seen in twenty years.', { to: 'yan', act: 'whisk' });
E.say('luo', '錢不二，替我送個消息給魏無憂：三天之後，萬佛峰見。', 'Qian Bu’er, take a message to Wei Wuyou for me: three days from now, at the Peak.', { to: 'qian', act: 'point' });
E.say('qian', '這個消息……收不收錢？', 'This message... do I get paid for it?', { to: 'luo', act: 'think' });
E.say('luo', '你自己跟他收。', 'You may collect from him yourself.', { to: 'qian', act: 'laugh' });
E.exit('qian', { how: 'leap', d: [3, 6] });

// ---------------------------------------------------------------- the bamboo: a message, for a price
E.scene('bamboo', { sky: 'moon', mood: 'calm', place: { wei: [-1.6, 0.4, 90], qian: [1.4, 0.2, -90] }, est: 2.5 });
E.say('qian', '魏大俠，洛先生有話帶給你：三天之後，萬佛峰見。', 'Master Wei, a word from Master Luo: three days from now, at the Peak.', { to: 'wei', act: 'bow' });
E.say('wei', '他又想做什麼？', 'What is he up to now?', { to: 'qian', act: 'angry' });
E.say('qian', '這個嘛……要另外收錢。', 'Ah, well... that costs extra.', { to: 'wei', act: 'fan' });
E.say('wei', '錢不二！', 'Qian Bu’er!', { to: 'qian', act: 'angry', close: true });
E.say('qian', '好好好，送你的！凌少俠在太虛峰中了夜無極一掌，要上萬佛峰找佛者救命。', 'All right, all right, it’s free! Master Ling took a palm from Ye Wuji at Void Peak and has to go to the Peak to be saved by the Buddha.', { to: 'wei', act: 'shock' });
E.say('wei', '凌雲霄輸給了夜無極？……哼，他輸了，我還怎麼贏他？', 'Ling Yunxiao lost to Ye Wuji? ...Hmph. If he’s beaten, how am I supposed to beat him?', { to: 'qian', act: 'think' });
E.say('wei', '告訴洛無塵，我會去。不是為了他，是為了我的刀。', 'Tell Luo Wuchen I’ll come. Not for him — for my blade.', { to: 'qian', act: 'point' });
E.say('qian', '那這一句……要不要收錢？', 'And that message... do I charge for it?', { to: 'wei', act: 'laugh' });
E.exit('wei', { how: 'leap', d: [-4, 1] });
E.say('qian', '……又是白跑一趟。', '...Another trip for nothing.', { close: true });

// ---------------------------------------------------------------- the Pavilion: two seals in one hand
E.scene('hall', { sky: 'moon', mood: 'dark', place: { yin: [6.4, 0, -90] }, est: 3 });
E.act('yin', 'think', { d: 1.6, cam: 'low' });
E.say('yin', '儒門的印，在這裡。道門的太虛令，也在這裡。', 'The Confucian seal — here. The Taoists’ Void token — here as well.', { act: 'fan', cam: 'mid' });
E.say('yin', '三道封印，已經有兩道，在九霄的手中了。', 'Of the three seals, two now lie in my hand.', { close: true });
E.enter('jingwang', { how: 'appear', at: [3.8, 0.8], face: 'yin', aura: 2, gong: false, weapon: false });
E.say('jingwang', '恭喜閣主。最後那一道，佛門的，就交給本王吧。', 'Congratulations, Pavilion Master. The last one, the Buddhists’, leave to this king.', { to: 'yin', act: 'bow' });
E.say('yin', '無涯那個老和尚，可不是太虛峰那兩個酒鬼。', 'That old monk Wuya is no pair of drunkards from Void Peak.', { to: 'jingwang' });
E.say('jingwang', '所以，不能搶。要讓他自己，親手交出來。', 'Which is why it must not be taken. He must be made to hand it over with his own hands.', { to: 'yin', act: 'laugh' });
E.say('yin', '你有什麼辦法？', 'And how do you propose that?', { to: 'jingwang', act: 'think' });
E.say('jingwang', '讓整個江湖，都相信他是兇手。一個兇手，還有什麼資格，守著佛門的封印？', 'Make the whole world believe he is a murderer. What right has a murderer to keep the Buddhist seal?', { to: 'yin', close: true });
E.say('yin', '你要殺誰？', 'Whom will you kill?', { to: 'jingwang', act: 'think' });
E.say('jingwang', '一個……太虛峰上，剛剛受了傷的老人。死在佛者的掌下，三教就再也沒有人，會相信那個老和尚了。', 'An old man... freshly wounded, on Void Peak. Let him die beneath the Buddha’s palm, and no one in the Three Teachings will ever trust that old monk again.', { to: 'yin', act: 'laugh' });
E.say('yin', '……哈哈。鏡王，你這張臉，真是越看越可怕。', '...Ha ha. Mirror King, the longer I look at that face, the more it frightens me.', { to: 'jingwang', act: 'laugh' });
E.say('jingwang', '閣主過獎。本王的臉，還沒有閣主的心，一半可怕。', 'The Pavilion Master flatters me. This king’s face is not half as frightening as the Pavilion Master’s heart.', { to: 'yin', act: 'bow' });
E.exit('jingwang', { how: 'fade' });
E.narrate('魔影重臨，凌雲霄命懸一線；萬佛峰上的鐘聲，二十年後，將再一次響起。', 'The demon’s shadow is back, and Ling Yunxiao’s life hangs by a thread; on the Peak, for the first time in twenty years, the bell is about to ring.');
export default E.done();
