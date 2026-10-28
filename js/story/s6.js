// 《天機策》第六集　借刀殺人 / Episode 6: A Borrowed Knife. About ten minutes.
// The Three Teachings sit in judgment on the Buddha Wuya in the Dragon Abyss Pavilion. Luo Wuchen asks one question —
// which hand? — and the case trembles; but Wuya gives up the Buddhist seal of his own will, and the third seal falls
// into Yin Jiuxiao's hand. That night the Pavilion's master and the Mirror King plan Luo's death; Qian Bu'er hears it
// all, and sneezes. Luo comes calling for tea, and walks out with him. At the lotus pond: "They want my life. Let
// them have it."
import { episode } from './compose.js?v=14';

const E = episode({
  id: 's6', plaque: '借刀殺人',
  title: { zh: ['掌中劍・天機策', '第六集　借刀殺人', ''], en: ['THE CELESTIAL STRATAGEM', 'Episode 6: A Borrowed Knife', ''] },
  end: { zh: ['天機策　第六集　借刀殺人', '蓮心小築之夜　且看下回分解'], en: ['THE CELESTIAL STRATAGEM — Episode 6', 'The night at the Lotus Heart Retreat comes next'] },
  cast: ['yin', 'wuya', 'baihe', 'wei', 'luo', 'yan', 'ling', 'jingwang', 'qian', 'guhong', 'yinyang'],
});

// ---------------------------------------------------------------- the Pavilion: the trial
E.open('hall', { sky: 'day', mood: 'tense', place: { yin: [7.2, 0, -90], wuya: [1.6, 0, 90], baihe: [0.4, -3.4, 0], wei: [2.0, -3.2, 10], luo: [0.4, 3.4, 180], yan: [-1.0, 3.6, 170], ling: [1.8, 3.4, 190] } });
E.narrate('龍淵閣。三教共審，被審的，是二十年來，江湖上最受敬重的人。', 'The Dragon Abyss Pavilion. The Three Teachings sit in judgment, and the one judged is the most honoured man the world has known in twenty years.', { wide: true });
E.say('yin', '無涯佛者。太虛長老青松子，死於大日佛印之下。魏無憂與九霄，親眼所見。', 'Buddha Wuya. Qingsong Zi, elder of the Void School, died beneath the Seal of the Great Sun. Wei Wuyou and I saw it with our own eyes.', { to: 'wuya', act: 'fan' });
E.say('yin', '佛者，可有話說？', 'Has the Buddha anything to say?', { to: 'wuya' });
E.say('wuya', '阿彌陀佛。老衲沒有殺人。老衲能說的，只有這一句。', 'Amitabha. I did not kill him. That is all I am able to say.', { to: 'yin' });
E.say('wei', '一句「沒有殺人」，就想抵一條命？', 'One “I did not kill him” — and that’s to pay for a life?', { to: 'wuya', act: 'angry' });
E.move('wei', 0.4, -1.0, { d: 0.7, glide: true, face: 'wuya', shot: false });
E.say('wei', '今天我就替青松子，討一個公道！', 'Today I will have justice for Qingsong Zi myself!', { to: 'wuya', act: 'angry', close: true });
E.move('ling', 0.8, -0.2, { d: 0.6, glide: true, face: 'wei', shot: false });
E.duel('ling', 'wei', { d: 14, end: 'apart', k: 1.1 });
E.strike('wuya', 'wei', { kind: 'palm', result: 'blocked', col: '#ffd860', power: 0.5, k: 0.6 });
E.say('wuya', '兩位少俠，在這裡流的血，不會讓死去的人，活過來。', 'Young masters, blood spilled here will not bring the dead back to life.', { to: 'wei' });
E.say('wei', '……哼。', '...Hmph.', { to: 'wuya', close: true });
E.say('luo', '殷閣主，三教共審，被告可有人代為辯白？', 'Pavilion Master — in a judgment of the Three Teachings, may another speak for the accused?', { to: 'yin', act: 'whisk' });
E.say('yin', '洛先生不屬三教……不過，九霄准了。', 'Master Luo belongs to none of the three... but very well. I allow it.', { to: 'luo', act: 'fan' });
E.move('luo', 1.0, 1.6, { d: 1.8, face: 'wei' });
E.say('luo', '魏兄。那一夜，你看見佛者出掌。那一掌，是左手，還是右手？', 'Brother Wei. That night you saw the Buddha strike. Was it his left hand, or his right?', { to: 'wei' });
E.say('wei', '……左手。我看得很清楚。', '...His left. I saw it clearly.', { to: 'luo', act: 'think' });
E.say('luo', '白鶴道長，你與無涯相識四十年。他的大日佛印，用的是哪一隻手？', 'Master Baihe, you have known Wuya forty years. With which hand does he strike the Seal of the Great Sun?', { to: 'baihe' });
E.say('baihe', '……右手。這老和尚，四十年來，從來沒有用左手出過掌。', '...His right. In forty years this old monk has never struck with his left.', { to: 'luo', act: 'shock' });
E.say('luo', '慧明舉杯，用的也是左手。佛門弟子，佛者本人，一夜之間，都換成了左撇子？', 'Huiming lifted his cup with his left hand too. Did the Buddhist disciple and the Buddha himself both turn left-handed overnight?', { to: 'yin', act: 'whisk' });
E.say('yin', '也許，佛者正是要讓人這麼想。', 'Perhaps that is exactly what the Buddha wants us to think.', { to: 'luo', close: true });
E.say('luo', '殷閣主這句話，好耳熟。', 'How familiar that sounds from the Pavilion Master’s lips.', { to: 'yin', close: true });
E.say('yin', '……洛先生何意？', '...What does Master Luo mean?', { to: 'luo', act: 'fan' });
E.say('luo', '大會之後，閣主也是這麼說燕姑娘的。每一個有破綻的地方，閣主都說，是兇手故意留的。', 'After the council, the Pavilion Master said the same of Miss Yan. Wherever there is a flaw, the Pavilion Master says the murderer left it on purpose.', { to: 'yin' });
E.say('luo', '這樣一來，破綻越多，反而越像兇手。天下還有比這更好用的道理嗎？', 'And so, the more flaws, the more guilty one looks. Is there any reasoning under heaven more convenient than that?', { to: 'yin', act: 'point' });
E.say('baihe', '哈……洛無塵這張嘴，貧道服了。', 'Ha... I give in to Luo Wuchen’s tongue.', { to: 'luo', act: 'laugh' });
E.say('yin', '洛先生能言善辯，九霄佩服。可青松道長死了，這是事實。道門，總要一個交代。', 'Master Luo argues finely, and I admire it. But Master Qingsong is dead; that is a fact. The Taoists must have an answer.', { to: 'baihe', act: 'none' });
E.say('yin', '九霄有一個兩全的辦法：真相大白之前，請佛者將佛門的封印，暫交龍淵閣保管。', 'I have a way that serves both: until the truth is known, let the Buddha leave the Buddhist seal in the Pavilion’s keeping.', { to: 'wuya', act: 'bow' });
E.say('luo', '無涯，不可。', 'Wuya — no.', { to: 'wuya', close: true });
E.say('wuya', '無塵，老衲問心無愧。一道封印，換三教不起干戈，有何不可？', 'Wuchen, my heart is clear. One seal to keep the three of us from war — why not?', { to: 'luo' });
E.say('luo', '你給的不是封印……', 'It is not a seal you would be giving...', { to: 'wuya', act: 'shock' });
E.say('wuya', '是什麼，老衲心裡明白。正因為明白，才要給。', 'I know very well what it is. It is because I know that I give it.', { to: 'luo', close: true });
E.act('wuya', 'bow', { d: 1.6, cam: 'mid' }); E.sfx('bell', { k: 0.6 });
E.say('yin', '佛者大德。九霄，代三教謝過。', 'The Buddha’s great virtue. On behalf of the three, I thank you.', { to: 'wuya', act: 'bow' });
E.say('wei', '洛無塵，左手右手，騙得過別人，騙不過我的眼睛。', 'Luo Wuchen, left hand or right — you may fool the others, but not my eyes.', { to: 'luo', act: 'angry' });
E.say('luo', '魏兄，你的眼睛沒有錯。錯的，是你看見的那個人。', 'Brother Wei, your eyes did not deceive you. The man you saw did.', { to: 'wei' });
E.narrate('佛門的封印，交了出去。三道封印，此刻，全在一個人的手中。', 'The Buddhist seal was handed over. All three seals now lay in one man’s hand.', { on: 'yin' });

// ---------------------------------------------------------------- the Pavilion at night: two knives, and a sneeze
E.scene('hall', { sky: 'moon', mood: 'dark', place: { yin: [6.4, 0, -90], qian: [-4.0, 5.6, 150] }, est: 2.5 });
E.enter('jingwang', { how: 'appear', at: [3.6, -0.8], face: 'yin', aura: 2, gong: false, weapon: false });
E.say('jingwang', '恭喜閣主，三道封印，盡入囊中。', 'Congratulations, Pavilion Master. All three seals, in your purse.', { to: 'yin', act: 'bow' });
E.say('yin', '你那一掌，用錯了手。洛無塵差一點，就拆穿了你。', 'You struck with the wrong hand. Luo Wuchen very nearly unmasked you.', { to: 'jingwang', act: 'angry' });
E.say('jingwang', '本王是故意的。', 'This king did it on purpose.', { to: 'yin', act: 'laugh' });
E.say('yin', '故意？', 'On purpose?', { to: 'jingwang', act: 'shock', close: true });
E.say('jingwang', '洛無塵越聰明，就越會替佛者辯白。他辯得越好，魏無憂，就越不信他。', 'The cleverer Luo Wuchen is, the harder he will defend the Buddha. And the better he defends him, the less Wei Wuyou trusts him.', { to: 'yin', act: 'point' });
E.say('yin', '……你這張臉後面，到底藏了幾層心？', '...How many layers of heart do you keep behind that face?', { to: 'jingwang', act: 'think' });
E.say('jingwang', '比閣主少一層。', 'One fewer than the Pavilion Master.', { to: 'yin', close: true });
E.say('yin', '劍譜，還在燕飛霜手裡。燕飛霜，在洛無塵身邊。', 'The manual is still in Yan Feishuang’s hands. And Yan Feishuang is at Luo Wuchen’s side.', { to: 'jingwang', act: 'fan' });
E.say('jingwang', '那就除掉洛無塵。三天之後，蓮心小築。本王、閣主，再加上，帝君的先鋒。', 'Then remove Luo Wuchen. Three days from now, at the Lotus Heart Retreat. This king, the Pavilion Master — and the Emperor’s vanguard.', { to: 'yin', close: true });
E.say('yin', '夜無極？……好。三個人，殺一個洛無塵，夠了。', 'Ye Wuji? ...Good. Three of us for one Luo Wuchen will be enough.', { to: 'jingwang', act: 'none' });
E.say('qian', '哈……哈……哈啾！', 'Ah... ah... achoo!', { act: 'shock', cam: 'close' });
E.act('yin', 'turn', { to: 'qian', d: 0.8 }); E.act('jingwang', 'turn', { to: 'qian', d: 0.6, cam: 'wide' });
E.say('jingwang', '有老鼠。', 'A rat.', { to: 'qian', act: 'point' });
E.move('jingwang', -2.8, 4.4, { d: 1.2, glide: true, face: 'qian' });
E.say('qian', '我、我什麼都沒聽到！我是來……來收帳的！', 'I — I didn’t hear anything! I came to... to collect a debt!', { to: 'jingwang', act: 'bow' });
E.say('jingwang', '收帳？好，本王就讓你，把命收回去。', 'A debt? Good. This king will let you collect — your life.', { to: 'qian', act: 'laugh' });
E.act('jingwang', 'qi', { d: 1.2, k: 1.0, cam: 'low' });

// ---------------------------------------------------------------- a guest, for tea
E.say('luo', '殷閣主，深夜叨擾。', 'Pavilion Master — forgive a late call.', { cam: 'wide' });
E.exit('jingwang', { how: 'fade' });
E.enter('luo', { how: 'walk', at: [1.2, 1.6], from: [-6, 2], face: 'yin', aura: 2, gong: false, weapon: false });
E.say('yin', '……洛先生？這麼晚了，先生是來喝茶的？', '...Master Luo? So late — have you come for tea?', { to: 'luo', act: 'fan' });
E.say('luo', '茶是要喝的。不過無塵先要找一個人。錢不二，你偷了我的拂塵，跑到這裡來了？', 'Tea, by all means. But first Wuchen must find someone. Qian Bu’er — you stole my whisk, and ran here?', { to: 'qian', act: 'point' });
E.say('qian', '是、是是是！小的該死！小的再也不敢了！', 'Yes — yes, yes, yes! I deserve to die! I’ll never do it again!', { to: 'luo', act: 'bow' });
E.say('luo', '家奴無禮，驚擾閣主了。', 'My servant has been rude, and troubled the Pavilion Master.', { to: 'yin', act: 'bow' });
E.say('yin', '錢不二，是先生的家奴？', 'Qian Bu’er — is Master Luo’s servant?', { to: 'luo', close: true });
E.say('luo', '從今夜開始，是。', 'From tonight, yes.', { to: 'yin', close: true });
E.say('yin', '……哈哈哈。先生請坐。', '...Ha ha ha. Please, sit.', { to: 'luo', act: 'laugh' });
E.move('yin', 4.2, 0.2, { d: 2.0, face: 'luo', shot: false, wait: false }); E.move('luo', 2.4, 0.6, { d: 2.0, face: 'yin' });
E.say('yin', '洛先生深夜來訪，是為了喝茶，還是為了救人？', 'Does Master Luo come so late for the tea, or to save a man?', { to: 'luo', act: 'fan' });
E.say('luo', '茶好，人，也好救。', 'The tea is good. And the man is easy to save.', { to: 'yin', act: 'whisk' });
E.say('yin', '先生可知道，這世上最危險的，是什麼？', 'Does Master Luo know what is the most dangerous thing in this world?', { to: 'luo' });
E.say('luo', '是一個人，以為自己最聰明的時候。', 'A man at the moment he believes himself the cleverest.', { to: 'yin' });
E.say('yin', '先生說的，是自己？', 'Is Master Luo speaking of himself?', { to: 'luo', close: true });
E.say('luo', '無塵說的，是我們兩個。', 'Wuchen is speaking of the two of us.', { to: 'yin', close: true });
E.say('yin', '三道封印，如今都在龍淵閣。先生，不擔心嗎？', 'All three seals are in the Pavilion now. Is Master Luo not worried?', { to: 'luo', act: 'fan' });
E.say('luo', '封印鎖得住的，只是一本書。鎖不住的，是想打開它的那顆心。', 'A seal can lock only a book. What it cannot lock is the heart that wants to open it.', { to: 'yin', act: 'whisk' });
E.say('yin', '那先生以為，九霄這顆心，鎖得住嗎？', 'And does Master Luo think my heart can be locked?', { to: 'luo', act: 'laugh' });
E.say('luo', '閣主的心，要等閣主自己打開那本書的時候，才知道。', 'The Pavilion Master’s heart — we shall know it when he opens that book himself.', { to: 'yin', close: true });
E.wait(1.6, { cam: 'two', on: 'yin', to: 'luo' });
E.say('yin', '……先生慢走。', '...Safe journey, Master Luo.', { to: 'luo', act: 'bow' });
E.say('luo', '多謝閣主的茶。錢不二，走了。', 'Thank you for the tea. Qian Bu’er — we’re going.', { to: 'qian', act: 'whisk' });
E.exit('luo', { how: 'walk', d: [-8, 0], wait: false }); E.exit('qian', { how: 'walk', d: [-6, -2] });
E.say('yin', '洛無塵……三天之後，九霄親自，請你喝最後一杯茶。', 'Luo Wuchen... three days from now, I shall pour you your last cup of tea myself.', { close: true, act: 'fan' });

// ---------------------------------------------------------------- the bamboo, on the way home: a test
E.scene('bamboo', { sky: 'moon', mood: 'tense', place: { luo: [-1.0, 0.4, 90], qian: [-2.0, -0.4, 90] }, est: 2 });
E.say('qian', '洛先生，剛才那個殷九霄的眼神，好像要把我吃了……', 'Master Luo, the way Yin Jiuxiao looked at me just now — like he wanted to eat me...', { to: 'luo', act: 'shock' });
E.say('luo', '他想吃的，不是你。', 'It is not you he wants to eat.', { to: 'qian', act: 'whisk' });
E.enter('jingwang', { how: 'descend', at: [2.6, 0.2], from: [3, 2], face: 'luo', aura: 2, gong: false });
E.say('jingwang', '洛無塵，本王等不了三天了。今夜，先試試你的斤兩。', 'Luo Wuchen, this king cannot wait three days. Tonight, let me take your measure.', { to: 'luo', act: 'laugh' });
E.say('luo', '鏡王親自出手，無塵不敢當。孤鴻。', 'The Mirror King himself — too great an honour for Wuchen. Gu Hong.', { to: 'jingwang', act: 'whisk' });
E.enter('guhong', { how: 'leap', at: [0.8, -0.8], from: [-3, -3], face: 'jingwang', aura: 2, gong: false });
E.duel('guhong', 'jingwang', { d: 18, end: 'apart', k: 1.2 });
E.strike('jingwang', 'guhong', { kind: 'array', name: ['萬象鏡光！', 'Mirror Light of Ten Thousand Forms!'], result: 'blocked', col: '#e0e8ff' });
E.say('jingwang', '……好劍。三天之後，本王再領教。', '...A fine sword. Three days from now, this king will learn more of it.', { to: 'guhong', act: 'bow' });
E.exit('jingwang', { how: 'fade' });
E.say('qian', '他、他走了？我們沒事了？', 'He — he’s gone? We’re all right?', { to: 'luo', act: 'shock' });
E.say('luo', '他是來看孤鴻的劍，有多快。現在他知道了，三天之後，就會帶夠了人來。', 'He came to see how fast Gu Hong’s sword is. Now he knows, and three days from now he will bring enough men.', { to: 'qian', act: 'think' });

// ---------------------------------------------------------------- the lotus pond: "let them have it"
E.scene('lotus', { sky: 'moon', mood: 'tense', place: { luo: [0.4, -1.4, 180], qian: [1.6, 1.0, 200], yan: [-1.4, 0.8, 150], ling: [-0.4, 1.8, 170], guhong: [2.8, 2.6, 220] } });
E.say('qian', '洛先生，我都聽見了！三天之後，他們要在蓮心小築……殺你！殷九霄、千面鏡王，還有夜無極！', 'Master Luo, I heard everything! Three days from now they mean to kill you here at the Retreat! Yin Jiuxiao, the Mirror King — and Ye Wuji!', { to: 'luo', act: 'shock' });
E.say('ling', '千面鏡王……殷九霄，真的和他是一夥的。', 'The Mirror King... so Yin Jiuxiao really is in league with him.', { to: 'luo', act: 'angry' });
E.say('yan', '洛先生，我們現在就走！三對一，你不能留在這裡！', 'Master Luo, we leave now! Three against one — you can’t stay here!', { to: 'luo', act: 'angry' });
E.say('luo', '不走。', 'We are not leaving.', { to: 'yan', close: true });
E.say('yan', '為什麼？', 'Why?', { to: 'luo', act: 'shock' });
E.say('luo', '他們要的，是我的命。', 'It is my life they want.', { to: 'yan' });
E.say('luo', '那就，給他們。', 'Then let them have it.', { to: 'guhong', close: true });
E.act('guhong', 'shock', { d: 1.4, cam: 'close' });
E.say('ling', '洛先生，你在說什麼？', 'Master Luo, what are you saying?', { to: 'luo', act: 'shock' });
E.say('luo', '一個人，只有在他以為贏了的時候，才會把真心拿出來。殷九霄藏得太深，不讓他贏一次，他永遠不會翻開那本書。', 'A man shows his true heart only when he thinks he has won. Yin Jiuxiao hides too deep; unless we let him win once, he will never open that book.', { to: 'ling', act: 'whisk' });
E.say('yan', '那你呢？你怎麼辦？', 'And you? What happens to you?', { to: 'luo', act: 'angry' });
E.say('luo', '無塵自有無塵的辦法。燕姑娘，三天之後，若是無塵不在了，妳打開這封信。', 'Wuchen has his own ways. Miss Yan — three days from now, if Wuchen is gone, open this letter.', { to: 'yan', act: 'point' });
E.act('yan', 'think', { d: 1.4, cam: 'close' });
E.say('luo', '孤鴻，你過來。那一夜，你守斷橋。記住，無論看見什麼，都不要回頭。', 'Gu Hong, come here. That night, you hold the broken bridge. Remember: whatever you see, do not look back.', { to: 'guhong', act: 'whisk' });
E.act('guhong', 'bow', { d: 1.6, cam: 'mid' });
E.say('qian', '那我呢？我要做什麼？', 'And me? What do I do?', { to: 'luo', act: 'shock' });
E.say('luo', '你？你要去偷一樣東西。', 'You? You are going to steal something.', { to: 'qian', act: 'laugh' });
E.say('qian', '偷？我錢不二，可是正正當當的生意人……偷什麼？', 'Steal? I, Qian Bu’er, am an honest businessman... steal what?', { to: 'luo', act: 'think' });
E.say('luo', '（附耳）……', '(whispering)...', { to: 'qian', close: true, act: 'none' });
E.say('qian', '……什麼？！這要是被發現了，我會死的！', '...What?! If they catch me, I’m dead!', { to: 'luo', act: 'shock' });
E.say('luo', '所以，一百兩。', 'Which is why: a hundred taels.', { to: 'qian', act: 'whisk' });
E.say('qian', '……成交。', '...Deal.', { to: 'luo', close: true });

// ---------------------------------------------------------------- the bamboo: the best seat in the house
E.scene('bamboo', { sky: 'moon', mood: 'dark', place: { yinyang: [0.4, 0.2, 90] }, est: 2.5 });
E.say('yinyang', '洛無塵要死了？哈哈哈，三個殺一個，這齣戲，本郎君可要買最前面的位子。', 'Luo Wuchen is going to die? Ha ha ha — three to kill one! For this show I’ll buy the best seat in the house.', { act: 'laugh', cam: 'low' });
E.say('yinyang', '不過……他那種人，會這麼乖乖地死嗎？', 'But... would a man like that die so obligingly?', { act: 'think', close: true });
E.say('yinyang', '有意思。本郎君倒要看看，這一局，到底是誰在騙誰。', 'How amusing. I really must see who, in the end, is fooling whom.', { act: 'laugh', cam: 'mid' });
E.narrate('借刀殺人，殺的是誰？借刀的人，又是誰？', 'A borrowed knife — but whose throat is it for? And whose hand borrowed it?');
E.narrate('三天之後，蓮心小築，一池白蓮，將染成紅色。', 'Three days from now, at the Lotus Heart Retreat, a pond of white lotus will turn red.');
export default E.done();
